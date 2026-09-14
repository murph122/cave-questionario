import { getSheets, postSheets } from '../lib/sheetsClient.js'

function json(res, status, body) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Password')
  res.end(JSON.stringify(body))
}

async function readBody(req) {
  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  const raw = Buffer.concat(chunks).toString('utf8')
  return raw ? JSON.parse(raw) : {}
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return json(res, 204, {})
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' })

  const WEBHOOK = process.env.SHEETS_WEBHOOK_URL || ''
  try {
    const body = await readBody(req)
    if (body.type !== 'google_sheet' && body.type !== 'google_form') {
      return json(res, 200, { ok: true, mode: 'accepted_local' })
    }
    if (!WEBHOOK) {
      return json(res, 503, { ok: false, error: 'SHEETS_WEBHOOK_URL missing on Vercel.' })
    }
    await postSheets(WEBHOOK, { type: 'google_sheet', data: body.data || {} })
    return json(res, 200, { ok: true, mode: 'google_sheets' })
  } catch (err) {
    return json(res, 500, { error: err.message || 'Errore server' })
  }
}
