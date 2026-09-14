import type { SamVisual } from '../data/questions'

type FigProps = { level: 1 | 2 | 3 | 4 | 5 }

/** Classic SAM Arousal figures (low calm → high activated), matching study sheet art. */
function ArousalFig({ level }: FigProps) {
  const burst =
    level === 1
      ? null
      : level === 2
        ? 'M40 52 L43 46 L48 50 L45 42 L52 42 L46 38 L50 32 L42 36 L40 28 L38 36 L30 32 L34 38 L28 42 L35 42 L32 50 L37 46 Z'
        : level === 3
          ? 'M40 54 L44 46 L52 50 L46 40 L56 38 L46 34 L52 24 L40 32 L28 24 L34 34 L24 38 L34 40 L28 50 L36 46 Z'
          : level === 4
            ? 'M40 56 L45 45 L56 50 L48 38 L60 34 L46 30 L54 18 L40 28 L26 18 L34 30 L20 34 L32 38 L24 50 L35 45 Z'
            : 'M40 58 L46 44 L60 52 L50 36 L66 30 L48 26 L58 12 L40 24 L22 12 L32 26 L14 30 L30 36 L20 52 L34 44 Z'

  const vibes = level >= 4
  const eyesClosed = level === 1
  const eyesSlit = level === 2

  return (
    <svg viewBox="0 0 80 96" className="sam-svg" aria-hidden>
      {/* vibration marks */}
      {vibes && (
        <g stroke="currentColor" strokeWidth="1.6" fill="none" opacity="0.85">
          <path d="M18 22 q-4 6 0 12" />
          <path d="M14 28 q-3 5 0 10" />
          <path d="M62 22 q4 6 0 12" />
          <path d="M66 28 q3 5 0 10" />
          {level === 5 && (
            <>
              <path d="M16 48 q-5 4 0 10" />
              <path d="M64 48 q5 4 0 10" />
              <path d="M22 18 q-2 -4 2 -6" />
              <path d="M58 18 q2 -4 -2 -6" />
            </>
          )}
        </g>
      )}
      {/* head */}
      <circle cx="40" cy="22" r="12" fill="none" stroke="currentColor" strokeWidth="2.2" />
      {eyesClosed ? (
        <>
          <path d="M34 21 h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M41 21 h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </>
      ) : eyesSlit ? (
        <>
          <rect x="33.5" y="19.5" width="5" height="3" rx="0.5" fill="currentColor" />
          <rect x="41.5" y="19.5" width="5" height="3" rx="0.5" fill="currentColor" />
        </>
      ) : (
        <>
          <rect x="33" y="18.5" width="5.5" height="5.5" fill="currentColor" />
          <rect x="41.5" y="18.5" width="5.5" height="5.5" fill="currentColor" />
        </>
      )}
      <path d="M36 28 h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      {/* body */}
      <path
        d="M28 36 h24 v34 h-6 v16 h-12 v-16 h-6 z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      {level === 1 ? (
        <circle cx="40" cy="48" r="2.2" fill="currentColor" />
      ) : (
        <path d={burst!} fill="currentColor" opacity={0.9} />
      )}
    </svg>
  )
}

/** Valence: unhappy → happy (classic SAM faces). */
function ValenceFig({ level }: FigProps) {
  const mouth =
    level === 1
      ? 'M30 28 Q40 18 50 28'
      : level === 2
        ? 'M32 27 Q40 22 48 27'
        : level === 3
          ? 'M32 26 H48'
          : level === 4
            ? 'M32 25 Q40 30 48 25'
            : 'M30 24 Q40 36 50 24'

  const brow =
    level <= 2 ? (
      <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d={level === 1 ? 'M30 14 L38 17' : 'M31 15 L38 16.5'} />
        <path d={level === 1 ? 'M50 14 L42 17' : 'M49 15 L42 16.5'} />
      </g>
    ) : null

  return (
    <svg viewBox="0 0 80 96" className="sam-svg" aria-hidden>
      <circle cx="40" cy="22" r="14" fill="none" stroke="currentColor" strokeWidth="2.2" />
      {brow}
      <circle cx="34" cy="20" r="2.2" fill="currentColor" />
      <circle cx="46" cy="20" r="2.2" fill="currentColor" />
      <path d={mouth} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path
        d="M28 38 h24 v32 h-6 v16 h-12 v-16 h-6 z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Dominance: small/controlled → large/in control. */
function DominanceFig({ level }: FigProps) {
  const scale = 0.55 + (level - 1) * 0.12
  const y = 88 - 88 * scale

  return (
    <svg viewBox="0 0 80 96" className="sam-svg" aria-hidden>
      <g transform={`translate(40 ${y}) scale(${scale}) translate(-40 0)`}>
        <circle cx="40" cy="18" r="11" fill="none" stroke="currentColor" strokeWidth="2.4" />
        <circle cx="35" cy="17" r="1.8" fill="currentColor" />
        <circle cx="45" cy="17" r="1.8" fill="currentColor" />
        <path
          d="M27 32 h26 v30 h-7 v18 h-12 v-18 h-7 z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
        {level >= 4 && (
          <g stroke="currentColor" strokeWidth="1.6" opacity="0.7">
            <path d="M18 40 h6" />
            <path d="M56 40 h6" />
          </g>
        )}
      </g>
    </svg>
  )
}

export function SamFigure({ kind, level }: { kind: SamVisual; level: 1 | 2 | 3 | 4 | 5 }) {
  if (kind === 'arousal') return <ArousalFig level={level} />
  if (kind === 'valence') return <ValenceFig level={level} />
  return <DominanceFig level={level} />
}
