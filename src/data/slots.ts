export const BOOKING_START = '2026-09-28'
export const BOOKING_END = '2026-10-09'

/** Four lab sessions per working day. */
export const TIME_SLOTS = [
  { id: 'S1', label: '09:45 – 11:15', endHour: 11, endMinute: 15 },
  { id: 'S2', label: '11:15 – 12:45', endHour: 12, endMinute: 45 },
  { id: 'S3', label: '14:00 – 15:30', endHour: 15, endMinute: 30 },
  { id: 'S4', label: '15:30 – 17:00', endHour: 17, endMinute: 0 },
] as const

export type SlotId = (typeof TIME_SLOTS)[number]['id']

/** Working days (Mon–Fri) between start and end inclusive. */
export function listAvailableDates(): string[] {
  const dates: string[] = []
  const cur = new Date(`${BOOKING_START}T12:00:00`)
  const end = new Date(`${BOOKING_END}T12:00:00`)
  while (cur <= end) {
    const day = cur.getDay()
    if (day >= 1 && day <= 5) {
      dates.push(cur.toISOString().slice(0, 10))
    }
    cur.setDate(cur.getDate() + 1)
  }
  return dates
}

export function formatDateLocale(iso: string, locale: string = 'it-IT'): string {
  const d = new Date(`${iso}T12:00:00`)
  return d.toLocaleDateString(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/** Short weekday + date for timetable headers. */
export function formatDateShort(iso: string, locale: string = 'it-IT'): string {
  const d = new Date(`${iso}T12:00:00`)
  return d.toLocaleDateString(locale, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

/** Normalize anything Sheets might return into YYYY-MM-DD. */
export function normalizeIsoDate(value: unknown): string {
  if (value == null || value === '') return ''
  if (typeof value === 'string') {
    const m = value.trim().match(/(\d{4}-\d{2}-\d{2})/)
    if (m) return m[1]
    const parsed = new Date(value)
    if (!Number.isNaN(parsed.getTime())) {
      const y = parsed.getFullYear()
      const mo = String(parsed.getMonth() + 1).padStart(2, '0')
      const d = String(parsed.getDate()).padStart(2, '0')
      return `${y}-${mo}-${d}`
    }
    return value.trim()
  }
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    const y = value.getFullYear()
    const mo = String(value.getMonth() + 1).padStart(2, '0')
    const d = String(value.getDate()).padStart(2, '0')
    return `${y}-${mo}-${d}`
  }
  return String(value)
}

function todayIsoLocal(now = new Date()): string {
  const y = now.getFullYear()
  const mo = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${mo}-${d}`
}

/** True if the slot's end time is already past (local time). */
export function isSlotPast(dateIso: string, slotId: string, now = new Date()): boolean {
  const date = normalizeIsoDate(dateIso)
  if (!date) return false
  const today = todayIsoLocal(now)
  if (date < today) return true
  if (date > today) return false
  const slot = TIME_SLOTS.find((s) => s.id === slotId)
  if (!slot) return false
  const end = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    slot.endHour,
    slot.endMinute,
    0,
    0,
  )
  return now.getTime() >= end.getTime()
}

/** True if every slot on that calendar day has already ended. */
export function isDayPast(dateIso: string, now = new Date()): boolean {
  const date = normalizeIsoDate(dateIso)
  if (!date) return false
  const today = todayIsoLocal(now)
  if (date < today) return true
  if (date > today) return false
  const last = TIME_SLOTS[TIME_SLOTS.length - 1]
  return isSlotPast(date, last.id, now)
}

/** Booking is past when its date+slot ended (no slot → treat by day). */
export function isBookingPast(dateIso?: string, slotId?: string, now = new Date()): boolean {
  const date = normalizeIsoDate(dateIso)
  if (!date) return false
  if (slotId) return isSlotPast(date, slotId, now)
  return isDayPast(date, now)
}
