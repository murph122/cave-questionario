import { getSurveyProgress } from '../lib/surveyProgress'
import { isSurveyUnlocked } from '../lib/access'
import { useLang } from '../i18n/LangContext'
import './ProgressChecklist.css'

export function ProgressChecklist() {
  const { lang } = useLang()
  const live = getSurveyProgress(isSurveyUnlocked())
  const incomplete = live.filter((p) => !p.done)

  return (
    <div className="progress-check">
      <h3 className="progress-check-title">
        {lang === 'zh' ? '问卷进度' : 'Avanzamento questionario'}
      </h3>
      <ul className="progress-check-list">
        {live.map((p) => (
          <li key={p.id} className={p.done ? 'done' : 'todo'}>
            <span className="mark">{p.done ? '✓' : '!'}</span>
            <span>{lang === 'zh' ? p.labelZh : p.labelIt}</span>
          </li>
        ))}
      </ul>
      {incomplete.length > 0 && (
        <p className="progress-check-hint">
          {lang === 'zh'
            ? `未完成：${incomplete.map((p) => p.labelZh).join('、')}`
            : `Da completare: ${incomplete.map((p) => p.labelIt).join(' · ')}`}
        </p>
      )}
    </div>
  )
}
