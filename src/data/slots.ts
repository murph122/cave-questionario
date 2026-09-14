export const BOOKING_START = '2026-09-28'
export const BOOKING_END = '2026-10-09'

export const TIME_SLOTS = [
  { id: 'S1', label: '09:00 – 10:00' },
  { id: 'S2', label: '10:00 – 11:00' },
  { id: 'S3', label: '11:00 – 12:00' },
  { id: 'S4', label: '14:00 – 15:00' },
  { id: 'S5', label: '15:00 – 16:00' },
  { id: 'S6', label: '16:00 – 17:00' },
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

/** @deprecated use formatDateLocale */
export function formatDateIt(iso: string): string {
  return formatDateLocale(iso, 'it-IT')
}
