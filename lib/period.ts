import type { Lang, Period } from '@/content/types'

/** `2018`, `2017–2018` or `2017–aujourd'hui`: one format everywhere. */
export function formatPeriod(period: Period, lang: Lang): string {
  if (period.to === period.from) return String(period.from)
  const to = period.to === 'present' ? (lang === 'fr' ? "aujourd'hui" : 'now') : period.to
  return `${period.from}–${to}`
}
