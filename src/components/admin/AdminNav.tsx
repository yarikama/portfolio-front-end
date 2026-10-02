import { Link, useLocation, useNavigate } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import {
  ArrowUpRight,
  ChevronDown,
  FileText,
  FolderKanban,
  Gauge,
  GitBranch,
  Inbox,
  LogOut,
  MessageSquare,
  Tags,
  UserRound,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useNewQuestions, useUnreadMessages } from '../../hooks/useUnreadMessages'
import ThemeToggle from '../ui/ThemeToggle'

interface SubItem {
  label: string
  href: string
  icon: LucideIcon
  // Another site, opened in a new tab.
  external?: boolean
  // Shows a count: contact messages not opened yet, or visitors'
  // questions since Questions was last opened.
  count?: 'unread' | 'new'
}

interface Group {
  label: string
  // Where the group's own label goes: its most used page.
  href: string
  children: SubItem[]
}

const GROUPS: Group[] = [
  {
    label: 'Archives',
    href: '/admin/notes',
    children: [
      { label: 'Notes', href: '/admin/notes', icon: FileText },
      { label: 'Projects', href: '/admin/projects', icon: FolderKanban },
      { label: 'Categories', href: '/admin/categories', icon: Tags },
    ],
  },
  {
    label: 'Monitoring',
    href: '/admin/messages',
    children: [
      { label: 'Messages', href: '/admin/messages', icon: Inbox, count: 'unread' },
      { label: 'Questions', href: '/admin/questions', icon: MessageSquare, count: 'new' },
      // Dashboards for the home cluster. Both sit behind Cloudflare Access,
      // so a visitor who finds these links only reaches a login page.
      { label: 'Grafana', href: 'https://grafana.yarikama.com', icon: Gauge, external: true },
      { label: 'Argo CD', href: 'https://argocd.yarikama.com', icon: GitBranch, external: true },
    ],
  },
]

const SUB_LINK = `flex items-center gap-3 px-4 py-2.5 font-mono text-xs uppercase tracking-widest
  transition-colors hover:bg-paper-dark focus-visible:bg-paper-dark`

export default function AdminNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const counts = { unread: useUnreadMessages() ?? 0, new: useNewQuestions() ?? 0 }
  const badge = (n: number, label: string, className = '') =>
    n > 0 ? (
      <span
        aria-label={`${n} ${label}`}
        className={`min-w-5 rounded-full bg-sage px-1.5 text-center font-mono text-[0.625rem] leading-5 text-paper ${className}`}
      >
        {n}
      </span>
    ) : null

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  const isActive = (sub: SubItem) => !sub.external && location.pathname.startsWith(sub.href)

  const renderSubLink = (sub: SubItem) => {
    const className = `${SUB_LINK} ${
      isActive(sub) ? 'text-ink dark:text-white' : 'text-zinc-500 hover:text-ink dark:hover:text-white'
    }`
    const content = (
      <>
        <sub.icon aria-hidden="true" className="w-4 h-4 shrink-0" />
        {sub.label}
        {sub.count && badge(counts[sub.count], sub.count, 'ml-auto')}
        {sub.external && <ArrowUpRight aria-hidden="true" className="w-3 h-3 ml-auto" />}
      </>
    )
    if (sub.external) {
      return (
        <a href={sub.href} target="_blank" rel="noopener noreferrer" className={className}>
          {content}
        </a>
      )
    }
    return (
      <Link to={sub.href} aria-current={isActive(sub) ? 'page' : undefined} className={className}>
        {content}
      </Link>
    )
  }

  // Hover or keyboard focus opens it (CSS only), as in the site's header.
  // The padding on top bridges the gap, so the pointer can travel from the
  // label into the panel, and it closes after a short delay rather than as
  // soon as the pointer slips off.
  const renderGroup = (group: Group) => {
    const active = group.children.some(isActive)
    return (
      <li key={group.label} className="group relative">
        <Link
          to={group.href}
          className={`
            inline-flex items-center gap-1.5 px-4 py-2 rounded
            font-mono text-xs uppercase tracking-widest transition-colors
            ${
              active
                ? 'bg-zinc-100 dark:bg-zinc-800 text-ink dark:text-white'
                : 'text-zinc-500 hover:text-ink dark:hover:text-white'
            }
          `}
        >
          {group.label}
          {badge(
            group.children.reduce((sum, sub) => sum + (sub.count ? counts[sub.count] : 0), 0),
            'new or unread',
          )}
          <ChevronDown
            aria-hidden="true"
            className="w-3 h-3 transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180 motion-reduce:transition-none"
          />
        </Link>
        <div
          className="absolute left-0 top-full pt-2 z-50
            invisible opacity-0 translate-y-1 delay-150
            group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 group-hover:delay-0
            group-focus-within:visible group-focus-within:opacity-100 group-focus-within:translate-y-0 group-focus-within:delay-0
            transition-[opacity,translate,visibility] duration-150 motion-reduce:transition-none"
        >
          <ul
            aria-label={group.label}
            className="min-w-48 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-paper shadow-lg"
          >
            {group.children.map((sub) => (
              <li key={sub.label}>{renderSubLink(sub)}</li>
            ))}
          </ul>
        </div>
      </li>
    )
  }

  return (
    <nav className="border-b border-zinc-200 dark:border-zinc-800 bg-paper dark:bg-[#0f0f0f]">
      <div className="max-w-7xl mx-auto px-6">
        {/* On a phone the menus take a second row, below the mark and the
            buttons, instead of pushing the buttons off the screen. */}
        <div className="flex flex-wrap items-center justify-between gap-y-1 py-3 sm:h-16 sm:flex-nowrap sm:py-0">
          <div className="contents sm:flex sm:items-center sm:gap-8">
            {/* The site's own mark, opening the site in a new tab so the
                editor stays open here. */}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              title="View site"
              className="font-serif text-xl font-light tracking-tight hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
            >
              &lt;H,H&gt;
            </a>

            <ul className="order-last -ml-4 flex basis-full items-center gap-1 sm:order-none sm:ml-0 sm:basis-auto">
              {GROUPS.map(renderGroup)}
            </ul>
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <span
                title={`Signed in as ${user.email}`}
                className="hidden md:inline-flex items-center gap-1.5 max-w-[16rem] font-mono text-xs text-zinc-400"
              >
                <UserRound size={14} className="shrink-0" />
                <span className="truncate">{user.email}</span>
              </span>
            )}
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
