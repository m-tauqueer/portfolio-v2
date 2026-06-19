// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function handleGet(supabase: any, section: string) {
  switch (section) {
    case 'profile': {
      const { data, error } = await supabase.from('portfolio_profile').select('*').eq('id', 1).single()
      if (error) throw error
      return data
    }
    case 'social': {
      const { data, error } = await supabase.from('portfolio_social').select('*').order('sort_order')
      if (error) throw error
      return data
    }
    case 'skills': {
      const { data, error } = await supabase.from('portfolio_skills').select('*').order('sort_order')
      if (error) throw error
      return data
    }
    case 'education': {
      const { data, error } = await supabase.from('portfolio_education').select('*').order('sort_order')
      if (error) throw error
      return data
    }
    case 'experience': {
      const { data, error } = await supabase.from('portfolio_experience').select('*').order('sort_order')
      if (error) throw error
      return data
    }
    case 'projects': {
      const { data, error } = await supabase.from('portfolio_projects').select('*').order('sort_order')
      if (error) throw error
      return data
    }
    case 'all': {
      const [profile, social, skills, education, experience, projects] = await Promise.all([
        supabase.from('portfolio_profile').select('*').eq('id', 1).single(),
        supabase.from('portfolio_social').select('*').order('sort_order'),
        supabase.from('portfolio_skills').select('*').order('sort_order'),
        supabase.from('portfolio_education').select('*').order('sort_order'),
        supabase.from('portfolio_experience').select('*').order('sort_order'),
        supabase.from('portfolio_projects').select('*').order('sort_order'),
      ])
      return {
        profile: profile.data,
        social: social.data,
        skills: skills.data,
        education: education.data,
        experience: experience.data ?? [],
        projects: projects.data,
      }
    }
    default:
      throw new Error('Invalid section')
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function handlePut(supabase: any, section: string, body: unknown) {
  switch (section) {
    case 'profile': {
      const { error } = await supabase.from('portfolio_profile').upsert({
        id: 1,
        ...(body as object),
        updated_at: new Date().toISOString(),
      })
      if (error) throw error
      return { ok: true }
    }
    case 'social': {
      const rows = body as Array<Record<string, unknown>>
      await supabase.from('portfolio_social').delete().neq('id', 0)
      const { error } = await supabase.from('portfolio_social').insert(rows)
      if (error) throw error
      return { ok: true }
    }
    case 'skills': {
      const rows = body as Array<Record<string, unknown>>
      await supabase.from('portfolio_skills').delete().neq('id', 0)
      const { error } = await supabase.from('portfolio_skills').insert(rows)
      if (error) throw error
      return { ok: true }
    }
    case 'education': {
      const rows = body as Array<Record<string, unknown>>
      await supabase.from('portfolio_education').delete().neq('id', 0)
      const { error } = await supabase.from('portfolio_education').insert(rows)
      if (error) throw error
      return { ok: true }
    }
    case 'experience': {
      const rows = body as Array<Record<string, unknown>>
      await supabase.from('portfolio_experience').delete().neq('id', 0)
      const { error } = await supabase.from('portfolio_experience').insert(rows)
      if (error) throw error
      return { ok: true }
    }
    case 'projects': {
      const rows = body as Array<Record<string, unknown>>
      await supabase.from('portfolio_projects').delete().neq('id', 0)
      const { error } = await supabase.from('portfolio_projects').insert(rows)
      if (error) throw error
      return { ok: true }
    }
    default:
      throw new Error('Invalid section')
  }
}
