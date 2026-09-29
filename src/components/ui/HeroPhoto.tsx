import { useRef } from 'react'
import { useFinePointer, usePrefersReducedMotion } from '../../hooks'

interface HeroPhotoProps {
  src: string
  cutoutSrc: string
  alt: string
  width: number
  height: number
  className?: string
}

export default function HeroPhoto({
  src,
  cutoutSrc,
  alt,
  width,
  height,
  className = '',
}: HeroPhotoProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLImageElement>(null)
  const fgRef = useRef<HTMLImageElement>(null)
  const parallaxEnabled = useFinePointer() && !usePrefersReducedMotion()

  // Write transforms straight to the DOM so mouse movement never re-renders
  const setParallax = (x: number, y: number) => {
    if (bgRef.current) bgRef.current.style.transform = `translate(${x * 6}px, ${y * 6}px)`
    if (fgRef.current) fgRef.current.style.transform = `translate(${x * 4}px, ${y * 4}px)`
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    // Normalize to -1 to 1
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1
    setParallax(x, y)
  }

  return (
    <div
      ref={containerRef}
      className={`hero-photo-container ${className}`}
      onMouseMove={parallaxEnabled ? handleMouseMove : undefined}
      onMouseLeave={parallaxEnabled ? () => setParallax(0, 0) : undefined}
    >
      {/* Background layer - moves more */}
      <img
        ref={bgRef}
        src={src}
        alt=""
        aria-hidden="true"
        width={width}
        height={height}
        fetchPriority="high"
        className="hero-photo-bg"
        draggable={false}
      />

      {/* Dotted overlay with gradient */}
      <div className="hero-photo-bg-blur" aria-hidden="true" />

      {/* Foreground layer (cutout) - moves less */}
      <img
        ref={fgRef}
        src={cutoutSrc}
        alt={alt}
        width={width}
        height={height}
        className="hero-photo-fg"
        draggable={false}
      />
    </div>
  )
}
