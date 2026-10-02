import { adminFetch } from './auth'
import type { ApiResponse, UploadResponse } from '../../types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.yarikama.com/api/v1'

class UploadService {
  /**
   * Upload an image to R2 Storage
   * @param file - The image file to upload
   * @param folder - The folder to store the image (default: 'images')
   * @returns The uploaded image URL and filename
   */
  async uploadImage(file: File, folder = 'images'): Promise<UploadResponse> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await adminFetch(
      `${API_BASE_URL}/admin/upload/image?folder=${encodeURIComponent(folder)}`,
      {
        method: 'POST',
        body: formData,
      }
    )

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.detail || 'Failed to upload image')
    }

    const data: ApiResponse<UploadResponse> = await response.json()
    return data.data
  }

  /**
   * Delete an image from R2 Storage
   * @param url - The full URL of the image to delete
   */
  async deleteImage(url: string): Promise<void> {
    const response = await adminFetch(
      `${API_BASE_URL}/admin/upload/image?url=${encodeURIComponent(url)}`,
      {
        method: 'DELETE',
      }
    )

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.detail || 'Failed to delete image')
    }
  }
}

export const uploadService = new UploadService()
