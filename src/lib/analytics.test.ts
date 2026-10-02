import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { beforeSend, markOwner } from './analytics'

const view = (path: string) => ({ type: 'pageview' as const, url: `https://www.yarikama.com${path}` })

describe('beforeSend', () => {
  beforeEach(() => {
    const store = new Map<string, string>()
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => store.set(key, value),
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('counts visitors to the public site', () => {
    expect(beforeSend(view('/notes/some-note'))).toEqual(view('/notes/some-note'))
  })

  it('never counts admin pages', () => {
    expect(beforeSend(view('/admin'))).toBeNull()
    expect(beforeSend(view('/admin/login'))).toBeNull()
  })

  it('skips a browser that has signed in to the admin', () => {
    markOwner()
    expect(beforeSend(view('/'))).toBeNull()
  })

  it('still counts when storage is unavailable', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => {
        throw new Error('blocked')
      },
    })
    expect(beforeSend(view('/'))).toEqual(view('/'))
  })
})
