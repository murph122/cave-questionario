import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { AppShell } from '../components/AppShell'
import { useLang } from '../i18n/LangContext'
import './QrPage.css'

/** Canonical public site — always with https */
export const PUBLIC_SITE_URL = 'https://cave-questionario.vercel.app'

function isLocalHost(url: string) {
  return /localhost|127\.0\.0\.1|0\.0\.0\.0|192\.168\.|10\.\d+\.|172\.(1[6-9]|2\d|3[0-1])\./i.test(
    url,
  )
}

/** Force https:// and strip trailing slash. */
function normalizePublicUrl(raw: string): string {
  let s = String(raw || '').trim().replace(/\/$/, '')
  if (!s) return ''
  if (!/^https?:\/\//i.test(s)) s = `https://${s}`
  // Prefer https
  s = s.replace(/^http:\/\//i, 'https://')
  return s.replace(/\/$/, '')
}

function resolvePublicSiteUrl(): string {
  const fromEnv = (import.meta.env.VITE_PUBLIC_SITE_URL as string | undefined)?.trim()
  if (fromEnv && !isLocalHost(fromEnv)) return normalizePublicUrl(fromEnv)

  if (typeof window !== 'undefined') {
    const origin = window.location.origin.replace(/\/$/, '')
    if (origin && !isLocalHost(origin) && /^https:/i.test(origin)) return origin
  }
  return PUBLIC_SITE_URL
}

export function QrPage() {
  const { t } = useLang()
  const [baseUrl, setBaseUrl] = useState(PUBLIC_SITE_URL)
  const [dataUrl, setDataUrl] = useState('')
  const [genError, setGenError] = useState('')

  useEffect(() => {
    setBaseUrl(resolvePublicSiteUrl())
  }, [])

  const cleaned = normalizePublicUrl(baseUrl)
  // QR opens the booking page (not /qr itself)
  const target = cleaned ? `${cleaned}/prenota` : ''
  const warnLocal = Boolean(cleaned && isLocalHost(cleaned))
  const canUse = Boolean(cleaned && !warnLocal)

  useEffect(() => {
    if (!canUse || !target) {
      setDataUrl('')
      setGenError('')
      return
    }
    let cancelled = false
    setGenError('')
    QRCode.toDataURL(target, {
      width: 320,
      margin: 2,
      color: { dark: '#062018', light: '#ecfeff' },
    })
      .then((url) => {
        if (!cancelled) setDataUrl(url)
      })
      .catch((err) => {
        if (!cancelled) {
          setDataUrl('')
          setGenError(err instanceof Error ? err.message : 'QR error')
        }
      })
    return () => {
      cancelled = true
    }
  }, [canUse, target])

  return (
    <AppShell title={t('qrTitle')} subtitle={t('qrSub')}>
      <div className="qr-box stack">
        <label className="field" style={{ width: '100%', textAlign: 'left' }}>
          <span>{t('qrUrlLabel')}</span>
          <input
            value={baseUrl}
            onChange={(e) => setBaseUrl(normalizePublicUrl(e.target.value) || e.target.value)}
            placeholder={PUBLIC_SITE_URL}
          />
        </label>
        {!cleaned && <p className="error">{t('qrNeedPublic')}</p>}
        {warnLocal && <p className="error">{t('qrLocalWarn')}</p>}
        {genError && <p className="error">{genError}</p>}
        {canUse && dataUrl ? (
          <img className="qr-img" src={dataUrl} alt="QR prenotazione CAVE" />
        ) : (
          <p className="body muted">{t('qrWaiting')}</p>
        )}
        {canUse && (
          <p className="body muted qr-url">
            {t('qrEncodes')}: {target}
          </p>
        )}
        <p className="body">{t('qrHint')}</p>
        {canUse && dataUrl && (
          <a className="btn btn-primary" href={dataUrl} download="cave-prenota-qr.png">
            {t('qrDownload')}
          </a>
        )}
      </div>
    </AppShell>
  )
}
