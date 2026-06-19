import { motion } from 'framer-motion'
import type { Project } from '../../types/portfolio'

const GRADIENTS = [
  'from-orange-500/20 to-cyan-500/15',
  'from-violet-500/20 to-orange-500/15',
  'from-cyan-500/15 to-violet-500/20',
]

interface ProjectCardProps {
  project: Project
  index: number
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const gradient = GRADIENTS[index % GRADIENTS.length]

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="project-card group"
    >
      <div className={`project-card-image bg-gradient-to-br ${gradient}`}>
        <span className="text-accent/30 text-4xl font-bold font-mono">
          {project.name.charAt(0)}
        </span>
      </div>
      <div className="project-card-body">
        <h3 className="text-accent font-mono font-semibold text-lg group-hover:text-cyan-400 transition">
          {project.name}
        </h3>
        <p className="text-muted text-sm mt-2 line-clamp-3">{project.description}</p>
        <div className="flex flex-wrap gap-2 mt-3">
          {project.stack.map((tech) => (
            <span key={tech} className="tech-tag">{tech}</span>
          ))}
        </div>
        <div className="flex gap-3 mt-4">
          {project.github_url && (
            <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="project-link">
              GitHub →
            </a>
          )}
          {project.demo_url && (
            <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="project-link">
              Demo →
            </a>
          )}
        </div>
      </div>
    </motion.article>
  )
}
