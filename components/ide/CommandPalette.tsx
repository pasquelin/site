'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import type { CatalogItem } from '@/lib/catalog'
import { useIde } from './ide-context'

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '')

const GROUP_LABEL = {
  fr: { section: 'Sections', experience: 'Parcours', project: 'Projets' },
  en: { section: 'Sections', experience: 'Experience', project: 'Projects' },
} as const

export function CommandPalette({ catalog }: { catalog: readonly CatalogItem[] }) {
  const { paletteOpen, setPaletteOpen } = useIde()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen(!paletteOpen)
      } else if (e.key === 'Escape' && paletteOpen) {
        setPaletteOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [paletteOpen, setPaletteOpen])

  // The dialog exists only while it is open, so its query and selection reset
  // on mount instead of being cleared by an effect on every toggle.
  if (!paletteOpen) return null
  return <Dialog catalog={catalog} />
}

function Dialog({ catalog }: { catalog: readonly CatalogItem[] }) {
  const { setPaletteOpen, lang, mode } = useIde()
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [index, setIndex] = useState(0)

  const results = useMemo(() => {
    const q = norm(query)
    if (!q) return catalog
    return catalog.filter((i) => norm(i.label).includes(q) || norm(i.path).includes(q) || norm(i.file).includes(q))
  }, [catalog, query])

  const go = (item: CatalogItem | undefined) => {
    if (!item) return
    setPaletteOpen(false)
    router.push(item.href)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-ink-950/70 px-4 pt-[12vh] backdrop-blur-[2px]"
      onClick={() => setPaletteOpen(false)}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={lang === 'fr' ? 'Aller à' : 'Go to'}
        className="w-full max-w-xl overflow-hidden rounded-panel border border-line bg-ink-850 shadow-2xl shadow-ink-950/60"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          autoFocus
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIndex(0)
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault()
              setIndex((i) => Math.min(i + 1, results.length - 1))
            } else if (e.key === 'ArrowUp') {
              e.preventDefault()
              setIndex((i) => Math.max(i - 1, 0))
            } else if (e.key === 'Enter') {
              e.preventDefault()
              go(results[index])
            }
          }}
          placeholder={lang === 'fr' ? 'Aller à…' : 'Go to…'}
          aria-label={lang === 'fr' ? 'Rechercher une page' : 'Search pages'}
          className="w-full border-b border-line-soft bg-transparent px-4 py-3 font-mono text-sm text-fg-bright caret-amber outline-none placeholder:text-fg-muted"
          autoComplete="off"
          spellCheck={false}
        />
        <ul className="max-h-[50vh] overflow-y-auto py-1">
          {results.map((item, i) => (
            <li key={item.id}>
              <button
                type="button"
                onMouseEnter={() => setIndex(i)}
                onClick={() => go(item)}
                className={`flex w-full items-baseline gap-3 px-4 py-2 text-left font-mono text-[13px] transition-colors ${
                  i === index ? 'bg-amber/10 text-fg-bright' : 'text-fg'
                }`}
              >
                <span className="truncate">{mode === 'dev' ? item.file : item.label}</span>
                <span className="ml-auto shrink-0 text-[11px] text-fg-muted">
                  {GROUP_LABEL[lang][item.group]}
                </span>
              </button>
            </li>
          ))}
          {results.length === 0 ? (
            <li className="px-4 py-6 text-center font-mono text-[13px] text-fg-muted">
              {lang === 'fr' ? 'Aucune page ne correspond.' : 'No page matches.'}
            </li>
          ) : null}
        </ul>
      </div>
    </div>
  )
}
