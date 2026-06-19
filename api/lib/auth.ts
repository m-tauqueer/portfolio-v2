import { createHmac, timingSafeEqual } from 'crypto'

const SESSION_VALUE = 'portfolio-admin-session'

export function createAdminToken(secret: string): string {
  return createHmac('sha256', secret).update(SESSION_VALUE).digest('hex')
}

export function verifyAdminToken(token: string | undefined, secret: string): boolean {
  if (!token) return false
  try {
    const expected = createAdminToken(secret)
    const a = Buffer.from(token)
    const b = Buffer.from(expected)
    return a.length === b.length && timingSafeEqual(a, b)
  } catch {
    return false
  }
}

export function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  if (!cookieHeader) return {}
  return Object.fromEntries(
    cookieHeader.split(';').map((c) => {
      const [key, ...rest] = c.trim().split('=')
      return [key, rest.join('=')]
    })
  )
}

export function requireAdmin(req: { headers: { cookie?: string } }): boolean {
  const password = process.env.ADMIN_PASSWORD
  if (!password) return false
  const cookies = parseCookies(req.headers.cookie)
  return verifyAdminToken(cookies.admin_token, password)
}
