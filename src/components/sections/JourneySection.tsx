import { motion } from 'framer-motion'
import type { PortfolioData } from '../../types/portfolio'
import { SectionHeading } from '../ui/SectionHeading'

interface JourneySectionProps {
  data: PortfolioData
}

export function JourneySection({ data }: JourneySectionProps) {
  const timeline = [
    ...data.education.map((e) => ({
      id: `edu-${e.id}`,
      type: 'education' as const,
      title: e.degree,
      org: e.school,
      duration: e.duration,
      description: e.description,
    })),
    ...data.experience.map((e) => ({
      id: `exp-${e.id}`,
      type: 'experience' as const,
      title: e.role,
      org: e.company,
      duration: e.duration,
      description: e.description,
    })),
  ]

  return (
    <section id="journey" className="portfolio-section">
      <SectionHeading title="// Journey" subtitle="education + experience" />
      <div className="timeline mt-8">
        {timeline.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="timeline-item"
          >
            <div className="timeline-dot" />
            <div className="glass-panel p-5 ml-6">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className={`type-badge ${item.type}`}>{item.type}</span>
                <span className="text-[#008f11] text-xs font-mono">{item.duration}</span>
              </div>
              <h3 className="text-[#ff8c00] font-mono font-semibold">{item.title}</h3>
              <p className="text-[#00ff41] text-sm">{item.org}</p>
              {item.description && (
                <p className="text-[#00ff41]/60 text-sm mt-2">{item.description}</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
