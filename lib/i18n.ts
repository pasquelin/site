import { DEFAULT_LANG, LANGS } from '@/content/site'
import type { Lang } from '@/content/types'

export const isLang = (v: string): v is Lang => (LANGS as readonly string[]).includes(v)

export const otherLang = (lang: Lang): Lang => (lang === 'fr' ? 'en' : 'fr')

/** Prefixes a path with its language segment. */
export const href = (lang: Lang, path = ''): string => {
  const clean = path.replace(/^\/+|\/+$/g, '')
  return clean ? `/${lang}/${clean}/` : `/${lang}/`
}

export { DEFAULT_LANG }
