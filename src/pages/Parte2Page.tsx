import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { ProgressChecklist } from '../components/ProgressChecklist'
import { QuestionBlock } from '../components/QuestionBlock'
import { SESSION_GROUPS } from '../data/questions'
import { useDraft } from '../hooks/useParticipant'
import { submitResponse } from '../lib/api'
import { useLang } from '../i18n/LangContext'
import { getAccess } from '../lib/access'
import { getAccumulated } from '../lib/accumulate'

type Draft = {
  condition: 'stressante' | 'non_stressante' | ''
  answers: Record<string, number>
}

const INITIAL: Draft = { condition: '', answers: {} }

const REQUIRED_IDS = SESSION_GROUPS.flatMap((g) => g.questions.map((q) => q.id))

export function Parte2Page() {
  const navigate = useNavigate()
  const { lang, t, tx } = useLang()
  const { draft, update, setAnswer, setDraft } = useDraft<Draft>('draft-session', INITIAL)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [info, setInfo] = useState('')

  const acc = getAccumulated()
  const doneStress = Boolean(acc.sessions?.stressante?.answers)
  const doneNon = Boolean(acc.sessions?.non_stressante?.answers)

  const missing = useMemo(
    () => REQUIRED_IDS.filter((id) => draft.answers[id] == null),
    [draft.answers],
  )
  const answered = Boolean(draft.condition) && missing.length === 0

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!answered || !draft.condition) {
      setError(
        [
          !draft.condition ? t('conditionLegend') : null,
          missing.length ? `${t('errMissingPrefix')}${missing.join(', ')}` : null,
        ]
          .filter(Boolean)
          .join(' · ') || t('errCondition'),
      )
      if (missing[0]) {
        document
          .querySelector(`[data-qid="${missing[0]}"]`)
          ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return
    }
    setBusy(true)
    setError('')
    setInfo('')
    try {
      const code = getAccess()?.participantCode || ''
      const result = await submitResponse({
        participantCode: code,
        section: 'session',
        condition: draft.condition,
        answers: draft.answers,
        uiLang: lang,
      })
      setDraft(INITIAL)
      if (result.bothConditionsDone) {
        navigate('/parte-3')
      } else {
        const next =
          draft.condition === 'stressante' ? t('needNonStress') : t('needStress')
        setInfo(next)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errGeneric'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <AppShell title={t('p2Title')} subtitle={t('p2Sub')} progress={55}>
      <form className="stack" onSubmit={onSubmit}>
        <ProgressChecklist />
        <p className="body muted">
          {t('bothConditionsHint')}{' '}
          {doneStress ? '✓ stress' : '○ stress'} · {doneNon ? '✓ non-stress' : '○ non-stress'}
        </p>

        <fieldset className="field">
          <legend>{t('conditionLegend')}</legend>
          <div className="choice-list">
            {(
              [
                ['stressante', 'condStress', doneStress],
                ['non_stressante', 'condNonStress', doneNon],
              ] as const
            ).map(([value, key, done]) => (
              <label key={value} className="choice">
                <input
                  type="radio"
                  name="condition"
                  checked={draft.condition === value}
                  onChange={() => {
                    update({ condition: value, answers: {} })
                    setError('')
                    setInfo('')
                  }}
                />
                <span>
                  {t(key)}
                  {done ? ` (${t('alreadySaved')})` : ''}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {SESSION_GROUPS.map((group) => (
          <section key={group.id} className="group">
            <h2 className="section-title">{tx(group.title)}</h2>
            {group.questions.map((q) => (
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
          </section>
        ))}

        {info && <p className="body" style={{ color: '#86efac' }}>{info}</p>}
        {error && <p className="error">{error}</p>}
        <p className="body muted">{t('syncGoogleHint')}</p>
        <button className="btn btn-primary" type="submit" disabled={busy}>
          {busy ? t('sending') : t('saveCondition')}
        </button>
      </form>
    </AppShell>
  )
}
