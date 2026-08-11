import { useState } from 'react'
import styles from './Header.module.css'
import { buildWhatsAppUrl } from '../../constants/contact.js'
import { WhatsAppIcon, MenuIcon, CloseIcon } from '../icons/Icons.jsx'

const NAV_ITEMS = [
  { label: 'Qué hacemos', href: '#que-hacemos' },
  { label: 'Por qué elegirnos', href: '#por-que-elegirnos' },
  { label: 'Cómo funciona', href: '#como-funciona' },
  { label: 'Contáctanos', href: '#contacto' },
]

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  function handleNavClick(event, href) {
    event.preventDefault()
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setIsMenuOpen(false)
  }

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
        <div className={styles.actions}>
          <a
            href={buildWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.cta}
          >
            <WhatsAppIcon className={styles.ctaIcon} />
            WhatsApp
          </a>
          <button
            type="button"
            className={styles.menuToggle}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav-panel"
            aria-label={isMenuOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            {isMenuOpen ? (
              <CloseIcon className={styles.menuIcon} />
            ) : (
              <MenuIcon className={styles.menuIcon} />
            )}
          </button>
        </div>
      </div>
      {isMenuOpen ? (
        <nav id="mobile-nav-panel" className={styles.mobileNav} aria-label="Navegación móvil">
          {NAV_ITEMS.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              onClick={(event) => handleNavClick(event, href)}
              className={styles.mobileNavLink}
            >
              {label}
            </a>
          ))}
        </nav>
      ) : null}
    </header>
  )
}

export default Header
