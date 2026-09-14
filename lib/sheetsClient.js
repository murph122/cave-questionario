import https from 'node:https'
import http from 'node:http'
import { URL } from 'node:url'

function requestOnce(url, method, body) {
  return new Promise((resolve, reject) => {
    const u = new URL(url)
    const lib = u.protocol === 'http:' ? http : https
    const req = lib.request(
      {
        protocol: u.protocol,
        hostname: u.hostname,
        port: u.port || (u.protocol === 'http:' ? 80 : 443),
        path: `${u.pathname}${u.search}`,
        method,
        headers:
          method === 'POST'
            ? {
                'Content-Type': 'text/plain;charset=utf-8',
                'Content-Length': Buffer.byteLength(body || ''),
              }
            : undefined,
      },
      (res) => {
        const chunks = []
        res.on('data', (c) => chunks.push(c))
        res.on('end', () => {
          resolve({
            status: res.statusCode || 0,
            location: res.headers.location,
            body: Buffer.concat(chunks).toString('utf8'),
          })
        })
      },
    )
    req.on('error', reject)
    if (method === 'POST' && body) req.write(body)
    req.end()
  })
}

function parseJson(res) {
  let parsed = {}
  try {
    parsed = JSON.parse(res.body || '{}')
  } catch {
    throw new Error(`Sheets non-JSON (${res.status}): ${String(res.body).slice(0, 160)}`)
  }
  if (res.status >= 400 || parsed.ok === false) {
    throw new Error(String(parsed.error || `Sheets error ${res.status}`))
  }
  return parsed
}

export async function postSheets(webhook, data) {
  const body = JSON.stringify(data)
  const first = await requestOnce(webhook, 'POST', body)
  if (first.status >= 300 && first.status < 400 && first.location) {
    const loc = new URL(first.location, webhook).toString()
    const second = await requestOnce(loc, 'GET')
    return parseJson(second)
  }
  return parseJson(first)
}

export async function getSheets(webhook, query) {
  const url = webhook.includes('?') ? `${webhook}&${query}` : `${webhook}?${query}`
  const first = await requestOnce(url, 'GET')
  if (first.status >= 300 && first.status < 400 && first.location) {
    const loc = new URL(first.location, url).toString()
    const second = await requestOnce(loc, 'GET')
    return parseJson(second)
  }
  return parseJson(first)
}
