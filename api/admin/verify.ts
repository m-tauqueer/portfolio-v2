import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createAdminToken } from '../lib/auth'

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const password = process.env.ADMIN_PASSWORD
  if (!password) {
    return res.status(500).json({ error: 'Admin password not configured' })
  }

  const { password: attempt } = req.body as { password?: string }

  if (!attempt || attempt !== password) {
    return res.status(401).json({ error: 'Invalid password' })
  }

  const token = createAdminToken(password)
  res.setHeader(
    'Set-Cookie',
    `admin_token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`
  )

  return res.status(200).json({ ok: true })
}
