import { useEffect, useState, useRef } from 'react'

interface Point {
  x: number
  y: number
}

export default function CursorFollower() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [trail, setTrail] = useState<Point[]>([])
  const [isHovering, setIsHovering] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const newPos = { x: e.clientX, y: e.clientY }
      setPosition(newPos)
      setIsVisible(true)

      // Add point to trail
      setTrail((prev) => [...prev.slice(-4), newPos])
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
      setTrail([])
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const isClickable =
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        !!target.closest('a') ||
        !!target.closest('button') ||
        target.style.cursor === 'pointer' ||
        window.getComputedStyle(target).cursor === 'pointer'

      setIsHovering(isClickable)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseover', handleMouseOver)
    document.documentElement.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseover', handleMouseOver)
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  // Fade out trail gradually
  useEffect(() => {
    const interval = setInterval(() => {
      setTrail((prev) => prev.slice(1))
    }, 40)

    return () => clearInterval(interval)
  }, [])

  // Generate smooth curve path
  const generateSmoothPath = (points: Point[]): string => {
    if (points.length < 2) return ''

    let path = `M ${points[0].x} ${points[0].y}`

    for (let i = 1; i < points.length - 1; i++) {
      const prev = points[i - 1]
      const curr = points[i]
      const next = points[i + 1]

      // Control points for smooth curve
      const cp1x = curr.x - (next.x - prev.x) / 6
      const cp1y = curr.y - (next.y - prev.y) / 6
      const cp2x = curr.x + (next.x - prev.x) / 6
      const cp2y = curr.y + (next.y - prev.y) / 6

      if (i === 1) {
        path += ` Q ${cp1x} ${cp1y}, ${curr.x} ${curr.y}`
      } else {
        path += ` S ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`
      }
    }

    // Last point
    if (points.length > 1) {
      const last = points[points.length - 1]
      path += ` L ${last.x} ${last.y}`
    }

    return path
  }

  if (!isVisible) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-9999">
      {/* Smooth Trail */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="trailGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7fa8a3" stopOpacity="0" />
            <stop offset="100%" stopColor="#7fa8a3" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        {trail.length > 1 && (
          <path
            d={generateSmoothPath(trail)}
            fill="none"
            stroke="url(#trailGradient)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>

      {/* Main cursor - Triangle */}
      <svg
        className="absolute transition-transform duration-150 ease-out"
        style={{
          width: '20px',
          height: '24px',
          left: position.x,
          top: position.y,
          transform: `translate(-20%, -15%) rotate(${isHovering ? '90deg' : '0deg'})`,
        }}
        viewBox="0 0 20 24"
        fill="none"
      >
        <path
          d="M2 2L18 12L2 22V2Z"
          fill={isHovering ? '#7fa8a3' : 'transparent'}
          stroke="#7fa8a3"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}
