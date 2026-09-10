import type { Metadata } from 'next'
import { LANGS, PERSON, SITE_URL } from '@/content/site'
import type { Lang } from '@/content/types'

/** Absolute URL for a language-prefixed path. */
export const abs = (lang: Lang, path = ''): string => {
  const clean = path.replace(/^\/+|\/+$/g, '')
  return clean ? `${SITE_URL}/${lang}/${clean}/` : `${SITE_URL}/${lang}/`
}

interface PageMetaInput {
  readonly lang: Lang
  /** Path without the language segment, e.g. `experience/tf1-mytf1`. */
  readonly path?: string
  readonly title: string
  readonly description: string
}

/**
 * Canonical plus a complete `hreflang` set on every page. Search engines and
 * language models both use these to work out that the French and English
 * pages are one document, not two competing ones.
 */
export function pageMeta({ lang, path = '', title, description }: PageMetaInput): Metadata {
  const url = abs(lang, path)
  const languages = Object.fromEntries(
    LANGS.map((l) => [l === 'fr' ? 'fr-FR' : 'en', abs(l, path)]),
  )

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: { ...languages, 'x-default': abs('fr', path) },
    },
    openGraph: {
      type: 'profile',
      url,
      title,
      description,
      siteName: PERSON.name,
      locale: lang === 'fr' ? 'fr_FR' : 'en_GB',
      images: [{ url: `${SITE_URL}/og.png`, width: 1200, height: 630, alt: PERSON.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: '@wubart',
      images: [`${SITE_URL}/og.png`],
    },
  }
}
