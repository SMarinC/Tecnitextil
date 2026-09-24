import { describe, expect, it } from 'vitest'
import { CATALOG_COPY, MACHINE_FAMILIES, familyById } from '../data/catalog'
import { CATALOG_PAGE } from '../data/pages'
import { SAMPLE_FAMILY, sampleMachine, sampleSewingMachine } from '../test/machines'
import {
  assertCatalog,
  familyBreadcrumb,
  familyCards,
  familyIntro,
  familyPageMeta,
  familyPath,
  familyWhatsAppMessage,
  groupByType,
  machineBreadcrumb,
  machinePageMeta,
  machinePath,
  machineWhatsAppMessage,
  machinesOf,
  modelSlug,
  photoAlt,
  toMachine,
} from './catalog'

const BUTTONS = familyById('ojales-botones-presillas')
const FAMILIES = [BUTTONS, SAMPLE_FAMILY]
const buttonhole = (modelo: string) =>
  sampleMachine({ id: `ojales-botones-presillas/${modelo.toLowerCase()}`, modelo, tipo: 'ojales' })
const CATALOGUE = [
  sampleMachine(),
  buttonhole('JK-N9-D'),
  sampleSewingMachine('JK-F6'),
  sampleSewingMachine('JK-A4C-C', 'con-cortahilos'),
]

describe('groupByType', () => {
  it("lists one category's types in its order, models sorted, empty types left out", () => {
    const groups = groupByType(BUTTONS, [...CATALOGUE, buttonhole('JK-T782G-Z')])
    expect(groups.map(({ type }) => type)).toEqual(['ojales', 'presillas-y-botones'])
    expect(groups[0]?.label).toBe('Ojales')
    expect(groups[0]?.machines.map(({ modelo }) => modelo)).toEqual(['JK-N9-D', 'JK-T782G-Z'])
  })
})

describe('machinesOf and familyCards', () => {
  it('keeps each category to its own machines', () => {
    expect(machinesOf(SAMPLE_FAMILY, CATALOGUE).map(({ modelo }) => modelo)).toEqual([
      'JK-F6',
      'JK-A4C-C',
    ])
  })

  it('gives the hub one card per category, with its model count and its cover photo', () => {
    const cards = familyCards(CATALOGUE, FAMILIES)
    expect(cards.map(({ family, count }) => [family.id, count])).toEqual([
      ['ojales-botones-presillas', 2],
      ['pespunte', 2],
    ])
    expect(cards[1]?.photo).toBe(CATALOGUE[2]?.fotos[0])
  })
})

describe('assertCatalog', () => {
  it('accepts a catalogue where every rule holds', () => {
    expect(() => assertCatalog(CATALOGUE, FAMILIES)).not.toThrow()
  })

  it('rejects an empty catalogue', () => {
    expect(() => assertCatalog([], FAMILIES)).toThrow(/empty/)
  })

  it('rejects a folder outside its category or not named after its model', () => {
    const misplaced = sampleMachine({ id: 'pespunte/jk-x1', modelo: 'JK-X1' })
    expect(() => assertCatalog([...CATALOGUE, misplaced], FAMILIES)).toThrow(/pespunte\/jk-x1/)
  })

  it("rejects a type that is not one of its category's", () => {
    expect(() =>
      assertCatalog([...CATALOGUE, sampleSewingMachine('JK-X2', 'ojales')], FAMILIES),
    ).toThrow(/ojales/)
  })

  it('rejects the same model twice', () => {
    expect(() => assertCatalog([...CATALOGUE, sampleMachine()], FAMILIES)).toThrow(
      /JK-T1900GSK-DII/,
    )
  })

  it('rejects a category with no machines', () => {
    expect(() => assertCatalog(CATALOGUE.slice(0, 2), FAMILIES)).toThrow(/pespunte/)
  })

  it('rejects a cover that is not one of its machines or has no photos', () => {
    expect(() =>
      assertCatalog(CATALOGUE, [BUTTONS, { ...SAMPLE_FAMILY, cover: 'jk-nada' }]),
    ).toThrow(/jk-nada/)
    const coverWithoutPhotos = CATALOGUE.map((machine) =>
      machine.modelo === 'JK-F6' ? { ...machine, fotos: [] } : machine,
    )
    expect(() => assertCatalog(coverWithoutPhotos, FAMILIES)).toThrow(/jk-f6/)
  })
})

describe('toMachine', () => {
  it('keeps the entry id: the category folder plus the model folder', () => {
    const { id, ...data } = sampleMachine()
    expect(toMachine({ id, data })).toEqual(sampleMachine())
  })
})

describe('paths', () => {
  it('nests each category under the catalogue and each machine under its category', () => {
    expect(familyPath(SAMPLE_FAMILY)).toBe(`${CATALOG_PAGE.path}/pespunte`)
    expect(machinePath(sampleMachine())).toBe('/maquinas/ojales-botones-presillas/jk-t1900gsk-dii')
    expect(modelSlug(sampleMachine())).toBe('jk-t1900gsk-dii')
  })
})

describe('category page', () => {
  it('has its own title and a description and intro built from its summary', () => {
    expect(familyPageMeta(SAMPLE_FAMILY)).toEqual({
      path: '/maquinas/pespunte',
      title: 'Máquinas de pespunte JACK | TECNITEXTIL',
      description: `${SAMPLE_FAMILY.summary} ${CATALOG_COPY.familyDescriptionSuffix}`,
      noindex: false,
    })
    expect(familyIntro(SAMPLE_FAMILY)).toBe(
      `${SAMPLE_FAMILY.summary} ${CATALOG_COPY.familyIntroSuffix}`,
    )
  })

  it.each([...MACHINE_FAMILIES])(
    '$id keeps its meta description within 160 characters',
    (family) => {
      expect(familyPageMeta(family).description.length).toBeLessThanOrEqual(160)
    },
  )

  it('asks about the category on WhatsApp', () => {
    expect(familyWhatsAppMessage(SAMPLE_FAMILY)).toBe(
      'Hola, quisiera información sobre las máquinas de pespunte JACK.',
    )
  })

  it('leads its breadcrumb from the catalogue to itself', () => {
    expect(familyBreadcrumb(SAMPLE_FAMILY)).toEqual([
      { label: 'Máquinas', href: '/maquinas' },
      { label: 'Pespunte' },
    ])
  })
})

describe('machine page', () => {
  const machine = sampleMachine()

  it('has its own title and uses the summary as description', () => {
    expect(machinePageMeta(machine)).toEqual({
      path: '/maquinas/ojales-botones-presillas/jk-t1900gsk-dii',
      title:
        'Máquina de botones y presillas electrónica con canilla JACK JK-T1900GSK-DII | TECNITEXTIL',
      description: machine.resumen,
      noindex: false,
    })
  })

  it('asks about the machine by brand, model and name on WhatsApp', () => {
    expect(machineWhatsAppMessage(machine)).toBe(
      'Hola, me interesa la JACK JK-T1900GSK-DII (Máquina de botones y presillas electrónica con canilla). ¿Me dais más información?',
    )
  })

  it('describes the main photo and numbers the other views', () => {
    const base = 'JACK JK-T1900GSK-DII, Máquina de botones y presillas electrónica con canilla'
    expect(photoAlt(machine, 0)).toBe(base)
    expect(photoAlt(machine, 1)).toBe(`${base}, vista 2`)
  })

  it('leads its breadcrumb through its category and its type', () => {
    expect(machineBreadcrumb(BUTTONS, machine)).toEqual([
      { label: 'Máquinas', href: '/maquinas' },
      { label: 'Ojales, botones y presillas', href: '/maquinas/ojales-botones-presillas' },
      {
        label: 'Presillas y botones',
        href: '/maquinas/ojales-botones-presillas#presillas-y-botones',
      },
      { label: 'JACK JK-T1900GSK-DII' },
    ])
  })
})
