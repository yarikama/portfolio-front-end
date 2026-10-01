import Section from '../layout/Section'
import MagazineLine from '../ui/MagazineLine'
import AskChat from '../ask/AskChat'
import { useAskChat } from '../../hooks'

export default function Ask() {
  // The chat box starts at the width of the text above it and opens out to
  // the full width of the page with the first question. Only the width: a
  // taller box would push down whatever the visitor is reading further down
  // the page when they ask from the floating chat.
  const opened = useAskChat().turns.length > 0

  return (
    <Section id="ask">
      <div className="max-w-2xl mx-auto">
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
          <p className="mt-3 text-sm text-zinc-faded max-w-2xl">
            It remembers your last two questions for half an hour, so you can follow up.
          </p>
        </div>

        <MagazineLine className="mb-8" />
      </div>

      <AskChat
        className={`mx-auto h-[min(70vh,36rem)] rounded-3xl border border-zinc-200 dark:border-zinc-700
          transition-[max-width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none
          ${opened ? 'max-w-full' : 'max-w-2xl'}`}
      />
    </Section>
  )
}
