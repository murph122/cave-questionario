function json(res, status, body) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.end(JSON.stringify(body))
}

async function forwardGetToSheets() {
  const webhook = process.env.SHEETS_WEBHOOK_URL
  if (!webhook) return []
  const url = `${webhook}?action=listBookings`
  const res = await fetch(url)
  if (!res.ok) return []
  const data = await res.json()
  return Array.isArray(data.taken) ? data.taken : []
}

const globalStore = globalThis
if (!globalStore.__caveBookings) globalStore.__caveBookings = []

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return json(res, 204, {})
  if (req.method !== 'GET') return json(res, 405, { error: 'Method not allowed' })

  try {
    const fromMemory = globalStore.__caveBookings.map((b) => `${b.date}|${b.slotId}`)
    const fromSheets = await forwardGetToSheets()
    const taken = [...new Set([...fromMemory, ...fromSheets])]
    return json(res, 200, { taken })
  } catch (err) {
    return json(res, 500, { error: err.message || 'Errore server' })
  }
}
