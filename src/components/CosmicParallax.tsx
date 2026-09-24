import { useEffect, useRef } from 'react'
import './CosmicParallax.css'

/**
 * Full-bleed cosmic hero with parallax on pointer / device tilt.
 * Layers: stars → nebula → planet art → energy glow → vignette.
 */
export function CosmicParallax() {
  const rootRef = useRef<HTMLDivElement>(null)
  const target = useRef({ x: 0, y: 0 })
  const current = useRef({ x: 0, y: 0 })
  const raf = useRef(0)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const apply = () => {
      const c = current.current
      const t = target.current
      c.x += (t.x - c.x) * 0.08
      c.y += (t.y - c.y) * 0.08
      root.style.setProperty('--px', c.x.toFixed(4))
      root.style.setProperty('--py', c.y.toFixed(4))
      raf.current = requestAnimationFrame(apply)
    }
    raf.current = requestAnimationFrame(apply)

    const setFromClient = (cx: number, cy: number) => {
      const w = window.innerWidth || 1
      const h = window.innerHeight || 1
      target.current = {
        x: Math.max(-1, Math.min(1, (cx / w - 0.5) * 2)),
        y: Math.max(-1, Math.min(1, (cy / h - 0.5) * 2)),
      }
    }

    const onPointer = (e: PointerEvent) => setFromClient(e.clientX, e.clientY)
    const onTouch = (e: TouchEvent) => {
      const t0 = e.touches[0]
      if (t0) setFromClient(t0.clientX, t0.clientY)
    }

    const onOrient = (e: DeviceOrientationEvent) => {
      const beta = e.beta ?? 0 // -180..180 front-back
      const gamma = e.gamma ?? 0 // -90..90 left-right
      target.current = {
        x: Math.max(-1, Math.min(1, gamma / 25)),
        y: Math.max(-1, Math.min(1, (beta - 45) / 35)),
      }
    }

    window.addEventListener('pointermove', onPointer, { passive: true })
    window.addEventListener('touchmove', onTouch, { passive: true })
    window.addEventListener('deviceorientation', onOrient)

    return () => {
      cancelAnimationFrame(raf.current)
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('touchmove', onTouch)
      window.removeEventListener('deviceorientation', onOrient)
    }
  }, [])

  return (
    <div className="cosmic" ref={rootRef} aria-hidden>
      <div className="cosmic-layer cosmic-stars" />
      <div className="cosmic-layer cosmic-stars-2" />
      <div className="cosmic-layer cosmic-nebula" />
      <div
        className="cosmic-layer cosmic-planet"
        style={{ backgroundImage: 'url(/cosmic-cave.jpg)' }}
      />
      <div className="cosmic-layer cosmic-energy" />
      <div className="cosmic-vignette" />
      <div className="cosmic-scan" />
    </div>
  )
}
