import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { createBooking, fetchTakenSlots } from '../lib/api'
import { useParticipantCode } from '../hooks/useParticipant'
import { formatDateLocale, listAvailableDates, TIME_SLOTS } from '../data/slots'
import { addLocalBooking, isSlotTakenLocally } from '../lib/storage'
import { useLang } from '../i18n/LangContext'

export function PrenotaPage() {
  const navigate = useNavigate()
  const { lang, t } = useLang()
  const { code, ensureCode } = useParticipantCode()
  const dates = useMemo(() => listAvailableDates(), [])
  const [date, setDate] = useState(dates[0] ?? '')
  const [slotId, setSlotId] = useState('')
  const [contactName, setContactName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [note, setNote] = useState('')
  const [remoteTaken, setRemoteTaken] = useState<string[]>([])
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const dateLocale = lang === 'zh' ? 'zh-CN' : 'it-IT'

  useEffect(() => {
    fetchTakenSlots().then(setRemoteTaken).catch(() => setRemoteTaken([]))
  }, [])

  const takenKeys = useMemo(() => {
    const local = TIME_SLOTS.filter((s) => isSlotTakenLocally(date, s.id)).map(
      (s) => `${date}|${s.id}`,
    )
    return new Set([...remoteTaken, ...local])
  }, [date, remoteTaken])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (!date || !slotId) {
      setError(t('errPickSlot'))
      return
    }
    if (!email.trim() && !phone.trim()) {
      setError(t('errContact'))
      return
    }
    if (!contactName.trim()) {
      setError(t('errName'))
      return
    }
    if (takenKeys.has(`${date}|${slotId}`)) {
      setError(t('errSlotTaken'))
      return
    }

    setBusy(true)
    const participantCode = ensureCode()
    const booking = {
      bookingId: crypto.randomUUID(),
      participantCode,
      date,
      slotId,
      contactName: contactName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      note: note.trim(),
      createdAt: new Date().toISOString(),
    }

    try {
      await createBooking(booking)
      addLocalBooking(booking)
      navigate('/grazie', {
        state: {
          kind: 'booking',
          participantCode,
          date,
          slotLabel: TIME_SLOTS.find((s) => s.id === slotId)?.label,
        },
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errGeneric'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <AppShell title={t('bookTitle')} subtitle={t('bookSub')}>
      <form className="stack form" onSubmit={onSubmit}>
        <label className="field">
          <span>{t('codeLabel')}</span>
          <input value={code || '…'} readOnly className="readonly" />
        </label>

        <label className="field">
          <span>{t('dateLabel')}</span>
          <select value={date} onChange={(e) => { setDate(e.target.value); setSlotId('') }}>
            {dates.map((d) => (
              <option key={d} value={d}>
                {formatDateLocale(d, dateLocale)}
              </option>
            ))}
          </select>
        </label>

        <fieldset className="field">
          <legend>{t('slotLabel')}</legend>
          <div className="slot-grid">
            {TIME_SLOTS.map((slot) => {
              const taken = takenKeys.has(`${date}|${slot.id}`)
              return (
                <label
                  key={slot.id}
                  className={`slot-chip ${slotId === slot.id ? 'selected' : ''} ${taken ? 'taken' : ''}`}
                >
                  <input
                    type="radio"
                    name="slot"
                    value={slot.id}
                    disabled={taken}
                    checked={slotId === slot.id}
                    onChange={() => setSlotId(slot.id)}
                  />
                  {slot.label}
                  {taken ? ` ${t('slotFull')}` : ''}
                </label>
              )
            })}
          </div>
        </fieldset>

        <label className="field">
          <span>{t('nameLabel')}</span>
          <input
            required
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            placeholder={t('namePh')}
          />
        </label>

        <label className="field">
          <span>{t('emailLabel')}</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="esempio@email.com"
          />
        </label>

        <label className="field">
          <span>{t('phoneLabel')}</span>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+39 …"
          />
        </label>

        <label className="field">
          <span>{t('noteLabel')}</span>
          <textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} />
        </label>

        {error && <p className="error">{error}</p>}

        <button className="btn btn-primary" type="submit" disabled={busy}>
          {busy ? t('sending') : t('bookSubmit')}
        </button>
      </form>
    </AppShell>
  )
}
