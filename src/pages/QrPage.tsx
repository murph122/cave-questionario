import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { AppShell } from '../components/AppShell'
import { useLang } from '../i18n/LangContext'
import './QrPage.css'

/** Fixed public URL for the QR (always include https://) */
export const PUBLIC_SITE_URL = 'https://cave-questionario.vercel.app'

export function QrPage() {
  const { t } = useLang()
  const [dataUrl, setDataUrl] = useState('')
  const [genError, setGenError] = useState('')

  // QR encodes the site home with https — never omit the scheme
  const target = PUBLIC_SITE_URL

  useEffect(() => {
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
  }, [target])

  return (
    <AppShell title={t('qrTitle')} subtitle={t('qrSub')}>
      <div className="qr-box stack">
        <p className="body">
          {t('qrFixedUrl')}
          <br />
          <strong className="qr-url">{target}</strong>
        </p>
        {genError && <p className="error">{genError}</p>}
        {dataUrl ? (
          <img className="qr-img" src={dataUrl} alt="QR CAVE Lab" />
        ) : (
          <p className="body muted">{t('qrWaiting')}</p>
        )}
        <p className="body muted">{t('qrHint')}</p>
        {dataUrl && (
          <a className="btn btn-primary" href={dataUrl} download="cave-lab-qr.png">
            {t('qrDownload')}
          </a>
        )}
      </div>
    </AppShell>
  )
}
