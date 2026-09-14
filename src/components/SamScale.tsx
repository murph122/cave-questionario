import type { SamVisual } from '../data/questions'
import { SamFigure } from './SamFigure'
import './SamScale.css'

type Props = {
  name: string
  kind: SamVisual
  low: string
  high: string
  value?: number
  onChange: (value: number) => void
}

const LEVELS = [1, 2, 3, 4, 5] as const

export function SamScale({ name, kind, low, high, value, onChange }: Props) {
  const current = value == null ? undefined : Number(value)

  return (
    <div className="sam-scale">
      <div className="sam-labels">
        <span>{low}</span>
        <span>{high}</span>
      </div>
      <div className="sam-row" role="radiogroup" aria-label={name}>
        {LEVELS.map((n) => {
          const selected = current === n
          return (
            <button
              key={n}
              type="button"
              className={`sam-opt ${selected ? 'selected' : ''} level-${n}`}
              aria-pressed={selected}
              aria-label={`${name}: ${n}`}
              onClick={() => onChange(n)}
            >
              <SamFigure kind={kind} level={n} />
              <span className="sam-num">{n}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
