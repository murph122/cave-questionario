import { Link } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { useLang } from '../i18n/LangContext'

export function WelcomePage() {
  const { t } = useLang()
  return (
    <AppShell title={t('welcomeTitle')} subtitle={t('welcomeSub')}>
      <div className="stack">
        <p className="body">{t('welcomeBody')}</p>
        <p className="body muted">{t('welcomeConsent')}</p>
        <div className="cta-row">
          <Link className="btn btn-primary" to="/prenota">
            {t('ctaBook')}
          </Link>
          <Link className="btn btn-ghost" to="/anagrafica">
            {t('ctaSurvey')}
          </Link>
        </div>
      </div>
    </AppShell>
  )
}
