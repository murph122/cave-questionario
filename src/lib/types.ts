export type AccumulatedResponses = {
  participantCode: string
  anagrafica?: {
    nome?: string
    cognome?: string
    codicePersonale?: string
    eta?: number | string
    sesso?: string
    DEM1?: string | null
  }
  pss?: Record<string, number | string>
  session?: {
    condition: string
    answers: Record<string, number | string>
  }
  final?: {
    answers: Record<string, number | string>
    ssqAltro?: string
  }
}
