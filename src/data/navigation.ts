// The menu and its mobile toggle labels, plus the closing contact block's anchor id.
// Every public page ends with that block, and the menu's "Contacto" links to it.
import { AWNINGS_PAGE, CATALOG_PAGE, TECHNICAL_SERVICE_PAGE } from './pages'

export interface NavItem {
  label: string
  href: string
}

export const CONTACT_SECTION_ID = 'contacto'

export const NAV_ITEMS: NavItem[] = [
  { label: 'Servicio técnico', href: TECHNICAL_SERVICE_PAGE.path },
  { label: 'Toldos', href: AWNINGS_PAGE.path },
  { label: 'Venta de máquinas', href: CATALOG_PAGE.path },
  { label: 'Contacto', href: `#${CONTACT_SECTION_ID}` },
]

export const MENU_TOGGLE_LABELS = {
  open: 'Abrir menú de navegación',
  close: 'Cerrar menú de navegación',
}
