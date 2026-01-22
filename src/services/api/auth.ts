const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.yarikama.com/api/v1'

export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthResponse {
  token: string
  expiresAt: string
}

export interface AuthUser {
  email: string
}

const TOKEN_KEY = 'admin_token'

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.error?.message || 'Login failed')
    }

    const data = await response.json()

    // Handle different response formats
    const token = data.token || data.data?.token || data.access_token
    if (!token) {
      throw new Error('No token received from server')
    }

    localStorage.setItem(TOKEN_KEY, token)
    return data
  },

  logout(): void {
    localStorage.removeItem(TOKEN_KEY)
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY)
  },

  isAuthenticated(): boolean {
    const token = this.getToken()
    if (!token) return false

    // Basic JWT expiry check (decode without verification)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload.exp * 1000 > Date.now()
    } catch {
      return false
    }
  },

  getAuthHeaders(): Record<string, string> {
    const token = this.getToken()
    return token ? { Authorization: `Bearer ${token}` } : {}
  },
}
