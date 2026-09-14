import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { lookupBooking } from '../lib/api'
import { setAccess } from '../lib/access'
import { saveJson } from '../lib/storage'
import { useLang } from '../i18n/LangContext'

export function AccediPage() {
  const { t } = useLang()
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [pendingMsg, setPendingMsg] = useState('')

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setPendingMsg('')
    const cleaned = code.trim().toUpperCase()
    if (cleaned.length < 6) {
      setError(t('errAccessCode'))
      return
    }
    setBusy(true)
    try {
      const booking = await lookupBooking(cleaned)
      if (!booking) {
        setError(t('errAccessNotFound'))
        return
      }
      const status = String(booking.status || 'pending').toLowerCase()
      setAccess({
        participantCode: booking.participantCode,
        status: status as 'pending' | 'approved' | 'done',
        date: booking.date,
        slotId: booking.slotId,
        contactName: booking.contactName,
      })
      saveJson('participantCode', booking.participantCode)

      if (status === 'pending') {
        setPendingMsg(t('accessPending'))
        return
      }
      if (status === 'cancelled') {
        setError(t('accessCancelled'))
        return
      }
      if (status === 'done') {
        setPendingMsg(t('accessDone'))
        return
      }
      // approved
      navigate('/parte-1')
    } catch {
      setError(t('errGeneric'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <AppShell title={t('accessTitle')} subtitle={t('accessSub')}>
      <form className="stack form" onSubmit={onSubmit}>
        <label className="field">
          <span>{t('accessCodeLabel')}</span>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="CAVE-XXXX"
            autoComplete="off"
            required
          />
        </label>
        {error && <p className="error">{error}</p>}
        {pendingMsg && <p className="body muted">{pendingMsg}</p>}
        <button className="btn btn-primary" type="submit" disabled={busy}>
          {busy ? t('sending') : t('accessSubmit')}
        </button>
        <p className="body muted">
          {t('accessNeedBook')}{' '}
          <Link to="/prenota">{t('ctaBook')}</Link>
        </p>
      </form>
    </AppShell>
  )
}
