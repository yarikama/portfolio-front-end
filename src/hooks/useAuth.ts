import { useState, useEffect, useCallback } from 'react'
import { authService, type LoginCredentials } from '../services/api'

interface UseAuthState {
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export function useAuth() {
  const [state, setState] = useState<UseAuthState>({
    isAuthenticated: false,
    isLoading: true,
    error: null,
  })

  useEffect(() => {
    setState({
      isAuthenticated: authService.isAuthenticated(),
      isLoading: false,
      error: null,
    })
  }, [])

  const login = useCallback(async (credentials: LoginCredentials) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      await authService.login(credentials)
      setState({
        isAuthenticated: true,
        isLoading: false,
        error: null,
      })
      return true
    } catch (error) {
      setState({
        isAuthenticated: false,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Login failed',
      })
      return false
    }
  }, [])

  const logout = useCallback(() => {
    authService.logout()
    setState({
      isAuthenticated: false,
      isLoading: false,
      error: null,
    })
  }, [])

  return {
    ...state,
    login,
    logout,
  }
}
