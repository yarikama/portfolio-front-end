import { afterEach, describe, expect, it, vi } from 'vitest'
import { adminAskQuestionsService } from './adminAskQuestions'

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
