import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { AppShell } from '../components/AppShell'
import { adminListBookings, adminLogin, adminSetStatus } from '../lib/api'
import { useLang } from '../i18n/LangContext'
import { formatDateLocale, TIME_SLOTS } from '../data/slots'
import './AdminPage.css'

type Row = {
  participantCode: string
  status: string
  date?: string
  slotId?: string
  contactName?: string
  email?: string
  phone?: string
}

const SESSION_KEY = 'cave-q:adminPass'

export function AdminPage() {
  const { lang, t } = useLang()
  const [password, setPassword] = useState(() => sessionStorage.getItem(SESSION_KEY) || '')
  const [authed, setAuthed] = useState(Boolean(sessionStorage.getItem(SESSION_KEY)))
  const [rows, setRows] = useState<Row[]>([])
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const dateLocale = lang === 'zh' ? 'zh-CN' : 'it-IT'

  async function refresh(pass: string) {
    const list = await adminListBookings(pass)
    setRows(list as Row[])
  }

  useEffect(() => {
    if (!authed || !password) return
    setBusy(true)
    refresh(password)
      .catch((err) => {
        setError(err instanceof Error ? err.message : t('adminLoadFail'))
      })
      .finally(() => setBusy(false))
  }, [authed, password])

  async function onLogin(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await adminLogin(password)
      sessionStorage.setItem(SESSION_KEY, password)
      setAuthed(true)
      await refresh(password)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('adminBadPass'))
      setAuthed(false)
    } finally {
      setBusy(false)
    }
  }

  async function setStatus(code: string, status: 'approved' | 'pending' | 'cancelled') {
    setBusy(true)
    setError('')
    try {
      await adminSetStatus(password, code, status)
      await refresh(password)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errGeneric'))
    } finally {
      setBusy(false)
    }
  }

  if (!authed) {
    return (
      <AppShell title={t('adminTitle')} subtitle={t('adminSub')}>
        <form className="stack form" onSubmit={onLogin}>
          <label className="field">
            <span>{t('adminPass')}</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
          {error && <p className="error">{error}</p>}
          <button className="btn btn-primary" type="submit" disabled={busy}>
            {t('adminLogin')}
          </button>
        </form>
      </AppShell>
    )
  }

  return (
    <AppShell title={t('adminTitle')} subtitle={t('adminListSub')}>
      <div className="stack">
        {error && <p className="error">{error}</p>}
        <button
          className="btn btn-ghost"
          type="button"
          disabled={busy}
          onClick={() => {
            setBusy(true)
            setError('')
            refresh(password)
              .catch((err) => setError(err instanceof Error ? err.message : t('adminLoadFail')))
              .finally(() => setBusy(false))
          }}
        >
          {t('adminRefresh')}
        </button>
        <div className="admin-list">
          {rows.length === 0 && !busy && (
            <p className="body muted">
              {t('adminEmpty')}
              <br />
              {t('adminEmptyHint')}
            </p>
          )}
          {rows
            .slice()
            .reverse()
            .map((b) => {
              const slot = TIME_SLOTS.find((s) => s.id === b.slotId)?.label || b.slotId
              return (
                <article key={`${b.participantCode}-${b.date}-${b.slotId}`} className="admin-card">
                  <p className="admin-code">{b.participantCode}</p>
                  <p className="body">
                    {b.contactName || '—'} · {b.date ? formatDateLocale(b.date, dateLocale) : '—'} ·{' '}
                    {slot}
                  </p>
                  <p className="body muted">
                    {b.email || b.phone || '—'} · status: <strong>{b.status}</strong>
                  </p>
                  <div className="cta-row">
                    {b.status !== 'approved' && (
                      <button
                        type="button"
                        className="btn btn-primary"
                        disabled={busy}
                        onClick={() => setStatus(b.participantCode, 'approved')}
                      >
                        {t('adminApprove')}
                      </button>
                    )}
                    {b.status === 'approved' && (
                      <button
                        type="button"
                        className="btn btn-ghost"
                        disabled={busy}
                        onClick={() => setStatus(b.participantCode, 'pending')}
                      >
                        {t('adminRevoke')}
                      </button>
                    )}
                    <button
                      type="button"
                      className="btn btn-ghost"
                      disabled={busy}
                      onClick={() => setStatus(b.participantCode, 'cancelled')}
                    >
                      {t('adminCancel')}
                    </button>
                  </div>
                </article>
              )
            })}
        </div>
      </div>
    </AppShell>
  )
}
