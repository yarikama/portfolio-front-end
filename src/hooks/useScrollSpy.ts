import { useEffect, useState } from 'react'

interface UseScrollSpyOptions {
  sectionIds: string[]
  offset?: number
  rootMargin?: string
}

export function useScrollSpy({
  sectionIds,
  offset = 0,
  rootMargin = '-20% 0px -80% 0px',
}: UseScrollSpyOptions) {
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin }
    )

    sectionIds.forEach((id) => {
      const element = document.getElementById(id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [sectionIds, rootMargin])

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY < 100) {
        setActiveId(null)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return activeId
}

export function useScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollTop = window.scrollY
      const newProgress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0
      setProgress(newProgress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return progress
}

export default useScrollSpy
