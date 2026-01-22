// Re-export API types
export type {
  ApiResponse,
  PaginatedResponse,
  Pagination,
  ApiError,
  LabNote,
  LabNoteListItem,
  Project,
  ProjectCategory,
  LabNoteTag,
  ContactMessage,
  ContactFormData,
  ContactSubmitResponse,
  LabNotesQueryParams,
  ProjectsQueryParams,
} from './api'

// Local/static data types (for fallback data)
export interface LocalProject {
  id: string
  title: string
  description: string
  tags: string[]
  category: 'engineering' | 'ml'
  year: string
  link?: string
  github?: string
  metrics?: string
  formula?: string
  featured?: boolean
}

export interface TechCategory {
  category: string
  items: string[]
}

export interface NavItem {
  label: string
  href: string
}
