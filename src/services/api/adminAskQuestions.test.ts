import { afterEach, describe, expect, it, vi } from 'vitest'
import { adminAskQuestionsService, QUESTIONS_SEEN } from './adminAskQuestions'

const page = { data: [], pagination: { total: 0, limit: 50, offset: 0, hasMore: false } }

function serve() {
  const fetch = vi.fn().mockResolvedValue(new Response(JSON.stringify(page)))
  vi.stubGlobal('fetch', fetch)
  return fetch
}

afterEach(() => vi.unstubAllGlobals())

describe('adminAskQuestionsService.list', () => {
  it('sends only the filters that are on', async () => {
    const fetch = serve()

    await adminAskQuestionsService.list({ who: 'visitors', uncited: true, passage: false, rating: 'none' }, 50)

    const url = new URL(fetch.mock.calls[0][0])
    expect(url.pathname).toMatch(/\/admin\/ask\/questions$/)
    expect(Object.fromEntries(url.searchParams)).toEqual({
      who: 'visitors',
      offset: '50',
      limit: '50',
      uncited: 'true',
      rating: 'none',
    })
  })
})

describe('adminAskQuestionsService.rate', () => {
  it('sends null to clear a rating', async () => {
    const fetch = serve()
    await adminAskQuestionsService.rate('abc', null)
    expect(fetch.mock.calls[0][1]).toMatchObject({ method: 'PATCH', body: '{"rating":null}' })
  })
})

describe('adminAskQuestionsService visits', () => {
  it('counts what is new, and records a visit once', async () => {
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ data: { count: 4, since: null } })))
      .mockResolvedValueOnce(new Response(JSON.stringify({ data: { previous: '2026-10-01T00:00:00Z' } })))
    vi.stubGlobal('fetch', fetch)
    const seen = vi.fn()
    vi.stubGlobal('window', Object.assign(new EventTarget(), { location: { href: '' } }))
    window.addEventListener(QUESTIONS_SEEN, seen)

    expect(await adminAskQuestionsService.newCount()).toBe(4)
    expect(await adminAskQuestionsService.markSeen()).toBe('2026-10-01T00:00:00Z')

    expect(fetch.mock.calls[0][0]).toMatch(/\/admin\/ask\/questions\/new$/)
    expect(fetch.mock.calls[1][0]).toMatch(/\/admin\/ask\/questions\/seen$/)
    expect(fetch.mock.calls[1][1]).toMatchObject({ method: 'POST', credentials: 'include' })
    expect(seen).toHaveBeenCalledTimes(1)
  })
})
