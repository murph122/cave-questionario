const PREFIX = 'cave-q:'

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
