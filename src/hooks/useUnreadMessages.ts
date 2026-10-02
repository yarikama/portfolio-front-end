import { useEffect, useState } from 'react'
import {
  adminAskQuestionsService,
  adminContactService,
  MESSAGES_CHANGED,
  QUESTIONS_SEEN,
} from '../services/api'

/**
 * A count for the admin nav, fetched on mount and again on `event`; null
 * until known, or if it could not be fetched (the nav then shows none).
 */
function useCount(fetch: () => Promise<number>, event: string): number | null {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    let live = true
    const refresh = () => {
      fetch()
        .then((n) => live && setCount(n))
        .catch(() => live && setCount(null))
    }
    refresh()
    window.addEventListener(event, refresh)
    return () => {
      live = false
      window.removeEventListener(event, refresh)
    }
  }, [fetch, event])

  return count
}

const unreadMessages = () => adminContactService.unreadCount()
const newQuestions = () => adminAskQuestionsService.newCount()

/** Contact messages not opened yet; refreshed when Messages changes one. */
export function useUnreadMessages(): number | null {
  return useCount(unreadMessages, MESSAGES_CHANGED)
}

/** Visitors' questions since Questions was last opened (by this account). */
export function useNewQuestions(): number | null {
  return useCount(newQuestions, QUESTIONS_SEEN)
}
