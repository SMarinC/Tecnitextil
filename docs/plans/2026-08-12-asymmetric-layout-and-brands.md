# Asymmetric Layout + Marcas Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure `Services`'s 3-card grid and `MachineTypes`'s 3-item list into a title-left/2-up-1-down asymmetric layout, and add a new `Marcas` (brands) section between `MachineTypes` and `ValueProps`.

**Architecture:** Both `Services` and `MachineTypes` gain a shared internal shape — a `.layout` flex container split into `.titleCol` (heading, and for `MachineTypes` also the intro paragraph) and `.itemsCol` (the existing data-array-driven items, now in a 2-column grid with the 3rd item spanning both columns via `:nth-child(3)`). Below `768px` everything stacks in one column, identical in spirit to the current behavior. `Marcas` is a new, independent section following the same `outer`+`.inner` shape as every other section, with a `BRANDS` string array rendered as pill badges — no shared component extracted for the pills, single use.

**Tech Stack:** Vite, React 19, CSS Modules, Vitest (`environment: 'node'`, tests scoped to pure render output — no jsdom, no simulated interaction).

Reference spec: `docs/specs/2026-08-12-asymmetric-layout-and-brands-design.md`

## Global Constraints

- The asymmetric layout applies ONLY to `Services`'s `SERVICES` grid and `MachineTypes`'s `MACHINE_TYPES` list. `PROCESS_STEPS` (the 5-step block inside `Services`), `ValueProps`, `HowItWorks`, `FinalCta` are untouched. (Spec §2)
- Desktop layout (title 30% left, items 2-up-1-down grid on the right) activates at `≥768px` only — below that, everything stacks in one column (title, then items in a row each). (Spec §2)
- 3rd item in each items grid gets `grid-column: 1 / -1` at `≥768px` so it spans the full width of the right column, not just the first cell. (Spec §2)
- Title is centered on mobile, left-aligned at `≥768px`. (Spec §2)
- `MachineTypes`'s existing intro paragraph moves into `.titleCol`, alongside the heading — it no longer sits centered above the grid. (Spec §2)
- `Marcas` does NOT use the shared `Marcas.jpeg` image (trademark risk, brand-list mismatch, white-background contrast — see Spec §4.1). Brands render as text pills only.
- `Marcas` copy is final as written in Spec §4.2 (paragraph 1 was trimmed by the spec author to remove brand-name redundancy with the pill list — use the trimmed version, not the original chat message text).
- `Marcas` gets `id="marcas"` but NO nav entry (desktop or mobile) — not requested, and would require re-verifying the just-fixed 960px nav breakpoint. (Spec §4.3)
- `Marcas` background is `var(--color-black-soft)`, placed between `MachineTypes` (`--color-black`) and `ValueProps` (`--color-black`) — restores full section-tone alternation across the whole page. (Spec §4.4)
- Because that alternation is restored, the `border-bottom` divider added to `MachineTypes.module.css` in commit `2e52d63` (a workaround for `MachineTypes`+`ValueProps` being adjacent identical tones) is no longer needed and must be removed as part of this plan. (Spec §4.4)
- Pills: `border-radius: var(--radius-full)` (same token as the WhatsApp CTA button), gold-tinted border via `color-mix(in srgb, var(--color-gold) 40%, transparent)`, gold text, no solid background — must not visually compete with the primary WhatsApp CTA. (Spec §4.5)
- All colors/spacing/typography from existing tokens — no new tokens, no hardcoded hex/px magic numbers beyond what's specified here.
- No new automated tests required — matches project precedent of no behavioral tests for section components.

---

## File Structure

```
src/
  components/
    Services/
      Services.jsx            # SERVICES grid wrapped in .layout/.titleCol/.itemsCol; PROCESS_STEPS block unchanged
      Services.module.css     # .grid renamed/restructured into .layout+.titleCol+.itemsCol; process* classes unchanged
    MachineTypes/
      MachineTypes.jsx        # heading+intro move into .titleCol; MACHINE_TYPES list becomes .itemsCol
      MachineTypes.module.css # same .layout/.titleCol/.itemsCol restructure; border-bottom removed
      # (border-bottom removal could also land in the Marcas task — see Task 1)
    Marcas/                    # NEW
      Marcas.jsx               # BRANDS array, heading, 2 paragraphs, pill list
      Marcas.module.css        # section/inner/heading/text/brandList/brand styles
  App.jsx                      # + <Marcas /> between <MachineTypes /> and <ValueProps />
```

---

### Task 1: `Marcas` section + remove the now-unneeded `MachineTypes` divider

**Files:**
- Create: `src/components/Marcas/Marcas.jsx`
- Create: `src/components/Marcas/Marcas.module.css`
- Modify: `src/App.jsx`
- Modify: `src/components/MachineTypes/MachineTypes.module.css`

**Interfaces:**
- Produces: `Marcas` — default-exported React component, no props, renders `<section id="marcas">`.

- [ ] **Step 1: Create the component**

Create `src/components/Marcas/Marcas.jsx`:

```jsx
import styles from './Marcas.module.css'

const BRANDS = [
  'Juki',
  'Brother',
  'Singer',
  'Alfa',
  'Pfaff',
  'Durkopp Adler',
  'Consew',
  'Seiko',
  'Typical',
  'Siruba',
  'Rimoldi',
  'Pegasus',
  'Jack',
]

function Marcas() {
  return (
    <section className={styles.section} id="marcas">
      <div className={styles.inner}>
        <h2 className={styles.heading}>
          Reparamos maquinaria industrial de distintas marcas y generaciones
        </h2>
        <p className={styles.text}>
          Trabajamos con maquinaria industrial habitual en talleres y
          entornos textiles: máquinas de costura de las marcas más
          utilizadas del sector, además de cortadoras, mesas de vacío,
          remachadoras y equipos auxiliares de diferentes fabricantes.
        </p>
        <p className={styles.text}>
          Si tienes dudas sobre tu equipo, indícanos marca, modelo, tipo de
          material que trabaja y síntoma principal. Esto nos ayuda a
          orientar mejor la intervención técnica.
        </p>
        <ul className={styles.brandList}>
          {BRANDS.map((brand) => (
            <li className={styles.brand} key={brand}>
              {brand}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default Marcas
```

- [ ] **Step 2: Create the styles**

Create `src/components/Marcas/Marcas.module.css`:

```css
.section {
  background: var(--color-black-soft);
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
  max-width: 40ch;
  margin: 0 auto var(--space-lg);
}

.text {
  color: var(--color-text-on-dark-secondary);
  text-align: center;
  max-width: 65ch;
  margin: 0 auto var(--space-md);
}

.brandList {
  list-style: none;
  margin: var(--space-lg) 0 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-sm);
}

.brand {
  display: inline-flex;
  align-items: center;
  padding: 0.4rem 1rem;
  border-radius: var(--radius-full);
  border: 1px solid color-mix(in srgb, var(--color-gold) 40%, transparent);
  color: var(--color-gold);
  font-size: 0.9rem;
}
```

- [ ] **Step 3: Wire it into the page**

Edit `src/App.jsx` — add the import and insert `<Marcas />` between `<MachineTypes />` and `<ValueProps />`:

```jsx
import Header from './components/Header/Header.jsx'
import Hero from './components/Hero/Hero.jsx'
import Services from './components/Services/Services.jsx'
import MachineTypes from './components/MachineTypes/MachineTypes.jsx'
import Marcas from './components/Marcas/Marcas.jsx'
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
        <Marcas />
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

- [ ] **Step 4: Remove the now-unneeded divider from `MachineTypes`**

Edit `src/components/MachineTypes/MachineTypes.module.css` — remove the `border-bottom` line added in commit `2e52d63` (it was a workaround for `MachineTypes` and `ValueProps` being adjacent identical tones; with `Marcas` now between them, the page alternates tones cleanly again and the divider is no longer needed):

```css
.section {
  background: var(--color-black);
  scroll-margin-top: var(--header-offset);
}
```

(Only the `border-bottom: 1px solid color-mix(...)` line is removed. Nothing else in this file changes as part of this task — the `.layout`/`.titleCol`/`.itemsCol` restructuring of this file happens in Task 3, separately.)

- [ ] **Step 5: Run the existing test suite and build to verify nothing broke**

Run: `npm run test -- --run`
Expected: PASS — same test count as before this task (no new automated tests).

Run: `npm run build`
Expected: build succeeds with no errors.

- [ ] **Step 6: Commit**

```bash
git add src/components/Marcas/Marcas.jsx src/components/Marcas/Marcas.module.css src/App.jsx src/components/MachineTypes/MachineTypes.module.css
git commit -m "feat: add Marcas section, remove now-unneeded MachineTypes divider"
```

---

### Task 2: Asymmetric layout for `Services`'s 3-card grid

**Files:**
- Modify: `src/components/Services/Services.jsx`
- Modify: `src/components/Services/Services.module.css`

**Interfaces:** none consumed from other tasks; does not affect `PROCESS_STEPS`.

- [ ] **Step 1: Restructure the JSX**

Edit `src/components/Services/Services.jsx` — replace the `<h2>`+`<div className={styles.grid}>` block with a `.layout`/`.titleCol`/`.itemsCol` structure. The `PROCESS_STEPS` block below is untouched:

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
        <div className={styles.layout}>
          <div className={styles.titleCol}>
            <h2 className={styles.heading}>Qué hacemos</h2>
          </div>
          <div className={styles.itemsCol}>
            {SERVICES.map(({ Icon, title, description }) => (
              <article className={styles.card} key={title}>
                <Icon className={styles.cardIcon} />
                <h3 className={styles.cardTitle}>{title}</h3>
                <p className={styles.cardDescription}>{description}</p>
              </article>
            ))}
          </div>
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

- [ ] **Step 2: Restructure the styles**

Edit `src/components/Services/Services.module.css` — replace the `.heading` and `.grid` rules (and the `768px` block that changed `.grid` to 3 columns) with `.layout`/`.titleCol`/`.heading`/`.itemsCol`. The `.card`/`.cardIcon`/`.cardTitle`/`.cardDescription` rules and everything from `.processHeading` down are unchanged:

```css
.services {
  background: var(--color-black-soft);
  scroll-margin-top: var(--header-offset);
}

.inner {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: var(--space-xl) var(--space-md);
}

.layout {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.heading {
  font-size: clamp(1.5rem, 4vw, 2.25rem);
  color: var(--color-white);
  text-align: center;
}

.itemsCol {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-md);
}

.card {
  background: var(--color-black-elevated);
  border: 1px solid color-mix(in srgb, var(--color-gold) 15%, transparent);
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
  color: var(--color-white);
}

.cardDescription {
  color: var(--color-text-on-dark-secondary);
  font-size: 0.95rem;
}

@media (min-width: 768px) {
  .layout {
    flex-direction: row;
    align-items: flex-start;
    gap: var(--space-xl);
  }

  .titleCol {
    flex: 0 0 30%;
  }

  .heading {
    text-align: left;
  }

  .itemsCol {
    flex: 1;
    grid-template-columns: repeat(2, 1fr);
  }

  .card:nth-child(3) {
    grid-column: 1 / -1;
  }
}

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
  display: flex;
  flex-direction: column;
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
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }

  .processStep {
    flex: 0 1 calc((100% - 2 * var(--space-lg)) / 3);
  }
}
```

Note: there are now two separate `@media (min-width: 768px)` blocks in this file (one for `.layout`/`.titleCol`/`.heading`/`.itemsCol`, one for `.processSteps`/`.processStep`) — that's intentional, matches how the file already had a dedicated media block per concern before this change.

- [ ] **Step 3: Run the existing test suite and build to verify nothing broke**

Run: `npm run test -- --run`
Expected: PASS — same test count as after Task 1.

Run: `npm run build`
Expected: build succeeds with no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/Services/Services.jsx src/components/Services/Services.module.css
git commit -m "feat: asymmetric title-left layout for Services card grid"
```

---

### Task 3: Asymmetric layout for `MachineTypes`

**Files:**
- Modify: `src/components/MachineTypes/MachineTypes.jsx`
- Modify: `src/components/MachineTypes/MachineTypes.module.css`

**Interfaces:** none consumed from other tasks.

- [ ] **Step 1: Restructure the JSX**

Edit `src/components/MachineTypes/MachineTypes.jsx` — move the heading and intro into `.titleCol`, wrap the list in `.itemsCol`:

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
        <div className={styles.layout}>
          <div className={styles.titleCol}>
            <h2 className={styles.heading}>Tipos de máquina</h2>
            <p className={styles.intro}>
              Trabajamos con equipos de corte, confección, tapicería y
              acabados — cada uno con un ajuste distinto según el material y
              el ritmo de trabajo.
            </p>
          </div>
          <ul className={styles.itemsCol}>
            {MACHINE_TYPES.map(({ Icon, title, description }) => (
              <li className={styles.item} key={title}>
                <Icon className={styles.icon} />
                <h3 className={styles.itemTitle}>{title}</h3>
                <p className={styles.itemDescription}>{description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default MachineTypes
```

- [ ] **Step 2: Restructure the styles**

Edit `src/components/MachineTypes/MachineTypes.module.css` in full (this task starts from the file as it stands after Task 1 removed the `border-bottom` — do not re-add it):

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

.layout {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
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
  margin: 0 auto;
}

.itemsCol {
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
  .layout {
    flex-direction: row;
    align-items: flex-start;
    gap: var(--space-xl);
  }

  .titleCol {
    flex: 0 0 30%;
  }

  .heading,
  .intro {
    text-align: left;
    margin-left: 0;
    margin-right: 0;
  }

  .intro {
    max-width: none;
  }

  .itemsCol {
    flex: 1;
    grid-template-columns: repeat(2, 1fr);
  }

  .item:nth-child(3) {
    grid-column: 1 / -1;
  }
}
```

- [ ] **Step 3: Run the existing test suite and build to verify nothing broke**

Run: `npm run test -- --run`
Expected: PASS — same test count as after Task 2.

Run: `npm run build`
Expected: build succeeds with no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/MachineTypes/MachineTypes.jsx src/components/MachineTypes/MachineTypes.module.css
git commit -m "feat: asymmetric title-left layout for MachineTypes"
```

---

### Task 4: Manual verification pass

**Files:** none (verification only — if a check fails, fix the relevant file from Tasks 1-3 and re-run the affected checks before committing the fix).

- [ ] **Step 1: Start the dev server** (skip if already running)

Run: `npm run dev -- --port 5173 --strictPort`

- [ ] **Step 2: Verify `Services` layout at both breakpoints**

At `<768px`: title "Qué hacemos" centered above the 3 cards, cards stacked in one column.
At `≥768px`: title left-aligned in roughly the left third of the section, the 3 cards on the right with cards 1-2 in a top row and card 3 spanning the full width of that right side below them. The 5-step process block below is unaffected — still centered, unchanged from before this plan.

- [ ] **Step 3: Verify `MachineTypes` layout at both breakpoints**

At `<768px`: title + intro paragraph centered, 3 items stacked below in one column.
At `≥768px`: title + intro left-aligned in the left third, items on the right with items 1-2 in a top row and item 3 spanning full width below.

- [ ] **Step 4: Verify `Marcas`**

Section appears between `MachineTypes` and `ValueProps`, background `--color-black-soft` (visibly softer than the pure-black `MachineTypes` above it and `ValueProps` below it — confirms the alternating rhythm is restored). Heading, both paragraphs, and all 13 brand pills render, pills wrap correctly at narrow widths, no pill overflows its container. No entry for "Marcas" appears in the desktop nav or the mobile hamburger panel (confirm by counting: still exactly 5 items, same as before this plan).

- [ ] **Step 5: Verify `MachineTypes`'s divider is gone**

Scroll to the boundary between `MachineTypes` and `Marcas` — confirm there's no gold hairline there anymore (it moved conceptually to no longer being needed, per Task 1 Step 4 — the tone change from black to black-soft is now the only separator, matching how every other section boundary on the page works).

- [ ] **Step 6: Final full-suite check**

Run: `npm run test -- --run`
Expected: PASS, same test count as after Task 3 (this plan adds no new automated tests).

Run: `npm run build`
Expected: build succeeds with no errors.

- [ ] **Step 7: Stop the dev server** (if you started it in Step 1)

No commit for this task — verification-only. If Steps 2-5 surface a bug, fix it in the relevant task's files, commit that fix on its own (`fix: ...`), then re-run the affected verification steps.
