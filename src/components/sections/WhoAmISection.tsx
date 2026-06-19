import { useRef, type ReactNode } from 'react'
import { useGSAP } from '@gsap/react'
import type { PortfolioData } from '../../types/portfolio'
import { isMobileViewport } from '../../lib/viewMode'
import { gsap, isReducedMotion } from '../../lib/gsap'
import { AboutDetailsPanels } from './AboutDetailsPanels'

interface WhoAmISectionProps {
  data: PortfolioData
  terminal?: ReactNode
}

export function WhoAmISection({ data, terminal }: WhoAmISectionProps) {
  const { profile, skills } = data
  const heroRef = useRef<HTMLDivElement>(null)
  const locationShort = profile.location.split(',')[0]

  useGSAP(
    () => {
      if (isReducedMotion()) return

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      const slideX = isMobileViewport() ? 0 : 32

      tl.from('.hero-eyebrow', { opacity: 0, y: 14, duration: 0.45 })
        .from('.hero-title', { opacity: 0, y: 36, duration: 0.85 }, '-=0.15')
        .from('.hero-name', { opacity: 0, y: 18, duration: 0.5 }, '-=0.5')
        .from('.hero-panel', { opacity: 0, y: 28, duration: 0.55, stagger: 0.1 }, '-=0.1')
        .from('.about-terminal-slot', { opacity: 0, x: slideX, duration: 0.7, clearProps: 'all' }, '-=0.35')
    },
    { scope: heroRef }
  )

  return (
    <section id="about" className="page-section page-about">
      <div className="about-hero-wrap" ref={heroRef}>
        <div className="page-split page-split--about">
          <div className="page-split-left about-content">
            <p className="hero-eyebrow about-eyebrow">[ SYSTEM · ENGINEER.ONLINE ]</p>

            <div className="about-hero-head">
              <h1 className="hero-title font-display">{profile.title}</h1>
              <p className="hero-name">
                {profile.name} · {locationShort}
              </p>
            </div>

            <div className="about-details-panels about-details-panels--desktop">
              <AboutDetailsPanels profile={profile} skills={skills} />
            </div>
          </div>

          <div className="page-split-right about-terminal-slot">
            {terminal}
          </div>
        </div>
      </div>
    </section>
  )
}
