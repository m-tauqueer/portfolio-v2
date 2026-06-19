import type { Project } from '../../types/portfolio'

interface ProjectCardVisualProps {
  project: Project
}

function CyberOverlays() {
  return (
    <>
      <div className="project-gradient-dark" aria-hidden="true" />
      <div className="project-gradient-shift" aria-hidden="true" />
      <div className="project-gradient-vignette" aria-hidden="true" />
      <div className="project-card-scanlines" aria-hidden="true" />
      <div className="project-card-noise" aria-hidden="true" />
      <div className="project-card-chromatic" aria-hidden="true" />
    </>
  )
}

export function ProjectCardVisual({ project }: ProjectCardVisualProps) {
  const imageUrl = project.image_url

  if (project.slug === 'shell' || project.name.toLowerCase().includes('shell')) {
    return (
      <div className="project-card-visual project-card-visual--terminal">
        <div className="ptp-window">
          <div className="ptp-bar">
            <span className="ptp-dot red" />
            <span className="ptp-dot yellow" />
            <span className="ptp-dot green" />
            <span className="ptp-title">minishell — java</span>
          </div>
          <div className="ptp-body">
            <p><span className="ptp-prompt">$</span> ./minishell</p>
            <p className="ptp-out">Minishell v1.0 — POSIX shell in Java</p>
            <p><span className="ptp-prompt">$</span> ls builtin</p>
            <p className="ptp-dim">cd · echo · pwd · export · type</p>
            <p><span className="ptp-prompt">$</span> echo &quot;hello world&quot;</p>
            <p className="ptp-out">hello world</p>
            <p><span className="ptp-prompt">$</span> <span className="ptp-cursor" /></p>
          </div>
        </div>
        <CyberOverlays />
      </div>
    )
  }

  if (imageUrl) {
    return (
      <div className="project-card-visual project-card-visual--image">
        <img src={imageUrl} alt={`${project.name} preview`} loading="lazy" />
        <CyberOverlays />
      </div>
    )
  }

  return (
    <div className="project-card-visual project-card-visual--fallback">
      <span className="text-accent/30 text-4xl font-bold font-mono">
        {project.name.charAt(0)}
      </span>
      <CyberOverlays />
    </div>
  )
}
