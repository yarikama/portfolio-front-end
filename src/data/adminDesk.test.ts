import { describe, expect, it } from 'vitest'
import { PROMPTS, THOUGHTS, dayIndex, forToday, greeting } from './adminDesk'

describe('the admin desk', () => {
  it('keeps the same thought all day, and moves on the next', () => {
    const morning = new Date(2026, 9, 2, 0, 5)
    const night = new Date(2026, 9, 2, 23, 55)
    const tomorrow = new Date(2026, 9, 3, 8, 0)

    expect(forToday(THOUGHTS, morning)).toBe(forToday(THOUGHTS, night))
    expect(dayIndex(tomorrow)).toBe(dayIndex(morning) + 1)
    expect(forToday(THOUGHTS, tomorrow)).not.toBe(forToday(THOUGHTS, morning))
  })

  it('greets by the time of day', () => {
    expect(greeting(new Date(2026, 9, 2, 2))).toBe('Still up')
    expect(greeting(new Date(2026, 9, 2, 9))).toBe('Good morning')
    expect(greeting(new Date(2026, 9, 2, 14))).toBe('Good afternoon')
    expect(greeting(new Date(2026, 9, 2, 21))).toBe('Good evening')
  })

  it('writes without em dashes', () => {
    for (const line of [...THOUGHTS, ...PROMPTS]) expect(line).not.toContain('—')
  })
})
