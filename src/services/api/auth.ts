import { API_BASE_URL } from './client'

export interface AuthUser {
  email: string
}

// What the API's sign-in sends back in ?error= on /admin/login.
const SIGN_IN_ERRORS: Record<string, string> = {
  not_allowed: 'That Google account is not allowed to sign in.',
  cancelled: 'Sign-in was cancelled.',
  expired: 'Sign-in took too long or was opened in another browser. Try again.',
  not_configured: 'Google sign-in is not set up on the server.',
  failed: 'Google sign-in failed. Try again.',
  unavailable: 'Sign-in is unavailable right now. Try again shortly.',
}

export function signInErrorMessage(code: string | null): string | null {
  if (!code) return null
  return SIGN_IN_ERRORS[code] ?? SIGN_IN_ERRORS.failed
}

/**
 * fetch for the admin API. The session is an HttpOnly cookie set by the API
 * (api.yarikama.com, the same site as the pages), which scripts cannot
 * read; `credentials: 'include'` makes the browser send it.
 */
export function adminFetch(input: string, init: RequestInit = {}): Promise<Response> {
  return fetch(input, { ...init, credentials: 'include' })
}

// The bearer token the admin used to keep here, before the session moved
// to a cookie. It would no longer be sent; don't leave it lying around.
try {
  localStorage.removeItem('admin_token')
} catch {
  // storage blocked: nothing was kept there either
}

// The session check, made once per page load and shared by every admin
// page: moving between them doesn't ask again. A session that ends meanwhile
// shows up as a 401 from the next admin request.
let session: Promise<AuthUser | null> | null = null

export const authService = {
  /**
   * Where "Sign in with Google" goes: the API sends the browser on to
   * Google, then back to `next` (an /admin page) signed in.
   */
  signInUrl(next: string = '/admin'): string {
    return `${API_BASE_URL}/auth/google/login?${new URLSearchParams({ next })}`
  },

  /** Who is signed in, or null if no one. */
  async me(): Promise<AuthUser | null> {
    const response = await adminFetch(`${API_BASE_URL}/auth/me`)
    if (response.status === 401) return null
    if (!response.ok) throw new Error(`Could not check the session (HTTP ${response.status})`)
    return response.json()
  },

  /** me(), asked once per page load. */
  session(): Promise<AuthUser | null> {
    session ??= this.me().catch((error) => {
      session = null // ask again next time
      throw error
    })
    return session
  },

  async logout(): Promise<void> {
    session = Promise.resolve(null)
    await adminFetch(`${API_BASE_URL}/auth/logout`, { method: 'POST' }).catch(() => {})
  },
}
