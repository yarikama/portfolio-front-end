import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Check } from 'lucide-react'
import { TODAY, dayIndex } from '../../data/adminDesk'

// The day's routine. What is ticked is kept in this browser for the day
// only: tomorrow starts fresh.

function storageKey(date: Date) {
  return `admin-today:${dayIndex(date)}`
}

function load(date: Date): string[] {
  try {
    return JSON.parse(localStorage.getItem(storageKey(date)) ?? '[]')
  } catch {
    return []
  }
}

export default function TodayList({ date }: { date: Date }) {
  const [done, setDone] = useState<string[]>(() => load(date))

  // A new day while the page is open.
  useEffect(() => {
    setDone(load(date))
  }, [date])

  const toggle = (id: string) => {
    const next = done.includes(id) ? done.filter((d) => d !== id) : [...done, id]
    setDone(next)
    try {
      localStorage.setItem(storageKey(date), JSON.stringify(next))
    } catch {
      // Storage blocked: the ticks last until the page closes.
    }
  }

  return (
    <ul className="space-y-3">
      {TODAY.map((item) => {
        const checked = done.includes(item.id)
        const external = !item.href.startsWith('/')
        const linkClass = `text-sm transition-colors hover:text-sage ${
          checked ? 'text-zinc-400 line-through' : 'text-ink'
        }`
        return (
          <li key={item.id} className="flex items-center gap-3">
            <button
              onClick={() => toggle(item.id)}
              role="checkbox"
              aria-checked={checked}
              aria-label={item.label}
              className={`flex h-5 w-5 shrink-0 items-center justify-center border transition-colors ${
                checked ? 'border-sage bg-sage text-paper' : 'border-zinc-300 hover:border-sage'
              }`}
            >
              {checked && <Check size={12} aria-hidden="true" />}
            </button>
            {external ? (
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1 ${linkClass}`}
              >
                {item.label}
                <ArrowUpRight size={12} aria-hidden="true" className="text-zinc-400" />
              </a>
            ) : (
              <Link to={item.href} className={linkClass}>
                {item.label}
              </Link>
            )}
          </li>
        )
      })}
    </ul>
  )
}
