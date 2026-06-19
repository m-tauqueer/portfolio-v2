import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import fallbackData from '../src/data/fallback.json'
import type { PortfolioData } from '../src/types/portfolio'

const url = process.env.VITE_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !serviceKey) {
  console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env')
  process.exit(1)
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const data = fallbackData as PortfolioData

async function seed() {
  console.log('Seeding Supabase...')

  const { error: profileError } = await supabase.from('portfolio_profile').upsert(data.profile)
  if (profileError) {
    console.error('Profile error:', profileError.message)
    console.error('\nRun supabase/migrations/001_init.sql in Supabase SQL Editor first.')
    process.exit(1)
  }

  await supabase.from('portfolio_social').delete().neq('id', 0)
  const { error: socialError } = await supabase.from('portfolio_social').insert(data.social)
  if (socialError) console.error('Social error:', socialError.message)

  await supabase.from('portfolio_skills').delete().neq('id', 0)
  const { error: skillsError } = await supabase.from('portfolio_skills').insert(data.skills)
  if (skillsError) console.error('Skills error:', skillsError.message)

  await supabase.from('portfolio_education').delete().neq('id', 0)
  const { error: eduError } = await supabase.from('portfolio_education').insert(data.education)
  if (eduError) console.error('Education error:', eduError.message)

  await supabase.from('portfolio_projects').delete().neq('id', 0)
  const { error: projectsError } = await supabase.from('portfolio_projects').insert(data.projects)
  if (projectsError) console.error('Projects error:', projectsError.message)

  console.log('Seed complete!')
}

seed()
