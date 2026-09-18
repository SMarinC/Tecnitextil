import { experimental_AstroContainer as AstroContainer } from 'astro/container'

// The only place tests touch Astro's Container API, which is still experimental:
// if it changes, this is the file to update.
type Component = Parameters<AstroContainer['renderToString']>[0]

let container: AstroContainer | undefined

export async function renderToHtml(
  component: Component,
  props: Record<string, unknown> = {},
): Promise<string> {
  container ??= await AstroContainer.create()
  return container.renderToString(component, { props })
}

// Visible text of an HTML fragment, ignoring icons and collapsing whitespace.
export function textContent(html: string): string {
  return html
    .replace(/<svg[\s\S]*?<\/svg>/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}
