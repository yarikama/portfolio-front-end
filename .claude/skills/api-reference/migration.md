# API Migration Guide

## Breaking Changes Summary

This document describes the breaking changes introduced in the Categories API update.

---

## 1. Project.category is now a full Category object

**Before:**
```typescript
interface Project {
  category: 'engineering' | 'ml'  // String
}

// Usage
project.category  // "engineering"
```

**After:**
```typescript
interface Project {
  category: Category  // Full object
}

// Usage
project.category.name   // "engineering"
project.category.label  // "Engineering"
project.category.id     // UUID
```

**Files affected:**
- `src/types/api.ts` - Type definition
- `src/pages/ArchivePage.tsx` - Filter logic
- `src/pages/admin/ProjectsList.tsx` - Display
- Any component accessing `project.category`

---

## 2. Filtering by category now uses UUID

**Before:**
```typescript
GET /api/v1/projects?category=engineering
```

**After:**
```typescript
GET /api/v1/projects?category_id=11111111-1111-1111-1111-111111111111
```

**Files affected:**
- `src/types/api.ts` - `ProjectsQueryParams`
- `src/hooks/useProjects.ts` - Dependency array

---

## 3. Creating/updating projects uses category_id

**Before:**
```typescript
{
  category: "engineering"
}
```

**After:**
```typescript
{
  category_id: "11111111-1111-1111-1111-111111111111"
}
```

**Files affected:**
- `src/services/api/adminProjects.ts` - `CreateProjectData`
- `src/pages/admin/ProjectEditor.tsx` - Form data

---

## 4. Old categories endpoint removed

**Before:**
```typescript
GET /api/v1/projects/categories
```

**After:**
```typescript
GET /api/v1/categories?include_counts=true
```

**Files affected:**
- `src/services/api/projects.ts` - `getCategories()`

---

## 5. Timestamp field names changed

**Before:**
```typescript
{
  createdAt: string
  updatedAt: string
}
```

**After:**
```typescript
{
  created_at: string
  updated_at: string
}
```

---

## Files Updated in Migration

| File | Changes |
|------|---------|
| `src/types/api.ts` | Added Category types, updated Project.category type, changed ProjectsQueryParams |
| `src/types/index.ts` | Added Category type exports |
| `src/services/api/projects.ts` | Changed categories endpoint |
| `src/services/api/adminProjects.ts` | Changed `category` to `category_id` |
| `src/services/api/categories.ts` | **NEW** - Public categories service |
| `src/services/api/adminCategories.ts` | **NEW** - Admin categories service |
| `src/services/api/index.ts` | Added new service exports |
| `src/hooks/useProjects.ts` | Changed dependency from `category` to `category_id` |
| `src/pages/ArchivePage.tsx` | Updated filter to use `p.category.name`, buttons use `category.name` |
| `src/pages/admin/ProjectsList.tsx` | Changed `project.category` to `project.category.label` |
| `src/pages/admin/ProjectEditor.tsx` | Changed to use `category_id`, added dynamic category fetching |

---

## Common Migration Patterns

### Displaying category label
```typescript
// Before
<span>{project.category}</span>

// After
<span>{project.category.label}</span>
```

### Filtering projects by category
```typescript
// Before
projects.filter(p => p.category === 'engineering')

// After
projects.filter(p => p.category.name === 'engineering')
```

### Setting category in forms
```typescript
// Before
setFormData({ ...formData, category: 'engineering' })

// After
setFormData({ ...formData, category_id: categoryId })
```

### Category select dropdown
```typescript
// Before
<select value={formData.category}>
  <option value="engineering">Engineering</option>
  <option value="ml">ML</option>
</select>

// After - Fetch categories dynamically
const [categories, setCategories] = useState([])

useEffect(() => {
  projectsService.getCategories().then(res => {
    setCategories(res.data.filter(c => c.name !== 'all'))
  })
}, [])

<select value={formData.category_id}>
  {categories.map(cat => (
    <option key={cat.id} value={cat.id}>{cat.label}</option>
  ))}
</select>
```

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "detail": "Error message here"
}
```

| Status | Description |
|--------|-------------|
| `400` | Bad request (validation error) |
| `401` | Unauthorized (missing/invalid token) |
| `404` | Resource not found |
| `409` | Conflict (duplicate slug/name, or cannot delete) |
| `422` | Unprocessable entity (validation error) |
| `500` | Internal server error |
