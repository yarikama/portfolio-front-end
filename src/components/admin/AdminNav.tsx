import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { FileText, FolderKanban, LogOut } from 'lucide-react'
import ThemeToggle from '../ui/ThemeToggle'

export default function AdminNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const isActive = (path: string) => {
    return location.pathname.startsWith(path)
  }

  return (
    <nav className="border-b border-zinc-200 dark:border-zinc-800 bg-paper dark:bg-[#0f0f0f]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <div className="flex items-center gap-8">
            <Link
              to="/admin"
              className="font-serif text-xl font-light hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
            >
              Admin
            </Link>

            {/* Nav Links */}
            <div className="flex items-center gap-1">
              <Link
                to="/admin/notes"
                className={`
                  inline-flex items-center gap-2 px-4 py-2
                  font-mono text-xs uppercase tracking-widest
                  transition-colors rounded
                  ${
                    isActive('/admin/notes')
                      ? 'bg-zinc-100 dark:bg-zinc-800 text-ink dark:text-white'
                      : 'text-zinc-500 hover:text-ink dark:hover:text-white'
                  }
                `}
              >
                <FileText size={14} />
                Notes
              </Link>
              <Link
                to="/admin/projects"
                className={`
                  inline-flex items-center gap-2 px-4 py-2
                  font-mono text-xs uppercase tracking-widest
                  transition-colors rounded
                  ${
                    isActive('/admin/projects')
                      ? 'bg-zinc-100 dark:bg-zinc-800 text-ink dark:text-white'
                      : 'text-zinc-500 hover:text-ink dark:hover:text-white'
                  }
                `}
              >
                <FolderKanban size={14} />
                Projects
              </Link>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs uppercase tracking-widest text-zinc-400 hover:text-ink dark:hover:text-white transition-colors"
            >
              View Site
            </a>
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="p-2 text-zinc-400 hover:text-ink dark:hover:text-white transition-colors"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
