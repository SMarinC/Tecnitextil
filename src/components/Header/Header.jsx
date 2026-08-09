import styles from './Header.module.css'
import { buildWhatsAppUrl } from '../../constants/contact.js'
import { WhatsAppIcon } from '../icons/Icons.jsx'

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <img src="/logo.jpeg" alt="TECNITEXTIL" className={styles.logo} />
        <a
          href={buildWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.cta}
        >
          <WhatsAppIcon className={styles.ctaIcon} />
          WhatsApp
        </a>
      </div>
    </header>
  )
}

export default Header
