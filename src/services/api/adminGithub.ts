import { authFetch } from './adminLabNotes'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.yarikama.com/api/v1'

export interface ContributionDay {
  date: string // YYYY-MM-DD
  count: number
  level: number // GitHub's shade, 0-4
}

export interface Contributions {
  user: string
  total: number
  days: ContributionDay[] // oldest first, starting on a Sunday
}

export const adminGithubService = {
  async contributions(): Promise<Contributions> {
    const { data } = await authFetch<{ data: Contributions }>(
      `${API_BASE_URL}/admin/github/contributions`,
    )
    return data
  },
}
