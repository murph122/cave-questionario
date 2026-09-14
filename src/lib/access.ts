import { loadJson, removeKey, saveJson } from './storage'

export type AccessState = {
  participantCode: string
  status: 'pending' | 'approved' | 'done' | 'unknown'
  date?: string
  slotId?: string
  contactName?: string
}

const KEY = 'access'

export function getAccess(): AccessState | null {
  return loadJson<AccessState | null>(KEY, null)
}

export function setAccess(state: AccessState) {
  saveJson(KEY, state)
}

export function clearAccess() {
  removeKey(KEY)
}

export function isSurveyUnlocked(): boolean {
  const a = getAccess()
  return Boolean(a && (a.status === 'approved' || a.status === 'done') && a.participantCode)
}
