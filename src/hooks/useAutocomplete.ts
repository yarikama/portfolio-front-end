import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'
import { adminAutocompleteService, type SuggestionOutcome } from '../services/api'

// Ask only after the author pauses; every keystroke before that cancels.
// The model and the network take about 0.25 s on top of this.
const DEBOUNCE_MS = 150
const STORAGE_KEY = 'admin.autocomplete.enabled'

const NAVIGATION_KEYS = new Set([
  'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'PageUp', 'PageDown',
])

interface Shown {
  id: string
  text: string
  // Where the suggestion starts, and the text before it at that moment.
  start: number
  before: string
  // How much of the suggestion the author has typed along with it.
  typed: number
}

export interface Ghost {
  // Position in the content where the gray text begins (the caret).
  at: number
  text: string
}

function readEnabled(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== 'off'
  } catch {
    return true
  }
}

// Word boundaries that also work for Chinese, which has no spaces between
// words ("煩惱心事" -> "煩惱", "心事"). Missing in very old browsers.
const segmenter =
  typeof Intl !== 'undefined' && 'Segmenter' in Intl
    ? new Intl.Segmenter(undefined, { granularity: 'word' })
    : null

/**
 * The next word of a suggestion, for accepting it one word at a time: any
 * leading spaces and symbols, the word, and punctuation right after it
 * (" rotation," or "心事？").
 */
export function nextWord(text: string): string {
  if (!segmenter) return text.match(/^\s*\S+/)?.[0] ?? text
  let out = ''
  let sawWord = false
  for (const { segment, isWordLike } of segmenter.segment(text)) {
    if (!sawWord) {
      out += segment
      sawWord = Boolean(isWordLike)
    } else if (!isWordLike && !/^\s+$/.test(segment)) {
      out += segment
    } else {
      break
    }
  }
  return out
}

function commonPrefixLength(a: string, b: string): number {
  let n = 0
  while (n < a.length && n < b.length && a[n] === b[n]) n++
  return n
}

interface Options {
  textareaRef: RefObject<HTMLTextAreaElement | null>
  content: string
  title: string
  noteId?: string
  // Inserts text at the caret and moves the caret after it.
  insert: (text: string) => void
}

/**
 * Inline suggestions for a textarea: fetches a continuation after a pause,
 * exposes it as gray "ghost" text, and reports what became of it
 * (accepted with Tab, typed along, rejected, or ignored) for training.
 */
export function useAutocomplete({ textareaRef, content, title, noteId, insert }: Options) {
  const [enabled, setEnabledState] = useState(readEnabled)
  const [shown, setShown] = useState<Shown | null>(null)
  const shownRef = useRef<Shown | null>(null)
  const composing = useRef(false)
  const timer = useRef<number | undefined>(undefined)
  const inflight = useRef<AbortController | null>(null)
  // The content an accepted word will produce, so that edit is not mistaken
  // for the author typing something else.
  const acceptedWordEdit = useRef<string | null>(null)
  // Latest title and note id for the debounced request, without re-running
  // the content effect when they change.
  const context = useRef({ title, noteId })
  context.current = { title, noteId }

  const show = (next: Shown | null) => {
    shownRef.current = next
    setShown(next)
  }

  const resolve = useCallback((outcome: SuggestionOutcome, acceptedChars?: number) => {
    const current = shownRef.current
    if (!current) return
    adminAutocompleteService.feedback(current.id, outcome, acceptedChars)
    show(null)
  }, [])

  const cancelPending = useCallback(() => {
    window.clearTimeout(timer.current)
    inflight.current?.abort()
    inflight.current = null
  }, [])

  const request = useCallback(() => {
    const textarea = textareaRef.current
    if (!textarea || document.activeElement !== textarea || composing.current) return
    if (textarea.selectionStart !== textarea.selectionEnd || shownRef.current) return

    const caret = textarea.selectionStart
    const text = textarea.value
    // Only at the end of a line: gray text in the middle of a line would sit
    // on top of what follows it.
    const lineEnd = text.indexOf('\n', caret)
    const restOfLine = lineEnd === -1 ? text.slice(caret) : text.slice(caret, lineEnd)
    if (restOfLine.trim() !== '') return
    const prefix = text.slice(0, caret)
    if (!prefix.trim()) return

    const controller = new AbortController()
    inflight.current = controller
    adminAutocompleteService
      .complete({ prefix, title: context.current.title, noteId: context.current.noteId }, controller.signal)
      .then(({ id, suggestion }) => {
        if (controller.signal.aborted || !id || !suggestion) return
        // Too late: the author has moved on since asking.
        if (textarea.value !== text || textarea.selectionStart !== caret || shownRef.current) {
          adminAutocompleteService.feedback(id, 'ignored')
          return
        }
        show({ id, text: suggestion, start: caret, before: prefix, typed: 0 })
      })
  }, [textareaRef])

  // Every edit: either the author is typing along with the suggestion, or
  // it no longer applies. Then wait for the next pause.
  useEffect(() => {
    if (acceptedWordEdit.current !== null && content === acceptedWordEdit.current) {
      // Our own insertion of one accepted word: the rest stays on offer.
      acceptedWordEdit.current = null
      cancelPending()
      return
    }
    acceptedWordEdit.current = null
    const current = shownRef.current
    const textarea = textareaRef.current
    if (current && textarea) {
      const caret = textarea.selectionStart
      const typed = content.slice(current.start, caret)
      const stillAfterSameText = content.slice(0, current.start) === current.before
      if (stillAfterSameText && caret >= current.start && current.text.startsWith(typed)) {
        if (typed.length === current.text.length) {
          resolve('accepted', typed.length)
        } else if (typed.length !== current.typed) {
          show({ ...current, typed: typed.length })
        }
      } else {
        resolve('rejected', stillAfterSameText ? commonPrefixLength(typed, current.text) : 0)
      }
    }

    cancelPending()
    if (enabled && !shownRef.current && !composing.current) {
      timer.current = window.setTimeout(request, DEBOUNCE_MS)
    }
  }, [content, enabled, request, resolve, cancelPending, textareaRef])

  // Leaving the editor with a suggestion up counts as ignoring it.
  useEffect(
    () => () => {
      cancelPending()
      resolve('ignored', shownRef.current?.typed)
    },
    [cancelPending, resolve],
  )

  const setEnabled = (value: boolean) => {
    setEnabledState(value)
    try {
      localStorage.setItem(STORAGE_KEY, value ? 'on' : 'off')
    } catch {
      // Private mode or blocked storage: the toggle still works for this visit.
    }
    if (!value) {
      cancelPending()
      resolve('ignored', shownRef.current?.typed)
    }
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const current = shownRef.current
    if (!current || event.nativeEvent.isComposing) return
    if (event.key === 'Tab' && !event.shiftKey && !event.altKey && !event.ctrlKey && !event.metaKey) {
      event.preventDefault()
      const remaining = current.text.slice(current.typed)
      // Resolve first, so the edit below is not read as typing along.
      resolve('accepted', current.text.length)
      insert(remaining)
    } else if (
      event.key === 'ArrowRight' && event.altKey &&
      !event.shiftKey && !event.ctrlKey && !event.metaKey
    ) {
      // Option+→ (Alt+→): take the next word and keep offering the rest.
      event.preventDefault()
      const textarea = textareaRef.current
      if (!textarea) return
      const word = nextWord(current.text.slice(current.typed))
      const typed = current.typed + word.length
      if (typed >= current.text.length) {
        resolve('accepted', current.text.length)
      } else {
        show({ ...current, typed })
        acceptedWordEdit.current =
          textarea.value.slice(0, textarea.selectionStart) + word + textarea.value.slice(textarea.selectionEnd)
      }
      insert(word)
    } else if (event.key === 'Escape') {
      event.preventDefault()
      resolve('rejected', current.typed)
    } else if (NAVIGATION_KEYS.has(event.key)) {
      resolve('ignored', current.typed)
    }
  }

  const onPointerDown = () => {
    cancelPending()
    resolve('ignored', shownRef.current?.typed)
  }

  const onBlur = () => {
    cancelPending()
    resolve('ignored', shownRef.current?.typed)
  }

  // IME input (Chinese, Japanese, ...): the text is not final until the
  // composition ends, so neither ask nor keep a suggestion meanwhile.
  const onCompositionStart = () => {
    composing.current = true
    cancelPending()
    resolve('rejected', shownRef.current?.typed)
  }

  const onCompositionEnd = () => {
    composing.current = false
    cancelPending()
    if (enabled) timer.current = window.setTimeout(request, DEBOUNCE_MS)
  }

  const ghost: Ghost | null = shown
    ? { at: shown.start + shown.typed, text: shown.text.slice(shown.typed) }
    : null

  return {
    enabled,
    setEnabled,
    ghost,
    handlers: { onKeyDown, onPointerDown, onBlur, onCompositionStart, onCompositionEnd },
  }
}
