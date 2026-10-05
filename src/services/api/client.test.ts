import { afterEach, describe, expect, it, vi } from 'vitest'
import { apiErrorMessage } from './client'
import { authFetch } from './adminLabNotes'
import { adminProjectsService } from './adminProjects'

afterEach(() => vi.unstubAllGlobals())

describe('apiErrorMessage', () => {
  it('reads FastAPI’s detail', () => {
    expect(apiErrorMessage({ detail: "Lab note with slug 'x' already exists" }, 409)).toBe(
      "Lab note with slug 'x' already exists",
    )
  })

  it('names each field that failed validation (422)', () => {
    const body = {
      detail: [
        { loc: ['body', 'slug'], msg: 'String should match pattern', type: 'string_pattern_mismatch' },
        { loc: ['body'], msg: 'Field required', type: 'missing' },
      ],
    }
    expect(apiErrorMessage(body, 422)).toBe('slug: String should match pattern; Field required')
  })

  it('falls back when the body says nothing readable', () => {
    expect(apiErrorMessage(null, 500, 'Failed to create project')).toBe('Failed to create project')
    expect(apiErrorMessage({}, 500)).toBe('Request failed (HTTP 500)')
    expect(apiErrorMessage(null, 429)).toBe('Too many requests. Please try again later.')
  })
})

describe('admin errors reach the editor', () => {
  const conflict = () =>
    new Response(JSON.stringify({ detail: "Project with slug 'x' already exists" }), { status: 409 })

  it('through authFetch (notes, messages, to-dos…)', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(conflict()))
    await expect(authFetch('/admin/lab-notes')).rejects.toThrow("Project with slug 'x' already exists")
  })

  it('through the projects service', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(conflict()))
    await expect(adminProjectsService.create({} as never)).rejects.toThrow(
      "Project with slug 'x' already exists",
    )
  })
})
