import { describe, it, expect } from 'vitest'
import { isMissing, missingLegalData, hasPendingLegalData } from './legal.js'

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
