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
  { label: 'About', href: '/#about', sectionId: 'about' },
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

  // Handle hash navigation after route change
  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash)
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      }
    }
  }, [location])

  const handleNavClick = (href: string, isRoute?: boolean) => {
    if (!isRoute && href.startsWith('/#')) {
      if (location.pathname === '/') {
        const element = document.querySelector(href.substring(1))
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
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
          <Link
            to="/"
            className="font-serif text-xl font-light tracking-tight transition-all duration-300"
          >
            &lt;H,H&gt;
          </Link>

          <ul className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <li key={item.href}>
                {item.isRoute ? (
                  <Link
                    to={item.href}
                    className={`
                      font-mono text-[0.8125rem] uppercase tracking-widest
                      transition-colors duration-300
                      ${isActive(item) ? 'text-sage' : 'text-zinc-faded hover:text-sage'}
                    `}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <Link
                    to={item.href}
                    onClick={() => handleNavClick(item.href, item.isRoute)}
                    className={`
                      font-mono text-[0.8125rem] uppercase tracking-widest
                      transition-colors duration-300
                      ${isActive(item) ? 'text-sage' : 'text-zinc-faded hover:text-sage'}
                    `}
                  >
                    {item.label}
                  </Link>
                )}
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
