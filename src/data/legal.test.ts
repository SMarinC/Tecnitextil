import { describe, expect, it } from 'vitest'
import { hasPendingLegalData, isMissing, missingLegalData } from './legal'

describe('isMissing', () => {
  it.each([null, undefined, '', '   '])('treats %j as missing', (value) => {
    expect(isMissing(value)).toBe(true)
  })

  it('treats text with content as present', () => {
    expect(isMissing('Carrer del Perú, 7')).toBe(false)
  })
})

describe('legal data', () => {
  it('has every required owner field and the review date filled in', () => {
    expect(missingLegalData()).toEqual([])
    expect(hasPendingLegalData).toBe(false)
  })
})
