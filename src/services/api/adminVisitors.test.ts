import { afterEach, describe, expect, it, vi } from 'vitest'
import { adminVisitorsService, VisitorsUnavailableError } from './adminVisitors'

afterEach(() => vi.unstubAllGlobals())

describe('adminVisitorsService', () => {
  it('asks for the range with the session cookie', async () => {
    const fetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({ data: { visitors: 3 } })))
    vi.stubGlobal('fetch', fetch)

    const report = await adminVisitorsService.report(7)

    expect(report.visitors).toBe(3)
    expect(fetch.mock.calls[0][0]).toMatch(/\/admin\/visitors\?days=7$/)
    expect(fetch.mock.calls[0][1].credentials).toBe('include')
  })

  it('tells "not set up" (503) apart from a failure (502)', async () => {
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(new Response('{}', { status: 503 }))
      .mockResolvedValueOnce(new Response('{}', { status: 502 }))
    vi.stubGlobal('fetch', fetch)

    const off = await adminVisitorsService.report(7).catch((error) => error)
    const failed = await adminVisitorsService.report(7).catch((error) => error)

    expect(off).toBeInstanceOf(VisitorsUnavailableError)
    expect(off.off).toBe(true)
    expect(failed).toBeInstanceOf(VisitorsUnavailableError)
    expect(failed.off).toBe(false)
  })
})
