export const BOOKING_START = '2026-09-28'
export const BOOKING_END = '2026-10-09'

/** Four lab sessions per working day. */
export const TIME_SLOTS = [
  { id: 'S1', label: '10:00 – 11:30' },
  { id: 'S2', label: '13:00 – 14:30' },
  { id: 'S3', label: '14:30 – 16:00' },
  { id: 'S4', label: '16:00 – 17:30' },
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

/** @deprecated use formatDateLocale */
export function formatDateIt(iso: string): string {
  return formatDateLocale(iso, 'it-IT')
}
