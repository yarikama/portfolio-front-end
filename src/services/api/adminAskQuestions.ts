import { authFetch } from './adminLabNotes'
import type { Citation } from './ask'
import type { PaginatedResponse, ApiResponse } from '../../types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.yarikama.com/api/v1'

export type Rating = 'good' | 'bad'

/** A question asked in the chat, as the backend kept it (30 days). */
export interface AskedQuestion {
  id: string
  createdAt: string
  question: string
  quote: string | null
  page: string | null
  answer: string
  citations: Citation[]
  status: 'answered' | 'error'
  truncated: boolean
  outputTokens: number | null
  durationMs: number
  admin: boolean
  rating: Rating | null
}

export interface QuestionFilters {
  who: 'visitors' | 'admin' | 'all'
  uncited?: boolean
  passage?: boolean
  failed?: boolean
  rating?: Rating | 'none'
}

export const adminAskQuestionsService = {
  async list(
    filters: QuestionFilters,
    offset = 0,
    limit = 50,
  ): Promise<PaginatedResponse<AskedQuestion>> {
    const params = new URLSearchParams({ who: filters.who, offset: String(offset), limit: String(limit) })
    for (const key of ['uncited', 'passage', 'failed'] as const) {
      if (filters[key]) params.set(key, 'true')
    }
    if (filters.rating) params.set('rating', filters.rating)
    return authFetch(`${API_BASE_URL}/admin/ask/questions?${params}`)
  },

  /** null clears the rating. */
  async rate(id: string, rating: Rating | null): Promise<ApiResponse<AskedQuestion>> {
    return authFetch(`${API_BASE_URL}/admin/ask/questions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ rating }),
    })
  },
}
