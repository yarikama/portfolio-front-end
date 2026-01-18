import { useEffect, useState } from 'react'
import Container from '../layout/Container'
import DataStream from '../ui/DataStream'

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="min-h-screen flex items-center relative">
      <DataStream text="GenAI Engineer / Rice University M.C.S. / 2025" position="left" />
      <DataStream text="Open Source Contributor" position="right" />

      <Container>
        <div className="py-32 md:py-40">
          <h1
            className={`
              font-serif font-light tracking-tight leading-[0.9]
              text-[clamp(4rem,12vw,10rem)]
              transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]
              ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
            `}
          >
            Henry
            <br />
            <span className="italic">Hsu</span>
          </h1>

          <div
            className={`
              mt-12 md:mt-16
              transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] delay-300
              ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
            `}
          >
            <p className="text-xl md:text-2xl text-zinc-faded leading-relaxed font-light">
              Building AI systems that ship.
            </p>

            <p className="mt-4 text-zinc-faded leading-relaxed">
              GenAI engineer turning research into production{'\u2014'}from RAG architectures
              to agentic workflows.
            </p>
          </div>

          <div
            className={`
              mt-12 flex flex-wrap gap-3
              transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] delay-500
              ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
            `}
          >
            <span className="font-mono text-[0.65rem] text-zinc-400 uppercase tracking-widest px-3 py-1 border border-zinc-200">
              Presidential Hackathon Winner
            </span>
            <span className="font-mono text-[0.65rem] text-zinc-400 uppercase tracking-widest px-3 py-1 border border-zinc-200">
              Golden Peak Award 2025
            </span>
            <span className="font-mono text-[0.65rem] text-zinc-400 uppercase tracking-widest px-3 py-1 border border-zinc-200">
              Dean's List × 2
            </span>
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
        <div className="font-mono text-[0.65rem] text-zinc-400 uppercase tracking-widest">
          Scroll to explore
        </div>
      </div>
    </section>
  )
}
