import Section from '../layout/Section'
import MagazineLine from '../ui/MagazineLine'
import AskChat from '../ask/AskChat'

export default function Ask() {
  return (
    <Section id="ask" narrow>
      <div className="mb-12">
        <span className="font-mono text-sm text-zinc-400 uppercase tracking-widest">Ask</span>
        <h2 className="font-serif text-4xl md:text-5xl font-light mt-4 tracking-tight">
          Ask About
          <br />
          <span className="italic">My Work</span>
        </h2>
        <p className="mt-4 text-zinc-faded max-w-2xl">
          A small language model on my home server answers from the projects and notes on this
          site and my resume, with sources. It can be wrong, so check the links. Ask in any
          language.
        </p>
      </div>

      <MagazineLine className="mb-8" />

      <AskChat className="h-[min(70vh,36rem)] rounded-3xl border border-zinc-200 dark:border-zinc-700" />
    </Section>
  )
}
