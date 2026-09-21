import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'
import { AVAILABILITY_IDS, MACHINE_TYPE_IDS } from './data/catalog'

// One folder per machine: src/content/maquinas/<model in lowercase>/index.md plus its
// photos (1.jpg, 2.jpg…). The folder name is the URL slug.
const maquinas = defineCollection({
  loader: glob({
    pattern: '*/index.md',
    base: './src/content/maquinas',
    generateId: ({ entry }) => entry.replace(/\/index\.md$/, ''),
  }),
  schema: ({ image }) =>
    z.object({
      modelo: z.string().regex(/^[A-Z0-9-]+$/),
      marca: z.literal('JACK'),
      nombre: z.string().min(1),
      familia: z.enum(['ojales-botones-presillas']),
      tipo: z.enum(MACHINE_TYPE_IDS),
      resumen: z.string().min(50).max(160),
      disponibilidad: z.enum(AVAILABILITY_IDS),
      fotos: z.array(image()).min(1).max(4),
      especificaciones: z
        .array(z.object({ etiqueta: z.string().min(1), valor: z.string().min(1) }))
        .min(1),
    }),
})

export const collections = { maquinas }
