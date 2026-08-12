import styles from './Services.module.css'
import { SewingMachineIcon, FactoryIcon, ClipboardCheckIcon } from '../icons/Icons.jsx'

const SERVICES = [
  {
    Icon: SewingMachineIcon,
    title: 'Mantenimiento, venta y reparación',
    description:
      'Servicio integral de máquinas de coser industriales y domésticas.',
  },
  {
    Icon: FactoryIcon,
    title: 'Soporte a empresas textiles',
    description:
      'Mantenimiento y asistencia técnica para reducir paradas y mejorar tus tiempos de producción.',
  },
  {
    Icon: ClipboardCheckIcon,
    title: 'Asesoría técnica',
    description:
      'Diagnóstico ante fallas comunes y cómo prevenirlas para que no se repitan.',
  },
]

function Services() {
  return (
    <section className={styles.services} id="que-hacemos">
      <div className={styles.inner}>
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
      </div>
    </section>
  )
}

export default Services
