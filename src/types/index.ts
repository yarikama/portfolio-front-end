export interface Project {
  id: string
  title: string
  description: string
  tags: string[]
  category: 'engineering' | 'ml' | 'design' | 'research'
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

export interface LabNote {
  id: string
  title: string
  excerpt: string
  date: string
  tags: string[]
  readTime: string
}

export interface NavItem {
  label: string
  href: string
}
