# Layout Polish + Congruence Audit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an internal gold divider between the two sub-blocks of `Services`, vertically center the title-vs-items columns in `Services` and `MachineTypes`, and fix two real copy inconsistencies surfaced by a full-site congruence audit (`HowItWorks` step 2, `FinalCta` heading).

**Architecture:** All changes are localized edits to existing files — no new components, no new files. Two CSS-only tasks (divider + alignment) and one content-only task (two JSX text edits), fully independent of each other, so order doesn't matter beyond grouping related concerns.

**Tech Stack:** Vite, React 19, CSS Modules, Vitest (`environment: 'node'`, no jsdom).

Reference spec: `docs/specs/2026-08-12-layout-polish-and-congruence-audit-design.md`

## Global Constraints

- The divider is a `border-top` on `.processHeading` inside `Services.module.css`, using `color-mix(in srgb, var(--color-gold) 20%, transparent)` — same mechanism already used elsewhere in the codebase (e.g. `.card` borders use 15%, `Marcas` pills use 40%). Background color on both sides of the divider stays `--color-black-soft` (unchanged) — this is an internal divider within one section, not a section-boundary change. (Spec §3)
- Centering fix is `align-items: center` (was `flex-start`) on `.layout` inside the existing `@media (min-width: 768px)` block, in BOTH `Services.module.css` and `MachineTypes.module.css`. `HowItWorks` is NOT touched (Spec §2 — documented interpretation call). (Spec §2, §4)
- `HowItWorks` step 2 title changes from "Recogemos tu máquina" to "Recogemos tu equipo o visitamos tu taller", description changes to reflect both home pickup and on-site visits for industrial equipment. Steps 1 and 3 are unchanged. (Spec §5.1)
- `FinalCta` heading changes from "Todo para tu máquina de coser" to "Todo para tu maquinaria textil". The subheading paragraph is unchanged. (Spec §5.2)
- Do NOT touch: the "Asesoría técnica"/"Diagnóstico" copy overlap (Spec §5.3), `index.html` title/meta tags (Spec §5.4) — both are explicitly out of scope, flagged for the owner.
- No new tokens, no hardcoded hex/px values — reuse existing tokens throughout.
- No new automated tests required — matches project precedent.

---

## File Structure

```
src/components/Services/Services.module.css       # + border-top on .processHeading; align-items: center
src/components/MachineTypes/MachineTypes.module.css # align-items: center
src/components/HowItWorks/HowItWorks.jsx            # STEPS[1] title + description text only
src/components/FinalCta/FinalCta.jsx                # heading text only
```

---

### Task 1: Internal divider + centered alignment in `Services` and `MachineTypes`

**Files:**
- Modify: `src/components/Services/Services.module.css`
- Modify: `src/components/MachineTypes/MachineTypes.module.css`

- [ ] **Step 1: Add the divider to `Services.module.css`**

Edit `src/components/Services/Services.module.css` — change the `.processHeading` rule from:

```css
.processHeading {
  font-size: clamp(1.25rem, 3vw, 1.75rem);
  color: var(--color-white);
  text-align: center;
  margin-top: var(--space-xl);
  margin-bottom: var(--space-sm);
}
```

to:

```css
.processHeading {
  font-size: clamp(1.25rem, 3vw, 1.75rem);
  color: var(--color-white);
  text-align: center;
  margin-top: var(--space-xl);
  padding-top: var(--space-xl);
  border-top: 1px solid color-mix(in srgb, var(--color-gold) 20%, transparent);
  margin-bottom: var(--space-sm);
}
```

(Only `padding-top` and `border-top` are added; nothing else in this rule changes.)

- [ ] **Step 2: Center the layout in `Services.module.css`**

In the same file, inside the existing `@media (min-width: 768px)` block (the first one, containing `.layout`), change:

```css
  .layout {
    flex-direction: row;
    align-items: flex-start;
    gap: var(--space-xl);
  }
```

to:

```css
  .layout {
    flex-direction: row;
    align-items: center;
    gap: var(--space-xl);
  }
```

(Only `align-items` changes, from `flex-start` to `center`. The second `@media (min-width: 768px)` block further down, for `.processSteps`, is untouched.)

- [ ] **Step 3: Center the layout in `MachineTypes.module.css`**

Edit `src/components/MachineTypes/MachineTypes.module.css` — inside the `@media (min-width: 768px)` block, change:

```css
  .layout {
    flex-direction: row;
    align-items: flex-start;
    gap: var(--space-xl);
  }
```

to:

```css
  .layout {
    flex-direction: row;
    align-items: center;
    gap: var(--space-xl);
  }
```

- [ ] **Step 4: Run the test suite and build to verify nothing broke**

Run: `npm run test -- --run`
Expected: PASS, same test count as before (41 tests, CSS-only changes).

Run: `npm run build`
Expected: build succeeds with no errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/Services/Services.module.css src/components/MachineTypes/MachineTypes.module.css
git commit -m "feat: add internal divider to Services, center asymmetric layout columns"
```

---

### Task 2: Congruence fixes — `HowItWorks` step 2 and `FinalCta` heading

**Files:**
- Modify: `src/components/HowItWorks/HowItWorks.jsx`
- Modify: `src/components/FinalCta/FinalCta.jsx`

- [ ] **Step 1: Update `HowItWorks` step 2**

Edit `src/components/HowItWorks/HowItWorks.jsx` — the `STEPS` array's 2nd entry changes from:

```jsx
  {
    number: '2',
    title: 'Recogemos tu máquina',
    description: 'Recogemos tu máquina de coser en la puerta de tu domicilio.',
  },
```

to:

```jsx
  {
    number: '2',
    title: 'Recogemos tu equipo o visitamos tu taller',
    description:
      'Recogemos tu máquina en la puerta de tu domicilio, o coordinamos una visita técnica si el equipo es industrial o no se puede trasladar.',
  },
```

(Steps 1 and 3 in the array, and everything else in the file, are unchanged.)

- [ ] **Step 2: Update `FinalCta` heading**

Edit `src/components/FinalCta/FinalCta.jsx` — change:

```jsx
      <h2 className={styles.heading}>
        Todo para tu máquina de coser
      </h2>
```

to:

```jsx
      <h2 className={styles.heading}>
        Todo para tu maquinaria textil
      </h2>
```

(The `<p className={styles.subheading}>` paragraph right below it is unchanged.)

- [ ] **Step 3: Run the test suite and build to verify nothing broke**

Run: `npm run test -- --run`
Expected: PASS, same test count as after Task 1.

Run: `npm run build`
Expected: build succeeds with no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/HowItWorks/HowItWorks.jsx src/components/FinalCta/FinalCta.jsx
git commit -m "fix: reconcile HowItWorks pickup step and FinalCta heading with expanded industrial scope"
```

---

### Task 3: Manual verification pass

**Files:** none (verification only — if a check fails, fix the relevant file from Tasks 1-2 and re-run the affected checks before committing the fix).

- [ ] **Step 1: Start the dev server** (skip if already running)

Run: `npm run dev -- --port 5173 --strictPort`

- [ ] **Step 2: Verify the divider**

Scroll to "Qué hacemos" at `≥768px` and `<768px` — confirm a subtle gold horizontal line appears above "¿Cómo es el proceso de reparación y mantenimiento?", with the same background color on both sides (no section-boundary-style hard cut, just an internal rule).

- [ ] **Step 3: Verify centering**

At `≥768px`, confirm in `Services` that "QUÉ HACEMOS" sits vertically centered against the height of the 3-card block (not pinned to the top), and in `MachineTypes` that the title+intro block sits vertically centered against the 3-item grid. At `<768px`, confirm both still stack normally (this change only affects the `≥768px` row layout).

- [ ] **Step 4: Verify `HowItWorks` copy**

Scroll to "Cómo funciona" — step 2 now reads "Recogemos tu equipo o visitamos tu taller" with the updated description. Steps 1 and 3 are unchanged.

- [ ] **Step 5: Verify `FinalCta` copy**

Scroll to the final CTA section — heading now reads "Todo para tu maquinaria textil", subheading unchanged, WhatsApp button still works.

- [ ] **Step 6: Final full-suite check**

Run: `npm run test -- --run`
Expected: PASS, same test count as after Task 2 (41 tests — this plan adds no new automated tests).

Run: `npm run build`
Expected: build succeeds with no errors.

- [ ] **Step 7: Stop the dev server** (if you started it in Step 1)

No commit for this task — verification-only.
