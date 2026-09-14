import styles from './Footer.module.css'
import { PHONE_DISPLAY, PHONE_TEL } from '../../content/contact.js'
import { PhoneIcon } from '../icons/Icons.jsx'
import { COMPANY } from '../../content/company.js'
import { FOOTER } from '../../content/home.js'
import { LEGAL_LINKS } from '../../content/legal.js'

function Footer() {
  return (
    <footer className={styles.footer}>
      <img
        src="/logo.png"
        alt={COMPANY.name}
        width="110"
        height="110"
        className={styles.logo}
      />
      <p className={styles.coverage}>{FOOTER.coverage}</p>
      <a href={PHONE_TEL} className={styles.phone}>
        <PhoneIcon className={styles.phoneIcon} />
        {PHONE_DISPLAY}
      </a>
      <nav className={styles.legalNav} aria-label="Información legal">
        {LEGAL_LINKS.map(({ label, href }) => (
          <a key={href} href={href} className={styles.legalLink}>
            {label}
          </a>
        ))}
      </nav>
      <p className={styles.copyright}>
        {/* The year is computed at build time; the browser may differ on New Year's Day. */}
        © <span suppressHydrationWarning>{new Date().getFullYear()}</span> {COMPANY.name}.
        Todos los derechos reservados.
      </p>
    </footer>
  )
}

export default Footer
