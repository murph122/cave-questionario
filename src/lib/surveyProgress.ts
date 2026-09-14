import { SESSION_GROUPS, SSQ_QUESTIONS, SUS_QUESTIONS, PSS_QUESTIONS } from '../data/questions'
import { getAccumulated } from './accumulate'
import { loadJson } from './storage'
import type { AccumulatedResponses } from './googleForm'

export type SurveyPartId =
  | 'access'
  | 'pss'
  | 'anagrafica'
  | 'session_stress'
  | 'session_nonstress'
  | 'final'

export type SurveyPartStatus = {
  id: SurveyPartId
  done: boolean
  labelIt: string
  labelZh: string
}

function hasAnswers(answers: Record<string, number | string> | undefined, ids: string[]) {
  if (!answers) return false
  return ids.every((id) => {
    const v = answers[id]
    return v != null && v !== '' && !Number.isNaN(Number(v))
  })
}

const SESSION_IDS = SESSION_GROUPS.flatMap((g) => g.questions.map((q) => q.id))
const FINAL_IDS = [...SSQ_QUESTIONS, ...SUS_QUESTIONS]
  .map((q) => q.id)
  .filter((id) => id !== 'SSQ1' && id !== 'SSQ17')

export function getSurveyProgress(accessOk: boolean): SurveyPartStatus[] {
  const acc = getAccumulated()
  const pssDraft = loadJson<{ answers: Record<string, number> }>('draft-pss', { answers: {} })
  const demo = loadJson<{ nome: string; cognome: string; codicePersonale: string; eta: string }>(
    'draft-anagrafica',
    { nome: '', cognome: '', codicePersonale: '', eta: '' },
  )
  const finalDraft = loadJson<{ answers: Record<string, number | string> }>('draft-final', {
    answers: {},
  })

  const pss = acc.pss || pssDraft.answers
  const st = acc.sessions?.stressante?.answers
  const ns = acc.sessions?.non_stressante?.answers
  const fin = acc.final?.answers || finalDraft.answers

  const anagraficaDone = Boolean(
    (acc.anagrafica?.nome || demo.nome) &&
      (acc.anagrafica?.cognome || demo.cognome) &&
      (acc.anagrafica?.eta || demo.eta),
  )

  return [
    {
      id: 'access',
      done: accessOk,
      labelIt: 'Prenotazione approvata',
      labelZh: '预约已批准',
    },
    {
      id: 'pss',
      done: hasAnswers(pss as Record<string, number>, PSS_QUESTIONS.map((q) => q.id)),
      labelIt: 'Parte 1 — PSS-10',
      labelZh: '第一部分 — PSS-10',
    },
    {
      id: 'anagrafica',
      done: anagraficaDone,
      labelIt: 'Dati anagrafici',
      labelZh: '基本信息',
    },
    {
      id: 'session_stress',
      done: hasAnswers(st, SESSION_IDS),
      labelIt: 'Condizione stressante (SAM/IEQ/IPQ/SSSQ)',
      labelZh: '压力条件量表',
    },
    {
      id: 'session_nonstress',
      done: hasAnswers(ns, SESSION_IDS),
      labelIt: 'Condizione non stressante (SAM/IEQ/IPQ/SSSQ)',
      labelZh: '非压力条件量表',
    },
    {
      id: 'final',
      done: hasAnswers(fin, FINAL_IDS),
      labelIt: 'Fine — SSQ & SUS',
      labelZh: '结束 — SSQ & SUS',
    },
  ]
}

export function incompleteParts(accessOk: boolean) {
  return getSurveyProgress(accessOk).filter((p) => !p.done)
}

export function allSurveyComplete(accessOk: boolean) {
  return incompleteParts(accessOk).length === 0
}

export function buildDualPayload(participantCode: string): AccumulatedResponses {
  const acc = getAccumulated()
  return {
    participantCode: participantCode || acc.participantCode,
    anagrafica: acc.anagrafica,
    pss: acc.pss,
    sessions: acc.sessions,
    session: acc.session,
    final: acc.final,
  }
}
