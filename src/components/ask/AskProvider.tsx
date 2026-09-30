import type { ReactNode } from 'react'
import { useAsk } from '../../hooks/useAsk'
import { AskContext } from './askContext'

export default function AskProvider({ children }: { children: ReactNode }) {
  const chat = useAsk()
  return <AskContext.Provider value={chat}>{children}</AskContext.Provider>
}
