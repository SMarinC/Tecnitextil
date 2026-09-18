// JSON inside <script type="application/ld+json"> must not be able to close the tag.
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replaceAll('<', '\\u003c')
}
