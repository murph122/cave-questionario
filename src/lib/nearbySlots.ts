import { listAvailableDates, TIME_SLOTS, type SlotId } from '../data/slots'

export type SlotSuggestion = {
  date: string
  slotId: SlotId
  label: string
  key: string
}

/** Suggest nearby free slots when the preferred one is taken. */
export function suggestNearbySlots(
  preferredDate: string,
  preferredSlotId: string,
  taken: Set<string> | string[],
  limit = 5,
): SlotSuggestion[] {
  const takenSet = taken instanceof Set ? taken : new Set(taken)
  const dates = listAvailableDates()
  const slotIds = TIME_SLOTS.map((s) => s.id)
  const prefSlotIdx = Math.max(0, slotIds.indexOf(preferredSlotId as SlotId))
  const prefDateIdx = Math.max(0, dates.indexOf(preferredDate))

  const ranked: { score: number; date: string; slotId: SlotId }[] = []

  for (let di = 0; di < dates.length; di++) {
    const date = dates[di]
    for (let si = 0; si < slotIds.length; si++) {
      const slotId = slotIds[si]
      const key = `${date}|${slotId}`
      if (takenSet.has(key)) continue
      if (date === preferredDate && slotId === preferredSlotId) continue
      const dayDist = Math.abs(di - prefDateIdx)
      const slotDist = Math.abs(si - prefSlotIdx)
      // Prefer same day, then nearby time, then nearby days
      const score = dayDist * 10 + slotDist + (date === preferredDate ? 0 : 0.5)
      ranked.push({ score, date, slotId })
    }
  }

  ranked.sort((a, b) => a.score - b.score)
  return ranked.slice(0, limit).map((r) => ({
    date: r.date,
    slotId: r.slotId,
    label: TIME_SLOTS.find((s) => s.id === r.slotId)?.label || r.slotId,
    key: `${r.date}|${r.slotId}`,
  }))
}
