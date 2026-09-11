'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import type { CatalogItem } from '@/lib/catalog'
import { TERMINAL_COPY } from './terminal-copy'
import { useIde } from './ide-context'

/**
 * Le narrateur de la session : il écrit une navigation dans le terminal, et
 * rien d'autre. Il ne rend aucun balisage.
 *
 * Cette logique vivait dans `Terminal`, ce qui la liait au nombre de vues
 * affichées. Comme la vue du bas reste montée sous `md` — elle n'est masquée
 * qu'en CSS — ouvrir la feuille mobile en montait une seconde, et chaque
 * instance narrait la même navigation dans la même session : tout apparaissait
 * en double, avec deux durées tirées séparément.
 *
 * La narration appartient à la session, pas à ce qui l'affiche. Elle est donc
 * montée une fois par `Shell`, quel que soit le nombre de terminaux visibles —
 * et elle continue d'écrire quand le panneau est replié, si bien que le rouvrir
 * montre où l'on est passé plutôt qu'un trou.
 */

/* Un seul narrateur doit exister. Le compter coûte peu et cadre la régression. */
let mounted = 0

export function Narrator({ catalog }: { catalog: readonly CatalogItem[] }) {
  const { push, lang } = useIde()
  const pathname = usePathname()
  const lastPath = useRef<string | null>(null)
  const copy = TERMINAL_COPY[lang]

  useEffect(() => {
    mounted += 1
    if (process.env.NODE_ENV !== 'production' && mounted > 1) {
      console.warn(
        `[Narrator] ${mounted} instances montées. La narration doit être unique, ` +
          'sinon chaque navigation est écrite autant de fois.',
      )
    }
    return () => {
      mounted -= 1
    }
  }, [])

  useEffect(() => {
    if (lastPath.current === pathname) return
    const first = lastPath.current === null
    lastPath.current = pathname

    const stripped = pathname.replace(/^\/(fr|en)\/?/, '').replace(/\/$/, '')
    const item = catalog.find((entry) => entry.path === stripped)
    const file = item?.file ?? 'whoami.ts'
    const ms = 120 + Math.floor(Math.random() * 260)

    push([
      ...(first ? [{ kind: 'ai' as const, text: `${copy.open} — pasquelin.com` }] : []),
      { kind: 'cmd', text: `alban open ${item?.path || 'whoami'}` },
      { kind: 'tool', text: `${copy.read}(${file})`, ...(item?.note ? { detail: item.note } : {}) },
      { kind: 'ok', text: `${copy.ready} · ${ms} ms` },
    ])
  }, [pathname, catalog, push, copy])

  return null
}
