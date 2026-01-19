import { ReactNode } from 'react'

interface DropCapProps {
  children: ReactNode
  className?: string
}

export default function DropCap({ children, className = '' }: DropCapProps) {
  return (
    <p className={`drop-cap text-lg leading-relaxed ${className}`}>
      {children}
    </p>
  )
}
