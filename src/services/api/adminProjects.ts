import { apiClient } from './client'
import { authService } from './auth'
import type { ApiResponse, PaginatedResponse, Project } from '../../types'

export interface CreateProjectData {
  slug: string
  title: string
  description: string
  tags: string[]
  category_id: string
  year: string
  link?: string
  github?: string
  metrics?: string
  formula?: string
  featured: boolean
  order: number
  published: boolean
}

export interface UpdateProjectData extends Partial<CreateProjectData> {}

class AdminProjectsService {
  private getAuthHeaders() {
    return authService.getAuthHeaders()
  }

  /**
   * Get all projects (including unpublished) for admin
   */
  async getAll(limit: number = 100): Promise<PaginatedResponse<Project>> {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL || 'https://api.yarikama.com/api/v1'}/admin/projects?limit=${limit}`,
      {
        headers: {
          ...this.getAuthHeaders(),
        },
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch projects')
    }

    return response.json()
  }

  /**
   * Create a new project
   */
  async create(data: CreateProjectData): Promise<ApiResponse<Project>> {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL || 'https://api.yarikama.com/api/v1'}/admin/projects`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders(),
        },
        body: JSON.stringify(data),
      }
    )

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.error?.message || 'Failed to create project')
    }

    return response.json()
  }

  /**
   * Update an existing project
   */
  async update(id: string, data: UpdateProjectData): Promise<ApiResponse<Project>> {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL || 'https://api.yarikama.com/api/v1'}/admin/projects/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders(),
        },
        body: JSON.stringify(data),
      }
    )

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.error?.message || 'Failed to update project')
    }

    return response.json()
  }

  /**
   * Delete a project
   */
  async delete(id: string): Promise<void> {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL || 'https://api.yarikama.com/api/v1'}/admin/projects/${id}`,
      {
        method: 'DELETE',
        headers: {
          ...this.getAuthHeaders(),
        },
      }
    )

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.error?.message || 'Failed to delete project')
    }
  }

  /**
   * Reorder projects
   */
  async reorder(orders: Array<{ id: string; order: number }>): Promise<{ message: string; updated: number }> {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL || 'https://api.yarikama.com/api/v1'}/admin/projects/reorder`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders(),
        },
        body: JSON.stringify({ orders }),
      }
    )

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.error?.message || 'Failed to reorder projects')
    }

    const data = await response.json()
    return data.data
  }
}

export const adminProjectsService = new AdminProjectsService()
