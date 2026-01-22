import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLabNotes } from '../../hooks'
import { useAuth } from '../../hooks/useAuth'
import { adminLabNotesService } from '../../services/api'
import { Plus, Edit, Trash2, LogOut, Loader2, Eye, EyeOff } from 'lucide-react'
import AdminNav from '../../components/admin/AdminNav'

export default function AdminNotesList() {
  const { notes, isLoading, error, refetch } = useLabNotes({ limit: 100 })
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return

    setDeletingId(id)
    try {
      await adminLabNotesService.delete(id)
      refetch()
    } catch (err) {
      alert('Failed to delete note')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-paper dark:bg-[#0f0f0f]">
      <AdminNav />

      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl font-light">Lab Notes</h1>
            <p className="text-sm text-zinc-faded">Manage your technical writings</p>
          </div>
          <Link
            to="/admin/notes/new"
            className="
              inline-flex items-center gap-2 px-4 py-2
              bg-ink text-paper dark:bg-white dark:text-zinc-900
              font-mono text-xs uppercase tracking-widest
              hover:opacity-90 transition-opacity
            "
          >
            <Plus size={14} />
            New Note
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        {isLoading ? (
          <div className="py-16 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-zinc-400 mb-4" />
            <p className="text-sm text-zinc-400">Loading notes...</p>
          </div>
        ) : error ? (
          <div className="py-16 text-center">
            <p className="text-zinc-faded">Failed to load notes</p>
            <button
              onClick={() => refetch()}
              className="mt-4 font-mono text-xs uppercase tracking-widest text-sage hover:underline"
            >
              Try again
            </button>
          </div>
        ) : notes.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-serif text-xl text-zinc-faded italic mb-4">No notes yet</p>
            <Link
              to="/admin/notes/new"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-sage hover:underline"
            >
              <Plus size={14} />
              Create your first note
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {notes.map((note) => (
              <div
                key={note.id}
                className="
                  flex items-center justify-between gap-4 p-4
                  border border-zinc-200 dark:border-zinc-800
                  hover:border-zinc-400 transition-colors
                "
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="font-serif text-lg truncate">{note.title}</h2>
                    {/* Note: published status would need to come from API */}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-zinc-400">
                    <span className="font-mono uppercase tracking-widest">
                      {new Date(note.date).toLocaleDateString()}
                    </span>
                    <span>·</span>
                    <span className="font-mono">{note.readTime}</span>
                    <span>·</span>
                    <span className="truncate">{note.tags.join(', ')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    to={`/notes/${note.slug}`}
                    target="_blank"
                    className="p-2 text-zinc-400 hover:text-ink transition-colors"
                    title="View"
                  >
                    <Eye size={16} />
                  </Link>
                  <Link
                    to={`/admin/notes/${note.id}/edit`}
                    className="p-2 text-zinc-400 hover:text-ink transition-colors"
                    title="Edit"
                  >
                    <Edit size={16} />
                  </Link>
                  <button
                    onClick={() => handleDelete(note.id, note.title)}
                    disabled={deletingId === note.id}
                    className="p-2 text-zinc-400 hover:text-red-500 transition-colors disabled:opacity-50"
                    title="Delete"
                  >
                    {deletingId === note.id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer nav */}
        <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <Link
            to="/"
            className="font-mono text-xs uppercase tracking-widest text-zinc-faded hover:text-ink transition-colors"
          >
            Back to Site
          </Link>
        </div>
      </main>
    </div>
  )
}
