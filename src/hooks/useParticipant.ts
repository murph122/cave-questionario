import { generateParticipantCode } from '../lib/participantCode'
import { loadJson, saveJson } from '../lib/storage'
import { useCallback, useEffect, useState } from 'react'

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
