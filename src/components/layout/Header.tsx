import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Container from './Container'
import ThemeToggle from '../ui/ThemeToggle'
import { useScrollSpy } from '../../hooks/useScrollSpy'

interface NavItem {
  label: string
  href: string
  isRoute?: boolean
  sectionId?: string
}

const navItems: NavItem[] = [
  { label: 'Experience', href: '/#experience', sectionId: 'experience' },
  { label: 'Skills', href: '/#skills', sectionId: 'skills' },
  { label: 'Works', href: '/#works', sectionId: 'works' },
  { label: 'Archive', href: '/archive', isRoute: true },
  { label: 'Notes', href: '/notes', isRoute: true },
  { label: 'Contact', href: '/#contact', sectionId: 'contact' },
]

const sectionIds = navItems
  .filter((item) => item.sectionId)
  .map((item) => item.sectionId as string)

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const activeSection = useScrollSpy({ sectionIds })

  const isHomePage = location.pathname === '/'

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close the mobile menu whenever the route or hash changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [location])

  // Close the mobile menu with Escape
  useEffect(() => {
    if (!isMenuOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isMenuOpen])

  // Handle hash navigation after route change. scrollIntoView without an
  // explicit behavior follows the CSS scroll-behavior, which honors reduced motion.
  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash)
      if (element) {
        setTimeout(() => {
          element.scrollIntoView()
        }, 100)
      }
    }
  }, [location])

  const handleNavClick = (href: string, isRoute?: boolean) => {
    setIsMenuOpen(false)
    if (!isRoute && href.startsWith('/#')) {
      if (location.pathname === '/') {
        document.querySelector(href.substring(1))?.scrollIntoView()
      }
    }
  }

  const isActive = (item: NavItem): boolean => {
    // For route-based items, check if current path starts with the href
    if (item.isRoute) {
      return location.pathname.startsWith(item.href)
    }
    // For section-based items, check scroll spy (only on home page)
    if (item.sectionId && isHomePage) {
      return activeSection === item.sectionId
    }
    return false
  }

  const renderNavLink = (item: NavItem) => (
    <Link
      to={item.href}
      onClick={() => handleNavClick(item.href, item.isRoute)}
      aria-current={isActive(item) ? 'page' : undefined}
      className={`
        font-mono text-[0.8125rem] uppercase tracking-widest
        transition-colors duration-300
        ${isActive(item) ? 'text-sage' : 'text-zinc-faded hover:text-sage'}
      `}
    >
      {item.label}
    </Link>
  )

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-colors duration-500
        ${
          isMenuOpen
            ? 'bg-paper dark:bg-[#0f0f0f] shadow-sm'
            : isScrolled
              ? 'bg-paper/90 dark:bg-[#0f0f0f]/90 backdrop-blur-sm'
              : 'bg-transparent'
        }
      `}
    >
      <Container>
        <nav className="flex items-center justify-between py-6">
          <Link to="/" className="font-serif text-xl font-light tracking-tight">
            &lt;H,H&gt;
          </Link>

          <ul className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <li key={item.href}>{renderNavLink(item)}</li>
            ))}
            <li>
              <ThemeToggle />
            </li>
          </ul>

          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            className="md:hidden font-mono text-[0.8125rem] uppercase tracking-widest"
          >
            {isMenuOpen ? 'Close' : 'Menu'}
          </button>
        </nav>

        {isMenuOpen && (
          <div id="mobile-menu" className="md:hidden pb-6 border-t border-zinc-200 dark:border-zinc-200/20">
            <ul className="flex flex-col gap-5 pt-6">
              {navItems.map((item) => (
                <li key={item.href}>{renderNavLink(item)}</li>
              ))}
            </ul>
            <div className="mt-4 -ml-2">
              <ThemeToggle />
            </div>
          </div>
        )}
      </Container>
    </header>
  )
}
