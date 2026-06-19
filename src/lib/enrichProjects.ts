import type { Project } from '../types/portfolio'

const DEMO_BY_SLUG: Record<string, string> = {
  engram: 'https://engram.tauq.me',
  'meet-bot': 'https://engram.tauq.me',
  staygrad: 'https://www.staygrad.in',
}

const IMAGE_BY_SLUG: Record<string, string> = {
  engram: '/projects/engram.png',
  'meet-bot': '/projects/engram.png',
  staygrad: '/projects/staygrad.png',
}

export function enrichProject(project: Project): Project {
  return {
    ...project,
    demo_url: project.demo_url?.trim() || DEMO_BY_SLUG[project.slug] || '',
    image_url: project.image_url?.trim() || IMAGE_BY_SLUG[project.slug] || '',
  }
}

export function enrichProjects(projects: Project[]): Project[] {
  return projects.map(enrichProject)
}
