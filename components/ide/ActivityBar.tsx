'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV } from '@/content/nav'
import type { Lang } from '@/content/types'
import { Icon } from './icons'

const isActive = (pathname: string, lang: Lang, path: string) => {
  const base = `/${lang}/`
  if (!path) return pathname === base
  return pathname.startsWith(`${base}${path}`)
}

/** Below 768 px the rail becomes a bottom bar, the way a mobile IDE does it. */
export function MobileTabBar({ lang }: { lang: Lang }) {
  const pathname = usePathname()

  return (
    <nav
      aria-label={lang === 'fr' ? 'Sections du site' : 'Site sections'}
      className="flex shrink-0 border-t border-line-soft bg-rail md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {NAV.map((entry) => {
        const active = isActive(pathname, lang, entry.path)
        return (
          <Link
            key={entry.id}
            href={entry.path ? `/${lang}/${entry.path}/` : `/${lang}/`}
            aria-current={active ? 'page' : undefined}
            className={`flex min-h-[3.25rem] flex-1 flex-col items-center justify-center gap-1 text-[10px] transition-colors ${
              active ? 'text-amber' : 'text-fg-muted'
            }`}
          >
            <Icon name={entry.icon} className="size-[18px]" />
            {entry.label[lang]}
          </Link>
        )
      })}
    </nav>
  )
}
