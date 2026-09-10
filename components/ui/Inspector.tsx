'use client'

import { useState, type ReactNode } from 'react'

/**
 * The inspector, borrowed from AI Desktop Studio: a stack of collapsible
 * sections of label-and-value rows. It is where the facts live — results,
 * technologies, links — so the reading column keeps nothing but prose.
 */
export function InspectorPanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-panel border border-line-soft bg-ink-900">
      <div className="flex items-center gap-2 border-b border-line-soft bg-rail px-3 py-2">
        <h2 className="text-[13px] font-medium text-fg-bright">{title}</h2>
      </div>
      <div className="divide-y divide-line-soft">{children}</div>
    </div>
  )
}

export function InspectorSection({
  label,
  defaultOpen = true,
  children,
}: {
  label: string
  defaultOpen?: boolean
  children: ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <section>
      <h3>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          className="flex w-full items-center gap-1.5 px-3 py-2 text-left font-mono text-[11px] uppercase tracking-wide text-fg-muted transition-colors hover:text-fg-bright"
        >
          <svg
            viewBox="0 0 16 16"
            aria-hidden
            className={`size-3 shrink-0 transition-transform ${open ? '' : '-rotate-90'}`}
          >
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {label}
        </button>
      </h3>
      {open ? <div className="px-3 pb-3">{children}</div> : null}
    </section>
  )
}

/** One line of the inspector: what it is on the left, what it is worth on the right. */
export function InspectorRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-1.5">
      <span className="min-w-0 text-[13px] leading-snug text-fg-muted">{label}</span>
      <span className="shrink-0 font-mono text-[13px] tabular-nums text-amber">{value}</span>
    </div>
  )
}

export function InspectorTags({ items }: { items: readonly string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <li
          key={item}
          className="rounded border border-line-soft bg-ink-800 px-1.5 py-0.5 font-mono text-[11.5px] text-fg"
        >
          {item}
        </li>
      ))}
    </ul>
  )
}

export function InspectorLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between gap-3 py-1.5 font-mono text-[13px] text-amber transition-colors hover:text-fg-bright"
    >
      {children}
      <svg viewBox="0 0 24 24" aria-hidden className="size-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M14 4h6v6M20 4l-9 9" strokeLinecap="round" />
      </svg>
    </a>
  )
}
