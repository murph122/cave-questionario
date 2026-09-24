import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { AppShell } from '../components/AppShell'
import {
  adminListBookings,
  adminLogin,
  adminPing,
  adminReschedule,
  adminSetStatus,
} from '../lib/api'
import { useLang } from '../i18n/LangContext'
import type { UiKey } from '../i18n/ui'
import {
  formatDateLocale,
  formatDateShort,
  listAvailableDates,
  normalizeIsoDate,
  TIME_SLOTS,
} from '../data/slots'
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

function BookingCard({
  b,
  dates,
  dateLocale,
  busy,
  onApprove,
  onRevoke,
  onCancel,
  onReschedule,
  t,
}: {
  b: Row
  dates: string[]
  dateLocale: string
  busy: boolean
  onApprove: () => void
  onRevoke: () => void
  onCancel: () => void
  onReschedule: (newDate: string, newSlotId: string) => void
  t: (k: UiKey) => string
}) {
  const [editDate, setEditDate] = useState(normalizeIsoDate(b.date) || dates[0] || '')
  const [editSlot, setEditSlot] = useState(String(b.slotId || TIME_SLOTS[0]?.id || ''))
  const slot = TIME_SLOTS.find((s) => s.id === b.slotId)?.label || b.slotId
  const dirty =
    normalizeIsoDate(editDate) !== normalizeIsoDate(b.date) ||
    String(editSlot) !== String(b.slotId || '')

  useEffect(() => {
    setEditDate(normalizeIsoDate(b.date) || dates[0] || '')
    setEditSlot(String(b.slotId || TIME_SLOTS[0]?.id || ''))
  }, [b.date, b.slotId, b.participantCode, dates])

  return (
    <article className="admin-card">
      <p className="admin-code">{b.participantCode}</p>
      <p className="body">
        {b.contactName || '—'}
        <br />
        {b.date ? formatDateLocale(b.date, dateLocale) : '—'} · {slot}
      </p>
      <p className="body muted">{b.email || b.phone || '—'}</p>

      <div className="admin-reschedule">
        <p className="body muted" style={{ marginBottom: '0.4rem' }}>
          {t('adminReschedule')}
        </p>
        <label className="field">
          <span>{t('dateLabel')}</span>
          <select value={editDate} onChange={(e) => setEditDate(e.target.value)} disabled={busy}>
            {dates.map((d) => (
              <option key={d} value={d}>
                {formatDateLocale(d, dateLocale)}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>{t('slotLabel')}</span>
          <select
            value={editSlot}
            onChange={(e) => setEditSlot(e.target.value)}
            disabled={busy}
          >
            {TIME_SLOTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className="btn btn-primary"
          disabled={busy || !dirty || !editDate || !editSlot}
          onClick={() => onReschedule(editDate, editSlot)}
        >
          {t('adminRescheduleSave')}
        </button>
      </div>

      <div className="cta-row">
        {b.status !== 'approved' && b.status !== 'done' && (
          <button type="button" className="btn btn-primary" disabled={busy} onClick={onApprove}>
            {t('adminApprove')}
          </button>
        )}
        {(b.status === 'approved' || b.status === 'done') && (
          <button type="button" className="btn btn-ghost" disabled={busy} onClick={onRevoke}>
            {t('adminRevoke')}
          </button>
        )}
        <button type="button" className="btn btn-ghost" disabled={busy} onClick={onCancel}>
          {t('adminCancel')}
        </button>
      </div>
    </article>
  )
}

export function AdminPage() {
  const { lang, t } = useLang()
  const [password, setPassword] = useState(() => sessionStorage.getItem(SESSION_KEY) || '')
  const [authed, setAuthed] = useState(Boolean(sessionStorage.getItem(SESSION_KEY)))
  const [rows, setRows] = useState<Row[]>([])
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [busy, setBusy] = useState(false)
  const [manualCode, setManualCode] = useState('')
  const [health, setHealth] = useState('')
  const dateLocale = lang === 'zh' ? 'zh-CN' : 'it-IT'
  const dates = useMemo(() => listAvailableDates(), [])

  const bySlot = useMemo(() => {
    const map = new Map<string, Row[]>()
    for (const b of rows) {
      const d = normalizeIsoDate(b.date)
      const slot = String(b.slotId || '').trim()
      if (!d || !slot || b.status === 'cancelled') continue
      const key = `${d}|${slot}`
      const list = map.get(key) || []
      list.push({ ...b, date: d, slotId: slot })
      map.set(key, list)
    }
    return map
  }, [rows])

  const pending = useMemo(
    () =>
      rows
        .filter((b) => b.status === 'pending' || b.status === 'unknown')
        .map((b) => ({ ...b, date: normalizeIsoDate(b.date), slotId: String(b.slotId || '').trim() })),
    [rows],
  )
  const approved = useMemo(
    () =>
      rows
        .filter((b) => b.status === 'approved' || b.status === 'done')
        .map((b) => ({ ...b, date: normalizeIsoDate(b.date), slotId: String(b.slotId || '').trim() })),
    [rows],
  )

  async function refresh(pass: string) {
    const list = await adminListBookings(pass)
    setRows(list as Row[])
    try {
      const ping = await adminPing(pass)
      setHealth(
        ping.bookingsSheet || ping.sheet
          ? `${t('adminHealthOk')} · ${ping.bookingsSheet || ping.sheet} · ${ping.bookings ?? list.length} bookings`
          : t('adminHealthOk'),
      )
    } catch (err) {
      setHealth(
        `${t('adminHealthFail')}: ${err instanceof Error ? err.message : 'error'}`,
      )
    }
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

  async function setStatus(
    code: string,
    status: 'approved' | 'pending' | 'cancelled',
    extra?: { date?: string; slotId?: string; contactName?: string; email?: string },
  ) {
    if (status === 'cancelled') {
      const ok = window.confirm(t('adminCancelConfirm'))
      if (!ok) return
    }
    setBusy(true)
    setError('')
    setInfo('')
    try {
      await adminSetStatus(password, code, status, {
        date: extra?.date ? normalizeIsoDate(extra.date) : undefined,
        slotId: extra?.slotId,
        contactName: extra?.contactName,
        email: extra?.email,
      })
      setInfo(status === 'cancelled' ? `${code} — ${t('adminDeleted')}` : `${code} → ${status}`)
      await refresh(password)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errGeneric'))
    } finally {
      setBusy(false)
    }
  }

  async function reschedule(b: Row, newDate: string, newSlotId: string) {
    setBusy(true)
    setError('')
    setInfo('')
    try {
      await adminReschedule(password, {
        participantCode: b.participantCode,
        date: normalizeIsoDate(b.date),
        slotId: b.slotId,
        newDate: normalizeIsoDate(newDate),
        newSlotId,
      })
      setInfo(`${b.participantCode} — ${t('adminRescheduled')}`)
      await refresh(password)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('adminRescheduleFail'))
    } finally {
      setBusy(false)
    }
  }

  async function approveManual(e: FormEvent) {
    e.preventDefault()
    const code = manualCode.trim().toUpperCase()
    if (code.length < 2) {
      setError(t('errCode'))
      return
    }
    await setStatus(code, 'approved')
    setManualCode('')
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

  function cardProps(b: Row) {
    return {
      b,
      dates,
      dateLocale,
      busy,
      t,
      onApprove: () =>
        setStatus(b.participantCode, 'approved', {
          date: b.date,
          slotId: b.slotId,
          contactName: b.contactName,
          email: b.email,
        }),
      onRevoke: () =>
        setStatus(b.participantCode, 'pending', {
          date: b.date,
          slotId: b.slotId,
        }),
      onCancel: () =>
        setStatus(b.participantCode, 'cancelled', {
          date: b.date,
          slotId: b.slotId,
        }),
      onReschedule: (newDate: string, newSlotId: string) => reschedule(b, newDate, newSlotId),
    }
  }

  return (
    <AppShell title={t('adminTitle')} subtitle={t('adminListSub')}>
      <div className="stack">
        {health && <p className="body muted">{health}</p>}
        {error && <p className="error">{error}</p>}
        {info && (
          <p className="body" style={{ color: '#86efac' }}>
            {info}
          </p>
        )}

        <form className="stack form" onSubmit={approveManual}>
          <label className="field">
            <span>{t('adminManualLabel')}</span>
            <input
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value.toUpperCase())}
              placeholder="MARROS"
              autoComplete="off"
            />
          </label>
          <button className="btn btn-primary" type="submit" disabled={busy}>
            {t('adminManualApprove')}
          </button>
          <p className="body muted">{t('adminManualHint')}</p>
        </form>

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

        <h2 className="admin-section-title">{t('adminSchedule')}</h2>
        <div className="admin-schedule-wrap">
          <table className="admin-schedule">
            <thead>
              <tr>
                <th>{lang === 'zh' ? '日期' : 'Data'}</th>
                {TIME_SLOTS.map((s) => (
                  <th key={s.id}>{s.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dates.map((d) => (
                <tr key={d}>
                  <th scope="row">{formatDateShort(d, dateLocale)}</th>
                  {TIME_SLOTS.map((s) => {
                    const cell = bySlot.get(`${d}|${s.id}`) || []
                    const hasApproved = cell.some(
                      (b) => b.status === 'approved' || b.status === 'done',
                    )
                    return (
                      <td
                        key={s.id}
                        className={
                          hasApproved
                            ? 'cell-approved'
                            : cell.length
                              ? 'cell-pending'
                              : 'cell-free'
                        }
                      >
                        {cell.length === 0 ? (
                          <span className="cell-empty">{t('adminSlotFree')}</span>
                        ) : (
                          cell.map((b) => (
                            <div
                              key={`${b.participantCode}-${b.date}-${b.slotId}-${b.status}`}
                              className={
                                b.status === 'approved' || b.status === 'done'
                                  ? 'chip-approved'
                                  : 'chip-pending'
                              }
                              title={`${b.participantCode} · ${b.status}`}
                            >
                              <strong>{b.contactName || b.participantCode}</strong>
                              <span>
                                {b.participantCode}
                                {b.status === 'pending' ? ` · ${t('adminSlotPending')}` : ''}
                              </span>
                            </div>
                          ))
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="admin-columns">
          <section className="admin-col">
            <h2 className="admin-section-title">
              {t('adminColPending')} ({pending.length})
            </h2>
            <div className="admin-list">
              {pending.length === 0 && <p className="body muted">{t('adminNoneInCol')}</p>}
              {pending.map((b) => (
                <BookingCard
                  key={`p-${b.participantCode}-${b.date}-${b.slotId}`}
                  {...cardProps(b)}
                />
              ))}
            </div>
          </section>
          <section className="admin-col">
            <h2 className="admin-section-title">
              {t('adminColApproved')} ({approved.length})
            </h2>
            <div className="admin-list">
              {approved.length === 0 && <p className="body muted">{t('adminNoneInCol')}</p>}
              {approved.map((b) => (
                <BookingCard
                  key={`a-${b.participantCode}-${b.date}-${b.slotId}`}
                  {...cardProps(b)}
                />
              ))}
            </div>
          </section>
        </div>

        {rows.length === 0 && !busy && (
          <p className="body muted">
            {t('adminEmpty')}
            <br />
            {t('adminEmptyHint')}
          </p>
        )}
      </div>
    </AppShell>
  )
}
