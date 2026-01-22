import { useState } from 'react'
import Section from '../layout/Section'
import MagazineLine from '../ui/MagazineLine'
import { useContactForm } from '../../hooks'
import { Mail, FileText, Send, Loader2, CheckCircle } from 'lucide-react'

// Custom icons for GitHub and LinkedIn (lucide-react deprecated these)
const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
)

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

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
    icon: GithubIcon,
  },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/yarikama',
    href: 'https://linkedin.com/in/yarikama',
    icon: LinkedinIcon,
  },
  {
    label: 'Resume',
    value: 'Download PDF',
    href: '/resume.pdf',
    icon: FileText,
  },
]

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const { isSubmitting, isSuccess, error, fieldErrors, submit, reset } = useContactForm()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await submit(formData)
    if (success) {
      setFormData({ name: '', email: '', subject: '', message: '' })
    }
  }

  const handleReset = () => {
    reset()
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <Section id="contact" narrow>
      <div className="text-center mb-16">
        <span className="font-mono text-sm text-zinc-400 uppercase tracking-widest">
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

      {/* Contact Form */}
      <div className="max-w-xl mx-auto mb-16">
        {isSuccess ? (
          <div className="text-center py-12 border border-sage/30 bg-sage/5">
            <CheckCircle className="w-12 h-12 text-sage mx-auto mb-4" />
            <h3 className="font-serif text-2xl mb-2">Message Sent</h3>
            <p className="text-zinc-faded mb-6">
              Thank you for reaching out. I'll get back to you soon.
            </p>
            <button
              onClick={handleReset}
              className="font-mono text-xs uppercase tracking-widest text-zinc-faded hover:text-ink transition-colors"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 border border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="block font-mono text-xs uppercase tracking-widest text-zinc-400 mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  minLength={2}
                  maxLength={100}
                  className={`
                    w-full px-4 py-3 bg-transparent border
                    font-serif text-lg
                    focus:outline-none focus:border-ink dark:focus:border-zinc-400
                    transition-colors duration-300
                    ${fieldErrors.name ? 'border-red-400' : 'border-zinc-200 dark:border-zinc-700'}
                  `}
                  placeholder="Your name"
                />
                {fieldErrors.name && (
                  <p className="mt-1 text-xs text-red-500">{fieldErrors.name}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block font-mono text-xs uppercase tracking-widest text-zinc-400 mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={`
                    w-full px-4 py-3 bg-transparent border
                    font-serif text-lg
                    focus:outline-none focus:border-ink dark:focus:border-zinc-400
                    transition-colors duration-300
                    ${fieldErrors.email ? 'border-red-400' : 'border-zinc-200 dark:border-zinc-700'}
                  `}
                  placeholder="your@email.com"
                />
                {fieldErrors.email && (
                  <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="subject"
                className="block font-mono text-xs uppercase tracking-widest text-zinc-400 mb-2"
              >
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                minLength={5}
                maxLength={200}
                className={`
                  w-full px-4 py-3 bg-transparent border
                  font-serif text-lg
                  focus:outline-none focus:border-ink dark:focus:border-zinc-400
                  transition-colors duration-300
                  ${fieldErrors.subject ? 'border-red-400' : 'border-zinc-200 dark:border-zinc-700'}
                `}
                placeholder="What's this about?"
              />
              {fieldErrors.subject && (
                <p className="mt-1 text-xs text-red-500">{fieldErrors.subject}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="message"
                className="block font-mono text-xs uppercase tracking-widest text-zinc-400 mb-2"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                minLength={10}
                maxLength={5000}
                rows={6}
                className={`
                  w-full px-4 py-3 bg-transparent border resize-none
                  font-serif text-lg leading-relaxed
                  focus:outline-none focus:border-ink dark:focus:border-zinc-400
                  transition-colors duration-300
                  ${fieldErrors.message ? 'border-red-400' : 'border-zinc-200 dark:border-zinc-700'}
                `}
                placeholder="Tell me about your project or idea..."
              />
              {fieldErrors.message && (
                <p className="mt-1 text-xs text-red-500">{fieldErrors.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="
                w-full py-4 border border-ink dark:border-zinc-400
                font-mono text-sm uppercase tracking-widest
                hover:bg-ink hover:text-paper dark:hover:bg-zinc-400 dark:hover:text-zinc-900
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-300
                flex items-center justify-center gap-2
              "
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Send Message
                </>
              )}
            </button>
          </form>
        )}
      </div>

      <MagazineLine className="mb-12" />

      {/* Contact Links */}
      <div className="grid sm:grid-cols-2 gap-6">
        {contactLinks.map((link) => {
          const Icon = link.icon
          return (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              download={link.href.endsWith('.pdf') ? true : undefined}
              className="
                group p-6 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-400
                transition-all duration-300
              "
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-mono text-sm text-zinc-400 uppercase tracking-widest mb-2">
                    {link.label}
                  </p>
                  <p className="font-serif text-lg group-hover:italic transition-all duration-300">
                    {link.value}
                  </p>
                </div>
                <Icon
                  width={20}
                  height={20}
                  className="text-zinc-400 group-hover:text-sage transition-colors duration-300"
                />
              </div>
            </a>
          )
        })}
      </div>

      <div className="mt-16 text-center">
        <p className="font-mono text-[0.8rem] text-zinc-400 uppercase tracking-widest">
          Houston, TX / Open to opportunities
        </p>
      </div>
    </Section>
  )
}
