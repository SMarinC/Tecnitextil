import styles from './WhatsAppCta.module.css'
import { buildWhatsAppUrl } from '../../content/contact.js'
import { WhatsAppIcon } from '../icons/Icons.jsx'

const VARIANT_CLASS = {
  header: styles.header,
  primary: styles.primary,
  floating: styles.floating,
}

// Single component for every "start a WhatsApp chat" link on the site, so the
// URL, security attributes and icon can never drift apart between placements.
// `floating` is icon-only: `label` becomes its accessible name.
function WhatsAppCta({ variant, label }) {
  const iconOnly = variant === 'floating'
  return (
    <a
      href={buildWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      className={VARIANT_CLASS[variant]}
      aria-label={iconOnly ? label : undefined}
    >
      <WhatsAppIcon className={styles.icon} />
      {iconOnly ? null : label}
    </a>
  )
}

export default WhatsAppCta
