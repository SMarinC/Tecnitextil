// Width at which the mobile menu gives way to the desktop nav. Header.module.css
// repeats 1040px in its media query because CSS cannot read this constant.
// Chosen so the logo, links and WhatsApp CTA fit inside the header's padding with
// the self-hosted Oswald and with its Arial Narrow fallback: measured free space at
// 1040px was ~61px with Oswald and ~42px with Arial Narrow, ~20px of that reserved
// for a Windows scrollbar that headless measurement doesn't have.
export const DESKTOP_BREAKPOINT_PX = 1040
export const DESKTOP_MEDIA_QUERY = `(min-width: ${DESKTOP_BREAKPOINT_PX}px)`
