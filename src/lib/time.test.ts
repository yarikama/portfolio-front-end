import { describe, expect, it } from 'vitest'
import { untilMidnight } from './time'

describe('untilMidnight', () => {
  it('counts down to the end of the local day', () => {
    expect(untilMidnight(new Date(2026, 9, 2, 18, 30, 15))).toBe('05:29:45')
    expect(untilMidnight(new Date(2026, 9, 2, 0, 0, 0))).toBe('24:00:00')
    expect(untilMidnight(new Date(2026, 9, 2, 23, 59, 59))).toBe('00:00:01')
  })
})
