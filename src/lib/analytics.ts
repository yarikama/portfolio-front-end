import type { BeforeSendEvent } from '@vercel/analytics/react'

// Vercel Web Analytics counts visitors to the public site. The owner is not a
// visitor: admin pages are never counted, and a browser that has signed in to
// the admin is remembered, so the owner's own visits to the site are skipped too.

const OWNER_KEY = 'analytics-owner'

export function markOwner() {
  try {
    localStorage.setItem(OWNER_KEY, '1')
  } catch {
    // Storage can be unavailable (private mode); admin pages are still skipped
  }
}

function isOwner(): boolean {
  try {
    return localStorage.getItem(OWNER_KEY) === '1'
  } catch {
    return false
  }
}

export function beforeSend(event: BeforeSendEvent): BeforeSendEvent | null {
  if (new URL(event.url).pathname.startsWith('/admin')) return null
  return isOwner() ? null : event
}
