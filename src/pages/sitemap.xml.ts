import { getCollection } from 'astro:content'
import { CATALOG_PAGE, indexablePaths } from '../data/pages'
import { SITE_URL } from '../data/seo'
import { machinePath } from '../lib/catalog'
import { buildSitemapXml } from '../lib/siteFiles'

export async function GET(): Promise<Response> {
  const machines = await getCollection('maquinas')
  const paths = [
    ...indexablePaths(),
    CATALOG_PAGE.path,
    ...machines.map(({ id }) => machinePath(id)),
  ]
  return new Response(buildSitemapXml(SITE_URL, paths), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  })
}
