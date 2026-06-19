import type { ReactNode } from 'react'
import type { PortfolioData } from '../../types/portfolio'
import { SectionHeading } from '../ui/SectionHeading'
import { ScrollRevealGroup } from '../ui/ScrollReveal'
import { AboutDetailsPanels } from './AboutDetailsPanels'

interface JourneySectionProps {
  data: PortfolioData
}

function HudPanel({ children }: { children: ReactNode }) {
  return (
    <div className="glass-panel hud-panel timeline-panel ml-6">
      <span className="hud-corner hud-corner--tl" aria-hidden="true" />
      <span className="hud-corner hud-corner--br" aria-hidden="true" />
      {children}
    </div>
  )
}

export function JourneySection({ data }: JourneySectionProps) {
  const { profile, skills, education, experience } = data

  return (
    <section id="journey" className="page-section page-journey">
      <div className="about-details-panels about-details-panels--mobile">
        <SectionHeading title="// About" subtitle={`${profile.title} · ${profile.location.split(',')[0]}`} />
        <AboutDetailsPanels profile={profile} skills={skills} />
      </div>

      <div className="page-split page-split--journey">
        <div className="page-split-left">
          <SectionHeading title="// Education" subtitle="where I studied" />
          <p className="timeline-hud-label">[ ACADEMIC.LOG ]</p>
          <ScrollRevealGroup className="timeline timeline-hud mt-2" stagger={0.14}>
            {education.map((edu) => (
              <div key={edu.id} className="timeline-item">
                <div className="timeline-dot" />
                <HudPanel>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="type-badge education">education</span>
                    <span className="text-muted text-xs font-mono">{edu.duration}</span>
                  </div>
                  <h3 className="text-accent font-mono font-semibold">{edu.degree}</h3>
                  <p className="text-body text-sm">{edu.school}</p>
                  {edu.description && (
                    <p className="text-muted text-sm mt-2">{edu.description}</p>
                  )}
                </HudPanel>
              </div>
            ))}
          </ScrollRevealGroup>
        </div>

        <div className="page-split-right">
          <SectionHeading title="// Experience" subtitle="where I've worked" />
          <p className="timeline-hud-label">[ WORK.LOG ]</p>
          <ScrollRevealGroup className="timeline timeline-hud mt-2" stagger={0.14}>
            {experience.length === 0 ? (
              <p className="text-muted font-mono text-sm mt-4">No experience entries yet.</p>
            ) : (
              experience.map((exp) => (
                <div key={exp.id} className="timeline-item">
                  <div className="timeline-dot" />
                  <HudPanel>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="type-badge experience">experience</span>
                      <span className="text-muted text-xs font-mono">{exp.duration}</span>
                    </div>
                    <h3 className="text-accent font-mono font-semibold">{exp.role}</h3>
                    <p className="text-body text-sm">{exp.company}</p>
                    {exp.description && (
                      <p className="text-muted text-sm mt-2">{exp.description}</p>
                    )}
                  </HudPanel>
                </div>
              ))
            )}
          </ScrollRevealGroup>
        </div>
      </div>
    </section>
  )
}
