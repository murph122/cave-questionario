const PREFIX = 'cave-q:'

const SURVEY_KEYS = [
  'participantCode',
  'accumulated',
  'draft-anagrafica',
  'draft-pss',
  'draft-session',
  'draft-final',
] as const

export function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function saveJson<T>(key: string, value: T): void {
  localStorage.setItem(PREFIX + key, JSON.stringify(value))
}

export function removeKey(key: string): void {
  localStorage.removeItem(PREFIX + key)
}

/** Clear questionnaire drafts/answers so the next participant starts blank. */
export function clearSurveySession(opts?: { keepAccess?: boolean }): void {
  for (const key of SURVEY_KEYS) {
    removeKey(key)
  }
  if (!opts?.keepAccess) {
    removeKey('access')
  }
}

export type LocalBooking = {
  bookingId: string
  participantCode: string
  date: string
  slotId: string
  contactName: string
  email: string
  phone: string
  note: string
  createdAt: string
}

export function getLocalBookings(): LocalBooking[] {
  return loadJson<LocalBooking[]>('bookings', [])
}

export function addLocalBooking(booking: LocalBooking): void {
  const all = getLocalBookings()
  all.push(booking)
  saveJson('bookings', all)
}

export function isSlotTakenLocally(date: string, slotId: string): boolean {
  return getLocalBookings().some((b) => b.date === date && b.slotId === slotId)
}

export function suggestPersonalCode(nome: string, cognome: string): string {
  const a = nome.replace(/\s+/g, '').slice(0, 3).toUpperCase()
  const b = cognome.replace(/\s+/g, '').slice(0, 3).toUpperCase()
  return `${a}${b}`
}
