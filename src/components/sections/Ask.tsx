import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import Section from '../layout/Section'
import MagazineLine from '../ui/MagazineLine'
import AskChat from '../ask/AskChat'
import { useAskChat } from '../../hooks'

// Leads on from the chat to the story below. The first story card only
// fades in after a screen of scrolling, and without this the page looked as
// if it ended at the chat. The line draws down once it comes into view.
function OnToAbout() {
  const ref = useRef<HTMLAnchorElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <a
      ref={ref}
      href="#about"
      className="group mt-24 mx-auto flex w-fit flex-col items-center text-center"
    >
      <span
        aria-hidden="true"
        className="block h-24 w-px bg-gradient-to-b from-transparent to-sage/70 origin-top
          transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
        style={{ transform: isVisible ? 'scaleY(1)' : 'scaleY(0)' }}
      />
      <span
        className={`mt-6 font-mono text-sm text-zinc-400 uppercase tracking-widest
          group-hover:text-sage group-focus-visible:text-sage
          transition-[opacity,color] duration-700 delay-300 motion-reduce:transition-none
          ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        About me
      </span>
      <span
        className={`mt-3 font-serif text-3xl md:text-4xl font-light tracking-tight
          transition-opacity duration-700 delay-500 motion-reduce:transition-none
          ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        How I <span className="italic">Work</span>
      </span>
      <ChevronDown
        aria-hidden="true"
        className={`mt-6 h-5 w-5 text-sage motion-safe:animate-bounce
          transition-opacity duration-700 delay-700 motion-reduce:transition-none
          ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      />
    </a>
  )
}

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
            <span className="italic">Me</span>
          </h2>
          <p className="mt-4 text-zinc-faded max-w-2xl">
            A small language model on my home server answers from the projects and notes on this
            site and my resume, with sources. It can be wrong, so check the links.
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

      <OnToAbout />
    </Section>
  )
}
