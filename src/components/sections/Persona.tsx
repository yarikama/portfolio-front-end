import { useState, useEffect, useRef } from 'react'
import Section from '../layout/Section'
import TechTable from '../ui/TechTable'
import MagazineLine from '../ui/MagazineLine'
import { techStack } from '../../data/techStack'
import { StreamingRichText } from '../ui/StreamingText'
import { usePrefersReducedMotion } from '../../hooks'

// Define the text segments for streaming
const paragraph1 = [
  { text: 't MaiAgent, I led the GenAI team that turned chatbots into AI agents—growing users from ' },
  { text: '3K to 20K', highlight: true },
  { text: ' and partners by ' },
  { text: '120%', highlight: true },
  { text: ' (CTBC Bank, MSI, HPE, iGroup). Then at ' },
  { text: 'Google', highlight: true },
  { text: ', I built the other half: integration test infrastructure from a zero baseline, and an LLM agent that triages and reproduces device failures.' },
]

const paragraph2 = [
  { text: 'I believe production AI is about more than models. It\'s async pipelines scaling from ' },
  { text: '3M to 20M+', highlight: true },
  { text: ' text chunks, WebSocket systems pushing real-time updates, and tests that catch regressions before users do. I contributed ' },
  { text: '14 PRs', highlight: true },
  { text: ' to LlamaIndex (15K+ stars), working on integrations with AWS Bedrock, Claude, Elasticsearch, and MCP.' },
]

const paragraph3 = [
  { text: 'My Industrial Engineering background gives me a systems perspective—I optimize workflows, not just algorithms. Now at ' },
  { text: 'Rice University', highlight: true },
  { text: ' (M.C.S., GPA ' },
  { text: '4.0', highlight: true },
  { text: '), I\'ve built a relational database engine from scratch in C++ and distilled LLaVA\'s attention into a ' },
  { text: '1.3M-parameter', highlight: true },
  { text: ' image token pruner.' },
]

const honors = [
  {
    title: 'Atona Case Competition Finalist',
    detail: 'National enterprise transformation competition',
    rank: 'Top 1%',
  },
  {
    title: 'AI Workshop Outstanding Award',
    detail: 'Multi-Agent RAG tutoring system, NYCU CS',
    rank: 'Top 3/50',
  },
]

export default function Persona() {
  const [isHovered, setIsHovered] = useState(false)
  const [prCount, setPrCount] = useState(0)
  const [isFocusFlipped, setIsFocusFlipped] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [p1Done, setP1Done] = useState(false)
  const [p2Done, setP2Done] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)
  const reduceMotion = usePrefersReducedMotion()

  // Intersection Observer for triggering streaming
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInView) {
          setIsInView(true)
        }
      },
      { threshold: 0.3 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [isInView])

  useEffect(() => {
    if (isHovered && reduceMotion) {
      // Jump straight to the final count instead of animating it
      setPrCount(14)
    } else if (isHovered) {
      const duration = 800
      const startTime = performance.now()

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3) // ease-out
        setPrCount(Math.round(eased * 14))

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate)
        }
      }

      animationRef.current = requestAnimationFrame(animate)
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      setPrCount(0)
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isHovered, reduceMotion])
  return (
    <Section id="about">
      <div ref={sectionRef} className="grid md:grid-cols-2 gap-16 md:gap-24">
        <div>
          <span className="font-mono text-sm text-zinc-400 uppercase tracking-widest">
            About
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-light mt-4 tracking-tight">
            The Person Behind
            <br />
            <span className="italic">the Code</span>
          </h2>

          <MagazineLine className="my-8" />

          {/* Each paragraph stacks a transparent full copy (reserves space, read by
              screen readers) under the typed-out copy (hidden from screen readers) */}
          <div className="space-y-6 text-zinc-faded font-serif text-lg md:text-xl leading-relaxed">
            <div className="grid">
              <p className="col-start-1 row-start-1 opacity-0">
                <span className="float-left font-serif text-6xl leading-none mr-3 mt-1 text-ink">
                  A
                </span>
                {paragraph1.map((seg, i) => (
                  <span key={i} className={seg.highlight ? 'text-sage font-semibold' : ''}>
                    {seg.text}
                  </span>
                ))}
              </p>
              <p className="col-start-1 row-start-1" aria-hidden="true">
                <span className="float-left font-serif text-6xl leading-none mr-3 mt-1 text-ink">
                  A
                </span>
                <StreamingRichText
                  segments={paragraph1}
                  trigger={isInView}
                  speed={12}
                  delay={200}
                  onComplete={() => setP1Done(true)}
                />
              </p>
            </div>

            <div className="grid">
              <p className="col-start-1 row-start-1 opacity-0">
                {paragraph2.map((seg, i) => (
                  <span key={i} className={seg.highlight ? 'text-sage font-semibold' : ''}>
                    {seg.text}
                  </span>
                ))}
              </p>
              <p className="col-start-1 row-start-1" aria-hidden="true">
                <StreamingRichText
                  segments={paragraph2}
                  trigger={p1Done}
                  speed={12}
                  delay={300}
                  onComplete={() => setP2Done(true)}
                />
              </p>
            </div>

            <div className="grid">
              <p className="col-start-1 row-start-1 opacity-0">
                {paragraph3.map((seg, i) => (
                  <span key={i} className={seg.highlight ? 'text-sage font-semibold' : ''}>
                    {seg.text}
                  </span>
                ))}
              </p>
              <p className="col-start-1 row-start-1" aria-hidden="true">
                <StreamingRichText
                  segments={paragraph3}
                  trigger={p2Done}
                  speed={12}
                  delay={300}
                />
              </p>
            </div>
          </div>

          <MagazineLine className="my-8" />

          <div className="space-y-4">
            <p className="font-mono text-sm text-zinc-400 uppercase tracking-widest">
              Education
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <img src="/rice-logo.png" alt="Rice University" className="w-12 h-12 object-contain" />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-ink font-medium">Rice University</p>
                    <span className="font-mono text-xs text-sage border border-sage/40 px-1.5 py-0.5">GPA 4.0</span>
                  </div>
                  <p className="text-sm text-zinc-faded">
                    M.C.S., Computer Science — 2025-2026 (Expected Dec.)
                  </p>
                  <p className="text-xs text-zinc-400 mt-1">
                    Database Implementation, Web Development, Big Data & ML
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <img src="/NYCU-logo.png" alt="NYCU" className="w-12 h-12 object-contain" />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-ink font-medium">National Yang Ming Chiao Tung University</p>
                    <span className="font-mono text-xs text-sage border border-sage/40 px-1.5 py-0.5">GPA 4.07</span>
                  </div>
                  <p className="text-sm text-zinc-faded">
                    B.S., Industrial Engineering + CS Minor — 2020-2024
                  </p>
                  <p className="text-xs text-zinc-400 mt-1">
                    CS Minor GPA 4.13 · AI Capstone, Operating System, System Administration
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <p className="font-mono text-sm text-zinc-400 uppercase tracking-widest">
              Honors
            </p>
            <ul className="space-y-3">
              {honors.map((honor) => (
                <li key={honor.title} className="flex items-baseline justify-between gap-4">
                  <div>
                    <p className="text-ink font-medium">{honor.title}</p>
                    <p className="text-xs text-zinc-400 mt-1">{honor.detail}</p>
                  </div>
                  <span className="font-mono text-xs text-sage border border-sage/40 px-1.5 py-0.5 whitespace-nowrap">
                    {honor.rank}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <span className="font-mono text-sm text-zinc-400 uppercase tracking-widest">
            Technical Proficiency
          </span>
          <h3 className="font-serif text-2xl font-light mt-4 mb-8 tracking-tight">
            Tools of the Trade
          </h3>

          <MagazineLine className="mb-8" />

          <TechTable data={techStack} />

          <div
            role="button"
            tabIndex={0}
            aria-pressed={isFocusFlipped}
            aria-describedby="previous-focus"
            className="mt-12 h-36 cursor-pointer"
            style={{ perspective: '1000px' }}
            // Hover flips for mouse users only; touch and keyboard users toggle
            onPointerEnter={(e) => e.pointerType === 'mouse' && setIsFocusFlipped(true)}
            onPointerLeave={(e) => e.pointerType === 'mouse' && setIsFocusFlipped(false)}
            onClick={() => setIsFocusFlipped((flipped) => !flipped)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setIsFocusFlipped((flipped) => !flipped)
              }
            }}
          >
            <div
              className="relative w-full h-full transition-transform duration-700"
              style={{
                transformStyle: 'preserve-3d',
                transform: isFocusFlipped ? 'rotateX(180deg)' : 'rotateX(0deg)',
              }}
            >
              {/* Front - Current */}
              <div
                className="absolute inset-0 p-6 bg-paper-dark dark:bg-zinc-200/5"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <p className="font-mono text-sm text-zinc-faded uppercase tracking-widest mb-3">
                  Current Focus
                </p>
                <p className="text-sm text-zinc-faded leading-relaxed">
                  <span className="text-sage font-medium">Agentic Developer Tooling</span> for failure triage, <span className="text-sage font-medium">Efficient Multimodal Inference</span> via token pruning, and <span className="text-sage font-medium">Database Internals</span> from storage to query optimization.
                </p>
              </div>

              {/* Back - Previous (read out through aria-describedby) */}
              <div
                aria-hidden="true"
                className="absolute inset-0 p-6 bg-sage text-paper"
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateX(180deg)',
                }}
              >
                <p className="font-mono text-xs text-paper/70 uppercase tracking-widest mb-3">
                  Previous Focus
                </p>
                <p id="previous-focus" className="text-sm leading-relaxed">
                  Building <span className="font-semibold">Production-Ready Generative AI</span> and <span className="font-semibold">RAG Systems</span>, alongside <span className="font-semibold">Data-Intensive Backend Systems</span> that scale.
                </p>
              </div>
            </div>
          </div>

          <div
            className="mt-6 p-6 border border-zinc-200 dark:border-zinc-200/20 cursor-pointer transition-colors duration-300 hover:border-sage"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <p className="font-mono text-sm text-zinc-faded uppercase tracking-widest mb-4">
              Open Source Contributions
            </p>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-mono text-xs text-ink">LlamaIndex</span>
                  <span className="font-mono text-[0.8rem] text-zinc-400">
                    {isHovered ? prCount : 14} PRs merged
                  </span>
                </div>
                <div className="h-1 bg-zinc-200 dark:bg-zinc-200/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sage rounded-full"
                    style={{
                      width: isHovered ? `${(prCount / 14) * 100}%` : '100%',
                      transition: prCount > 0 ? 'width 50ms' : 'none',
                    }}
                  />
                </div>
              </div>
              <p className="text-xs text-zinc-400 mt-2">
                AWS Bedrock, Claude, Elasticsearch, Cohere, OpenAI, MCP Client, AI Agent Workflow
              </p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}
