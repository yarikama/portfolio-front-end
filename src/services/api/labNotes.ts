import { apiClient } from './client'
import type {
  ApiResponse,
  PaginatedResponse,
  LabNote,
  LabNoteListItem,
  LabNoteTag,
  LabNotesQueryParams,
} from '../../types'

export const labNotesService = {
  /**
   * Get all published lab notes with optional filtering
   */
  async getAll(params?: LabNotesQueryParams): Promise<PaginatedResponse<LabNoteListItem>> {
    return apiClient.get<PaginatedResponse<LabNoteListItem>>('/lab-notes', params)
  },

  /**
   * Get a single lab note by slug
   */
  async getBySlug(slug: string): Promise<ApiResponse<LabNote>> {
    return apiClient.get<ApiResponse<LabNote>>(`/lab-notes/${slug}`)
  },

  /**
   * Get all available tags with counts
   */
  async getTags(): Promise<ApiResponse<LabNoteTag[]>> {
    return apiClient.get<ApiResponse<LabNoteTag[]>>('/lab-notes/tags')
  },
}
