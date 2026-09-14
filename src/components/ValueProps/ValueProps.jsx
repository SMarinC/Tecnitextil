import styles from './ValueProps.module.css'
import { ICONS } from '../icons/iconRegistry.js'
import { VALUE_PROPS } from '../../content/home.js'
import { SECTIONS } from '../../content/sections.js'

function ValueProps() {
  return (
    <section className={styles.section} id={SECTIONS.valueProps.id}>
      <h2 className={styles.heading}>{VALUE_PROPS.heading}</h2>
      <ul className={styles.list}>
        {VALUE_PROPS.items.map(({ icon, stat, label }) => {
          const Icon = ICONS[icon]
          return (
            <li className={styles.item} key={label}>
              <Icon className={styles.icon} />
              <span className={styles.stat}>{stat}</span>
              <span className={styles.label}>{label}</span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default ValueProps
