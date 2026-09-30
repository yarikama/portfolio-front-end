import { Fragment, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUp, Loader2, Square } from 'lucide-react'
import Section from '../layout/Section'
import MagazineLine from '../ui/MagazineLine'
import { useAsk } from '../../hooks'
import type { Turn } from '../../hooks'
import type { Citation } from '../../services/api'

const MAX_QUESTION = 500

const SUGGESTIONS = [
  'What did Henry build at Google?',
  'What is PAPIT?',
  '他做過哪些 LLM 安全的研究？',
]

const MARKER = /\[([PNR]\d+)\]/g

/**
 * The answer text with its [P1]-style markers turned into numbered links to
 * the sources. While streaming the sources are not known yet, so markers
 * show muted; afterwards markers the API did not confirm are dropped.
 */
function AnswerText({ turn }: { turn: Turn }) {
  const numbers = new Map(turn.citations?.map((c, i) => [c.id, i + 1]))
  const parts = turn.answer.split(MARKER)
  return (
    <p className="font-serif text-lg leading-relaxed whitespace-pre-wrap">
      {parts.map((part, i) => {
        // A marker sits right after its sentence, without the space the
        // model tends to put before it.
        if (i % 2 === 0) {
          const text = i + 1 < parts.length ? part.replace(/[ \t]+$/, '') : part
          return <Fragment key={i}>{text}</Fragment>
        }
        if (turn.status === 'streaming') {
          return (
            <sup key={i} className="font-mono text-[0.6em] text-zinc-400 ml-0.5">
              ·
            </sup>
          )
        }
        const n = numbers.get(part)
        if (!n) return null
        return (
          <sup key={i} className="ml-0.5">
            <a
              href={`#ask-source-${turn.id}-${n}`}
              className="font-mono text-[0.6em] text-sage hover:underline"
            >
              [{n}]
            </a>
          </sup>
        )
      })}
      {turn.status === 'streaming' && (
        <span className="inline-block w-2 h-5 ml-0.5 align-text-bottom bg-sage animate-pulse" />
      )}
    </p>
  )
}

function SourceLink({ citation }: { citation: Citation }) {
  const href = citation.url
  const label = (
    <>
      <span className="font-mono text-xs uppercase tracking-widest text-zinc-400 mr-2">
        {citation.kind}
      </span>
      {citation.title}
    </>
  )
  if (!href) return <span>{label}</span>
  // Notes are pages in this app; projects and the resume PDF open in a new tab.
  if (href.startsWith('/') && !href.endsWith('.pdf')) {
    return (
      <Link to={href} className="hover:text-sage transition-colors">
        {label}
      </Link>
    )
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-sage transition-colors"
    >
      {label}
    </a>
  )
}

function TurnView({ turn }: { turn: Turn }) {
  const waiting = turn.status === 'streaming' && !turn.answer
  return (
    <div className="py-5">
      <p className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-sage/10 px-4 py-2 mb-4 text-zinc-faded">
        {turn.question}
      </p>

      {waiting && (
        <p className="flex items-center gap-2 text-zinc-400 text-sm">
          <Loader2 className="w-4 h-4 animate-spin" /> Thinking…
        </p>
      )}
      {turn.answer && <AnswerText turn={turn} />}
      {turn.status === 'error' && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{turn.error}</p>
      )}

      {turn.citations && turn.citations.length > 0 && (
        <ol className="mt-4 space-y-2 text-sm">
          {turn.citations.map((citation, i) => (
            <li key={citation.id} id={`ask-source-${turn.id}-${i + 1}`} className="flex gap-3">
              <span className="font-mono text-sage">[{i + 1}]</span>
              <SourceLink citation={citation} />
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

export default function Ask() {
  const { turns, ask, stop, isStreaming } = useAsk()
  const [question, setQuestion] = useState('')
  const log = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLTextAreaElement>(null)
  // Follow the answer as it streams, unless the visitor scrolled up to read.
  const following = useRef(true)

  useEffect(() => {
    const el = log.current
    if (el && following.current) el.scrollTop = el.scrollHeight
  }, [turns])

  // One line to start, growing with the question up to about five lines.
  useEffect(() => {
    const el = input.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }, [question])

  const handleScroll = () => {
    const el = log.current
    if (el) following.current = el.scrollHeight - el.scrollTop - el.clientHeight < 40
  }

  const submit = (text: string) => {
    const q = text.trim()
    if (!q || isStreaming) return
    setQuestion('')
    following.current = true
    ask(q)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter sends; Shift+Enter is a new line. While an input method is
    // composing (Chinese, Japanese), Enter picks a candidate instead.
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      submit(question)
    }
  }

  return (
    <Section id="ask" narrow>
      <div className="mb-12">
        <span className="font-mono text-sm text-zinc-400 uppercase tracking-widest">Ask</span>
        <h2 className="font-serif text-4xl md:text-5xl font-light mt-4 tracking-tight">
          Ask About
          <br />
          <span className="italic">My Work</span>
        </h2>
        <p className="mt-4 text-zinc-faded max-w-2xl">
          A small language model on my home server answers from the projects and notes on this
          site and my resume, with sources. It can be wrong, so check the links. Ask in any
          language.
        </p>
      </div>

      <MagazineLine className="mb-8" />

      <div className="flex flex-col h-[min(70vh,36rem)] rounded-3xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
        <div
          ref={log}
          onScroll={handleScroll}
          aria-live="polite"
          // The page stays put when the conversation is scrolled to its end.
          className="flex-1 overflow-y-auto overscroll-contain px-5 md:px-8"
        >
          {turns.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center gap-4 text-center">
              <p className="font-serif text-xl italic text-zinc-faded">Try asking</p>
              <div className="flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => submit(s)}
                    className="rounded-full font-mono text-xs text-zinc-400 hover:text-sage border border-zinc-200 dark:border-zinc-700 hover:border-sage px-4 py-2 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            turns.map((turn) => <TurnView key={turn.id} turn={turn} />)
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            submit(question)
          }}
          className="border-t border-zinc-200 dark:border-zinc-700 p-3"
        >
          <div className="flex items-end gap-2 rounded-2xl border border-zinc-200 dark:border-zinc-700 focus-within:border-ink dark:focus-within:border-zinc-400 transition-colors duration-300 pl-4 pr-2 py-2">
            <label htmlFor="ask-question" className="sr-only">
              Your question
            </label>
            <textarea
              id="ask-question"
              ref={input}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={MAX_QUESTION}
              rows={1}
              placeholder="Ask about my work…"
              // The border around it shows focus, so the site-wide ring
              // would draw a second box inside it.
              className="flex-1 self-center resize-none bg-transparent font-serif text-lg focus-visible:outline-none!"
            />
            {isStreaming ? (
              <button
                type="button"
                onClick={stop}
                aria-label="Stop the answer"
                className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center border border-zinc-300 dark:border-zinc-600 hover:border-ink dark:hover:border-zinc-400 transition-colors"
              >
                <Square className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!question.trim()}
                aria-label="Ask"
                className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center bg-sage text-paper disabled:opacity-40 transition-opacity"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            )}
          </div>
          {question.length > MAX_QUESTION - 100 && (
            <p className="mt-1 pr-2 text-right font-mono text-xs text-zinc-400">
              {question.length}/{MAX_QUESTION}
            </p>
          )}
        </form>
      </div>
    </Section>
  )
}
