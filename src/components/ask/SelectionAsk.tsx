import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { useAskChat } from '../../hooks'
import { MAX_PASSAGE } from '../../services/api'

// Shorter selections are a stray click or a word being copied.
const MIN_PASSAGE = 3
// The fixed header's height: the button goes below the selection instead
// of under it.
const HEADER = 88
const BUTTON = 36

interface Spot {
  top: number
  left: number
  // Kept from when the button appeared: on touch screens, tapping it may
  // clear the selection before the click.
  text: string
}

/** The selected page text worth asking about, or null. */
function selectedPassage(): { text: string; range: Range } | null {
  const selection = window.getSelection()
  if (!selection || selection.isCollapsed || selection.rangeCount === 0) return null
  const range = selection.getRangeAt(0)
  const within = range.commonAncestorContainer
  const element = within instanceof Element ? within : within.parentElement
  // Page content only: not the chat itself, the header, or form fields.
  if (!element?.closest('main') || element.closest('#ask, #ask-widget, form, [contenteditable]')) {
    return null
  }
  const text = selection.toString().replace(/\s+/g, ' ').trim()
  return text.length >= MIN_PASSAGE ? { text, range } : null
}

/**
 * Select any text on a public page and an "Ask AI" button appears next to
 * it: it puts the passage in the ask chat's question box, in the home page
 * section when that is on screen, otherwise in the floating chat window.
 * With a mouse the button sits above the selection; on touch screens below
 * it, clear of the system's own copy menu.
 */
export default function SelectionAsk() {
  const [spot, setSpot] = useState<Spot | null>(null)
  const { setPassage, setWidgetOpen } = useAskChat()
  const { pathname } = useLocation()

  useEffect(() => {
    let frame = 0
    const place = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const found = selectedPassage()
        if (!found) return setSpot(null)
        const box = found.range.getBoundingClientRect()
        const touch = window.matchMedia('(pointer: coarse)').matches
        const above = box.top - BUTTON - 8
        const top = !touch && above > HEADER ? above : box.bottom + 8
        // Off screen once the selection is scrolled away.
        if (top < HEADER || top > window.innerHeight - BUTTON) return setSpot(null)
        const left = Math.min(
          Math.max(box.left + box.width / 2, 60),
          window.innerWidth - 60
        )
        setSpot({ top, left, text: found.text })
      })
    }
    document.addEventListener('selectionchange', place)
    window.addEventListener('scroll', place, { passive: true })
    window.addEventListener('resize', place)
    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('selectionchange', place)
      window.removeEventListener('scroll', place)
      window.removeEventListener('resize', place)
    }
  }, [])

  useEffect(() => setSpot(null), [pathname])

  if (!spot) return null

  const askAbout = () => {
    const text =
      spot.text.length > MAX_PASSAGE ? `${spot.text.slice(0, MAX_PASSAGE - 1)}…` : spot.text
    setPassage({ text, page: pathname })
    window.getSelection()?.removeAllRanges()
    setSpot(null)

    // The home page section when it is on screen, so there are never two
    // chats in view; otherwise the floating window.
    const section = document.getElementById('ask')
    const box = section?.getBoundingClientRect()
    const sectionInView = box && box.top < window.innerHeight * 0.75 && box.bottom > window.innerHeight * 0.25
    if (!sectionInView) setWidgetOpen(true)
    // After the window has rendered.
    requestAnimationFrame(() => {
      const input = document.querySelector<HTMLTextAreaElement>(
        sectionInView ? '#ask textarea' : '#ask-widget textarea'
      )
      input?.focus({ preventScroll: true })
    })
  }

  return (
    <button
      type="button"
      // Keep the selection: a press would otherwise clear it before the click.
      onPointerDown={(e) => e.preventDefault()}
      onMouseDown={(e) => e.preventDefault()}
      onClick={askAbout}
      style={{ top: spot.top, left: spot.left }}
      className="fixed z-50 -translate-x-1/2 h-9 inline-flex items-center gap-1.5 rounded-full
        bg-ink text-paper px-3.5 shadow-lg font-mono text-xs uppercase tracking-widest
        hover:scale-105 active:scale-95 transition-transform"
    >
      <Sparkles className="w-3.5 h-3.5" />
      Ask AI
    </button>
  )
}
