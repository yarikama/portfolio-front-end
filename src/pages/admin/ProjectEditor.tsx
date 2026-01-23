import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom'
import { adminProjectsService, projectsService, type CreateProjectData } from '../../services/api'
import { ArrowLeft, Save, Loader2, ExternalLink } from 'lucide-react'
import AdminNav from '../../components/admin/AdminNav'
import type { Project, ProjectCategory } from '../../types'

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export default function ProjectEditor() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const isEditing = Boolean(id)

  // Get project data from location state (passed from list page)
  const projectFromState = location.state?.project as Project | undefined

  const [formData, setFormData] = useState<CreateProjectData>({
    slug: '',
    title: '',
    description: '',
    tags: [],
    category_id: '',
    year: new Date().getFullYear().toString(),
    link: '',
    github: '',
    metrics: '',
    formula: '',
    featured: false,
    order: 0,
    published: false,
  })
  const [categories, setCategories] = useState<ProjectCategory[]>([])
  const [tagsInput, setTagsInput] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isLoadingProject, setIsLoadingProject] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [autoSlug, setAutoSlug] = useState(true)

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await projectsService.getCategories()
        // Filter out 'all' category for the dropdown
        const filteredCategories = response.data.filter((c) => c.name !== 'all')
        setCategories(filteredCategories)
        // Set default category_id if not editing
        if (!isEditing && filteredCategories.length > 0) {
          setFormData((prev) => ({ ...prev, category_id: filteredCategories[0].id }))
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err)
      }
    }
    fetchCategories()
  }, [isEditing])

  // Load existing project for editing
  useEffect(() => {
    if (isEditing && id) {
      // If we have project data from location state, use it directly
      if (projectFromState && projectFromState.id === id) {
        setFormData({
          slug: projectFromState.slug,
          title: projectFromState.title,
          description: projectFromState.description,
          tags: projectFromState.tags,
          category_id: projectFromState.category.id,
          year: projectFromState.year,
          link: projectFromState.link || '',
          github: projectFromState.github || '',
          metrics: projectFromState.metrics || '',
          formula: projectFromState.formula || '',
          featured: projectFromState.featured,
          order: projectFromState.order,
          published: projectFromState.published || false,
        })
        setTagsInput(projectFromState.tags.join(', '))
        setAutoSlug(false)
        setIsLoadingProject(false)
      } else {
        // Otherwise show error
        setError('Project data not found. Please go back to the projects list.')
        setIsLoadingProject(false)
      }
    }
  }, [id, isEditing, projectFromState])

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: autoSlug ? generateSlug(title) : prev.slug,
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
        await adminProjectsService.update(id, formData)
      } else {
        await adminProjectsService.create(formData)
      }
      navigate('/admin/projects')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save project')
    } finally {
      setIsSaving(false)
    }
  }

  if (isEditing && isLoadingProject) {
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
              to="/admin/projects"
              className="p-2 text-zinc-faded hover:text-ink transition-colors"
            >
              <ArrowLeft size={18} />
            </Link>
            <h1 className="font-serif text-xl font-light">
              {isEditing ? 'Edit Project' : 'New Project'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {isEditing && projectFromState && formData.link && (
              <a
                href={formData.link}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-zinc-faded hover:text-ink transition-colors"
                title="View Live"
              >
                <ExternalLink size={18} />
              </a>
            )}
            <button
              type="submit"
              form="project-form"
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

        <form id="project-form" onSubmit={handleSubmit} className="space-y-6">
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
              placeholder="Project title"
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
              placeholder="project-url-slug"
            />
          </div>

          {/* Category, Year, Order */}
          <div className="grid sm:grid-cols-3 gap-6">
            <div>
              <label className="block font-mono text-xs uppercase tracking-widest text-zinc-400 mb-2">
                Category
              </label>
              <select
                value={formData.category_id}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    category_id: e.target.value,
                  }))
                }
                required
                className="
                  w-full px-4 py-3 bg-transparent border border-zinc-200 dark:border-zinc-700
                  font-mono text-sm
                  focus:outline-none focus:border-ink dark:focus:border-zinc-400
                  transition-colors
                "
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-mono text-xs uppercase tracking-widest text-zinc-400 mb-2">
                Year
              </label>
              <input
                type="text"
                value={formData.year}
                onChange={(e) => setFormData((prev) => ({ ...prev, year: e.target.value }))}
                required
                className="
                  w-full px-4 py-3 bg-transparent border border-zinc-200 dark:border-zinc-700
                  font-mono text-sm
                  focus:outline-none focus:border-ink dark:focus:border-zinc-400
                  transition-colors
                "
                placeholder="2024"
              />
            </div>
            <div>
              <label className="block font-mono text-xs uppercase tracking-widest text-zinc-400 mb-2">
                Order
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, order: parseInt(e.target.value) || 0 }))
                }
                required
                className="
                  w-full px-4 py-3 bg-transparent border border-zinc-200 dark:border-zinc-700
                  font-mono text-sm
                  focus:outline-none focus:border-ink dark:focus:border-zinc-400
                  transition-colors
                "
                placeholder="0"
              />
            </div>
          </div>

          {/* Featured & Published */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block font-mono text-xs uppercase tracking-widest text-zinc-400 mb-2">
                Features
              </label>
              <label className="flex items-center gap-3 px-4 py-3 border border-zinc-200 dark:border-zinc-700 cursor-pointer hover:border-zinc-400 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData((prev) => ({ ...prev, featured: e.target.checked }))}
                  className="w-4 h-4"
                />
                <span className="font-mono text-sm">Featured Project</span>
              </label>
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
              placeholder="React, TypeScript, Node.js"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-mono text-xs uppercase tracking-widest text-zinc-400 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              required
              rows={4}
              className="
                w-full px-4 py-3 bg-transparent border border-zinc-200 dark:border-zinc-700
                font-serif text-base leading-relaxed resize-none
                focus:outline-none focus:border-ink dark:focus:border-zinc-400
                transition-colors
              "
              placeholder="Detailed project description..."
            />
          </div>

          {/* Links */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block font-mono text-xs uppercase tracking-widest text-zinc-400 mb-2">
                Live Link (optional)
              </label>
              <input
                type="url"
                value={formData.link}
                onChange={(e) => setFormData((prev) => ({ ...prev, link: e.target.value }))}
                className="
                  w-full px-4 py-3 bg-transparent border border-zinc-200 dark:border-zinc-700
                  font-mono text-sm
                  focus:outline-none focus:border-ink dark:focus:border-zinc-400
                  transition-colors
                "
                placeholder="https://project.com"
              />
            </div>
            <div>
              <label className="block font-mono text-xs uppercase tracking-widest text-zinc-400 mb-2">
                GitHub (optional)
              </label>
              <input
                type="url"
                value={formData.github}
                onChange={(e) => setFormData((prev) => ({ ...prev, github: e.target.value }))}
                className="
                  w-full px-4 py-3 bg-transparent border border-zinc-200 dark:border-zinc-700
                  font-mono text-sm
                  focus:outline-none focus:border-ink dark:focus:border-zinc-400
                  transition-colors
                "
                placeholder="https://github.com/username/repo"
              />
            </div>
          </div>

          {/* Metrics & Formula (optional) */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block font-mono text-xs uppercase tracking-widest text-zinc-400 mb-2">
                Metrics (optional)
              </label>
              <input
                type="text"
                value={formData.metrics}
                onChange={(e) => setFormData((prev) => ({ ...prev, metrics: e.target.value }))}
                className="
                  w-full px-4 py-3 bg-transparent border border-zinc-200 dark:border-zinc-700
                  font-mono text-sm
                  focus:outline-none focus:border-ink dark:focus:border-zinc-400
                  transition-colors
                "
                placeholder="99.2% accuracy"
              />
            </div>
            <div>
              <label className="block font-mono text-xs uppercase tracking-widest text-zinc-400 mb-2">
                Formula (optional)
              </label>
              <input
                type="text"
                value={formData.formula}
                onChange={(e) => setFormData((prev) => ({ ...prev, formula: e.target.value }))}
                className="
                  w-full px-4 py-3 bg-transparent border border-zinc-200 dark:border-zinc-700
                  font-mono text-sm
                  focus:outline-none focus:border-ink dark:focus:border-zinc-400
                  transition-colors
                "
                placeholder="E = mc²"
              />
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}
