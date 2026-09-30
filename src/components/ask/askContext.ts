import { createContext } from 'react'
import type { useAsk } from '../../hooks/useAsk'

export type AskChatState = ReturnType<typeof useAsk>

// One conversation for the whole site: the home page section and the
// floating chat show the same turns.
export const AskContext = createContext<AskChatState | null>(null)
