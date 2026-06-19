import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { GlitchText } from './GlitchText'
import { gsap, isReducedMotion } from '../../lib/gsap'

interface SectionHeadingProps {
  title: string
  subtitle?: string
}

export function SectionHeading({ title, subtitle }: SectionHeadingProps) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (isReducedMotion()) return

      gsap.fromTo(
        ref.current!.querySelectorAll('.section-reveal'),
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
          clearProps: 'transform',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 88%',
            once: true,
          },
        }
      )
    },
    { scope: ref }
  )

  return (
    <div ref={ref} className="section-heading">
      <h2 className="section-heading-title font-display section-reveal">{title}</h2>
      {subtitle && (
        <p className="section-heading-sub section-reveal">
          <GlitchText intensity="low">{subtitle}</GlitchText>
        </p>
      )}
    </div>
  )
}
