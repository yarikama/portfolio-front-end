import { useState, type ImgHTMLAttributes } from 'react'
import { webpSrcSet } from '../../lib/images'

type Props = ImgHTMLAttributes<HTMLImageElement> & { src?: string }

/**
 * An <img> that lets the browser pick a WebP variant sized for the screen.
 * Right after an upload the variants may not exist yet (the worker makes
 * them in a second or so): if the chosen one fails, fall back to the
 * original.
 */
export default function ResponsiveImage({ src, sizes, onError, ...props }: Props) {
  const [failedFor, setFailedFor] = useState<string | undefined>()
  const srcSet = failedFor === src ? undefined : webpSrcSet(src)

  return (
    <img
      loading="lazy"
      decoding="async"
      {...props}
      src={src}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      onError={(event) => {
        if (srcSet) setFailedFor(src)
        onError?.(event)
      }}
    />
  )
}
