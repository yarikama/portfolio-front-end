import Container from './Container'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 py-4 bg-paper/90 backdrop-blur-sm border-t border-zinc-200">
      <Container>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="font-mono text-xs text-zinc-faded uppercase tracking-widest">
            <span className="font-serif text-sm normal-case tracking-normal italic">
              Henry Hsu
            </span>
            <span className="mx-3">/</span>
            <span>{currentYear}</span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://github.com/yarikama"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-zinc-faded hover:text-ink uppercase tracking-widest transition-colors duration-300"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/yarikama"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-zinc-faded hover:text-ink uppercase tracking-widest transition-colors duration-300"
            >
              LinkedIn
            </a>
            <a
              href="mailto:hsuhengjui@gmail.com"
              className="font-mono text-xs text-zinc-faded hover:text-ink uppercase tracking-widest transition-colors duration-300"
            >
              Email
            </a>
          </div>
        </div>
      </Container>
    </footer>
  )
}
