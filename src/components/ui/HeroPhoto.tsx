import { useRef, useState, useCallback } from 'react'

interface HeroPhotoProps {
  src: string
  cutoutSrc: string
  alt: string
  className?: string
}

export default function HeroPhoto({ src, cutoutSrc, alt, className = '' }: HeroPhotoProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [parallax, setParallax] = useState({ x: 0, y: 0 })

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    // Normalize to -1 to 1
    const normalX = (x - 50) / 50
    const normalY = (y - 50) / 50
    setParallax({ x: normalX, y: normalY })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setParallax({ x: 0, y: 0 })
  }, [])

  return (
    <div
      ref={containerRef}
      className={`hero-photo-container ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background layer - moves more */}
      <img
        src={src}
        alt=""
        aria-hidden="true"
        className="hero-photo-bg"
        style={{
          transform: `translate(${parallax.x * 6}px, ${parallax.y * 6}px)`,
        }}
        draggable={false}
      />

      {/* Dotted overlay with gradient */}
      <div className="hero-photo-bg-blur" aria-hidden="true" />

      {/* Foreground layer (cutout) - moves less */}
      <img
        src={cutoutSrc}
        alt={alt}
        className="hero-photo-fg"
        style={{
          transform: `translate(${parallax.x * 4}px, ${parallax.y * 4}px)`,
        }}
        draggable={false}
      />

    </div>
  )
}
