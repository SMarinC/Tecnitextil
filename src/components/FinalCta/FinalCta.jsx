import styles from './FinalCta.module.css'
import WhatsAppCta from '../WhatsAppCta/WhatsAppCta.jsx'
import { FINAL_CTA } from '../../content/home.js'
import { SECTIONS } from '../../content/sections.js'

function FinalCta() {
  return (
    <section className={styles.section} id={SECTIONS.contact.id}>
      <h2 className={styles.heading}>{FINAL_CTA.heading}</h2>
      <p className={styles.subheading}>{FINAL_CTA.subheading}</p>
      <WhatsAppCta variant="primary" label={FINAL_CTA.ctaLabel} />
    </section>
  )
}

export default FinalCta
