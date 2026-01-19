import { ReactNode } from 'react'

interface ContainerProps {
  children: ReactNode
  className?: string
  narrow?: boolean
}

export default function Container({ children, className = '', narrow = false }: ContainerProps) {
  return (
    <div
      className={`
        mx-auto px-6 md:px-8 lg:px-12
        ${narrow ? 'max-w-3xl' : 'max-w-6xl'}
        ${className}
      `}
    >
      {children}
    </div>
  )
}
