import { useEffect, useRef } from 'react'
import { useFinePointer, usePrefersReducedMotion } from '../../hooks'

interface Point {
  x: number
  y: number
  t: number
}

const TRAIL_LENGTH = 5
const TRAIL_LIFETIME_MS = 200

// Generate smooth curve path
function generateSmoothPath(points: Point[]): string {
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

  const last = points[points.length - 1]
  return `${path} L ${last.x} ${last.y}`
}

function CursorTrail() {
  const pathRef = useRef<SVGPathElement>(null)

  // Points live in a ref and the path is written directly, so the trail never re-renders
  useEffect(() => {
    let points: Point[] = []
    let frame = 0

    const draw = () => {
      const now = performance.now()
      points = points.filter((p) => now - p.t < TRAIL_LIFETIME_MS)
      pathRef.current?.setAttribute('d', generateSmoothPath(points))
      // Keep animating only while there is a trail left to fade out
      frame = points.length > 0 ? requestAnimationFrame(draw) : 0
    }

    const handleMouseMove = (e: MouseEvent) => {
      points = [...points.slice(-(TRAIL_LENGTH - 1)), { x: e.clientX, y: e.clientY, t: performance.now() }]
      if (!frame) frame = requestAnimationFrame(draw)
    }

    const handleMouseLeave = () => {
      points = []
      pathRef.current?.setAttribute('d', '')
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.documentElement.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-9999" aria-hidden="true">
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="trailGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7fa8a3" stopOpacity="0" />
            <stop offset="100%" stopColor="#7fa8a3" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        <path
          ref={pathRef}
          fill="none"
          stroke="url(#trailGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}

// A sage trail behind the system cursor, only for mouse users who allow motion
export default function CursorFollower() {
  // Both hooks run on every render: `a() && !b()` would skip the second
  // whenever the pointer is not fine, changing the hook order.
  const finePointer = useFinePointer()
  const reducedMotion = usePrefersReducedMotion()
  const enabled = finePointer && !reducedMotion
  return enabled ? <CursorTrail /> : null
}
