import { describe, expect, it } from 'vitest'
import {
  LEGAL_OWNER,
  PENDING,
  emailDetail,
  hasPendingLegalData,
  isMissing,
  missingLegalData,
} from './legal'

describe('isMissing', () => {
  it.each([null, undefined, '', '   '])('treats %j as missing', (value) => {
    expect(isMissing(value)).toBe(true)
  })

  it.each([0, false, {}])('does not coerce %j into missing', (value) => {
    expect(isMissing(value)).toBe(false)
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

describe('emailDetail', () => {
  it.each(['', '   '])('shows the pending marker and no link for %j', (email) => {
    expect(emailDetail(email)).toStrictEqual({ value: PENDING })
  })

  it('links a present email with mailto:', () => {
    expect(emailDetail(LEGAL_OWNER.email)).toStrictEqual({
      value: LEGAL_OWNER.email,
      href: `mailto:${LEGAL_OWNER.email}`,
    })
  })
})
