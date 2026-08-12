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

const PROCESS_STEPS = [
  {
    number: '1',
    title: 'Diagnóstico',
    description:
      'Evaluamos el estado general del equipo y detectamos qué está afectando su funcionamiento.',
  },
  {
    number: '2',
    title: 'Ajuste de máquinas',
    description:
      'Ajustamos la maquinaria de costura, corte y equipos auxiliares del taller.',
  },
  {
    number: '3',
    title: 'Revisión mecánica',
    description:
      'Revisamos los componentes mecánicos que se desgastan con el uso intensivo.',
  },
  {
    number: '4',
    title: 'Limpieza y sistemas auxiliares',
    description:
      'Revisamos y limpiamos los sistemas auxiliares y las zonas que suelen acumular suciedad y provocar fallos.',
  },
  {
    number: '5',
    title: 'Prueba final',
    description:
      'Comprobamos el resultado con el material de trabajo, verificando fuerza y precisión.',
  },
]

function Services() {
  return (
    <section className={styles.services} id="que-hacemos">
      <div className={styles.inner}>
        <div className={styles.layout}>
          <div className={styles.titleCol}>
            <h2 className={styles.heading}>Qué hacemos</h2>
          </div>
          <div className={styles.itemsCol}>
            {SERVICES.map(({ Icon, title, description }) => (
              <article className={styles.card} key={title}>
                <Icon className={styles.cardIcon} />
                <h3 className={styles.cardTitle}>{title}</h3>
                <p className={styles.cardDescription}>{description}</p>
              </article>
            ))}
          </div>
        </div>
        <h3 className={styles.processHeading}>
          ¿Cómo es el proceso de reparación y mantenimiento?
        </h3>
        <p className={styles.processIntro}>
          Un servicio adaptado a las necesidades de cada cliente, en el que
          revisamos y prevenimos averías en maquinaria de producción, corte,
          tapicería y confección.
        </p>
        <ol className={styles.processSteps}>
          {PROCESS_STEPS.map(({ number, title, description }) => (
            <li className={styles.processStep} key={number}>
              <span className={styles.processNumber}>{number}</span>
              <h4 className={styles.processStepTitle}>{title}</h4>
              <p className={styles.processStepDescription}>{description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export default Services
