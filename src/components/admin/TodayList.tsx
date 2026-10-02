import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Check, Plus, X } from 'lucide-react'
import { adminTodosService, localDay, type Todo } from '../../services/api'

// The day's to-dos, kept by the API: a NeetCode problem every day, what the
// owner adds, and whatever was left undone on earlier days, marked with the
// day it was for.

const SHORT_DAY = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })

function carriedFrom(todo: Todo, today: string): string | null {
  if (todo.day >= today) return null
  const yesterday = new Date(`${today}T00:00:00Z`)
  yesterday.setUTCDate(yesterday.getUTCDate() - 1)
  if (todo.day === yesterday.toISOString().slice(0, 10)) return 'from yesterday'
  return `from ${SHORT_DAY.format(new Date(`${todo.day}T00:00:00Z`))}`
}

export default function TodayList({ date }: { date: Date }) {
  const today = localDay(date)
  const [todos, setTodos] = useState<Todo[] | null>(null)
  const [failed, setFailed] = useState(false)
  const [draft, setDraft] = useState('')

  const load = useCallback(async () => {
    try {
      setTodos(await adminTodosService.list(today))
      setFailed(false)
    } catch {
      setFailed(true)
    }
  }, [today])

  useEffect(() => {
    load()
  }, [load])

  const replace = (next: Todo) =>
    setTodos((current) => current?.map((todo) => (todo.id === next.id ? next : todo)) ?? null)

  const toggle = async (todo: Todo) => {
    const done = !todo.doneOn
    replace({ ...todo, doneOn: done ? today : null })
    try {
      replace(await adminTodosService.tick(todo.id, done, today))
    } catch {
      replace(todo)
    }
  }

  const remove = async (todo: Todo) => {
    setTodos((current) => current?.filter((other) => other.id !== todo.id) ?? null)
    try {
      await adminTodosService.remove(todo.id)
    } catch {
      load()
    }
  }

  const add = async (event: React.FormEvent) => {
    event.preventDefault()
    const text = draft.trim()
    if (!text) return
    setDraft('')
    try {
      const todo = await adminTodosService.add(text, today)
      setTodos((current) => [...(current ?? []), todo])
    } catch {
      setDraft(text)
    }
  }

  if (failed) {
    return <p className="text-sm text-zinc-faded">The to-dos are unavailable right now.</p>
  }

  return (
    <div>
      <ul className="space-y-3">
        {todos === null && <li className="h-5 w-48 animate-pulse bg-paper-dark" />}
        {todos?.map((todo) => {
          const done = Boolean(todo.doneOn)
          const from = carriedFrom(todo, today)
          const external = todo.href && !todo.href.startsWith('/')
          const textClass = `text-sm transition-colors ${done ? 'text-zinc-400 line-through' : 'text-ink'}`
          return (
            <li key={todo.id} className="group flex items-center gap-3">
              <button
                onClick={() => toggle(todo)}
                role="checkbox"
                aria-checked={done}
                aria-label={todo.text}
                className={`flex h-5 w-5 shrink-0 items-center justify-center border transition-colors ${
                  done ? 'border-sage bg-sage text-paper' : 'border-zinc-300 hover:border-sage'
                }`}
              >
                {done && <Check size={12} aria-hidden="true" />}
              </button>
              {todo.href ? (
                external ? (
                  <a
                    href={todo.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1 hover:text-sage ${textClass}`}
                  >
                    {todo.text}
                    <ArrowUpRight size={12} aria-hidden="true" className="text-zinc-400" />
                  </a>
                ) : (
                  <Link to={todo.href} className={`hover:text-sage ${textClass}`}>
                    {todo.text}
                  </Link>
                )
              ) : (
                <span className={textClass}>{todo.text}</span>
              )}
              {from && !done && (
                <span className="font-mono text-[10px] uppercase tracking-widest text-amber-600 dark:text-amber-500">
                  {from}
                </span>
              )}
              <button
                onClick={() => remove(todo)}
                aria-label={`Remove: ${todo.text}`}
                title="Remove"
                className="ml-auto p-1 text-zinc-400 opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100 focus-visible:opacity-100"
              >
                <X size={14} aria-hidden="true" />
              </button>
            </li>
          )
        })}
      </ul>

      <form onSubmit={add} className="mt-4 flex items-center gap-3">
        <Plus size={14} aria-hidden="true" className="ml-[3px] shrink-0 text-zinc-400" />
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          maxLength={500}
          placeholder="Add a to-do, then Enter"
          aria-label="Add a to-do"
          className="flex-1 border-b border-transparent bg-transparent py-1 text-sm placeholder:text-zinc-400 focus:border-zinc-300 focus:outline-none"
        />
      </form>
    </div>
  )
}
