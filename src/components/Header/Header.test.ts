import { describe, expect, it } from 'vitest'
import { renderToHtml } from '../../test/render'
import Header from './Header.astro'

const current = async (currentPath: string) =>
  (await renderToHtml(Header, { currentPath })).match(/<a[^>]*aria-current="page"[^>]*>/g) ?? []

describe('Header', () => {
  it.each(['/maquinas', '/maquinas/jk-t1900gsk-dii'])(
    'marks "Venta de máquinas" as current on %s, in both menus',
    async (path) => {
      const links = await current(path)
      expect(links).toHaveLength(2)
      for (const link of links) expect(link).toContain('href="/maquinas"')
    },
  )

  it('marks nothing on the home page', async () => {
    expect(await current('/')).toEqual([])
  })

  it('does not mark a page whose path only starts with the same letters', async () => {
    expect(await current('/maquinaria')).toEqual([])
  })
})
