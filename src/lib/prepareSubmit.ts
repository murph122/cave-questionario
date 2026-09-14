import { SESSION_GROUPS, SSQ_QUESTIONS, SUS_QUESTIONS, PSS_QUESTIONS } from '../data/questions'
import type { AccumulatedResponses } from './googleForm'
import { getAccumulated } from './accumulate'
import { loadJson } from './storage'

type AnagraficaDraft = {
  nome: string
  cognome: string
  codicePersonale: string
  eta: string
}
type PssDraft = { answers: Record<string, number> }
type SessionDraft = { condition: string; answers: Record<string, number> }
type FinalDraft = { answers: Record<string, number | string>; ssqAltro: string }

export function buildFullPayload(participantCode: string): AccumulatedResponses {
  const acc = getAccumulated()
  const demo = loadJson<AnagraficaDraft>('draft-anagrafica', {
    nome: '',
    cognome: '',
    codicePersonale: '',
    eta: '',
  })
  const pss = loadJson<PssDraft>('draft-pss', { answers: {} })
  const session = loadJson<SessionDraft>('draft-session', { condition: '', answers: {} })
  const fin = loadJson<FinalDraft>('draft-final', { answers: {}, ssqAltro: '' })

  return {
    participantCode: participantCode || acc.participantCode || demo.codicePersonale,
    anagrafica: acc.anagrafica ?? {
      nome: demo.nome,
      cognome: demo.cognome,
      codicePersonale: demo.codicePersonale,
      eta: demo.eta,
    },
    pss: acc.pss ?? pss.answers,
    sessions: acc.sessions,
    session: acc.session ?? {
      condition: session.condition,
      answers: session.answers,
    },
    final: acc.final ?? {
      answers: fin.answers,
      ssqAltro: fin.ssqAltro,
    },
  }
}

function hasAnswer(answers: Record<string, number | string>, id: string) {
  const v = answers[id]
  return v != null && v !== '' && !Number.isNaN(Number(v))
}

export function missingSessionFields(
  answers: Record<string, number | string> | undefined,
): string[] {
  const missing: string[] = []
  const requiredSession = SESSION_GROUPS.flatMap((g) => g.questions.map((q) => q.id))
  for (const id of requiredSession) {
    if (!answers || !hasAnswer(answers, id)) missing.push(id)
  }
  return missing
}

export function missingGoogleFields(data: AccumulatedResponses): string[] {
  const missing: string[] = []
  if (!data.anagrafica?.nome) missing.push('nome')
  if (!data.anagrafica?.cognome) missing.push('cognome')
  if (!data.anagrafica?.codicePersonale && !data.participantCode) missing.push('codicePersonale')
  if (!data.anagrafica?.eta) missing.push('eta')

  for (const q of PSS_QUESTIONS) {
    if (!data.pss || !hasAnswer(data.pss, q.id)) missing.push(q.id)
  }

  const st = data.sessions?.stressante?.answers
  const ns = data.sessions?.non_stressante?.answers
  for (const id of missingSessionFields(st)) missing.push(`ST:${id}`)
  for (const id of missingSessionFields(ns)) missing.push(`NS:${id}`)

  return missing
}

export function missingFinalFields(answers: Record<string, number | string>): string[] {
  const missing: string[] = []
  for (const q of [...SSQ_QUESTIONS, ...SUS_QUESTIONS]) {
    if (!hasAnswer(answers, q.id) && q.id !== 'SSQ17' && q.id !== 'SSQ1') missing.push(q.id)
  }
  return missing
}
