'use client'

import { useMemo, type ReactNode } from 'react'
import { useIde } from '@/components/ide/ide-context'
import type { Lang, Metric, SceneKey } from '@/content/types'

/**
 * Renders a page as the source file it pretends to be.
 *
 * The substance lives in the comments: each paragraph is the documentation of
 * the statement below it, so the block reads as a function doing the work
 * rather than as prose in a costume. Markers, braces and line numbers are
 * decoration and are marked `aria-hidden`; the paragraphs under them are
 * ordinary `<p>` elements, so a crawler, a screen reader and human mode all
 * receive the same words.
 *
 * Everything visual is decided in two places — `TONE` for colour and `Line`
 * for structure — so a change is made once rather than hunted for.
 */

/* ── Tones ────────────────────────────────────────────────────────────────
   The only place a colour is chosen. One syntactic role, one tone, always. */

type Tone =
  | 'comment'
  | 'marker'
  | 'keyword'
  | 'fn'
  | 'type'
  | 'string'
  | 'number'
  | 'prop'
  | 'punct'
  | 'plain'

/**
 * Comments read as running text, so every comment that owns its line gets
 * this size — the file header and each paragraph alike.
 *
 * The one exception is a comment trailing a statement: it shares that line
 * with code and has to keep the code's metrics, or the baseline breaks. It
 * keeps the comment tone and takes the code size.
 */
const COMMENT_TEXT = 'text-[14.5px] leading-[1.75]'

const TONE: Record<Tone, string> = {
  comment: 'text-comment',
  marker: 'text-comment-mark',
  keyword: 'text-violet',
  fn: 'text-amber',
  type: 'text-cyan',
  string: 'text-green',
  number: 'text-coral',
  prop: 'text-blue',
  punct: 'text-fg-muted',
  plain: 'text-fg',
}

interface Segment {
  readonly text: string
  readonly tone: Tone
}

const KEYWORDS = new Set([
  'const', 'let', 'await', 'async', 'for', 'of', 'in', 'export', 'function',
  'type', 'new', 'if', 'else', 'return', 'import', 'from', 'class', 'extends',
])

const TOKEN = /'[^']*'|`[^`]*`|<\/?[A-Za-z][\w.]*|[A-Za-z_$][\w$]*|\d+(?:\.\d+)?|\s+|[^\s\w]/g

/**
 * A deliberately small tokenizer. It knows the handful of shapes these
 * statements actually use; anything unrecognised stays `plain`, which is the
 * right failure mode for something that only carries colour.
 */
function tokenize(source: string): Segment[] {
  // A trailing line comment is written in the same JSDoc form as the prose,
  // so the file never shows two spellings of the same construct.
  const at = source.indexOf('//')
  const code = at === -1 ? source : source.slice(0, at).trimEnd()
  const trailing = at === -1 ? '' : source.slice(at + 2).trim()

  const raw = code.match(TOKEN) ?? []
  const meaningful = (from: number, step: 1 | -1) => {
    for (let i = from; i >= 0 && i < raw.length; i += step) {
      if (raw[i].trim()) return raw[i]
    }
    return ''
  }

  const segments: Segment[] = raw.map((text, i) => {
    if (/^['`]/.test(text)) return { text, tone: 'string' as const }
    if (/^<\/?[A-Za-z]/.test(text)) return { text, tone: 'type' as const }
    if (KEYWORDS.has(text)) return { text, tone: 'keyword' as const }
    if (/^\d/.test(text)) return { text, tone: 'number' as const }
    if (meaningful(i + 1, 1) === '(') return { text, tone: 'fn' as const }
    if (meaningful(i - 1, -1) === '.') return { text, tone: 'prop' as const }
    if (/^[^\s\w]$/.test(text)) return { text, tone: 'punct' as const }
    if (/^[A-Z]/.test(text)) return { text, tone: 'type' as const }
    return { text, tone: 'plain' as const }
  })

  if (trailing) {
    segments.push(
      { text: ' /** ', tone: 'marker' },
      { text: trailing, tone: 'comment' },
      { text: ' **/', tone: 'marker' },
    )
  }
  return segments
}

/* ── Lines ────────────────────────────────────────────────────────────────
   The file is a list of line descriptors; the renderer walks it once. */

type Line =
  | { readonly kind: 'blank' }
  | { readonly kind: 'code'; readonly segments: readonly Segment[]; readonly indent: number }
  | { readonly kind: 'doc'; readonly text: string; readonly indent: number; readonly prose: boolean }
  | { readonly kind: 'node'; readonly content: ReactNode; readonly indent: number }

const blank = (): Line => ({ kind: 'blank' })
const code = (source: string, indent = 0): Line => ({ kind: 'code', segments: tokenize(source), indent })
const doc = (text: string, indent = 0, prose = false): Line => ({ kind: 'doc', text, indent, prose })
const node = (content: ReactNode, indent = 0): Line => ({ kind: 'node', content, indent })

const INDENT = ['pl-0', 'pl-6', 'pl-12'] as const
const indentClass = (level: number) => INDENT[Math.min(level, INDENT.length - 1)]

/* ── Signature ────────────────────────────────────────────────────────── */

interface Signature {
  readonly keyword: string
  readonly name: string
  readonly params: string
  readonly returns: string
}

function parseSignature(source: string): Signature {
  const match = /^(\w+)\s+([A-Za-z0-9_]+)\(([^)]*)\)\s*:\s*(.+)$/.exec(source.trim())
  if (!match) return { keyword: 'function', name: source, params: '', returns: 'void' }
  return { keyword: match[1], name: match[2], params: match[3], returns: match[4] }
}

/** `in production since` → `inProductionSince` */
function toKey(label: string): string {
  const words = label
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9 ]/g, ' ')
    .trim()
    .split(/\s+/)
    .slice(0, 3)
  if (words.length === 0) return 'value'
  return words
    .map((w, i) => (i === 0 ? w.toLowerCase() : w[0].toUpperCase() + w.slice(1).toLowerCase()))
    .join('')
}

const isNumeric = (value: string) => /^[\d\s.,%]+$/.test(value)

/* ── Rendering ────────────────────────────────────────────────────────── */

function Gutter({ n, rule }: { n: number; rule: boolean }) {
  return (
    <span
      aria-hidden
      className={`gutter-num relative w-11 shrink-0 select-none pr-4 text-right text-[12px] text-gutter ${
        rule
          ? "after:absolute after:bottom-1 after:right-[7px] after:top-[1.7em] after:w-px after:bg-gutter-rule after:content-['']"
          : ''
      }`}
    >
      {n}
    </span>
  )
}

function Tokens({ segments }: { segments: readonly Segment[] }) {
  return (
    <>
      {segments.map((segment, i) => (
        <span key={`${segment.text}-${i}`} className={TONE[segment.tone]}>
          {segment.text}
        </span>
      ))}
    </>
  )
}

const Marker = ({ children }: { children: string }) => (
  <span aria-hidden className={`select-none ${TONE.marker} ${COMMENT_TEXT}`}>
    {children}
  </span>
)

function DocLine({ text, prose }: { text: string; prose: boolean }) {
  if (!prose) {
    return (
      <span aria-hidden className={`${TONE.comment} ${COMMENT_TEXT}`}>
        <Marker>{'/** '}</Marker>
        {text}
        <Marker>{' **/'}</Marker>
      </span>
    )
  }

  return (
    <span className="flex">
      <span className={`shrink-0 select-none pr-2 ${TONE.marker}`} aria-hidden>
        {'/**'}
      </span>
      {/* Real prose in a real paragraph. The markers around it are paint. */}
      <p className={`max-w-[66ch] ${TONE.comment} ${COMMENT_TEXT}`}>
        {text}
        <Marker>{' **/'}</Marker>
      </p>
    </span>
  )
}

export interface SourceViewProps {
  readonly signature: string
  readonly docTitle: string
  readonly paragraphs: readonly string[]
  readonly code?: readonly string[]
  readonly metrics: readonly Metric[]
  readonly stack: readonly string[]
  readonly lang: Lang
  readonly scene?: SceneKey
  readonly onOpenScene?: () => void
  readonly sceneLabel: string
  /** Lets a scene show through the block instead of a flat panel colour. */
  readonly transparent?: boolean
}

export function SourceView({
  signature,
  docTitle,
  paragraphs,
  code: statements,
  metrics,
  stack,
  lang,
  scene,
  onOpenScene,
  sceneLabel,
  transparent = false,
}: SourceViewProps) {
  const { mode } = useIde()
  const sig = useMemo(() => parseSignature(signature), [signature])

  const lines = useMemo<Line[]>(() => {
    const out: Line[] = []
    const imports = stack.slice(0, 4).map((s) => s.replace(/[^A-Za-z0-9]/g, '')).filter(Boolean)

    if (imports.length > 0) {
      out.push(code(`import { ${imports.join(', ')} } from '@/stack'`), blank())
    }

    out.push(doc(docTitle))

    out.push(
      node(
        <>
          <span className={TONE.keyword}>export</span> <span className={TONE.keyword}>{sig.keyword}</span>{' '}
          {scene && onOpenScene ? (
            <button
              type="button"
              onClick={onOpenScene}
              title={sceneLabel}
              className={`group rounded px-0.5 ${TONE.fn} underline decoration-amber/30 decoration-dashed underline-offset-4 transition-colors hover:bg-amber/10 hover:decoration-amber`}
            >
              {sig.name}
              <span aria-hidden className="ml-1.5 text-[11px] text-amber/70 group-hover:text-amber">
                ▶
              </span>
              <span className="sr-only"> — {sceneLabel}</span>
            </button>
          ) : (
            <span className={TONE.fn}>{sig.name}</span>
          )}
          <Tokens segments={tokenize(`(${sig.params}): ${sig.returns} {`)} />
        </>,
      ),
    )

    paragraphs.forEach((paragraph, i) => {
      out.push(doc(paragraph, 1, true))
      if (statements?.[i]) out.push(code(statements[i], 1))
      out.push(blank())
    })

    if (metrics.length > 0) {
      out.push(code('return {', 1))
      for (const metric of metrics) {
        const value = isNumeric(metric.value) ? metric.value.replace(/\s/g, '') : `'${metric.value}'`
        out.push(code(`${toKey(metric.label.en)}: ${value}, // ${metric.label[lang]}`, 2))
      }
      out.push(code('}', 1))
    }

    out.push(code('}'))
    return out
  }, [docTitle, lang, metrics, onOpenScene, paragraphs, scene, sceneLabel, sig, stack, statements])

  // Human mode keeps the words and drops every piece of the editor.
  if (mode === 'human') {
    return (
      <div className="measure space-y-4 text-[15px] leading-[1.72] text-fg">
        {paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 40)}>{paragraph}</p>
        ))}
      </div>
    )
  }

  return (
    <div
      className={`overflow-x-auto rounded-panel border border-line-soft py-4 font-mono text-[13px] leading-[1.85] ${
        transparent ? 'bg-transparent' : 'bg-ink-900'
      }`}
    >
      <div className="min-w-fit pr-4">
        {lines.map((line, i) => (
          <div key={i} className="flex">
            <Gutter n={i + 1} rule={line.kind === 'doc' && line.prose} />
            <span className="min-w-0 flex-1">
              {line.kind === 'blank' ? (
                <span> </span>
              ) : line.kind === 'doc' ? (
                <span className={`block ${indentClass(line.indent)}`}>
                  <DocLine text={line.text} prose={line.prose} />
                </span>
              ) : line.kind === 'code' ? (
                <span className={`block ${indentClass(line.indent)}`}>
                  <Tokens segments={line.segments} />
                </span>
              ) : (
                <span className={`block ${indentClass(line.indent)}`}>{line.content}</span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
