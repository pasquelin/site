'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV } from '@/content/nav'
import { AVAILABILITY, SITE_URL } from '@/content/site'
import { UI } from '@/content/ui'
import { otherLang } from '@/lib/i18n'
import { Icon } from './icons'
import { useIde } from './ide-context'

/**
 * The window's title bar, carrying the workspaces.
 *
 * Modelled on AI Desktop Studio: traffic lights, then the sections as a row
 * of icon-and-label pills with the active one raised, then live status on the
 * right. Tabs pressed against the top of the viewport read as a web page that
 * lost its chrome — this is what makes the whole thing read as an application.
 */
export function TitleBar() {
  const pathname = usePathname()
  const { lang, mode, setMode } = useIde()
  const other = otherLang(lang)
  const host = SITE_URL.replace(/^https?:\/\//, '')

  const isActive = (path: string) =>
    path ? pathname.startsWith(`/${lang}/${path}`) : pathname === `/${lang}/`

  return (
    <header className="flex h-11 shrink-0 items-center gap-3 border-b border-line-soft bg-rail px-3">
      <span aria-hidden className="hidden shrink-0 items-center gap-2 pr-1 sm:flex">
        <span className="size-3 rounded-full bg-coral/80" />
        <span className="size-3 rounded-full bg-amber/80" />
        <span className="size-3 rounded-full bg-green/80" />
      </span>

      <nav
        aria-label={lang === 'fr' ? 'Espaces' : 'Workspaces'}
        className="flex min-w-0 items-center gap-0.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {NAV.map((entry) => {
          const active = isActive(entry.path)
          return (
            <Link
              key={entry.id}
              href={entry.path ? `/${lang}/${entry.path}/` : `/${lang}/`}
              aria-current={active ? 'page' : undefined}
              className={`flex shrink-0 items-center gap-2 rounded-panel px-2.5 py-1.5 text-[13px] transition-colors ${
                active
                  ? 'bg-ink-800 text-fg-bright shadow-[inset_0_0_0_1px] shadow-line'
                  : 'text-fg-muted hover:text-fg-bright'
              }`}
            >
              <Icon name={entry.icon} className="size-4" />
              <span className="hidden md:inline">{entry.label[lang]}</span>
            </Link>
          )
        })}
      </nav>

      <div className="ml-auto flex shrink-0 items-center gap-2 font-mono text-[11.5px] text-fg-muted">
        <span className="hidden lg:inline">{host}</span>

        {AVAILABILITY.open ? (
          <span className="hidden items-center gap-1.5 rounded border border-line-soft px-2 py-1 sm:flex">
            <span aria-hidden className="size-1.5 rounded-full bg-green" />
            <span className="text-green">{UI.available[lang]}</span>
          </span>
        ) : null}

        <div className="flex items-center rounded border border-line-soft" role="group" aria-label={UI.mode.switchTo[lang]}>
          {(['human', 'dev'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              aria-pressed={mode === m}
              className={`px-2 py-1 transition-colors ${
                mode === m ? 'bg-amber/15 text-amber' : 'hover:text-fg-bright'
              }`}
            >
              {UI.mode[m][lang]}
            </button>
          ))}
        </div>

        <Link
          href={pathname.replace(/^\/(fr|en)/, `/${other}`)}
          hrefLang={other}
          className="rounded border border-line-soft px-2 py-1 uppercase transition-colors hover:text-fg-bright"
        >
          {other}
        </Link>
      </div>
    </header>
  )
}
