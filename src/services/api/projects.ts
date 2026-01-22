import { apiClient } from './client'
import type {
  ApiResponse,
  PaginatedResponse,
  Project,
  ProjectCategory,
  ProjectsQueryParams,
} from '../../types'

export const projectsService = {
  /**
   * Get all published projects with optional filtering
   */
  async getAll(params?: ProjectsQueryParams): Promise<PaginatedResponse<Project>> {
    return apiClient.get<PaginatedResponse<Project>>('/projects', params)
  },

  /**
   * Get a single project by slug
   */
  async getBySlug(slug: string): Promise<ApiResponse<Project>> {
    return apiClient.get<ApiResponse<Project>>(`/projects/${slug}`)
  },

  /**
   * Get all project categories with counts
   */
  async getCategories(): Promise<ApiResponse<ProjectCategory[]>> {
    return apiClient.get<ApiResponse<ProjectCategory[]>>('/projects/categories')
  },

  /**
   * Get featured projects only
   */
  async getFeatured(): Promise<PaginatedResponse<Project>> {
    return apiClient.get<PaginatedResponse<Project>>('/projects', { featured: true })
  },
}
