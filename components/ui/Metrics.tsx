import type { Lang, Metric } from '@/content/types'

/**
 * Numbers first. A head-hunter reads scale and outcome long before they read
 * a stack, so results get the largest type on the page after the heading.
 */
export function Metrics({ metrics, lang }: { metrics: readonly Metric[]; lang: Lang }) {
  if (metrics.length === 0) return null

  return (
    <dl className="flex flex-wrap gap-x-10 gap-y-5">
      {metrics.map((m) => (
        <div key={`${m.value}-${m.label[lang]}`}>
          <dt className="sr-only">{m.label[lang]}</dt>
          <dd>
            <span className="block font-mono text-[1.75rem] leading-none text-amber tabular-nums">
              {m.value}
            </span>
            <span className="mt-1.5 block max-w-[16ch] text-[13px] leading-snug text-fg-muted">
              {m.label[lang]}
            </span>
          </dd>
        </div>
      ))}
    </dl>
  )
}
