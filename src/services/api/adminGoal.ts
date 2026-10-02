import { authFetch } from './adminLabNotes'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.yarikama.com/api/v1'

export interface Goal {
  text: string // empty: no goal set
  updatedAt: string | null
}

export const adminGoalService = {
  async get(): Promise<Goal> {
    const { data } = await authFetch<{ data: Goal }>(`${API_BASE_URL}/admin/goal`)
    return data
  },

  async set(text: string): Promise<Goal> {
    const { data } = await authFetch<{ data: Goal }>(`${API_BASE_URL}/admin/goal`, {
      method: 'PUT',
      body: JSON.stringify({ text }),
    })
    return data
  },
}
