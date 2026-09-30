import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { askQuestion } from './ask'
import { ApiRequestError } from './client'

/** A server-sent event stream delivered in these exact pieces. */
function stream(...pieces: string[]): Response {
  const encoder = new TextEncoder()
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      for (const piece of pieces) controller.enqueue(encoder.encode(piece))
      controller.close()
    },
  })
  return new Response(body, { headers: { 'Content-Type': 'text/event-stream' } })
}

const event = (name: string, data: unknown) => `event: ${name}\ndata: ${JSON.stringify(data)}\n\n`

function serve(response: Response) {
  const fetch = vi.fn().mockResolvedValue(response)
  vi.stubGlobal('fetch', fetch)
  return fetch
}

// authService keeps the admin token in localStorage, which Node lacks.
function storage(entries: Record<string, string> = {}) {
  const items = new Map(Object.entries(entries))
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => items.get(key) ?? null,
    setItem: (key: string, value: string) => items.set(key, value),
    removeItem: (key: string) => items.delete(key),
  })
}

const token = (exp: number) => `x.${btoa(JSON.stringify({ sub: 'admin', exp }))}.y`

beforeEach(() => storage())
afterEach(() => vi.unstubAllGlobals())

describe('askQuestion', () => {
  it('streams the tokens, then returns what the answer cited', async () => {
    serve(
      stream(
        event('token', { text: 'He built ' }),
        event('token', { text: 'PAPIT [P1].' }),
        event('done', { citations: [{ id: 'P1' }], truncated: false })
      )
    )
    const tokens: string[] = []

    const end = await askQuestion('What is PAPIT?', { onToken: (t) => tokens.push(t) })

    expect(tokens).toEqual(['He built ', 'PAPIT [P1].'])
    expect(end).toEqual({ citations: [{ id: 'P1' }], truncated: false })
  })

  it('puts back together events split across network chunks', async () => {
    const whole = event('token', { text: '多語言 ✓' }) + event('done', { citations: [], truncated: true })
    const bytes = new TextEncoder().encode(whole)
    // Cut inside "event:", inside 多 (bytes 28–30), and before the done event.
    const cut = [0, 3, 29, 50, bytes.length]
    const body = new ReadableStream<Uint8Array>({
      start(controller) {
        for (let i = 1; i < cut.length; i++) controller.enqueue(bytes.slice(cut[i - 1], cut[i]))
        controller.close()
      },
    })
    serve(new Response(body))
    const tokens: string[] = []

    const end = await askQuestion('Q?', { onToken: (t) => tokens.push(t) })

    expect(tokens).toEqual(['多語言 ✓'])
    expect(end.truncated).toBe(true)
  })

  it('throws the message of an error event', async () => {
    serve(stream(event('token', { text: 'Half' }), event('error', { detail: 'The answer broke off. Try again.' })))

    await expect(askQuestion('Q?', { onToken: () => {} })).rejects.toMatchObject({
      message: 'The answer broke off. Try again.',
      status: 502,
    })
  })

  it('throws when the stream ends without a done event', async () => {
    serve(stream(event('token', { text: 'Half' })))

    await expect(askQuestion('Q?', { onToken: () => {} })).rejects.toBeInstanceOf(ApiRequestError)
  })

  it('throws the API message for a refused question', async () => {
    serve(
      new Response(JSON.stringify({ detail: 'Too many questions. Try again in 12 minutes.' }), {
        status: 429,
      })
    )

    await expect(askQuestion('Q?', { onToken: () => {} })).rejects.toMatchObject({
      message: 'Too many questions. Try again in 12 minutes.',
      status: 429,
    })
  })

  it('sends a highlighted passage with the question', async () => {
    const fetch = serve(stream(event('done', { citations: [], truncated: false })))

    await askQuestion('Why?', {
      onToken: () => {},
      passage: { text: 'The KV cache.', page: '/notes/kv' },
    })

    expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({
      question: 'Why?',
      quote: 'The KV cache.',
      page: '/notes/kv',
    })
  })

  it('sends the admin token only while it is valid', async () => {
    const now = Math.floor(Date.now() / 1000)
    const headers = async () => {
      const fetch = serve(stream(event('done', { citations: [], truncated: false })))
      await askQuestion('Q?', { onToken: () => {} })
      return fetch.mock.calls[0][1].headers
    }

    expect((await headers()).Authorization).toBeUndefined()
    storage({ admin_token: token(now + 3600) })
    expect((await headers()).Authorization).toBe(`Bearer ${token(now + 3600)}`)
    storage({ admin_token: token(now - 60) })
    expect((await headers()).Authorization).toBeUndefined()
  })
})
