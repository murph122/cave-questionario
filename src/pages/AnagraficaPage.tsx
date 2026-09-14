import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { ProgressChecklist } from '../components/ProgressChecklist'
import { DEMO_FIELDS } from '../data/questions'
import { useDraft } from '../hooks/useParticipant'
import { submitResponse } from '../lib/api'
import { useLang } from '../i18n/LangContext'
import { saveJson, suggestPersonalCode } from '../lib/storage'
import { getAccess } from '../lib/access'

type Draft = {
  nome: string
  cognome: string
  codicePersonale: string
  eta: string
  answers: Record<string, string | number>
}

const INITIAL: Draft = {
  nome: '',
  cognome: '',
  codicePersonale: '',
  eta: '',
  answers: {},
}

export function AnagraficaPage() {
  const navigate = useNavigate()
  const { t, tx } = useLang()
  const { draft, update } = useDraft<Draft>('draft-anagrafica', INITIAL)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const autoCode = useMemo(
    () => suggestPersonalCode(draft.nome, draft.cognome),
    [draft.nome, draft.cognome],
  )

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (!draft.nome.trim() || !draft.cognome.trim()) {
      setError(t('errName'))
      return
    }
    const bookingCode = (
      getAccess()?.participantCode ||
      draft.codicePersonale ||
      autoCode
    ).toUpperCase()
    if (bookingCode.length < 4) {
      setError(t('errCode'))
      return
    }
    const eta = Number(draft.eta)
    if (!draft.eta || Number.isNaN(eta) || eta < 16 || eta > 100) {
      setError(t('errAge'))
      return
    }

    setBusy(true)
    try {
      saveJson('participantCode', bookingCode)
      await submitResponse({
        participantCode: bookingCode,
        section: 'anagrafica',
        answers: {
          nome: draft.nome.trim(),
          cognome: draft.cognome.trim(),
          codicePersonale: bookingCode,
          eta,
        },
      })
      navigate('/parte-2')
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errGeneric'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <AppShell title={t('demoTitle')} subtitle={t('demoSub')} progress={35}>
      <form className="stack form" onSubmit={onSubmit}>
        <ProgressChecklist />
        {DEMO_FIELDS.filter((f) => f.id !== 'codicePersonale' && f.id !== 'eta').map((field) => (
          <label key={field.id} className="field">
            <span>{tx(field.label)}</span>
            <input
              required={field.required}
              value={String(draft[field.id as keyof Draft] ?? '')}
              placeholder={field.placeholder ? tx(field.placeholder) : undefined}
              onChange={(e) => {
                const next = e.target.value
                if (field.id === 'nome') update({ nome: next, codicePersonale: suggestPersonalCode(next, draft.cognome) })
                else if (field.id === 'cognome') update({ cognome: next, codicePersonale: suggestPersonalCode(draft.nome, next) })
              }}
            />
          </label>
        ))}

        <label className="field">
          <span>{t('bookingIdLabel')}</span>
          <input
            readOnly
            className="readonly"
            value={getAccess()?.participantCode || draft.codicePersonale || autoCode}
          />
        </label>

        <label className="field">
          <span>{tx(DEMO_FIELDS[3].label)}</span>
          <input
            type="number"
            min={16}
            max={100}
            required
            value={draft.eta}
            onChange={(e) => update({ eta: e.target.value })}
          />
        </label>

        {error && <p className="error">{error}</p>}
        <button className="btn btn-primary" type="submit" disabled={busy}>
          {busy ? t('saving') : t('continueSession')}
        </button>
      </form>
    </AppShell>
  )
}
