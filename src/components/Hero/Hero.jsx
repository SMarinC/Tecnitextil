import styles from './Hero.module.css'
import { buildWhatsAppUrl } from '../../constants/contact.js'
import { SewingMachineIcon } from '../icons/Icons.jsx'

function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        <SewingMachineIcon className={styles.icon} />
        <h1 className={styles.title}>
          +20 años reparando máquinas de coser, sin parar tu producción
        </h1>
        <p className={styles.subtitle}>
          Reparamos máquinas de coser industriales y domésticas de cualquier
          marca, con cobertura en toda España y recogida a domicilio.
        </p>
        <a
          href={buildWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.cta}
        >
          Escribir por WhatsApp
        </a>
      </div>
    </section>
  )
}

export default Hero
