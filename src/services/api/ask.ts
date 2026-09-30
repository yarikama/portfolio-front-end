import { API_BASE_URL, ApiRequestError, apiErrorMessage } from './client'

export interface Citation {
  id: string // what the answer cites: P1, N1, R1
  kind: 'project' | 'note' | 'resume'
  title: string
  url: string | null
}

export interface AnswerEnd {
  citations: Citation[]
  // The answer hit the backend's length cap and ends mid-sentence.
  truncated: boolean
}

// A passage the visitor highlighted on the site to ask about, and the path
// of the page it is on.
export interface Passage {
  text: string
  page: string
}

// The API's limit on a passage; longer selections are cut to it.
export const MAX_PASSAGE = 600

interface AskHandlers {
  onToken: (text: string) => void
  signal?: AbortSignal
  passage?: Passage | null
}

/**
 * Ask a question about Henry's work, optionally about a passage on the
 * site. The answer streams back as server-sent
 * events: `token` pieces, then `done` with the sources it cited (and whether
 * it was cut at the length cap), or `error`
 * if it broke off. Limits and an offline model are ordinary error responses
 * (429, 503) and throw ApiRequestError with the API's message.
 */
export async function askQuestion(
  question: string,
  { onToken, signal, passage }: AskHandlers
): Promise<AnswerEnd> {
  const body = passage ? { question, quote: passage.text, page: passage.page } : { question }
  const response = await fetch(`${API_BASE_URL}/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal,
  })
  if (!response.ok || !response.body) {
    const body: unknown = await response.json().catch(() => null)
    throw new ApiRequestError(
      apiErrorMessage(body, response.status),
      `HTTP_${response.status}`,
      response.status
    )
  }

  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader()
  let buffer = ''
  for (;;) {
    const { value, done } = await reader.read()
    if (done) break
    buffer += value
    // Events end with a blank line; the last piece may still be incomplete.
    const events = buffer.split('\n\n')
    buffer = events.pop() ?? ''
    for (const raw of events) {
      const { event, data } = parseEvent(raw)
      if (event === 'token') onToken(data.text)
      else if (event === 'done') return { citations: data.citations, truncated: !!data.truncated }
      else if (event === 'error') throw new ApiRequestError(data.detail, 'STREAM_ERROR', 502)
    }
  }
  throw new ApiRequestError('The answer broke off. Try again.', 'STREAM_ERROR', 502)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseEvent(raw: string): { event: string; data: any } {
  let event = 'message'
  let data = ''
  for (const line of raw.split('\n')) {
    if (line.startsWith('event: ')) event = line.slice(7)
    else if (line.startsWith('data: ')) data += line.slice(6)
  }
  return { event, data: data ? JSON.parse(data) : {} }
}
