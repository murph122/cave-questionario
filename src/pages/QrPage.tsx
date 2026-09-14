import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { AppShell } from '../components/AppShell'
import { useLang } from '../i18n/LangContext'
import './QrPage.css'

function isLocalHost(url: string) {
  return /localhost|127\.0\.0\.1|0\.0\.0\.0|192\.168\.|10\.\d+\.|172\.(1[6-9]|2\d|3[0-1])\./i.test(
    url,
  )
}

function resolvePublicSiteUrl(): string {
  const fromEnv = (import.meta.env.VITE_PUBLIC_SITE_URL as string | undefined)?.trim()
  if (fromEnv && !isLocalHost(fromEnv)) return fromEnv.replace(/\/$/, '')
  return ''
}

export function QrPage() {
  const { t } = useLang()
  const [baseUrl, setBaseUrl] = useState(() => resolvePublicSiteUrl())
  const [dataUrl, setDataUrl] = useState('')

  const cleaned = baseUrl.replace(/\/$/, '')
  const target = cleaned ? `${cleaned}/prenota` : ''
  const warnLocal = Boolean(cleaned && isLocalHost(cleaned))
  const canUse = Boolean(cleaned && !warnLocal)

  useEffect(() => {
    if (!canUse || !target) {
      setDataUrl('')
      return
    }
    QRCode.toDataURL(target, {
      width: 320,
      margin: 2,
      color: { dark: '#062018', light: '#ecfeff' },
    }).then(setDataUrl)
  }, [canUse, target])

  return (
    <AppShell title={t('qrTitle')} subtitle={t('qrSub')}>
      <div className="qr-box stack">
        <label className="field" style={{ width: '100%', textAlign: 'left' }}>
          <span>{t('qrUrlLabel')}</span>
          <input
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value.trim())}
            placeholder="https://xxxx.vercel.app"
          />
        </label>
        {!cleaned && <p className="error">{t('qrNeedPublic')}</p>}
        {warnLocal && <p className="error">{t('qrLocalWarn')}</p>}
        {canUse && dataUrl ? (
          <img className="qr-img" src={dataUrl} alt="QR prenotazione CAVE" />
        ) : (
          <p className="body muted">{t('qrWaiting')}</p>
        )}
        {canUse && <p className="body muted qr-url">{target}</p>}
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
