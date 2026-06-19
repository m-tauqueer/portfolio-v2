import type { PortfolioData } from '../../types/portfolio'

interface AboutDetailsPanelsProps {
  profile: PortfolioData['profile']
  skills: PortfolioData['skills']
}

export function AboutDetailsPanels({ profile, skills }: AboutDetailsPanelsProps) {
  const allSkills = skills.flatMap((s) => s.items)

  return (
    <>
      <div className="glass-panel hero-panel hud-panel about-bio-panel">
        <span className="hud-corner hud-corner--tl" aria-hidden="true" />
        <span className="hud-corner hud-corner--br" aria-hidden="true" />
        <p className="hero-bio text-body leading-relaxed">{profile.bio}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {profile.interests.map((interest) => (
            <span key={interest} className="interest-tag">{interest}</span>
          ))}
        </div>
      </div>

      <div className="glass-panel hero-panel hud-panel about-stack-panel">
        <span className="hud-corner hud-corner--tr" aria-hidden="true" />
        <span className="hud-corner hud-corner--bl" aria-hidden="true" />
        <h3 className="hero-stack-label font-mono text-sm mb-2">
          <span className="text-cyan">stack</span>.init()
        </h3>
        <div className="flex flex-wrap gap-2">
          {allSkills.map((skill) => (
            <span key={skill} className="skill-tag">{skill}</span>
          ))}
        </div>
      </div>
    </>
  )
}
