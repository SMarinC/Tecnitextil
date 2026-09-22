// Copy of the technical service page: hero, what we do, the machine types we service,
// the brands we repair, and how the service works.
import { COMPANY } from './company'
import { WHATSAPP_CTA } from './site'
import type { IconItem, Step } from './types'

export const TECHNICAL_SERVICE_HERO = {
  eyebrow: 'Reparación y mantenimiento',
  title: 'Servicio técnico de maquinaria textil',
  intro: `Reparamos y mantenemos máquinas de coser industriales y domésticas, equipos de corte y auxiliares, de cualquier marca y generación. En ${COMPANY.coverage}, con recogida a domicilio.`,
  ctaLabel: WHATSAPP_CTA.primaryLabel,
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

// Renamed from MACHINE_TYPES: clashes with MACHINE_TYPES (the catalogue's groups) in
// src/data/catalog.ts.
export const SERVICED_MACHINE_TYPES: { heading: string; intro: string; items: IconItem[] } = {
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
