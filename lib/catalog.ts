import { EXPERIENCE } from '@/content/experience'
import { NAV } from '@/content/nav'
import { PROJECTS } from '@/content/projects'
import type { IconName } from '@/content/nav'
import type { Lang } from '@/content/types'

/**
 * A flat, serialisable index of every route, built on the server and handed
 * to the client shell. The terminal, the command palette and the tab bar all
 * read from this one list, so a new page appears in all three at once.
 */
export interface CatalogItem {
  readonly id: string
  /** Language-prefixed href, ready to navigate to. */
  readonly href: string
  /** Path without the language segment. */
  readonly path: string
  readonly file: string
  readonly label: string
  /** The one-line result shown by the terminal when the page opens. */
  readonly note: string
  readonly group: 'section' | 'experience' | 'project'
  readonly icon: IconName
}

const metricLine = (metrics: readonly { value: string; label: Record<Lang, string> }[], lang: Lang) =>
  metrics.map((m) => `${m.value} ${m.label[lang]}`).join(' · ')

export function buildCatalog(lang: Lang): readonly CatalogItem[] {
  const sections: CatalogItem[] = NAV.map((n) => ({
    id: n.id,
    href: n.path ? `/${lang}/${n.path}/` : `/${lang}/`,
    path: n.path,
    file: n.file,
    label: n.label[lang],
    note: '',
    group: 'section',
    icon: n.icon,
  }))

  const experiences: CatalogItem[] = EXPERIENCE.map((e) => ({
    id: `experience/${e.slug}`,
    href: `/${lang}/experience/${e.slug}/`,
    path: `experience/${e.slug}`,
    file: `experience/${e.slug}.ts`,
    label: `${e.company} — ${e.role[lang]}`,
    note: metricLine(e.metrics, lang),
    group: 'experience',
    icon: 'briefcase',
  }))

  const projects: CatalogItem[] = PROJECTS.map((p) => ({
    id: `projects/${p.slug}`,
    href: `/${lang}/projects/${p.slug}/`,
    path: `projects/${p.slug}`,
    file: `projects/${p.slug}.tsx`,
    label: p.name,
    note: metricLine(p.metrics, lang) || p.tagline[lang],
    group: 'project',
    icon: 'cube',
  }))

  return [...sections, ...experiences, ...projects]
}
