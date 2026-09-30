import { describe, expect, it } from 'vitest'
import { webpSrcSet } from './images'

const ASSETS = 'https://assets.yarikama.com/covers/20260205/230ac736'

describe('webpSrcSet', () => {
  it('lists both WebP widths for an uploaded image', () => {
    expect(webpSrcSet(`${ASSETS}.png`)).toBe(
      `${ASSETS}.w640.webp 640w, ${ASSETS}.w1600.webp 1600w`
    )
    expect(webpSrcSet(`${ASSETS}.JPEG`)).toBe(
      `${ASSETS}.w640.webp 640w, ${ASSETS}.w1600.webp 1600w`
    )
  })

  it('has nothing for images the worker does not process', () => {
    expect(webpSrcSet(undefined)).toBeUndefined()
    expect(webpSrcSet('')).toBeUndefined()
    // Another host, a format without variants, or already a variant.
    expect(webpSrcSet('https://example.com/a.png')).toBeUndefined()
    expect(webpSrcSet(`${ASSETS}.gif`)).toBeUndefined()
    expect(webpSrcSet(`${ASSETS}.w640.webp`)).toBeUndefined()
  })
})
