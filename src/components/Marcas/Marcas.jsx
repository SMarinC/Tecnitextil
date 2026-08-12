import styles from './Marcas.module.css'

const BRANDS = [
  'Juki',
  'Brother',
  'Singer',
  'Alfa',
  'Pfaff',
  'Durkopp Adler',
  'Consew',
  'Seiko',
  'Typical',
  'Siruba',
  'Rimoldi',
  'Pegasus',
  'Jack',
]

function Marcas() {
  return (
    <section className={styles.section} id="marcas">
      <div className={styles.inner}>
        <h2 className={styles.heading}>
          Reparamos maquinaria industrial de distintas marcas y generaciones
        </h2>
        <p className={styles.text}>
          Trabajamos con maquinaria industrial habitual en talleres y
          entornos textiles: máquinas de costura de las marcas más
          utilizadas del sector, además de cortadoras, mesas de vacío,
          remachadoras y equipos auxiliares de diferentes fabricantes.
        </p>
        <p className={styles.text}>
          Si tienes dudas sobre tu equipo, indícanos marca, modelo, tipo de
          material que trabaja y síntoma principal. Esto nos ayuda a
          orientar mejor la intervención técnica.
        </p>
        <ul className={styles.brandList}>
          {BRANDS.map((brand) => (
            <li className={styles.brand} key={brand}>
              {brand}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default Marcas
