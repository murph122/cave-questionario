import { Link, useLocation } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { formatDateLocale } from '../data/slots'
import { useLang } from '../i18n/LangContext'
import { clearSurveySession } from '../lib/storage'

type ThanksState = {
  kind?: 'booking' | 'questionnaire'
  participantCode?: string
  date?: string
  slotLabel?: string
}

export function GraziePage() {
  const location = useLocation()
  const { lang, t } = useLang()
  const state = (location.state || {}) as ThanksState
  const isBooking = state.kind === 'booking'
  const dateLocale = lang === 'zh' ? 'zh-CN' : 'it-IT'

  return (
    <AppShell
      title={t('thanksTitle')}
      subtitle={isBooking ? t('thanksBookSub') : t('thanksSurveySub')}
    >
      <div className="stack">
        {state.participantCode && (
          <p className="code-box">
            {t('thanksCode')} <strong>{state.participantCode}</strong>
          </p>
        )}
        {isBooking && state.date && (
          <p className="body">
            {t('thanksAppt')}{' '}
            <strong>{formatDateLocale(state.date, dateLocale)}</strong>
            {state.slotLabel ? ` · ${state.slotLabel}` : ''}
          </p>
        )}
        {isBooking && <p className="body muted">{t('thanksBookWait')}</p>}
        {isBooking && <p className="body muted">{t('thanksBookEmail')}</p>}
        {!isBooking && <p className="body muted">{t('thanksKeep')}</p>}
        <div className="cta-row">
          <Link className="btn btn-primary" to="/" onClick={() => clearSurveySession()}>
            {t('backHome')}
          </Link>
          {isBooking && (
            <Link className="btn btn-ghost" to="/accedi">
              {t('ctaAccess')}
            </Link>
          )}
        </div>
      </div>
    </AppShell>
  )
}
