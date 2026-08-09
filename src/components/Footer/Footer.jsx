import styles from './Footer.module.css'

const PHONE_DISPLAY = '+34 685 01 80 86'
const PHONE_TEL = 'tel:+34685018086'

function Footer() {
  return (
    <footer className={styles.footer}>
      <img src="/logo.jpeg" alt="TECNITEXTIL" className={styles.logo} />
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
