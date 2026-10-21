import Link from 'next/link'
import type { Lang, Metric } from '@/content/types'
import { keepTogether } from '@/lib/typo'

/**
 * Numbers first. A head-hunter reads scale and outcome long before they read
 * a stack, so results get the largest type on the page after the heading.
 * A number with a `path` links to the mission that produced it.
 */
export function Metrics({ metrics, lang }: { metrics: readonly Metric[]; lang: Lang }) {
  if (metrics.length === 0) return null

  return (
    <dl className="flex flex-wrap gap-x-10 gap-y-5">
      {metrics.map((m) => {
        const content = (
          <>
            <span className="block font-mono text-[1.75rem] leading-none text-amber tabular-nums">
              {keepTogether(m.value)}
            </span>
            <span className="mt-1.5 block max-w-[20ch] text-[13px] leading-snug text-fg-muted">
              {keepTogether(m.label[lang])}
            </span>
          </>
        )
        return (
          <div key={`${m.value}-${m.label[lang]}`}>
            <dt className="sr-only">{m.label[lang]}</dt>
            <dd>
              {m.path ? (
                <Link
                  href={`/${lang}/${m.path}/`}
                  className="group block [&>span:last-child]:underline [&>span:last-child]:decoration-line [&>span:last-child]:underline-offset-4 hover:[&>span:last-child]:text-fg-bright hover:[&>span:last-child]:decoration-amber"
                >
                  {content}
                </Link>
              ) : (
                content
              )}
            </dd>
          </div>
        )
      })}
    </dl>
  )
}
