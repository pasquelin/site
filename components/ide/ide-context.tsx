'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type { Lang } from '@/content/types'

export type LineKind = 'cmd' | 'tool' | 'out' | 'ok' | 'err' | 'ai'

export interface Line {
  readonly id: number
  readonly kind: LineKind
  readonly text: string
  /** Indented continuation, rendered under the line with a `⎿` elbow. */
  readonly detail?: string
}

/** One terminal tab. Each keeps its own scrollback, like a real shell. */
export interface Session {
  readonly id: number
  readonly name: string
  readonly lines: readonly Line[]
}

/** `dev` shows the full editor treatment; `human` shows a plain readable CV. */
export type Mode = 'dev' | 'human'

interface IdeValue {
  readonly sessions: readonly Session[]
  readonly activeSessionId: number
  setActiveSession: (id: number) => void
  addSession: () => void
  closeSession: (id: number) => void
  /** Scrollback of the active session. */
  readonly lines: readonly Line[]
  readonly typing: boolean
  push: (batch: readonly Omit<Line, 'id'>[]) => void
  clear: () => void
  readonly mode: Mode
  setMode: (m: Mode) => void
  readonly lang: Lang
  readonly terminalOpen: boolean
  setTerminalOpen: (v: boolean) => void
  readonly paletteOpen: boolean
  setPaletteOpen: (v: boolean) => void
}

const Ctx = createContext<IdeValue | null>(null)

export function useIde(): IdeValue {
  const v = useContext(Ctx)
  if (!v) throw new Error('useIde must be used inside <IdeProvider>')
  return v
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const MODE_KEY = 'ide-mode'

const EMPTY_LINES: readonly Line[] = []

const sessionName = (index: number) => (index === 0 ? 'Local' : `Local (${index + 1})`)

export function IdeProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  const [sessions, setSessions] = useState<readonly Session[]>([{ id: 0, name: 'Local', lines: [] }])
  const [activeSessionId, setActiveSessionId] = useState(0)
  const [typing, setTyping] = useState(false)
  const [mode, setModeState] = useState<Mode>('dev')
  const [terminalOpen, setTerminalOpen] = useState(true)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const nextId = useRef(0)
  const nextSessionId = useRef(1)

  // The chosen presentation follows the visitor between pages and visits.
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(MODE_KEY)
      // Reading storage is only possible after hydration, and the server has
      // no way to know the answer — so this state genuinely starts in an effect.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved === 'dev' || saved === 'human') setModeState(saved)
    } catch {
      /* storage unavailable — the default stands */
    }
  }, [])

  const setMode = useCallback((m: Mode) => {
    setModeState(m)
    try {
      window.localStorage.setItem(MODE_KEY, m)
    } catch {
      /* nothing to recover from: the mode still applies for this visit */
    }
  }, [])

  /**
   * Lines land one after another rather than all at once, so the terminal
   * reads as something happening rather than a block of text appearing.
   */
  const push = useCallback(
    (batch: readonly Omit<Line, 'id'>[]) => {
      if (batch.length === 0) return
      const instant = prefersReducedMotion()
      const step = instant ? 0 : 130
      const target = activeSessionId

      setTyping(!instant)
      batch.forEach((line, i) => {
        setTimeout(() => {
          setSessions((prev) =>
            prev.map((session) => {
              if (session.id !== target) return session
              const lines = [...session.lines, { ...line, id: nextId.current++ }]
              // Keep the scrollback readable rather than unbounded.
              return { ...session, lines: lines.length > 60 ? lines.slice(lines.length - 60) : lines }
            }),
          )
          if (i === batch.length - 1) setTyping(false)
        }, i * step)
      })
    },
    [activeSessionId],
  )

  const clear = useCallback(() => {
    setSessions((prev) => prev.map((s) => (s.id === activeSessionId ? { ...s, lines: [] } : s)))
  }, [activeSessionId])

  const addSession = useCallback(() => {
    const id = nextSessionId.current++
    setSessions((prev) => [...prev, { id, name: sessionName(prev.length), lines: [] }])
    setActiveSessionId(id)
  }, [])

  const closeSession = useCallback((id: number) => {
    setSessions((prev) => {
      // The last session is never closed — an editor always keeps one shell.
      if (prev.length === 1) return prev
      const remaining = prev.filter((s) => s.id !== id)
      setActiveSessionId((current) => (current === id ? remaining[remaining.length - 1].id : current))
      return remaining
    })
  }, [])

  const lines = useMemo(
    () => sessions.find((s) => s.id === activeSessionId)?.lines ?? EMPTY_LINES,
    [sessions, activeSessionId],
  )

  const value = useMemo<IdeValue>(
    () => ({
      sessions,
      activeSessionId,
      setActiveSession: setActiveSessionId,
      addSession,
      closeSession,
      lines,
      typing,
      push,
      clear,
      mode,
      setMode,
      lang,
      terminalOpen,
      setTerminalOpen,
      paletteOpen,
      setPaletteOpen,
    }),
    [
      sessions,
      activeSessionId,
      addSession,
      closeSession,
      lines,
      typing,
      push,
      clear,
      mode,
      setMode,
      lang,
      terminalOpen,
      paletteOpen,
    ],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
