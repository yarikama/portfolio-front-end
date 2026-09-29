import Section from '../layout/Section'
import MagazineLine from '../ui/MagazineLine'
import { experience } from '../../data/experience'

// Render **figure** spans as highlighted text
function renderHighlighted(text: string) {
  return text.split(/\*\*(.+?)\*\*/).map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="text-sage font-semibold">
        {part}
      </span>
    ) : (
      part
    )
  )
}

export default function Experience() {
  return (
    <Section id="experience">
      <div className="mb-16">
        <span className="font-mono text-sm text-zinc-400 uppercase tracking-widest">
          Experience
        </span>
        <h2 className="font-serif text-4xl md:text-5xl font-light mt-4 tracking-tight">
          Where I've <span className="italic">Shipped</span>
        </h2>
        <p className="mt-4 text-zinc-faded max-w-2xl">
          From AI agents serving enterprise clients to the test infrastructure that proves they
          work.
        </p>
      </div>

      <div className="space-y-16">
        {experience.map((entry) => (
          <div key={entry.company}>
            <MagazineLine className="mb-12" />

            <div className="grid md:grid-cols-12 gap-8 md:gap-12">
              <div className="md:col-span-4">
                <a
                  href={entry.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-serif text-3xl md:text-4xl font-light tracking-tight text-ink hover:text-sage transition-colors duration-300"
                >
                  {entry.company}
                </a>
                {entry.tagline && (
                  <p className="mt-3 font-mono text-xs text-sage uppercase tracking-widest">
                    {entry.tagline}
                  </p>
                )}
                <p className="mt-2 font-mono text-xs text-zinc-400 uppercase tracking-widest">
                  {entry.location}
                </p>
              </div>

              <div className="md:col-span-8 space-y-10">
                {entry.roles.map((role) => (
                  <div key={role.title}>
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-6">
                      <h3 className="font-serif text-xl md:text-2xl text-ink">{role.title}</h3>
                      <span className="font-mono text-sm text-zinc-400">{role.period}</span>
                    </div>

                    <ul className="space-y-5">
                      {role.highlights.map((item) => (
                        <li
                          key={item.label}
                          className="pl-4 border-l border-zinc-200 dark:border-zinc-200/20 hover:border-sage transition-colors duration-300"
                        >
                          <p className="font-mono text-xs text-zinc-400 uppercase tracking-widest mb-1">
                            {item.label}
                          </p>
                          <p className="text-zinc-faded leading-relaxed">
                            {renderHighlighted(item.text)}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}
