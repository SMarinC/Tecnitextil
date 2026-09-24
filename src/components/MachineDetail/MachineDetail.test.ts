import { describe, expect, it } from 'vitest'
import { CATALOG_COPY, familyById } from '../../data/catalog'
import { buildWhatsAppUrl } from '../../data/contact'
import { machineWhatsAppMessage } from '../../lib/catalog'
import { SAMPLE_FAMILY, sampleMachine, sampleSewingMachine } from '../../test/machines'
import { renderToHtml, textContent } from '../../test/render'
import MachineDetail from './MachineDetail.astro'

const machine = sampleMachine()
const family = familyById('ojales-botones-presillas')
const html = await renderToHtml(
  MachineDetail,
  { machine, family },
  { default: '<p>Descripción de prueba.</p>' },
)
const text = textContent(html)

describe('MachineDetail', () => {
  it('names the machine in its only <h1> and shows brand and model', () => {
    expect(html.match(/<h1[\s>]/g)).toHaveLength(1)
    expect(textContent(html.match(/<h1[^>]*>[\s\S]*?<\/h1>/)?.[0] ?? '')).toBe(machine.nombre)
    expect(text).toContain('JACK JK-T1900GSK-DII')
  })

  it('offers exactly one WhatsApp enquiry about this machine', () => {
    const links = html.match(/href="https:\/\/wa\.me[^"]*"/g) ?? []
    expect(links).toEqual([`href="${buildWhatsAppUrl(machineWhatsAppMessage(machine))}"`])
  })

  it('shows price on request, the table and stand, and availability, never an amount', () => {
    expect(text).toContain(CATALOG_COPY.priceValue)
    expect(text).toContain(family.includes ?? '')
    expect(text).toContain('Bajo pedido')
    expect(text).not.toMatch(/€|\bIVA\b/)
  })

  it('renders the description, the specs as a list of pairs, service and warranty', () => {
    expect(html).toContain('<p>Descripción de prueba.</p>')
    expect(html).toMatch(/<dt[^>]*>\s*Velocidad máxima\s*<\/dt>\s*<dd[^>]*>\s*3\.200 puntadas\/min/)
    expect(text).toContain(CATALOG_COPY.service.heading)
    expect(text).toContain(CATALOG_COPY.warranty.text)
  })

  it('links to the sales conditions from the warranty block', () => {
    expect(html).toContain(`href="${CATALOG_COPY.conditions.href}"`)
    expect(text).toContain(CATALOG_COPY.conditions.label)
  })

  it('links the breadcrumb back to the catalogue and to the type', () => {
    const nav = html.match(/<nav[^>]*>[\s\S]*?<\/nav>/)?.[0] ?? ''
    expect(nav).toContain(`aria-label="${CATALOG_COPY.breadcrumbLabel}"`)
    expect(nav).toContain('href="/maquinas"')
    expect(nav).toContain('href="/maquinas/ojales-botones-presillas"')
    expect(nav).toContain('href="/maquinas/ojales-botones-presillas#presillas-y-botones"')
  })

  it('makes the photo strip keyboard-scrollable and describes every photo', () => {
    expect(html).toMatch(
      new RegExp(
        `tabindex="0"[^>]*aria-label="${CATALOG_COPY.galleryLabel}"|aria-label="${CATALOG_COPY.galleryLabel}"[^>]*tabindex="0"`,
      ),
    )
    expect(html).toContain(
      'alt="JACK JK-T1900GSK-DII, Máquina de botones y presillas electrónica con canilla"',
    )
    expect(html).toContain(', vista 2"')
    expect(html).toContain('href="#foto-2"')
  })

  it('leaves out the includes note when its category has none', async () => {
    const sewing = sampleSewingMachine('JK-F6')
    const other = textContent(
      await renderToHtml(MachineDetail, { machine: sewing, family: SAMPLE_FAMILY }),
    )
    expect(other).not.toContain(familyById('ojales-botones-presillas').includes ?? '—')
  })

  it('says the photo is not available instead of showing an empty gallery', async () => {
    const withoutPhotos = await renderToHtml(MachineDetail, {
      machine: sampleMachine({ fotos: [] }),
      family: familyById('ojales-botones-presillas'),
    })
    expect(textContent(withoutPhotos)).toContain(CATALOG_COPY.noPhoto)
    expect(withoutPhotos).not.toContain('<img')
    expect(withoutPhotos).not.toContain('tabindex="0"')
  })
})
