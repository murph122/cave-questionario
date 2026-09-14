import type { Plugin } from 'vite'
import { loadEnv } from 'vite'
// @ts-expect-error JS helper shared with Vercel API routes
import { getSheets, postSheets } from './lib/sheetsClient.js'

async function listBookings(webhook: string) {
  try {
    return await postSheets(webhook, { type: 'listBookings' })
  } catch {
    return getSheets(webhook, 'action=listBookings')
  }
}

export function sheetsWebhookApi(mode: string, cwd: string): Plugin {
  const env = loadEnv(mode, cwd, '')
  const webhook = env.SHEETS_WEBHOOK_URL || ''
  const adminPassword = env.ADMIN_PASSWORD || ''
  const siteUrl = env.VITE_PUBLIC_SITE_URL || env.PUBLIC_SITE_URL || ''
  const labLocation = env.LAB_LOCATION || 'Laboratorio CAVE / 3D Lab'

  return {
    name: 'sheets-webhook-api',
    configureServer(server) {
      const readJson = async (req: import('http').IncomingMessage) => {
        const chunks: Buffer[] = []
        for await (const chunk of req) chunks.push(Buffer.from(chunk))
        return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')
      }

      const send = (res: import('http').ServerResponse, status: number, body: unknown) => {
        res.statusCode = status
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(body))
      }

      const isAdmin = (req: import('http').IncomingMessage, body: { password?: string }) => {
        const header = req.headers['x-admin-password']
        const got = String(header || body.password || '')
        return Boolean(adminPassword) && got === adminPassword
      }

      server.middlewares.use(async (req, res, next) => {
        const url = req.url || ''
        if (!url.startsWith('/api/')) return next()

        if (req.method === 'OPTIONS') {
          res.statusCode = 204
          res.end()
          return
        }

        try {
          if (url.startsWith('/api/submit') && req.method === 'POST') {
            const payload = (await readJson(req)) as { type?: string; data?: unknown }
            if (payload.type !== 'google_sheet' && payload.type !== 'google_form') {
              return send(res, 200, { ok: true, mode: 'accepted_local' })
            }
            if (!webhook) {
              return send(res, 503, { ok: false, error: 'SHEETS_WEBHOOK_URL non configurato.' })
            }
            await postSheets(webhook, { type: 'google_sheet', data: payload.data || {} })
            return send(res, 200, { ok: true, mode: 'google_sheets' })
          }

          if (url.startsWith('/api/book') && req.method === 'POST') {
            if (!webhook) return send(res, 503, { error: 'SHEETS_WEBHOOK_URL missing' })
            const body = (await readJson(req)) as Record<string, string>
            if (!body.date || !body.slotId || !body.participantCode) {
              return send(res, 400, { error: 'Campi obbligatori mancanti.' })
            }
            try {
              const listed = await listBookings(webhook)
              const taken = Array.isArray(listed.taken) ? (listed.taken as string[]) : []
              if (taken.includes(`${body.date}|${body.slotId}`)) {
                return send(res, 409, { ok: false, error: 'slot_taken', taken })
              }
            } catch {
              /* ignore */
            }
            const result = await postSheets(webhook, {
              type: 'booking',
              ...body,
              siteUrl: body.siteUrl || siteUrl,
              location: body.location || labLocation,
            })
            return send(res, 200, { ok: true, status: 'pending', ...result })
          }

          if (url.startsWith('/api/slots') && req.method === 'GET') {
            if (!webhook) return send(res, 200, { taken: [], bookings: [] })
            const data = await listBookings(webhook)
            return send(res, 200, {
              taken: Array.isArray(data.taken) ? data.taken : [],
              bookings: Array.isArray(data.bookings) ? data.bookings : [],
            })
          }

          if (url.startsWith('/api/booking') && req.method === 'GET') {
            const u = new URL(url, 'http://localhost')
            const code = String(u.searchParams.get('code') || '')
              .toUpperCase()
              .trim()
            if (!code) return send(res, 400, { ok: false, error: 'code required' })
            if (!webhook) return send(res, 503, { ok: false, error: 'SHEETS_WEBHOOK_URL missing' })
            try {
              const listed = await listBookings(webhook)
              const bookings = Array.isArray(listed.bookings)
                ? (listed.bookings as { participantCode?: string }[])
                : []
              const booking = [...bookings]
                .reverse()
                .find((b) => String(b.participantCode || '').toUpperCase() === code)
              if (!booking) return send(res, 404, { ok: false, error: 'not_found' })
              return send(res, 200, { ok: true, booking })
            } catch (err) {
              const msg = err instanceof Error ? err.message : String(err)
              return send(res, 500, { ok: false, error: msg })
            }
          }

          if (url.startsWith('/api/admin')) {
            if (req.method === 'GET') {
              if (!isAdmin(req, {})) return send(res, 401, { error: 'Unauthorized' })
              if (!webhook) return send(res, 503, { error: 'SHEETS_WEBHOOK_URL missing' })
              const data = await listBookings(webhook)
              return send(res, 200, {
                ok: true,
                bookings: Array.isArray(data.bookings) ? data.bookings : [],
              })
            }
            if (req.method === 'POST') {
              const body = (await readJson(req)) as {
                password?: string
                action?: string
                participantCode?: string
                status?: string
              }
              if (!isAdmin(req, body)) return send(res, 401, { error: 'Unauthorized' })
              if (body.action === 'login') return send(res, 200, { ok: true })
              if (body.action === 'list') {
                if (!webhook) return send(res, 503, { error: 'SHEETS_WEBHOOK_URL missing' })
                const data = await listBookings(webhook)
                return send(res, 200, {
                  ok: true,
                  bookings: Array.isArray(data.bookings) ? data.bookings : [],
                })
              }
              if (body.action === 'approve' || body.action === 'setStatus') {
                if (!webhook) return send(res, 503, { error: 'SHEETS_WEBHOOK_URL missing' })
                const code = String(body.participantCode || '').toUpperCase().trim()
                const status = body.status || 'approved'
                await postSheets(webhook, { type: 'approve', participantCode: code, status })
                return send(res, 200, { ok: true, status })
              }
              return send(res, 400, { error: 'Unknown action' })
            }
          }
        } catch (err) {
          return send(res, 500, {
            ok: false,
            error: err instanceof Error ? err.message : 'api error',
          })
        }

        return next()
      })
    },
  }
}
