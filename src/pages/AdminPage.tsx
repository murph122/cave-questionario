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
import { codeFromName } from '../lib/participantCode'
import {
  formatDateLocale,
  formatDateShort,
  isBookingPast,
  isDayPast,
  isSlotPast,
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

function PastBookingRow({
  b,
  dateLocale,
  busy,
  expanded,
  onToggle,
  onCancel,
  t,
}: {
  b: Row
  dateLocale: string
  busy: boolean
  expanded: boolean
  onToggle: () => void
  onCancel: () => void
  t: (k: UiKey) => string
}) {
  const slot = TIME_SLOTS.find((s) => s.id === b.slotId)?.label || b.slotId || '—'
  return (
    <div className={`admin-past-row${expanded ? ' open' : ''}`}>
      <button type="button" className="admin-past-summary" onClick={onToggle}>
        <span className="admin-past-main">
          <strong>{b.participantCode}</strong>
          {b.contactName ? ` · ${b.contactName}` : ''}
        </span>
        <span className="admin-past-meta">
          {b.date ? formatDateShort(b.date, dateLocale) : '—'} · {slot}
        </span>
        <span className="admin-past-toggle">{expanded ? t('adminHidePast') : t('adminShowPast')}</span>
      </button>
      {expanded && (
        <div className="admin-past-detail">
          <p className="body muted">{b.email || b.phone || '—'}</p>
          <button type="button" className="btn btn-ghost" disabled={busy} onClick={onCancel}>
            {t('adminCancel')}
          </button>
        </div>
      )}
    </div>
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
  const [health, setHealth] = useState('')
  const [manualName, setManualName] = useState('')
  const [manualCode, setManualCode] = useState('')
  const [manualDate, setManualDate] = useState('')
  const [manualSlot, setManualSlot] = useState<string>(TIME_SLOTS[0]?.id || '')
  const [manualEmail, setManualEmail] = useState('')
  const [manualPhone, setManualPhone] = useState('')
  const [codeTouched, setCodeTouched] = useState(false)
  const [expandedPastDays, setExpandedPastDays] = useState<Set<string>>(() => new Set())
  const [expandedPastCards, setExpandedPastCards] = useState<Set<string>>(() => new Set())
  const dateLocale = lang === 'zh' ? 'zh-CN' : 'it-IT'
  const dates = useMemo(() => listAvailableDates(), [])

  useEffect(() => {
    if (!manualDate && dates[0]) setManualDate(dates[0])
  }, [dates, manualDate])

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

  const pendingActive = useMemo(
    () =>
      rows
        .filter((b) => b.status === 'pending' || b.status === 'unknown')
        .map((b) => ({ ...b, date: normalizeIsoDate(b.date), slotId: String(b.slotId || '').trim() }))
        .filter((b) => !isBookingPast(b.date, b.slotId)),
    [rows],
  )
  const pendingPast = useMemo(
    () =>
      rows
        .filter((b) => b.status === 'pending' || b.status === 'unknown')
        .map((b) => ({ ...b, date: normalizeIsoDate(b.date), slotId: String(b.slotId || '').trim() }))
        .filter((b) => isBookingPast(b.date, b.slotId)),
    [rows],
  )
  const approvedActive = useMemo(
    () =>
      rows
        .filter((b) => b.status === 'approved' || b.status === 'done')
        .map((b) => ({ ...b, date: normalizeIsoDate(b.date), slotId: String(b.slotId || '').trim() }))
        .filter((b) => !isBookingPast(b.date, b.slotId)),
    [rows],
  )
  const approvedPast = useMemo(
    () =>
      rows
        .filter((b) => b.status === 'approved' || b.status === 'done')
        .map((b) => ({ ...b, date: normalizeIsoDate(b.date), slotId: String(b.slotId || '').trim() }))
        .filter((b) => isBookingPast(b.date, b.slotId)),
    [rows],
  )

  async function refresh(pass: string) {
    try {
      const list = await adminListBookings(pass)
      setRows(list as Row[])
      try {
        const ping = await adminPing(pass)
        const sheetLabel = ping.bookingsSheet || ping.sheet
        if (
          list.length === 0 &&
          typeof ping.bookings === 'number' &&
          ping.bookings > 0
        ) {
          setHealth(
            `${t('adminHealthFail')}: list empty but sheet reports ${ping.bookings} bookings` +
              (sheetLabel ? ` · ${sheetLabel}` : ''),
          )
        } else {
          setHealth(
            sheetLabel
              ? `${t('adminHealthOk')} · ${sheetLabel} · ${ping.bookings ?? list.length} bookings`
              : t('adminHealthOk'),
          )
        }
      } catch (err) {
        setHealth(
          `${t('adminHealthFail')}: ${err instanceof Error ? err.message : 'error'}`,
        )
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t('adminLoadFail'))
      throw err
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
    extra?: {
      date?: string
      slotId?: string
      contactName?: string
      email?: string
      phone?: string
    },
  ): Promise<boolean> {
    if (status === 'cancelled') {
      const ok = window.confirm(t('adminCancelConfirm'))
      if (!ok) return false
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
        phone: extra?.phone,
      })
      setInfo(status === 'cancelled' ? `${code} — ${t('adminDeleted')}` : `${code} → ${status}`)
      await refresh(password)
      return true
    } catch (err) {
      const msg = err instanceof Error ? err.message : t('errGeneric')
      setError(msg === 'date_and_slot_required' ? t('adminManualNeedSlot') : msg)
      return false
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

  function onManualNameChange(value: string) {
    setManualName(value)
    if (codeTouched) return
    const parts = value.trim().split(/\s+/)
    const nome = parts[0] || ''
    const cognome = parts.slice(1).join(' ') || ''
    const suggested = codeFromName(nome, cognome)
    if (suggested) setManualCode(suggested)
  }

  async function addManual(e: FormEvent) {
    e.preventDefault()
    const code = manualCode.trim().toUpperCase()
    const date = normalizeIsoDate(manualDate)
    const slotId = String(manualSlot || '').trim()
    if (code.length < 2) {
      setError(t('errCode'))
      return
    }
    if (!date || !slotId) {
      setError(t('adminManualNeedSlot'))
      return
    }
    const cell = bySlot.get(`${date}|${slotId}`) || []
    if (cell.some((b) => b.status === 'approved' || b.status === 'done')) {
      setError(t('adminManualSlotTaken'))
      return
    }
    const ok = await setStatus(code, 'approved', {
      date,
      slotId,
      contactName: manualName.trim() || undefined,
      email: manualEmail.trim() || undefined,
      phone: manualPhone.trim() || undefined,
    })
    if (!ok) return
    setInfo(`${code} — ${t('adminManualCreated')}`)
    setManualName('')
    setManualCode('')
    setManualEmail('')
    setManualPhone('')
    setCodeTouched(false)
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

  function togglePastDay(d: string) {
    setExpandedPastDays((prev) => {
      const next = new Set(prev)
      if (next.has(d)) next.delete(d)
      else next.add(d)
      return next
    })
  }

  function pastCardKey(b: Row) {
    return `${b.participantCode}|${b.date}|${b.slotId}|${b.status}`
  }

  function togglePastCard(key: string) {
    setExpandedPastCards((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  function dayBookingCount(d: string) {
    let n = 0
    for (const s of TIME_SLOTS) {
      n += (bySlot.get(`${d}|${s.id}`) || []).length
    }
    return n
  }

  function renderScheduleCells(d: string) {
    return TIME_SLOTS.map((s) => {
      const cell = bySlot.get(`${d}|${s.id}`) || []
      const past = isSlotPast(d, s.id)
      const hasApproved = cell.some((b) => b.status === 'approved' || b.status === 'done')
      return (
        <td
          key={s.id}
          className={[
            hasApproved ? 'cell-approved' : cell.length ? 'cell-pending' : 'cell-free',
            past ? 'cell-past' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {cell.length === 0 ? (
            <span className="cell-empty">{t('adminSlotFree')}</span>
          ) : past ? (
            <span className="chip-past-compact">
              {cell
                .map((b) => b.contactName || b.participantCode)
                .join(', ')}
            </span>
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
    })
  }

  function renderColumn(
    title: string,
    active: Row[],
    past: Row[],
  ) {
    return (
      <section className="admin-col">
        <h2 className="admin-section-title">
          {title} ({active.length}
          {past.length ? ` + ${past.length}` : ''})
        </h2>
        <div className="admin-list">
          {active.length === 0 && past.length === 0 && (
            <p className="body muted">{t('adminNoneInCol')}</p>
          )}
          {active.map((b) => (
            <BookingCard
              key={`a-${b.participantCode}-${b.date}-${b.slotId}`}
              {...cardProps(b)}
            />
          ))}
          {past.length > 0 && (
            <div className="admin-past-block">
              <p className="admin-past-heading">{t('adminPastSection')}</p>
              {past.map((b) => {
                const key = pastCardKey(b)
                return (
                  <PastBookingRow
                    key={key}
                    b={b}
                    dateLocale={dateLocale}
                    busy={busy}
                    expanded={expandedPastCards.has(key)}
                    onToggle={() => togglePastCard(key)}
                    onCancel={() =>
                      setStatus(b.participantCode, 'cancelled', {
                        date: b.date,
                        slotId: b.slotId,
                      })
                    }
                    t={t}
                  />
                )
              })}
            </div>
          )}
        </div>
      </section>
    )
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

        <form className="stack form admin-manual-form" onSubmit={addManual}>
          <h2 className="admin-section-title">{t('adminManualTitle')}</h2>
          <label className="field">
            <span>{t('adminManualName')}</span>
            <input
              value={manualName}
              onChange={(e) => onManualNameChange(e.target.value)}
              autoComplete="name"
            />
          </label>
          <label className="field">
            <span>{t('adminManualCode')} *</span>
            <input
              value={manualCode}
              onChange={(e) => {
                setCodeTouched(true)
                setManualCode(e.target.value.toUpperCase())
              }}
              placeholder="MARROS"
              autoComplete="off"
              required
            />
          </label>
          <div className="admin-manual-row">
            <label className="field">
              <span>{t('dateLabel')} *</span>
              <select
                value={manualDate}
                onChange={(e) => setManualDate(e.target.value)}
                required
              >
                {dates.map((d) => (
                  <option key={d} value={d}>
                    {formatDateLocale(d, dateLocale)}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>{t('slotLabel')} *</span>
              <select
                value={manualSlot}
                onChange={(e) => setManualSlot(e.target.value)}
                required
              >
                {TIME_SLOTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="field">
            <span>{t('emailLabel')}</span>
            <input
              type="email"
              value={manualEmail}
              onChange={(e) => setManualEmail(e.target.value)}
              autoComplete="email"
            />
          </label>
          <label className="field">
            <span>{t('phoneLabel')}</span>
            <input
              value={manualPhone}
              onChange={(e) => setManualPhone(e.target.value)}
              autoComplete="tel"
            />
          </label>
          <button className="btn btn-primary" type="submit" disabled={busy}>
            {t('adminManualSubmit')}
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
              {dates.map((d) => {
                const pastDay = isDayPast(d)
                const expanded = expandedPastDays.has(d)
                if (pastDay && !expanded) {
                  const count = dayBookingCount(d)
                  return (
                    <tr key={d} className="row-past-collapsed">
                      <td colSpan={1 + TIME_SLOTS.length}>
                        <button
                          type="button"
                          className="admin-day-summary"
                          onClick={() => togglePastDay(d)}
                        >
                          <span>
                            {formatDateShort(d, dateLocale)} · {t('adminDayPast')}
                            {count > 0 ? ` · ${count} ${t('adminDayBookings')}` : ''}
                          </span>
                          <span>{t('adminExpandDay')}</span>
                        </button>
                      </td>
                    </tr>
                  )
                }
                return (
                  <tr key={d} className={pastDay ? 'row-past-expanded' : undefined}>
                    <th scope="row">
                      {formatDateShort(d, dateLocale)}
                      {pastDay && (
                        <button
                          type="button"
                          className="admin-day-collapse"
                          onClick={() => togglePastDay(d)}
                        >
                          {t('adminCollapseDay')}
                        </button>
                      )}
                    </th>
                    {renderScheduleCells(d)}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="admin-columns">
          {renderColumn(t('adminColPending'), pendingActive, pendingPast)}
          {renderColumn(t('adminColApproved'), approvedActive, approvedPast)}
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
