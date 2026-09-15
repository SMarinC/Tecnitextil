import styles from './Toldos.module.css'
import { TOLDOS } from '../../content/home.js'
import { SECTIONS } from '../../content/sections.js'

function Toldos() {
  return (
    <section className={styles.section} id={SECTIONS.toldos.id}>
      <div className={styles.inner}>
        <div className={styles.layout}>
          <div className={styles.textCol}>
            <p className={styles.eyebrow}>{TOLDOS.eyebrow}</p>
            <h2 className={styles.heading}>{TOLDOS.heading}</h2>
            <p className={styles.intro}>{TOLDOS.intro}</p>
            <h3 className={styles.subheading}>{TOLDOS.services.heading}</h3>
            <ul className={styles.serviceList} role="list">
              {TOLDOS.services.items.map((service) => (
                <li className={styles.serviceItem} key={service}>
                  {service}
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.familiesCol}>
            <ul className={styles.familyList} role="list">
              {TOLDOS.families.map(({ title, description, image }) => (
                <li className={styles.family} key={title}>
                  <img
                    className={styles.familyImage}
                    src={image.src}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    loading="lazy"
                    decoding="async"
                  />
                  <div className={styles.familyText}>
                    <h3 className={styles.familyTitle}>{title}</h3>
                    <p className={styles.familyDescription}>{description}</p>
                  </div>
                </li>
              ))}
            </ul>
            <h3 className={styles.subheading}>{TOLDOS.components.heading}</h3>
            <ul className={styles.componentList} role="list">
              {TOLDOS.components.items.map((component) => (
                <li className={styles.componentItem} key={component}>
                  {component}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className={styles.imageNote}>{TOLDOS.imageNote}</p>
      </div>
    </section>
  )
}

export default Toldos
