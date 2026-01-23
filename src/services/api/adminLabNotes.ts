import { authService } from './auth'
import type { ApiResponse, LabNote } from '../../types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.yarikama.com/api/v1'

export interface CreateLabNoteData {
  title: string
  slug: string
  excerpt: string
  content: string
  tags: string[]
  readTime: string
  date: string
  published: boolean
}

export interface UpdateLabNoteData extends Partial<CreateLabNoteData> {}

async function authFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authService.getAuthHeaders(),
      ...options.headers,
    },
  })

  if (response.status === 401) {
    authService.logout()
    window.location.href = '/admin/login'
    throw new Error('Unauthorized')
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.error?.message || `Request failed: ${response.status}`)
  }

  if (response.status === 204) {
    return {} as T
  }

  return response.json()
}

export const adminLabNotesService = {
  async getAll(limit: number = 100): Promise<{ data: LabNote[] }> {
    // Admin 专用 endpoint - 返回所有笔记（包括未发布的）
    return authFetch<{ data: LabNote[] }>(`${API_BASE_URL}/admin/lab-notes?limit=${limit}`)
  },

  async getById(id: string): Promise<ApiResponse<LabNote>> {
    return authFetch<ApiResponse<LabNote>>(`${API_BASE_URL}/admin/lab-notes/${id}`)
  },

  async create(data: CreateLabNoteData): Promise<ApiResponse<LabNote>> {
    return authFetch<ApiResponse<LabNote>>(`${API_BASE_URL}/admin/lab-notes`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async update(id: string, data: UpdateLabNoteData): Promise<ApiResponse<LabNote>> {
    return authFetch<ApiResponse<LabNote>>(`${API_BASE_URL}/admin/lab-notes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  async delete(id: string): Promise<void> {
    await authFetch<void>(`${API_BASE_URL}/admin/lab-notes/${id}`, {
      method: 'DELETE',
    })
  },
}
