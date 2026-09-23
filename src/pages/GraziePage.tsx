import { Link, useLocation } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { formatDateLocale } from '../data/slots'
import { useLang } from '../i18n/LangContext'

type ThanksState = {
  kind?: 'booking'
  participantCode?: string
  date?: string
  slotLabel?: string
}

export function GraziePage() {
  const location = useLocation()
  const { lang, t } = useLang()
  const state = (location.state || {}) as ThanksState
  const dateLocale = lang === 'zh' ? 'zh-CN' : 'it-IT'

  return (
    <AppShell title={t('thanksTitle')} subtitle={t('thanksBookSub')}>
      <div className="stack">
        {state.participantCode && (
          <p className="code-box">
            {t('thanksCode')} <strong>{state.participantCode}</strong>
          </p>
        )}
        {state.date && (
          <p className="body">
            {t('thanksAppt')}{' '}
            <strong>{formatDateLocale(state.date, dateLocale)}</strong>
            {state.slotLabel ? ` · ${state.slotLabel}` : ''}
          </p>
        )}
        <p className="body muted">{t('thanksBookWait')}</p>
        <p className="body muted">{t('thanksBookEmail')}</p>
        <div className="cta-row">
          <Link className="btn btn-primary" to="/">
            {t('backHome')}
          </Link>
        </div>
      </div>
    </AppShell>
  )
}
