import type { AccumulatedResponses } from './googleForm'

/** Flat payload for Apps Script → Google Sheet (both conditions). */
export function buildSheetPayload(data: AccumulatedResponses) {
  return {
    spreadsheetId: '1lULR-CpicCsOZQT7BqidPj6tO10IqpnHde_MMaFF1oQ',
    participantCode:
      data.participantCode || data.anagrafica?.codicePersonale || '',
    anagrafica: {
      nome: data.anagrafica?.nome || '',
      cognome: data.anagrafica?.cognome || '',
      codicePersonale: data.anagrafica?.codicePersonale || data.participantCode || '',
      eta: data.anagrafica?.eta ?? '',
    },
    pss: data.pss || {},
    sessions: {
      stressante: {
        answers: data.sessions?.stressante?.answers || {},
      },
      non_stressante: {
        answers: data.sessions?.non_stressante?.answers || {},
      },
    },
    final: {
      answers: data.final?.answers || {},
      ssqAltro: data.final?.ssqAltro || '',
    },
  }
}
