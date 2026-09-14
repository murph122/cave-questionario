import './LikertScale.css'

type Props = {
  name: string
  low: string
  high: string
  value?: number
  onChange: (value: number) => void
}

const VALUES = [1, 2, 3, 4, 5]

export function LikertScale({ name, low, high, value, onChange }: Props) {
  const current = value == null ? undefined : Number(value)

  return (
    <div className="likert">
      <div className="likert-labels">
        <span>{low}</span>
        <span>{high}</span>
      </div>
      <div className="likert-options" role="radiogroup" aria-label={name}>
        {VALUES.map((n) => {
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
