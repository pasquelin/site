import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { MetadataRoute } from 'next'
import { EXPERIENCE } from '@/content/experience'
import { NAV } from '@/content/nav'
import { PROJECTS } from '@/content/projects'
import { LANGS, SITE_URL } from '@/content/site'
import type { Lang } from '@/content/types'

const url = (lang: Lang, path: string) =>
  path ? `${SITE_URL}/${lang}/${path}/` : `${SITE_URL}/${lang}/`

/**
 * Dates de dernière modification, produites par `generate-machine-files.ts`
 * depuis l'historique git.
 *
 * L'ancienne version déclarait la date du build, donc « à l'instant » sur
 * chaque page à chaque déploiement. Un moteur qui voit tout un site se
 * prétendre modifié en bloc cesse de croire le champ — mieux vaut ne rien
 * dire que dire faux, et mieux encore dire vrai.
 */
const lastmod: Record<string, string> = (() => {
  const file = join(process.cwd(), 'content', '.lastmod.json')
  if (!existsSync(file)) return {}
  try {
    return JSON.parse(readFileSync(file, 'utf8')) as Record<string, string>
  } catch {
    return {}
  }
})()

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
      ...(lastmod[path] ? { lastModified: new Date(lastmod[path]) } : {}),
      changeFrequency: 'monthly' as const,
      priority: path === '' ? 1 : 0.8,
      alternates: {
        languages: Object.fromEntries(LANGS.map((l) => [l === 'fr' ? 'fr-FR' : 'en', url(l, path)])),
      },
    })),
  )
}

export const dynamic = 'force-static'
