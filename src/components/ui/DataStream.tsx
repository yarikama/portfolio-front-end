interface DataStreamProps {
  text: string
  position?: 'left' | 'right'
  className?: string
}

export default function DataStream({
  text,
  position = 'left',
  className = '',
}: DataStreamProps) {
  return (
    <div
      className={`
        data-stream fixed top-1/2 -translate-y-1/2
        ${position === 'left' ? 'left-4' : 'right-4'}
        hidden lg:block
        ${className}
      `}
    >
      {text}
    </div>
  )
}
