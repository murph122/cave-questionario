import { useLang } from '../i18n/LangContext'
import './PlaceholderNotice.css'

type Props = {
  compact?: boolean
}

export function PlaceholderNotice({ compact }: Props) {
  const { t } = useLang()
  return (
    <aside className={`placeholder-notice ${compact ? 'compact' : ''}`} role="note">
      <p>{t('placeholderIt')}</p>
      <p lang="en">{t('placeholderEn')}</p>
    </aside>
  )
}
