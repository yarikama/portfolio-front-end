import { useEffect, useState } from 'react'
import { adminContactService, MESSAGES_CHANGED } from '../services/api'

/**
 * How many contact messages are unread, for the admin nav; null until
 * known, or if it could not be fetched (the nav then shows no count).
 * Refreshed when the Messages page changes one.
 */
export function useUnreadMessages(): number | null {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    let live = true
    const refresh = () => {
      adminContactService
        .unreadCount()
        .then((n) => live && setCount(n))
        .catch(() => live && setCount(null))
    }
    refresh()
    window.addEventListener(MESSAGES_CHANGED, refresh)
    return () => {
      live = false
      window.removeEventListener(MESSAGES_CHANGED, refresh)
    }
  }, [])

  return count
}
