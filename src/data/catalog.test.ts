import { describe, expect, it } from 'vitest'
import { MACHINE_FAMILIES, familyById, modelCountLabel } from './catalog'

describe('MACHINE_FAMILIES', () => {
  it('gives every category a unique id and at least one type', () => {
    const ids = MACHINE_FAMILIES.map(({ id }) => id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const { types } of MACHINE_FAMILIES) expect(types.length).toBeGreaterThan(0)
  })

  it.each([...MACHINE_FAMILIES])('$id keeps its type ids unique', ({ types }) => {
    const ids = types.map(({ id }) => id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('finds a category by id and fails loudly on an unknown one', () => {
    expect(familyById('ojales-botones-presillas').label).toBe('Ojales, botones y presillas')
    expect(() => familyById('no-existe')).toThrow(/no-existe/)
  })
})

describe('modelCountLabel', () => {
  it('counts models in Spanish', () => {
    expect(modelCountLabel(1)).toBe('1 modelo')
    expect(modelCountLabel(13)).toBe('13 modelos')
  })
})
