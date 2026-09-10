'use client'

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import type { CatalogItem } from '@/lib/catalog'
import type { Lang } from '@/content/types'
import { MobileTabBar } from './ActivityBar'
import { ToolRail } from './ToolRail'
import { CommandPalette } from './CommandPalette'
import { IdeProvider, useIde } from './ide-context'
import { StatusBar } from './StatusBar'
import { TabBar } from './TabBar'
import { TitleBar } from './TitleBar'
import { Terminal } from './Terminal'

const MIN_TERMINAL = 96
const MAX_TERMINAL_RATIO = 0.6

/** Drag the divider the way you would in an editor. */
function TerminalDivider({ onResize }: { onResize: (height: number) => void }) {
  const dragging = useRef(false)

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = true
    e.currentTarget.setPointerCapture(e.pointerId)
  }, [])

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragging.current) return
      const height = window.innerHeight - e.clientY
      onResize(Math.max(MIN_TERMINAL, Math.min(height, window.innerHeight * MAX_TERMINAL_RATIO)))
    },
    [onResize],
  )

  const onPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = false
    e.currentTarget.releasePointerCapture(e.pointerId)
  }, [])

  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      className="h-1 shrink-0 cursor-row-resize border-t border-line-soft bg-rail transition-colors hover:bg-amber/40"
    />
  )
}

function MobileTerminal({ catalog }: { catalog: readonly CatalogItem[] }) {
  const { lang } = useIde()
  const [open, setOpen] = useState(false)

  return (
    <div className="md:hidden">
      {open ? (
        <div className="h-[42vh] border-t border-line-soft">
          <Terminal catalog={catalog} onCollapse={() => setOpen(false)} />
        </div>
      ) : null}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full items-center gap-2 border-t border-line-soft bg-rail px-3 py-2 text-left font-mono text-[12px] text-fg-muted"
      >
        <span aria-hidden className="text-amber">
          ›
        </span>
        <span className="flex-1 truncate">
          {open
            ? lang === 'fr'
              ? 'Réduire le terminal'
              : 'Collapse terminal'
            : lang === 'fr'
              ? 'Ouvrir le terminal'
              : 'Open terminal'}
        </span>
        <span aria-hidden className="caret text-amber">
          ▍
        </span>
      </button>
    </div>
  )
}

function Layout({ catalog, lang, children }: { catalog: readonly CatalogItem[]; lang: Lang; children: ReactNode }) {
  const { terminalOpen } = useIde()
  const [height, setHeight] = useState(216)

  // Restore the height the visitor chose, per visit.
  useEffect(() => {
    const saved = Number(window.sessionStorage.getItem('terminal-h'))
    // Same as the mode above: the stored height only exists in the browser.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved >= MIN_TERMINAL) setHeight(saved)
  }, [])

  const resize = useCallback((h: number) => {
    setHeight(h)
    try {
      window.sessionStorage.setItem('terminal-h', String(h))
    } catch {
      /* the height simply resets next visit */
    }
  }, [])

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <TitleBar />
      <div className="flex min-h-0 flex-1">
        <ToolRail lang={lang} />
        <div className="flex min-h-0 flex-1 flex-col">
          <TabBar catalog={catalog} />
          <main id="content" className="flex-1 overflow-y-auto bg-ink-850">
            {children}
          </main>
          {terminalOpen ? (
            <div className="hidden md:flex md:flex-col">
              <TerminalDivider onResize={resize} />
              <div style={{ height }} className="shrink-0">
                <Terminal catalog={catalog} />
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <StatusBar catalog={catalog} />
      <MobileTerminal catalog={catalog} />
      <MobileTabBar lang={lang} />
      <CommandPalette catalog={catalog} />
    </div>
  )
}

export function Shell({
  lang,
  catalog,
  children,
}: {
  lang: Lang
  catalog: readonly CatalogItem[]
  children: ReactNode
}) {
  return (
    <IdeProvider lang={lang}>
      <Layout lang={lang} catalog={catalog}>
        {children}
      </Layout>
    </IdeProvider>
  )
}
