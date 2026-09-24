import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'
import { AVAILABILITY_IDS, FAMILY_IDS, MACHINE_TYPE_IDS } from './data/catalog'

// One folder per machine inside its category's folder:
// src/content/maquinas/<category>/<model in lowercase>/index.md plus its photos (1.jpg…).
// The entry id is "<category>/<model>", its path under /maquinas. Whether a type belongs
// to its category is checked at build time by assertCatalog (src/lib/catalog.ts).
const maquinas = defineCollection({
  loader: glob({
    pattern: '*/*/index.md',
    base: './src/content/maquinas',
    generateId: ({ entry }) => entry.replace(/\/index\.md$/, ''),
  }),
  schema: ({ image }) =>
    z.object({
      modelo: z.string().regex(/^[A-Z0-9-]+$/),
      marca: z.literal('JACK'),
      nombre: z.string().min(1),
      familia: z.enum(FAMILY_IDS),
      tipo: z.enum(MACHINE_TYPE_IDS),
      resumen: z.string().min(50).max(160),
      disponibilidad: z.enum(AVAILABILITY_IDS),
      // Empty when the supplier has published no photo: the pages then show a
      // "Foto no disponible" frame.
      fotos: z.array(image()).max(4),
      especificaciones: z
        .array(z.object({ etiqueta: z.string().min(1), valor: z.string().min(1) }))
        .min(1),
    }),
})

export const collections = { maquinas }
