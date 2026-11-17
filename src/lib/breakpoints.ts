// Width at which the mobile menu gives way to the desktop nav. Header.module.css and
// styles/tokens.css repeat 1040px in their media queries because CSS cannot read this constant.
// Chosen so the logo, links, phone number and WhatsApp CTA fit inside the header's
// padding: measured free space at 1040px was ~139px with the self-hosted Oswald
// (2026-11-16, four menu links). A browser test fails if the row stops fitting.
export const DESKTOP_BREAKPOINT_PX = 1040
export const DESKTOP_MEDIA_QUERY = `(min-width: ${DESKTOP_BREAKPOINT_PX}px)`
