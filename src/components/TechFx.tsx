import './TechFx.css'

/** Ambient futuristic scan / HUD overlays for the shell. */
export function TechFx() {
  return (
    <div className="tech-fx" aria-hidden>
      <div className="tech-scan" />
      <div className="tech-beam" />
      <div className="tech-corners">
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="tech-nodes">
        <i />
        <i />
        <i />
        <i />
      </div>
    </div>
  )
}
