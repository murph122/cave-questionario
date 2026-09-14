const GOOGLE_FORM_ID = '1FAIpQLSeVp6MFNf84QLfo0YP8iNyozAX8Gr9ZV0lLxUT1LtTgO2_qjQ'
const GOOGLE_FORM_VIEW = `https://docs.google.com/forms/d/e/${GOOGLE_FORM_ID}/viewform`

function extractTokens(html) {
  const get = (name) => {
    const m = html.match(new RegExp(`name="${name}"\\s+value="([^"]*)"`, 'i'))
    return m?.[1]
  }
  return {
    fbzx: get('fbzx'),
    fvv: get('fvv') || '1',
    pageHistory: get('pageHistory') || '0',
  }
}

function json(res, status, body) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.end(JSON.stringify(body))
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return json(res, 204, {})
  if (req.method !== 'GET') return json(res, 405, { error: 'Method not allowed' })
  try {
    const view = await fetch(GOOGLE_FORM_VIEW)
    const html = await view.text()
    return json(res, 200, extractTokens(html))
  } catch (err) {
    return json(res, 500, { error: err.message || 'token error' })
  }
}
