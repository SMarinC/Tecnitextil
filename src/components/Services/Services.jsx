import styles from './Services.module.css'
import { SewingMachineIcon, FactoryIcon, TruckIcon } from '../icons/Icons.jsx'

const SERVICES = [
  {
    Icon: SewingMachineIcon,
    title: 'Reparación de máquinas de coser',
    description:
      'Diagnóstico y reparación de máquinas industriales y domésticas de cualquier marca o modelo.',
  },
  {
    Icon: FactoryIcon,
    title: 'Soporte a empresas textiles',
    description:
      'Mantenimiento y asistencia técnica para reducir paradas y mejorar tus tiempos de producción.',
  },
  {
    Icon: TruckIcon,
    title: 'Recogida a domicilio',
    description:
      'Recogemos tu máquina donde te venga bien y te la devolvemos lista para coser.',
  },
]

function Services() {
  return (
    <section className={styles.services}>
      <h2 className={styles.heading}>Qué hacemos</h2>
      <div className={styles.grid}>
        {SERVICES.map(({ Icon, title, description }) => (
          <article className={styles.card} key={title}>
            <Icon className={styles.cardIcon} />
            <h3 className={styles.cardTitle}>{title}</h3>
            <p className={styles.cardDescription}>{description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Services
