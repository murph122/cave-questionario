import { listBookingsFromSheets, json } from '../lib/bookingsApi.js'

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return json(res, 204, {})
  if (req.method !== 'GET') return json(res, 405, { error: 'Method not allowed' })

  const webhook = process.env.SHEETS_WEBHOOK_URL
  if (!webhook) return json(res, 200, { taken: [], bookings: [] })

  try {
    const data = await listBookingsFromSheets(webhook)
    return json(res, 200, {
      taken: Array.isArray(data.taken) ? data.taken : [],
      bookings: Array.isArray(data.bookings) ? data.bookings : [],
    })
  } catch (err) {
    return json(res, 500, { error: err.message || 'Errore server', taken: [], bookings: [] })
  }
}
