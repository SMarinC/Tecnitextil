// Section anchor ids, the menu and its mobile toggle labels. Components put these ids
// on <section id>. The menu links to the public pages plus the closing contact block
// every public page ends with.
import { AWNINGS_PAGE, CATALOG_PAGE, TECHNICAL_SERVICE_PAGE } from './pages'

export interface Section {
  id: string
}

export interface NavItem {
  label: string
  href: string
}

export const SECTIONS = {
  about: { id: 'quienes-somos' },
  awningMachines: { id: 'toldos' },
  services: { id: 'que-hacemos' },
  machineTypes: { id: 'tipos-de-maquina' },
  brands: { id: 'marcas' },
  valueProps: { id: 'por-que-elegirnos' },
  howItWorks: { id: 'como-es-el-servicio' },
  contact: { id: 'contacto' },
} satisfies Record<string, Section>

export const NAV_ITEMS: NavItem[] = [
  { label: 'Servicio técnico', href: TECHNICAL_SERVICE_PAGE.path },
  { label: 'Toldos', href: AWNINGS_PAGE.path },
  { label: 'Venta de máquinas', href: CATALOG_PAGE.path },
  { label: 'Contacto', href: `#${SECTIONS.contact.id}` },
]

export const MENU_TOGGLE_LABELS = {
  open: 'Abrir menú de navegación',
  close: 'Cerrar menú de navegación',
}
