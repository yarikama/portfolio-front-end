import { createContext } from 'react'
import type { useAsk } from '../../hooks/useAsk'
import type { Passage } from '../../services/api'

export type AskChatState = ReturnType<typeof useAsk> & {
  // A passage highlighted on the page, waiting in the question box to be
  // asked about; cleared when asked or removed.
  passage: Passage | null
  setPassage: (passage: Passage | null) => void
  // The floating chat window, opened from its button or by asking about a
  // highlighted passage.
  widgetOpen: boolean
  setWidgetOpen: (open: boolean | ((open: boolean) => boolean)) => void
}

// One conversation for the whole site: the home page section and the
// floating chat show the same turns.
export const AskContext = createContext<AskChatState | null>(null)
