// Re-export API types
export type {
  ApiResponse,
  PaginatedResponse,
  Pagination,
  ApiError,
  Category,
  CategoryWithCount,
  CategoryCreate,
  CategoryUpdate,
  CategoryReorderItem,
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
  UploadResponse,
  UploadDeleteResponse,
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

export interface ExperienceHighlight {
  label: string
  // Wrap a figure in **double asterisks** to render it highlighted
  text: string
}

export interface ExperienceRole {
  title: string
  period: string
  highlights: ExperienceHighlight[]
}

export interface ExperienceEntry {
  company: string
  url: string
  // Square mark shown at the start of the company's timeline
  logo: string
  tagline?: string
  location: string
  roles: ExperienceRole[]
}

export interface NavItem {
  label: string
  href: string
}
