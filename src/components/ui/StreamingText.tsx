import { useEffect, useState, useRef, ReactNode } from 'react'

interface StreamingTextProps {
  children: string
  delay?: number
  speed?: number
  className?: string
  onComplete?: () => void
  trigger?: boolean
}

export default function StreamingText({
  children,
  delay = 0,
  speed = 20,
  className = '',
  onComplete,
  trigger = true,
}: StreamingTextProps) {
  const [displayedLength, setDisplayedLength] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const text = children

  useEffect(() => {
    if (!trigger) return

    const startTimeout = setTimeout(() => {
      setHasStarted(true)
    }, delay)

    return () => clearTimeout(startTimeout)
  }, [trigger, delay])

  useEffect(() => {
    if (!hasStarted) return

    if (displayedLength < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedLength((prev) => prev + 1)
      }, speed)

      return () => clearTimeout(timeout)
    } else if (onComplete) {
      onComplete()
    }
  }, [hasStarted, displayedLength, text.length, speed, onComplete])

  return (
    <span className={className}>
      {text.slice(0, displayedLength)}
    </span>
  )
}

// Component for streaming rich text with highlights
interface StreamingRichTextProps {
  segments: Array<{ text: string; highlight?: boolean }>
  delay?: number
  speed?: number
  className?: string
  trigger?: boolean
  onComplete?: () => void
}

export function StreamingRichText({
  segments,
  delay = 0,
  speed = 15,
  className = '',
  trigger = true,
  onComplete,
}: StreamingRichTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const totalLength = segments.reduce((acc, seg) => acc + seg.text.length, 0)

  useEffect(() => {
    if (!trigger) {
      setCurrentIndex(0)
      setHasStarted(false)
      setIsComplete(false)
      return
    }

    const startTimeout = setTimeout(() => {
      setHasStarted(true)
    }, delay)

    return () => clearTimeout(startTimeout)
  }, [trigger, delay])

  useEffect(() => {
    if (!hasStarted) return

    if (currentIndex < totalLength) {
      const timeout = setTimeout(() => {
        setCurrentIndex((prev) => prev + 1)
      }, speed)

      return () => clearTimeout(timeout)
    } else if (!isComplete) {
      setIsComplete(true)
      onComplete?.()
    }
  }, [hasStarted, currentIndex, totalLength, speed, isComplete, onComplete])

  // Calculate which segments and how much to show
  const renderSegments = () => {
    let remaining = currentIndex
    const elements: ReactNode[] = []

    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i]
      if (remaining <= 0) break

      const charsToShow = Math.min(remaining, seg.text.length)
      const displayText = seg.text.slice(0, charsToShow)
      remaining -= charsToShow

      elements.push(
        <span key={i} className={seg.highlight ? 'text-sage font-semibold' : ''}>
          {displayText}
        </span>
      )
    }

    return elements
  }

  return <span className={className}>{renderSegments()}</span>
}
