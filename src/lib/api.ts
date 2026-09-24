export type BookPayload = {
  bookingId?: string
  participantCode: string
  date: string
  slotId: string
  contactName: string
  email: string
  phone: string
  note: string
  createdAt?: string
  siteUrl?: string
  location?: string
}

export type BookingInfo = {
  participantCode: string
  status: string
  date?: string
  slotId?: string
  contactName?: string
  email?: string
  phone?: string
}

async function postJsonWithTimeout<T>(
  url: string,
  body: unknown,
  ms = 20000,
  headers?: Record<string, string>,
): Promise<T> {
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), ms)
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(body),
      signal: controller.signal,
    })
    const contentType = res.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) {
      throw new Error('API non disponibile')
    }
    const data = (await res.json()) as T & { error?: string; ok?: boolean }
    if (!res.ok || data.ok === false) {
      const err = new Error(data.error || `Errore ${res.status}`) as Error & {
        status?: number
        payload?: unknown
      }
      err.status = res.status
      err.payload = data
      throw err
    }
    return data
  } catch (err) {
    const name = err instanceof Error ? err.name : ''
    if (name === 'AbortError' || (typeof DOMException !== 'undefined' && err instanceof DOMException && err.name === 'AbortError')) {
      throw new Error('TIMEOUT')
    }
    throw err
  } finally {
    window.clearTimeout(timer)
  }
}

export async function createBooking(payload: BookPayload) {
  const siteUrl =
    payload.siteUrl ||
    (typeof window !== 'undefined'
      ? import.meta.env.VITE_PUBLIC_SITE_URL || window.location.origin
      : '')
  return postJsonWithTimeout<{ ok: boolean; status?: string; taken?: string[]; emailSent?: boolean }>(
    '/api/book',
    {
      ...payload,
      siteUrl,
      location: payload.location || import.meta.env.VITE_LAB_LOCATION || undefined,
      createdAt: payload.createdAt || new Date().toISOString(),
    },
    55000,
  )
}

export async function fetchTakenSlots(): Promise<string[]> {
  try {
    const controller = new AbortController()
    const timer = window.setTimeout(() => controller.abort(), 20000)
    const res = await fetch('/api/slots', { signal: controller.signal })
    window.clearTimeout(timer)
    const contentType = res.headers.get('content-type') || ''
    if (!res.ok || !contentType.includes('application/json')) return []
    const data = (await res.json()) as {
      taken?: string[]
      bookings?: Array<{ date?: string; slotId?: string; status?: string }>
    }
    const fromTaken = data.taken || []
    const fromBookings = (data.bookings || [])
      .filter((b) => {
        const s = String(b.status || '').toLowerCase()
        return s === 'approved' || s === 'done'
      })
      .map((b) => {
        const d = String(b.date || '').match(/(\d{4}-\d{2}-\d{2})/)?.[1] || String(b.date || '')
        const slot = String(b.slotId || '').trim()
        return d && slot ? `${d}|${slot}` : ''
      })
      .filter(Boolean)
    return [...new Set([...fromTaken, ...fromBookings])]
  } catch {
    return []
  }
}

export async function lookupBooking(code: string): Promise<BookingInfo | null> {
  const res = await fetch(`/api/booking?code=${encodeURIComponent(code.trim().toUpperCase())}`)
  const data = (await res.json()) as {
    ok?: boolean
    error?: string
    booking?: BookingInfo
  }
  if (!res.ok || !data.ok || !data.booking) return null
  return data.booking
}

export async function adminLogin(password: string) {
  return postJsonWithTimeout<{ ok: boolean }>(
    '/api/admin',
    { action: 'login', password },
    10000,
    { 'X-Admin-Password': password },
  )
}

export async function adminListBookings(password: string) {
  return postJsonWithTimeout<{ ok?: boolean; bookings?: BookingInfo[]; error?: string }>(
    '/api/admin',
    { action: 'list', password },
    20000,
    { 'X-Admin-Password': password },
  ).then((data) => data.bookings || [])
}

export async function adminSetStatus(
  password: string,
  participantCode: string,
  status: 'approved' | 'pending' | 'cancelled' | 'done',
  extra?: { date?: string; slotId?: string; contactName?: string; email?: string },
) {
  return postJsonWithTimeout(
    '/api/admin',
    {
      action: 'setStatus',
      participantCode,
      status,
      password,
      ...extra,
    },
    15000,
    { 'X-Admin-Password': password },
  )
}

export async function adminPing(password: string) {
  return postJsonWithTimeout<{
    ok?: boolean
    sheet?: string
    bookingsSheet?: string
    responsesSheet?: string
    bookingsIdSet?: boolean
    bookings?: number
    error?: string
  }>(
    '/api/admin',
    { action: 'ping', password },
    15000,
    { 'X-Admin-Password': password },
  )
}
