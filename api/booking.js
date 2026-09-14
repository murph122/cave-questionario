import { listBookingsFromSheets, json } from '../lib/bookingsApi.js'

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return json(res, 204, {})
  if (req.method !== 'GET') return json(res, 405, { error: 'Method not allowed' })

  const webhook = process.env.SHEETS_WEBHOOK_URL
  const url = new URL(req.url, 'http://localhost')
  const code = String(url.searchParams.get('code') || '')
    .toUpperCase()
    .trim()

  if (!code) return json(res, 400, { ok: false, error: 'code required' })
  if (!webhook) {
    return json(res, 503, { ok: false, error: 'SHEETS_WEBHOOK_URL missing' })
  }

  try {
    const data = await listBookingsFromSheets(webhook)
    const bookings = Array.isArray(data.bookings) ? data.bookings : []
    const booking = [...bookings]
      .reverse()
      .find((b) => String(b.participantCode || '').toUpperCase() === code)
    if (!booking) return json(res, 404, { ok: false, error: 'not_found' })
    return json(res, 200, { ok: true, booking })
  } catch (err) {
    return json(res, 500, { ok: false, error: err.message || 'Errore' })
  }
}
