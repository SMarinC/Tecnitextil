import { absoluteUrl } from '../data/seo'

// JSON inside <script type="application/ld+json"> must not be able to close the tag.
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replaceAll('<', '\\u003c')
}

// One step of a breadcrumb trail; the last one, the current page, has no link.
export interface Crumb {
  label: string
  href?: string
}

// schema.org BreadcrumbList. The catalogue publishes no Product: without a price Google
// treats it as invalid.
export function breadcrumbJsonLd(crumbs: readonly Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map(({ label, href }, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: label,
      ...(href === undefined ? {} : { item: absoluteUrl(href) }),
    })),
  }
}
