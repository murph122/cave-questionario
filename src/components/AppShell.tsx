import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLang } from '../i18n/LangContext'
import type { Lang } from '../i18n/types'
import { CosmicParallax } from './CosmicParallax'
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
  hero?: boolean
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

export function AppShell({ children, title, subtitle, progress, hero }: Props) {
  const { pathname } = useLocation()
  const theme = THEME_BY_PATH[pathname] ?? 'theme-home'
  const { lang, t } = useLang()
  const isHomeHero = Boolean(hero || pathname === '/')

  return (
    <div className={`shell ${theme}${isHomeHero ? ' shell-hero' : ''}`}>
      {isHomeHero ? <CosmicParallax /> : <div className="shell-bg" aria-hidden />}
      {!isHomeHero && <TechFx />}

      <div className="top-right-bar">
        <Link to="/" className="brand-logos" aria-label="3D LAB · CIM4.0">
          <img src="/brand/3d-lab.png" alt="3D LAB" className="brand-logo brand-logo-3d" />
          <img src="/brand/cim40.png" alt="CIM4.0" className="brand-logo brand-logo-cim" />
        </Link>
        <div className="lang-float-inline">
          <span className="lang-float-label">Lingua / 语言</span>
          <LanguageSwitcher />
        </div>
      </div>

      <div className="shell-header-wrap">
        <header className="shell-header">
          <nav className="shell-nav shell-nav-alone">
            <Link to="/">{t('brand')}</Link>
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

      <main className={`shell-main${isHomeHero ? ' shell-main-hero' : ''}`}>
        <div
          className={`panel fade-in${isHomeHero ? ' panel-hero' : ''}`}
          key={`${pathname}-${lang}`}
        >
          {title && <h1 className="panel-title">{title}</h1>}
          {subtitle && <p className="panel-sub">{subtitle}</p>}
          {children}
        </div>
      </main>

      <footer className="site-footer">
        <p className="site-footer-lab">{t('labName')}</p>
        <p>{t('labAddress')}</p>
        <p className="site-footer-email-label">{t('labEmailLabel')}</p>
        <p>
          <a href={`mailto:${t('labEmail')}`}>{t('labEmail')}</a>
        </p>
        <p>
          <a href={`mailto:${t('labEmailCim')}`}>{t('labEmailCim')}</a>
        </p>
      </footer>
    </div>
  )
}
