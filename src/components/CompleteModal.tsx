import './CompleteModal.css'

type Props = {
  open: boolean
  title: string
  body: string
  code?: string
  primaryLabel: string
  onPrimary: () => void
}

export function CompleteModal({ open, title, body, code, primaryLabel, onPrimary }: Props) {
  if (!open) return null
  return (
    <div className="complete-modal" role="dialog" aria-modal="true" aria-labelledby="complete-title">
      <div className="complete-card">
        <div className="complete-ring" aria-hidden />
        <h2 id="complete-title">{title}</h2>
        <p>{body}</p>
        {code && (
          <p className="complete-code">
            ID: <strong>{code}</strong>
          </p>
        )}
        <button type="button" className="btn btn-primary" onClick={onPrimary}>
          {primaryLabel}
        </button>
      </div>
    </div>
  )
}
