# Projects API Reference

## Types

```typescript
interface Project {
  id: string           // UUID
  slug: string
  title: string
  description: string
  tags: string[]
  category: Category   // Full Category object (not a string!)
  year: string
  link: string | null
  github: string | null
  metrics: string | null
  formula: string | null
  featured: boolean
  order: number
  published: boolean
  created_at: string   // ISO 8601
  updated_at: string   // ISO 8601
}

interface ProjectCreate {
  slug: string
  title: string
  description: string
  tags: string[]
  category_id: string  // UUID (not category name!)
  year: string
  link?: string
  github?: string
  metrics?: string
  formula?: string
  featured: boolean
  order: number
  published: boolean
}

interface ProjectUpdate extends Partial<ProjectCreate> {}

interface ProjectsQueryParams {
  category_id?: string  // UUID (not category name!)
  featured?: boolean
  tag?: string
  limit?: number
  offset?: number
}
```

---

## Public Endpoints

### GET /api/v1/projects
Get published projects.

**Query Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `category_id` | UUID | Filter by category UUID |
| `featured` | boolean | Filter by featured status |
| `tag` | string | Filter by tag |
| `limit` | number | Max results (default: 50) |
| `offset` | number | Pagination offset (default: 0) |

**Response:**
```json
{
  "data": [
    {
      "id": "...",
      "slug": "my-project",
      "title": "My Project",
      "description": "...",
      "tags": ["Python", "FastAPI"],
      "category": {
        "id": "11111111-1111-1111-1111-111111111111",
        "name": "engineering",
        "label": "Engineering",
        "description": "...",
        "order": 0,
        "created_at": "...",
        "updated_at": "..."
      },
      "year": "2026",
      "link": "https://...",
      "github": "https://github.com/...",
      "metrics": null,
      "formula": null,
      "featured": true,
      "order": 0,
      "published": true,
      "created_at": "...",
      "updated_at": "..."
    }
  ],
  "pagination": {
    "offset": 0,
    "limit": 50,
    "total": 1
  }
}
```

### GET /api/v1/projects/{slug}
Get a single project by slug.

**Response:** Same structure as above (single project in `data`).

---

## Admin Endpoints

### GET /api/v1/admin/projects
Get all projects (including unpublished).

**Query Parameters:** Same as public, uses `category_id` (UUID).

---

### GET /api/v1/admin/projects/{id}
Get a single project by ID.

**Response:**
```json
{
  "data": { ... }
}
```

---

### POST /api/v1/admin/projects
Create a new project.

**Request Body:**
```json
{
  "slug": "new-project",
  "title": "New Project",
  "description": "...",
  "tags": ["TypeScript", "React"],
  "category_id": "11111111-1111-1111-1111-111111111111",
  "year": "2026",
  "link": null,
  "github": "https://github.com/...",
  "metrics": null,
  "formula": null,
  "featured": false,
  "order": 0,
  "published": true
}
```

**Errors:**
- `404`: Category not found
- `409`: Project with this slug already exists

---

### PUT /api/v1/admin/projects/{id}
Update a project.

**Request Body:**
```json
{
  "title": "Updated Title",
  "category_id": "22222222-2222-2222-2222-222222222222"
}
```

**Errors:**
- `404`: Project or Category not found
- `409`: Project with this slug already exists

---

### DELETE /api/v1/admin/projects/{id}
Delete a project.

**Response:** `204 No Content`

---

### PATCH /api/v1/admin/projects/reorder
Reorder projects.

**Request Body:**
```json
{
  "orders": [
    { "id": "...", "order": 0 },
    { "id": "...", "order": 1 }
  ]
}
```

---

## Frontend Service

```typescript
// src/services/api/projects.ts
import { projectsService } from '../services/api'

// Get all published projects
const { data, pagination } = await projectsService.getAll()

// Filter by category
const { data } = await projectsService.getAll({
  category_id: '11111111-1111-1111-1111-111111111111'
})

// Get featured projects
const { data } = await projectsService.getFeatured()

// Get single project by slug
const { data } = await projectsService.getBySlug('my-project')

// Get categories with counts
const { data } = await projectsService.getCategories()
```

```typescript
// src/services/api/adminProjects.ts
import { adminProjectsService, type CreateProjectData } from '../services/api'

// Create project
const projectData: CreateProjectData = {
  slug: 'new-project',
  title: 'New Project',
  description: '...',
  tags: ['TypeScript'],
  category_id: '11111111-1111-1111-1111-111111111111', // UUID!
  year: '2026',
  featured: false,
  order: 0,
  published: true,
}
await adminProjectsService.create(projectData)

// Update project
await adminProjectsService.update(id, { title: 'Updated' })

// Delete project
await adminProjectsService.delete(id)

// Reorder projects
await adminProjectsService.reorder([
  { id: '...', order: 0 },
  { id: '...', order: 1 },
])
```

---

## React Hooks

```typescript
import { useProjects, useFeaturedProjects, useProject, useProjectCategories } from '../hooks'

// Get all projects
const { projects, pagination, isLoading, error, refetch } = useProjects()

// Filter by category
const { projects } = useProjects({ category_id: '...' })

// Get featured projects
const { projects, isLoading } = useFeaturedProjects()

// Get single project
const { project, isLoading } = useProject('my-project-slug')

// Get categories
const { categories, isLoading } = useProjectCategories()
```
