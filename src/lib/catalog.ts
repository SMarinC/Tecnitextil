import type { ImageMetadata } from 'astro'
import {
  CATALOG_COPY,
  MACHINE_FAMILIES,
  typeLabel,
  type Availability,
  type MachineFamily,
} from '../data/catalog'
import { COMPANY } from '../data/company'
import { CATALOG_PAGE, type PageMeta } from '../data/pages'
import type { Crumb } from './jsonLd'

// Catalogue logic, kept free of astro:content so Vitest can test it with sample data.

export interface Machine {
  // "<category>/<model in lowercase>": the entry's folder, and its path under /maquinas.
  id: string
  // Category and type ids. The content schema checks that both exist, assertCatalog that
  // the type belongs to the category.
  familia: string
  tipo: string
  modelo: string
  marca: 'JACK'
  nombre: string
  resumen: string
  disponibilidad: Availability
  fotos: ImageMetadata[]
  especificaciones: { etiqueta: string; valor: string }[]
}

export interface MachineGroup {
  type: string
  label: string
  machines: Machine[]
}

export interface FamilyCard {
  family: MachineFamily
  count: number
  photo: ImageMetadata
}

export function toMachine({ id, data }: { id: string; data: Omit<Machine, 'id'> }): Machine {
  return { id, ...data }
}

export function modelSlug({ modelo }: Pick<Machine, 'modelo'>): string {
  return modelo.toLowerCase()
}

export function familyPath({ id }: Pick<MachineFamily, 'id'>): string {
  return `${CATALOG_PAGE.path}/${id}`
}

export function machinePath({ id }: Pick<Machine, 'id'>): string {
  return `${CATALOG_PAGE.path}/${id}`
}

export function machinesOf(
  family: Pick<MachineFamily, 'id'>,
  machines: readonly Machine[],
): Machine[] {
  return machines.filter(({ familia }) => familia === family.id)
}

// The category's types in JACK's order, models sorted, empty types left out.
export function groupByType(family: MachineFamily, machines: readonly Machine[]): MachineGroup[] {
  const own = machinesOf(family, machines)
  return family.types
    .map(({ id, label }) => ({
      type: id,
      label,
      machines: own
        .filter(({ tipo }) => tipo === id)
        .sort((a, b) => a.modelo.localeCompare(b.modelo, 'es')),
    }))
    .filter(({ machines: inGroup }) => inGroup.length > 0)
}

// The hub's cards: one per category, with its model count and its cover photo.
export function familyCards(
  machines: readonly Machine[],
  families: readonly MachineFamily[] = MACHINE_FAMILIES,
): FamilyCard[] {
  return families.map((family) => {
    const own = machinesOf(family, machines)
    const photo = own.find((machine) => modelSlug(machine) === family.cover)?.fotos[0]
    if (!photo) throw new Error(`Category "${family.id}" has no cover photo`)
    return { family, count: own.length, photo }
  })
}

// Fails the build instead of publishing a broken catalogue.
export function assertCatalog(
  machines: readonly Machine[],
  families: readonly MachineFamily[] = MACHINE_FAMILIES,
): void {
  if (machines.length === 0) throw new Error('The machine catalogue is empty')
  const models = new Set<string>()
  for (const machine of machines) {
    const { id, familia, modelo, tipo } = machine
    const expected = `${familia}/${modelSlug(machine)}`
    if (id !== expected) {
      throw new Error(`Machine folder "${id}" must be "${expected}": its category, then its model`)
    }
    if (models.has(modelo)) throw new Error(`Model ${modelo} appears more than once`)
    models.add(modelo)
    const family = families.find((candidate) => candidate.id === familia)
    if (!family) throw new Error(`Machine ${modelo}: unknown category "${familia}"`)
    if (!family.types.some((type) => type.id === tipo)) {
      throw new Error(`Machine ${modelo}: type "${tipo}" is not one of the ${familia} types`)
    }
  }
  for (const family of families) {
    const own = machinesOf(family, machines)
    if (own.length === 0) throw new Error(`Category "${family.id}" has no machines`)
    const cover = own.find((machine) => modelSlug(machine) === family.cover)
    if (!cover || cover.fotos.length === 0) {
      throw new Error(
        `Category "${family.id}": its cover "${family.cover}" must be one of its machines, with photos`,
      )
    }
  }
}

export function familyPageMeta(family: MachineFamily): PageMeta {
  return {
    path: familyPath(family),
    title: `${family.title} JACK | ${COMPANY.name}`,
    description: `${family.summary} ${CATALOG_COPY.familyDescriptionSuffix}`,
    noindex: false,
  }
}

export function familyIntro(family: MachineFamily): string {
  return `${family.summary} ${CATALOG_COPY.familyIntroSuffix}`
}

export function familyWhatsAppMessage(family: MachineFamily): string {
  return `Hola, quisiera información sobre las ${family.title.toLowerCase()} JACK.`
}

export function machineWhatsAppMessage({ marca, modelo, nombre }: Machine): string {
  return `Hola, me interesa la ${marca} ${modelo} (${nombre}). ¿Me dais más información?`
}

export function machinePageMeta(machine: Machine): PageMeta {
  return {
    path: machinePath(machine),
    title: `${machine.nombre} ${machine.marca} ${machine.modelo} | ${COMPANY.name}`,
    description: machine.resumen,
    noindex: false,
  }
}

export function photoAlt({ marca, modelo, nombre }: Machine, index: number): string {
  const base = `${marca} ${modelo}, ${nombre}`
  return index === 0 ? base : `${base}, vista ${index + 1}`
}

const catalogueCrumb: Crumb = { label: CATALOG_COPY.breadcrumbRoot, href: CATALOG_PAGE.path }

export function familyBreadcrumb(family: MachineFamily): Crumb[] {
  return [catalogueCrumb, { label: family.label }]
}

export function machineBreadcrumb(family: MachineFamily, machine: Machine): Crumb[] {
  return [
    catalogueCrumb,
    { label: family.label, href: familyPath(family) },
    { label: typeLabel(family, machine.tipo), href: `${familyPath(family)}#${machine.tipo}` },
    { label: `${machine.marca} ${machine.modelo}` },
  ]
}
