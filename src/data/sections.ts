// Section ids and menu labels. Components put these ids on <section id> and the menu
// is built from NAV_ITEMS, so a menu anchor can never point to a missing section.

export interface Section {
  id: string
  navLabel?: string
}

export interface NavItem {
  label: string
  href: string
}

export const SECTIONS = {
  about: { id: 'quienes-somos' },
  awningMachines: { id: 'toldos', navLabel: 'Toldos' },
  services: { id: 'que-hacemos', navLabel: 'Qué hacemos' },
  machineTypes: { id: 'tipos-de-maquina', navLabel: 'Máquinas y marcas' },
  brands: { id: 'marcas' },
  valueProps: { id: 'por-que-elegirnos', navLabel: 'Por qué elegirnos' },
  howItWorks: { id: 'como-es-el-servicio', navLabel: 'Cómo es el servicio' },
  contact: { id: 'contacto', navLabel: 'Contáctanos' },
} satisfies Record<string, Section>

export const NAV_ITEMS: NavItem[] = [
  SECTIONS.awningMachines,
  SECTIONS.services,
  SECTIONS.machineTypes,
  SECTIONS.valueProps,
  SECTIONS.howItWorks,
  SECTIONS.contact,
].map(({ id, navLabel }) => ({ label: navLabel, href: `#${id}` }))

export const MENU_TOGGLE_LABELS = {
  open: 'Abrir menú de navegación',
  close: 'Cerrar menú de navegación',
}
