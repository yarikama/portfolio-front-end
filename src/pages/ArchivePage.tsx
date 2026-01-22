import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Section from '../components/layout/Section'
import ProjectCard from '../components/ui/ProjectCard'
import MagazineLine from '../components/ui/MagazineLine'
import { useProjects, useProjectCategories } from '../hooks'
import { ArrowLeft, Loader2 } from 'lucide-react'

const fallbackCategories = [
  { id: 'all', label: 'All', count: 0 },
  { id: 'engineering', label: 'Engineering', count: 0 },
  { id: 'ml', label: 'ML/AI', count: 0 },
]

export default function ArchivePage() {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const { projects, isLoading, error } = useProjects()
  const { categories: apiCategories } = useProjectCategories()

  const categories = useMemo(() => {
    if (apiCategories.length > 0) {
      return apiCategories
    }
    return fallbackCategories
  }, [apiCategories])

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'all') {
      return projects
    }
    return projects.filter((p) => p.category === activeCategory)
  }, [projects, activeCategory])

  return (
    <div className="pt-24">
      <Section>
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-zinc-faded hover:text-ink transition-colors mb-12"
        >
          <ArrowLeft size={14} />
          Back to Home
        </Link>

        <div className="mb-16">
          <span className="font-mono text-sm text-zinc-400 uppercase tracking-widest">
            Archive
          </span>
          <h1 className="font-serif text-5xl md:text-6xl font-light mt-4 tracking-tight">
            Complete Works
          </h1>
          <p className="mt-6 text-zinc-faded max-w-2xl text-lg">
            A comprehensive catalog of projects, experiments, and explorations across engineering,
            machine learning, and design.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`
                font-mono text-xs uppercase tracking-widest
                px-4 py-2 border transition-all duration-300
                ${
                  activeCategory === category.id
                    ? 'border-ink text-ink bg-ink/5 dark:border-zinc-400 dark:bg-zinc-400/10'
                    : 'border-zinc-200 dark:border-zinc-200/20 text-zinc-faded hover:border-zinc-400 hover:text-ink'
                }
              `}
            >
              {category.label}
              {category.count > 0 && (
                <span className="ml-2 opacity-60">({category.count})</span>
              )}
            </button>
          ))}
        </div>

        <MagazineLine className="mb-12" />

        {isLoading ? (
          <div className="py-16 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-zinc-400 mb-4" />
            <p className="text-sm text-zinc-400">Loading projects...</p>
          </div>
        ) : error ? (
          <div className="py-16 text-center">
            <p className="font-serif text-xl text-zinc-faded italic">
              Unable to load projects at this time.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-12">
              {filteredProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>

            {filteredProjects.length === 0 && (
              <div className="text-center py-16">
                <p className="font-serif text-xl text-zinc-faded italic">
                  No projects found in this category.
                </p>
              </div>
            )}
          </>
        )}

        <div className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-200/20">
          <p className="font-mono text-sm text-zinc-400 uppercase tracking-widest text-center">
            {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} /{' '}
            {activeCategory === 'all' ? 'All Categories' : activeCategory}
          </p>
        </div>
      </Section>
    </div>
  )
}
