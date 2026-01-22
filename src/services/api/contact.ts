import { apiClient } from './client'
import type {
  ApiResponse,
  ContactFormData,
  ContactSubmitResponse,
} from '../../types'

export const contactService = {
  /**
   * Submit a contact form message
   */
  async submit(data: ContactFormData): Promise<ApiResponse<ContactSubmitResponse>> {
    return apiClient.post<ApiResponse<ContactSubmitResponse>>('/contact', data)
  },
}
