import { postSheets } from '../lib/sheetsClient.js'
import { json } from '../lib/bookingsApi.js'

async function readBody(req) {
  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  const raw = Buffer.concat(chunks).toString('utf8')
  return raw ? JSON.parse(raw) : {}
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return json(res, 204, {})
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' })

  const webhook = process.env.SHEETS_WEBHOOK_URL
  if (!webhook) return json(res, 503, { error: 'SHEETS_WEBHOOK_URL missing' })

  try {
    const body = await readBody(req)
    if (!body.date || !body.slotId || !body.participantCode) {
      return json(res, 400, { error: 'Campi obbligatori mancanti.' })
    }
    if (!body.email && !body.phone) {
      return json(res, 400, { error: 'Serve email o telefono.' })
    }

    const siteUrl =
      body.siteUrl ||
      process.env.VITE_PUBLIC_SITE_URL ||
      process.env.PUBLIC_SITE_URL ||
      'https://cave-questionario.vercel.app'
    const location =
      body.location ||
      process.env.LAB_LOCATION ||
      'Laboratorio CAVE / 3D Lab'

    const payload = {
      type: 'booking',
      ...body,
      siteUrl,
      location,
      status: 'pending',
    }

    // Write booking only — respond ASAP so the browser does not abort
    const result = await postSheets(webhook, payload, 25000)

    // Fire-and-forget email (do not block JSON response)
    postSheets(webhook, { type: 'sendBookingEmail', ...payload }, 15000).catch(() => {})

    return json(res, 200, {
      ok: true,
      status: 'pending',
      emailSent: false,
      emailDeferred: true,
      ...result,
    })
  } catch (err) {
    const msg = err.message || 'Errore server'
    if (String(msg).includes('slot_taken')) {
      return json(res, 409, { ok: false, error: 'slot_taken' })
    }
    return json(res, 500, {
      error: `${msg} — Verifica Apps Script (ridistribuisci Code.gs) e SHEETS_WEBHOOK_URL su Vercel.`,
    })
  }
}
