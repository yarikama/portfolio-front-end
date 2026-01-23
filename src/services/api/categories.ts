import { apiClient } from './client'
import type { ApiResponse, Category, CategoryWithCount } from '../../types'

export const categoriesService = {
  /**
   * Get all categories
   */
  async getAll(includeCounts = false): Promise<ApiResponse<Category[] | CategoryWithCount[]>> {
    return apiClient.get<ApiResponse<Category[] | CategoryWithCount[]>>('/categories', {
      include_counts: includeCounts,
    })
  },

  /**
   * Get all categories with counts
   */
  async getAllWithCounts(): Promise<ApiResponse<CategoryWithCount[]>> {
    return apiClient.get<ApiResponse<CategoryWithCount[]>>('/categories', { include_counts: true })
  },

  /**
   * Get a single category by ID
   */
  async getById(id: string): Promise<ApiResponse<Category>> {
    return apiClient.get<ApiResponse<Category>>(`/categories/${id}`)
  },
}
