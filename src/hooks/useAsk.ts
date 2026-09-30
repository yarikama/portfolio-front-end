import { useCallback, useEffect, useRef, useState } from 'react'
import { askQuestion, ApiRequestError } from '../services/api'
import type { Citation } from '../services/api'

export interface Turn {
  id: number
  question: string
  answer: string
  // Known once the answer is complete.
  citations: Citation[] | null
  status: 'streaming' | 'done' | 'error'
  error?: string
}

/**
 * Questions and their streamed answers. Each question is answered on its
 * own (the model does not see earlier turns); the list is only what this
 * visitor asked so far.
 */
export function useAsk() {
  const [turns, setTurns] = useState<Turn[]>([])
  const controller = useRef<AbortController | null>(null)
  const nextId = useRef(0)

  const update = (id: number, change: (turn: Turn) => Partial<Turn>) =>
    setTurns((all) => all.map((t) => (t.id === id ? { ...t, ...change(t) } : t)))

  const ask = useCallback(async (question: string) => {
    controller.current?.abort()
    const abort = new AbortController()
    controller.current = abort
    const id = nextId.current++
    setTurns((all) => [
      ...all,
      { id, question, answer: '', citations: null, status: 'streaming' },
    ])

    try {
      const citations = await askQuestion(question, {
        onToken: (text) => update(id, (t) => ({ answer: t.answer + text })),
        signal: abort.signal,
      })
      update(id, () => ({ citations, status: 'done' }))
    } catch (error) {
      if (abort.signal.aborted) {
        update(id, () => ({ citations: [], status: 'done' }))
      } else {
        const message =
          error instanceof ApiRequestError
            ? error.message
            : 'Could not reach the assistant. Check your connection and try again.'
        update(id, () => ({ status: 'error', error: message }))
      }
    } finally {
      if (controller.current === abort) controller.current = null
    }
  }, [])

  const stop = useCallback(() => controller.current?.abort(), [])

  useEffect(() => () => controller.current?.abort(), [])

  const isStreaming = turns.some((t) => t.status === 'streaming')
  return { turns, ask, stop, isStreaming }
}
