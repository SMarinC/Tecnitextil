import { describe, expect, it } from 'vitest'
import { COMPANY } from './company'
import {
  LEGAL_LINKS,
  LEGAL_NOTICE,
  LEGAL_OWNER,
  PENDING,
  PRIVACY_POLICY,
  SALES_CONDITIONS,
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

  it('never denies a relationship with the brands it names', () => {
    const text = JSON.stringify(LEGAL_NOTICE)
    expect(text).not.toContain('sin que exista relación comercial')
    expect(text).toContain(
      'Las marcas y nombres comerciales citados pertenecen a sus respectivos titulares y se usan para identificar los productos y servicios ofrecidos.',
    )
    expect(text).toContain(
      'Las fotografías de la sección de máquinas de coser toldos son imágenes de referencia de sus fabricantes. En ese servicio, TECNITEXTIL actúa como servicio técnico independiente, sin vinculación con dichas marcas.',
    )
  })

  it('keeps the legal notice unchanged after sharing the owner identification', () => {
    expect(LEGAL_NOTICE.identification).toEqual({
      heading: 'Datos del titular',
      items: [
        { label: 'Titular', value: LEGAL_OWNER.legalName },
        { label: 'NIF', value: LEGAL_OWNER.taxId },
        { label: 'Domicilio', value: LEGAL_OWNER.address },
        { label: 'Email', value: LEGAL_OWNER.email, href: `mailto:${LEGAL_OWNER.email}` },
        { label: 'Teléfono', value: COMPANY.phone.display },
      ],
    })
  })
})

describe('sales conditions', () => {
  it('states the withdrawal period, the legal warranty period and includes the withdrawal form', () => {
    const text = JSON.stringify(SALES_CONDITIONS)
    expect(text).toContain('14 días naturales')
    expect(text).toContain('tres años')
    expect(text).toContain('Modelo de formulario de desistimiento')
  })

  it('gives the owner email and address the withdrawal form requires', () => {
    const text = JSON.stringify(SALES_CONDITIONS)
    expect(text).toContain(LEGAL_OWNER.email)
    expect(text).toContain(LEGAL_OWNER.address)
  })
})

describe('privacy policy', () => {
  it('adds the invoicing legal basis for buyers', () => {
    expect(JSON.stringify(PRIVACY_POLICY)).toContain('art. 6.1.c RGPD')
  })

  it('the privacy policy covers the hosting logs, voluntary data and automated decisions (GDPR art. 13.2 e, f)', () => {
    const text = JSON.stringify(PRIVACY_POLICY)
    expect(text).toContain('dirección IP')
    expect(text).toContain('Darnos tus datos es voluntario')
    expect(text).toContain('No tomamos decisiones automatizadas')
  })
})

describe('LEGAL_LINKS', () => {
  it('lists the sales conditions first, then the legal notice and the privacy policy', () => {
    expect(LEGAL_LINKS).toEqual([
      { label: SALES_CONDITIONS.title, href: SALES_CONDITIONS.path },
      { label: LEGAL_NOTICE.title, href: LEGAL_NOTICE.path },
      { label: PRIVACY_POLICY.title, href: PRIVACY_POLICY.path },
    ])
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
