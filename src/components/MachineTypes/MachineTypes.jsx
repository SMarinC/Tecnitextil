import styles from './MachineTypes.module.css'
import { SewingMachineIcon, ScissorsIcon, GearIcon } from '../icons/Icons.jsx'

const MACHINE_TYPES = [
  {
    Icon: SewingMachineIcon,
    title: 'Costura industrial',
    description:
      'Máquinas planas, de triple arrastre, remalladoras, recubridoras y otros equipos de confección que necesitan estar siempre a punto.',
  },
  {
    Icon: ScissorsIcon,
    title: 'Corte textil',
    description: 'Distintos tipos de cortadoras para materias primas.',
  },
  {
    Icon: GearIcon,
    title: 'Equipos auxiliares',
    description:
      'Cortadoras automáticas, mesas de aspiración, entre otros complementos de tu proceso.',
  },
]

function MachineTypes() {
  return (
    <section className={styles.section} id="tipos-de-maquina">
      <div className={styles.inner}>
        <div className={styles.layout}>
          <div className={styles.titleCol}>
            <h2 className={styles.heading}>Tipos de máquina</h2>
            <p className={styles.intro}>
              Trabajamos con equipos de corte, confección, tapicería y
              acabados — cada uno con un ajuste distinto según el material y
              el ritmo de trabajo.
            </p>
          </div>
          <ul className={styles.itemsCol}>
            {MACHINE_TYPES.map(({ Icon, title, description }) => (
              <li className={styles.item} key={title}>
                <Icon className={styles.icon} />
                <h3 className={styles.itemTitle}>{title}</h3>
                <p className={styles.itemDescription}>{description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default MachineTypes
