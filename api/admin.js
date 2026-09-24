import { postSheets } from '../lib/sheetsClient.js'
import { listBookingsFromSheets, json } from '../lib/bookingsApi.js'

async function readBody(req) {
  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  const raw = Buffer.concat(chunks).toString('utf8')
  return raw ? JSON.parse(raw) : {}
}

function checkAdmin(req, body) {
  const expected = process.env.ADMIN_PASSWORD || ''
  const fromHeader = req.headers['x-admin-password']
  const fromBody = body && body.password
  const got = String(fromHeader || fromBody || '')
  return Boolean(expected) && got === expected
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return json(res, 204, {})

  const webhook = process.env.SHEETS_WEBHOOK_URL
  if (!webhook) {
    return json(res, 503, {
      error: 'SHEETS_WEBHOOK_URL missing — configura su Vercel e ridistribuisci Apps Script.',
    })
  }

  try {
    if (req.method === 'GET') {
      if (!checkAdmin(req, {})) return json(res, 401, { error: 'Unauthorized' })
      const data = await listBookingsFromSheets(webhook)
      return json(res, 200, {
        ok: true,
        bookings: Array.isArray(data.bookings) ? data.bookings : [],
      })
    }

    if (req.method === 'POST') {
      const body = await readBody(req)
      if (!checkAdmin(req, body)) return json(res, 401, { error: 'Unauthorized' })

      if (body.action === 'login') {
        return json(res, 200, { ok: true })
      }

      if (body.action === 'list') {
        const data = await listBookingsFromSheets(webhook)
        return json(res, 200, {
          ok: true,
          bookings: Array.isArray(data.bookings) ? data.bookings : [],
        })
      }

      if (body.action === 'approve' || body.action === 'setStatus') {
        const code = String(body.participantCode || '').toUpperCase().trim()
        const status = body.status || 'approved'
        if (!code) return json(res, 400, { error: 'participantCode required' })
        await postSheets(webhook, {
          type: 'approve',
          participantCode: code,
          status,
          date: body.date || '',
          slotId: body.slotId || '',
          contactName: body.contactName || '',
          email: body.email || '',
          note: body.note || 'approved-from-admin',
        })
        return json(res, 200, { ok: true, status })
      }

      if (body.action === 'reschedule') {
        const code = String(body.participantCode || '').toUpperCase().trim()
        if (!code || !body.newDate || !body.newSlotId) {
          return json(res, 400, { error: 'participantCode, newDate, newSlotId required' })
        }
        const data = await postSheets(webhook, {
          type: 'reschedule',
          participantCode: code,
          date: body.date || '',
          slotId: body.slotId || '',
          newDate: body.newDate,
          newSlotId: body.newSlotId,
        })
        return json(res, 200, { ok: true, ...data })
      }

      if (body.action === 'ping') {
        const data = await postSheets(webhook, { type: 'ping' })
        return json(res, 200, { ok: true, ...data })
      }

      return json(res, 400, { error: 'Unknown action' })
    }

    return json(res, 405, { error: 'Method not allowed' })
  } catch (err) {
    return json(res, 500, {
      error:
        err.message ||
        'Errore server. Ridistribuisci apps-script/Code.gs (Nuova versione → Deploy).',
    })
  }
}
