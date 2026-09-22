// Copy of the toldos page: the awning machine families and what we do with them.
import awningCarriageImage from '../assets/awning-machines/cabezal-movil.webp'
import awningRollerTableImage from '../assets/awning-machines/mesa-rodillos.webp'
import awningTrayImage from '../assets/awning-machines/bandeja-movil.webp'
import type { Photo } from './types'

interface AwningMachinesContent {
  eyebrow: string
  heading: string
  intro: string
  services: { heading: string; items: string[] }
  families: { title: string; description: string; image: Photo }[]
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
}
