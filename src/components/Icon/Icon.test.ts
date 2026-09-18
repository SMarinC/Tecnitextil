import { describe, expect, it } from 'vitest'
import { renderToHtml } from '../../test/render'
import Icon from './Icon.astro'
import { ICON_MARKUP, type IconName } from './icons'

describe('Icon', () => {
  it.each(Object.keys(ICON_MARKUP) as IconName[])(
    '%s renders as a decorative, currentColor-stroked svg',
    async (name) => {
      const html = await renderToHtml(Icon, { name })
      expect(html).toMatch(/<svg[^>]*\baria-hidden="true"/)
      expect(html).toMatch(/<svg[^>]*\bstroke="currentColor"/)
      expect(html).toContain(ICON_MARKUP[name])
    },
  )
})
