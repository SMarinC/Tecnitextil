// Textos de la página de inicio, agrupados por sección y en orden de
// aparición. Los íconos se indican por clave (ver components/icons/iconRegistry.js)
// para que este archivo sea solo datos.
import { COMPANY } from './company.js'

export const HERO = {
  title: 'Quiénes somos',
  paragraphs: [
    `${COMPANY.name} es una empresa que lleva más de ${COMPANY.yearsOfExperience} años trabajando con maquinaria textil e industrial: máquinas de coser, equipos de corte, confección y equipos auxiliares. Lo que empezó como un taller dedicado a resolver averías se convirtió, con el tiempo, en un equipo técnico altamente capacitado y con experiencia real en cada tipo de máquina, marca y avería.`,
    'Sabemos que detrás de cada máquina hay alguien que depende de ella para trabajar. Por eso combinamos eficiencia con un trato cercano: no solo reparamos, entendemos lo que significa para ti que tu máquina esté parada, y trabajamos con ese compromiso en cada intervención.',
  ],
}

export const SERVICES = {
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

export const REPAIR_PROCESS = {
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

export const MACHINE_TYPES = {
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

export const BRANDS = {
  heading: 'Reparamos maquinaria industrial de distintas marcas y generaciones',
  paragraphs: [
    'Trabajamos con maquinaria industrial habitual en talleres y entornos textiles: máquinas de costura de las marcas más utilizadas del sector, además de cortadoras, mesas de vacío, remachadoras y equipos auxiliares de diferentes fabricantes.',
    'Si tienes dudas sobre tu equipo, indícanos marca, modelo, tipo de material que trabaja y síntoma principal. Esto nos ayuda a orientar mejor la intervención técnica.',
  ],
  featured: ['Juki', 'Brother', 'Singer', 'Pfaff'],
  others:
    'También reparamos Alfa, Dürkopp Adler, Consew, Seiko, Typical, Siruba, Rimoldi, Pegasus y Jack, entre otras — y si tu máquina es de una marca que no ves aquí, escríbenos igual: trabajamos con maquinaria industrial de cualquier fabricante.',
}

export const VALUE_PROPS = {
  heading: 'Por qué elegirnos',
  items: [
    { icon: 'badge', stat: `+${COMPANY.yearsOfExperience}`, label: 'años de experiencia' },
    { icon: 'mapPin', stat: 'Toda España', label: 'cobertura nacional' },
    { icon: 'clock', stat: 'Máx. 1 día', label: 'tiempo de respuesta' },
    { icon: 'truck', stat: 'A domicilio', label: 'recogida disponible' },
  ],
}

export const HOW_IT_WORKS = {
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

export const FOOTER = {
  coverage: `Servicio en ${COMPANY.coverage}`,
}
