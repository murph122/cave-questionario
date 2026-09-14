import { saveAccumulated, saveSessionCondition } from './accumulate'
import { buildFullPayload, missingFinalFields, missingGoogleFields, missingSessionFields } from './prepareSubmit'
import { buildSheetPayload } from './sheetPayload'
import { clearSurveySession, removeKey } from './storage'
import { getAccess, setAccess } from './access'

export type SubmitPayload = {
  participantCode: string
  section: 'anagrafica' | 'pss' | 'session' | 'final'
  condition?: 'stressante' | 'non_stressante' | null
  answers: Record<string, string | number | null>
  ssqAltro?: string
  uiLang?: string
}

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
}

function saveLocalResponse(payload: unknown) {
  const key = 'cave-q:responses'
  const prev = JSON.parse(localStorage.getItem(key) || '[]') as unknown[]
  prev.push({ ...(payload as object), submittedAt: new Date().toISOString(), mode: 'local' })
  localStorage.setItem(key, JSON.stringify(prev))
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
  } finally {
    window.clearTimeout(timer)
  }
}

async function pushToGoogleSheet(data: ReturnType<typeof buildSheetPayload>) {
  return postJsonWithTimeout<{ ok: boolean; mode?: string }>('/api/submit', {
    type: 'google_sheet',
    data,
  })
}

export async function submitResponse(payload: SubmitPayload) {
  saveLocalResponse(payload)

  if (payload.section === 'anagrafica') {
    const code = String(payload.answers.codicePersonale || payload.participantCode)
    saveAccumulated({
      participantCode: code,
      anagrafica: {
        nome: String(payload.answers.nome ?? ''),
        cognome: String(payload.answers.cognome ?? ''),
        codicePersonale: code,
        eta: payload.answers.eta as number | string,
      },
    })
    return { ok: true as const, mode: 'local' as const, synced: false }
  }

  if (payload.section === 'pss') {
    saveAccumulated({
      participantCode: payload.participantCode,
      pss: payload.answers as Record<string, number>,
    })
    return { ok: true as const, mode: 'local' as const, synced: false }
  }

  if (payload.section === 'session') {
    const condition = payload.condition
    if (condition !== 'stressante' && condition !== 'non_stressante') {
      throw new Error('Seleziona la condizione')
    }
    const answers = payload.answers as Record<string, number>
    const miss = missingSessionFields(answers)
    if (miss.length) {
      throw new Error(`Dati incompleti: ${miss.slice(0, 8).join(', ')}`)
    }

    saveSessionCondition(condition, answers)
    removeKey('draft-session')

    const acc = buildFullPayload(payload.participantCode)
    const bothDone =
      Boolean(acc.sessions?.stressante?.answers) &&
      Boolean(acc.sessions?.non_stressante?.answers) &&
      missingSessionFields(acc.sessions?.stressante?.answers).length === 0 &&
      missingSessionFields(acc.sessions?.non_stressante?.answers).length === 0

    return {
      ok: true as const,
      mode: 'local' as const,
      synced: false,
      bothConditionsDone: bothDone,
      savedCondition: condition,
    }
  }

  if (payload.section === 'final') {
    const answers = payload.answers as Record<string, number | string>
    const miss = missingFinalFields(answers)
    if (miss.length) {
      throw new Error(`Dati incompleti: ${miss.slice(0, 8).join(', ')}`)
    }

    saveAccumulated({
      participantCode: payload.participantCode,
      final: {
        answers,
        ssqAltro: payload.ssqAltro || '',
      },
    })

    const full = buildFullPayload(payload.participantCode)
    full.final = { answers, ssqAltro: payload.ssqAltro || '' }

    const blocked = missingGoogleFields(full)
    if (blocked.length) {
      throw new Error(`Parti incomplete: ${blocked.slice(0, 10).join(', ')}`)
    }

    const result = await pushToGoogleSheet(buildSheetPayload(full))
    const access = getAccess()
    if (access) setAccess({ ...access, status: 'done' })
    clearSurveySession({ keepAccess: true })
    return { ...result, synced: true, reset: true, complete: true }
  }

  return { ok: true as const, mode: 'local' as const, synced: false }
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
  )
}

export async function fetchTakenSlots(): Promise<string[]> {
  try {
    const controller = new AbortController()
    const timer = window.setTimeout(() => controller.abort(), 5000)
    const res = await fetch('/api/slots', { signal: controller.signal })
    window.clearTimeout(timer)
    const contentType = res.headers.get('content-type') || ''
    if (!res.ok || !contentType.includes('application/json')) return []
    const data = (await res.json()) as { taken: string[] }
    return data.taken || []
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
    bookings?: number
    error?: string
  }>(
    '/api/admin',
    { action: 'ping', password },
    15000,
    { 'X-Admin-Password': password },
  )
}
