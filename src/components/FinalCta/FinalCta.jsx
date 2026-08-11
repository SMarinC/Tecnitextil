import styles from './FinalCta.module.css'
import { buildWhatsAppUrl } from '../../constants/contact.js'

function FinalCta() {
  return (
    <section className={styles.section} id="contacto">
      <h2 className={styles.heading}>
        Todo para tu máquina de coser
      </h2>
      <p className={styles.subheading}>
        Reparación, mantenimiento y venta. Escríbenos y con gusto te ayudamos.
      </p>
      <a
        href={buildWhatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.cta}
      >
        Contáctanos
      </a>
    </section>
  )
}

export default FinalCta
