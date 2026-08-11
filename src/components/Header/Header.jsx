import styles from './Header.module.css'
import { buildWhatsAppUrl } from '../../constants/contact.js'
import { WhatsAppIcon } from '../icons/Icons.jsx'

const NAV_ITEMS = [
  { label: 'Qué hacemos', href: '#que-hacemos' },
  { label: 'Por qué elegirnos', href: '#por-que-elegirnos' },
  { label: 'Cómo funciona', href: '#como-funciona' },
  { label: 'Contáctanos', href: '#contacto' },
]

function handleNavClick(event, href) {
  event.preventDefault()
  document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <img
          src="/logo.jpeg"
          alt="TECNITEXTIL"
          width="100"
          height="100"
          className={styles.logo}
        />
        <nav className={styles.nav} aria-label="Navegación principal">
          {NAV_ITEMS.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              onClick={(event) => handleNavClick(event, href)}
              className={styles.navLink}
            >
              {label}
            </a>
          ))}
        </nav>
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
