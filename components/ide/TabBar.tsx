'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { CatalogItem } from '@/lib/catalog'
import { useIde } from './ide-context'

/**
 * Tabs accumulate as the visitor moves, exactly as they do in an editor —
 * the trail of what they looked at stays in front of them.
 */
export function TabBar({ catalog }: { catalog: readonly CatalogItem[] }) {
  const pathname = usePathname()
  const router = useRouter()
  const { lang, mode } = useIde()
  const [open, setOpen] = useState<readonly CatalogItem[]>([])

  useEffect(() => {
    const stripped = pathname.replace(/^\/(fr|en)\/?/, '').replace(/\/$/, '')
    const item = catalog.find((i) => i.path === stripped)
    if (!item) return
    // The open set is a log of where the visitor has been, so it is derived
    // from navigation rather than from props — an effect is the right tool.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen((prev) => (prev.some((t) => t.id === item.id) ? prev : [...prev, item].slice(-8)))
  }, [pathname, catalog])

  const close = (item: CatalogItem) => {
    const remaining = open.filter((t) => t.id !== item.id)
    setOpen(remaining)
    if (item.href === pathname) {
      router.push(remaining.at(-1)?.href ?? `/${lang}/`)
    }
  }

  if (open.length === 0) return null

  return (
    <div
      role="tablist"
      aria-label={lang === 'fr' ? 'Pages ouvertes' : 'Open pages'}
      className="flex h-tabbar shrink-0 items-stretch overflow-x-auto border-b border-line-soft bg-ink-900 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {open.map((item) => {
        const active = item.href === pathname
        return (
          <div
            key={item.id}
            className={`group flex shrink-0 items-center gap-2 border-r border-line-soft pl-3 pr-1.5 text-[12.5px] font-mono transition-colors ${
              active
                ? 'bg-ink-850 text-fg-bright'
                : 'text-fg-muted hover:bg-ink-850/60 hover:text-fg'
            }`}
          >
            {active ? <span aria-hidden className="absolute mt-[-2.2rem] h-px w-0" /> : null}
            <Link href={item.href} role="tab" aria-selected={active} className="py-2">
              {mode === 'dev' ? item.file : item.label}
            </Link>
            <button
              type="button"
              onClick={() => close(item)}
              aria-label={`${lang === 'fr' ? 'Fermer' : 'Close'} ${item.label}`}
              className="flex size-5 items-center justify-center rounded text-fg-muted opacity-0 transition-opacity hover:bg-ink-700 hover:text-fg-bright focus-visible:opacity-100 group-hover:opacity-100"
            >
              <svg viewBox="0 0 16 16" className="size-3" aria-hidden>
                <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" fill="none" />
              </svg>
            </button>
          </div>
        )
      })}
    </div>
  )
}
