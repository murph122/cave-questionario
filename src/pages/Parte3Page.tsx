import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { CompleteModal } from '../components/CompleteModal'
import { ProgressChecklist } from '../components/ProgressChecklist'
import { QuestionBlock } from '../components/QuestionBlock'
import { SSQ_QUESTIONS, SUS_QUESTIONS } from '../data/questions'
import { useDraft } from '../hooks/useParticipant'
import { submitResponse } from '../lib/api'
import { useLang } from '../i18n/LangContext'
import { getAccess } from '../lib/access'
import { incompleteParts } from '../lib/surveyProgress'
import { isSurveyUnlocked } from '../lib/access'
import { clearSurveySession } from '../lib/storage'
import { clearAccess } from '../lib/access'

type Draft = { answers: Record<string, number | string>; ssqAltro: string }
const INITIAL: Draft = { answers: {}, ssqAltro: '' }

export function Parte3Page() {
  const navigate = useNavigate()
  const { lang, t } = useLang()
  const { draft, setAnswer, update } = useDraft<Draft>('draft-final', INITIAL)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [showComplete, setShowComplete] = useState(false)
  const [doneCode, setDoneCode] = useState('')

  const required = useMemo(
    () => [...SSQ_QUESTIONS.filter((q) => q.id !== 'SSQ1'), ...SUS_QUESTIONS].map((q) => q.id),
    [],
  )
  const missing = required.filter((id) => draft.answers[id] == null)
  const priorMissing = incompleteParts(isSurveyUnlocked()).filter(
    (p) => p.id !== 'final' && p.id !== 'access',
  )

  async function finish(e: FormEvent) {
    e.preventDefault()
    if (priorMissing.length) {
      setError(
        `${t('errPartsIncomplete')}${priorMissing
          .map((p) => (lang === 'zh' ? p.labelZh : p.labelIt))
          .join(lang === 'zh' ? '、' : ' · ')}`,
      )
      return
    }
    if (missing.length) {
      setError(`${t('errMissingPrefix')}${missing.join(', ')}`)
      document.querySelector(`[data-qid="${missing[0]}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    setBusy(true)
    setError('')
    const code = getAccess()?.participantCode || ''
    try {
      await submitResponse({
        participantCode: code,
        section: 'final',
        answers: draft.answers,
        ssqAltro: draft.ssqAltro,
      })
      setDoneCode(code)
      setShowComplete(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errGeneric'))
    } finally {
      setBusy(false)
    }
  }

  function closeComplete() {
    setShowComplete(false)
    clearAccess()
    clearSurveySession()
    navigate('/')
  }

  return (
    <AppShell title={t('p3Title')} subtitle={t('p3Sub')} progress={88}>
      <CompleteModal
        open={showComplete}
        title={t('completeTitle')}
        body={t('completeBody')}
        code={doneCode}
        primaryLabel={t('completeOk')}
        onPrimary={closeComplete}
      />
      <form className="stack" onSubmit={finish}>
        <ProgressChecklist />
        <section className="group">
          <h2 className="section-title">SSQ</h2>
          {SSQ_QUESTIONS.map((q) => (
            <div key={q.id} data-qid={q.id}>
              <QuestionBlock
                question={q}
                value={draft.answers[q.id] != null ? Number(draft.answers[q.id]) : undefined}
                onChange={(v) => setAnswer(q.id, v)}
              />
            </div>
          ))}
          <label className="field">
            <span>SSQ17 — {t('ssqAltro')}</span>
            <input
              value={draft.ssqAltro}
              onChange={(e) => update({ ssqAltro: e.target.value })}
              placeholder={t('ssqAltroPh')}
            />
          </label>
        </section>

        <section className="group">
          <h2 className="section-title">SUS</h2>
          {SUS_QUESTIONS.map((q) => (
            <div key={q.id} data-qid={q.id}>
              <QuestionBlock
                question={q}
                value={draft.answers[q.id] != null ? Number(draft.answers[q.id]) : undefined}
                onChange={(v) => setAnswer(q.id, v)}
              />
            </div>
          ))}
        </section>

        <p className="body muted">{t('p3Note')}</p>
        {error && <p className="error">{error}</p>}
        <button className="btn btn-primary" type="submit" disabled={busy}>
          {busy ? t('sending') : t('finishSurvey')}
        </button>
      </form>
    </AppShell>
  )
}
