import { useEffect, useState } from 'react'
import { usePrefersReducedMotion } from '../../hooks'

// An ASCII cup of coffee with steam rising from it. Each wisp sways a
// column left and right as it climbs, and fades toward the top; the frames
// are worked out, not drawn, so the steam never quite repeats in step.

const WIDTH = 24
// Each wisp: the column it rises from, over the coffee, and how far along
// its sway it starts, so no two move in step.
const WISPS = [
  { column: 8, offset: 0 },
  { column: 12, offset: 2 },
  { column: 16, offset: 5 },
]
const STEAM_ROWS = 5
// A slow S: drift right, hold, drift back left, hold.
const SWAY = [0, 1, 1, 0, -1, -1]
// Faint at the top, where the steam thins out.
const STEAM_OPACITY = [0.15, 0.3, 0.5, 0.7, 0.85]
const FRAME_MS = 480

const CUP = 'text-[#8b5e3c] dark:text-[#c9a27e]'
const COFFEE = 'text-[#5c3a21] dark:text-[#a47551]'

function steamRow(row: number, frame: number): string {
  const cells = Array<string>(WIDTH).fill(' ')
  WISPS.forEach(({ column, offset }, wisp) => {
    // Rows count down from the top: the phase climbs as frames go by.
    const phase = (STEAM_ROWS - row + frame + offset) % SWAY.length
    // Now and then a puff is missing, as steam breaks up.
    if ((row * 7 + frame * 3 + wisp * 5) % 11 === 0) return
    // The bracket leans the way the wisp is drifting.
    const next = SWAY[(phase + 1) % SWAY.length]
    cells[column + SWAY[phase]] = next >= SWAY[phase] ? ')' : '('
  })
  return cells.join('')
}

type Segment = [text: string, className: string]

// The cup, line by line, in coloured pieces.
const BODY: Segment[][] = [
  [['    .---------------.', CUP]],
  [['    (', CUP], [' ~ ~ ~ ~ ~ ~ ~ ', COFFEE], [')', CUP]],
  [["    |`-------------'|__", CUP]],
  [['    |               |  \\', CUP]],
  [['    |               |  |', CUP]],
  [['    |               |__/', CUP]],
  [['     \\             /', CUP]],
  [["      `-----------'", CUP]],
  [['  (___________________)', CUP]],
]

export default function CoffeeCup({ className = '' }: { className?: string }) {
  const still = usePrefersReducedMotion()
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    if (still) return
    const timer = window.setInterval(() => setFrame((f) => f + 1), FRAME_MS)
    return () => window.clearInterval(timer)
  }, [still])

  return (
    <pre
      role="img"
      aria-label="A cup of coffee, steaming"
      className={`font-mono leading-[1.15] select-none ${className}`}
    >
      {Array.from({ length: STEAM_ROWS }, (_, row) => (
        <span
          key={`steam-${row}`}
          className="block text-zinc-400 transition-opacity duration-500"
          style={{ opacity: STEAM_OPACITY[row] }}
        >
          {steamRow(row, frame)}
        </span>
      ))}
      {BODY.map((line, i) => (
        <span key={`cup-${i}`} className="block">
          {line.map(([text, color], j) => (
            <span key={j} className={color}>
              {text}
            </span>
          ))}
        </span>
      ))}
    </pre>
  )
}
