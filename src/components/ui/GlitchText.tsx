import { type ReactNode } from 'react'

interface GlitchTextProps {
  children: ReactNode
  className?: string
  as?: 'span' | 'h1' | 'h2' | 'p'
  intensity?: 'low' | 'high'
}

export function GlitchText({ children, className = '', as: Tag = 'span', intensity = 'low' }: GlitchTextProps) {
  const text = typeof children === 'string' ? children : String(children)

  return (
    <Tag
      className={`glitch-text glitch-${intensity} ${className}`}
      data-text={text}
    >
      {children}
    </Tag>
  )
}
