import styles from './Marcas.module.css'
import { BRANDS } from '../../content/home.js'
import { SECTIONS } from '../../content/sections.js'

function Marcas() {
  return (
    <section className={styles.section} id={SECTIONS.brands.id}>
      <div className={styles.inner}>
        <h2 className={styles.heading}>{BRANDS.heading}</h2>
        {BRANDS.paragraphs.map((paragraph) => (
          <p className={styles.text} key={paragraph}>
            {paragraph}
          </p>
        ))}
        <ul className={styles.brandList}>
          {BRANDS.featured.map((brand) => (
            <li className={styles.brand} key={brand}>
              {brand}
            </li>
          ))}
        </ul>
        <p className={styles.otherBrands}>{BRANDS.others}</p>
      </div>
    </section>
  )
}

export default Marcas
