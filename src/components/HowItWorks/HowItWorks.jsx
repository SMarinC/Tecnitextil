import styles from './HowItWorks.module.css'
import { HOW_IT_WORKS } from '../../content/home.js'
import { SECTIONS } from '../../content/sections.js'

function HowItWorks() {
  return (
    <section className={styles.section} id={SECTIONS.howItWorks.id}>
      <div className={styles.inner}>
        <h2 className={styles.heading}>{HOW_IT_WORKS.heading}</h2>
        <ol className={styles.steps}>
          {HOW_IT_WORKS.steps.map(({ title, description }, index) => (
            <li className={styles.step} key={title}>
              <span className={styles.number}>{index + 1}</span>
              <h3 className={styles.stepTitle}>{title}</h3>
              <p className={styles.stepDescription}>{description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export default HowItWorks
