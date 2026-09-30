import { describe, expect, it } from 'vitest'
import type { Turn } from '../hooks/useAsk'
import { CITATION_PENDING, explainQuestion, withCitations, withoutCitations } from './ask'

function turn(answer: string, change: Partial<Turn> = {}): Turn {
  return { id: 0, question: 'Q?', answer, citations: null, status: 'done', ...change }
}

const citation = (id: string) => ({ id, kind: 'project' as const, title: id, url: null })

describe('withCitations', () => {
  it('numbers sources in the order the API lists them, against the sentence', () => {
    const done = turn('He built PAPIT [P6]. And more [R1].', {
      citations: [citation('R1'), citation('P6')],
    })
    expect(withCitations(done, 'a')).toBe('He built PAPIT[2](#a-2). And more[1](#a-1).')
  })

  it('drops markers the API did not confirm', () => {
    const done = turn('Real [P1], made up [P9].', { citations: [citation('P1')] })
    expect(withCitations(done, 'a')).toBe('Real[1](#a-1), made up.')
  })

  it('shows every marker as a pending dot while streaming', () => {
    const streaming = turn('So far [P1] and [N2]', { status: 'streaming' })
    expect(withCitations(streaming, 'a')).toBe(
      `So far[·](${CITATION_PENDING}) and[·](${CITATION_PENDING})`
    )
  })

  it('leaves other brackets alone', () => {
    const done = turn('A list [1] and a link [x](y).', { citations: [] })
    expect(withCitations(done, 'a')).toBe('A list [1] and a link [x](y).')
  })
})

describe('withoutCitations', () => {
  it('takes the markers and their leading space out', () => {
    expect(withoutCitations('One [P1]. Two\t[R1].')).toBe('One. Two.')
  })
})

describe('explainQuestion', () => {
  it('asks in the language of the passage', () => {
    expect(explainQuestion('The KV cache is the bottleneck.')).toBe('Explain this passage.')
    expect(explainQuestion('這段在說什麼')).toBe('請解釋這段內容。')
    expect(explainQuestion('헨리는 오픈소스')).toBe('이 부분을 설명해 주세요.')
  })

  it('reads kanji with kana as Japanese, not Chinese', () => {
    expect(explainQuestion('直交行列は回転を表す')).toBe('この部分を説明してください。')
  })
})
