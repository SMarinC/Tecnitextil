import { describe, it, expect } from 'vitest'
import { LEGAL_OWNER, LAST_UPDATED, hasPendingLegalData } from './legal.js'

// LSSI-CE art. 10: the site must identify its owner. Publishing with any field
// still pending would show a draft notice on the legal pages.
describe('legal owner data', () => {
  it('has every owner field filled in', () => {
    for (const [field, value] of Object.entries(LEGAL_OWNER)) {
      expect(value, field).toEqual(expect.any(String))
      expect(value.trim(), field).not.toBe('')
    }
    expect(hasPendingLegalData).toBe(false)
  })

  it('states when the legal texts were last reviewed', () => {
    expect(LAST_UPDATED).toEqual(expect.any(String))
    expect(LAST_UPDATED.trim()).not.toBe('')
  })
})
