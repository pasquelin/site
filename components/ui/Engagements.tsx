import { ENGAGEMENTS } from '@/content/profile'
import { AVAILABILITY, RATES, RATE_LABELS, SHOW_RATES } from '@/content/site'
import type { Lang } from '@/content/types'
import { UI } from '@/content/ui'
import { keepTogether } from '@/lib/typo'

/**
 * What can be bought, and on what terms. The last thing a manager checks
 * before writing, so it sits on the home page and on the contact page alike.
 */
export function Engagements({ lang }: { lang: Lang }) {
  return (
    <>
      <ul className="grid gap-3 sm:grid-cols-3">
        {ENGAGEMENTS.map((e) => (
          <li key={e.title.en} className="rounded-panel border border-line-soft bg-ink-900 p-4">
            <span className="block text-[15px] font-medium text-fg-bright">{keepTogether(e.title[lang])}</span>
            <span className="mt-1.5 block text-[14px] leading-relaxed text-fg-muted">{keepTogether(e.body[lang])}</span>
          </li>
        ))}
      </ul>

      <dl className="mt-5 grid gap-x-8 gap-y-3 text-[14px] sm:grid-cols-3">
        <div>
          <dt className="text-fg-muted">{UI.headings.start[lang]}</dt>
          <dd className="mt-0.5 text-fg">{AVAILABILITY.when[lang]}</dd>
        </div>
        <div>
          <dt className="text-fg-muted">{UI.headings.zones[lang]}</dt>
          <dd className="mt-0.5 text-fg">{AVAILABILITY.zones[lang].join(' · ')}</dd>
        </div>
        {SHOW_RATES ? (
          <div>
            <dt className="text-fg-muted">{UI.headings.rates[lang]}</dt>
            <dd className="mt-0.5 space-y-0.5 text-fg">
              {(['fr', 'ch', 'remote'] as const).map((key) => (
                <span key={key} className="block">
                  <span className="text-fg-muted">{RATE_LABELS[key][lang]} </span>
                  {RATES[key][lang]}
                </span>
              ))}
            </dd>
          </div>
        ) : null}
      </dl>
    </>
  )
}
