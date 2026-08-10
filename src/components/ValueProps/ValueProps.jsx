import styles from './ValueProps.module.css'
import { BadgeIcon, MapPinIcon, ClockIcon, TruckIcon } from '../icons/Icons.jsx'

const VALUE_PROPS = [
  { Icon: BadgeIcon, label: '+20 años de experiencia' },
  { Icon: MapPinIcon, label: 'Cobertura en toda España' },
  { Icon: ClockIcon, label: 'Respuesta rápida por WhatsApp' },
  { Icon: TruckIcon, label: 'Recogida a domicilio incluida' },
]

function ValueProps() {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Por qué elegirnos</h2>
      <ul className={styles.list}>
        {VALUE_PROPS.map(({ Icon, label }) => (
          <li className={styles.item} key={label}>
            <Icon className={styles.icon} />
            <span>{label}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default ValueProps
