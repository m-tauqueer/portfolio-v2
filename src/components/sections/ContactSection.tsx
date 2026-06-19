import type { PortfolioData } from '../../types/portfolio'
import { SectionHeading } from '../ui/SectionHeading'
import { MagneticButton } from '../ui/MagneticButton'
import { ScrollReveal } from '../ui/ScrollReveal'

interface ContactSectionProps {
  data: PortfolioData
}

export function ContactSection({ data }: ContactSectionProps) {
  const { profile, social } = data
  const activeSocial = social.filter((s) => s.url)

  return (
    <section id="contact" className="page-section page-contact">
      <div className="page-inner page-inner--narrow">
        <SectionHeading title="// Contact" subtitle="open channel" />
        <ScrollReveal className="glass-panel hud-panel contact-panel mt-8 text-center">
          <span className="hud-corner hud-corner--tl" aria-hidden="true" />
          <span className="hud-corner hud-corner--tr" aria-hidden="true" />
          <span className="hud-corner hud-corner--bl" aria-hidden="true" />
          <span className="hud-corner hud-corner--br" aria-hidden="true" />

          <p className="contact-eyebrow">[ OPEN CHANNEL ]</p>
          <h3 className="contact-headline font-display">Let&apos;s build something</h3>
          <p className="contact-sub">
            Engineering collabs, product work, or just a hello — my inbox is open.
          </p>
          <MagneticButton
            onClick={() => window.open(`mailto:${profile.email}`, '_blank')}
            className="contact-cta"
          >
            {profile.email}
          </MagneticButton>
          <div className="contact-social-grid">
            {activeSocial.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-social-chip"
              >
                {link.label} →
              </a>
            ))}
          </div>
        </ScrollReveal>
        <ScrollReveal delay={0.15}>
          <footer className="text-center text-muted text-xs font-mono mt-16 pb-8 opacity-50">
            © {new Date().getFullYear()} {profile.name} · netrunner shell v3
          </footer>
        </ScrollReveal>
      </div>
    </section>
  )
}
