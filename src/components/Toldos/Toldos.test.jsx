import { describe, it, expect } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import Toldos from './Toldos.jsx'

const markup = renderToStaticMarkup(<Toldos />)

const FAMILY_TITLES = [
  'Con bandeja móvil',
  'Con cabezal móvil',
  'Semiautomáticas con mesa de rodillos',
]

const SERVICES = [
  'Instalación y puesta en marcha',
  'Reparación de averías',
  'Mantenimiento preventivo',
]

const COMPONENTS = [
  'Cabezal Dürkopp Adler 867',
  'PLC y pantalla táctil',
  'Sensores y fotocélulas',
  'Servomotores y drives',
  'Neumática y pinzas',
  'Carro, guías y bandeja',
]

const IMAGE_NOTE =
  'Imágenes de referencia de los fabricantes. TECNITEXTIL es un servicio técnico independiente y no está vinculado a las marcas mostradas.'

describe('Toldos section', () => {
  it('renders the anchor the header nav links to', () => {
    expect(markup).toContain('<section')
    expect(markup).toContain('id="toldos"')
  })

  it('renders the exact section heading as an h2', () => {
    expect(markup).toMatch(
      /<h2[^>]*>Asistencia para máquinas de coser toldos automatizadas<\/h2>/,
    )
  })

  it('renders both subheadings and never repeats the next section title', () => {
    expect(markup).toMatch(/<h3[^>]*>Nuestro servicio<\/h3>/)
    expect(markup).toMatch(/<h3[^>]*>Qué intervenimos<\/h3>/)
    expect(markup).not.toContain('Qué hacemos')
  })

  it.each(FAMILY_TITLES)('renders the machine family "%s"', (title) => {
    expect(markup).toContain(`>${title}</h3>`)
  })

  it.each(SERVICES)('renders the service "%s"', (service) => {
    expect(markup).toContain(`>${service}</li>`)
  })

  it.each(COMPONENTS)('renders the component "%s"', (component) => {
    expect(markup).toContain(`>${component}</li>`)
  })

  it('renders exactly three local, lazy-loaded family photos with alt text and dimensions', () => {
    const images = markup.match(/<img[^>]*>/g) ?? []
    expect(images).toHaveLength(3)
    for (const img of images) {
      expect(img).toMatch(/src="\/img\/toldos\/[a-z-]+\.webp"/)
      expect(img).toMatch(/alt="[^"]+"/)
      expect(img).toMatch(/width="\d+"/)
      expect(img).toMatch(/height="\d+"/)
      expect(img).toContain('loading="lazy"')
      expect(img).toContain('decoding="async"')
    }
  })

  it('does not add WhatsApp or phone calls to action', () => {
    expect(markup).not.toContain('wa.me')
    expect(markup).not.toContain('tel:')
  })

  it('renders the image reference note', () => {
    expect(markup).toContain(IMAGE_NOTE)
  })
})
