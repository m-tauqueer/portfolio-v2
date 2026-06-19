import type { VercelRequest, VercelResponse } from '@vercel/node'
import { requireAdmin } from '../lib/auth'
import { getSupabaseAdmin } from '../lib/supabaseAdmin'
import { handleGet, handlePut } from '../lib/contentHandlers'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!requireAdmin(req)) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const section = req.query.section as string
  const supabase = getSupabaseAdmin()

  try {
    if (req.method === 'GET') {
      return res.status(200).json(await handleGet(supabase, section))
    }

    if (req.method === 'PUT') {
      return res.status(200).json(await handlePut(supabase, section, req.body))
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Server error'
    return res.status(500).json({ error: message })
  }
}
