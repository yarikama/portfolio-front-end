import { useSyncExternalStore } from 'react'

// The initial theme is applied by an inline script in index.html before React
// loads, so dark-mode visitors never see a light flash. This module only reads
// and changes it afterwards.

const THEME_COLORS = { light: '#f8f7f4', dark: '#0f0f0f' } as const
const listeners = new Set<() => void>()

function isDark() {
  return document.documentElement.classList.contains('dark')
}

export function setDark(dark: boolean) {
  document.documentElement.classList.toggle('dark', dark)
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', dark ? THEME_COLORS.dark : THEME_COLORS.light)
  try {
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  } catch {
    // Storage can be unavailable (private mode); the theme still applies for this visit
  }
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

// Every toggle on the page reads the same state, so they stay in sync
export function useIsDark() {
  return useSyncExternalStore(subscribe, isDark, () => false)
}
