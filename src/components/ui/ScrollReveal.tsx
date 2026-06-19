import { type ReactNode, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, isReducedMotion } from '../../lib/gsap'

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  duration?: number
}

export function ScrollReveal({
  children,
  className = '',
  delay = 0,
  y = 44,
  duration = 0.85,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el || isReducedMotion()) return

      gsap.fromTo(
        el,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration,
          delay,
          ease: 'power3.out',
          clearProps: 'transform',
          scrollTrigger: {
            trigger: el,
            start: 'top 86%',
            once: true,
          },
        }
      )
    },
    { scope: ref }
  )

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

interface ScrollRevealGroupProps {
  children: ReactNode
  className?: string
  stagger?: number
  y?: number
}

export function ScrollRevealGroup({
  children,
  className = '',
  stagger = 0.12,
  y = 40,
}: ScrollRevealGroupProps) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el || isReducedMotion()) return

      const targets = el.children.length > 0 ? Array.from(el.children) : [el]

      gsap.fromTo(
        targets,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger,
          ease: 'power3.out',
          clearProps: 'transform',
          scrollTrigger: {
            trigger: el,
            start: 'top 84%',
            once: true,
          },
        }
      )
    },
    { scope: ref }
  )

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
