import type { Project } from '../../types/portfolio'
import { GlitchText } from './GlitchText'
import { ProjectCardVisual } from './ProjectCardVisual'

interface ProjectCardProps {
  project: Project
  index: number
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const indexLabel = String(index + 1).padStart(2, '0')

  return (
    <article className="project-card group">
      <span className="project-card-index" aria-hidden="true">{indexLabel}</span>
      <span className="project-card-corner project-card-corner--tl" aria-hidden="true" />
      <span className="project-card-corner project-card-corner--tr" aria-hidden="true" />
      <span className="project-card-corner project-card-corner--bl" aria-hidden="true" />
      <span className="project-card-corner project-card-corner--br" aria-hidden="true" />

      <ProjectCardVisual project={project} />

      <div className="project-card-body">
        <p className="project-card-slug">// {project.slug}</p>
        <h3 className="project-card-title">
          <GlitchText as="span" intensity="low">{project.name}</GlitchText>
        </h3>
        <p className="project-card-desc">{project.description}</p>
        <div className="flex flex-wrap gap-2 mt-3">
          {project.stack.map((tech) => (
            <span key={tech} className="tech-tag">{tech}</span>
          ))}
        </div>
        <div className="flex flex-wrap gap-3 mt-4">
          {project.github_url && (
            <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="project-link">
              GitHub →
            </a>
          )}
          {project.demo_url && (
            <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="project-link project-link--demo">
              Demo →
            </a>
          )}
        </div>
      </div>
    </article>
  )
}
