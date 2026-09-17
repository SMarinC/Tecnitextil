// Inner markup of each icon, drawn on a 24×24 grid with a 1.5px stroke (see Icon.astro).

const HANDSET_PATH =
  'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z'

export const ICON_MARKUP = {
  sewingMachine:
    '<path d="M3 18h14a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1h-3" /><path d="M3 18v-3.5a1.5 1.5 0 0 1 1.5-1.5H13" /><circle cx="16" cy="8" r="3" /><path d="M16 5V3M16 11v1" /><path d="M9 13V9a2 2 0 0 1 2-2h1" /><path d="M6 21h6" />',
  factory:
    '<path d="M3 21V11l5 3v-3l5 3v-3l5 3v7z" /><path d="M3 21h18" /><path d="M8 21v-4M13 21v-4M18 21v-4" /><path d="M18 11V7l3 2" />',
  clipboardCheck:
    '<rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" /><path d="M9 13.5 11 15.5 15 11" />',
  scissors:
    '<circle cx="6" cy="6" r="2.5" /><circle cx="6" cy="18" r="2.5" /><path d="M8.5 7.5 20 19M8.5 16.5 20 5" />',
  gear: '<circle cx="12" cy="12" r="3" /><path d="M12 4v2M12 18v2M4 12h2M18 12h2M6.3 6.3l1.4 1.4M16.3 16.3l1.4 1.4M6.3 17.7l1.4-1.4M16.3 7.7l1.4-1.4" />',
  truck:
    '<path d="M2 7h11v9H2z" /><path d="M13 10h4l3 3v3h-7z" /><circle cx="6" cy="18" r="1.6" /><circle cx="17" cy="18" r="1.6" />',
  badge: '<circle cx="12" cy="9" r="6" /><path d="M9 14.5 7.5 21l4.5-2.5L16.5 21 15 14.5" />',
  mapPin:
    '<path d="M12 21s7-6.4 7-11.5A7 7 0 0 0 5 9.5C5 14.6 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.3" />',
  clock: '<circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" />',
  whatsApp: `<path d="M12 3a9 9 0 0 0-7.75 13.5L3 21l4.5-1.25A9 9 0 1 0 12 3z" /><path fill="currentColor" stroke="none" transform="translate(8,6) scale(0.42)" d="${HANDSET_PATH}" />`,
  phone: `<path d="${HANDSET_PATH}" />`,
  menu: '<path d="M3 6h18M3 12h18M3 18h18" />',
  close: '<path d="M6 6l12 12M18 6L6 18" />',
}

export type IconName = keyof typeof ICON_MARKUP
