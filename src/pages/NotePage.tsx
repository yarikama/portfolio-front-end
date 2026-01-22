import { useParams, Link } from 'react-router-dom'
import Section from '../components/layout/Section'
import MagazineLine from '../components/ui/MagazineLine'
import { useLabNote } from '../hooks'
import { ArrowLeft, Loader2 } from 'lucide-react'

export default function NotePage() {
  const { slug } = useParams<{ slug: string }>()
  const { note, isLoading, error } = useLabNote(slug || '')

  if (isLoading) {
    return (
      <div className="pt-24">
        <Section narrow>
          <div className="py-32 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-zinc-400 mb-4" />
            <p className="text-sm text-zinc-400">Loading article...</p>
          </div>
        </Section>
      </div>
    )
  }

  if (error || !note) {
    return (
      <div className="pt-24">
        <Section narrow>
          <Link
            to="/notes"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-zinc-faded hover:text-ink transition-colors mb-12"
          >
            <ArrowLeft size={14} />
            Back to Notes
          </Link>

          <div className="py-16 text-center">
            <h1 className="font-serif text-4xl mb-4">Article Not Found</h1>
            <p className="text-zinc-faded">
              The article you're looking for doesn't exist or has been removed.
            </p>
          </div>
        </Section>
      </div>
    )
  }

  return (
    <div className="pt-24">
      <Section narrow>
        <Link
          to="/notes"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-zinc-faded hover:text-ink transition-colors mb-12"
        >
          <ArrowLeft size={14} />
          Back to Notes
        </Link>

        <article>
          <header className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <span className="font-mono text-sm text-zinc-400 uppercase tracking-widest">
                {new Date(note.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
              <span className="font-mono text-sm text-zinc-400">·</span>
              <span className="font-mono text-sm text-zinc-400 uppercase tracking-widest">
                {note.readTime}
              </span>
            </div>

            <h1 className="font-serif text-4xl md:text-5xl font-light tracking-tight mb-6">
              {note.title}
            </h1>

            <div className="flex flex-wrap gap-2">
              {note.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[0.75rem] text-zinc-400 uppercase tracking-widest px-2 py-1 border border-zinc-200 dark:border-zinc-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          </header>

          <MagazineLine className="mb-12" />

          <div
            className="prose prose-zinc dark:prose-invert max-w-none
              prose-headings:font-serif prose-headings:font-light
              prose-p:text-zinc-faded prose-p:leading-relaxed
              prose-a:text-sage prose-a:no-underline hover:prose-a:underline
              prose-code:font-mono prose-code:text-sm
              prose-pre:bg-zinc-100 dark:prose-pre:bg-zinc-900
            "
            dangerouslySetInnerHTML={{ __html: note.content }}
          />
        </article>

        <MagazineLine className="mt-16 mb-8" />

        <div className="text-center">
          <Link
            to="/notes"
            className="inline-block font-mono text-xs uppercase tracking-widest text-zinc-faded hover:text-ink border-b border-zinc-300 hover:border-ink pb-1 transition-all duration-300"
          >
            View All Notes
          </Link>
        </div>
      </Section>
    </div>
  )
}
