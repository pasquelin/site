import type { MetadataRoute } from 'next'
import { EXPERIENCE } from '@/content/experience'
import { NAV } from '@/content/nav'
import { PROJECTS } from '@/content/projects'
import { LANGS, SITE_URL } from '@/content/site'
import type { Lang } from '@/content/types'

const url = (lang: Lang, path: string) =>
  path ? `${SITE_URL}/${lang}/${path}/` : `${SITE_URL}/${lang}/`

/** Every page, in every language, each declaring its counterpart. */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...NAV.map((n) => n.path),
    ...EXPERIENCE.map((e) => `experience/${e.slug}`),
    ...PROJECTS.map((p) => `projects/${p.slug}`),
  ]

  return LANGS.flatMap((lang) =>
    paths.map((path) => ({
      url: url(lang, path),
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: path === '' ? 1 : 0.8,
      alternates: {
        languages: Object.fromEntries(LANGS.map((l) => [l === 'fr' ? 'fr-FR' : 'en', url(l, path)])),
      },
    })),
  )
}

export const dynamic = 'force-static'
