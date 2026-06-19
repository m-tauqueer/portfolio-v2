import { motion } from 'framer-motion'
import type { PortfolioData } from '../../types/portfolio'
import { SectionHeading } from '../ui/SectionHeading'

interface JourneySectionProps {
  data: PortfolioData
}

export function JourneySection({ data }: JourneySectionProps) {
  const { education, experience } = data

  return (
    <section id="journey" className="page-section page-journey">
      <div className="page-split page-split--journey">
        <div className="page-split-left">
          <SectionHeading title="// Education" subtitle="where I studied" />
          <div className="timeline mt-6">
            {education.map((edu, i) => (
              <motion.div
                key={edu.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="timeline-item"
              >
                <div className="timeline-dot" />
                <div className="glass-panel timeline-panel ml-6">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="type-badge education">education</span>
                    <span className="text-muted text-xs font-mono">{edu.duration}</span>
                  </div>
                  <h3 className="text-accent font-mono font-semibold">{edu.degree}</h3>
                  <p className="text-body text-sm">{edu.school}</p>
                  {edu.description && (
                    <p className="text-muted text-sm mt-2">{edu.description}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="page-split-right">
          <SectionHeading title="// Experience" subtitle="where I've worked" />
          <div className="timeline mt-6">
            {experience.length === 0 ? (
              <p className="text-muted font-mono text-sm mt-4">No experience entries yet.</p>
            ) : (
              experience.map((exp, i) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="timeline-item"
                >
                  <div className="timeline-dot" />
                  <div className="glass-panel timeline-panel ml-6">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="type-badge experience">experience</span>
                      <span className="text-muted text-xs font-mono">{exp.duration}</span>
                    </div>
                    <h3 className="text-accent font-mono font-semibold">{exp.role}</h3>
                    <p className="text-body text-sm">{exp.company}</p>
                    {exp.description && (
                      <p className="text-muted text-sm mt-2">{exp.description}</p>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
