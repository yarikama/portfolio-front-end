import { afterEach, describe, expect, it, vi } from 'vitest'
import { adminContactService, MESSAGES_CHANGED, replyLink } from './adminContact'

const page = { data: [], pagination: { total: 3, limit: 1, offset: 0, hasMore: true } }

function serve(body: unknown = page, status = 200) {
  const fetch = vi.fn().mockImplementation(async () =>
    status === 204 ? new Response(null, { status }) : new Response(JSON.stringify(body), { status }),
  )
  vi.stubGlobal('fetch', fetch)
  return fetch
}

afterEach(() => vi.unstubAllGlobals())

describe('replyLink', () => {
  it('answers the sender, quoting the subject once', () => {
    expect(replyLink({ email: 'a.b+c@example.com', subject: 'Job & chat?' })).toBe(
      'mailto:a.b%2Bc%40example.com?subject=Re%3A%20Job%20%26%20chat%3F',
    )
    expect(replyLink({ email: 'a@example.com', subject: 'RE: hi' })).toBe(
      'mailto:a%40example.com?subject=RE%3A%20hi',
    )
  })
})

describe('adminContactService', () => {
  it('counts the unread from one small page, with the session cookie', async () => {
    const fetch = serve()

    expect(await adminContactService.unreadCount()).toBe(3)

    const url = new URL(fetch.mock.calls[0][0])
    expect(url.pathname).toMatch(/\/admin\/contact$/)
    expect(Object.fromEntries(url.searchParams)).toEqual({ offset: '0', limit: '1', read: 'false' })
    expect(fetch.mock.calls[0][1].credentials).toBe('include')
  })

  it('tells the nav when a message changes', async () => {
    serve({ data: { id: '1' } })
    const heard = vi.fn()
    const events = new EventTarget()
    vi.stubGlobal('window', Object.assign(events, { location: { href: '' } }))
    events.addEventListener(MESSAGES_CHANGED, heard)

    await adminContactService.update('1', { read: true })

    expect(heard).toHaveBeenCalledTimes(1)
  })
})
