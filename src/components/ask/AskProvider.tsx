import { useMemo, useState, type ReactNode } from 'react'
import { useAsk } from '../../hooks/useAsk'
import type { Passage } from '../../services/api'
import { AskContext } from './askContext'

export default function AskProvider({ children }: { children: ReactNode }) {
  const chat = useAsk()
  const [passage, setPassage] = useState<Passage | null>(null)
  const [widgetOpen, setWidgetOpen] = useState(false)
  const value = useMemo(
    () => ({ ...chat, passage, setPassage, widgetOpen, setWidgetOpen }),
    [chat, passage, widgetOpen]
  )
  return <AskContext.Provider value={value}>{children}</AskContext.Provider>
}
