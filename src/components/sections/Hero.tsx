import { useEffect, useState } from 'react'
import Container from '../layout/Container'
import DataStream from '../ui/DataStream'
import HeroPhoto from '../ui/HeroPhoto'
import FlipText from '../ui/FlipText'
import GeometricDecor from '../ui/GeometricDecor'

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight
      const scrollY = window.scrollY
      const progress = Math.min(scrollY / heroHeight, 1)
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className="min-h-screen flex items-center relative overflow-hidden">
      <GeometricDecor />
      <DataStream text="GenAI Engineer / Rice University M.C.S. / 2025" position="left" />
      <DataStream text="Open Source Contributor" position="right" />


      <Container>
        <div className="py-32 md:py-40 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text content */}
          <div>
            <h1
              className={`
                font-serif font-light tracking-tight leading-[0.9]
                text-[clamp(4rem,12vw,10rem)] lg:text-[clamp(3rem,8vw,7rem)]
                transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
              `}
            >
              <FlipText front="Henry" back="恒睿" />
              <br />
              <FlipText front="Hsu" back="許" className="italic" backClassName="not-italic" />
            </h1>

            <div
              className={`
                mt-12 md:mt-16
                transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] delay-300
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
              `}
            >
              <p className="text-2xl md:text-3xl text-zinc-faded leading-relaxed font-light">
                Building AI systems that ship.
              </p>

              <p className="mt-4 text-lg text-zinc-faded leading-relaxed">
                GenAI engineer turning research into production{'\u2014'}from RAG architectures
                to agentic workflows.
              </p>
            </div>

            <div
              className={`
                mt-12 flex flex-wrap gap-4
                transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] delay-500
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
              `}
            >
              <a
                href="https://presidential-hackathon.taiwan.gov.tw/teams.html"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-stretch border border-sage/40 hover:border-sage transition-colors duration-300"
              >
                <span className="font-mono text-sm text-sage uppercase tracking-widest px-4 py-2">
                  2024 Presidential Hackathon Winner
                </span>
                <span className="flex items-center justify-center overflow-hidden w-0 group-hover:w-10 group-hover:px-3 bg-sage text-paper transition-all duration-300">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 13L13 1M13 1H5M13 1V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </a>
              <a
                href="https://money.udn.com/money/story/5635/8729582"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-stretch border border-zinc-200 dark:border-zinc-200/30 hover:border-sage transition-colors duration-300"
              >
                <span className="font-mono text-sm text-zinc-400 group-hover:text-sage uppercase tracking-widest px-4 py-2 transition-colors duration-300">
                  Golden Peak Award 2025
                </span>
                <span className="flex items-center justify-center overflow-hidden w-0 group-hover:w-10 group-hover:px-3 bg-sage text-paper transition-all duration-300">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 13L13 1M13 1H5M13 1V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </a>
              <span className="font-mono text-sm text-zinc-400 uppercase tracking-widest px-4 py-2 border border-zinc-200 dark:border-zinc-200/30">
                Dean's List × 2
              </span>
            </div>
          </div>

          {/* Right: Interactive photo */}
          <div
            className={`
              lg:justify-self-end
              transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] delay-200
              ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
            `}
          >
            <HeroPhoto
              src="/hero-photo.jpg"
              cutoutSrc="/hero-cutout.png"
              alt="Henry Hsu"
              className="hero-photo-blob w-full max-w-[400px] lg:max-w-[480px] mx-auto"
            />
          </div>
        </div>
      </Container>

      <div
        className={`
          absolute bottom-12 left-1/2 -translate-x-1/2
          transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] delay-700
          ${isVisible ? 'opacity-100' : 'opacity-0'}
        `}
      >
        <div className="flex items-center gap-4">
          <div className="flex items-end gap-1">
            {[0, 1, 2, 3, 4].map((i) => {
              const waveCenter = scrollProgress * 9 // 0 到 9
              const distance = Math.abs(i - waveCenter)
              const waveHeight = Math.max(0, 1 - distance * 0.4)
              const height = 8 + waveHeight * 14

              return (
                <div
                  key={i}
                  className="w-1 bg-sage transition-all duration-100"
                  style={{ height: `${height}px` }}
                />
              )
            })}
          </div>
          <div className="font-mono text-sm text-zinc-400 uppercase tracking-widest">
            Scroll to explore
          </div>
          <div className="flex items-end gap-1">
            {[5, 6, 7, 8, 9].map((i) => {
              const waveCenter = scrollProgress * 9 // 0 到 9
              const distance = Math.abs(i - waveCenter)
              const waveHeight = Math.max(0, 1 - distance * 0.4)
              const height = 8 + waveHeight * 14

              return (
                <div
                  key={i}
                  className="w-1 bg-sage transition-all duration-100"
                  style={{ height: `${height}px` }}
                />
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
