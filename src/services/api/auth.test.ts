import { afterEach, describe, expect, it, vi } from 'vitest'
import { adminFetch, authService, signInErrorMessage } from './auth'

afterEach(() => vi.unstubAllGlobals())

describe('authService', () => {
  it('signs in through the API, returning to the page asked for', () => {
    const url = new URL(authService.signInUrl('/admin/notes/42/edit'))
    expect(url.pathname).toMatch(/\/auth\/google\/login$/)
    expect(url.searchParams.get('next')).toBe('/admin/notes/42/edit')
  })

  it('reads a 401 from /auth/me as signed out', async () => {
    const fetch = vi.fn().mockResolvedValue(new Response('{}', { status: 401 }))
    vi.stubGlobal('fetch', fetch)

    expect(await authService.me()).toBeNull()
    expect(fetch.mock.calls[0][1].credentials).toBe('include')
  })

  it('asks who is signed in once, until signing out', async () => {
    const fetch = vi
      .fn()
      .mockImplementation(async () => new Response(JSON.stringify({ email: 'owner@example.com' })))
    vi.stubGlobal('fetch', fetch)

    expect(await authService.session()).toEqual({ email: 'owner@example.com' })
    expect(await authService.session()).toEqual({ email: 'owner@example.com' })
    expect(fetch).toHaveBeenCalledTimes(1)

    await authService.logout()
    expect(fetch.mock.calls[1][0]).toMatch(/\/auth\/logout$/)
    expect(await authService.session()).toBeNull()
  })
})

describe('adminFetch', () => {
  it('always sends the session cookie', async () => {
    const fetch = vi.fn().mockResolvedValue(new Response('{}'))
    vi.stubGlobal('fetch', fetch)

    await adminFetch('https://api.example/x', { method: 'DELETE', credentials: 'omit' })

    expect(fetch.mock.calls[0][1]).toMatchObject({ method: 'DELETE', credentials: 'include' })
  })
})

describe('signInErrorMessage', () => {
  it('explains what the API sent back', () => {
    expect(signInErrorMessage(null)).toBeNull()
    expect(signInErrorMessage('not_allowed')).toMatch(/not allowed/)
    expect(signInErrorMessage('something-new')).toMatch(/failed/)
  })
})
