export interface Profile {
  id: number
  name: string
  title: string
  bio: string
  location: string
  email: string
  resume_url: string
  interests: string[]
  updated_at?: string
}

export interface SocialLink {
  id: number
  platform: string
  url: string
  label: string
  sort_order: number
}

export interface Skill {
  id: number
  category: string
  items: string[]
  sort_order: number
}

export interface Education {
  id: number
  degree: string
  school: string
  duration: string
  description: string
  sort_order: number
}

export interface Experience {
  id: number
  company: string
  role: string
  duration: string
  description: string
  sort_order: number
}

export interface Project {
  id: number
  slug: string
  name: string
  description: string
  stack: string[]
  github_url: string
  demo_url: string
  featured: boolean
  sort_order: number
}

export interface PortfolioData {
  profile: Profile
  social: SocialLink[]
  skills: Skill[]
  education: Education[]
  experience: Experience[]
  projects: Project[]
}
