import styles from './Hero.module.css'
import { SewingMachineIcon } from '../icons/Icons.jsx'

function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        <SewingMachineIcon className={styles.icon} />
        <h1 className={styles.title}>Quiénes somos</h1>
        <p className={styles.subtitle}>
          En TECNITEXTIL llevamos más de 20 años trabajando con máquinas de
          coser. Lo que empezó como un taller dedicado a resolver averías se
          convirtió, con el tiempo, en un equipo técnico altamente capacitado
          y con experiencia real en cada tipo de máquina, marca y avería.
        </p>
        <p className={styles.subtitle}>
          Sabemos que detrás de cada máquina hay alguien que depende de ella
          para trabajar. Por eso combinamos eficiencia con un trato cercano:
          no solo reparamos, entendemos lo que significa para ti que tu
          máquina esté parada, y trabajamos con ese compromiso en cada
          intervención.
        </p>
      </div>
    </section>
  )
}

export default Hero
