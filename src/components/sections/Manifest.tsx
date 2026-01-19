import Section from '../layout/Section'
import MagazineLine from '../ui/MagazineLine'
import DropCap from '../ui/DropCap'

const principles = [
  {
    number: '01',
    title: 'Clarity Over Cleverness',
    description:
      'The best code is not the most clever—it is the most clear. Every abstraction should reduce cognitive load, not increase it.',
  },
  {
    number: '02',
    title: 'Edit Ruthlessly',
    description:
      'Like good prose, good software requires cutting. Every line of code is a liability. The art is in knowing what to remove.',
  },
  {
    number: '03',
    title: 'Build for Change',
    description:
      'The only constant is change. Design systems that evolve gracefully, not architectures that resist modification.',
  },
  {
    number: '04',
    title: 'Measure What Matters',
    description:
      'Intuition guides exploration; data drives decisions. Build feedback loops that reveal truth, not vanity metrics that obscure it.',
  },
  {
    number: '05',
    title: 'Craft as Practice',
    description:
      'Excellence is not an act but a habit. Every commit is an opportunity to refine, every review a chance to learn.',
  },
]

export default function Manifest() {
  return (
    <Section id="manifest" narrow>
      <div className="text-center mb-16">
        <span className="font-mono text-sm text-zinc-400 uppercase tracking-widest">
          Philosophy
        </span>
        <h2 className="font-serif text-4xl md:text-5xl font-light mt-4 tracking-tight">
          A Manifesto for
          <br />
          <span className="italic">Considered Code</span>
        </h2>
      </div>

      <MagazineLine className="mb-16" />

      <div className="mb-16">
        <DropCap>
          Software engineering, at its core, is an act of translation. We take the messy,
          ambiguous world of human intention and render it into the precise, unforgiving language
          of machines. This translation demands both technical rigor and humanistic sensibility.
        </DropCap>

        <p className="mt-6 text-zinc-faded leading-relaxed">
          I believe that code is literature—meant to be read by humans first, executed by machines
          second. The compiler doesn't care about elegance, but the engineer who maintains your
          code at 3 AM certainly does.
        </p>

        <p className="mt-6 text-zinc-faded leading-relaxed">
          This is not a call for perfectionism, which is paralysis disguised as virtue. It is a
          call for intentionality—for building systems where every decision can be explained, every
          trade-off acknowledged, every shortcut documented.
        </p>
      </div>

      <MagazineLine className="mb-16" />

      <div className="space-y-12">
        {principles.map((principle, index) => (
          <div key={principle.number} className="group">
            <div className="flex items-baseline gap-6">
              <span className="font-mono text-sm text-zinc-400">{principle.number}</span>
              <div className="flex-1">
                <h3 className="font-serif text-2xl font-light tracking-tight group-hover:italic transition-all duration-300 mb-3">
                  {principle.title}
                </h3>
                <p className="text-zinc-faded leading-relaxed">{principle.description}</p>
              </div>
            </div>
            {index < principles.length - 1 && <MagazineLine className="mt-8" delay={index * 50} />}
          </div>
        ))}
      </div>

      <MagazineLine className="my-16" />

      <div className="text-center">
        <blockquote className="font-serif text-2xl md:text-3xl font-light italic tracking-tight text-zinc-faded">
          "Programs must be written for people to read, and only incidentally for machines to
          execute."
        </blockquote>
        <cite className="block mt-4 font-mono text-sm text-zinc-400 uppercase tracking-widest not-italic">
          — Harold Abelson, SICP
        </cite>
      </div>
    </Section>
  )
}
