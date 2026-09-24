import { getCollection } from 'astro:content'
import { MACHINE_FAMILIES } from '../data/catalog'
import { CATALOG_PAGE, indexablePaths } from '../data/pages'
import { SITE_URL } from '../data/seo'
import { familyPath, machinePath, toMachine } from '../lib/catalog'
import { buildSitemapXml } from '../lib/siteFiles'

export async function GET(): Promise<Response> {
  const machines = (await getCollection('maquinas')).map(toMachine)
  const paths = [
    ...indexablePaths(),
    CATALOG_PAGE.path,
    ...MACHINE_FAMILIES.map(familyPath),
    ...machines.map(machinePath),
  ]
  return new Response(buildSitemapXml(SITE_URL, paths), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  })
}
