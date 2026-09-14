import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { loadJson, saveJson } from '../lib/storage'
import type { Lang } from './types'
import { t, type UiKey } from './ui'
import { pick, type Loc } from './types'

type LangContextValue = {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (key: UiKey) => string
  tx: (text: Loc | string) => string
}

const LangContext = createContext<LangContextValue | null>(null)

const STORAGE_KEY = 'lang'

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = loadJson<Lang | null>(STORAGE_KEY, null)
    return saved === 'zh' || saved === 'it' ? saved : 'it'
  })

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    saveJson(STORAGE_KEY, next)
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'it'
  }, [lang])

  const value = useMemo<LangContextValue>(
    () => ({
      lang,
      setLang,
      t: (key) => t(lang, key),
      tx: (text) => pick(lang, text),
    }),
    [lang, setLang],
  )

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used within LangProvider')
  return ctx
}
