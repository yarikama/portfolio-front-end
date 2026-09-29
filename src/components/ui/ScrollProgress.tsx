import { useEffect, useRef } from 'react'

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  // Scale the bar directly on scroll so the page never re-renders for it
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = scrollHeight > 0 ? window.scrollY / scrollHeight : 0
      if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`
    }
    const handleScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    update()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-[2px] bg-transparent" aria-hidden="true">
      <div
        ref={barRef}
        className="h-full bg-ink origin-left transition-transform duration-150 ease-out"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  )
}
