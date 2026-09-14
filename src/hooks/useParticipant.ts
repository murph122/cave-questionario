import { useCallback, useEffect, useState } from 'react'
import { generateParticipantCode } from '../lib/participantCode'
import { loadJson, saveJson } from '../lib/storage'

const CODE_KEY = 'participantCode'

export function useParticipantCode() {
  const [code, setCode] = useState(() => loadJson<string | null>(CODE_KEY, null))

  useEffect(() => {
    if (!code) {
      const next = generateParticipantCode()
      saveJson(CODE_KEY, next)
      setCode(next)
    }
  }, [code])

  const ensureCode = useCallback(() => {
    if (code) return code
    const next = generateParticipantCode()
    saveJson(CODE_KEY, next)
    setCode(next)
    return next
  }, [code])

  return { code: code ?? '', ensureCode }
}

export function useDraft<T extends Record<string, unknown>>(storageKey: string, initial: T) {
  const [draft, setDraft] = useState<T>(() => loadJson(storageKey, initial))

  useEffect(() => {
    saveJson(storageKey, draft)
  }, [storageKey, draft])

  const update = useCallback((patch: Partial<T>) => {
    setDraft((prev) => ({ ...prev, ...patch }))
  }, [])

  const setAnswer = useCallback((id: string, value: string | number) => {
    setDraft((prev) => ({
      ...prev,
      answers: { ...(prev.answers as Record<string, unknown>), [id]: value },
    }))
  }, [])

  const clear = useCallback(() => {
    setDraft(initial)
    saveJson(storageKey, initial)
  }, [initial, storageKey])

  return { draft, setDraft, update, setAnswer, clear }
}
