import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Loader2 } from 'lucide-react'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { login, isLoading, error } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = (location.state as { from?: Location })?.from?.pathname || '/admin/notes'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await login({ username, password })
    if (success) {
      navigate(from, { replace: true })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper dark:bg-[#0f0f0f] px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-light tracking-tight mb-2">Admin</h1>
          <p className="text-sm text-zinc-faded">Sign in to manage content</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 border border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <div>
            <label
              htmlFor="username"
              className="block font-mono text-xs uppercase tracking-widest text-zinc-400 mb-2"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              className="
                w-full px-4 py-3 bg-transparent border border-zinc-200 dark:border-zinc-700
                font-mono text-sm
                focus:outline-none focus:border-ink dark:focus:border-zinc-400
                transition-colors duration-300
              "
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block font-mono text-xs uppercase tracking-widest text-zinc-400 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="
                w-full px-4 py-3 bg-transparent border border-zinc-200 dark:border-zinc-700
                font-mono text-sm
                focus:outline-none focus:border-ink dark:focus:border-zinc-400
                transition-colors duration-300
              "
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="
              w-full py-3 border border-ink dark:border-zinc-400
              font-mono text-sm uppercase tracking-widest
              hover:bg-ink hover:text-paper dark:hover:bg-zinc-400 dark:hover:text-zinc-900
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-300
              flex items-center justify-center gap-2
            "
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <a
            href="/"
            className="font-mono text-xs uppercase tracking-widest text-zinc-faded hover:text-ink transition-colors"
          >
            Back to Site
          </a>
        </div>
      </div>
    </div>
  )
}
