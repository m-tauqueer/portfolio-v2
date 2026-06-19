import type { PortfolioData } from '../../types/portfolio'
import { useMobileViewport } from '../../hooks/useMobileViewport'

const PERSONA_COMPACT = `
  ╔═══════════════════════╗
  ║ τauq.me · shell v3.0  ║
  ╚═══════════════════════╝
      ┌──────────┐
      │ ◉      ◉ │
      │    ▽     │
      │ ▀▀▀▀▀▀▀▀ │
      └────┬─────┘
       ╱   │   ╲`.trim()

const PERSONA_FULL = `
       ╔══════════════════════════════════════╗
       ║  τauq.me // netrunner-shell v3.0     ║
       ╚══════════════════════════════════════╝

            ████████████████
           ██  ▄▄▄▄▄▄▄▄▄  ██
           ██ │ ◉     ◉ │ ██
           ██ │    ▽    │ ██
           ██ │ ▀▀▀▀▀▀▀▀ │ ██
            ██████┬┬██████
                 ││
            ╱╲  ╱  ╲  ╱╲
           ╱  ╲╱    ╲╱  ╲`.trim()

interface TerminalWelcomeProps {
  portfolio: PortfolioData
  embedded?: boolean
  guiMode?: boolean
}

export function TerminalWelcome({ portfolio, embedded, guiMode }: TerminalWelcomeProps) {
  const isMobile = useMobileViewport()
  const useCompact = Boolean(embedded || isMobile)
  const { profile, skills, experience, projects } = portfolio
  const topStack = skills.flatMap((s) => s.items).slice(0, embedded ? 4 : 5).join(' · ')
  const role = experience[0]
  const featured = projects.filter((p) => p.featured).slice(0, 3)

  const hints = guiMode
    ? ['help', 'projects', 'experience', 'open gui']
    : ['help', 'neofetch', 'projects', 'about', 'open gui']

  if (useCompact) {
    return (
      <div className="terminal-welcome terminal-welcome-compact">
        <div className="terminal-welcome-inner terminal-welcome-grid">
          <pre className="terminal-welcome-face t-cyan" aria-hidden="true">{PERSONA_COMPACT}</pre>
          <div className="terminal-welcome-meta">
            <p className="terminal-welcome-name t-orange">{profile.name}</p>
            <p className="t-green">{profile.title} · {profile.location.split(',')[0]}</p>
            {role && <p className="t-dim">{role.role} @ {role.company}</p>}
            <p className="terminal-welcome-stack t-dim">
              <span className="t-cyan">stack</span> {topStack}
            </p>
            {featured.length > 0 && (
              <p className="terminal-welcome-ships">
                <span className="t-orange">ships</span>
                <span className="t-dim"> {featured.map((p) => p.name).join(' · ')}</span>
              </p>
            )}
          </div>
        </div>
        <div className="terminal-welcome-hint">
          <span className="t-dim">try </span>
          {hints.slice(0, 4).map((cmd, i) => (
            <span key={cmd}>
              <span className="t-orange">{cmd}</span>
              {i < 3 && <span className="t-dim"> · </span>}
            </span>
          ))}
        </div>
      </div>
    )
  }

  const personaLines = PERSONA_FULL.split('\n')
  const info = [
    profile.name,
    `${profile.title} · ${profile.location}`,
    role ? `${role.role} @ ${role.company}` : '',
    `stack: ${topStack}`,
    `mail: ${profile.email}`,
    'github: github.com/m-tauqueer',
  ].filter(Boolean)
  const maxRows = Math.max(personaLines.length, info.length)

  return (
    <div className="terminal-welcome">
      <div className="terminal-welcome-inner">
        <div className="terminal-welcome-art">
          {Array.from({ length: maxRows }, (_, i) => (
            <div key={i} className="terminal-welcome-row">
              <span className="t-cyan persona-line">{personaLines[i] ?? ''}</span>
              <span className="t-green info-line">{info[i] ?? ''}</span>
            </div>
          ))}
        </div>

        {featured.length > 0 && (
          <div className="terminal-welcome-projects">
            <span className="t-orange">ships:</span>
            <span className="t-dim"> {featured.map((p) => p.name).join(' · ')}</span>
          </div>
        )}

        <div className="terminal-welcome-hint">
          <span className="t-dim">try </span>
          {hints.map((cmd, i) => (
            <span key={cmd}>
              <span className="t-orange">{cmd}</span>
              {i < hints.length - 1 && <span className="t-dim"> · </span>}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
