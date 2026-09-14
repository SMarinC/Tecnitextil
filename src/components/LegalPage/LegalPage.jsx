import styles from './LegalPage.module.css'
import Footer from '../Footer/Footer.jsx'
import WhatsAppCta from '../WhatsAppCta/WhatsAppCta.jsx'
import { COMPANY } from '../../content/company.js'
import { WHATSAPP_CTA } from '../../content/home.js'
import { LAST_UPDATED, PENDING, hasPendingLegalData } from '../../content/legal.js'

// Shared layout for the legal notice and privacy policy pages.
function LegalPage({ page }) {
  return (
    <>
      <header className={styles.header}>
        <a href="/" className={styles.homeLink}>
          <img src="/logo.png" alt={COMPANY.name} width="64" height="64" className={styles.logo} />
          <span>Volver al inicio</span>
        </a>
      </header>
      <main className={styles.main}>
        <article className={styles.article}>
          <h1 className={styles.title}>{page.title}</h1>
          {hasPendingLegalData ? (
            <p className={styles.pendingNotice} role="note">
              Borrador: faltan datos del titular marcados como “{PENDING}”.
            </p>
          ) : null}

          <section className={styles.section} aria-labelledby="titular">
            <h2 id="titular" className={styles.heading}>
              Datos del titular
            </h2>
            <dl className={styles.details}>
              {page.details.map(({ label, value }) => (
                <div className={styles.detail} key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          {page.sections.map(({ heading, paragraphs }) => (
            <section className={styles.section} key={heading}>
              <h2 className={styles.heading}>{heading}</h2>
              {paragraphs.map((paragraph) => (
                <p className={styles.paragraph} key={paragraph}>
                  {paragraph}
                </p>
              ))}
            </section>
          ))}

          <p className={styles.updated}>Última actualización: {LAST_UPDATED ?? PENDING}</p>
        </article>
      </main>
      <Footer />
      <WhatsAppCta variant="floating" label={WHATSAPP_CTA.floatingLabel} />
    </>
  )
}

export default LegalPage
