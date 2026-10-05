import { adminFetch } from './auth'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.yarikama.com/api/v1'

export interface VisitorCount {
  // A path, a referrer's host ('' for none), a country code or a device
  // type. Vercel folds what is past the top ten into "Others".
  name: string
  pageviews: number
  visitors: number
}

export interface VisitorDay {
  date: string // YYYY-MM-DD, a UTC day
  pageviews: number
  visitors: number
}

export interface VisitorsReport {
  since: string
  until: string
  pageviews: number
  visitors: number
  days: VisitorDay[] // oldest first, every day of the range
  pages: VisitorCount[]
  referrers: VisitorCount[]
  countries: VisitorCount[]
  devices: VisitorCount[]
}

// `off`: the API has no Vercel token yet. Otherwise Vercel or the API failed.
export class VisitorsUnavailableError extends Error {
  readonly off: boolean
  constructor(off: boolean) {
    super(off ? 'Vercel Web Analytics is not set up' : 'Vercel Web Analytics is unavailable')
    this.off = off
  }
}

// From Vercel Web Analytics, through the API: production only, without admin
// pages or the owner's own browsers.
export const adminVisitorsService = {
  async report(days: number): Promise<VisitorsReport> {
    const response = await adminFetch(`${API_BASE_URL}/admin/visitors?days=${days}`)
    // The session ended (expired, or signed out elsewhere).
    if (response.status === 401) {
      window.location.href = '/admin/login'
      throw new Error('Unauthorized')
    }
    if (!response.ok) throw new VisitorsUnavailableError(response.status === 503)
    const { data } = await response.json()
    return data
  },
}
