// Copy of the public pages, grouped by section in reading order. Icons are referenced by name
// (see components/Icon/icons.ts) so this file stays plain data.
import type { ImageMetadata } from 'astro'
import awningCarriageImage from '../assets/awning-machines/cabezal-movil.webp'
import awningRollerTableImage from '../assets/awning-machines/mesa-rodillos.webp'
import awningTrayImage from '../assets/awning-machines/bandeja-movil.webp'
import type { IconName } from '../components/Icon/icons'
import { COMPANY } from './company'

interface IconItem {
  icon: IconName
  title: string
  description: string
}

interface Step {
  title: string
  description: string
}

interface Photo {
  src: ImageMetadata
  alt: string
}

interface AwningMachinesContent {
  eyebrow: string
  heading: string
  intro: string
  services: { heading: string; items: string[] }
  families: { title: string; description: string; image: Photo }[]
  components: { heading: string; items: string[] }
  imageNote: string
}

export const HERO: {
  title: string
  tagline: string
  ctaLabel: string
  aboutHeading: string
  paragraphs: string[]
} = {
  title: 'Reparación y mantenimiento de maquinaria textil',
  tagline: `Máquinas de coser industriales y de toldos automatizadas, corte y confección. En ${COMPANY.coverage}, con más de ${COMPANY.yearsOfExperience} años de experiencia.`,
  ctaLabel: 'Escríbenos por WhatsApp',
  aboutHeading: 'Quiénes somos',
  paragraphs: [
    `${COMPANY.name} es una empresa que lleva más de ${COMPANY.yearsOfExperience} años trabajando con maquinaria textil e industrial: máquinas de coser, equipos de corte, confección y equipos auxiliares. Lo que empezó como un taller dedicado a resolver averías se convirtió, con el tiempo, en un equipo técnico altamente capacitado y con experiencia real en cada tipo de máquina, marca y avería.`,
    'Sabemos que detrás de cada máquina hay alguien que depende de ella para trabajar. Por eso combinamos eficiencia con un trato cercano: no solo reparamos, entendemos lo que significa para ti que tu máquina esté parada, y trabajamos con ese compromiso en cada intervención.',
  ],
}

export const TECHNICAL_SERVICE_HERO = {
  eyebrow: 'Reparación y mantenimiento',
  title: 'Servicio técnico de maquinaria textil',
  intro: `Reparamos y mantenemos máquinas de coser industriales y domésticas, equipos de corte y auxiliares, de cualquier marca y generación. En ${COMPANY.coverage}, con recogida a domicilio.`,
  ctaLabel: HERO.ctaLabel,
}

export const AWNING_MACHINES: AwningMachinesContent = {
  eyebrow: 'Servicio especializado',
  heading: 'Asistencia para máquinas de coser toldos automatizadas',
  intro:
    'Máquinas de coser toldos con bandejas, con cabezal móvil y semiautomáticas con mesa de rodillos. Las instalamos, reparamos y mantenemos en tu taller, tanto en la parte mecánica como en la electrónica.',
  services: {
    heading: 'Nuestro servicio',
    items: ['Instalación y puesta en marcha', 'Reparación de averías', 'Mantenimiento preventivo'],
  },
  families: [
    {
      title: 'Con bandeja móvil',
      description: 'Una bandeja con pinzas neumáticas desplaza el tejido bajo un cabezal fijo.',
      image: {
        src: awningTrayImage,
        alt: 'Máquina automática de coser toldos con bandeja móvil cosiendo una lona',
      },
    },
    {
      title: 'Con cabezal móvil',
      description:
        'El paño queda fijo y tensado a lo largo de la mesa mientras el cabezal lo recorre sobre un carro.',
      image: {
        src: awningCarriageImage,
        alt: 'Estación de costura lineal con cabezal móvil para toldos',
      },
    },
    {
      title: 'Semiautomáticas con mesa de rodillos',
      description:
        'Dos agujas, triple arrastre y puller; la mesa de rodillos guía la lona hasta el cabezal.',
      image: {
        src: awningRollerTableImage,
        alt: 'Máquina de coser toldos de dos agujas con mesa de rodillos',
      },
    },
  ],
  components: {
    heading: 'Qué intervenimos',
    items: [
      'Cabezal Dürkopp Adler 867',
      'PLC y pantalla táctil',
      'Sensores y fotocélulas',
      'Servomotores y drives',
      'Neumática y pinzas',
      'Carro, guías y bandeja',
    ],
  },
  imageNote:
    'Imágenes de referencia de los fabricantes. TECNITEXTIL es un servicio técnico independiente y no está vinculado a las marcas mostradas.',
}

export const SERVICES: { heading: string; intro: string; items: IconItem[] } = {
  heading: 'Qué hacemos',
  intro:
    'Cubrimos todo el ciclo de vida de tu máquina: mantenimiento, reparación, venta y asesoría técnica, para particulares y empresas textiles.',
  items: [
    {
      icon: 'sewingMachine',
      title: 'Mantenimiento, venta y reparación',
      description: 'Servicio integral de máquinas de coser industriales y domésticas.',
    },
    {
      icon: 'clipboardCheck',
      title: 'Asesoría técnica',
      description: 'Diagnóstico ante fallas comunes y cómo prevenirlas para que no se repitan.',
    },
    {
      icon: 'factory',
      title: 'Soporte a empresas textiles',
      description:
        'Mantenimiento y asistencia técnica para reducir paradas y mejorar tus tiempos de producción.',
    },
  ],
}

export const REPAIR_PROCESS: { heading: string; intro: string; steps: Step[] } = {
  heading: '¿Cómo es el proceso de reparación y mantenimiento?',
  intro:
    'Un servicio adaptado a las necesidades de cada cliente, en el que revisamos y prevenimos averías en maquinaria de producción, corte, tapicería y confección.',
  steps: [
    {
      title: 'Diagnóstico',
      description:
        'Evaluamos el estado general del equipo y detectamos qué está afectando su funcionamiento.',
    },
    {
      title: 'Ajuste de máquinas',
      description: 'Ajustamos la maquinaria de costura, corte y equipos auxiliares del taller.',
    },
    {
      title: 'Revisión mecánica',
      description: 'Revisamos los componentes mecánicos que se desgastan con el uso intensivo.',
    },
    {
      title: 'Limpieza y sistemas auxiliares',
      description:
        'Revisamos y limpiamos los sistemas auxiliares y las zonas que suelen acumular suciedad y provocar fallos.',
    },
    {
      title: 'Prueba final',
      description:
        'Comprobamos el resultado con el material de trabajo, verificando fuerza y precisión.',
    },
  ],
}

export const MACHINE_TYPES: { heading: string; intro: string; items: IconItem[] } = {
  heading: 'Tipos de máquina',
  intro:
    'Trabajamos con equipos de corte, confección, tapicería y acabados — cada uno con un ajuste distinto según el material y el ritmo de trabajo.',
  items: [
    {
      icon: 'sewingMachine',
      title: 'Costura industrial',
      description:
        'Máquinas planas, de triple arrastre, remalladoras, recubridoras y otros equipos de confección que necesitan estar siempre a punto.',
    },
    {
      icon: 'scissors',
      title: 'Corte textil',
      description: 'Distintos tipos de cortadoras para materias primas.',
    },
    {
      icon: 'gear',
      title: 'Equipos auxiliares',
      description:
        'Cortadoras automáticas, mesas de aspiración, entre otros complementos de tu proceso.',
    },
  ],
}

export const BRANDS: { heading: string; paragraphs: string[]; featured: string[]; others: string } =
  {
    heading: 'Reparamos maquinaria industrial de distintas marcas y generaciones',
    paragraphs: [
      'Trabajamos con maquinaria industrial habitual en talleres y entornos textiles: máquinas de costura de las marcas más utilizadas del sector, además de cortadoras, mesas de vacío, remachadoras y equipos auxiliares de diferentes fabricantes.',
      'Si tienes dudas sobre tu equipo, indícanos marca, modelo, tipo de material que trabaja y síntoma principal. Esto nos ayuda a orientar mejor la intervención técnica.',
    ],
    featured: ['Juki', 'Brother', 'Singer', 'Pfaff'],
    others:
      'También reparamos Alfa, Dürkopp Adler, Consew, Seiko, Typical, Siruba, Rimoldi, Pegasus y Jack, entre otras — y si tu máquina es de una marca que no ves aquí, escríbenos igual: trabajamos con maquinaria industrial de cualquier fabricante.',
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

export const HOW_IT_WORKS: { heading: string; steps: Step[] } = {
  heading: 'Cómo es el servicio',
  steps: [
    {
      title: 'Escríbenos por WhatsApp',
      description:
        'Cuéntanos qué equipo tienes, qué trabajo realiza y qué avería lo está afectando.',
    },
    {
      title: 'Recogemos, visitamos o valoramos en taller',
      description:
        'Según el tipo de máquina, la avería y la urgencia, coordinamos lo que mejor funcione: recogida en tu domicilio, visita técnica si el equipo es industrial, o revisión en nuestras instalaciones.',
    },
    {
      title: 'Reparamos, probamos y entregamos',
      description:
        'Reparamos el equipo, lo probamos con material real cuando corresponde, y te explicamos el trabajo hecho y el mantenimiento recomendado antes de entregarlo.',
    },
  ],
}

export const FINAL_CTA = {
  heading: 'Todo para tu maquinaria textil',
  subheading: 'Reparación, mantenimiento y venta. Escríbenos y con gusto te ayudamos.',
  ctaLabel: 'Contáctanos',
}

export const WHATSAPP_CTA = {
  headerLabel: 'WhatsApp',
  floatingLabel: 'Escribir por WhatsApp',
}

export const FOOTER = {
  coverage: `Servicio en ${COMPANY.coverage}`,
}
