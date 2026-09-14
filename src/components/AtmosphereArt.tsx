import './AtmosphereArt.css'

/** Decorative VR / EEG / emotion visual — pure CSS + SVG. */
export function AtmosphereArt() {
  return (
    <div className="atm" aria-hidden>
      <div className="atm-glow" />
      <div className="atm-icons">
        <svg className="atm-icon" viewBox="0 0 64 64" fill="none">
          <path
            d="M10 34c0-10 8-18 18-18h8c10 0 18 8 18 18v4H10v-4z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path d="M22 28h6M36 28h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M8 38h48M16 44h32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
        </svg>
        <svg className="atm-icon" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="28" r="14" stroke="currentColor" strokeWidth="2" />
          <path
            d="M18 48c4-8 10-12 14-12s10 4 14 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M20 28c2-4 6-6 12-6s10 2 12 6"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0.65"
          />
        </svg>
        <svg className="atm-icon pulse" viewBox="0 0 64 64" fill="none">
          <path
            d="M4 32h12l6-14 8 28 6-14h24"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <svg className="atm-wave" viewBox="0 0 640 120" preserveAspectRatio="none">
        <path
          className="atm-path a"
          d="M0 60 C 40 20, 80 100, 120 60 S 200 20, 240 60 S 320 100, 360 60 S 440 20, 480 60 S 560 100, 640 60"
          fill="none"
        />
        <path
          className="atm-path b"
          d="M0 70 C 50 40, 90 90, 140 70 S 230 40, 280 70 S 370 95, 420 70 S 520 45, 640 70"
          fill="none"
        />
      </svg>
      <div className="atm-tags">
        <span>VR</span>
        <span>EEG</span>
        <span>Emotion</span>
        <span>CAVE</span>
      </div>
    </div>
  )
}
