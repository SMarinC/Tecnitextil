import styles from './Services.module.css'
import { ICONS } from '../icons/iconRegistry.js'
import { SERVICES, REPAIR_PROCESS } from '../../content/home.js'
import { SECTIONS } from '../../content/sections.js'

function Services() {
  return (
    <section className={styles.services} id={SECTIONS.services.id}>
      <div className={styles.inner}>
        <div className={styles.layout}>
          <div className={styles.titleCol}>
            <h2 className={styles.heading}>{SERVICES.heading}</h2>
            <p className={styles.intro}>{SERVICES.intro}</p>
          </div>
          <div className={styles.itemsCol}>
            {SERVICES.items.map(({ icon, title, description }) => {
              const Icon = ICONS[icon]
              return (
                <article className={styles.card} key={title}>
                  <Icon className={styles.cardIcon} />
                  <h3 className={styles.cardTitle}>{title}</h3>
                  <p className={styles.cardDescription}>{description}</p>
                </article>
              )
            })}
          </div>
        </div>
      </div>
      <div className={styles.divider} />
      <div className={styles.inner}>
        <h3 className={styles.processHeading}>{REPAIR_PROCESS.heading}</h3>
        <p className={styles.processIntro}>{REPAIR_PROCESS.intro}</p>
        <ol className={styles.processSteps}>
          {REPAIR_PROCESS.steps.map(({ title, description }, index) => (
            <li className={styles.processStep} key={title}>
              <span className={styles.processNumber}>{index + 1}</span>
              <div className={styles.processStepText}>
                <h4 className={styles.processStepTitle}>{title}</h4>
                <p className={styles.processStepDescription}>{description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export default Services
