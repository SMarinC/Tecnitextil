// Generates optimized copies of brand images from their originals in public/.
// Run `npm run images` whenever an original changes, and commit the output.
// The originals stay for the favicon, structured data and share previews.
import sharp from 'sharp'

// The logo is displayed at most at 110px (footer); 220px covers 2x screens.
const LOGO_DISPLAY_SIZE = 110

const { size } = await sharp('public/logo.png')
  .resize(LOGO_DISPLAY_SIZE * 2, LOGO_DISPLAY_SIZE * 2, { fit: 'cover', withoutEnlargement: true })
  .webp({ quality: 85, effort: 6 })
  .toFile('public/logo.webp')

console.log(`public/logo.webp: ${(size / 1024).toFixed(1)} kB`)
