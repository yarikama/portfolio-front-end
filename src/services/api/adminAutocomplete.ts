import { adminFetch } from './auth'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.yarikama.com/api/v1'

export interface Suggestion {
  // null when there is nothing to show
  id: string | null
  suggestion: string
}

export type SuggestionOutcome = 'accepted' | 'rejected' | 'ignored'

const NONE: Suggestion = { id: null, suggestion: '' }

// Autocomplete must never get in the way of writing: every failure, including
// an expired session, just means "no suggestion". Saving the note is what
// surfaces auth errors.
export const adminAutocompleteService = {
  async complete(
    params: { prefix: string; title: string; noteId?: string },
    signal: AbortSignal,
  ): Promise<Suggestion> {
    try {
      const response = await adminFetch(`${API_BASE_URL}/admin/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
        signal,
      })
      if (!response.ok) return NONE
      const { data } = await response.json()
      return data ?? NONE
    } catch {
      return NONE
    }
  },

  // Fire and forget. keepalive lets the report finish when the editor
  // unmounts (e.g. navigating away while a suggestion is showing).
  feedback(id: string, outcome: SuggestionOutcome, acceptedChars?: number): void {
    adminFetch(`${API_BASE_URL}/admin/complete/${id}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ outcome, acceptedChars }),
      keepalive: true,
    }).catch(() => {})
  },
}
