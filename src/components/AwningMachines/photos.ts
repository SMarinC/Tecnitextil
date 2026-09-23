import type { ImageMetadata } from 'astro'
import awningCarriageImage from '../../assets/awning-machines/cabezal-movil.webp'
import awningRollerTableImage from '../../assets/awning-machines/mesa-rodillos.webp'
import awningTrayImage from '../../assets/awning-machines/bandeja-movil.webp'
import type { AwningPhotoKey } from '../../data/awnings'

// The photos live beside the component, not in src/data/, so the content modules stay
// importable by the browser tests (which cannot load image files).
export const AWNING_PHOTOS = {
  'bandeja-movil': awningTrayImage,
  'cabezal-movil': awningCarriageImage,
  'mesa-rodillos': awningRollerTableImage,
} satisfies Record<AwningPhotoKey, ImageMetadata>
