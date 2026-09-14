export type Lang = 'it' | 'zh'

export type Loc = { it: string; zh: string }

export function L(it: string, zh: string): Loc {
  return { it, zh }
}

export function pick(lang: Lang, text: Loc | string): string {
  if (typeof text === 'string') return text
  return text[lang]
}
