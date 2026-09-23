import { experimental_AstroContainer as AstroContainer } from 'astro/container'

// The only place tests touch Astro's Container API, which is still experimental:
// if it changes, this is the file to update.
type Component = Parameters<AstroContainer['renderToString']>[0]

let container: AstroContainer | undefined

// `component` is `unknown` because plain tsc can't resolve `.astro` imports: type-aware
// lint sees them as `error`, and an `unknown` parameter accepts them without a disable.
// Slots are HTML strings, e.g. { default: '<p>…</p>' }.
export async function renderToHtml(
  component: unknown,
  props: Record<string, unknown> = {},
  slots: Record<string, string> = {},
): Promise<string> {
  container ??= await AstroContainer.create()
  return container.renderToString(component as Component, { props, slots })
}

// Visible text of an HTML fragment, ignoring icons and collapsing whitespace.
export function textContent(html: string): string {
  let stripped = html.replace(/<svg[\s\S]*?<\/svg>/g, '')
  // Repeat until the string stops changing: a single pass can leave a new "tag" behind
  // when a removed one exposes another (e.g. `<<a>script>`), which is what CodeQL flags
  // as incomplete multi-character sanitization.
  let previous: string
  do {
    previous = stripped
    stripped = stripped.replace(/<[^>]+>/g, '')
  } while (stripped !== previous)
  return stripped.replace(/\s+/g, ' ').trim()
}
