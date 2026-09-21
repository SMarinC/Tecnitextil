import { describe, expect, it } from 'vitest'
import { AWNING_MACHINES } from '../../data/home'
import { SECTIONS } from '../../data/sections'
import { renderToHtml } from '../../test/render'
import AwningMachines from './AwningMachines.astro'

const html = await renderToHtml(AwningMachines)

describe('AwningMachines section', () => {
  it('carries the id the header menu links to', () => {
    expect(html).toMatch(new RegExp(`<section[^>]*id="${SECTIONS.awningMachines.id}"`))
  })

  it('shows one described, sized and lazy-loaded photo per machine family', () => {
    const images = html.match(/<img[^>]*>/g) ?? []
    expect(images).toHaveLength(AWNING_MACHINES.families.length)
    for (const image of images) {
      expect(image).toMatch(/alt="[^"]+"/)
      expect(image).toMatch(/width="\d+"/)
      expect(image).toMatch(/height="\d+"/)
      expect(image).toContain('loading="lazy"')
    }
  })

  it('keeps list semantics on its three styled lists', () => {
    const lists = html.match(/<ul[^>]*>/g) ?? []
    expect(lists).toHaveLength(3)
    for (const list of lists) {
      expect(list).toContain('role="list"')
    }
  })

  it('has no WhatsApp or phone call to action of its own', () => {
    expect(html).not.toContain('wa.me')
    expect(html).not.toContain('tel:')
  })

  it('leaves the title and intro to the page hero and starts at <h2>', () => {
    expect(html).not.toContain(AWNING_MACHINES.heading)
    expect(html).not.toContain(AWNING_MACHINES.intro)
    expect(html).not.toMatch(/<h1[\s>]/)
    const levels = (html.match(/<h([1-6])[\s>]/g) ?? []).map((tag) => Number(tag[2]))
    expect(levels[0]).toBe(2)
  })
})
