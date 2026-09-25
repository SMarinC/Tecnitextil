import { describe, expect, it } from 'vitest'
import { contactPagePath, emailContactPagePath } from './contactTracking'

describe('contactPagePath', () => {
  it.each([
    ['/', '/contactar/portada'],
    ['/index.html', '/contactar/portada'],
    [
      '/maquinas/ojales-botones-presillas/jk-n9-d',
      '/contactar/maquinas/ojales-botones-presillas/jk-n9-d',
    ],
    [
      '/maquinas/ojales-botones-presillas/jk-n9-d.html',
      '/contactar/maquinas/ojales-botones-presillas/jk-n9-d',
    ],
    ['/toldos/', '/contactar/toldos'],
    ['/servicio-tecnico', '/contactar/servicio-tecnico'],
    ['/maquinas', '/contactar/maquinas'],
  ] as const)('%s -> %s', (pathname, expected) => {
    expect(contactPagePath(pathname)).toBe(expected)
  })
})

describe('emailContactPagePath', () => {
  it.each([
    ['/', '/contactar-correo/portada'],
    ['/index.html', '/contactar-correo/portada'],
    [
      '/maquinas/ojales-botones-presillas/jk-n9-d',
      '/contactar-correo/maquinas/ojales-botones-presillas/jk-n9-d',
    ],
    [
      '/maquinas/ojales-botones-presillas/jk-n9-d.html',
      '/contactar-correo/maquinas/ojales-botones-presillas/jk-n9-d',
    ],
    ['/toldos/', '/contactar-correo/toldos'],
    ['/servicio-tecnico', '/contactar-correo/servicio-tecnico'],
    ['/maquinas', '/contactar-correo/maquinas'],
  ] as const)('%s -> %s', (pathname, expected) => {
    expect(emailContactPagePath(pathname)).toBe(expected)
  })
})
