import { listBookingsFromSheets, json } from '../lib/bookingsApi.js'

function normalizeDate(value) {
  if (value == null || value === '') return ''
  const s = String(value).trim()
  const m = s.match(/(\d{4}-\d{2}-\d{2})/)
  if (m) return m[1]
  const d = new Date(s)
  if (!Number.isNaN(d.getTime())) {
    const y = d.getFullYear()
    const mo = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${mo}-${day}`
  }
  return s
}

/** Rebuild taken keys from booking rows (source of truth). */
function takenFromBookings(bookings) {
  const keys = []
  for (const b of bookings || []) {
    const status = String(b.status || '').toLowerCase().trim()
    if (status !== 'approved' && status !== 'done') continue
    const date = normalizeDate(b.date)
    const slotId = String(b.slotId || '').trim()
    if (!date || !slotId) continue
    keys.push(`${date}|${slotId}`)
  }
  return [...new Set(keys)]
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return json(res, 204, {})
  if (req.method !== 'GET') return json(res, 405, { error: 'Method not allowed' })

  const webhook = process.env.SHEETS_WEBHOOK_URL
  if (!webhook) return json(res, 200, { taken: [], bookings: [] })

  try {
    const data = await listBookingsFromSheets(webhook)
    const bookings = Array.isArray(data.bookings) ? data.bookings : []
    const fromScript = Array.isArray(data.taken) ? data.taken : []
    const fromRows = takenFromBookings(bookings)
    // Prefer union so neither side can miss an approved slot
    const taken = [...new Set([...fromScript, ...fromRows].map((k) => {
      const [d, s] = String(k).split('|')
      return `${normalizeDate(d)}|${String(s || '').trim()}`
    }).filter((k) => k.includes('|') && !k.startsWith('|') && !k.endsWith('|')))]

    return json(res, 200, { taken, bookings })
  } catch (err) {
    return json(res, 500, { error: err.message || 'Errore server', taken: [], bookings: [] })
  }
}
