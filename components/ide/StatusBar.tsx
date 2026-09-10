'use client'

import { usePathname } from 'next/navigation'
import { PERSON } from '@/content/site'
import { UI } from '@/content/ui'
import type { CatalogItem } from '@/lib/catalog'
import { useIde } from './ide-context'

/**
 * The foot of the window. Its left half is the breadcrumb — where you are —
 * and its right half the two controls that belong to the frame rather than to
 * the page. Everything else moved up to the title bar.
 */
export function StatusBar({ catalog }: { catalog: readonly CatalogItem[] }) {
  const { lang, mode, terminalOpen, setTerminalOpen, setPaletteOpen } = useIde()
  const pathname = usePathname()

  const stripped = pathname.replace(/^\/(fr|en)\/?/, '').replace(/\/$/, '')
  const item = catalog.find((i) => i.path === stripped)
  const leaf = item ? (mode === 'dev' ? item.file : item.label) : 'whoami.ts'

  return (
    <footer className="flex h-statusbar shrink-0 items-center gap-2 border-t border-line-soft bg-rail px-3 font-mono text-[11px] text-fg-muted">
      <span className="truncate">
        {PERSON.name} <span className="text-fg-faint">—</span>{' '}
        <span className="text-fg">{leaf}</span>
      </span>

      <span className="flex-1" />

      <span className="hidden text-green sm:inline">0 errors</span>

      <button
        type="button"
        onClick={() => setPaletteOpen(true)}
        className="hidden rounded px-1.5 py-0.5 transition-colors hover:bg-ink-800 hover:text-fg-bright md:inline"
      >
        ⌘K
      </button>

      <button
        type="button"
        onClick={() => setTerminalOpen(!terminalOpen)}
        aria-pressed={terminalOpen}
        className="hidden rounded px-1.5 py-0.5 transition-colors hover:bg-ink-800 hover:text-fg-bright md:inline"
      >
        {terminalOpen ? UI.actions.closeTerminal[lang] : UI.actions.openTerminal[lang]}
      </button>
    </footer>
  )
}
