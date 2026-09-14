import styles from './FinalCta.module.css'
import { buildWhatsAppUrl } from '../../content/contact.js'
import { WhatsAppIcon } from '../icons/Icons.jsx'
import { FINAL_CTA } from '../../content/home.js'
import { SECTIONS } from '../../content/sections.js'

function FinalCta() {
  return (
    <section className={styles.section} id={SECTIONS.contact.id}>
      <h2 className={styles.heading}>{FINAL_CTA.heading}</h2>
      <p className={styles.subheading}>{FINAL_CTA.subheading}</p>
      <a
        href={buildWhatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.cta}
      >
        <WhatsAppIcon className={styles.ctaIcon} />
        {FINAL_CTA.ctaLabel}
      </a>
    </section>
  )
}

export default FinalCta
