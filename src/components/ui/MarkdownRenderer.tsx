import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm'
import rehypeKatex from 'rehype-katex'
import rehypeHighlight from 'rehype-highlight'
import 'katex/dist/katex.min.css'
import 'highlight.js/styles/github-dark.css'

interface MarkdownRendererProps {
  content: string
  className?: string
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <div
      className={`prose prose-zinc dark:prose-invert max-w-none
        prose-headings:font-serif prose-headings:font-light
        prose-p:text-zinc-faded prose-p:leading-relaxed
        prose-a:text-sage prose-a:no-underline hover:prose-a:underline
        prose-code:font-mono prose-code:text-sm
        prose-pre:bg-zinc-100 dark:prose-pre:bg-zinc-900 prose-pre:p-0
        [&_pre]:overflow-x-auto
        [&_.hljs]:p-4 [&_.hljs]:bg-zinc-900 [&_.hljs]:rounded-md
        ${className}`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkGfm]}
        rehypePlugins={[rehypeKatex, rehypeHighlight]}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
