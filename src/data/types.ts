// Shared content shapes, used across the site's page-scoped data modules.
import type { ImageMetadata } from 'astro'
import type { IconName } from '../components/Icon/icons'

export interface IconItem {
  icon: IconName
  title: string
  description: string
}

export interface Step {
  title: string
  description: string
}

export interface Photo {
  src: ImageMetadata
  alt: string
}
