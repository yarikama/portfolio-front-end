import { useCallback, useEffect, useRef, useState } from 'react'

// Wait for a pause in typing before writing, so a keystroke is not a write.
const SAVE_DELAY_MS = 800
const PREFIX = 'admin.noteDraft.'

export interface Draft<T> {
  data: T
  savedAt: string
}

function read<T>(key: string): Draft<T> | null {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as Draft<T>) : null
  } catch {
    return null
  }
}

function write<T>(key: string, data: T): string | null {
  const savedAt = new Date().toISOString()
  try {
    localStorage.setItem(key, JSON.stringify({ data, savedAt }))
    return savedAt
  } catch {
    // Storage full, blocked, or private mode: nothing to recover from.
    return null
  }
}

function remove(key: string) {
  try {
    localStorage.removeItem(key)
  } catch {
    // See write().
  }
}

interface Options<T> {
  // One draft per note; new notes share one slot.
  noteId?: string
  data: T
  // False while the saved note is still loading, so its fields are not
  // mistaken for edits.
  ready: boolean
  onRestore: (data: T) => void
}

/**
 * Keeps unsaved edits in localStorage, so a crash, a closed tab or an
 * expired session does not lose them. The draft only exists while the form
 * differs from what was last loaded or saved; reopening the note offers to
 * restore it.
 */
export function useNoteDraft<T>({ noteId, data, ready, onRestore }: Options<T>) {
  const key = PREFIX + (noteId ?? 'new')
  const snapshot = JSON.stringify(data)
  const baseline = useRef<string | null>(null)
  const [offer, setOfferState] = useState<Draft<T> | null>(null)
  // Mirrors offer synchronously: the autosave effect below runs in the same
  // commit that finds a draft, before the state update is visible, and must
  // not delete the draft it is about to offer.
  const offerRef = useRef<Draft<T> | null>(null)
  const setOffer = (next: Draft<T> | null) => {
    offerRef.current = next
    setOfferState(next)
  }
  const [savedAt, setSavedAt] = useState<string | null>(null)
  const timer = useRef<number | undefined>(undefined)
  const latest = useRef({ key, data, snapshot })
  latest.current = { key, data, snapshot }

  // Another note in the same editor instance starts over.
  useEffect(() => {
    baseline.current = null
    setOffer(null)
    setSavedAt(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  // Once the note has loaded, remember it as the saved state and look for a
  // draft that differs from it.
  useEffect(() => {
    if (!ready || baseline.current !== null) return
    baseline.current = snapshot
    const draft = read<T>(key)
    if (draft && JSON.stringify(draft.data) !== snapshot) {
      setOffer(draft)
    } else if (draft) {
      remove(key)
    }
  }, [ready, key, snapshot])

  // Write edits after a pause. Paused while a draft is on offer, so the old
  // draft survives until the author chooses. Keyed on the snapshot, not the
  // data object, so unrelated re-renders do not restart the timer.
  useEffect(() => {
    if (baseline.current === null || offerRef.current) return
    window.clearTimeout(timer.current)
    if (snapshot === baseline.current) {
      remove(key)
      setSavedAt(null)
      return
    }
    timer.current = window.setTimeout(
      () => setSavedAt(write(latest.current.key, latest.current.data)),
      SAVE_DELAY_MS,
    )
    return () => window.clearTimeout(timer.current)
  }, [snapshot, key, offer])

  const dirty = baseline.current !== null && snapshot !== baseline.current

  // Closing or reloading the tab with unsaved edits asks first. (In-app
  // navigation cannot be intercepted with BrowserRouter, but the draft
  // survives it.)
  useEffect(() => {
    if (!dirty) return
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault()
    }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  const restore = () => {
    if (!offer) return
    onRestore(offer.data)
    setOffer(null)
  }

  const discard = () => {
    remove(key)
    setOffer(null)
  }

  // Write now, e.g. right before a save request that might fail.
  const flush = useCallback(() => {
    const { key: k, data: d, snapshot: s } = latest.current
    if (baseline.current !== null && s !== baseline.current) setSavedAt(write(k, d))
  }, [])

  // The server has it now: this is the new saved state.
  const markSaved = useCallback(() => {
    window.clearTimeout(timer.current)
    baseline.current = latest.current.snapshot
    remove(latest.current.key)
    setSavedAt(null)
  }, [])

  return { offer, restore, discard, dirty, savedAt, flush, markSaved }
}
