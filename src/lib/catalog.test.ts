import { describe, expect, it } from 'vitest'
import { CATALOG_PAGE } from '../data/pages'
import { absoluteUrl } from '../data/seo'
import { sampleMachine } from '../test/machines'
import {
  assertCatalog,
  groupByType,
  machineBreadcrumbJsonLd,
  machinePageMeta,
  machinePath,
  machineWhatsAppMessage,
  photoAlt,
  toMachine,
} from './catalog'

const buttonhole = (modelo: string) =>
  sampleMachine({ slug: modelo.toLowerCase(), modelo, tipo: 'ojales' })

describe('groupByType', () => {
  it('lists the types in catalogue order, models sorted, empty types left out', () => {
    const groups = groupByType([sampleMachine(), buttonhole('JK-T782G-Z'), buttonhole('JK-N9-D')])
    expect(groups.map(({ type }) => type)).toEqual(['ojales', 'presillas-y-botones'])
    expect(groups[0]?.label).toBe('Ojales')
    expect(groups[0]?.machines.map(({ modelo }) => modelo)).toEqual(['JK-N9-D', 'JK-T782G-Z'])
  })
})

describe('assertCatalog', () => {
  it('accepts folders named after their model in lowercase', () => {
    expect(() => assertCatalog([sampleMachine()])).not.toThrow()
  })

  it('rejects an empty catalogue and a folder that does not match its model', () => {
    expect(() => assertCatalog([])).toThrow()
    expect(() => assertCatalog([sampleMachine({ slug: 'otra-maquina' })])).toThrow(/otra-maquina/)
  })
})

describe('toMachine', () => {
  it('takes the slug from the entry id', () => {
    const { slug, ...data } = sampleMachine()
    expect(toMachine({ id: slug, data })).toEqual(sampleMachine())
  })
})

describe('machine page', () => {
  const machine = sampleMachine()

  it('lives under the catalogue path', () => {
    expect(machinePath(machine.slug)).toBe(`${CATALOG_PAGE.path}/jk-t1900gsk-dii`)
  })

  it('has its own title and uses the summary as description', () => {
    expect(machinePageMeta(machine)).toEqual({
      path: '/maquinas/jk-t1900gsk-dii',
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

  it('publishes a breadcrumb from the catalogue to the machine', () => {
    expect(machineBreadcrumbJsonLd(machine)).toEqual({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Máquinas', item: absoluteUrl('/maquinas') },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Presillas y botones',
          item: absoluteUrl('/maquinas#presillas-y-botones'),
        },
        { '@type': 'ListItem', position: 3, name: 'JACK JK-T1900GSK-DII' },
      ],
    })
  })
})
