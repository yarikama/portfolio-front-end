import { authFetch } from './adminLabNotes'
import type { ApiResponse, PaginatedResponse } from '../../types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.yarikama.com/api/v1'

/** A message sent through the site's contact form. */
export interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  read: boolean
  replied: boolean
  createdAt: string
}

export type MessageChange = Partial<Pick<ContactMessage, 'read' | 'replied'>>

// Lets the nav's unread count follow changes made on the Messages page.
export const MESSAGES_CHANGED = 'admin:messages-changed'

function changed() {
  window.dispatchEvent(new Event(MESSAGES_CHANGED))
}

/** A mailto: link that answers the visitor, quoting their subject. */
export function replyLink(message: Pick<ContactMessage, 'email' | 'subject'>): string {
  const subject = /^re:/i.test(message.subject) ? message.subject : `Re: ${message.subject}`
  return `mailto:${encodeURIComponent(message.email)}?subject=${encodeURIComponent(subject)}`
}

export const adminContactService = {
  async list(
    unreadOnly: boolean,
    offset = 0,
    limit = 50,
  ): Promise<PaginatedResponse<ContactMessage>> {
    const params = new URLSearchParams({ offset: String(offset), limit: String(limit) })
    if (unreadOnly) params.set('read', 'false')
    return authFetch(`${API_BASE_URL}/admin/contact?${params}`)
  },

  async unreadCount(): Promise<number> {
    const page = await this.list(true, 0, 1)
    return page.pagination.total
  },

  async update(id: string, change: MessageChange): Promise<ApiResponse<ContactMessage>> {
    const response = await authFetch<ApiResponse<ContactMessage>>(
      `${API_BASE_URL}/admin/contact/${id}`,
      { method: 'PATCH', body: JSON.stringify(change) },
    )
    changed()
    return response
  },

  async remove(id: string): Promise<void> {
    await authFetch<void>(`${API_BASE_URL}/admin/contact/${id}`, { method: 'DELETE' })
    changed()
  },
}
