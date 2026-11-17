import { readFileSync, readdirSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

// Since 2026-11-16 every machine page names each specification one way, with its unit in
// the label, so the same table reads the same across the catalogue. Vitest cannot load
// the collection, so this reads the Markdown files themselves.
const ROOT = 'src/content/maquinas'
const files = readdirSync(ROOT).flatMap((category) =>
  readdirSync(`${ROOT}/${category}`).map((model) => `${ROOT}/${category}/${model}/index.md`),
)
const specs = files.flatMap((file) =>
  [...readFileSync(file, 'utf8').matchAll(/- etiqueta: (.+)\n\s+valor: (.+)/g)].map(
    ([, etiqueta, valor]) => ({ file, etiqueta, valor: valor.replace(/^["']|["']$/g, '') }),
  ),
)

// The supplier's other spellings, mapped by docs/recursos/importar-jack.mjs.
const RETIRED_LABELS = [
  'Velocidad (ppm)',
  'Máx. velocidad (ppm)',
  'Velocidad máx. (ppm)',
  'Velocidad costura (s.p.m)',
  'Velocidad máxima',
  'Altura prensatelas (mm)',
  'Altura del prensatelas',
  'Fino',
  'Medio',
  'Grueso',
  'Peso Kg',
]

describe('catalogue specifications', () => {
  it('reads every machine page', () => {
    expect(files.length).toBeGreaterThan(0)
    expect(specs.length).toBeGreaterThan(files.length)
  })

  it('names each specification one way', () => {
    const retired = specs.filter(({ etiqueta }) => RETIRED_LABELS.includes(etiqueta))
    expect(retired).toEqual([])
  })

  it('writes "Sí" instead of the supplier\'s "X", and no control characters', () => {
    expect(specs.filter(({ valor }) => /^x$/i.test(valor))).toEqual([])
    const broken = files.filter((file) => /[\u0080-\u009f]/.test(readFileSync(file, 'utf8')))
    expect(broken).toEqual([])
  })
})
