import type { IncomingMessage, ServerResponse } from 'node:http'
import { loadEnv, type Plugin } from 'vite'
import { createAdminToken, parseCookies, verifyAdminToken } from '../api/lib/auth'
import { getSupabaseAdmin } from '../api/lib/supabaseAdmin'
import { handleGet, handlePut } from '../api/lib/contentHandlers'

function readBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (chunk) => chunks.push(chunk))
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString()
      if (!raw) {
        resolve({})
        return
      }
      try {
        resolve(JSON.parse(raw))
      } catch {
        reject(new Error('Invalid JSON'))
      }
    })
    req.on('error', reject)
  })
}

function sendJson(res: ServerResponse, status: number, data: unknown) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(data))
}

function isAdmin(req: IncomingMessage): boolean {
  const password = process.env.ADMIN_PASSWORD
  if (!password) return false
  const cookies = parseCookies(req.headers.cookie)
  return verifyAdminToken(cookies.admin_token, password)
}

export function apiDevPlugin(): Plugin {
  return {
    name: 'vite-api-dev',
    configureServer(server) {
      const env = loadEnv(server.config.mode, process.cwd(), '')
      Object.assign(process.env, env)

      server.middlewares.use(async (req, res, next) => {
        const rawUrl = req.url ?? ''
        if (!rawUrl.startsWith('/api/')) {
          next()
          return
        }

        try {
          const parsed = new URL(rawUrl, 'http://localhost')
          const { pathname } = parsed

          if (pathname === '/api/admin/verify' && req.method === 'POST') {
            const body = (await readBody(req)) as { password?: string }
            const adminPassword = process.env.ADMIN_PASSWORD
            if (!adminPassword) {
              sendJson(res, 500, { error: 'Admin password not configured' })
              return
            }
            if (!body.password || body.password !== adminPassword) {
              sendJson(res, 401, { error: 'Invalid password' })
              return
            }
            const token = createAdminToken(adminPassword)
            res.setHeader(
              'Set-Cookie',
              `admin_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`
            )
            sendJson(res, 200, { ok: true })
            return
          }

          if (pathname === '/api/admin/logout' && req.method === 'POST') {
            res.setHeader('Set-Cookie', 'admin_token=; Path=/; HttpOnly; Max-Age=0')
            sendJson(res, 200, { ok: true })
            return
          }

          if (pathname === '/api/admin/content') {
            if (!isAdmin(req)) {
              sendJson(res, 401, { error: 'Unauthorized' })
              return
            }

            const section = parsed.searchParams.get('section') ?? ''
            const supabase = getSupabaseAdmin()

            if (req.method === 'GET') {
              sendJson(res, 200, await handleGet(supabase, section))
              return
            }

            if (req.method === 'PUT') {
              const body = await readBody(req)
              sendJson(res, 200, await handlePut(supabase, section, body))
              return
            }

            sendJson(res, 405, { error: 'Method not allowed' })
            return
          }

          sendJson(res, 404, { error: 'Not found' })
        } catch (e) {
          const message = e instanceof Error ? e.message : 'Server error'
          sendJson(res, 500, { error: message })
        }
      })
    },
  }
}
