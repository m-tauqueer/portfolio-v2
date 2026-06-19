import { motion } from 'framer-motion'
import type { PortfolioData } from '../../types/portfolio'
import { SectionHeading } from '../ui/SectionHeading'

interface WhoAmISectionProps {
  data: PortfolioData
}

export function WhoAmISection({ data }: WhoAmISectionProps) {
  const { profile, skills } = data
  const allSkills = skills.flatMap((s) => s.items)

  return (
    <section id="about" className="portfolio-section">
      <SectionHeading title="// Who I Am" subtitle={`${profile.title} · ${profile.location}`} />
      <div className="grid md:grid-cols-2 gap-8 mt-8">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-panel p-6"
        >
          <p className="text-[#00ff41]/90 leading-relaxed">{profile.bio}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {profile.interests.map((interest) => (
              <span key={interest} className="interest-tag">{interest}</span>
            ))}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="glass-panel p-6"
        >
          <h3 className="text-[#ff8c00] font-mono text-sm mb-4">stack.init()</h3>
          <div className="flex flex-wrap gap-2">
            {allSkills.map((skill, i) => (
              <motion.span
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="skill-tag"
              >
                {skill}
              </motion.span>
            ))}
          </div>
          {skills.map((cat) => (
            <div key={cat.id} className="mt-4">
              <span className="text-[#008f11] text-xs font-mono">{cat.category}: </span>
              <span className="text-[#00ff41]/70 text-xs">{cat.items.join(' · ')}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
