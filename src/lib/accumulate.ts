import { loadJson, saveJson } from './storage'
import type { AccumulatedResponses } from './googleForm'

const KEY = 'accumulated'

export function getAccumulated(): AccumulatedResponses {
  return loadJson<AccumulatedResponses>(KEY, { participantCode: '' })
}

export function saveAccumulated(patch: Partial<AccumulatedResponses>) {
  const prev = getAccumulated()
  const next: AccumulatedResponses = {
    ...prev,
    ...patch,
    anagrafica: patch.anagrafica
      ? { ...prev.anagrafica, ...patch.anagrafica }
      : prev.anagrafica,
    pss: patch.pss ? { ...prev.pss, ...patch.pss } : prev.pss,
    session: patch.session ?? prev.session,
    sessions: patch.sessions
      ? {
          stressante: patch.sessions.stressante ?? prev.sessions?.stressante,
          non_stressante: patch.sessions.non_stressante ?? prev.sessions?.non_stressante,
        }
      : prev.sessions,
    final: patch.final
      ? {
          answers: { ...prev.final?.answers, ...patch.final.answers },
          ssqAltro: patch.final.ssqAltro ?? prev.final?.ssqAltro,
        }
      : prev.final,
  }
  saveJson(KEY, next)
  return next
}

export function saveSessionCondition(
  condition: 'stressante' | 'non_stressante',
  answers: Record<string, number | string>,
) {
  const prev = getAccumulated()
  return saveAccumulated({
    sessions: {
      ...prev.sessions,
      [condition]: { answers },
    },
    session: { condition, answers },
  })
}
