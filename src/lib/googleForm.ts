/** Google Form linked to your response spreadsheet */
export const GOOGLE_FORM_ID =
  '1FAIpQLSeVp6MFNf84QLfo0YP8iNyozAX8Gr9ZV0lLxUT1LtTgO2_qjQ'

export const GOOGLE_FORM_VIEW =
  `https://docs.google.com/forms/d/e/${GOOGLE_FORM_ID}/viewform`

export const GOOGLE_FORM_ACTION =
  `https://docs.google.com/forms/d/e/${GOOGLE_FORM_ID}/formResponse`

/** Map our field ids → Google Form entry.XXXX */
export const GOOGLE_FORM_ENTRIES = {
  participantCode: '888767966',
  eta: '1289538859',
  sesso: '933489691',
  DEM1: '705159691',
  PSS1: '1293272340',
  PSS2: '1546734643',
  PSS3: '187020064',
  PSS4: '30908894',
  PSS5: '1723367091',
  PSS6: '109690941',
  PSS7: '296954309',
  PSS8: '909432573',
  PSS9: '693887869',
  PSS10: '669381986',
  SAM1_Arousal: '1520387024',
  SAM2_Valence: '626801254',
  SAM3_Dominance: '153125706',
  SSSQ1: '401561597',
  SSSQ2: '1647534155',
  SSSQ3: '410964211',
  SSSQ4: '1393815726',
  'IEQ-SF1': '1506925761',
  'IEQ-SF2': '2046993911',
  'IEQ-SF3': '602746250',
  'IEQ-SF4': '1797197600',
  'IEQ-SF5': '1920307106',
  'IEQ-SF6': '560310542',
  'IEQ-SF7': '525344031',
  'IEQ-SF8': '1109686819',
  'IEQ-SF9': '1052813744',
  'IEQ-SF10': '105744773',
  'IEQ-SF11': '816394638',
  'IEQ-SF12': '174532257',
  IPQ1_G1: '1441681561',
  IPQ2_SP1: '1036215429',
  IPQ3_SP2: '727296066',
  IPQ4_SP3: '1813556499',
  IPQ5_SP4: '1980582631',
  IPQ6_SP5: '1288178036',
  IPQ7_INV1: '1188967858',
} as const

export type GoogleFieldId = keyof typeof GOOGLE_FORM_ENTRIES

export const SESSO_TO_GOOGLE: Record<string, string> = {
  donna: 'Donna',
  uomo: 'Uomo',
  intersex: 'Intersex / un’altra variazione',
  preferisco_non_rispondere: 'Preferisco non rispondere',
}

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
  /** @deprecated single session — prefer sessions */
  session?: {
    condition: string
    answers: Record<string, number | string>
  }
  sessions?: {
    stressante?: { answers: Record<string, number | string> }
    non_stressante?: { answers: Record<string, number | string> }
  }
  final?: {
    answers: Record<string, number | string>
    ssqAltro?: string
  }
}

export type FormTokens = {
  fbzx?: string
  fvv?: string
  pageHistory?: string
}

/** Parse hidden tokens Google requires for a valid formResponse. */
export function extractFormTokens(html: string): FormTokens {
  const get = (name: string) => {
    const m = html.match(new RegExp(`name="${name}"\\s+value="([^"]*)"`, 'i'))
    return m?.[1]
  }
  return {
    fbzx: get('fbzx'),
    fvv: get('fvv') || '1',
    pageHistory: get('pageHistory') || '0',
  }
}

export function buildGoogleFormBody(
  data: AccumulatedResponses,
  tokens: FormTokens = {},
): URLSearchParams {
  const body = new URLSearchParams()
  const set = (field: GoogleFieldId, value: string | number | null | undefined) => {
    if (value == null || value === '') return
    body.set(`entry.${GOOGLE_FORM_ENTRIES[field]}`, String(value))
  }

  set('participantCode', data.participantCode)

  if (data.anagrafica) {
    set('eta', data.anagrafica.eta)
    const sexKey = data.anagrafica.sesso
    if (sexKey) {
      set('sesso', SESSO_TO_GOOGLE[sexKey] ?? sexKey)
    }
  }

  const demParts: string[] = []
  if (data.session?.condition) demParts.push(`condizione=${data.session.condition}`)
  if (data.anagrafica?.DEM1) demParts.push(String(data.anagrafica.DEM1))
  if (demParts.length) set('DEM1', demParts.join(' | '))

  if (data.pss) {
    for (const [k, v] of Object.entries(data.pss)) {
      if (k in GOOGLE_FORM_ENTRIES) set(k as GoogleFieldId, v)
    }
  }

  if (data.session?.answers) {
    for (const [k, v] of Object.entries(data.session.answers)) {
      if (k in GOOGLE_FORM_ENTRIES) set(k as GoogleFieldId, v)
    }
  }

  if (!body.has(`entry.${GOOGLE_FORM_ENTRIES.IPQ7_INV1}`)) {
    set('IPQ7_INV1', '3')
  }

  // Required by Google Forms — without these you often get timestamp-only empty rows
  body.set('fvv', tokens.fvv || '1')
  body.set('pageHistory', tokens.pageHistory || '0')
  if (tokens.fbzx) {
    body.set('fbzx', tokens.fbzx)
    body.set('submissionTimestamp', '-1')
  }

  return body
}
