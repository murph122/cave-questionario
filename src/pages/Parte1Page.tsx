import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { QuestionBlock } from '../components/QuestionBlock'
import { PSS_QUESTIONS } from '../data/questions'
import { useDraft, useParticipantCode } from '../hooks/useParticipant'
import { submitResponse } from '../lib/api'
import { useLang } from '../i18n/LangContext'

type Draft = { answers: Record<string, number> }
const INITIAL: Draft = { answers: {} }

function hasAnswer(answers: Record<string, number>, id: string) {
  const v = answers[id]
  return v != null && !Number.isNaN(Number(v))
}

export function Parte1Page() {
  const navigate = useNavigate()
  const { lang, t } = useLang()
  const { ensureCode } = useParticipantCode()
  const { draft, setAnswer } = useDraft<Draft>('draft-pss', INITIAL)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const missing = useMemo(
    () => PSS_QUESTIONS.filter((q) => !hasAnswer(draft.answers, q.id)).map((q) => q.id),
    [draft.answers],
  )
  const answered = missing.length === 0

  const progress = Math.round(
    ((PSS_QUESTIONS.length - missing.length) / PSS_QUESTIONS.length) * 100,
  )

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!answered) {
      setError(`${t('errMissingPrefix')}${missing.join(', ')}`)
      const first = document.querySelector(`[data-qid="${missing[0]}"]`)
      first?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    setBusy(true)
    setError('')
    try {
      await submitResponse({
        participantCode: ensureCode(),
        section: 'pss',
        answers: draft.answers,
        uiLang: lang,
      })
      navigate('/parte-2')
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errGeneric'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <AppShell
      title={t('p1Title')}
      subtitle={t('p1Sub')}
      progress={Math.max(20, 20 + progress * 0.25)}
    >
      <form className="stack" onSubmit={onSubmit}>
        {PSS_QUESTIONS.map((q) => (
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
        {error && <p className="error">{error}</p>}
        <p className="body muted">
          {answered
            ? null
            : `${t('errMissingPrefix')}${missing.join(', ')}`}
        </p>
        <button className="btn btn-primary" type="submit" disabled={busy}>
          {busy ? t('sending') : t('sendToP2')}
        </button>
      </form>
    </AppShell>
  )
}
