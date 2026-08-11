# Header Navigation Menu Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a functional anchor-based navigation menu to the existing `Header` component so visitors can smooth-scroll to each section of the single-page TECNITEXTIL landing.

**Architecture:** Everything lives inside the existing `Header.jsx` / `Header.module.css` (no new nav component, no router). A `NAV_ITEMS` data array drives both the desktop `<nav>` and the mobile dropdown panel. Section components each get a stable `id` plus `scroll-margin-top` so the sticky header never covers the scroll target. A single `IntersectionObserver`, created once and disconnected on unmount, tracks which section is on screen and highlights the matching link.

**Tech Stack:** Vite, React 19, CSS Modules, Vitest (`environment: 'node'`, tests scoped to pure render output via `react-dom/server` — no `jsdom`, no simulated clicks/scroll).

Reference spec: `docs/specs/2026-08-11-header-navigation-design.md`

## Global Constraints

- No new routes, no router library — every link is an in-page anchor (`<a href="#id">`) with a JS `scrollIntoView` handler. (Spec §1, §2)
- No content, copy, or section order changes — only `id` attributes and CSS are added to `Hero`, `Services`, `ValueProps`, `HowItWorks`, `FinalCta`. (Spec §2)
- Exact id-to-component mapping: `Hero`→`quienes-somos` (no nav link), `Services`→`que-hacemos`, `ValueProps`→`por-que-elegirnos`, `HowItWorks`→`como-funciona`, `FinalCta`→`contacto`. (Spec §3)
- Everything lives in `Header.jsx`/`Header.module.css` — no new component folder for the nav. (Spec §4)
- Interaction logic (scroll, menu close) goes in the click event handler, not in a `useEffect`. (Spec §5, `rerender-move-effect-to-event`)
- Active-section tracking uses `IntersectionObserver`, not a `scroll` listener; observer created once (empty deps) and disconnected in cleanup. (Spec §6)
- Desktop nav breakpoint is `768px`, matching `Services`/`ValueProps`/`HowItWorks`. Mobile menu button and panel are hidden at `≥768px`. (Spec §7)
- Mobile menu toggle button needs `aria-expanded`, `aria-controls`, `aria-label`; all links keep ≥44px tap targets. (Spec §8)
- No new UI/animation dependencies — conditional rendering uses a plain ternary. (Spec §10)
- Automated tests stay scoped to pure render output (icon components), matching the project's existing test scope — no new test files for `Header.jsx` or the section components; their behavior is verified manually in the final task, same as the original landing-page plan. (Spec §9, existing `Icons.test.jsx`/`contact.test.js` precedent)
- All new colors/spacing/typography come from existing tokens in `src/styles/tokens.css` — no hardcoded hex values or magic numbers besides the one new `--header-offset` token.

---

## File Structure

```
src/
  styles/
    tokens.css                          # + --header-offset
  components/
    icons/
      Icons.jsx                         # + MenuIcon, CloseIcon
      Icons.test.jsx                    # + coverage for the two new icons
    Header/
      Header.jsx                        # + NAV_ITEMS, desktop nav, mobile
                                         #   toggle/panel, active-section
                                         #   IntersectionObserver
      Header.module.css                 # + nav/menu/mobile styles
    Hero/Hero.jsx                       # + id="quienes-somos"
    Hero/Hero.module.css                # + scroll-margin-top
    Services/Services.jsx               # + id="que-hacemos"
    Services/Services.module.css        # + scroll-margin-top
    ValueProps/ValueProps.jsx           # + id="por-que-elegirnos"
    ValueProps/ValueProps.module.css    # + scroll-margin-top
    HowItWorks/HowItWorks.jsx           # + id="como-funciona"
    HowItWorks/HowItWorks.module.css    # + scroll-margin-top
    FinalCta/FinalCta.jsx               # + id="contacto"
    FinalCta/FinalCta.module.css        # + scroll-margin-top
```

---

### Task 1: `--header-offset` token + `MenuIcon`/`CloseIcon`

**Files:**
- Modify: `src/styles/tokens.css`
- Modify: `src/components/icons/Icons.jsx`
- Modify: `src/components/icons/Icons.test.jsx`

**Interfaces:**
- Produces: CSS custom property `--header-offset` (used by every section's `scroll-margin-top` in Task 2).
- Produces: `MenuIcon(props)`, `CloseIcon(props)` — same signature as every other icon in `Icons.jsx` (accepts `className`, spreads `...props` onto the `<svg>`), used by `Header.jsx` in Task 4.

- [ ] **Step 1: Add the two new icons to the existing test loop (failing first)**

Edit `src/components/icons/Icons.test.jsx` — add the two new imports and entries to the `icons` map:

```jsx
import { describe, it, expect } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import {
  SewingMachineIcon,
  FactoryIcon,
  TruckIcon,
  BadgeIcon,
  MapPinIcon,
  ClockIcon,
  WhatsAppIcon,
  MenuIcon,
  CloseIcon,
} from './Icons.jsx'

const icons = {
  SewingMachineIcon,
  FactoryIcon,
  TruckIcon,
  BadgeIcon,
  MapPinIcon,
  ClockIcon,
  WhatsAppIcon,
  MenuIcon,
  CloseIcon,
}

describe('icon components', () => {
  Object.entries(icons).forEach(([name, Icon]) => {
    it(`${name} renders a single <svg> without throwing`, () => {
      const markup = renderToStaticMarkup(<Icon />)
      expect(markup).toContain('<svg')
    })

    it(`${name} forwards className to the <svg>`, () => {
      const markup = renderToStaticMarkup(<Icon className="test-icon" />)
      expect(markup).toContain('class="test-icon"')
    })

    it(`${name} is hidden from assistive tech and uses currentColor stroke`, () => {
      const markup = renderToStaticMarkup(<Icon />)
      expect(markup).toContain('aria-hidden="true"')
      expect(markup).toContain('stroke="currentColor"')
    })
  })
})
```

- [ ] **Step 2: Run the tests and confirm they fail on the missing imports**

Run: `npm run test`
Expected: FAIL — `MenuIcon`/`CloseIcon` are not exported from `./Icons.jsx`.

- [ ] **Step 3: Add `MenuIcon` and `CloseIcon` to `Icons.jsx`**

Append to `src/components/icons/Icons.jsx` (same file that already exports `SewingMachineIcon`, `WhatsAppIcon`, etc.):

```jsx
export function MenuIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  )
}

export function CloseIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}
```

- [ ] **Step 4: Run the tests again and confirm they pass**

Run: `npm run test`
Expected: PASS — all icon tests, including the new `MenuIcon`/`CloseIcon` entries, succeed.

- [ ] **Step 5: Add the `--header-offset` token**

In `src/styles/tokens.css`, add the new custom property after `--max-width`:

```css
  --max-width: 1120px;

  --header-offset: 128px;
}
```

(This replaces the closing `}` of `:root` — the new line goes right before it.)

- [ ] **Step 6: Commit**

```bash
git add src/styles/tokens.css src/components/icons/Icons.jsx src/components/icons/Icons.test.jsx
git commit -m "feat: add header-offset token and menu/close icons"
```

---

### Task 2: Section ids + scroll offset

**Files:**
- Modify: `src/components/Hero/Hero.jsx`, `src/components/Hero/Hero.module.css`
- Modify: `src/components/Services/Services.jsx`, `src/components/Services/Services.module.css`
- Modify: `src/components/ValueProps/ValueProps.jsx`, `src/components/ValueProps/ValueProps.module.css`
- Modify: `src/components/HowItWorks/HowItWorks.jsx`, `src/components/HowItWorks/HowItWorks.module.css`
- Modify: `src/components/FinalCta/FinalCta.jsx`, `src/components/FinalCta/FinalCta.module.css`

**Interfaces:**
- Consumes: `--header-offset` from `src/styles/tokens.css` (Task 1).
- Produces: DOM ids `quienes-somos`, `que-hacemos`, `por-que-elegirnos`, `como-funciona`, `contacto` — these are the exact strings `Header.jsx` will target in `document.querySelector(href)` in Tasks 3 and 5.

- [ ] **Step 1: Add the id and scroll-margin-top to `Hero`**

In `src/components/Hero/Hero.jsx`, change the root `<section>`:

```jsx
    <section className={styles.hero} id="quienes-somos">
```

In `src/components/Hero/Hero.module.css`, add to the existing `.hero` rule:

```css
.hero {
  background: radial-gradient(
    circle at 50% 0%,
    var(--color-black-soft) 0%,
    var(--color-black) 60%
  );
  color: var(--color-text-on-dark);
  padding: clamp(3rem, 8vw, 6rem) var(--space-md);
  scroll-margin-top: var(--header-offset);
}
```

- [ ] **Step 2: Add the id and scroll-margin-top to `Services`**

In `src/components/Services/Services.jsx`, change the root `<section>`:

```jsx
    <section className={styles.services} id="que-hacemos">
```

In `src/components/Services/Services.module.css`, add to the existing `.services` rule:

```css
.services {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: var(--space-xl) var(--space-md);
  scroll-margin-top: var(--header-offset);
}
```

- [ ] **Step 3: Add the id and scroll-margin-top to `ValueProps`**

In `src/components/ValueProps/ValueProps.jsx`, change the root `<section>`:

```jsx
    <section className={styles.section} id="por-que-elegirnos">
```

In `src/components/ValueProps/ValueProps.module.css`, add to the existing `.section` rule:

```css
.section {
  background: var(--color-black);
  scroll-margin-top: var(--header-offset);
}
```

- [ ] **Step 4: Add the id and scroll-margin-top to `HowItWorks`**

In `src/components/HowItWorks/HowItWorks.jsx`, change the root `<section>`:

```jsx
    <section className={styles.section} id="como-funciona">
```

In `src/components/HowItWorks/HowItWorks.module.css`, add to the existing `.section` rule:

```css
.section {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: var(--space-xl) var(--space-md);
  scroll-margin-top: var(--header-offset);
}
```

- [ ] **Step 5: Add the id and scroll-margin-top to `FinalCta`**

In `src/components/FinalCta/FinalCta.jsx`, change the root `<section>`:

```jsx
    <section className={styles.section} id="contacto">
```

In `src/components/FinalCta/FinalCta.module.css`, add to the existing `.section` rule:

```css
.section {
  background: var(--color-black);
  color: var(--color-text-on-dark);
  text-align: center;
  padding: var(--space-xl) var(--space-md);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-md);
  scroll-margin-top: var(--header-offset);
}
```

- [ ] **Step 6: Verify every id is present in the rendered HTML**

Run: `npm run dev`, open `http://localhost:5183/`, open DevTools → Elements, and confirm each `<section>` carries its id: `quienes-somos`, `que-hacemos`, `por-que-elegirnos`, `como-funciona`, `contacto`.

Alternatively, from the repo root:

Run: `grep -rn 'id="' src/components/Hero/Hero.jsx src/components/Services/Services.jsx src/components/ValueProps/ValueProps.jsx src/components/HowItWorks/HowItWorks.jsx src/components/FinalCta/FinalCta.jsx`
Expected: five matches, one per file, with the five ids listed above.

- [ ] **Step 7: Commit**

```bash
git add src/components/Hero/Hero.jsx src/components/Hero/Hero.module.css \
  src/components/Services/Services.jsx src/components/Services/Services.module.css \
  src/components/ValueProps/ValueProps.jsx src/components/ValueProps/ValueProps.module.css \
  src/components/HowItWorks/HowItWorks.jsx src/components/HowItWorks/HowItWorks.module.css \
  src/components/FinalCta/FinalCta.jsx src/components/FinalCta/FinalCta.module.css
git commit -m "feat: add scroll anchor ids to landing sections"
```

---

### Task 3: Desktop nav (data, markup, click-to-scroll, styles)

**Files:**
- Modify: `src/components/Header/Header.jsx`
- Modify: `src/components/Header/Header.module.css`

**Interfaces:**
- Consumes: section ids from Task 2 (`#que-hacemos`, `#por-que-elegirnos`, `#como-funciona`, `#contacto`).
- Produces: `NAV_ITEMS` array (`{ label: string, href: string }[]`) — reused by the mobile panel in Task 4.
- Produces: `handleNavClick(event, href)` function — reused by the mobile panel in Task 4.

- [ ] **Step 1: Replace `Header.jsx` with the version that adds `NAV_ITEMS` and the desktop `<nav>`**

Full new content for `src/components/Header/Header.jsx`:

```jsx
import styles from './Header.module.css'
import { buildWhatsAppUrl } from '../../constants/contact.js'
import { WhatsAppIcon } from '../icons/Icons.jsx'

const NAV_ITEMS = [
  { label: 'Qué hacemos', href: '#que-hacemos' },
  { label: 'Por qué elegirnos', href: '#por-que-elegirnos' },
  { label: 'Cómo funciona', href: '#como-funciona' },
  { label: 'Contáctanos', href: '#contacto' },
]

function handleNavClick(event, href) {
  event.preventDefault()
  document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <img
          src="/logo.jpeg"
          alt="TECNITEXTIL"
          width="100"
          height="100"
          className={styles.logo}
        />
        <nav className={styles.nav} aria-label="Navegación principal">
          {NAV_ITEMS.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              onClick={(event) => handleNavClick(event, href)}
              className={styles.navLink}
            >
              {label}
            </a>
          ))}
        </nav>
        <a
          href={buildWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.cta}
        >
          <WhatsAppIcon className={styles.ctaIcon} />
          WhatsApp
        </a>
      </div>
    </header>
  )
}

export default Header
```

- [ ] **Step 2: Add nav styles to `Header.module.css`**

Full new content for `src/components/Header/Header.module.css`:

```css
.header {
  position: sticky;
  top: 0;
  z-index: 20;
  background: var(--color-black);
  border-bottom: 1px solid
    color-mix(in srgb, var(--color-gold) 25%, transparent);
}

.inner {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: var(--space-xs) var(--space-md);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
}

.logo {
  height: 100px;
  width: 100px;
  border-radius: var(--radius-full);
  object-fit: cover;
}

.nav {
  display: none;
  align-items: center;
  gap: var(--space-md);
}

.navLink {
  font-family: var(--font-heading);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-size: 0.85rem;
  color: var(--color-text-on-dark);
  text-decoration: none;
  padding-bottom: 4px;
  border-bottom: 2px solid transparent;
  transition: color 0.15s ease, border-color 0.15s ease;
}

.navLink:hover {
  color: var(--color-gold);
}

.navLinkActive {
  color: var(--color-gold);
  border-bottom-color: var(--color-gold);
}

.cta {
  display: none;
  align-items: center;
  gap: var(--space-xs);
  color: var(--color-black);
  background: var(--color-gold);
  padding: 0.5rem 1rem;
  border-radius: var(--radius-full);
  font-weight: 600;
  text-decoration: none;
  font-size: 0.9rem;
  min-height: 44px;
  transition: filter 0.15s ease;
}

.cta:hover {
  filter: brightness(1.08);
}

.cta:focus-visible {
  outline: 2px solid var(--color-white);
  outline-offset: 2px;
}

.ctaIcon {
  width: 18px;
  height: 18px;
}

@media (min-width: 640px) {
  .cta {
    display: inline-flex;
  }
}

@media (min-width: 768px) {
  .nav {
    display: flex;
  }
}
```

Note: `.navLinkActive` is unused until Task 5 wires up the active-section state — that's expected at this point in the plan.

- [ ] **Step 3: Smoke-check in the browser**

Run: `npm run dev`, open `http://localhost:5183/` at a desktop width (≥768px). Confirm the four nav links appear between the logo and the WhatsApp button, and clicking each one smooth-scrolls to the right section without the header covering its heading.

- [ ] **Step 4: Commit**

```bash
git add src/components/Header/Header.jsx src/components/Header/Header.module.css
git commit -m "feat: add desktop navigation menu to header"
```

---

### Task 4: Mobile hamburger toggle + dropdown panel

**Files:**
- Modify: `src/components/Header/Header.jsx`
- Modify: `src/components/Header/Header.module.css`

**Interfaces:**
- Consumes: `NAV_ITEMS`, `handleNavClick` from Task 3.
- Produces: `isMenuOpen` state (used by Task 5 only to close the panel after a click — no other task reads it).

- [ ] **Step 1: Add mobile menu state, the toggle button, and the dropdown panel**

Full new content for `src/components/Header/Header.jsx`:

```jsx
import { useState } from 'react'
import styles from './Header.module.css'
import { buildWhatsAppUrl } from '../../constants/contact.js'
import { WhatsAppIcon, MenuIcon, CloseIcon } from '../icons/Icons.jsx'

const NAV_ITEMS = [
  { label: 'Qué hacemos', href: '#que-hacemos' },
  { label: 'Por qué elegirnos', href: '#por-que-elegirnos' },
  { label: 'Cómo funciona', href: '#como-funciona' },
  { label: 'Contáctanos', href: '#contacto' },
]

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  function handleNavClick(event, href) {
    event.preventDefault()
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setIsMenuOpen(false)
  }

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <img
          src="/logo.jpeg"
          alt="TECNITEXTIL"
          width="100"
          height="100"
          className={styles.logo}
        />
        <nav className={styles.nav} aria-label="Navegación principal">
          {NAV_ITEMS.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              onClick={(event) => handleNavClick(event, href)}
              className={styles.navLink}
            >
              {label}
            </a>
          ))}
        </nav>
        <div className={styles.actions}>
          <a
            href={buildWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.cta}
          >
            <WhatsAppIcon className={styles.ctaIcon} />
            WhatsApp
          </a>
          <button
            type="button"
            className={styles.menuToggle}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav-panel"
            aria-label={isMenuOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            {isMenuOpen ? (
              <CloseIcon className={styles.menuIcon} />
            ) : (
              <MenuIcon className={styles.menuIcon} />
            )}
          </button>
        </div>
      </div>
      {isMenuOpen ? (
        <nav id="mobile-nav-panel" className={styles.mobileNav} aria-label="Navegación móvil">
          {NAV_ITEMS.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              onClick={(event) => handleNavClick(event, href)}
              className={styles.mobileNavLink}
            >
              {label}
            </a>
          ))}
        </nav>
      ) : null}
    </header>
  )
}

export default Header
```

- [ ] **Step 2: Add the `.actions`, `.menuToggle`, `.mobileNav` styles**

In `src/components/Header/Header.module.css`, insert after `.ctaIcon` and before the `@media (min-width: 640px)` block:

```css
.actions {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.menuToggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: none;
  border: none;
  color: var(--color-text-on-dark);
  cursor: pointer;
  padding: 0;
}

.menuToggle:focus-visible {
  outline: 2px solid var(--color-gold);
  outline-offset: 2px;
}

.menuIcon {
  width: 24px;
  height: 24px;
}

.mobileNav {
  display: flex;
  flex-direction: column;
  background: var(--color-black);
  border-top: 1px solid
    color-mix(in srgb, var(--color-gold) 25%, transparent);
  padding: var(--space-xs) var(--space-md) var(--space-sm);
}

.mobileNavLink {
  font-family: var(--font-heading);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-size: 0.9rem;
  color: var(--color-text-on-dark);
  text-decoration: none;
  padding: var(--space-sm) 0;
  min-height: 44px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid
    color-mix(in srgb, var(--color-gold) 15%, transparent);
}

.mobileNavLink:last-child {
  border-bottom: none;
}

.mobileNavLink:hover {
  color: var(--color-gold);
}
```

Then extend the existing `@media (min-width: 768px)` block so the toggle/panel hide on desktop:

```css
@media (min-width: 768px) {
  .nav {
    display: flex;
  }

  .menuToggle,
  .mobileNav {
    display: none;
  }
}
```

- [ ] **Step 3: Smoke-check in the browser**

Run: `npm run dev`, resize DevTools to a mobile width (<768px). Confirm: the WhatsApp button stays visible, the hamburger icon appears next to it, tapping it opens a full-width panel below the header with the four links, tapping a link scrolls to the section and closes the panel, and tapping the icon again (now an X) closes it manually.

- [ ] **Step 4: Commit**

```bash
git add src/components/Header/Header.jsx src/components/Header/Header.module.css
git commit -m "feat: add mobile hamburger menu to header"
```

---

### Task 5: Active-section highlighting

**Files:**
- Modify: `src/components/Header/Header.jsx`

**Interfaces:**
- Consumes: `NAV_ITEMS` (Task 3), section ids from Task 2, `.navLinkActive`/`.mobileNavLink` classes from Header.module.css (Tasks 3–4).
- Produces: nothing consumed by later tasks — this is the last functional piece.

- [ ] **Step 1: Add the `IntersectionObserver` and wire up `activeHref`**

Full new content for `src/components/Header/Header.jsx`:

```jsx
import { useEffect, useState } from 'react'
import styles from './Header.module.css'
import { buildWhatsAppUrl } from '../../constants/contact.js'
import { WhatsAppIcon, MenuIcon, CloseIcon } from '../icons/Icons.jsx'

const NAV_ITEMS = [
  { label: 'Qué hacemos', href: '#que-hacemos' },
  { label: 'Por qué elegirnos', href: '#por-que-elegirnos' },
  { label: 'Cómo funciona', href: '#como-funciona' },
  { label: 'Contáctanos', href: '#contacto' },
]

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeHref, setActiveHref] = useState(null)

  useEffect(() => {
    const sections = NAV_ITEMS
      .map(({ href }) => document.querySelector(href))
      .filter(Boolean)

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((entry) => entry.isIntersecting)
        if (visibleEntry) {
          setActiveHref(`#${visibleEntry.target.id}`)
        }
      },
      { rootMargin: '-96px 0px -70% 0px', threshold: 0 },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  function handleNavClick(event, href) {
    event.preventDefault()
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setIsMenuOpen(false)
  }

  function linkClassName(href, base) {
    return href === activeHref ? `${base} ${styles.navLinkActive}` : base
  }

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <img
          src="/logo.jpeg"
          alt="TECNITEXTIL"
          width="100"
          height="100"
          className={styles.logo}
        />
        <nav className={styles.nav} aria-label="Navegación principal">
          {NAV_ITEMS.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              onClick={(event) => handleNavClick(event, href)}
              className={linkClassName(href, styles.navLink)}
            >
              {label}
            </a>
          ))}
        </nav>
        <div className={styles.actions}>
          <a
            href={buildWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.cta}
          >
            <WhatsAppIcon className={styles.ctaIcon} />
            WhatsApp
          </a>
          <button
            type="button"
            className={styles.menuToggle}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav-panel"
            aria-label={isMenuOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            {isMenuOpen ? (
              <CloseIcon className={styles.menuIcon} />
            ) : (
              <MenuIcon className={styles.menuIcon} />
            )}
          </button>
        </div>
      </div>
      {isMenuOpen ? (
        <nav id="mobile-nav-panel" className={styles.mobileNav} aria-label="Navegación móvil">
          {NAV_ITEMS.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              onClick={(event) => handleNavClick(event, href)}
              className={linkClassName(href, styles.mobileNavLink)}
            >
              {label}
            </a>
          ))}
        </nav>
      ) : null}
    </header>
  )
}

export default Header
```

Note on `rootMargin: '-96px 0px -70% 0px'`: the top offset keeps the "active" band clear of the sticky header, and the large bottom offset means a section is only marked active once it occupies roughly the top 30% of the viewport — this avoids flicker between adjacent short sections. This is a starting value; adjust it in Step 2 if the highlight feels early/late during manual testing.

- [ ] **Step 2: Smoke-check in the browser**

Run: `npm run dev`, open `http://localhost:5183/` at a desktop width. Scroll manually (not by clicking a link) through the page and confirm the nav link matching the visible section gets the gold color + underline, and that it updates as you keep scrolling. Repeat at a mobile width with the panel open.

- [ ] **Step 3: Commit**

```bash
git add src/components/Header/Header.jsx
git commit -m "feat: highlight active section in navigation menu"
```

---

### Task 6: Full manual verification pass

**Files:** none (verification only, no code changes expected)

**Interfaces:** none.

- [ ] **Step 1: Run the automated test suite**

Run: `npm run test`
Expected: PASS — all tests in `Icons.test.jsx` and `contact.test.js`, including the `MenuIcon`/`CloseIcon` cases added in Task 1.

- [ ] **Step 2: Full desktop pass**

Run: `npm run dev`, open `http://localhost:5183/` at a desktop width (≥1024px):
- All four nav links are visible between the logo and the WhatsApp button.
- Clicking each link smooth-scrolls to its section with the heading fully visible below the sticky header (not clipped).
- The nav link for the currently visible section is highlighted in gold with an underline while scrolling manually.
- The WhatsApp button in the header still opens `wa.me` with the pre-filled message.

- [ ] **Step 3: Full mobile pass**

In DevTools, switch to a mobile viewport (~375px):
- The desktop nav is hidden; a hamburger icon appears next to the WhatsApp button, which stays visible.
- Tapping the hamburger opens the dropdown panel with the four links, full width, pushing content down (no overlay).
- Tapping a link scrolls to the correct section, respects the same header offset as desktop, and closes the panel.
- Tapping the hamburger again (now showing the X) closes the panel without navigating.
- All tap targets (nav links, hamburger button, WhatsApp button) are at least 44px tall.

- [ ] **Step 4: Regression check on untouched sections**

Confirm `Hero`, `Services`, `ValueProps`, `HowItWorks`, and `FinalCta` still render their existing copy, order, and layout unchanged — only `id` and `scroll-margin-top` were added.

- [ ] **Step 5: Build check**

Run: `npm run build`
Expected: build succeeds with no errors or warnings introduced by the new code.

- [ ] **Step 6: Final commit (only if Step 2 uncovered adjustments)**

If the `rootMargin` tuning note from Task 5 required a change, or any spacing/offset needed a tweak during manual testing:

```bash
git add src/components/Header/Header.jsx src/components/Header/Header.module.css
git commit -m "fix: tune header nav offset/active-section detection after manual QA"
```

If no changes were needed, skip this step — nothing to commit.
