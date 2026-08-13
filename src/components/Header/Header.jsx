import { useEffect, useState } from 'react'
import styles from './Header.module.css'
import { buildWhatsAppUrl } from '../../constants/contact.js'
import { WhatsAppIcon, MenuIcon, CloseIcon } from '../icons/Icons.jsx'

const NAV_ITEMS = [
  { label: 'Qué hacemos', href: '#que-hacemos' },
  { label: 'Máquinas y marcas', href: '#tipos-de-maquina' },
  { label: 'Por qué elegirnos', href: '#por-que-elegirnos' },
  { label: 'Cómo es el servicio', href: '#como-es-el-servicio' },
  { label: 'Contáctanos', href: '#contacto' },
]

// Must match the @media (min-width: 960px) breakpoint in Header.module.css
// where the mobile hamburger panel gives way to the desktop nav. Raised from
// 768px to 960px because 5 nav items + logo + WhatsApp CTA need ~900px of
// horizontal space — below that the CTA overflows off-screen (verified in
// browser: 131px overflow at 768px, CTA fully invisible).
const DESKTOP_BREAKPOINT_QUERY = '(min-width: 960px)'

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeHref, setActiveHref] = useState(null)

  useEffect(() => {
    const desktopQuery = window.matchMedia(DESKTOP_BREAKPOINT_QUERY)
    function closeMenuOnDesktop(event) {
      if (event.matches) setIsMenuOpen(false)
    }
    desktopQuery.addEventListener('change', closeMenuOnDesktop)
    return () => desktopQuery.removeEventListener('change', closeMenuOnDesktop)
  }, [])

  useEffect(() => {
    const sections = NAV_ITEMS
      .map(({ href }) => document.querySelector(href))
      .filter(Boolean)

    const visibleHrefs = new Set()
    const lastHref = NAV_ITEMS[NAV_ITEMS.length - 1].href

    // On tall viewports the trigger band below can't reach the last section
    // (its content plus the footer don't add up to enough scrollable height
    // for the band to ever slide into it), so the observer alone can never
    // mark the last nav item active there. Treat "scrolled to the bottom of
    // the page" as an explicit override for that case.
    function isAtPageBottom() {
      return window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
    }

    function updateActiveHref() {
      if (isAtPageBottom()) {
        setActiveHref(lastHref)
        return
      }
      // When multiple sections intersect the trigger band at once (common
      // near the bottom of a short page), prefer the last one in reading
      // order — the section the user has most recently scrolled into.
      const current = [...NAV_ITEMS].reverse().find((item) => visibleHrefs.has(item.href))
      setActiveHref(current ? current.href : null)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const href = `#${entry.target.id}`
          if (entry.isIntersecting) {
            visibleHrefs.add(href)
          } else {
            visibleHrefs.delete(href)
          }
        })
        updateActiveHref()
      },
      // Top inset matches --header-offset (128px, see tokens.css) — the same
      // boundary sections scroll to under scroll-margin-top — so a section
      // only counts as "visible" once it has actually cleared the sticky
      // header, not ~20px before (the header's real rendered height).
      { rootMargin: '-128px 0px -70% 0px', threshold: 0 },
    )

    sections.forEach((section) => observer.observe(section))

    // Secondary, lightweight fallback only — re-checks the bottom-of-page
    // condition so the last nav item can still activate on tall viewports
    // where the observer's trigger band never reaches that section. The
    // IntersectionObserver above remains the primary tracking mechanism for
    // everything else.
    window.addEventListener('scroll', updateActiveHref, { passive: true })
    window.addEventListener('resize', updateActiveHref)

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', updateActiveHref)
      window.removeEventListener('resize', updateActiveHref)
    }
  }, [])

  function handleNavClick(event, href) {
    event.preventDefault()
    setIsMenuOpen(false)
    requestAnimationFrame(() => {
      const target = document.querySelector(href)
      if (!target) return
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      // preventDefault() above suppressed the browser's native fragment
      // navigation, which normally moves focus to the target on activation.
      // Restore that behavior explicitly so keyboard/screen-reader users
      // land in the section they just navigated to, not stranded in the
      // header. tabindex="-1" makes the section script-focusable without
      // adding it to the normal Tab order; preventScroll avoids a second,
      // competing scroll jump since we already scrolled it into view.
      target.setAttribute('tabindex', '-1')
      target.focus({ preventScroll: true })
      target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true })
    })
  }

  function linkClassName(href, base) {
    return href === activeHref ? `${base} ${styles.navLinkActive}` : base
  }

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <img
          src="/logo.png"
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
