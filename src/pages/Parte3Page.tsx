import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { PlaceholderNotice } from '../components/PlaceholderNotice'
import { useParticipantCode } from '../hooks/useParticipant'
import { submitResponse } from '../lib/api'
import { useLang } from '../i18n/LangContext'

export function Parte3Page() {
  const navigate = useNavigate()
  const { t } = useLang()
  const { ensureCode } = useParticipantCode()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function finish(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await submitResponse({
        participantCode: ensureCode(),
        section: 'final',
        answers: { status: 'pending_items' },
      })
      navigate('/grazie', { state: { kind: 'questionnaire', participantCode: ensureCode() } })
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errGeneric'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <AppShell title={t('p3Title')} subtitle={t('p3Sub')} progress={90}>
      <form className="stack" onSubmit={finish}>
        <section className="group">
          <h2 className="section-title">SSQ</h2>
          <PlaceholderNotice />
        </section>
        <section className="group">
          <h2 className="section-title">SUS</h2>
          <PlaceholderNotice />
        </section>
        <p className="body muted">{t('p3Note')}</p>
        {error && <p className="error">{error}</p>}
        <button className="btn btn-primary" type="submit" disabled={busy}>
          {busy ? t('sending') : t('finishSurvey')}
        </button>
      </form>
    </AppShell>
  )
}
