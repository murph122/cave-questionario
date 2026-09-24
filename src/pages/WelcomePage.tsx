import { Link } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { useLang } from '../i18n/LangContext'
import './WelcomePage.css'

export function WelcomePage() {
  const { t } = useLang()

  return (
    <AppShell hero>
      <div className="welcome-hero stack">
        <p className="welcome-brand-mark">{t('brand')}</p>
        <h1 className="welcome-title">{t('welcomeTitle')}</h1>
        <p className="welcome-lead">{t('welcomeBody')}</p>
        <p className="welcome-consent body muted">{t('welcomeConsent')}</p>
        <div className="cta-row welcome-cta">
          <Link className="btn btn-primary" to="/prenota">
            {t('ctaBook')}
          </Link>
          <Link className="btn btn-ghost" to="/qr">
            {t('ctaQr')}
          </Link>
        </div>
      </div>
    </AppShell>
  )
}
