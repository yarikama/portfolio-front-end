import { useContext } from 'react'
import { AskContext, type AskChatState } from '../components/ask/askContext'

/** The site's one ask conversation (see AskProvider). */
export function useAskChat(): AskChatState {
  const chat = useContext(AskContext)
  if (!chat) throw new Error('useAskChat is used outside an AskProvider')
  return chat
}
