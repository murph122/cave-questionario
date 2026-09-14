function json(res, status, body) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.end(JSON.stringify(body))
}

async function readBody(req) {
  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  const raw = Buffer.concat(chunks).toString('utf8')
  return raw ? JSON.parse(raw) : {}
}

async function forwardToSheets(payload) {
  const webhook = process.env.SHEETS_WEBHOOK_URL
  if (!webhook) return { mode: 'demo' }
  const res = await fetch(webhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Sheets webhook error: ${res.status} ${text}`)
  }
  return { mode: 'sheets' }
}

// In-memory fallback for a single serverless instance (demo only).
const globalStore = globalThis
if (!globalStore.__caveBookings) globalStore.__caveBookings = []

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return json(res, 204, {})
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' })

  try {
    const body = await readBody(req)
    if (!body.date || !body.slotId || !body.participantCode) {
      return json(res, 400, { error: 'Campi obbligatori mancanti.' })
    }
    if (!body.email && !body.phone) {
      return json(res, 400, { error: 'Serve email o telefono.' })
    }

    const key = `${body.date}|${body.slotId}`
    const taken = globalStore.__caveBookings.some((b) => `${b.date}|${b.slotId}` === key)
    if (taken) {
      return json(res, 409, { error: 'Fascia oraria già prenotata.' })
    }

    globalStore.__caveBookings.push(body)
    const result = await forwardToSheets({ type: 'booking', ...body })
    return json(res, 200, { ok: true, ...result })
  } catch (err) {
    return json(res, 500, { error: err.message || 'Errore server' })
  }
}
