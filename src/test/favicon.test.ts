import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import sharp from 'sharp'

// Google requires a square favicon whose size is a multiple of 48px, crawlable from the
// home page. These checks guard the generated files so a future logo change can't
// silently drop back to a non-conforming icon.
const PUBLIC_DIR = new URL('../../public/', import.meta.url)

describe('favicon files', () => {
  it.each([48, 96, 192])(
    'favicon-%dpx.png is a square PNG that is a multiple of 48px',
    async (size) => {
      const path = new URL(`favicon-${size}.png`, PUBLIC_DIR)
      expect(existsSync(path)).toBe(true)
      const metadata = await sharp(readFileSync(path)).metadata()
      expect(metadata.width).toBe(size)
      expect(metadata.height).toBe(size)
      expect(size % 48).toBe(0)
      expect(metadata.hasAlpha).toBe(true)
    },
  )

  it('favicon.ico exists and starts with the ICO header', () => {
    const path = new URL('favicon.ico', PUBLIC_DIR)
    expect(existsSync(path)).toBe(true)
    const bytes = readFileSync(path)
    expect(Array.from(bytes.subarray(0, 4))).toEqual([0x00, 0x00, 0x01, 0x00])
  })
})
