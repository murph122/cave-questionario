import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLang } from '../i18n/LangContext'
import type { Lang } from '../i18n/types'
import { TechFx } from './TechFx'
import './AppShell.css'

const THEME_BY_PATH: Record<string, string> = {
  '/': 'theme-home',
  '/prenota': 'theme-book',
  '/qr': 'theme-book',
  '/admin': 'theme-home',
  '/grazie': 'theme-thanks',
}

type Props = {
  children: ReactNode
  title?: string
  subtitle?: string
  progress?: number
}

function LanguageSwitcher() {
  const { lang, setLang, t } = useLang()
  return (
    <div className="lang-switch lang-switch-large" role="group" aria-label={t('langAria')}>
      {(['it', 'zh'] as Lang[]).map((code) => (
        <button
          key={code}
          type="button"
          className={`lang-btn ${lang === code ? 'active' : ''}`}
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
        >
          {code === 'it' ? 'IT · Italiano' : '中文'}
        </button>
      ))}
    </div>
  )
}

export function AppShell({ children, title, subtitle, progress }: Props) {
  const { pathname } = useLocation()
  const theme = THEME_BY_PATH[pathname] ?? 'theme-home'
  const { lang, t } = useLang()

  return (
    <div className={`shell ${theme}`}>
      <div className="shell-bg" aria-hidden />
      <TechFx />

      <div className="lang-float">
        <span className="lang-float-label">Lingua / 语言</span>
        <LanguageSwitcher />
      </div>

      <div className="shell-header-wrap">
        <header className="shell-header">
          <Link to="/" className="brand">
            {t('brand')}
          </Link>
          <nav className="shell-nav">
            <Link to="/prenota">{t('navBook')}</Link>
            <Link to="/qr">{t('navQr')}</Link>
          </nav>
        </header>
      </div>

      {typeof progress === 'number' && (
        <div className="progress-wrap">
          <div
            className="progress"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div className="progress-bar" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      <main className="shell-main">
        <div className="panel fade-in" key={`${pathname}-${lang}`}>
          {title && <h1 className="panel-title">{title}</h1>}
          {subtitle && <p className="panel-sub">{subtitle}</p>}
          {children}
        </div>
      </main>
    </div>
  )
}
