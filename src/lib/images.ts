// Uploaded images live here. The backend's image worker stores WebP
// variants next to each JPEG, PNG or WebP original, e.g.
// covers/20260205/230ac736.png -> 230ac736.w640.webp and .w1600.webp.
const ASSETS = 'https://assets.yarikama.com/'
const PROCESSABLE = /\.(jpe?g|png|webp)$/i
const VARIANT = /\.w\d+\.webp$/
const WIDTHS = [640, 1600]

/** The WebP variants as a srcset, or undefined when there are none. */
export function webpSrcSet(src: string | undefined): string | undefined {
  if (!src || !src.startsWith(ASSETS) || !PROCESSABLE.test(src) || VARIANT.test(src)) {
    return undefined
  }
  const stem = src.replace(/\.[^.]+$/, '')
  return WIDTHS.map((width) => `${stem}.w${width}.webp ${width}w`).join(', ')
}
