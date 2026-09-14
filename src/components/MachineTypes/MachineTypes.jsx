import styles from './MachineTypes.module.css'
import { ICONS } from '../icons/iconRegistry.js'
import { MACHINE_TYPES } from '../../content/home.js'
import { SECTIONS } from '../../content/sections.js'

function MachineTypes() {
  return (
    <section className={styles.section} id={SECTIONS.machineTypes.id}>
      <div className={styles.inner}>
        <div className={styles.layout}>
          <div className={styles.titleCol}>
            <h2 className={styles.heading}>{MACHINE_TYPES.heading}</h2>
            <p className={styles.intro}>{MACHINE_TYPES.intro}</p>
          </div>
          <ul className={styles.itemsCol}>
            {MACHINE_TYPES.items.map(({ icon, title, description }) => {
              const Icon = ICONS[icon]
              return (
                <li className={styles.item} key={title}>
                  <span className={styles.iconBadge}>
                    <Icon className={styles.icon} />
                  </span>
                  <div className={styles.itemText}>
                    <h3 className={styles.itemTitle}>{title}</h3>
                    <p className={styles.itemDescription}>{description}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default MachineTypes
