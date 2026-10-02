import { useState, useEffect, useCallback } from 'react'
import { authService, type AuthUser } from '../services/api'

type Status = 'checking' | 'signed-in' | 'signed-out' | 'error'

interface UseAuthState {
  status: Status
  user: AuthUser | null
}

export function useAuth() {
  const [state, setState] = useState<UseAuthState>({ status: 'checking', user: null })

  useEffect(() => {
    let live = true
    authService
      .session()
      .then((user) => {
        if (live) setState({ status: user ? 'signed-in' : 'signed-out', user })
      })
      .catch(() => {
        if (live) setState({ status: 'error', user: null })
      })
    return () => {
      live = false
    }
  }, [])

  const logout = useCallback(async () => {
    await authService.logout()
    setState({ status: 'signed-out', user: null })
  }, [])

  return { ...state, logout }
}
