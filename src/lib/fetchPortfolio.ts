import fallbackData from '../data/fallback.json'
import { supabase } from './supabase'
import type { PortfolioData } from '../types/portfolio'

export async function fetchPortfolio(): Promise<{ data: PortfolioData; source: 'supabase' | 'fallback' }> {
  if (!supabase) {
    return { data: fallbackData as PortfolioData, source: 'fallback' }
  }

  try {
    const [profileRes, socialRes, skillsRes, educationRes, experienceRes, projectsRes] = await Promise.all([
      supabase.from('portfolio_profile').select('*').eq('id', 1).single(),
      supabase.from('portfolio_social').select('*').order('sort_order'),
      supabase.from('portfolio_skills').select('*').order('sort_order'),
      supabase.from('portfolio_education').select('*').order('sort_order'),
      supabase.from('portfolio_experience').select('*').order('sort_order'),
      supabase.from('portfolio_projects').select('*').order('sort_order'),
    ])

    if (profileRes.error || !profileRes.data) {
      throw new Error(profileRes.error?.message ?? 'Profile not found')
    }

    return {
      data: {
        profile: profileRes.data,
        social: socialRes.data ?? [],
        skills: skillsRes.data ?? [],
        education: educationRes.data ?? [],
        experience: experienceRes.data ?? [],
        projects: projectsRes.data ?? [],
      },
      source: 'supabase',
    }
  } catch {
    return { data: fallbackData as PortfolioData, source: 'fallback' }
  }
}
