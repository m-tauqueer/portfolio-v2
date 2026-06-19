import type { PortfolioData } from '../../types/portfolio'
import { SectionHeading } from '../ui/SectionHeading'
import { ProjectCard } from '../ui/ProjectCard'
import { ScrollRevealGroup } from '../ui/ScrollReveal'

interface ProjectsSectionProps {
  data: PortfolioData
}

export function ProjectsSection({ data }: ProjectsSectionProps) {
  const featured = data.projects.filter((p) => p.featured)

  return (
    <section id="projects" className="page-section page-projects">
      <div className="page-inner">
        <SectionHeading title="// Projects" subtitle="featured work" />
        <ScrollRevealGroup className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8" stagger={0.1}>
          {featured.map((project, i) => (
            <div key={project.id} className="project-card-wrap">
              <ProjectCard project={project} index={i} />
            </div>
          ))}
        </ScrollRevealGroup>
      </div>
    </section>
  )
}
