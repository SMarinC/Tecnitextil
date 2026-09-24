import photo from '../assets/awning-machines/bandeja-movil.webp'
import type { MachineFamily } from '../data/catalog'
import type { Machine } from '../lib/catalog'

// Samples for component and logic tests: Vitest cannot load the real collection.
export function sampleMachine(overrides: Partial<Machine> = {}): Machine {
  return {
    id: 'ojales-botones-presillas/jk-t1900gsk-dii',
    familia: 'ojales-botones-presillas',
    tipo: 'presillas-y-botones',
    modelo: 'JK-T1900GSK-DII',
    marca: 'JACK',
    nombre: 'Máquina de botones y presillas electrónica con canilla',
    resumen: 'Máquina de presillas y botones de prueba, con tablero y bancada incluidos.',
    disponibilidad: 'bajo-pedido',
    fotos: [photo, photo],
    especificaciones: [{ etiqueta: 'Velocidad máxima', valor: '3.200 puntadas/min' }],
    ...overrides,
  }
}

// A second category with no "includes" note, so the rules can be tested across
// categories without the real catalogue.
export const SAMPLE_FAMILY: MachineFamily = {
  id: 'pespunte',
  label: 'Pespunte',
  title: 'Máquinas de pespunte',
  summary: 'Máquinas de pespunte de prueba, con o sin cortahílos, para todo tipo de género.',
  cover: 'jk-f6',
  types: [
    { id: 'sin-cortahilos', label: 'Sin cortahílos' },
    { id: 'con-cortahilos', label: 'Con cortahílos' },
  ],
}

export function sampleSewingMachine(modelo: string, tipo = 'sin-cortahilos'): Machine {
  return sampleMachine({
    id: `pespunte/${modelo.toLowerCase()}`,
    familia: 'pespunte',
    tipo,
    modelo,
    nombre: 'Máquina de pespunte de prueba',
  })
}
