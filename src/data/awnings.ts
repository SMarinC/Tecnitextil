// Copy of the toldos page: the awning machine families and what we do with them. No
// image imports here, so this module stays importable by the browser tests: the
// photos themselves live in src/components/AwningMachines/photos.ts.
export const AWNING_PHOTO_KEYS = ['bandeja-movil', 'cabezal-movil', 'mesa-rodillos'] as const
export type AwningPhotoKey = (typeof AWNING_PHOTO_KEYS)[number]

interface AwningMachinesContent {
  eyebrow: string
  heading: string
  intro: string
  services: { heading: string; items: string[] }
  families: { title: string; description: string; photo: { key: AwningPhotoKey; alt: string } }[]
  components: { heading: string; items: string[] }
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
      photo: {
        key: 'bandeja-movil',
        alt: 'Máquina automática de coser toldos con bandeja móvil cosiendo una lona',
      },
    },
    {
      title: 'Con cabezal móvil',
      description:
        'El paño queda fijo y tensado a lo largo de la mesa mientras el cabezal lo recorre sobre un carro.',
      photo: {
        key: 'cabezal-movil',
        alt: 'Estación de costura lineal con cabezal móvil para toldos',
      },
    },
    {
      title: 'Semiautomáticas con mesa de rodillos',
      description:
        'Dos agujas, triple arrastre y puller; la mesa de rodillos guía la lona hasta el cabezal.',
      photo: {
        key: 'mesa-rodillos',
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
}
