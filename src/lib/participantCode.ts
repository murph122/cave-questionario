const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

/** Strip accents / keep letters (Latin or CJK), uppercase Latin. */
function namePart(raw: string): string {
  return String(raw || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z\u4e00-\u9fff]/g, '')
}

/**
 * Codice = first 3 chars of first name + first 3 of last name.
 * Example: Mario Rossi → MARROS
 */
export function codeFromName(nome: string, cognome: string): string {
  const a = namePart(nome).slice(0, 3)
  const b = namePart(cognome).slice(0, 3)
  if (!a || !b) return ''
  return `${a}${b}`.toUpperCase()
}

/** Legacy random code (kept for rare fallbacks). */
export function generateParticipantCode(): string {
  let suffix = ''
  for (let i = 0; i < 4; i += 1) {
    suffix += ALPHABET[Math.floor(Math.random() * ALPHABET.length)]
  }
  return `CAVE-${suffix}`
}
