import type { ApiError } from '../../types'

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.yarikama.com/api/v1'

export class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`

    // Only a request with a body says what it is. A GET with Content-Type
    // is not a "simple" request, so the browser would first send a CORS
    // preflight: one more round trip to the origin, which the edge cache
    // never answers.
    const config: RequestInit = {
      ...options,
      headers: {
        ...(options.body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers,
      },
    }

    const response = await fetch(url, config)

    if (!response.ok) {
      const body: unknown = await response.json().catch(() => null)
      const error = (body as Partial<ApiError> | null)?.error
      throw new ApiRequestError(
        apiErrorMessage(body, response.status),
        error?.code ?? `HTTP_${response.status}`,
        response.status,
        error?.details
      )
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T
    }

    return response.json()
  }

  async get<T>(endpoint: string, params?: Record<string, string | number | boolean | undefined>): Promise<T> {
    let finalEndpoint = endpoint

    if (params) {
      const searchParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, String(value))
        }
      })
      const queryString = searchParams.toString()
      finalEndpoint = queryString ? `${endpoint}?${queryString}` : endpoint
    }

    return this.request<T>(finalEndpoint)
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    })
  }
}

/**
 * A readable message from an error response. The API (FastAPI) answers
 * {"detail": "..."}, e.g. "Too many login attempts. Try again in 15
 * minutes." on a 429, or on a 422 a list with one entry per field that
 * failed validation; the {"error": {"message"}} shape is still accepted.
 * `fallback` is for a response that says nothing readable.
 */
export function apiErrorMessage(body: unknown, status: number, fallback?: string): string {
  if (body && typeof body === 'object') {
    const { error, detail } = body as { error?: { message?: string }; detail?: unknown }
    if (error?.message) return error.message
    if (typeof detail === 'string') return detail
    if (Array.isArray(detail)) {
      const problems = detail.flatMap((item) => {
        const { loc, msg } = (item ?? {}) as { loc?: unknown[]; msg?: unknown }
        if (typeof msg !== 'string') return []
        // loc starts with where the value was (body, query); a field follows.
        const field = Array.isArray(loc) && loc.length > 1 ? loc.at(-1) : undefined
        return [typeof field === 'string' ? `${field}: ${msg}` : msg]
      })
      if (problems.length > 0) return problems.join('; ')
    }
  }
  if (status === 429) return 'Too many requests. Please try again later.'
  return fallback ?? `Request failed (HTTP ${status})`
}

export class ApiRequestError extends Error {
  code: string
  status: number
  details?: Array<{ field: string; message: string }>

  constructor(
    message: string,
    code: string,
    status: number,
    details?: Array<{ field: string; message: string }>
  ) {
    super(message)
    this.name = 'ApiRequestError'
    this.code = code
    this.status = status
    this.details = details
  }
}

export const apiClient = new ApiClient()
