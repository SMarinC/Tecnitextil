import type { ImageMetadata } from 'astro'
import {
  MACHINE_TYPES,
  machineTypeLabel,
  type Availability,
  type MachineType,
} from '../data/catalog'
import { COMPANY } from '../data/company'
import { CATALOG_PAGE, type PageMeta } from '../data/pages'
import { absoluteUrl } from '../data/seo'

// Catalogue logic, kept free of astro:content so Vitest can test it with sample data.

export interface Machine {
  slug: string
  modelo: string
  marca: 'JACK'
  nombre: string
  tipo: MachineType
  resumen: string
  disponibilidad: Availability
  fotos: ImageMetadata[]
  especificaciones: { etiqueta: string; valor: string }[]
}

export interface MachineGroup {
  type: MachineType
  label: string
  machines: Machine[]
}

// A collection entry (id = folder name) as a Machine.
export function toMachine({ id, data }: { id: string; data: Omit<Machine, 'slug'> }): Machine {
  return { slug: id, ...data }
}

export function machinePath(slug: string): string {
  return `${CATALOG_PAGE.path}/${slug}`
}

export function groupByType(machines: readonly Machine[]): MachineGroup[] {
  return MACHINE_TYPES.map(({ id, label }) => ({
    type: id,
    label,
    machines: machines
      .filter(({ tipo }) => tipo === id)
      .sort((a, b) => a.modelo.localeCompare(b.modelo, 'es')),
  })).filter(({ machines: inGroup }) => inGroup.length > 0)
}

// Fails the build instead of publishing a broken catalogue.
export function assertCatalog(machines: readonly Machine[]): void {
  if (machines.length === 0) throw new Error('The machine catalogue is empty')
  for (const { slug, modelo } of machines) {
    if (slug !== modelo.toLowerCase()) {
      throw new Error(`Machine folder "${slug}" must be its model in lowercase (${modelo})`)
    }
  }
}

export function machineWhatsAppMessage({ marca, modelo, nombre }: Machine): string {
  return `Hola, me interesa la ${marca} ${modelo} (${nombre}). ¿Me dais más información?`
}

export function machinePageMeta(machine: Machine): PageMeta {
  return {
    path: machinePath(machine.slug),
    title: `${machine.nombre} ${machine.marca} ${machine.modelo} | ${COMPANY.name}`,
    description: machine.resumen,
    noindex: false,
  }
}

export function photoAlt({ marca, modelo, nombre }: Machine, index: number): string {
  const base = `${marca} ${modelo}, ${nombre}`
  return index === 0 ? base : `${base}, vista ${index + 1}`
}

// schema.org BreadcrumbList. No Product: without a price Google treats it as invalid.
export function machineBreadcrumbJsonLd(machine: Machine) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Máquinas', item: absoluteUrl(CATALOG_PAGE.path) },
      {
        '@type': 'ListItem',
        position: 2,
        name: machineTypeLabel(machine.tipo),
        item: absoluteUrl(`${CATALOG_PAGE.path}#${machine.tipo}`),
      },
      { '@type': 'ListItem', position: 3, name: `${machine.marca} ${machine.modelo}` },
    ],
  }
}
