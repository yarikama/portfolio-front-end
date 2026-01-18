import Section from '../layout/Section'
import MagazineLine from '../ui/MagazineLine'
import { Mail, Github, Linkedin, FileText } from 'lucide-react'

const contactLinks = [
  {
    label: 'Email',
    value: 'hsuhengjui@gmail.com',
    href: 'mailto:hsuhengjui@gmail.com',
    icon: Mail,
  },
  {
    label: 'GitHub',
    value: 'github.com/yarikama',
    href: 'https://github.com/yarikama',
    icon: Github,
  },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/yarikama',
    href: 'https://linkedin.com/in/yarikama',
    icon: Linkedin,
  },
  {
    label: 'Resume',
    value: 'Download PDF',
    href: '/resume.pdf',
    icon: FileText,
  },
]

export default function Contact() {
  return (
    <Section id="contact" narrow>
      <div className="text-center mb-16">
        <span className="font-mono text-xs text-zinc-400 uppercase tracking-widest">
          Contact
        </span>
        <h2 className="font-serif text-4xl md:text-5xl font-light mt-4 tracking-tight">
          Let's Build
          <br />
          <span className="italic">Something Together</span>
        </h2>
        <p className="mt-6 text-zinc-faded max-w-lg mx-auto">
          Whether you're building AI systems, exploring open-source collaboration, or have an
          interesting problem to solve{'\u2014'}I'd be glad to hear from you.
        </p>
      </div>

      <MagazineLine className="mb-12" />

      <div className="grid sm:grid-cols-2 gap-6">
        {contactLinks.map((link) => {
          const Icon = link.icon
          return (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="
                group p-6 border border-zinc-200 hover:border-zinc-400
                transition-all duration-300
              "
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-mono text-xs text-zinc-400 uppercase tracking-widest mb-2">
                    {link.label}
                  </p>
                  <p className="font-serif text-lg group-hover:italic transition-all duration-300">
                    {link.value}
                  </p>
                </div>
                <Icon
                  size={20}
                  className="text-zinc-400 group-hover:text-ink transition-colors duration-300"
                />
              </div>
            </a>
          )
        })}
      </div>

      <div className="mt-16 text-center">
        <p className="font-mono text-[0.65rem] text-zinc-400 uppercase tracking-widest">
          Houston, TX / Open to opportunities
        </p>
      </div>
    </Section>
  )
}
