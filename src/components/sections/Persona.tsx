import { useState, useEffect, useRef } from 'react'
import Section from '../layout/Section'
import TechTable from '../ui/TechTable'
import MagazineLine from '../ui/MagazineLine'
import { techStack } from '../../data/techStack'
import { StreamingRichText } from '../ui/StreamingText'

// Define the text segments for streaming
const paragraph1 = [
  { text: 't MaiAgent, I led a GenAI team that transformed chatbots into intelligent agents—growing users from ' },
  { text: '3K to 20K (567%)', highlight: true },
  { text: ' and partners by ' },
  { text: '120%', highlight: true },
  { text: ' (CTBC Bank, MSI, HPE). We scaled our RAG system from ' },
  { text: '3M to 20M+', highlight: true },
  { text: ' text chunks while cutting LLM token costs by ' },
  { text: '67%', highlight: true },
  { text: '.' },
]

const paragraph2 = [
  { text: 'I believe production AI is about more than models. It\'s async pipelines handling ' },
  { text: '10M+ records', highlight: true },
  { text: ', WebSocket systems pushing real-time updates, and ' },
  { text: '140+ optimized APIs', highlight: true },
  { text: ' running ' },
  { text: '27.7% faster', highlight: true },
  { text: '. I contributed ' },
  { text: '14 PRs', highlight: true },
  { text: ' to LlamaIndex (15K+ stars), working on integrations with AWS Bedrock, Claude, Elasticsearch, and MCP.' },
]

const paragraph3 = [
  { text: 'My Industrial Engineering background gives me a systems perspective—I optimize workflows, not just algorithms. Now at ' },
  { text: 'Rice University', highlight: true },
  { text: ' (M.C.S., GPA ' },
  { text: '4.0', highlight: true },
  { text: '), I\'m deepening foundations in database implementation and distributed systems.' },
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
    if (isHovered) {
      let start = 0
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
  }, [isHovered])
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

          <div className="space-y-6 text-zinc-faded font-serif text-lg md:text-xl leading-relaxed">
            <div className="grid">
              <p className="col-start-1 row-start-1 invisible">
                <span className="float-left font-serif text-6xl leading-none mr-3 mt-1 text-ink">
                  A
                </span>
                {paragraph1.map((seg, i) => (
                  <span key={i} className={seg.highlight ? 'text-sage font-semibold' : ''}>
                    {seg.text}
                  </span>
                ))}
              </p>
              <p className="col-start-1 row-start-1">
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
              <p className="col-start-1 row-start-1 invisible">
                {paragraph2.map((seg, i) => (
                  <span key={i} className={seg.highlight ? 'text-sage font-semibold' : ''}>
                    {seg.text}
                  </span>
                ))}
              </p>
              <p className="col-start-1 row-start-1">
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
              <p className="col-start-1 row-start-1 invisible">
                {paragraph3.map((seg, i) => (
                  <span key={i} className={seg.highlight ? 'text-sage font-semibold' : ''}>
                    {seg.text}
                  </span>
                ))}
              </p>
              <p className="col-start-1 row-start-1">
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
                    M.C.S., Computer Science — 2025-2026
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
                    AI Capstone, Operating System, System Administration
                  </p>
                </div>
              </div>
            </div>
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
            className="mt-12 h-36 cursor-pointer"
            style={{ perspective: '1000px' }}
            onMouseEnter={() => setIsFocusFlipped(true)}
            onMouseLeave={() => setIsFocusFlipped(false)}
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
                  <span className="text-sage font-medium">Machine Learning</span> for production systems, <span className="text-sage font-medium">Deep Learning</span> architectures for sequence modeling, and <span className="text-sage font-medium">NLP</span> pipelines powering intelligent document understanding and conversational AI.
                </p>
              </div>

              {/* Back - Previous */}
              <div
                className="absolute inset-0 p-6 bg-sage text-paper"
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateX(180deg)',
                }}
              >
                <p className="font-mono text-xs text-paper/70 uppercase tracking-widest mb-3">
                  Previous Focus
                </p>
                <p className="text-sm leading-relaxed">
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
