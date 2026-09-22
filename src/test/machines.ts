import photo from '../assets/awning-machines/bandeja-movil.webp'
import type { Machine } from '../lib/catalog'

// A machine for component and logic tests: Vitest cannot load the real collection.
export function sampleMachine(overrides: Partial<Machine> = {}): Machine {
  return {
    slug: 'jk-t1900gsk-dii',
    modelo: 'JK-T1900GSK-DII',
    marca: 'JACK',
    nombre: 'Máquina de botones y presillas electrónica con canilla',
    tipo: 'presillas-y-botones',
    resumen: 'Máquina de presillas y botones de prueba, con tablero y bancada incluidos.',
    disponibilidad: 'bajo-pedido',
    fotos: [photo, photo],
    especificaciones: [{ etiqueta: 'Velocidad máxima', valor: '3.200 puntadas/min' }],
    ...overrides,
  }
}
