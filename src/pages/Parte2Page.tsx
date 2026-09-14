import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { PlaceholderNotice } from '../components/PlaceholderNotice'
import { QuestionBlock } from '../components/QuestionBlock'
import { SESSION_GROUPS } from '../data/questions'
import { useDraft, useParticipantCode } from '../hooks/useParticipant'
import { submitResponse } from '../lib/api'
import { useLang } from '../i18n/LangContext'

type Draft = {
  condition: 'stressante' | 'non_stressante' | ''
  answers: Record<string, number>
}

const INITIAL: Draft = { condition: '', answers: {} }

const REQUIRED_IDS = SESSION_GROUPS.flatMap((g) =>
  g.questions.filter((q) => !q.placeholder).map((q) => q.id),
)

function hasAnswer(answers: Record<string, number>, id: string) {
  const v = answers[id]
  return v != null && !Number.isNaN(Number(v))
}

export function Parte2Page() {
  const navigate = useNavigate()
  const { lang, t, tx } = useLang()
  const { ensureCode } = useParticipantCode()
  const { draft, update, setAnswer } = useDraft<Draft>('draft-session', INITIAL)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const missing = useMemo(() => {
    const ids = REQUIRED_IDS.filter((id) => !hasAnswer(draft.answers, id))
    return ids
  }, [draft.answers])

  const answered = Boolean(draft.condition) && missing.length === 0

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!draft.condition || missing.length > 0) {
      const parts = [
        !draft.condition ? t('conditionLegend') : null,
        missing.length ? `${t('errMissingPrefix')}${missing.join(', ')}` : null,
      ].filter(Boolean)
      setError(parts.join(' · ') || t('errCondition'))
      if (missing[0]) {
        document
          .querySelector(`[data-qid="${missing[0]}"]`)
          ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return
    }
    setBusy(true)
    setError('')
    try {
      await submitResponse({
        participantCode: ensureCode(),
        section: 'session',
        condition: draft.condition,
        answers: draft.answers,
        uiLang: lang,
      })
      navigate('/parte-3')
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errGeneric'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <AppShell title={t('p2Title')} subtitle={t('p2Sub')} progress={55}>
      <form className="stack" onSubmit={onSubmit}>
        <fieldset className="field">
          <legend>{t('conditionLegend')}</legend>
          <div className="choice-list">
            {(
              [
                ['stressante', 'condStress'],
                ['non_stressante', 'condNonStress'],
              ] as const
            ).map(([value, key]) => (
              <label key={value} className="choice">
                <input
                  type="radio"
                  name="condition"
                  checked={draft.condition === value}
                  onChange={() => {
                    update({ condition: value })
                    setError('')
                  }}
                />
                {t(key)}
              </label>
            ))}
          </div>
        </fieldset>

        {SESSION_GROUPS.map((group) => (
          <section key={group.id} className="group">
            <h2 className="section-title">{tx(group.title)}</h2>
            {group.description && <PlaceholderNotice />}
            {group.questions.map((q) => (
              <div key={q.id} data-qid={q.id}>
                <QuestionBlock
                  question={q}
                  value={draft.answers[q.id] != null ? Number(draft.answers[q.id]) : undefined}
                  onChange={(v) => {
                    setAnswer(q.id, v)
                    setError('')
                  }}
                />
              </div>
            ))}
          </section>
        ))}

        {error && <p className="error">{error}</p>}
        {!answered && missing.length > 0 && (
          <p className="body muted">
            {t('errMissingPrefix')}
            {missing.join(', ')}
          </p>
        )}
        <button className="btn btn-primary" type="submit" disabled={busy}>
          {busy ? t('sending') : t('sendToP3')}
        </button>
      </form>
    </AppShell>
  )
}
