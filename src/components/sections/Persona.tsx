import Section from '../layout/Section'
import TechTable from '../ui/TechTable'
import MagazineLine from '../ui/MagazineLine'
import DropCap from '../ui/DropCap'
import { techStack } from '../../data/techStack'

export default function Persona() {
  return (
    <Section id="about">
      <div className="grid md:grid-cols-2 gap-16 md:gap-24">
        <div>
          <span className="font-mono text-xs text-zinc-400 uppercase tracking-widest">
            About
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-light mt-4 tracking-tight">
            The Person Behind
            <br />
            <span className="italic">the Code</span>
          </h2>

          <MagazineLine className="my-8" />

          <div className="space-y-6 text-zinc-faded">
            <DropCap>
              At MaiAgent, I led a GenAI team that transformed chatbots into intelligent
              agents{'\u2014'}growing users from 3K to 20K (567%) and partners by 120% (CTBC Bank,
              MSI, HPE). We scaled our RAG system from 3M to 20M+ text chunks while cutting
              LLM token costs by 67%.
            </DropCap>

            <p>
              I believe production AI is about more than models. It's async pipelines handling
              10M+ records, WebSocket systems pushing real-time updates, and 140+ optimized APIs
              running 27.7% faster. I contributed 14 PRs to LlamaIndex (15K+ stars), working on
              integrations with AWS Bedrock, Claude, Elasticsearch, and MCP.
            </p>

            <p>
              My Industrial Engineering background gives me a systems perspective{'\u2014'}I
              optimize workflows, not just algorithms. Now at Rice University (M.C.S., GPA 4.0),
              I'm deepening foundations in database implementation and distributed systems.
            </p>
          </div>

          <MagazineLine className="my-8" />

          <div className="space-y-4">
            <p className="font-mono text-xs text-zinc-400 uppercase tracking-widest">
              Education
            </p>
            <div className="space-y-3">
              <div>
                <p className="text-ink font-medium">Rice University</p>
                <p className="text-sm text-zinc-faded">
                  M.C.S., Computer Science (GPA: 4.0/4.0) — 2025-2026
                </p>
                <p className="text-xs text-zinc-400 mt-1">
                  Database Implementation, Web Development, Big Data & ML
                </p>
              </div>
              <div>
                <p className="text-ink font-medium">National Yang Ming Chiao Tung University</p>
                <p className="text-sm text-zinc-faded">
                  B.S., Industrial Engineering + CS Minor (GPA: 4.07/4.3) — 2020-2024
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <span className="font-mono text-xs text-zinc-400 uppercase tracking-widest">
            Technical Proficiency
          </span>
          <h3 className="font-serif text-2xl font-light mt-4 mb-8 tracking-tight">
            Tools of the Trade
          </h3>

          <MagazineLine className="mb-8" />

          <TechTable data={techStack} />

          <div className="mt-12 p-6 bg-paper-dark">
            <p className="font-mono text-xs text-zinc-faded uppercase tracking-widest mb-3">
              Current Focus
            </p>
            <p className="text-sm text-zinc-faded leading-relaxed">
              Agentic AI with MCP integration, hybrid RAG combining graph and vector approaches,
              and building developer tools that understand code semantically.
            </p>
          </div>

          <div className="mt-6 p-6 border border-zinc-200">
            <p className="font-mono text-xs text-zinc-faded uppercase tracking-widest mb-4">
              Open Source Contributions
            </p>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-mono text-xs text-ink">LlamaIndex</span>
                  <span className="font-mono text-[0.65rem] text-zinc-400">14 PRs merged</span>
                </div>
                <div className="h-1 bg-zinc-200 rounded-full overflow-hidden">
                  <div className="h-full bg-ink rounded-full" style={{ width: '100%' }} />
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
