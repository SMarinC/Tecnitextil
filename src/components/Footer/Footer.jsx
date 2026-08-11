import styles from './Footer.module.css'
import { PHONE_DISPLAY, PHONE_TEL } from '../../constants/contact.js'

function Footer() {
  return (
    <footer className={styles.footer}>
      <img
        src="/logo.jpeg"
        alt="TECNITEXTIL"
        width="110"
        height="110"
        className={styles.logo}
      />
      <p className={styles.coverage}>Servicio en toda España</p>
      <a href={PHONE_TEL} className={styles.phone}>
        {PHONE_DISPLAY}
      </a>
      <p className={styles.copyright}>
        © {new Date().getFullYear()} TECNITEXTIL. Todos los derechos
        reservados.
      </p>
    </footer>
  )
}

export default Footer
