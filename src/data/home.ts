// Copy of the home page: hero, value props, section cards, reviews and about, in reading
// order.
import type { IconName } from '../components/Icon/icons'
import { COMPANY } from './company'
import { AWNINGS_PAGE, CATALOG_PAGE, TECHNICAL_SERVICE_PAGE } from './pages'
import { WHATSAPP_CTA } from './site'

export const HERO: { title: string; tagline: string; ctaLabel: string } = {
  title: 'Reparación y mantenimiento de maquinaria textil',
  tagline: `Máquinas de coser industriales y de toldos automatizadas, corte y confección. En ${COMPANY.region} y ${COMPANY.coverage}, con más de ${COMPANY.yearsOfExperience} años de experiencia.`,
  ctaLabel: WHATSAPP_CTA.primaryLabel,
}

// Real Google reviews of the business, copied word for word, typos included (user
// decision, 2026-11-17), with the reviewer's first name and initial only. All 36 were
// 5 stars on 2026-11-17; the summary says "más de 35" so it stays true as reviews are
// added. No dates: the site is static and "hace 2 meses" would go stale. No
// AggregateRating structured data: Google ignores ratings a business publishes about itself.
export const REVIEWS: {
  heading: string
  summary: string
  source: string
  carouselLabel: string
  previousLabel: string
  nextLabel: string
  linkLabel: string
  href: string
  items: { author: string; text: string }[]
} = {
  heading: 'Lo que dicen nuestros clientes',
  summary: '5,0 en Google, con más de 35 opiniones',
  source: 'Reseña de Google',
  carouselLabel: 'Reseñas de clientes',
  previousLabel: 'Reseñas anteriores',
  nextLabel: 'Reseñas siguientes',
  linkLabel: 'Ver todas las opiniones en Google',
  href: 'https://share.google/k48nFyeW6XvD0SVcJ',
  items: [
    {
      author: 'Carmen R.',
      text: 'Ha sido una experiencia estupenda. El trato ha sido excelente, muy amable y profesional. Me ha arreglado la maquina de coser en tan sólo dos días, con mucha rapidez y puntualidad. Además, me lo ha explicado todo perfectamente y se ha preocupado de que todo quedara bien. Estoy encantada con el servicio y sin duda lo recomiendo al 100%',
    },
    {
      author: 'Josep P.',
      text: 'Hace unos dias, que Mario me reparó una maquina de coser Triple arrastre JUKI, la verdad es que he quedado super satisfecho de la reparación y del trato recibido,super atento y muy servicial !!',
    },
    {
      author: 'Vicky R.',
      text: 'Mario es un gran profesional, puesta de apunto de 4 máquinas, que estaban en desuso y ahora van de maravilla. Vino a nuestro sede social y en una tarde nos lo solucionó y explicó como mantener y hacer un buen uso de ellas. No dudaremos en contactar con el para el mantenimiento de todas las máquinas. 100%recomendable.',
    },
    {
      author: 'Iluminada G.',
      text: 'Muy formal, llama para confirmar la cita y es puntual. Gran profesional, reparación y puesta a punto de dos máquinas que ha dejado perfectas, como nuevas. Muchas gracias, ya le he recomendado',
    },
    {
      author: 'Kendra G.',
      text: 'Contacte con el Sr. MARIO para reparar mi maquina de coser. En lo que tros talleres te dicen que hay que esperar semanas el acudio en dos dias y me quedo mi máquina arreglada. Quede contenta Es muy profesional. Yo lo recomiendo.',
    },
    {
      author: 'Tere C.',
      text: 'Servicio excelente y muy rápido. Me informó de lo que le pasaba a la máquina y del presupuesto de reparación con antelación y reparada antes de lo previsto.',
    },
    {
      author: 'Salome M.',
      text: 'Mario es un buen profesional, cumplidor, muy atento y nos puso las tres máquinas de coser ( una refrey transformar, una alfamàtic y una brother portátil) muy bien ajustadas. Nos facilitó los recambios necesarios. Con una tuvimos un pequeño problema y volvió al día siguiente a acabar de ajustar. 100% recomendable.',
    },
    {
      author: 'Clara R.',
      text: 'Mi madre hacía mucho tipo que tenía la máquina estropeada y nadie le sabía arreglar. Vino Mario, se llevó una pieza y al día siguiente la montó nueva y la máquina ya funciona. Una persona muy atenta y miy profesional. Muchas gracias',
    },
  ],
}

export const ABOUT: { heading: string; paragraphs: string[] } = {
  heading: 'Quiénes somos',
  paragraphs: [
    `${COMPANY.name} es una empresa que lleva más de ${COMPANY.yearsOfExperience} años trabajando con maquinaria textil e industrial: máquinas de coser, equipos de corte, confección y equipos auxiliares. Lo que empezó como un taller dedicado a resolver averías se convirtió, con el tiempo, en un equipo técnico altamente capacitado y con experiencia real en cada tipo de máquina, marca y avería.`,
    'Sabemos que detrás de cada máquina hay alguien que depende de ella para trabajar. Por eso combinamos eficiencia con un trato cercano: no solo reparamos, entendemos lo que significa para ti que tu máquina esté parada, y trabajamos con ese compromiso en cada intervención.',
  ],
}

export const SECTION_CARDS: {
  heading: string
  moreLabel: string
  items: { title: string; description: string; href: string }[]
} = {
  heading: 'Qué necesitas',
  moreLabel: 'Ver más',
  items: [
    {
      title: 'Servicio técnico',
      description:
        'Reparación y mantenimiento de máquinas de coser, de corte y equipos auxiliares, de cualquier marca.',
      href: TECHNICAL_SERVICE_PAGE.path,
    },
    {
      title: 'Toldos',
      description:
        'Instalación, reparación y mantenimiento de máquinas de coser toldos automatizadas.',
      href: AWNINGS_PAGE.path,
    },
    {
      title: 'Venta de máquinas',
      description:
        'Máquinas de coser industriales JACK: pespunte, remalladoras, ojales, botones y presillas. Precio y disponibilidad por WhatsApp.',
      href: CATALOG_PAGE.path,
    },
  ],
}

export const VALUE_PROPS: {
  heading: string
  items: { icon: IconName; stat: string; label: string }[]
} = {
  heading: 'Por qué elegirnos',
  items: [
    { icon: 'badge', stat: `+${COMPANY.yearsOfExperience}`, label: 'años de experiencia' },
    { icon: 'mapPin', stat: 'Toda España', label: 'cobertura nacional' },
    { icon: 'clock', stat: 'Máx. 1 día', label: 'tiempo de respuesta' },
    { icon: 'truck', stat: 'A domicilio', label: 'recogida disponible' },
  ],
}
