import { useMemo } from 'react'
import { codeFromName } from '../lib/participantCode'

/** Live participant code from nome + cognome (no sticky random localStorage). */
export function useParticipantCode(nome: string, cognome: string) {
  const code = useMemo(() => codeFromName(nome, cognome), [nome, cognome])
  return { code }
}
