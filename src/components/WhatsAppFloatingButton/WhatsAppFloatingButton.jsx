import styles from './WhatsAppFloatingButton.module.css'
import { buildWhatsAppUrl } from '../../constants/contact.js'
import { WhatsAppIcon } from '../icons/Icons.jsx'

function WhatsAppFloatingButton() {
  return (
    <a
      href={buildWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.button}
      aria-label="Escribir por WhatsApp"
    >
      <WhatsAppIcon className={styles.icon} />
    </a>
  )
}

export default WhatsAppFloatingButton
