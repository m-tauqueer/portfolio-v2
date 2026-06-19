import { motion } from 'framer-motion'
import type { PortfolioData } from '../../types/portfolio'
import { SectionHeading } from '../ui/SectionHeading'
import { MagneticButton } from '../ui/MagneticButton'

interface ContactSectionProps {
  data: PortfolioData
}

export function ContactSection({ data }: ContactSectionProps) {
  const { profile, social } = data
  const activeSocial = social.filter((s) => s.url)

  return (
    <section id="contact" className="portfolio-section">
      <SectionHeading title="// Contact" subtitle="let's connect" />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-panel p-8 mt-8 text-center"
      >
        <p className="text-[#00ff41]/80 mb-6">
          Ready to collaborate or just want to say hi? Drop me a line.
        </p>
        <MagneticButton
          onClick={() => window.open(`mailto:${profile.email}`, '_blank')}
          className="contact-cta"
        >
          {profile.email}
        </MagneticButton>
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          {activeSocial.map((link) => (
            <motion.a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, color: '#ff8c00' }}
              className="social-link"
            >
              {link.label} →
            </motion.a>
          ))}
        </div>
      </motion.div>
      <footer className="text-center text-[#008f11]/50 text-xs font-mono mt-16 pb-8">
        © {new Date().getFullYear()} {profile.name}. Built with React + Framer Motion.
      </footer>
    </section>
  )
}
