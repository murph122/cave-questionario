import { getSheets, postSheets } from '../lib/sheetsClient.js'

function json(res, status, body) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Password')
  res.end(JSON.stringify(body))
}

/** Prefer POST listBookings — Apps Script GET query params are unreliable after 302. */
export async function listBookingsFromSheets(webhook) {
  try {
    return await postSheets(webhook, { type: 'listBookings' })
  } catch {
    return getSheets(webhook, 'action=listBookings')
  }
}

export { json }
