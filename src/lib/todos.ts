/**
 * The past to-do that what is typed starts (ignoring case), if there is one
 * and it says more: completed as gray text after the caret.
 */
export function completion(typed: string, history: string[]): string | null {
  if (typed.trim().length < 2) return null
  const start = typed.toLowerCase()
  return history.find((text) => text.length > typed.length && text.toLowerCase().startsWith(start)) ?? null
}
