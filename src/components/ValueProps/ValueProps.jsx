import styles from './ValueProps.module.css'
import { BadgeIcon, MapPinIcon, ClockIcon, TruckIcon } from '../icons/Icons.jsx'

const VALUE_PROPS = [
  { Icon: BadgeIcon, stat: '+20', label: 'años de experiencia' },
  { Icon: MapPinIcon, stat: 'Toda España', label: 'cobertura nacional' },
  { Icon: ClockIcon, stat: 'Máx. 1 día', label: 'tiempo de respuesta' },
  { Icon: TruckIcon, stat: 'A domicilio', label: 'recogida disponible' },
]

function ValueProps() {
  return (
    <section className={styles.section} id="por-que-elegirnos">
      <h2 className={styles.heading}>Por qué elegirnos</h2>
      <ul className={styles.list}>
        {VALUE_PROPS.map(({ Icon, stat, label }) => (
          <li className={styles.item} key={label}>
            <Icon className={styles.icon} />
            <span className={styles.stat}>{stat}</span>
            <span className={styles.label}>{label}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default ValueProps
