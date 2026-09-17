// Width at which the mobile menu gives way to the desktop nav. Header.module.css
// repeats 1040px in its media query because CSS cannot read this constant.
export const DESKTOP_BREAKPOINT_PX = 1040
export const DESKTOP_MEDIA_QUERY = `(min-width: ${DESKTOP_BREAKPOINT_PX}px)`
