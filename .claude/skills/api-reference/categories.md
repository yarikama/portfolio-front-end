# Categories API Reference

## Types

```typescript
interface Category {
  id: string           // UUID
  name: string         // e.g., "engineering", "ml"
  label: string        // e.g., "Engineering", "ML/AI"
  description: string | null
  order: number
  created_at: string   // ISO 8601 datetime
  updated_at: string   // ISO 8601 datetime
}

interface CategoryWithCount extends Category {
  count: number        // Number of published projects
}

interface CategoryCreate {
  name: string         // Unique identifier (lowercase, no spaces)
  label: string        // Display name
  description?: string
  order?: number       // Default: 0
}

interface CategoryUpdate {
  name?: string
  label?: string
  description?: string
  order?: number
}

interface CategoryReorderItem {
  id: string           // UUID
  order: number
}
```

---

## Public Endpoints

### GET /api/v1/categories
Get all categories.

**Query Parameters:**
| Name | Type | Default | Description |
|------|------|---------|-------------|
| `include_counts` | boolean | `false` | Include project counts for each category |

**Response (without counts):**
```json
{
  "data": [
    {
      "id": "11111111-1111-1111-1111-111111111111",
      "name": "engineering",
      "label": "Engineering",
      "description": "Software engineering projects",
      "order": 0,
      "created_at": "2026-01-23T00:00:00Z",
      "updated_at": "2026-01-23T00:00:00Z"
    }
  ]
}
```

**Response (with counts):**
```json
{
  "data": [
    {
      "id": "00000000-0000-0000-0000-000000000000",
      "name": "all",
      "label": "All",
      "description": "All projects",
      "order": -1,
      "count": 10,
      "created_at": "...",
      "updated_at": "..."
    },
    {
      "id": "11111111-1111-1111-1111-111111111111",
      "name": "engineering",
      "label": "Engineering",
      "description": "Software engineering projects",
      "order": 0,
      "count": 6,
      "created_at": "...",
      "updated_at": "..."
    }
  ]
}
```

### GET /api/v1/categories/{id}
Get a single category by ID.

**Response:**
```json
{
  "data": {
    "id": "11111111-1111-1111-1111-111111111111",
    "name": "engineering",
    "label": "Engineering",
    "description": "Software engineering projects",
    "order": 0,
    "created_at": "2026-01-23T00:00:00Z",
    "updated_at": "2026-01-23T00:00:00Z"
  }
}
```

---

## Admin Endpoints (Require Authentication)

### GET /api/v1/admin/categories
Get all categories (admin view).

**Response:** Same as public endpoint.

---

### POST /api/v1/admin/categories
Create a new category.

**Request Body:**
```json
{
  "name": "design",
  "label": "Design",
  "description": "UI/UX design projects",
  "order": 2
}
```

**Response (201):**
```json
{
  "data": {
    "id": "33333333-3333-3333-3333-333333333333",
    "name": "design",
    "label": "Design",
    "description": "UI/UX design projects",
    "order": 2,
    "created_at": "2026-01-23T00:00:00Z",
    "updated_at": "2026-01-23T00:00:00Z"
  }
}
```

**Errors:**
- `409`: Category with this name already exists

---

### PUT /api/v1/admin/categories/{id}
Update a category.

**Request Body:**
```json
{
  "label": "UI/UX Design",
  "description": "User interface and experience design"
}
```

**Response:**
```json
{
  "data": { ... }
}
```

**Errors:**
- `404`: Category not found
- `409`: Category with this name already exists

---

### DELETE /api/v1/admin/categories/{id}
Delete a category.

**Response:** `204 No Content`

**Errors:**
- `404`: Category not found
- `409`: Cannot delete category with existing projects

---

### PATCH /api/v1/admin/categories/reorder
Reorder categories.

**Request Body:**
```json
{
  "orders": [
    { "id": "11111111-1111-1111-1111-111111111111", "order": 1 },
    { "id": "22222222-2222-2222-2222-222222222222", "order": 0 }
  ]
}
```

**Response:**
```json
{
  "data": {
    "message": "Categories reordered successfully",
    "updated": 2
  }
}
```

---

## Default Categories

| ID | Name | Label |
|----|------|-------|
| `11111111-1111-1111-1111-111111111111` | engineering | Engineering |
| `22222222-2222-2222-2222-222222222222` | ml | ML/AI |

---

## Frontend Service

```typescript
// src/services/api/categories.ts
import { categoriesService } from '../services/api'

// Get all categories
const categories = await categoriesService.getAll()

// Get categories with counts
const categoriesWithCounts = await categoriesService.getAllWithCounts()

// Get single category
const category = await categoriesService.getById(id)
```

```typescript
// src/services/api/adminCategories.ts
import { adminCategoriesService } from '../services/api'

// Admin operations
await adminCategoriesService.create({ name: 'design', label: 'Design' })
await adminCategoriesService.update(id, { label: 'Updated Label' })
await adminCategoriesService.delete(id)
await adminCategoriesService.reorder([{ id: '...', order: 0 }])
```
