'use client'

import { useEffect, useRef, useState } from 'react'
import { useIde } from '@/components/ide/ide-context'
import { CodeAmbience } from '@/components/three/CodeAmbience'
import { SCENES } from '@/content/scenes'
import { UI } from '@/content/ui'
import type { Lang, Metric, SceneKey } from '@/content/types'
import { SourceView } from './SourceView'

/**
 * A source file with its mission running underneath it.
 *
 * Calling the function is the gesture: clicking the name runs the block, the
 * scene behind it comes forward, a sweep crosses the code, and the terminal
 * says what happened. The text never moves and never dims.
 */
export function SourceSection({
  signature,
  docTitle,
  paragraphs,
  code,
  metrics,
  stack,
  lang,
  scene,
}: {
  signature: string
  docTitle: string
  paragraphs: readonly string[]
  code?: readonly string[]
  metrics: readonly Metric[]
  stack: readonly string[]
  lang: Lang
  scene?: SceneKey
}) {
  const [active, setActive] = useState(false)
  const [sweeping, setSweeping] = useState(false)
  const { push, mode } = useIde()
  const sweepTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(sweepTimer.current), [])

  const run = () => {
    if (!scene) return
    const next = !active
    setActive(next)
    if (!next) return

    setSweeping(true)
    sweepTimer.current = setTimeout(() => setSweeping(false), 900)
    push([
      { kind: 'cmd', text: `alban run ${scene}` },
      { kind: 'tool', text: `Render(${scene}.scene)`, detail: SCENES[scene].title[lang] },
    ])
  }

  if (mode === 'human') {
    return (
      <SourceView
        {...{ signature, docTitle, paragraphs, code, metrics, stack, lang }}
        sceneLabel=""
      />
    )
  }

  return (
    <figure className="m-0">
      <div className="relative isolate overflow-hidden rounded-panel bg-ink-900">
        {scene ? <CodeAmbience scene={scene} active={active} /> : null}

        {/* One sweep when the function runs — the only unprompted motion here. */}
        {sweeping ? (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-transparent via-amber/12 to-transparent"
            style={{ animation: 'sweep 0.9s cubic-bezier(0.4, 0, 0.2, 1) both' }}
          />
        ) : null}

        <div className="relative z-0">
          <SourceView
            signature={signature}
            docTitle={docTitle}
            paragraphs={paragraphs}
            code={code}
            metrics={metrics}
            stack={stack}
            lang={lang}
            scene={scene}
            onOpenScene={scene ? run : undefined}
            sceneLabel={active ? UI.actions.closeScene[lang] : UI.actions.openScene[lang]}
            transparent={Boolean(scene)}
          />
        </div>
      </div>

      {scene ? (
        <figcaption className="mt-3 text-[13px] leading-relaxed text-fg-muted">
          <span className="text-fg">{SCENES[scene].title[lang]}</span> — {SCENES[scene].caption[lang]}
        </figcaption>
      ) : null}
    </figure>
  )
}
