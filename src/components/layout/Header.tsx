import { useState, useEffect } from 'react'
import Container from './Container'
import ThemeToggle from '../ui/ThemeToggle'

const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Works', href: '#works' },
  { label: 'Archive', href: '#archive' },
  { label: 'Notes', href: '#notes' },
  { label: 'Contact', href: '#contact' },
]

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-all duration-500
        ${isScrolled ? 'bg-paper/90 dark:bg-[#0f0f0f]/90 backdrop-blur-sm' : 'bg-transparent'}
      `}
    >
      <Container>
        <nav className="flex items-center justify-between py-6">
          <a
            href="#"
            className="font-serif text-xl font-light tracking-tight hover:italic transition-all duration-300"
          >
            HH
          </a>

          <ul className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="
                    font-mono text-[0.8125rem] uppercase tracking-widest
                    text-zinc-faded hover:text-sage
                    transition-colors duration-300
                  "
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <ThemeToggle />
            </li>
          </ul>

          <button
            className="md:hidden font-mono text-[0.8125rem] uppercase tracking-widest"
            aria-label="Menu"
          >
            Menu
          </button>
        </nav>
      </Container>
    </header>
  )
}
