import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { ProgressChecklist } from '../components/ProgressChecklist'
import { QuestionBlock } from '../components/QuestionBlock'
import { PSS_QUESTIONS } from '../data/questions'
import { useDraft } from '../hooks/useParticipant'
import { submitResponse } from '../lib/api'
import { useLang } from '../i18n/LangContext'
import { loadJson } from '../lib/storage'
import { getAccess } from '../lib/access'

type Draft = { answers: Record<string, number> }
const INITIAL: Draft = { answers: {} }

export function Parte1Page() {
  const navigate = useNavigate()
  const { t } = useLang()
  const { draft, setAnswer } = useDraft<Draft>('draft-pss', INITIAL)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const missing = useMemo(
    () => PSS_QUESTIONS.filter((q) => draft.answers[q.id] == null).map((q) => q.id),
    [draft.answers],
  )
  const answered = missing.length === 0
  const progress = Math.round(((PSS_QUESTIONS.length - missing.length) / PSS_QUESTIONS.length) * 100)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!answered) {
      setError(`${t('errMissingPrefix')}${missing.join(', ')}`)
      document.querySelector(`[data-qid="${missing[0]}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    setBusy(true)
    setError('')
    try {
      const code = getAccess()?.participantCode || loadJson<string>('participantCode', '')
      await submitResponse({
        participantCode: code,
        section: 'pss',
        answers: draft.answers,
      })
      navigate('/anagrafica')
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errGeneric'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <AppShell title={t('p1Title')} subtitle={t('p1Sub')} progress={Math.max(8, progress * 0.3)}>
      <form className="stack" onSubmit={onSubmit}>
        <ProgressChecklist />
        {PSS_QUESTIONS.map((q) => (
          <div key={q.id} data-qid={q.id}>
            <QuestionBlock
              question={q}
              value={draft.answers[q.id]}
              onChange={(v) => {
                setAnswer(q.id, v)
                setError('')
              }}
            />
          </div>
        ))}
        {error && <p className="error">{error}</p>}
        {!answered && (
          <p className="body muted">
            {t('errMissingPrefix')}
            {missing.join(', ')}
          </p>
        )}
        <button className="btn btn-primary" type="submit" disabled={busy}>
          {busy ? t('sending') : t('continueDemo')}
        </button>
      </form>
    </AppShell>
  )
}
