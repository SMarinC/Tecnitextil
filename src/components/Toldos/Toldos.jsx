import styles from './Toldos.module.css'

const SERVICES = [
  'Instalación y puesta en marcha',
  'Reparación de averías',
  'Mantenimiento preventivo',
]

const FAMILIES = [
  {
    title: 'Con bandeja móvil',
    description:
      'Una bandeja con pinzas neumáticas desplaza el tejido bajo un cabezal fijo.',
    image: {
      src: '/img/toldos/bandeja-movil.webp',
      width: 800,
      height: 564,
      alt: 'Máquina automática de coser toldos con bandeja móvil cosiendo una lona',
    },
  },
  {
    title: 'Con cabezal móvil',
    description:
      'El paño queda fijo y tensado a lo largo de la mesa mientras el cabezal lo recorre sobre un carro.',
    image: {
      src: '/img/toldos/cabezal-movil.webp',
      width: 800,
      height: 450,
      alt: 'Estación de costura lineal con cabezal móvil para toldos',
    },
  },
  {
    title: 'Semiautomáticas con mesa de rodillos',
    description:
      'Dos agujas, triple arrastre y puller; la mesa de rodillos guía la lona hasta el cabezal.',
    image: {
      src: '/img/toldos/mesa-rodillos.webp',
      width: 750,
      height: 465,
      alt: 'Máquina de coser toldos de dos agujas con mesa de rodillos',
    },
  },
]

const COMPONENTS = [
  'Cabezal Dürkopp Adler 867',
  'PLC y pantalla táctil',
  'Sensores y fotocélulas',
  'Servomotores y drives',
  'Neumática y pinzas',
  'Carro, guías y bandeja',
]

const IMAGE_NOTE =
  'Imágenes de referencia de los fabricantes. TECNITEXTIL es un servicio técnico independiente y no está vinculado a las marcas mostradas.'

function Toldos() {
  return (
    <section className={styles.section} id="toldos">
      <div className={styles.inner}>
        <div className={styles.layout}>
          <div className={styles.textCol}>
            <p className={styles.eyebrow}>Servicio especializado</p>
            <h2 className={styles.heading}>
              Asistencia para máquinas de coser toldos automatizadas
            </h2>
            <p className={styles.intro}>
              Máquinas de coser toldos con bandejas, con cabezal móvil y
              semiautomáticas con mesa de rodillos. Las instalamos, reparamos y
              mantenemos en tu taller, tanto en la parte mecánica como en la
              electrónica.
            </p>
            <h3 className={styles.subheading}>Nuestro servicio</h3>
            <ul className={styles.serviceList} role="list">
              {SERVICES.map((service) => (
                <li className={styles.serviceItem} key={service}>
                  {service}
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.familiesCol}>
            <ul className={styles.familyList} role="list">
              {FAMILIES.map(({ title, description, image }) => (
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
            <h3 className={styles.subheading}>Qué intervenimos</h3>
            <ul className={styles.componentList} role="list">
              {COMPONENTS.map((component) => (
                <li className={styles.componentItem} key={component}>
                  {component}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className={styles.imageNote}>{IMAGE_NOTE}</p>
      </div>
    </section>
  )
}

export default Toldos
