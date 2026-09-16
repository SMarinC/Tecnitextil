import { describe, it, expect } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import App from '../App.jsx'
import { NAV_ITEMS, SECTIONS } from './sections.js'
import { SERVICES, MACHINE_TYPES, VALUE_PROPS } from './home.js'
import { ICONS } from '../components/icons/iconRegistry.js'

const sectionIds = Object.values(SECTIONS).map(({ id }) => id)

describe('page content', () => {
  const markup = renderToStaticMarkup(<App />)

  it.each(sectionIds)('renders a section with id "%s"', (id) => {
    expect(markup).toContain(`id="${id}"`)
  })

  it.each(NAV_ITEMS)('nav item "$label" points to an existing section', ({ href }) => {
    expect(sectionIds.map((id) => `#${id}`)).toContain(href)
  })

  it('every icon key used in the content has a registered icon component', () => {
    const iconKeys = [...SERVICES.items, ...MACHINE_TYPES.items, ...VALUE_PROPS.items].map(
      ({ icon }) => icon,
    )
    for (const key of iconKeys) {
      expect(ICONS, `missing icon "${key}"`).toHaveProperty(key)
    }
  })
})
