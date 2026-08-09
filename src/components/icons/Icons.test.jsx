import { describe, it, expect } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import {
  SewingMachineIcon,
  FactoryIcon,
  TruckIcon,
  BadgeIcon,
  MapPinIcon,
  ClockIcon,
  WhatsAppIcon,
} from './Icons.jsx'

const icons = {
  SewingMachineIcon,
  FactoryIcon,
  TruckIcon,
  BadgeIcon,
  MapPinIcon,
  ClockIcon,
  WhatsAppIcon,
}

describe('icon components', () => {
  Object.entries(icons).forEach(([name, Icon]) => {
    it(`${name} renders a single <svg> without throwing`, () => {
      const markup = renderToStaticMarkup(<Icon />)
      expect(markup).toContain('<svg')
    })

    it(`${name} forwards className to the <svg>`, () => {
      const markup = renderToStaticMarkup(<Icon className="test-icon" />)
      expect(markup).toContain('class="test-icon"')
    })
  })
})
