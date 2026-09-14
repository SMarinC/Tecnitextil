import styles from './Hero.module.css'
import { SewingMachineIcon } from '../icons/Icons.jsx'
import { HERO } from '../../content/home.js'
import { SECTIONS } from '../../content/sections.js'

function Hero() {
  return (
    <section className={styles.hero} id={SECTIONS.about.id}>
      <div className={styles.inner}>
        <SewingMachineIcon className={styles.icon} />
        <h1 className={styles.title}>{HERO.title}</h1>
        {HERO.paragraphs.map((paragraph) => (
          <p className={styles.subtitle} key={paragraph}>
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  )
}

export default Hero
