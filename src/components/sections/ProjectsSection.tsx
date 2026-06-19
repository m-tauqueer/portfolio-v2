import type { PortfolioData } from '../../types/portfolio'
import { SectionHeading } from '../ui/SectionHeading'
import { ProjectCard } from '../ui/ProjectCard'

interface ProjectsSectionProps {
  data: PortfolioData
}

export function ProjectsSection({ data }: ProjectsSectionProps) {
  const featured = data.projects.filter((p) => p.featured)

  return (
    <section id="projects" className="portfolio-section">
      <SectionHeading title="// Projects" subtitle="featured work" />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {featured.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>
    </section>
  )
}
