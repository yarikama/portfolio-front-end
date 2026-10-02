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

describe('the admin hint', () => {
  function storage() {
    const items = new Map<string, string>()
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => items.get(key) ?? null,
      setItem: (key: string, value: string) => items.set(key, value),
      removeItem: (key: string) => items.delete(key),
    })
  }

  // A fresh module each time: the session check is kept per page load.
  async function freshAuth() {
    vi.resetModules()
    return import('./auth')
  }

  it('is not left for a visitor', async () => {
    storage()
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{}', { status: 401 })))
    const auth = await freshAuth()

    expect(await auth.authService.session()).toBeNull()
    expect(auth.hasAdminHint()).toBe(false)
  })

  it('is left once the admin is seen signed in', async () => {
    storage()
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(JSON.stringify({ email: 'owner@example.com' }))),
    )
    const auth = await freshAuth()

    await auth.authService.session()
    expect(auth.hasAdminHint()).toBe(true)
  })

  it('reads as absent when storage is blocked', async () => {
    vi.stubGlobal('localStorage', {
      getItem: () => {
        throw new Error('blocked')
      },
    })
    const auth = await freshAuth()
    expect(auth.hasAdminHint()).toBe(false)
  })
})
