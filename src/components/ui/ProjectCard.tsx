import { ArrowUpRight } from 'lucide-react'
import type { Project } from '../../types'
import MagazineLine from './MagazineLine'

interface ProjectCardProps {
  project: Project
  index: number
  featured?: boolean
}

export default function ProjectCard({ project, index, featured = false }: ProjectCardProps) {
  const formattedIndex = String(index + 1).padStart(2, '0')

  return (
    <article className="group">
      <MagazineLine className="mb-6" delay={index * 100} />

      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-baseline gap-4 mb-3">
            <span className="font-mono text-xs text-zinc-400">{formattedIndex}</span>
            <h3
              className={`
                font-serif font-light tracking-tight
                group-hover:italic transition-all duration-300
                ${featured ? 'text-3xl md:text-4xl' : 'text-xl md:text-2xl'}
              `}
            >
              <a href={project.link || '#'} className="hover:underline underline-offset-4">
                {project.title}
              </a>
            </h3>
          </div>

          <p className="text-zinc-faded text-sm md:text-base leading-relaxed mb-4 max-w-2xl">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-[0.65rem] text-zinc-400 uppercase tracking-widest"
              >
                {tag}
              </span>
            ))}
          </div>

          {project.metrics && (
            <div className="mt-4 font-mono text-xs text-zinc-faded">
              {project.metrics}
            </div>
          )}
        </div>

        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="
              p-2 text-zinc-400 hover:text-ink
              transition-colors duration-300
              opacity-0 group-hover:opacity-100
            "
            aria-label={`View ${project.title}`}
          >
            <ArrowUpRight size={20} />
          </a>
        )}
      </div>
    </article>
  )
}
