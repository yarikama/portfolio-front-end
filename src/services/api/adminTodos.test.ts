import { afterEach, describe, expect, it, vi } from 'vitest'
import { adminTodosService, localDay } from './adminTodos'

afterEach(() => vi.unstubAllGlobals())

describe('localDay', () => {
  it('is the date in the browser’s own time zone, not UTC', () => {
    expect(localDay(new Date(2026, 0, 5, 23, 59))).toBe('2026-01-05')
    expect(localDay(new Date(2026, 9, 2, 0, 1))).toBe('2026-10-02')
  })
})

describe('adminTodosService', () => {
  it('asks for a day, and ticks with the day it is done on', async () => {
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ data: [] })))
      .mockResolvedValueOnce(new Response(JSON.stringify({ data: { id: 't1' } })))
    vi.stubGlobal('fetch', fetch)

    await adminTodosService.list('2026-10-02')
    await adminTodosService.tick('t1', true, '2026-10-02')

    expect(fetch.mock.calls[0][0]).toMatch(/\/admin\/todos\?day=2026-10-02$/)
    expect(fetch.mock.calls[1][0]).toMatch(/\/admin\/todos\/t1$/)
    expect(JSON.parse(fetch.mock.calls[1][1].body)).toEqual({ done: true, day: '2026-10-02' })
    expect(fetch.mock.calls[1][1].credentials).toBe('include')
  })
})
