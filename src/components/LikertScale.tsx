import './LikertScale.css'

type Props = {
  name: string
  low: string
  high: string
  value?: number
  max?: 4 | 5 | 10
  onChange: (value: number) => void
}

export function LikertScale({ name, low, high, value, max = 5, onChange }: Props) {
  const current = value == null ? undefined : Number(value)
  const values = Array.from({ length: max }, (_, i) => i + 1)

  return (
    <div className="likert">
      <div className="likert-labels">
        <span>{low}</span>
        <span>{high}</span>
      </div>
      <div
        className={`likert-options ${max > 5 ? 'wide' : ''}`}
        role="radiogroup"
        aria-label={name}
        style={{ gridTemplateColumns: `repeat(${max}, minmax(0, 1fr))` }}
      >
        {values.map((n) => {
          const selected = current === n
          return (
            <button
              key={n}
              type="button"
              className={`likert-opt ${selected ? 'selected' : ''}`}
              aria-pressed={selected}
              onClick={() => onChange(n)}
            >
              {n}
            </button>
          )
        })}
      </div>
    </div>
  )
}
