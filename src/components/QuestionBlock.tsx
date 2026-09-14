import type { LikertQuestion } from '../data/questions'
import { useLang } from '../i18n/LangContext'
import { LikertScale } from './LikertScale'
import { PlaceholderNotice } from './PlaceholderNotice'
import './QuestionBlock.css'

type Props = {
  question: LikertQuestion
  value?: number
  onChange: (value: number) => void
}

export function QuestionBlock({ question, value, onChange }: Props) {
  const { tx } = useLang()
  return (
    <article className="q-block">
      <h3 className="q-id">{question.id}</h3>
      <p className="q-text">{tx(question.text)}</p>
      {question.placeholder && <PlaceholderNotice compact />}
      <LikertScale
        name={question.id}
        low={tx(question.low)}
        high={tx(question.high)}
        value={value}
        onChange={onChange}
      />
    </article>
  )
}
