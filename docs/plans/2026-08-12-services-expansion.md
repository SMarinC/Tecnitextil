# Services Expansion (Process + Machine Types) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend `Services` ("Qué hacemos") with a 5-step repair/maintenance process block, add a new `MachineTypes` ("Tipos de máquina") section, and update the header nav to include it — including a required breakpoint fix so the 5th nav item doesn't push the WhatsApp CTA off-screen.

**Architecture:** The process block lives inside the existing `Services.jsx`/`Services.module.css` (no new component, not a separate nav-linked section). `MachineTypes` is a new, independent section component following the same `outer` (full-bleed background) + `.inner` (max-width content) pattern already used by `Services`/`ValueProps`. Both the process steps and machine types are data arrays (`PROCESS_STEPS`, `MACHINE_TYPES`) rendered via `.map()`, matching every other section in the codebase. Two new stroke-style SVG icons are added to the shared `Icons.jsx`.

**Tech Stack:** Vite, React 19, CSS Modules, Vitest (`environment: 'node'`, tests scoped to pure render output via `react-dom/server` — no `jsdom`, no simulated clicks/scroll).

Reference spec: `docs/specs/2026-08-12-services-expansion-design.md`

## Global Constraints

- Copy is final and approved — use it verbatim from Spec §3, do not rephrase further. (Spec §3)
- `MachineTypes` gets its own `id="tipos-de-maquina"` and its own nav entry; the process block inside `Services` does NOT get a separate id or nav entry — it's part of `#que-hacemos`. (Spec §2, §4)
- `MachineTypes` section background is `var(--color-black)` (matching `ValueProps`), not `var(--color-black-soft)` — `Services` already uses the soft tone, so the new section needs the deeper black to read as a visual break. (Spec §6)
- The process block's icon-free numbered steps reuse the exact visual pattern of `HowItWorks` (gold circle, number, title, description) but are implemented as new CSS classes scoped inside `Services.module.css` — no shared component extracted, matching the project's existing "one responsibility per folder" convention. (Spec §5, §7)
- `MachineTypes`'s list of 3 has NO card/box background — icon + title + description directly on the section background. (Spec §3.2, §8)
- New icons (`ScissorsIcon`, `GearIcon`) must match the existing icon style exactly: `viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"`, `strokeWidth="1.5"`, `strokeLinecap="round"`, `strokeLinejoin="round"`, `aria-hidden="true"`, `{...props}` spread. (existing `Icons.jsx` precedent)
- Header breakpoint for switching between desktop nav and mobile hamburger moves from `768px` to `960px` in BOTH `Header.module.css`'s `@media` query and `Header.jsx`'s `DESKTOP_BREAKPOINT_QUERY` constant — they must stay in sync (already documented via a comment on the constant). Section-grid breakpoints (`Services`, `ValueProps`, `HowItWorks`, `MachineTypes`) stay at `768px` — only the nav breakpoint changes. (Spec §6)
- All colors/spacing/typography come from existing tokens in `src/styles/tokens.css` — no new tokens needed, no hardcoded hex values.
- Automated tests stay scoped to pure render output (icon components) — no new test files for `Services.jsx`, `MachineTypes.jsx`, or `Header.jsx` behavior; verified manually in the final task, matching the existing project precedent.

---

## File Structure

```
src/
  components/
    icons/
      Icons.jsx                    # + ScissorsIcon, GearIcon
      Icons.test.jsx               # + coverage for the two new icons
    Services/
      Services.jsx                 # + PROCESS_STEPS array, process block JSX
      Services.module.css          # + .process* classes (heading/intro/steps/
                                    #   step/number/stepTitle/stepDescription)
    MachineTypes/                  # NEW component folder
      MachineTypes.jsx             # MACHINE_TYPES array, section markup
      MachineTypes.module.css      # section/inner/heading/intro/list/item styles
    Header/
      Header.jsx                   # + NAV_ITEMS entry, breakpoint 768→960
      Header.module.css            # breakpoint 768→960
  App.jsx                          # + <MachineTypes /> between <Services /> and <ValueProps />
```

---

### Task 1: `ScissorsIcon` and `GearIcon`

**Files:**
- Modify: `src/components/icons/Icons.jsx`
- Modify: `src/components/icons/Icons.test.jsx`

**Interfaces:**
- Produces: `ScissorsIcon(props)`, `GearIcon(props)` — React components, same signature as every other icon in `Icons.jsx` (accepts `className` via `{...props}`).

- [ ] **Step 1: Register the new icons in the test file first**

Edit `src/components/icons/Icons.test.jsx` — add `ScissorsIcon` and `GearIcon` to both the import list and the `icons` object:

```jsx
import {
  SewingMachineIcon,
  FactoryIcon,
  TruckIcon,
  ClipboardCheckIcon,
  ScissorsIcon,
  GearIcon,
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
  ClipboardCheckIcon,
  ScissorsIcon,
  GearIcon,
  BadgeIcon,
  MapPinIcon,
  ClockIcon,
  WhatsAppIcon,
  MenuIcon,
  CloseIcon,
}
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm run test -- --run`
Expected: FAIL — `Icons.test.jsx` errors because `ScissorsIcon`/`GearIcon` are `undefined` (not yet exported from `Icons.jsx`).

- [ ] **Step 3: Implement the two icons**

Edit `src/components/icons/Icons.jsx` — add both functions (placed after `ClipboardCheckIcon`, before `TruckIcon`, keeping related "service" icons grouped):

```jsx
export function ScissorsIcon(props) {
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
      <circle cx="6" cy="6" r="2.5" />
      <circle cx="6" cy="18" r="2.5" />
      <path d="M8.5 7.5 20 19M8.5 16.5 20 5" />
    </svg>
  )
}

export function GearIcon(props) {
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
      <circle cx="12" cy="12" r="3" />
      <path d="M12 4v2M12 18v2M4 12h2M18 12h2M6.3 6.3l1.4 1.4M16.3 16.3l1.4 1.4M6.3 17.7l1.4-1.4M16.3 7.7l1.4-1.4" />
    </svg>
  )
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm run test -- --run`
Expected: PASS — all icon tests green, including the 3 new assertions each for `ScissorsIcon` and `GearIcon` (renders svg, forwards className, aria-hidden + currentColor stroke).

- [ ] **Step 5: Commit**

```bash
git add src/components/icons/Icons.jsx src/components/icons/Icons.test.jsx
git commit -m "feat: add ScissorsIcon and GearIcon"
```

---

### Task 2: `MachineTypes` section component

**Files:**
- Create: `src/components/MachineTypes/MachineTypes.jsx`
- Create: `src/components/MachineTypes/MachineTypes.module.css`
- Modify: `src/App.jsx`

**Interfaces:**
- Consumes: `SewingMachineIcon` (existing), `ScissorsIcon`, `GearIcon` (from Task 1) — all from `../icons/Icons.jsx`.
- Produces: `MachineTypes` — default-exported React component, no props. Renders a `<section id="tipos-de-maquina">`.

- [ ] **Step 1: Create the component**

Create `src/components/MachineTypes/MachineTypes.jsx`:

```jsx
import styles from './MachineTypes.module.css'
import { SewingMachineIcon, ScissorsIcon, GearIcon } from '../icons/Icons.jsx'

const MACHINE_TYPES = [
  {
    Icon: SewingMachineIcon,
    title: 'Costura industrial',
    description:
      'Máquinas planas, de triple arrastre, remalladoras, recubridoras y otros equipos de confección que necesitan estar siempre a punto.',
  },
  {
    Icon: ScissorsIcon,
    title: 'Corte textil',
    description: 'Distintos tipos de cortadoras para materias primas.',
  },
  {
    Icon: GearIcon,
    title: 'Equipos auxiliares',
    description:
      'Cortadoras automáticas, mesas de aspiración, entre otros complementos de tu proceso.',
  },
]

function MachineTypes() {
  return (
    <section className={styles.section} id="tipos-de-maquina">
      <div className={styles.inner}>
        <h2 className={styles.heading}>Tipos de máquina</h2>
        <p className={styles.intro}>
          Trabajamos con equipos de corte, confección, tapicería y acabados —
          cada uno con un ajuste distinto según el material y el ritmo de
          trabajo.
        </p>
        <ul className={styles.list}>
          {MACHINE_TYPES.map(({ Icon, title, description }) => (
            <li className={styles.item} key={title}>
              <Icon className={styles.icon} />
              <h3 className={styles.itemTitle}>{title}</h3>
              <p className={styles.itemDescription}>{description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default MachineTypes
```

- [ ] **Step 2: Create the styles**

Create `src/components/MachineTypes/MachineTypes.module.css`:

```css
.section {
  background: var(--color-black);
  scroll-margin-top: var(--header-offset);
}

.inner {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: var(--space-xl) var(--space-md);
}

.heading {
  font-size: clamp(1.5rem, 4vw, 2.25rem);
  color: var(--color-white);
  text-align: center;
  margin-bottom: var(--space-sm);
}

.intro {
  color: var(--color-text-on-dark-secondary);
  text-align: center;
  max-width: 60ch;
  margin: 0 auto var(--space-lg);
}

.list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-lg);
}

.item {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xs);
}

.icon {
  width: 36px;
  height: 36px;
  color: var(--color-gold);
}

.itemTitle {
  font-size: 1.1rem;
  color: var(--color-white);
}

.itemDescription {
  color: var(--color-text-on-dark-secondary);
  font-size: 0.95rem;
  max-width: 32ch;
}

@media (min-width: 768px) {
  .list {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

- [ ] **Step 3: Wire it into the page**

Edit `src/App.jsx` — add the import and insert `<MachineTypes />` between `<Services />` and `<ValueProps />`:

```jsx
import Header from './components/Header/Header.jsx'
import Hero from './components/Hero/Hero.jsx'
import Services from './components/Services/Services.jsx'
import MachineTypes from './components/MachineTypes/MachineTypes.jsx'
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
        <MachineTypes />
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

- [ ] **Step 4: Run the existing test suite and build to verify nothing broke**

Run: `npm run test -- --run`
Expected: PASS — same test count as before this task (this task adds no new automated tests, only a new component).

Run: `npm run build`
Expected: build succeeds with no errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/MachineTypes/MachineTypes.jsx src/components/MachineTypes/MachineTypes.module.css src/App.jsx
git commit -m "feat: add MachineTypes section"
```

---

### Task 3: Repair/maintenance process block inside `Services`

**Files:**
- Modify: `src/components/Services/Services.jsx`
- Modify: `src/components/Services/Services.module.css`

**Interfaces:**
- Consumes: nothing new (no new icon — the process steps use numbered circles, not icons, matching `HowItWorks`).
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Add the `PROCESS_STEPS` array and JSX**

Edit `src/components/Services/Services.jsx` — add the data array after `SERVICES`, and the new markup inside `.inner`, after the closing `</div>` of `.grid`:

```jsx
import styles from './Services.module.css'
import { SewingMachineIcon, FactoryIcon, ClipboardCheckIcon } from '../icons/Icons.jsx'

const SERVICES = [
  {
    Icon: SewingMachineIcon,
    title: 'Mantenimiento, venta y reparación',
    description:
      'Servicio integral de máquinas de coser industriales y domésticas.',
  },
  {
    Icon: FactoryIcon,
    title: 'Soporte a empresas textiles',
    description:
      'Mantenimiento y asistencia técnica para reducir paradas y mejorar tus tiempos de producción.',
  },
  {
    Icon: ClipboardCheckIcon,
    title: 'Asesoría técnica',
    description:
      'Diagnóstico ante fallas comunes y cómo prevenirlas para que no se repitan.',
  },
]

const PROCESS_STEPS = [
  {
    number: '1',
    title: 'Diagnóstico',
    description:
      'Evaluamos el estado general del equipo y detectamos qué está afectando su funcionamiento.',
  },
  {
    number: '2',
    title: 'Ajuste de máquinas',
    description:
      'Ajustamos la maquinaria de costura, corte y equipos auxiliares del taller.',
  },
  {
    number: '3',
    title: 'Revisión mecánica',
    description:
      'Revisamos los componentes mecánicos que se desgastan con el uso intensivo.',
  },
  {
    number: '4',
    title: 'Limpieza y sistemas auxiliares',
    description:
      'Revisamos y limpiamos los sistemas auxiliares y las zonas que suelen acumular suciedad y provocar fallos.',
  },
  {
    number: '5',
    title: 'Prueba final',
    description:
      'Comprobamos el resultado con el material de trabajo, verificando fuerza y precisión.',
  },
]

function Services() {
  return (
    <section className={styles.services} id="que-hacemos">
      <div className={styles.inner}>
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
        <h3 className={styles.processHeading}>
          ¿Cómo es el proceso de reparación y mantenimiento?
        </h3>
        <p className={styles.processIntro}>
          Un servicio adaptado a las necesidades de cada cliente, en el que
          revisamos y prevenimos averías en maquinaria de producción, corte,
          tapicería y confección.
        </p>
        <ol className={styles.processSteps}>
          {PROCESS_STEPS.map(({ number, title, description }) => (
            <li className={styles.processStep} key={number}>
              <span className={styles.processNumber}>{number}</span>
              <h4 className={styles.processStepTitle}>{title}</h4>
              <p className={styles.processStepDescription}>{description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export default Services
```

Note: `SERVICES`'s third entry (`ClipboardCheckIcon` / "Asesoría técnica") is already the current state of this file from prior work in this session — included here so the whole file is shown, not modified by this task.

- [ ] **Step 2: Add the process block styles**

Edit `src/components/Services/Services.module.css` — append after the existing `@media (min-width: 768px)` block:

```css
.processHeading {
  font-size: clamp(1.25rem, 3vw, 1.75rem);
  color: var(--color-white);
  text-align: center;
  margin-top: var(--space-xl);
  margin-bottom: var(--space-sm);
}

.processIntro {
  color: var(--color-text-on-dark-secondary);
  text-align: center;
  max-width: 60ch;
  margin: 0 auto var(--space-lg);
}

.processSteps {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-lg);
}

.processStep {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xs);
}

.processNumber {
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

.processStepTitle {
  font-size: 1.05rem;
  color: var(--color-white);
}

.processStepDescription {
  color: var(--color-text-on-dark-secondary);
  font-size: 0.95rem;
  max-width: 32ch;
}

@media (min-width: 768px) {
  .processSteps {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

- [ ] **Step 3: Run the existing test suite and build to verify nothing broke**

Run: `npm run test -- --run`
Expected: PASS — same test count as Task 2 (no new automated tests added here either).

Run: `npm run build`
Expected: build succeeds with no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/Services/Services.jsx src/components/Services/Services.module.css
git commit -m "feat: add repair/maintenance process block to Services"
```

---

### Task 4: Header nav entry + breakpoint fix

**Files:**
- Modify: `src/components/Header/Header.jsx`
- Modify: `src/components/Header/Header.module.css`

**Interfaces:**
- Consumes: `#tipos-de-maquina` anchor (produced by Task 2's `MachineTypes`).

- [ ] **Step 1: Add the nav item and raise the breakpoint constant**

Edit `src/components/Header/Header.jsx`:

```jsx
const NAV_ITEMS = [
  { label: 'Qué hacemos', href: '#que-hacemos' },
  { label: 'Tipos de máquina', href: '#tipos-de-maquina' },
  { label: 'Por qué elegirnos', href: '#por-que-elegirnos' },
  { label: 'Cómo funciona', href: '#como-funciona' },
  { label: 'Contáctanos', href: '#contacto' },
]

// Must match the @media (min-width: 960px) breakpoint in Header.module.css
// where the mobile hamburger panel gives way to the desktop nav. Raised from
// 768px to 960px because 5 nav items + logo + WhatsApp CTA need ~900px of
// horizontal space — below that the CTA overflows off-screen (verified in
// browser: 131px overflow at 768px, CTA fully invisible).
const DESKTOP_BREAKPOINT_QUERY = '(min-width: 960px)'
```

(Only the `NAV_ITEMS` array and the `DESKTOP_BREAKPOINT_QUERY` constant change — the rest of `Header.jsx` is untouched, since the active-section observer, click handler, and matchMedia effect already work generically over `NAV_ITEMS`.)

- [ ] **Step 2: Raise the CSS breakpoint**

Edit `src/components/Header/Header.module.css` — change the nav/hamburger breakpoint:

```css
@media (min-width: 960px) {
  .nav {
    display: flex;
  }

  .menuToggle,
  .mobileNav {
    display: none;
  }
}
```

(This is the same rule block that currently reads `@media (min-width: 768px)` — only the number changes, from `768px` to `960px`. The other `@media (min-width: 640px) { .cta { display: inline-flex; } }` block above it is unrelated and stays at `640px`.)

- [ ] **Step 3: Run the existing test suite and build to verify nothing broke**

Run: `npm run test -- --run`
Expected: PASS — same test count as Task 3.

Run: `npm run build`
Expected: build succeeds with no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/Header/Header.jsx src/components/Header/Header.module.css
git commit -m "feat: add Tipos de máquina to nav, raise desktop-nav breakpoint to 960px"
```

---

### Task 5: Manual verification pass

**Files:** none (verification only, no code changes expected — if any check fails, fix the relevant file from Tasks 1-4 and re-run this task's checks before committing the fix).

- [ ] **Step 1: Start the dev server**

Run: `npm run dev -- --port 5173 --strictPort`

- [ ] **Step 2: Verify nav at desktop widths (≥960px)**

In a browser at 1120px and at exactly 960px: confirm all 5 nav links ("Qué hacemos", "Tipos de máquina", "Por qué elegirnos", "Cómo funciona", "Contáctanos") render on one line, the logo isn't squished, and the WhatsApp button is fully visible with no horizontal scrollbar on the page.

- [ ] **Step 3: Verify hamburger menu at the new mid-range (768-959px)**

At 768px and 900px: confirm the desktop nav is hidden, the hamburger button + WhatsApp CTA are both visible, and opening the hamburger panel shows all 5 links including "Tipos de máquina" in the correct order, each scrolling to the right section and closing the panel on click.

- [ ] **Step 4: Verify scroll offset and active-section highlight for the new section**

Click "Tipos de máquina" in the nav: confirm the section's `<h2>Tipos de máquina</h2>` is fully visible below the sticky header (not covered), and the "Tipos de máquina" nav link highlights gold while scrolled into that section. Scroll manually up/down through the whole page and confirm the highlight moves correctly between all 5 sections in order (no stuck or skipped states).

- [ ] **Step 5: Verify the Services process block**

Scroll to "Qué hacemos": confirm the 3 existing service cards render unchanged above, followed by the "¿Cómo es el proceso de reparación y mantenimiento?" heading, intro paragraph, and 5 numbered circles (1-5) with titles/descriptions, in 1 column on mobile width and 3 columns at ≥768px.

- [ ] **Step 6: Verify MachineTypes visually**

Scroll to "Tipos de máquina": confirm pure black background (visually darker than the "Qué hacemos" section above it), 3 items (Costura industrial / Corte textil / Equipos auxiliares) with gold icons, no card/box background, 1 column on mobile and 3 columns at ≥768px.

- [ ] **Step 7: Final full-suite check**

Run: `npm run test -- --run`
Expected: PASS, same test count as after Task 4 (35 + 6 new icon assertions from Task 1 = 41 total).

Run: `npm run build`
Expected: build succeeds with no errors.

- [ ] **Step 8: Stop the dev server**

No commit for this task — it's verification-only. If Steps 2-6 surface a bug, fix it in the relevant Task's files, commit that fix on its own (`fix: ...`), then re-run the affected verification steps.
