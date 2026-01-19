import { useState } from 'react'

interface FlipTextProps {
  front: string
  back: string
  className?: string
  backClassName?: string
}

export default function FlipText({ front, back, className = '', backClassName = '' }: FlipTextProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <span
      className={`inline-block cursor-pointer ${className}`}
      style={{ perspective: '1000px' }}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <span
        className="inline-block transition-transform duration-700 ease-out"
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateX(180deg)' : 'rotateX(0deg)',
        }}
      >
        {/* Front - English */}
        <span
          className="inline-block"
          style={{
            backfaceVisibility: 'hidden',
          }}
        >
          {front}
        </span>

        {/* Back - Chinese */}
        <span
          className={`absolute left-0 top-0 inline-block ${backClassName}`}
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateX(180deg)',
            fontFamily: 'var(--font-serif-tc)',
          }}
        >
          {back}
        </span>
      </span>
    </span>
  )
}
