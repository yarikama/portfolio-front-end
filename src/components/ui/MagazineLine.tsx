import { useEffect, useRef, useState } from 'react'

interface MagazineLineProps {
  className?: string
  delay?: number
}

export default function MagazineLine({ className = '', delay = 0 }: MagazineLineProps) {
  const lineRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (lineRef.current) {
      observer.observe(lineRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={lineRef}
      className={`h-[0.5px] bg-zinc-300 dark:bg-zinc-300/30 ${className}`}
      style={{
        transform: isVisible ? 'scaleX(1)' : 'scaleX(0)',
        transformOrigin: 'left center',
        transition: `transform 800ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
    />
  )
}
