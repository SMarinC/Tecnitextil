import { describe, expect, it } from 'vitest'
import { contactPagePath } from './contactTracking'

describe('contactPagePath', () => {
  it.each([
    ['/', '/contactar/portada'],
    ['/index.html', '/contactar/portada'],
    ['/maquinas/jk-n9-d', '/contactar/maquinas/jk-n9-d'],
    ['/maquinas/jk-n9-d.html', '/contactar/maquinas/jk-n9-d'],
    ['/toldos/', '/contactar/toldos'],
    ['/servicio-tecnico', '/contactar/servicio-tecnico'],
    ['/maquinas', '/contactar/maquinas'],
  ] as const)('%s -> %s', (pathname, expected) => {
    expect(contactPagePath(pathname)).toBe(expected)
  })
})
