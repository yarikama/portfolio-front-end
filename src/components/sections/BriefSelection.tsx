import Section from '../layout/Section'
import ProjectCard from '../ui/ProjectCard'
import MagazineLine from '../ui/MagazineLine'
import { featuredProjects } from '../../data/projects'

export default function BriefSelection() {
  return (
    <Section id="works">
      <div className="mb-16">
        <span className="font-mono text-sm text-zinc-400 uppercase tracking-widest">
          Selected Works
        </span>
        <h2 className="font-serif text-4xl md:text-5xl font-light mt-4 tracking-tight">
          Featured Projects
        </h2>
        <p className="mt-4 text-zinc-faded max-w-2xl">
          A curated selection of projects that represent my approach to engineering: thoughtful
          architecture, clean implementation, and measurable impact.
        </p>
      </div>

      <MagazineLine className="mb-12" />

      <div className="space-y-16">
        {featuredProjects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} featured />
        ))}
      </div>

      <div className="mt-16 text-center">
        <a
          href="#archive"
          className="
            inline-block font-mono text-xs uppercase tracking-widest
            text-zinc-faded hover:text-ink
            border-b border-zinc-300 hover:border-ink
            pb-1 transition-all duration-300
          "
        >
          View Full Archive
        </a>
      </div>
    </Section>
  )
}
