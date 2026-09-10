'use client'

import { useIde } from '@/components/ide/ide-context'
import type { ReactNode } from 'react'

/**
 * The page frame.
 *
 * The prose inside is the real content and it is present in the HTML no
 * matter which mode is active; `dev` only adds the editor's furniture around
 * it. Nothing a crawler or a non-technical reader needs is behind the toggle.
 */
export function Article({
  file,
  eyebrow,
  title,
  inspector,
  children,
}: {
  file: string
  eyebrow?: string
  title: string
  /** Facts panel. One grid cell: a sticky right column on wide screens, and
   *  the block right after the prose on everything narrower. */
  inspector?: ReactNode
  children: ReactNode
}) {
  const { mode } = useIde()

  return (
    <div
      className={`mx-auto w-full px-5 py-8 sm:px-8 sm:py-12 ${
        inspector ? 'max-w-6xl xl:grid xl:grid-cols-[minmax(0,1fr)_19rem] xl:gap-8' : 'max-w-4xl'
      }`}
    >
      <article className="min-w-0">
        <header className="mb-8">
        {mode === 'dev' ? (
          <p aria-hidden className="mb-5 font-mono text-[12px] text-fg-muted">
            <span className="text-fg-faint">~/pasquelin/</span>
            {file}
          </p>
        ) : null}
        {eyebrow ? (
          <p className="mb-2 text-[13px] text-fg-muted">{eyebrow}</p>
        ) : null}
        <h1 className="text-balance text-[1.9rem] font-semibold leading-[1.15] tracking-[-0.02em] text-fg-bright sm:text-[2.4rem]">
          {title}
        </h1>
      </header>
        {children}
      </article>

      {inspector ? (
        <aside className="mt-10 xl:mt-0 xl:sticky xl:top-4 xl:self-start">{inspector}</aside>
      ) : null}
    </div>
  )
}

export function Prose({ paragraphs }: { paragraphs: readonly string[] }) {
  return (
    <div className="measure space-y-4 text-[15px] leading-[1.72] text-fg">
      {paragraphs.map((p) => (
        <p key={p.slice(0, 40)}>{p}</p>
      ))}
    </div>
  )
}

export function Section({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <section className="mt-10 border-t border-line-soft pt-8">
      {title ? (
        <h2 className="mb-4 font-mono text-[12px] text-fg-muted">{title}</h2>
      ) : null}
      {children}
    </section>
  )
}
