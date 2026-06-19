import { motion } from 'framer-motion'
import type { PortfolioData } from '../../types/portfolio'
import { SectionHeading } from '../ui/SectionHeading'

interface WhoAmISectionProps {
  data: PortfolioData
  onTerminalSlot?: (el: HTMLDivElement | null) => void
}

export function WhoAmISection({ data, onTerminalSlot }: WhoAmISectionProps) {
  const { profile, skills } = data
  const allSkills = skills.flatMap((s) => s.items)

  return (
    <section id="about" className="page-section page-about">
      <div className="about-hero-wrap">
      <div className="page-split page-split--about">
        <div className="page-split-left about-content">
          <SectionHeading title="// Who I Am" subtitle={`${profile.title} · ${profile.location}`} />

          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-panel about-bio-panel"
          >
            <p className="text-body leading-relaxed">{profile.bio}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {profile.interests.map((interest) => (
                <span key={interest} className="interest-tag">{interest}</span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-panel about-stack-panel"
          >
            <h3 className="text-accent font-mono text-sm mb-3">stack.init()</h3>
            <div className="flex flex-wrap gap-2">
              {allSkills.map((skill, i) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.03 }}
                  className="skill-tag"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
            {skills.map((cat) => (
              <div key={cat.id} className="mt-3">
                <span className="text-cyan text-xs font-mono">{cat.category}: </span>
                <span className="text-muted text-xs">{cat.items.join(' · ')}</span>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          className="page-split-right about-terminal-slot"
          ref={onTerminalSlot}
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
        />
      </div>
      </div>
    </section>
  )
}
