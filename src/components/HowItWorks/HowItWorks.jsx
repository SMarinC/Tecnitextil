import styles from './HowItWorks.module.css'

const STEPS = [
  {
    number: '1',
    title: 'Escríbenos por WhatsApp',
    description: 'Cuéntanos qué avería tiene tu equipo.',
  },
  {
    number: '2',
    title: 'Recogemos tu equipo o visitamos tu taller',
    description:
      'Recogemos tu máquina en la puerta de tu domicilio, o coordinamos una visita técnica si el equipo es industrial o no se puede trasladar.',
  },
  {
    number: '3',
    title: 'Reparamos y lo dejamos listo',
    description:
      'Te lo entregamos, o lo dejamos funcionando en tu taller, listo para volver a producir.',
  },
]

function HowItWorks() {
  return (
    <section className={styles.section} id="como-funciona">
      <div className={styles.inner}>
        <h2 className={styles.heading}>Cómo funciona</h2>
        <ol className={styles.steps}>
          {STEPS.map(({ number, title, description }) => (
            <li className={styles.step} key={number}>
              <span className={styles.number}>{number}</span>
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
