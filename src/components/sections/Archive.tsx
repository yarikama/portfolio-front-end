import { useState } from 'react'
import Section from '../layout/Section'
import ProjectCard from '../ui/ProjectCard'
import MagazineLine from '../ui/MagazineLine'
import { projects, projectCategories } from '../../data/projects'

export default function Archive() {
  const [activeCategory, setActiveCategory] = useState<string>('all')

  const filteredProjects =
    activeCategory === 'all'
      ? projects
      : projects.filter((p) => p.category === activeCategory)

  return (
    <Section id="archive">
      <div className="mb-16">
        <span className="font-mono text-xs text-zinc-400 uppercase tracking-widest">
          Archive
        </span>
        <h2 className="font-serif text-4xl md:text-5xl font-light mt-4 tracking-tight">
          Complete Works
        </h2>
        <p className="mt-4 text-zinc-faded max-w-2xl">
          A comprehensive catalog of projects, experiments, and explorations across engineering,
          machine learning, and design.
        </p>
      </div>

      <div className="flex flex-wrap gap-4 mb-12">
        {projectCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`
              font-mono text-xs uppercase tracking-widest
              px-4 py-2 border transition-all duration-300
              ${
                activeCategory === category.id
                  ? 'border-ink text-ink bg-ink/5'
                  : 'border-zinc-200 text-zinc-faded hover:border-zinc-400 hover:text-ink'
              }
            `}
          >
            {category.label}
          </button>
        ))}
      </div>

      <MagazineLine className="mb-12" />

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

      <div className="mt-16 pt-8 border-t border-zinc-200">
        <p className="font-mono text-xs text-zinc-400 uppercase tracking-widest text-center">
          {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} /{' '}
          {activeCategory === 'all' ? 'All Categories' : activeCategory}
        </p>
      </div>
    </Section>
  )
}
