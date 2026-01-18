import { useEffect, useRef, useState } from 'react'

interface UseScrollRevealOptions {
  threshold?: number
  rootMargin?: string
  once?: boolean
}

export function useScrollReveal<T extends HTMLElement>({
  threshold = 0.1,
  rootMargin = '0px',
  once = true,
}: UseScrollRevealOptions = {}) {
  const ref = useRef<T>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (once) {
            observer.disconnect()
          }
        } else if (!once) {
          setIsVisible(false)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [threshold, rootMargin, once])

  return { ref, isVisible }
}

export function useScrollRevealGroup(
  count: number,
  options: UseScrollRevealOptions = {}
) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [visibleIndices, setVisibleIndices] = useState<Set<number>>(new Set())

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const children = Array.from(container.children)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = children.indexOf(entry.target as Element)
          if (index === -1) return

          setVisibleIndices((prev) => {
            const next = new Set(prev)
            if (entry.isIntersecting) {
              next.add(index)
            } else if (!options.once) {
              next.delete(index)
            }
            return next
          })
        })
      },
      {
        threshold: options.threshold ?? 0.1,
        rootMargin: options.rootMargin ?? '0px',
      }
    )

    children.forEach((child) => observer.observe(child))

    return () => observer.disconnect()
  }, [count, options.threshold, options.rootMargin, options.once])

  const isVisible = (index: number) => visibleIndices.has(index)

  return { containerRef, isVisible }
}

export default useScrollReveal
