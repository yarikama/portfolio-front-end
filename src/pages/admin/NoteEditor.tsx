import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { adminLabNotesService, type CreateLabNoteData } from '../../services/api'
import { useLabNote } from '../../hooks'
import { ArrowLeft, Save, Loader2, Eye } from 'lucide-react'
import AdminNav from '../../components/admin/AdminNav'

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

function estimateReadTime(content: string): string {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  return `${minutes} min read`
}

export default function NoteEditor() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEditing = Boolean(id)

  const [formData, setFormData] = useState<CreateLabNoteData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    tags: [],
    readTime: '1 min read',
    date: new Date().toISOString().split('T')[0],
    published: false,
  })
  const [tagsInput, setTagsInput] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [autoSlug, setAutoSlug] = useState(true)

  // Load existing note for editing
  const { note: existingNote, isLoading: isLoadingNote } = useLabNote(id || '')

  useEffect(() => {
    if (existingNote && isEditing) {
      setFormData({
        title: existingNote.title,
        slug: existingNote.slug,
        excerpt: existingNote.excerpt,
        content: existingNote.content,
        tags: existingNote.tags,
        readTime: existingNote.readTime,
        date: existingNote.date,
        published: existingNote.published,
      })
      setTagsInput(existingNote.tags.join(', '))
      setAutoSlug(false)
    }
  }, [existingNote, isEditing])

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: autoSlug ? generateSlug(title) : prev.slug,
    }))
  }

  const handleContentChange = (content: string) => {
    setFormData((prev) => ({
      ...prev,
      content,
      readTime: estimateReadTime(content),
    }))
  }

  const handleTagsChange = (value: string) => {
    setTagsInput(value)
    const tags = value
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
    setFormData((prev) => ({ ...prev, tags }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSaving(true)

    try {
      if (isEditing && id) {
        await adminLabNotesService.update(id, formData)
      } else {
        await adminLabNotesService.create(formData)
      }
      navigate('/admin/notes')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save note')
    } finally {
      setIsSaving(false)
    }
  }

  if (isEditing && isLoadingNote) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper dark:bg-[#0f0f0f]">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-paper dark:bg-[#0f0f0f]">
      <AdminNav />

      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 sticky top-0 bg-paper dark:bg-[#0f0f0f] z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/admin/notes"
              className="p-2 text-zinc-faded hover:text-ink transition-colors"
            >
              <ArrowLeft size={18} />
            </Link>
            <h1 className="font-serif text-xl font-light">
              {isEditing ? 'Edit Note' : 'New Note'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {isEditing && existingNote && (
              <Link
                to={`/notes/${existingNote.slug}`}
                target="_blank"
                className="p-2 text-zinc-faded hover:text-ink transition-colors"
                title="Preview"
              >
                <Eye size={18} />
              </Link>
            )}
            <button
              type="submit"
              form="note-form"
              disabled={isSaving}
              className="
                inline-flex items-center gap-2 px-4 py-2
                bg-ink text-paper dark:bg-white dark:text-zinc-900
                font-mono text-xs uppercase tracking-widest
                hover:opacity-90 transition-opacity
                disabled:opacity-50
              "
            >
              {isSaving ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Save size={14} />
              )}
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 p-4 border border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <form id="note-form" onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block font-mono text-xs uppercase tracking-widest text-zinc-400 mb-2">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
              className="
                w-full px-4 py-3 bg-transparent border border-zinc-200 dark:border-zinc-700
                font-serif text-2xl
                focus:outline-none focus:border-ink dark:focus:border-zinc-400
                transition-colors
              "
              placeholder="Article title"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block font-mono text-xs uppercase tracking-widest text-zinc-400 mb-2">
              Slug
              <button
                type="button"
                onClick={() => setAutoSlug(!autoSlug)}
                className="ml-2 text-sage hover:underline normal-case"
              >
                ({autoSlug ? 'auto' : 'manual'})
              </button>
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => {
                setAutoSlug(false)
                setFormData((prev) => ({ ...prev, slug: e.target.value }))
              }}
              required
              className="
                w-full px-4 py-3 bg-transparent border border-zinc-200 dark:border-zinc-700
                font-mono text-sm
                focus:outline-none focus:border-ink dark:focus:border-zinc-400
                transition-colors
              "
              placeholder="article-url-slug"
            />
          </div>

          {/* Date & Published */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block font-mono text-xs uppercase tracking-widest text-zinc-400 mb-2">
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                required
                className="
                  w-full px-4 py-3 bg-transparent border border-zinc-200 dark:border-zinc-700
                  font-mono text-sm
                  focus:outline-none focus:border-ink dark:focus:border-zinc-400
                  transition-colors
                "
              />
            </div>
            <div>
              <label className="block font-mono text-xs uppercase tracking-widest text-zinc-400 mb-2">
                Status
              </label>
              <label className="flex items-center gap-3 px-4 py-3 border border-zinc-200 dark:border-zinc-700 cursor-pointer hover:border-zinc-400 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData((prev) => ({ ...prev, published: e.target.checked }))}
                  className="w-4 h-4"
                />
                <span className="font-mono text-sm">Published</span>
              </label>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block font-mono text-xs uppercase tracking-widest text-zinc-400 mb-2">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => handleTagsChange(e.target.value)}
              className="
                w-full px-4 py-3 bg-transparent border border-zinc-200 dark:border-zinc-700
                font-mono text-sm
                focus:outline-none focus:border-ink dark:focus:border-zinc-400
                transition-colors
              "
              placeholder="RAG, Python, LlamaIndex"
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block font-mono text-xs uppercase tracking-widest text-zinc-400 mb-2">
              Excerpt
            </label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
              required
              rows={2}
              className="
                w-full px-4 py-3 bg-transparent border border-zinc-200 dark:border-zinc-700
                font-serif text-base leading-relaxed resize-none
                focus:outline-none focus:border-ink dark:focus:border-zinc-400
                transition-colors
              "
              placeholder="Brief description for listing pages..."
            />
          </div>

          {/* Content */}
          <div>
            <label className="block font-mono text-xs uppercase tracking-widest text-zinc-400 mb-2">
              Content (Markdown)
              <span className="ml-2 normal-case text-zinc-500">· {formData.readTime}</span>
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => handleContentChange(e.target.value)}
              required
              rows={20}
              className="
                w-full px-4 py-3 bg-transparent border border-zinc-200 dark:border-zinc-700
                font-mono text-sm leading-relaxed resize-y
                focus:outline-none focus:border-ink dark:focus:border-zinc-400
                transition-colors
              "
              placeholder="# Your article content in Markdown..."
            />
          </div>
        </form>
      </main>
    </div>
  )
}
