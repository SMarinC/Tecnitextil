# TECNITEXTIL Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the TECNITEXTIL landing page (Vite + React) whose only purpose is to drive visitors into a WhatsApp conversation.

**Architecture:** Static single-page React app, no backend, no build-time data fetching. One section-per-component tree assembled in `App.jsx`, a single shared `constants/contact.js` module as the source of truth for the WhatsApp number/message, and CSS Modules with a shared token file for the black/gold brand system.

**Tech Stack:** Vite, React 19, CSS Modules (no Tailwind/UI kit), Vitest (unit tests scoped to pure logic only).

Reference spec: `docs/specs/2026-08-09-landing-page-design.md`

## Global Constraints

- No backend, no form submissions of any kind — every CTA is a `wa.me` link. (Spec §1)
- Single WhatsApp phone number: `+34 685 01 80 86` → wa.me format `34685018086`. (Spec §2, §9)
- Single, exact pre-filled message for **every** CTA: `Hola, quisiera más información sobre reparación de máquinas de coser.` (Spec §9)
- Stack: Vite + React, plain JavaScript (no TypeScript), CSS Modules, mobile-first. No Tailwind, no UI component library. (Spec §5)
- No fabricated testimonials, no specific machine brands listed, no social links in the footer, no FAQ section, no multi-language. (Spec §11)
- Follow `vercel-react-best-practices` guidance throughout: focused single-responsibility components, no unnecessary re-renders, no premature abstraction. (Spec §5)
- Automated tests are scoped to pure logic only — `constants/contact.js` and the icon components (Spec §10 explicitly excludes automated tests for static content/layout; those are verified manually in the final task).
- All colors/typography come from the shared tokens defined in Task 1 — no component hardcodes a hex value.

---

## File Structure

```
Tecnitextil/
  index.html
  package.json
  vite.config.js
  .gitignore
  public/
    logo.jpeg
  src/
    main.jsx
    App.jsx
    styles/
      tokens.css
      global.css
    constants/
      contact.js
      contact.test.js
    components/
      icons/
        Icons.jsx
        Icons.test.jsx
      Header/
        Header.jsx
        Header.module.css
      Hero/
        Hero.jsx
        Hero.module.css
      Services/
        Services.jsx
        Services.module.css
      ValueProps/
        ValueProps.jsx
        ValueProps.module.css
      HowItWorks/
        HowItWorks.jsx
        HowItWorks.module.css
      FinalCta/
        FinalCta.jsx
        FinalCta.module.css
      Footer/
        Footer.jsx
        Footer.module.css
      WhatsAppFloatingButton/
        WhatsAppFloatingButton.jsx
        WhatsAppFloatingButton.module.css
```

---

### Task 1: Project scaffold, design tokens, global styles

**Files:**
- Create: `.gitignore`
- Create: `package.json`
- Create: `vite.config.js`
- Create: `index.html`
- Move: `Logo.jpeg` → `public/logo.jpeg`
- Create: `src/styles/tokens.css`
- Create: `src/styles/global.css`
- Create: `src/main.jsx`
- Create: `src/App.jsx` (temporary placeholder, replaced in Task 12)

**Interfaces:**
- Produces: CSS custom properties on `:root` (`--color-black`, `--color-gold`, `--color-cream`, `--color-white`, `--color-text-primary`, `--color-text-secondary`, `--color-text-on-dark`, `--color-text-on-dark-secondary`, `--font-heading`, `--font-body`, `--space-xs|sm|md|lg|xl`, `--radius-sm|md|full`, `--max-width`) that every later component's `.module.css` relies on.
- Produces: `public/logo.jpeg`, served at the root URL path `/logo.jpeg`, used by `Header` and `Footer`.
- Produces: `npm run dev`, `npm run build`, `npm run test` scripts.

- [ ] **Step 1: Create `.gitignore`**

```
node_modules
dist
*.local
```

- [ ] **Step 2: Create `package.json`**

```json
{
  "name": "tecnitextil-landing",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.4",
    "vite": "^6.0.5",
    "vitest": "^3.0.4"
  }
}
```

- [ ] **Step 3: Create `vite.config.js`**

```js
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node',
  },
})
```

- [ ] **Step 4: Move the logo into `public/`**

```bash
mkdir -p public
mv Logo.jpeg public/logo.jpeg
```

- [ ] **Step 5: Create `index.html`**

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/jpeg" href="/logo.jpeg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta
      name="description"
      content="TECNITEXTIL — Reparación de máquinas de coser industriales y domésticas en toda España. +20 años de experiencia. Recogida a domicilio."
    />
    <title>TECNITEXTIL — Reparación de máquinas de coser</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 6: Create `src/styles/tokens.css`**

```css
:root {
  --color-black: #0a0a0a;
  --color-black-soft: #161616;
  --color-gold: #c9a24b;
  --color-gold-light: #e0c274;
  --color-cream: #faf8f4;
  --color-white: #ffffff;

  --color-text-primary: #1a1a1a;
  --color-text-secondary: #5c5648;
  --color-text-on-dark: #f5f2ea;
  --color-text-on-dark-secondary: #c9c4b8;

  --font-heading: 'Oswald', 'Arial Narrow', sans-serif;
  --font-body: 'Inter', system-ui, -apple-system, sans-serif;

  --space-xs: 0.5rem;
  --space-sm: 1rem;
  --space-md: 1.5rem;
  --space-lg: 2.5rem;
  --space-xl: 4rem;

  --radius-sm: 8px;
  --radius-md: 16px;
  --radius-full: 999px;

  --max-width: 1120px;
}
```

- [ ] **Step 7: Create `src/styles/global.css`**

```css
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@600;700&family=Inter:wght@400;500;600&display=swap');
@import './tokens.css';

*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  -webkit-text-size-adjust: 100%;
}

body {
  margin: 0;
  font-family: var(--font-body);
  color: var(--color-text-primary);
  background: var(--color-cream);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

h1,
h2,
h3 {
  font-family: var(--font-heading);
  text-transform: uppercase;
  letter-spacing: 0.02em;
  margin: 0;
}

p {
  margin: 0;
}

img {
  max-width: 100%;
  display: block;
}

button,
a {
  font-family: inherit;
}

a {
  color: inherit;
}
```

- [ ] **Step 8: Create `src/main.jsx`**

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- [ ] **Step 9: Create a temporary placeholder `src/App.jsx`**

```jsx
function App() {
  return (
    <main>
      <p>TECNITEXTIL</p>
    </main>
  )
}

export default App
```

- [ ] **Step 10: Install dependencies**

Run: `npm install`
Expected: installs without errors, creates `node_modules` and `package-lock.json`.

- [ ] **Step 11: Verify the build pipeline works**

Run: `npm run build`
Expected: completes successfully, produces a `dist/` folder with no errors.

- [ ] **Step 12: Commit**

```bash
git add .gitignore package.json package-lock.json vite.config.js index.html public/logo.jpeg src/styles src/main.jsx src/App.jsx
git commit -m "chore: scaffold Vite + React project with brand design tokens"
```

---

### Task 2: WhatsApp contact constants (TDD)

**Files:**
- Create: `src/constants/contact.js`
- Test: `src/constants/contact.test.js`

**Interfaces:**
- Consumes: nothing (pure module).
- Produces: `PHONE_NUMBER` (string, `'34685018086'`), `WHATSAPP_MESSAGE` (string, the exact default message), `buildWhatsAppUrl(message = WHATSAPP_MESSAGE)` → returns a full `https://wa.me/...` URL string. Every component with a WhatsApp CTA (Tasks 4, 5, 9, 11) imports `buildWhatsAppUrl` from this file — no component builds the URL itself.

- [ ] **Step 1: Write the failing test**

Create `src/constants/contact.test.js`:

```js
import { describe, it, expect } from 'vitest'
import { buildWhatsAppUrl, PHONE_NUMBER, WHATSAPP_MESSAGE } from './contact.js'

describe('buildWhatsAppUrl', () => {
  it('builds a wa.me URL with the phone number and the default message, URL-encoded', () => {
    const url = buildWhatsAppUrl()
    expect(url).toBe(
      `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`,
    )
  })

  it('uses the exact copy approved for the landing page', () => {
    expect(WHATSAPP_MESSAGE).toBe(
      'Hola, quisiera más información sobre reparación de máquinas de coser.',
    )
  })

  it('uses the correct phone number in international wa.me format', () => {
    expect(PHONE_NUMBER).toBe('34685018086')
  })

  it('allows overriding the message and still encodes it correctly', () => {
    const url = buildWhatsAppUrl('Otro mensaje')
    expect(url).toBe(`https://wa.me/${PHONE_NUMBER}?text=Otro%20mensaje`)
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test`
Expected: FAIL — `src/constants/contact.js` does not exist yet.

- [ ] **Step 3: Write the minimal implementation**

Create `src/constants/contact.js`:

```js
export const PHONE_NUMBER = '34685018086'

export const WHATSAPP_MESSAGE =
  'Hola, quisiera más información sobre reparación de máquinas de coser.'

export function buildWhatsAppUrl(message = WHATSAPP_MESSAGE) {
  return `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm run test`
Expected: PASS — 4 tests green.

- [ ] **Step 5: Commit**

```bash
git add src/constants/contact.js src/constants/contact.test.js
git commit -m "feat: add shared WhatsApp contact constants and URL builder"
```

---

### Task 3: Icon set (SVG components, smoke-tested)

**Files:**
- Create: `src/components/icons/Icons.jsx`
- Test: `src/components/icons/Icons.test.jsx`

**Interfaces:**
- Consumes: nothing.
- Produces: named exports `SewingMachineIcon`, `FactoryIcon`, `TruckIcon`, `BadgeIcon`, `MapPinIcon`, `ClockIcon`, `WhatsAppIcon` — each a React function component accepting standard SVG props (e.g. `className`) and rendering a single `<svg>` line-icon using `currentColor` for stroke (so color is controlled by CSS `color`, not hardcoded per-icon). Consumed by Header (Task 4), Hero (Task 5), Services (Task 6), ValueProps (Task 7), WhatsAppFloatingButton (Task 11).

- [ ] **Step 1: Write the failing test**

Create `src/components/icons/Icons.test.jsx`:

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
} from './Icons.jsx'

const icons = {
  SewingMachineIcon,
  FactoryIcon,
  TruckIcon,
  BadgeIcon,
  MapPinIcon,
  ClockIcon,
  WhatsAppIcon,
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
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test`
Expected: FAIL — `src/components/icons/Icons.jsx` does not exist yet.

- [ ] **Step 3: Write the minimal implementation**

Create `src/components/icons/Icons.jsx`:

```jsx
export function SewingMachineIcon(props) {
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
      <path d="M3 18h14a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1h-3" />
      <path d="M3 18v-3.5a1.5 1.5 0 0 1 1.5-1.5H13" />
      <circle cx="16" cy="8" r="3" />
      <path d="M16 5V3M16 11v1" />
      <path d="M9 13V9a2 2 0 0 1 2-2h1" />
      <path d="M6 21h6" />
    </svg>
  )
}

export function FactoryIcon(props) {
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
      <path d="M3 21V11l5 3v-3l5 3v-3l5 3v7z" />
      <path d="M3 21h18" />
      <path d="M8 21v-4M13 21v-4M18 21v-4" />
      <path d="M18 11V7l3 2" />
    </svg>
  )
}

export function TruckIcon(props) {
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
      <path d="M2 7h11v9H2z" />
      <path d="M13 10h4l3 3v3h-7z" />
      <circle cx="6" cy="18" r="1.6" />
      <circle cx="17" cy="18" r="1.6" />
    </svg>
  )
}

export function BadgeIcon(props) {
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
      <circle cx="12" cy="9" r="6" />
      <path d="M9 14.5 7.5 21l4.5-2.5L16.5 21 15 14.5" />
    </svg>
  )
}

export function MapPinIcon(props) {
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
      <path d="M12 21s7-6.4 7-11.5A7 7 0 0 0 5 9.5C5 14.6 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.3" />
    </svg>
  )
}

export function ClockIcon(props) {
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
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  )
}

export function WhatsAppIcon(props) {
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
      <path d="M4 20l1.4-4.2A8 8 0 1 1 8.8 19L4 20z" />
      <path d="M8.5 10.5c.3 2 2 3.7 4 4" />
    </svg>
  )
}
```

Note: `WhatsAppIcon` is a hand-drawn generic chat-bubble glyph in the same line-icon style as the rest of the set — deliberately not a reproduction of Meta's trademarked WhatsApp logo. The button label text ("WhatsApp") next to it already communicates the destination.

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm run test`
Expected: PASS — 14 tests green (2 per icon × 7 icons), plus the 4 from Task 2.

- [ ] **Step 5: Commit**

```bash
git add src/components/icons/Icons.jsx src/components/icons/Icons.test.jsx
git commit -m "feat: add shared line-icon set for services and value props"
```

---

### Task 4: Header component

**Files:**
- Create: `src/components/Header/Header.jsx`
- Create: `src/components/Header/Header.module.css`

**Interfaces:**
- Consumes: `buildWhatsAppUrl` from `../../constants/contact.js` (Task 2); `WhatsAppIcon` from `../icons/Icons.jsx` (Task 3); `public/logo.jpeg` (Task 1).
- Produces: default export `Header`, a component with no props, consumed by `App.jsx` (Task 12).

- [ ] **Step 1: Create `src/components/Header/Header.jsx`**

```jsx
import styles from './Header.module.css'
import { buildWhatsAppUrl } from '../../constants/contact.js'
import { WhatsAppIcon } from '../icons/Icons.jsx'

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <img src="/logo.jpeg" alt="TECNITEXTIL" className={styles.logo} />
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

- [ ] **Step 2: Create `src/components/Header/Header.module.css`**

```css
.header {
  position: sticky;
  top: 0;
  z-index: 20;
  background: var(--color-black);
  border-bottom: 1px solid rgba(201, 162, 75, 0.25);
}

.inner {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: var(--space-xs) var(--space-md);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  height: 40px;
  width: 40px;
  border-radius: var(--radius-full);
  object-fit: cover;
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
```

- [ ] **Step 3: Verify it renders**

Run: `npm run build`
Expected: succeeds with no errors (Header is not wired into `App.jsx` yet, so this only confirms it compiles — visual check happens in Task 13 once assembled).

- [ ] **Step 4: Commit**

```bash
git add src/components/Header
git commit -m "feat: add Header component with logo and WhatsApp CTA"
```

---

### Task 5: Hero component

**Files:**
- Create: `src/components/Hero/Hero.jsx`
- Create: `src/components/Hero/Hero.module.css`

**Interfaces:**
- Consumes: `buildWhatsAppUrl` (Task 2), `SewingMachineIcon` (Task 3).
- Produces: default export `Hero`, no props, consumed by `App.jsx` (Task 12).

- [ ] **Step 1: Create `src/components/Hero/Hero.jsx`**

```jsx
import styles from './Hero.module.css'
import { buildWhatsAppUrl } from '../../constants/contact.js'
import { SewingMachineIcon } from '../icons/Icons.jsx'

function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        <SewingMachineIcon className={styles.icon} />
        <h1 className={styles.title}>
          +20 años reparando máquinas de coser, sin parar tu producción
        </h1>
        <p className={styles.subtitle}>
          Reparamos máquinas de coser industriales y domésticas de cualquier
          marca, con cobertura en toda España y recogida a domicilio.
        </p>
        <a
          href={buildWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.cta}
        >
          Escribir por WhatsApp
        </a>
      </div>
    </section>
  )
}

export default Hero
```

- [ ] **Step 2: Create `src/components/Hero/Hero.module.css`**

```css
.hero {
  background: radial-gradient(
    circle at 50% 0%,
    #1c1a14 0%,
    var(--color-black) 60%
  );
  color: var(--color-text-on-dark);
  padding: clamp(3rem, 8vw, 6rem) var(--space-md);
}

.inner {
  max-width: 720px;
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-md);
}

.icon {
  width: 56px;
  height: 56px;
  color: var(--color-gold);
}

.title {
  font-size: clamp(1.75rem, 5vw, 3rem);
  line-height: 1.15;
  color: var(--color-white);
}

.subtitle {
  font-size: 1.05rem;
  color: var(--color-text-on-dark-secondary);
  max-width: 46ch;
}

.cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--color-gold);
  color: var(--color-black);
  font-weight: 600;
  font-size: 1.05rem;
  padding: 0.9rem 2rem;
  border-radius: var(--radius-full);
  text-decoration: none;
  min-height: 48px;
}
```

- [ ] **Step 3: Verify it compiles**

Run: `npm run build`
Expected: succeeds with no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/Hero
git commit -m "feat: add Hero section with headline and primary WhatsApp CTA"
```

---

### Task 6: Services component

**Files:**
- Create: `src/components/Services/Services.jsx`
- Create: `src/components/Services/Services.module.css`

**Interfaces:**
- Consumes: `SewingMachineIcon`, `FactoryIcon`, `TruckIcon` (Task 3).
- Produces: default export `Services`, no props, consumed by `App.jsx` (Task 12).

- [ ] **Step 1: Create `src/components/Services/Services.jsx`**

```jsx
import styles from './Services.module.css'
import { SewingMachineIcon, FactoryIcon, TruckIcon } from '../icons/Icons.jsx'

const SERVICES = [
  {
    Icon: SewingMachineIcon,
    title: 'Reparación de máquinas de coser',
    description:
      'Diagnóstico y reparación de máquinas industriales y domésticas de cualquier marca o modelo.',
  },
  {
    Icon: FactoryIcon,
    title: 'Soporte a empresas textiles',
    description:
      'Mantenimiento y asistencia técnica para reducir paradas y mejorar tus tiempos de producción.',
  },
  {
    Icon: TruckIcon,
    title: 'Recogida a domicilio',
    description:
      'Recogemos tu máquina donde te venga bien y te la devolvemos lista para coser.',
  },
]

function Services() {
  return (
    <section className={styles.services}>
      <h2 className={styles.heading}>Qué hacemos</h2>
      <div className={styles.grid}>
        {SERVICES.map(({ Icon, title, description }) => (
          <article className={styles.card} key={title}>
            <Icon className={styles.cardIcon} />
            <h3 className={styles.cardTitle}>{title}</h3>
            <p className={styles.cardDescription}>{description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Services
```

- [ ] **Step 2: Create `src/components/Services/Services.module.css`**

```css
.services {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: var(--space-xl) var(--space-md);
}

.heading {
  font-size: clamp(1.5rem, 4vw, 2.25rem);
  color: var(--color-text-primary);
  text-align: center;
  margin-bottom: var(--space-lg);
}

.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-md);
}

.card {
  background: var(--color-white);
  border: 1px solid rgba(10, 10, 10, 0.08);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.cardIcon {
  width: 36px;
  height: 36px;
  color: var(--color-gold);
}

.cardTitle {
  font-size: 1.1rem;
  color: var(--color-text-primary);
}

.cardDescription {
  color: var(--color-text-secondary);
  font-size: 0.95rem;
}

@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

- [ ] **Step 3: Verify it compiles**

Run: `npm run build`
Expected: succeeds with no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/Services
git commit -m "feat: add Services section with the three core offerings"
```

---

### Task 7: ValueProps component ("Por qué elegirnos")

**Files:**
- Create: `src/components/ValueProps/ValueProps.jsx`
- Create: `src/components/ValueProps/ValueProps.module.css`

**Interfaces:**
- Consumes: `BadgeIcon`, `MapPinIcon`, `ClockIcon`, `TruckIcon` (Task 3).
- Produces: default export `ValueProps`, no props, consumed by `App.jsx` (Task 12).

- [ ] **Step 1: Create `src/components/ValueProps/ValueProps.jsx`**

```jsx
import styles from './ValueProps.module.css'
import { BadgeIcon, MapPinIcon, ClockIcon, TruckIcon } from '../icons/Icons.jsx'

const VALUE_PROPS = [
  { Icon: BadgeIcon, label: '+20 años de experiencia' },
  { Icon: MapPinIcon, label: 'Cobertura en toda España' },
  { Icon: ClockIcon, label: 'Respuesta rápida por WhatsApp' },
  { Icon: TruckIcon, label: 'Recogida a domicilio incluida' },
]

function ValueProps() {
  return (
    <section className={styles.section}>
      <ul className={styles.list}>
        {VALUE_PROPS.map(({ Icon, label }) => (
          <li className={styles.item} key={label}>
            <Icon className={styles.icon} />
            <span>{label}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default ValueProps
```

- [ ] **Step 2: Create `src/components/ValueProps/ValueProps.module.css`**

```css
.section {
  background: var(--color-black);
}

.list {
  list-style: none;
  margin: 0;
  padding: var(--space-lg) var(--space-md);
  max-width: var(--max-width);
  margin-inline: auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-md);
}

.item {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  color: var(--color-text-on-dark);
  font-weight: 500;
}

.icon {
  width: 28px;
  height: 28px;
  color: var(--color-gold);
  flex-shrink: 0;
}

@media (min-width: 768px) {
  .list {
    grid-template-columns: repeat(4, 1fr);
  }

  .item {
    flex-direction: column;
    text-align: center;
  }
}
```

- [ ] **Step 3: Verify it compiles**

Run: `npm run build`
Expected: succeeds with no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/ValueProps
git commit -m "feat: add ValueProps section reinforcing experience and coverage"
```

---

### Task 8: HowItWorks component

**Files:**
- Create: `src/components/HowItWorks/HowItWorks.jsx`
- Create: `src/components/HowItWorks/HowItWorks.module.css`

**Interfaces:**
- Consumes: nothing beyond static data.
- Produces: default export `HowItWorks`, no props, consumed by `App.jsx` (Task 12).

- [ ] **Step 1: Create `src/components/HowItWorks/HowItWorks.jsx`**

```jsx
import styles from './HowItWorks.module.css'

const STEPS = [
  {
    number: '1',
    title: 'Escríbenos por WhatsApp',
    description: 'Cuéntanos qué avería tiene tu máquina de coser.',
  },
  {
    number: '2',
    title: 'Coordinamos recogida o visita',
    description: 'Vemos si recogemos tu máquina o la revisamos in situ.',
  },
  {
    number: '3',
    title: 'Reparamos y te la devolvemos',
    description: 'Te la entregamos lista para volver a producir.',
  },
]

function HowItWorks() {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Cómo funciona</h2>
      <ol className={styles.steps}>
        {STEPS.map(({ number, title, description }) => (
          <li className={styles.step} key={number}>
            <span className={styles.number}>{number}</span>
            <h3 className={styles.stepTitle}>{title}</h3>
            <p className={styles.stepDescription}>{description}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

export default HowItWorks
```

- [ ] **Step 2: Create `src/components/HowItWorks/HowItWorks.module.css`**

```css
.section {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: var(--space-xl) var(--space-md);
}

.heading {
  font-size: clamp(1.5rem, 4vw, 2.25rem);
  text-align: center;
  color: var(--color-text-primary);
  margin-bottom: var(--space-lg);
}

.steps {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-lg);
  counter-reset: step;
}

.step {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xs);
}

.number {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  background: var(--color-gold);
  color: var(--color-black);
  font-family: var(--font-heading);
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stepTitle {
  font-size: 1.05rem;
  color: var(--color-text-primary);
}

.stepDescription {
  color: var(--color-text-secondary);
  font-size: 0.95rem;
  max-width: 32ch;
}

@media (min-width: 768px) {
  .steps {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

- [ ] **Step 3: Verify it compiles**

Run: `npm run build`
Expected: succeeds with no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/HowItWorks
git commit -m "feat: add HowItWorks section with the 3-step process"
```

---

### Task 9: FinalCta component

**Files:**
- Create: `src/components/FinalCta/FinalCta.jsx`
- Create: `src/components/FinalCta/FinalCta.module.css`

**Interfaces:**
- Consumes: `buildWhatsAppUrl` (Task 2).
- Produces: default export `FinalCta`, no props, consumed by `App.jsx` (Task 12).

- [ ] **Step 1: Create `src/components/FinalCta/FinalCta.jsx`**

```jsx
import styles from './FinalCta.module.css'
import { buildWhatsAppUrl } from '../../constants/contact.js'

function FinalCta() {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>
        ¿Tu máquina de coser necesita reparación?
      </h2>
      <p className={styles.subheading}>
        Escríbenos ahora y te respondemos por WhatsApp.
      </p>
      <a
        href={buildWhatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.cta}
      >
        Escribir por WhatsApp
      </a>
    </section>
  )
}

export default FinalCta
```

- [ ] **Step 2: Create `src/components/FinalCta/FinalCta.module.css`**

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
}

.heading {
  font-size: clamp(1.5rem, 4vw, 2.25rem);
  color: var(--color-white);
  max-width: 24ch;
}

.subheading {
  color: var(--color-text-on-dark-secondary);
}

.cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--color-gold);
  color: var(--color-black);
  font-weight: 600;
  font-size: 1.05rem;
  padding: 0.9rem 2rem;
  border-radius: var(--radius-full);
  text-decoration: none;
  min-height: 48px;
}
```

- [ ] **Step 3: Verify it compiles**

Run: `npm run build`
Expected: succeeds with no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/FinalCta
git commit -m "feat: add closing FinalCta section"
```

---

### Task 10: Footer component

**Files:**
- Create: `src/components/Footer/Footer.jsx`
- Create: `src/components/Footer/Footer.module.css`

**Interfaces:**
- Consumes: `public/logo.jpeg` (Task 1).
- Produces: default export `Footer`, no props, consumed by `App.jsx` (Task 12).

- [ ] **Step 1: Create `src/components/Footer/Footer.jsx`**

```jsx
import styles from './Footer.module.css'

const PHONE_DISPLAY = '+34 685 01 80 86'
const PHONE_TEL = 'tel:+34685018086'

function Footer() {
  return (
    <footer className={styles.footer}>
      <img src="/logo.jpeg" alt="TECNITEXTIL" className={styles.logo} />
      <p className={styles.coverage}>Servicio en toda España</p>
      <a href={PHONE_TEL} className={styles.phone}>
        {PHONE_DISPLAY}
      </a>
      <p className={styles.copyright}>
        © {new Date().getFullYear()} TECNITEXTIL. Todos los derechos
        reservados.
      </p>
    </footer>
  )
}

export default Footer
```

- [ ] **Step 2: Create `src/components/Footer/Footer.module.css`**

```css
.footer {
  background: var(--color-black-soft);
  color: var(--color-text-on-dark-secondary);
  text-align: center;
  padding: var(--space-lg) var(--space-md);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xs);
}

.logo {
  height: 44px;
  width: 44px;
  border-radius: var(--radius-full);
  object-fit: cover;
  margin-bottom: var(--space-xs);
}

.coverage {
  font-size: 0.9rem;
}

.phone {
  color: var(--color-gold-light);
  text-decoration: none;
  font-weight: 500;
}

.copyright {
  font-size: 0.8rem;
  margin-top: var(--space-sm);
}
```

- [ ] **Step 3: Verify it compiles**

Run: `npm run build`
Expected: succeeds with no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/Footer
git commit -m "feat: add minimal Footer with phone and coverage"
```

---

### Task 11: WhatsAppFloatingButton component

**Files:**
- Create: `src/components/WhatsAppFloatingButton/WhatsAppFloatingButton.jsx`
- Create: `src/components/WhatsAppFloatingButton/WhatsAppFloatingButton.module.css`

**Interfaces:**
- Consumes: `buildWhatsAppUrl` (Task 2), `WhatsAppIcon` (Task 3).
- Produces: default export `WhatsAppFloatingButton`, no props, consumed by `App.jsx` (Task 12).

- [ ] **Step 1: Create `src/components/WhatsAppFloatingButton/WhatsAppFloatingButton.jsx`**

```jsx
import styles from './WhatsAppFloatingButton.module.css'
import { buildWhatsAppUrl } from '../../constants/contact.js'
import { WhatsAppIcon } from '../icons/Icons.jsx'

function WhatsAppFloatingButton() {
  return (
    <a
      href={buildWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.button}
      aria-label="Escribir por WhatsApp"
    >
      <WhatsAppIcon className={styles.icon} />
    </a>
  )
}

export default WhatsAppFloatingButton
```

- [ ] **Step 2: Create `src/components/WhatsAppFloatingButton/WhatsAppFloatingButton.module.css`**

```css
.button {
  position: fixed;
  right: max(1rem, env(safe-area-inset-right));
  bottom: max(1rem, env(safe-area-inset-bottom));
  width: 56px;
  height: 56px;
  border-radius: var(--radius-full);
  background: var(--color-gold);
  color: var(--color-black);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3);
  z-index: 50;
}

.icon {
  width: 28px;
  height: 28px;
}
```

- [ ] **Step 3: Verify it compiles**

Run: `npm run build`
Expected: succeeds with no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/WhatsAppFloatingButton
git commit -m "feat: add fixed WhatsApp floating button"
```

---

### Task 12: Assemble the page in App.jsx

**Files:**
- Modify: `src/App.jsx` (replace the Task 1 placeholder)

**Interfaces:**
- Consumes: `Header` (Task 4), `Hero` (Task 5), `Services` (Task 6), `ValueProps` (Task 7), `HowItWorks` (Task 8), `FinalCta` (Task 9), `Footer` (Task 10), `WhatsAppFloatingButton` (Task 11).
- Produces: default export `App`, the full assembled page, consumed by `src/main.jsx` (Task 1).

- [ ] **Step 1: Replace `src/App.jsx`**

```jsx
import Header from './components/Header/Header.jsx'
import Hero from './components/Hero/Hero.jsx'
import Services from './components/Services/Services.jsx'
import ValueProps from './components/ValueProps/ValueProps.jsx'
import HowItWorks from './components/HowItWorks/HowItWorks.jsx'
import FinalCta from './components/FinalCta/FinalCta.jsx'
import Footer from './components/Footer/Footer.jsx'
import WhatsAppFloatingButton from './components/WhatsAppFloatingButton/WhatsAppFloatingButton.jsx'

function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Services />
        <ValueProps />
        <HowItWorks />
        <FinalCta />
      </main>
      <Footer />
      <WhatsAppFloatingButton />
    </>
  )
}

export default App
```

- [ ] **Step 2: Verify the full build**

Run: `npm run build`
Expected: succeeds with no errors.

- [ ] **Step 3: Run the full test suite**

Run: `npm run test`
Expected: PASS — all tests from Tasks 2 and 3 still green (18 tests total).

- [ ] **Step 4: Commit**

```bash
git add src/App.jsx
git commit -m "feat: assemble full landing page from all sections"
```

---

### Task 13: Manual responsive and functional verification (final pass)

This task has no automated test — per spec §10, layout/content correctness for static sections is verified manually in a real viewport, not through component tests. This is the last task before considering the page done.

**Files:** none (verification only; fix forward in the relevant component file if something fails).

- [ ] **Step 1: Start the dev server**

Run: `npm run dev`
Expected: prints a local URL (e.g. `http://localhost:5173`).

- [ ] **Step 2: Check mobile viewport (375px width)**

Open the dev server URL, switch DevTools to a 375×667 mobile viewport, and confirm:
- All text is readable without horizontal scrolling.
- The Hero title and CTA are fully visible without being cut off.
- Service cards stack in a single column.
- The floating WhatsApp button is visible in the bottom-right corner and does not overlap the FinalCta button or the footer content when scrolled to the bottom.
- Every WhatsApp button/link has a tappable area of at least 44×44px (inspect computed box size in DevTools).

- [ ] **Step 3: Verify the wa.me links**

In DevTools, inspect the `href` of the Header CTA, Hero CTA, FinalCta CTA, and the floating button. Confirm each one is exactly:

```
https://wa.me/34685018086?text=Hola%2C%20quisiera%20m%C3%A1s%20informaci%C3%B3n%20sobre%20reparaci%C3%B3n%20de%20m%C3%A1quinas%20de%20coser.
```

Click one and confirm it opens WhatsApp Web/app with the message pre-filled.

- [ ] **Step 4: Check tablet and desktop breakpoints**

Resize to ~768px and ~1280px widths. Confirm the Services grid becomes 3 columns, the ValueProps list becomes 4 columns, and the HowItWorks steps become 3 columns, with no overlapping or overflowing content at either breakpoint.

- [ ] **Step 5: Stop the dev server and do a final production build**

Run: `npm run build && npm run preview`
Open the printed preview URL and repeat the mobile check from Step 2 against the production build (not just dev mode) to confirm there's no dev-only behavior masking a real issue.

- [ ] **Step 6: Commit any fixes found during verification**

If Steps 2–5 required changes to any component file, stage and commit them:

```bash
git add -A
git commit -m "fix: address responsive/verification issues found in manual pass"
```

If no changes were needed, skip this step — there is nothing to commit.
