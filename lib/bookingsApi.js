import { postSheets } from '../lib/sheetsClient.js'

function json(res, status, body) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Cache-Control', 'no-store')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Password')
  res.end(JSON.stringify(body))
}

function assertBookingsList(data) {
  if (!data || !Array.isArray(data.bookings)) {
    throw new Error(
      'Invalid listBookings response (expected bookings array). Redeploy Apps Script if this persists.',
    )
  }
  return data
}

/**
 * List bookings via POST only.
 * GET fallback is unsafe: Apps Script 302 often drops query params and returns ping
 * (bookings as a number), which callers used to coerce into [].
 */
export async function listBookingsFromSheets(webhook) {
  return assertBookingsList(await postSheets(webhook, { type: 'listBookings' }, 18000))
}

export { json }
