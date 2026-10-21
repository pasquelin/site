'use client'

import { useId, useState, type ReactNode } from 'react'

/**
 * A list that stops after `initial` lines, with the usual button underneath.
 * The folded lines are rendered `hidden`, not left out: they stay in the HTML
 * that crawlers read.
 */
export function ShowMoreList({
  items,
  initial,
  more,
  less,
  className,
  rmTarget,
}: {
  items: readonly { key: string; node: ReactNode }[]
  initial: number
  more: string
  less: string
  className?: string
  /** Hook for the terminal's hidden commands, which animate the list. */
  rmTarget?: string
}) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const folded = items.length - initial

  return (
    <>
      <ul id={id} data-rm-target={rmTarget} className={className}>
        {items.map((item, i) => (
          <li key={item.key} hidden={!open && i >= initial}>
            {item.node}
          </li>
        ))}
      </ul>
      {folded > 0 ? (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls={id}
            data-analytics-action="list_toggle"
            data-analytics-target={open ? 'less' : 'more'}
            className="inline-flex items-center gap-2 rounded-panel border border-line px-4 py-2 font-mono text-[13px] text-fg transition-colors hover:border-amber/50 hover:text-fg-bright"
          >
            {open ? less : `${more} (${folded})`}
            <span aria-hidden className={`transition-transform ${open ? 'rotate-180' : ''}`}>
              ▾
            </span>
          </button>
        </div>
      ) : null}
    </>
  )
}
