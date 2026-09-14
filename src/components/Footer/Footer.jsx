import styles from './Footer.module.css'
import { PHONE_DISPLAY, PHONE_TEL } from '../../content/contact.js'
import { PhoneIcon } from '../icons/Icons.jsx'
import { COMPANY } from '../../content/company.js'
import { FOOTER } from '../../content/home.js'

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
      <p className={styles.copyright}>
        © {new Date().getFullYear()} {COMPANY.name}. Todos los derechos
        reservados.
      </p>
    </footer>
  )
}

export default Footer
