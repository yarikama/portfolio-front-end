import type { Turn } from '../hooks/useAsk'

// The model cites sources as [P1], [N2] or [R1], right after the sentence.
// The pattern takes the space the model tends to put before them, so the
// marker ends up against its sentence.
const MARKER = /[ \t]*\[([PNR]\d+)\]/g

// The link a marker becomes while the answer streams: the sources are not
// known until it ends.
export const CITATION_PENDING = '#ask-cite-pending'

/**
 * The answer's markers as Markdown links: numbered links to the sources
 * once the answer is complete, muted dots while it streams. Markers the API
 * did not confirm (made-up ids) are dropped.
 */
export function withCitations(turn: Turn, anchor: string): string {
  const numbers = new Map(turn.citations?.map((c, i) => [c.id, i + 1]))
  return turn.answer.replace(MARKER, (_, id: string) => {
    if (turn.status === 'streaming') return `[·](${CITATION_PENDING})`
    const n = numbers.get(id)
    return n ? `[${n}](#${anchor}-${n})` : ''
  })
}

/** The answer with its markers taken out, until Markdown has loaded. */
export function withoutCitations(answer: string): string {
  return answer.replace(MARKER, '')
}

/**
 * The question for a highlighted passage when the visitor adds none, in the
 * passage's language: the model answers in the language of the question.
 * Kana before Han, since Japanese uses both.
 */
export function explainQuestion(passage: string): string {
  if (/[\u3040-\u30ff]/.test(passage)) return 'この部分を説明してください。'
  if (/[\uac00-\ud7af]/.test(passage)) return '이 부분을 설명해 주세요.'
  if (/[\u4e00-\u9fff]/.test(passage)) return '請解釋這段內容。'
  return 'Explain this passage.'
}
