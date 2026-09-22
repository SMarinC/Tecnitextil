// Copy of the home page: hero, section cards and value props, in reading order.
import type { IconName } from '../components/Icon/icons'
import { COMPANY } from './company'
import { AWNINGS_PAGE, CATALOG_PAGE, TECHNICAL_SERVICE_PAGE } from './pages'
import { WHATSAPP_CTA } from './site'

export const HERO: {
  title: string
  tagline: string
  ctaLabel: string
  aboutHeading: string
  paragraphs: string[]
} = {
  title: 'Reparación y mantenimiento de maquinaria textil',
  tagline: `Máquinas de coser industriales y de toldos automatizadas, corte y confección. En ${COMPANY.coverage}, con más de ${COMPANY.yearsOfExperience} años de experiencia.`,
  ctaLabel: WHATSAPP_CTA.primaryLabel,
  aboutHeading: 'Quiénes somos',
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
        'Máquinas de coser industriales JACK de ojales, botones y presillas. Precio y disponibilidad por WhatsApp.',
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
