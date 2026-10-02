import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

// The site's Content-Security-Policy allows inline scripts only by hash, so
// editing the theme script in index.html without updating vercel.json would
// stop it from running once the policy is enforced.
const read = (file: string) => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8')

interface Header {
  key: string
  value: string
}

function policy(): string {
  const config = JSON.parse(read('vercel.json')) as {
    headers: { source: string; headers: Header[] }[]
  }
  const all = config.headers.find((rule) => rule.source === '/(.*)')!.headers
  const csp = all.find((h) => h.key.startsWith('Content-Security-Policy'))
  return csp!.value
}

function directive(name: string): string[] {
  const found = policy()
    .split(';')
    .map((part) => part.trim().split(/\s+/))
    .find(([key]) => key === name)
  return found ? found.slice(1) : []
}

describe('the Content-Security-Policy in vercel.json', () => {
  it('allows every inline script in index.html by its hash', () => {
    const scripts = [...read('index.html').matchAll(/<script>([\s\S]*?)<\/script>/g)]
    expect(scripts.length).toBeGreaterThan(0)
    for (const [, body] of scripts) {
      const hash = createHash('sha256').update(body).digest('base64')
      expect(directive('script-src')).toContain(`'sha256-${hash}'`)
    }
  })

  it('never allows inline scripts or eval wholesale', () => {
    expect(directive('script-src')).not.toContain("'unsafe-inline'")
    expect(directive('script-src')).not.toContain("'unsafe-eval'")
  })

  it('lets the site reach its API and report violations to it', () => {
    expect(directive('connect-src')).toContain('https://api.yarikama.com')
    expect(directive('report-uri')).toEqual(['https://api.yarikama.com/api/v1/csp-report'])
  })
})
