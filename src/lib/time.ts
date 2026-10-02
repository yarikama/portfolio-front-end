/** Time left until the next local midnight, as HH:MM:SS. */
export function untilMidnight(now: Date): string {
  const midnight = new Date(now)
  midnight.setHours(24, 0, 0, 0)
  const seconds = Math.max(0, Math.floor((midnight.getTime() - now.getTime()) / 1000))
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(Math.floor(seconds / 3600))}:${pad(Math.floor((seconds % 3600) / 60))}:${pad(seconds % 60)}`
}
