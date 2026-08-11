import { useEffect, useState } from 'react'
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
  const [activeHref, setActiveHref] = useState(null)

  useEffect(() => {
    const sections = NAV_ITEMS
      .map(({ href }) => document.querySelector(href))
      .filter(Boolean)

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((entry) => entry.isIntersecting)
        if (visibleEntry) {
          setActiveHref(`#${visibleEntry.target.id}`)
        }
      },
      { rootMargin: '-96px 0px -70% 0px', threshold: 0 },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  function handleNavClick(event, href) {
    event.preventDefault()
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setIsMenuOpen(false)
  }

  function linkClassName(href, base) {
    return href === activeHref ? `${base} ${styles.navLinkActive}` : base
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
              className={linkClassName(href, styles.navLink)}
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
              className={linkClassName(href, styles.mobileNavLink)}
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
