export type SubmitPayload = {
  participantCode: string
  section: 'anagrafica' | 'pss' | 'session' | 'final'
  condition?: 'stressante' | 'non_stressante' | null
  answers: Record<string, string | number | null>
  uiLang?: string
}

export type BookPayload = {
  participantCode: string
  date: string
  slotId: string
  contactName: string
  email: string
  phone: string
  note: string
}

function saveLocalResponse(payload: unknown) {
  const key = 'cave-q:responses'
  const prev = JSON.parse(localStorage.getItem(key) || '[]') as unknown[]
  prev.push({ ...payload as object, submittedAt: new Date().toISOString(), mode: 'local' })
  localStorage.setItem(key, JSON.stringify(prev))
}

async function postJsonWithTimeout<T>(
  url: string,
  body: unknown,
  ms = 2500,
): Promise<T> {
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), ms)
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    })
    const contentType = res.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) {
      throw new Error('API non disponibile')
    }
    const data = (await res.json()) as T & { error?: string }
    if (!res.ok) {
      throw new Error(data.error || `Errore ${res.status}`)
    }
    return data
  } finally {
    window.clearTimeout(timer)
  }
}

/** Always succeeds locally so the user can continue offline / in Vite preview. */
export async function submitResponse(payload: SubmitPayload) {
  saveLocalResponse(payload)
  try {
    await postJsonWithTimeout('/api/submit', {
      ...payload,
      submittedAt: new Date().toISOString(),
    })
    return { ok: true as const, mode: 'remote' as const }
  } catch {
    return { ok: true as const, mode: 'local' as const }
  }
}

export async function createBooking(payload: BookPayload) {
  try {
    await postJsonWithTimeout('/api/book', {
      ...payload,
      createdAt: new Date().toISOString(),
    })
    return { ok: true as const, mode: 'remote' as const }
  } catch {
    return { ok: true as const, mode: 'local' as const }
  }
}

export async function fetchTakenSlots(): Promise<string[]> {
  try {
    const controller = new AbortController()
    const timer = window.setTimeout(() => controller.abort(), 2000)
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
