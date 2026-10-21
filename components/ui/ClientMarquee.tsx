import { BrandLogo } from '@/components/ui/BrandLogo'
import { BRANDS } from '@/content/brands'
import { CLIENTS } from '@/content/profile'

/** One pass over the clients. Only the first is announced; the others exist for the loop. */
function Run({ hidden }: { hidden?: boolean }) {
  return (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center gap-x-14 pr-14">
      {CLIENTS.map((name) => {
        const brand = BRANDS[name]
        return (
          <li key={name} className="flex h-12 shrink-0 items-center">
            {brand ? (
              <BrandLogo brand={brand} size={44} className="opacity-90" />
            ) : (
              <span className="whitespace-nowrap text-[17px] font-medium tracking-[-0.01em] text-fg-muted">{name}</span>
            )}
          </li>
        )
      })}
    </ul>
  )
}

/**
 * The companies that trusted him, as a slow endless band inside the content
 * column, fading out at both ends. The track holds four passes and slides by
 * two, so its visible half is always wider than the column: no gap ever
 * opens at the end of the loop, whatever the screen width.
 */
export function ClientMarquee() {
  return (
    <div className="marquee overflow-hidden">
      <div className="marquee-track flex w-max">
        <Run />
        <Run hidden />
        <Run hidden />
        <Run hidden />
      </div>
    </div>
  )
}
