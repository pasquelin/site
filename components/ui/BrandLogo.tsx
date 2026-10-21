import type { Brand } from '@/content/types'

/**
 * A logo sized for its shape. At one shared height a long wordmark looks tiny
 * next to a compact mark; at one shared area it looks huge. Height falls off
 * with the aspect ratio between the two, which reads as one even line.
 *
 * Plain `<img>`, never inlined: an SVG in an image cannot run anything, and
 * these files come from the outside.
 */
export function BrandLogo({
  brand,
  size,
  className = '',
}: {
  brand: Brand
  /** Height of a square logo, in px. Wider logos get shorter. */
  size: number
  className?: string
}) {
  const height = size * brand.ratio ** -0.38
  const width = height * brand.ratio

  return (
    // eslint-disable-next-line @next/next/no-img-element -- static export, SVG, explicit size
    <img
      src={`/logos/${brand.logo}`}
      alt={brand.name}
      width={Math.round(width)}
      height={Math.round(height)}
      loading="lazy"
      decoding="async"
      className={`shrink-0 ${brand.invert ? '[filter:invert(1)_hue-rotate(180deg)]' : ''} ${className}`}
    />
  )
}
