import { useState } from 'react'
import styles from './Header.module.css'
import { NAV_ITEMS } from '../../content/sections.js'
import { COMPANY } from '../../content/company.js'
import { WHATSAPP_CTA } from '../../content/home.js'
import { MenuIcon, CloseIcon } from '../icons/Icons.jsx'
import WhatsAppCta from '../WhatsAppCta/WhatsAppCta.jsx'
import { useActiveSection } from '../../hooks/useActiveSection.js'
import { useMediaQueryChange } from '../../hooks/useMediaQueryChange.js'
import { scrollToSection } from '../../lib/scrollToSection.js'

const NAV_HREFS = NAV_ITEMS.map(({ href }) => href)

// Must match the @media (min-width: 1140px) breakpoint in Header.module.css
// where the mobile hamburger panel gives way to the desktop nav. With 6 nav
// items the logo, links and WhatsApp CTA need to fit inside the 24px container
// padding with the self-hosted Oswald and with its fallback fonts (measured:
// 1140px leaves ≥8px of slack for Oswald, Arial Narrow and generic sans-serif).
// The nav gap shrinks with the viewport (see .nav) to keep that width as low
// as possible.
const DESKTOP_BREAKPOINT_QUERY = '(min-width: 1140px)'

// Top inset matches --header-offset (128px, see tokens.css) — the same
// boundary sections scroll to under scroll-margin-top — so a section only
// counts as "visible" once it has actually cleared the sticky header.
const ACTIVE_SECTION_ROOT_MARGIN = '-128px 0px -70% 0px'

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const activeHref = useActiveSection(NAV_HREFS, { rootMargin: ACTIVE_SECTION_ROOT_MARGIN })

  useMediaQueryChange(DESKTOP_BREAKPOINT_QUERY, (isDesktop) => {
    if (isDesktop) setIsMenuOpen(false)
  })

  function handleNavClick(event, href) {
    event.preventDefault()
    setIsMenuOpen(false)
    requestAnimationFrame(() => scrollToSection(href))
  }

  function linkClassName(href, base) {
    return href === activeHref ? `${base} ${styles.navLinkActive}` : base
  }

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <img
          src={COMPANY.logo.src}
          alt={COMPANY.name}
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
          <WhatsAppCta variant="header" label={WHATSAPP_CTA.headerLabel} />
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
