import { useEffect, useRef, useState } from 'react'

const stories = [
  {
    text: 'Customer Obsession',
    subtext: 'Grew users from 3K to 20K in one year',
    story: 'At MaiAgent, I enhanced RAG retrieval using HyDE, Hybrid Retrieval, and adaptive chunking strategies. Transformed hardcoded chatbots into customizable tools with MCP Client integration for external automation. Designed multi-knowledge-base architecture with metadata filtering, enabling B2B clients to configure organization-specific permissions.',
  },
  {
    text: 'Build to Scale',
    subtext: 'RAG system: 3M → 20M+ text chunks',
    story: 'Architected async pipelines handling 10M+ records with WebSocket systems for real-time updates. Built infrastructure that scaled from startup to enterprise workloads, processing millions of documents while maintaining sub-second response times.',
  },
  {
    text: 'Optimize Relentlessly',
    subtext: '67% cost reduction, 140+ APIs optimized',
    story: 'Reduced LLM token costs by 67% through intelligent caching, prompt optimization, and strategic model selection. Optimized 140+ APIs with an average 27.7% performance improvement. Every millisecond saved compounds into better user experience.',
  },
]

export default function Manifesto() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [hasNudged, setHasNudged] = useState<Set<number>>(new Set())

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const containerHeight = containerRef.current.offsetHeight
      const windowHeight = window.innerHeight

      // Calculate progress: 0 when entering, 1 when leaving
      const progress = Math.max(0, Math.min(1, -rect.top / (containerHeight - windowHeight)))
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ height: `${stories.length * 100}vh` }}
    >
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {stories.map((story, index) => {
          const storyStart = index / stories.length
          const storyEnd = (index + 1) / stories.length
          const storyMid = (storyStart + storyEnd) / 2

          // Calculate opacity and transform for each card
          let opacity = 0
          let translateY = 100
          let rotateX = 45

          if (scrollProgress >= storyStart && scrollProgress < storyEnd) {
            // Active card
            const localProgress = (scrollProgress - storyStart) / (storyEnd - storyStart)

            if (localProgress < 0.5) {
              // Entering: fade in and rise up
              const enterProgress = localProgress * 2
              opacity = enterProgress
              translateY = 50 * (1 - enterProgress)
              rotateX = 20 * (1 - enterProgress)
            } else {
              // Exiting: flip away
              const exitProgress = (localProgress - 0.5) * 2
              opacity = 1 - exitProgress
              translateY = -30 * exitProgress
              rotateX = -45 * exitProgress
            }
          }

          const isHovered = hoveredCard === index
          const isActive = opacity > 0.5
          const shouldNudge = isActive && !hasNudged.has(index)

          // Trigger nudge animation when card becomes active
          if (shouldNudge) {
            setTimeout(() => {
              setHasNudged((prev) => new Set(prev).add(index))
            }, 1500)
          }

          return (
            <div
              key={index}
              className="absolute inset-0 flex items-center justify-center px-6"
              style={{
                opacity,
                transform: `perspective(1000px) translateY(${translateY}px) rotateX(${rotateX}deg)`,
                transition: 'opacity 0.1s ease-out',
                pointerEvents: isActive ? 'auto' : 'none',
              }}
            >
              <div
                className="cursor-pointer w-full max-w-5xl py-24 px-12"
                style={{ perspective: '1000px' }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div
                  className={`relative transition-transform duration-700 ${shouldNudge ? 'animate-nudge' : ''}`}
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: isHovered ? 'rotateX(180deg)' : 'rotateX(0deg)',
                  }}
                >
                  {/* Front - Title */}
                  <div
                    className="flex flex-col items-center text-center"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <h2 className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-light tracking-tight leading-none">
                      {story.text.split(' ')[0]}
                      <br />
                      <span className="italic">{story.text.split(' ').slice(1).join(' ')}</span>
                    </h2>
                    <p className="mt-8 font-mono text-sm md:text-base text-sage uppercase tracking-widest">
                      {story.subtext}
                    </p>
                  </div>

                  {/* Back - Story */}
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: 'rotateX(180deg)',
                    }}
                  >
                    <p className="font-mono text-xs text-sage uppercase tracking-widest mb-6">
                      {story.text}
                    </p>
                    <p className="font-serif text-lg md:text-xl lg:text-2xl text-zinc-faded leading-relaxed max-w-2xl">
                      {story.story}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {/* Progress indicator - full width line with rolling square */}
        <div className="absolute bottom-24 left-0 right-0 px-8">
          {/* Line (floor) */}
          <div className="h-0.5 bg-zinc-300 dark:bg-zinc-200/30 w-full relative">
            {/* Rolling square */}
            {(() => {
              const size = 70
              const rotation = scrollProgress * 360 * stories.length // One rotation per story
              const rotationRad = (rotation * Math.PI) / 180

              // Calculate the vertical offset needed to keep the lowest point on the ground
              const normalizedAngle = rotationRad % (Math.PI / 2)

              // Distance from center to lowest point varies with rotation
              const distToEdge = size / 2
              const distToCorner = (size * Math.SQRT2) / 2

              // Interpolate based on how close we are to 45° within each 90° segment
              const t = Math.abs(Math.sin(2 * normalizedAngle))
              const bottomOffset = distToEdge + t * (distToCorner - distToEdge)

              return (
                <div
                  className={`absolute transition-colors duration-300 ${
                    hoveredCard !== null ? 'bg-sage border-sage' : 'border border-sage'
                  }`}
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    left: `calc(${scrollProgress * 100}% - ${scrollProgress * size}px)`,
                    bottom: `${bottomOffset - size / 2}px`,
                    transform: `rotate(${rotation}deg)`,
                  }}
                />
              )
            })()}
          </div>
        </div>
      </div>
    </div>
  )
}
