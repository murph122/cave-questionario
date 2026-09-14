const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

export function generateParticipantCode(): string {
  let suffix = ''
  for (let i = 0; i < 4; i += 1) {
    suffix += ALPHABET[Math.floor(Math.random() * ALPHABET.length)]
  }
  return `CAVE-${suffix}`
}
