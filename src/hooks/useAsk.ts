import { useCallback, useEffect, useRef, useState } from 'react'
import { askQuestion, ApiRequestError } from '../services/api'
import type { Citation, Passage } from '../services/api'

export interface Turn {
  id: number
  question: string
  // What the question is about, when the visitor highlighted it on the site.
  passage?: Passage
  answer: string
  // Known once the answer is complete.
  citations: Citation[] | null
  // Cut at the backend's length cap: the answer ends mid-sentence.
  truncated?: boolean
  status: 'streaming' | 'done' | 'error'
  error?: string
}

/**
 * Questions and their streamed answers. The model sees the last two turns
 * before each question: the API keeps them, under the conversation id each
 * answer returns, for 30 minutes. reset() starts a new conversation.
 */
export function useAsk() {
  const [turns, setTurns] = useState<Turn[]>([])
  const controller = useRef<AbortController | null>(null)
  const nextId = useRef(0)
  const conversation = useRef<string | null>(null)

  const update = (id: number, change: (turn: Turn) => Partial<Turn>) =>
    setTurns((all) => all.map((t) => (t.id === id ? { ...t, ...change(t) } : t)))

  const ask = useCallback(async (question: string, passage?: Passage) => {
    controller.current?.abort()
    const abort = new AbortController()
    controller.current = abort
    const id = nextId.current++
    setTurns((all) => [
      ...all,
      { id, question, passage, answer: '', citations: null, status: 'streaming' },
    ])

    try {
      const end = await askQuestion(question, {
        onToken: (text) => update(id, (t) => ({ answer: t.answer + text })),
        signal: abort.signal,
        passage,
        conversation: conversation.current,
      })
      conversation.current = end.conversation
      update(id, () => ({ citations: end.citations, truncated: end.truncated, status: 'done' }))
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

  const reset = useCallback(() => {
    controller.current?.abort()
    conversation.current = null
    setTurns([])
  }, [])

  useEffect(() => () => controller.current?.abort(), [])

  const isStreaming = turns.some((t) => t.status === 'streaming')
  return { turns, ask, stop, reset, isStreaming }
}
