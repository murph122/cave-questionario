import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { PlaceholderNotice } from '../components/PlaceholderNotice'
import { SESSO_VALUES } from '../data/questions'
import { useDraft, useParticipantCode } from '../hooks/useParticipant'
import { submitResponse } from '../lib/api'
import { useLang } from '../i18n/LangContext'
import type { UiKey } from '../i18n/ui'

type Draft = {
  eta: string
  sesso: string
  answers: Record<string, string | number>
}

const INITIAL: Draft = { eta: '', sesso: '', answers: {} }

const SEX_KEYS: UiKey[] = ['sexDonna', 'sexUomo', 'sexIntersex', 'sexPreferNot']

export function AnagraficaPage() {
  const navigate = useNavigate()
  const { t } = useLang()
  const { code, ensureCode } = useParticipantCode()
  const { draft, update } = useDraft<Draft>('draft-anagrafica', INITIAL)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    const eta = Number(draft.eta)
    if (!draft.eta || Number.isNaN(eta) || eta < 18 || eta > 100) {
      setError(t('errAge'))
      return
    }
    if (!draft.sesso) {
      setError(t('errSex'))
      return
    }

    setBusy(true)
    try {
      await submitResponse({
        participantCode: ensureCode(),
        section: 'anagrafica',
        answers: {
          eta,
          sesso: draft.sesso,
          DEM1: null,
        },
      })
      navigate('/parte-1')
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errGeneric'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <AppShell title={t('demoTitle')} subtitle={t('demoSub')} progress={10}>
      <form className="stack form" onSubmit={onSubmit}>
        <label className="field">
          <span>{t('codePartecipante')}</span>
          <input value={code || '…'} readOnly className="readonly" />
        </label>

        <label className="field">
          <span>{t('ageLabel')}</span>
          <input
            type="number"
            min={18}
            max={100}
            required
            value={draft.eta}
            onChange={(e) => update({ eta: e.target.value })}
          />
        </label>

        <fieldset className="field">
          <legend>{t('sexLabel')}</legend>
          <div className="choice-list">
            {SESSO_VALUES.map((value, i) => (
              <label key={value} className="choice">
                <input
                  type="radio"
                  name="sesso"
                  value={value}
                  checked={draft.sesso === value}
                  onChange={() => update({ sesso: value })}
                />
                {t(SEX_KEYS[i])}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="placeholder-block">
          <h3 className="section-title">DEM1</h3>
          <PlaceholderNotice />
        </div>

        {error && <p className="error">{error}</p>}

        <button className="btn btn-primary" type="submit" disabled={busy}>
          {busy ? t('saving') : t('continueP1')}
        </button>
      </form>
    </AppShell>
  )
}
