import { describe, expect, it } from 'vitest'
import { buildWhatsAppUrl } from '../../data/contact'
import { CATALOG_COPY } from '../../data/catalog'
import { machineWhatsAppMessage } from '../../lib/catalog'
import { sampleMachine } from '../../test/machines'
import { renderToHtml, textContent } from '../../test/render'
import MachineDetail from './MachineDetail.astro'

const machine = sampleMachine()
const html = await renderToHtml(
  MachineDetail,
  { machine },
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
    expect(text).toContain(CATALOG_COPY.includesTable)
    expect(text).toContain('Bajo pedido')
    expect(text).not.toMatch(/€|\bIVA\b/)
  })

  it('renders the description, the specs as a list of pairs, service and warranty', () => {
    expect(html).toContain('<p>Descripción de prueba.</p>')
    expect(html).toMatch(/<dt[^>]*>\s*Velocidad máxima\s*<\/dt>\s*<dd[^>]*>\s*3\.200 puntadas\/min/)
    expect(text).toContain(CATALOG_COPY.service.heading)
    expect(text).toContain(CATALOG_COPY.warranty.text)
  })

  it('links the breadcrumb back to the catalogue and to the type', () => {
    const nav = html.match(/<nav[^>]*>[\s\S]*?<\/nav>/)?.[0] ?? ''
    expect(nav).toContain(`aria-label="${CATALOG_COPY.breadcrumbLabel}"`)
    expect(nav).toContain('href="/maquinas"')
    expect(nav).toContain('href="/maquinas#presillas-y-botones"')
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
})
