import styles from './FinalCta.module.css'
import { buildWhatsAppUrl } from '../../constants/contact.js'

function FinalCta() {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>
        ¿Tu máquina de coser necesita reparación?
      </h2>
      <p className={styles.subheading}>
        Escríbenos ahora y te respondemos por WhatsApp.
      </p>
      <a
        href={buildWhatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.cta}
      >
        Escribir por WhatsApp
      </a>
    </section>
  )
}

export default FinalCta
