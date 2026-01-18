import Section from '../layout/Section'
import MagazineLine from '../ui/MagazineLine'
import { labNotes } from '../../data/techStack'
import { ArrowUpRight } from 'lucide-react'

export default function LabNotes() {
  const hasNotes = labNotes.length > 0

  return (
    <Section id="notes">
      <div className="mb-16">
        <span className="font-mono text-xs text-zinc-400 uppercase tracking-widest">
          Lab Notes
        </span>
        <h2 className="font-serif text-4xl md:text-5xl font-light mt-4 tracking-tight">
          Technical
          <br />
          <span className="italic">Writings</span>
        </h2>
        <p className="mt-4 text-zinc-faded max-w-2xl">
          Essays and explorations on software engineering, machine learning theory, and the
          philosophy of building systems that endure.
        </p>
      </div>

      <MagazineLine className="mb-12" />

      {hasNotes ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {labNotes.map((note, index) => (
            <article
              key={note.id}
              className="group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <a href={`#note-${note.id}`} className="block">
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-mono text-[0.65rem] text-zinc-400 uppercase tracking-widest">
                    {note.date}
                  </span>
                  <span className="font-mono text-[0.65rem] text-zinc-400 uppercase tracking-widest">
                    {note.readTime}
                  </span>
                </div>

                <h3 className="font-serif text-xl font-light tracking-tight group-hover:italic transition-all duration-300 mb-3">
                  {note.title}
                </h3>

                <p className="text-sm text-zinc-faded leading-relaxed mb-4">
                  {note.excerpt}
                </p>

                <div className="flex flex-wrap gap-2">
                  {note.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-[0.6rem] text-zinc-400 uppercase tracking-widest px-2 py-1 border border-zinc-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex items-center gap-2 text-zinc-faded group-hover:text-ink transition-colors duration-300">
                  <span className="font-mono text-xs uppercase tracking-widest">Read</span>
                  <ArrowUpRight
                    size={14}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
              </a>

              <MagazineLine className="mt-6" delay={index * 50} />
            </article>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <p className="font-serif text-2xl text-zinc-faded italic mb-4">
            Coming Soon
          </p>
          <p className="text-sm text-zinc-400 max-w-md mx-auto">
            Technical writings on AI systems, distributed architectures, and engineering
            philosophy are in progress.
          </p>
        </div>
      )}

      <div className="mt-16 text-center">
        <p className="font-mono text-[0.65rem] text-zinc-400 uppercase tracking-widest">
          More writings coming soon
        </p>
      </div>
    </Section>
  )
}
