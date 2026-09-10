'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { CV } from '@/content/site'
import type { CatalogItem } from '@/lib/catalog'
import { useIde, type Line } from './ide-context'

const KIND_CLASS: Record<Line['kind'], string> = {
  cmd: 'text-fg-bright',
  tool: 'text-amber',
  out: 'text-fg-muted',
  ok: 'text-green',
  err: 'text-coral',
  ai: 'text-cyan',
}

const GLYPH: Record<Line['kind'], string> = {
  cmd: '›',
  tool: '⏺',
  out: ' ',
  ok: '✓',
  err: '✗',
  ai: '✻',
}

const COPY = {
  fr: {
    read: 'Lecture',
    ready: 'prêt',
    unknown: (c: string) => `commande inconnue : ${c}`,
    helpHint: 'tapez « aide »',
    hint: 'Tapez une commande. « aide » pour la liste.',
    help: [
      'aide            cette liste',
      'ls              lister les pages',
      'open <nom>      ouvrir une page',
      'cv [fr|en]      télécharger le CV en PDF',
      'contact         écrire à Alban',
      'mode humain|dev changer la présentation',
      'lang fr|en      changer de langue',
      'clear           vider le terminal',
    ],
    label: 'Terminal',
    collapse: 'Réduire le terminal',
  },
  en: {
    read: 'Read',
    ready: 'ready',
    unknown: (c: string) => `unknown command: ${c}`,
    helpHint: 'type "help"',
    hint: 'Type a command. "help" for the list.',
    help: [
      'help            this list',
      'ls              list pages',
      'open <name>     open a page',
      'cv [fr|en]      download the CV as PDF',
      'contact         write to Alban',
      'mode human|dev  change presentation',
      'lang fr|en      change language',
      'clear           empty the terminal',
    ],
    label: 'Terminal',
    collapse: 'Collapse terminal',
  },
} as const

/** Loose match so `open tf1`, `open map3d` and `open Parcours` all work. */
function findItem(catalog: readonly CatalogItem[], query: string): CatalogItem | undefined {
  const q = query.trim().toLowerCase()
  if (!q) return undefined
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '')
  const nq = norm(q)
  return (
    catalog.find((i) => i.path.toLowerCase() === q || i.id.toLowerCase() === q) ??
    catalog.find((i) => norm(i.label).includes(nq) || norm(i.path).includes(nq))
  )
}

export function Terminal({
  catalog,
  onCollapse,
}: {
  catalog: readonly CatalogItem[]
  /** Each host closes its own container: a docked panel, or a mobile sheet. */
  onCollapse?: () => void
}) {
  const {
    lines,
    push,
    clear,
    lang,
    setMode,
    terminalOpen,
    setTerminalOpen,
    sessions,
    activeSessionId,
    setActiveSession,
    addSession,
    closeSession,
  } = useIde()
  const pathname = usePathname()
  const router = useRouter()
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [histIndex, setHistIndex] = useState(-1)
  const scroller = useRef<HTMLDivElement>(null)
  const lastPath = useRef<string | null>(null)
  const c = COPY[lang]

  // The terminal narrates every navigation — this is what makes it the voice
  // of the site rather than a decoration sitting at the bottom of the screen.
  useEffect(() => {
    if (lastPath.current === pathname) return
    const first = lastPath.current === null
    lastPath.current = pathname

    const stripped = pathname.replace(/^\/(fr|en)\/?/, '').replace(/\/$/, '')
    const item = catalog.find((i) => i.path === stripped)
    const file = item?.file ?? 'whoami.ts'
    const ms = 120 + Math.floor(Math.random() * 260)

    push([
      ...(first
        ? [{ kind: 'ai' as const, text: lang === 'fr' ? 'Session ouverte — pasquelin.com' : 'Session open — pasquelin.com' }]
        : []),
      { kind: 'cmd', text: `alban open ${item?.path || 'whoami'}` },
      { kind: 'tool', text: `${c.read}(${file})`, ...(item?.note ? { detail: item.note } : {}) },
      { kind: 'ok', text: `${c.ready} · ${ms} ms` },
    ])
  }, [pathname, catalog, push, lang, c.read, c.ready])

  useEffect(() => {
    const el = scroller.current
    if (el) el.scrollTop = el.scrollHeight
  }, [lines])

  const run = useCallback(
    (raw: string) => {
      const cmd = raw.trim()
      if (!cmd) return
      setHistory((h) => [cmd, ...h].slice(0, 30))
      setHistIndex(-1)
      push([{ kind: 'cmd', text: cmd }])

      const [verb, ...rest] = cmd.split(/\s+/)
      const arg = rest.join(' ')
      const v = verb.toLowerCase()

      if (v === 'clear') return void setTimeout(clear, 60)
      if (v === 'help' || v === 'aide') return push(c.help.map((text) => ({ kind: 'out' as const, text })))
      if (v === 'ls') {
        return push(
          catalog
            .filter((i) => i.group !== 'section' || i.path !== '')
            .map((i) => ({ kind: 'out' as const, text: `${i.file.padEnd(30)} ${i.label}` })),
        )
      }
      if (v === 'cv') {
        // Le PDF, pas le JSON : quelqu'un qui tape `cv` veut le document,
        // pas sa version pour machines — celle-ci reste sur /cv.json.
        const wanted = arg.toLowerCase().startsWith('en') ? 'en' : arg.toLowerCase().startsWith('fr') ? 'fr' : lang
        push([{ kind: 'ok', text: `${lang === 'fr' ? 'Téléchargement' : 'Downloading'} ${CV[wanted].split('/').pop()}` }])
        window.open(CV[wanted], '_blank', 'noopener')
        return
      }
      if (v === 'mode') {
        const m = arg.toLowerCase().startsWith('h') ? 'human' : 'dev'
        setMode(m)
        return push([{ kind: 'ok', text: `mode = ${m}` }])
      }
      if (v === 'lang') {
        const target = arg.toLowerCase().startsWith('e') ? 'en' : 'fr'
        router.push(pathname.replace(/^\/(fr|en)/, `/${target}`))
        return
      }
      if (v === 'whoami') {
        return push([{ kind: 'out', text: 'Alban Pasquelin — architecte logiciel & CTO' }])
      }
      if (v === 'sudo') {
        return push([{ kind: 'ai', text: lang === 'fr' ? 'Bien tenté. Utilisez plutôt « contact ».' : 'Nice try. Use "contact" instead.' }])
      }

      const target = v === 'open' || v === 'cd' ? findItem(catalog, arg) : findItem(catalog, cmd)
      if (target) {
        router.push(target.href)
        return
      }
      push([{ kind: 'err', text: c.unknown(cmd) }, { kind: 'out', text: c.helpHint }])
    },
    [catalog, push, clear, router, pathname, setMode, lang, c],
  )

  if (!terminalOpen) return null

  return (
    <div className="flex h-full flex-col bg-terminal font-mono text-[12.5px] leading-[1.65]">
      {/* Session tabs, the way an editor's terminal panel carries them. */}
      <div className="flex h-9 shrink-0 items-center gap-1 border-b border-line-soft bg-rail px-2">
        <span className="shrink-0 pr-2 text-[12px] font-medium text-fg-bright">{c.label}</span>

        <div role="tablist" aria-label={c.label} className="flex min-w-0 items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {sessions.map((session) => {
            const active = session.id === activeSessionId
            return (
              <div
                key={session.id}
                className={`group flex shrink-0 items-center gap-1 rounded px-2 py-1 text-[12px] transition-colors ${
                  active ? 'bg-ink-700 text-fg-bright' : 'text-fg-muted hover:text-fg'
                }`}
              >
                <button type="button" role="tab" aria-selected={active} onClick={() => setActiveSession(session.id)}>
                  {session.name}
                </button>
                {sessions.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => closeSession(session.id)}
                    aria-label={`${lang === 'fr' ? 'Fermer' : 'Close'} ${session.name}`}
                    className="flex size-4 items-center justify-center rounded text-fg-muted opacity-0 transition-opacity hover:bg-ink-800 hover:text-fg-bright focus-visible:opacity-100 group-hover:opacity-100"
                  >
                    <svg viewBox="0 0 16 16" className="size-2.5" aria-hidden>
                      <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.8" fill="none" />
                    </svg>
                  </button>
                ) : null}
              </div>
            )
          })}
        </div>

        <button
          type="button"
          onClick={addSession}
          aria-label={lang === 'fr' ? 'Nouvelle session' : 'New session'}
          className="flex size-6 shrink-0 items-center justify-center rounded text-fg-muted transition-colors hover:bg-ink-700 hover:text-fg-bright"
        >
          <svg viewBox="0 0 16 16" className="size-3.5" aria-hidden>
            <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          </svg>
        </button>

        <span className="flex-1" />

        <button
          type="button"
          onClick={() => (onCollapse ? onCollapse() : setTerminalOpen(false))}
          aria-label={c.collapse}
          title={c.collapse}
          className="flex size-6 shrink-0 items-center justify-center rounded text-fg-muted transition-colors hover:bg-ink-700 hover:text-fg-bright"
        >
          <svg viewBox="0 0 16 16" className="size-3.5" aria-hidden>
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div
        ref={scroller}
        className="flex-1 overflow-y-auto px-3 py-2"
        role="log"
        aria-live="polite"
        aria-label={c.label}
      >
        {lines.map((line) => (
          <div key={line.id} className="whitespace-pre-wrap break-words">
            <span className={KIND_CLASS[line.kind]}>
              <span className="mr-2 inline-block w-3 select-none opacity-80">{GLYPH[line.kind]}</span>
              {line.text}
            </span>
            {line.detail ? (
              <div className="pl-5 text-fg-muted">
                <span className="mr-2 select-none opacity-60">⎿</span>
                {line.detail}
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <form
        className="flex items-center gap-2 border-t border-line-soft px-3 py-2"
        onSubmit={(e) => {
          e.preventDefault()
          run(input)
          setInput('')
        }}
      >
        <span aria-hidden className="select-none text-amber">
          ›
        </span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowUp') {
              e.preventDefault()
              const i = Math.min(histIndex + 1, history.length - 1)
              if (i >= 0) {
                setHistIndex(i)
                setInput(history[i])
              }
            } else if (e.key === 'ArrowDown') {
              e.preventDefault()
              const i = histIndex - 1
              setHistIndex(i)
              setInput(i >= 0 ? history[i] : '')
            }
          }}
          className="min-w-0 flex-1 bg-transparent text-fg-bright caret-amber outline-none placeholder:text-fg-muted"
          placeholder={c.hint}
          aria-label={c.label}
          autoComplete="off"
          spellCheck={false}
        />
      </form>
    </div>
  )
}
