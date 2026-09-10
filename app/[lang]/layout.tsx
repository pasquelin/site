import type { Metadata, Viewport } from 'next'
import { IBM_Plex_Mono, Instrument_Sans } from 'next/font/google'
import { notFound } from 'next/navigation'
import '../globals.css'
import { Shell } from '@/components/ide/Shell'
import { ANSWER, HEADLINE } from '@/content/profile'
import { LANGS, PERSON, SITE_URL } from '@/content/site'
import type { Lang } from '@/content/types'
import { buildCatalog } from '@/lib/catalog'
import { isLang } from '@/lib/i18n'
import { faqLd, personLd } from '@/lib/jsonld'

/* Chrome and code. Plex Mono has a warmth that the usual editor faces lack. */
const mono = IBM_Plex_Mono({
  variable: '--font-plex-mono',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
})

/* Prose. Nobody reads three paragraphs of monospace, recruiters least of all. */
const sans = Instrument_Sans({
  variable: '--font-instrument',
  subsets: ['latin'],
  display: 'swap',
})

export const viewport: Viewport = {
  themeColor: '#080a0e',
  colorScheme: 'dark',
}

export async function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  if (!isLang(lang)) return {}
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${PERSON.name} — ${HEADLINE[lang]}`,
      template: `%s — ${PERSON.name}`,
    },
    description: ANSWER[lang],
    authors: [{ name: PERSON.name, url: SITE_URL }],
    creator: PERSON.name,
    robots: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
    },
  }
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang: raw } = await params
  if (!isLang(raw)) notFound()
  const lang: Lang = raw
  const catalog = buildCatalog(lang)

  return (
    <html lang={lang} className={`${mono.variable} ${sans.variable} h-full`}>
      <body className="h-full">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded focus:bg-amber focus:px-3 focus:py-2 focus:font-mono focus:text-[13px] focus:text-ink-950"
        >
          {lang === 'fr' ? 'Aller au contenu' : 'Skip to content'}
        </a>
        <Shell lang={lang} catalog={catalog}>
          {children}
        </Shell>
        <script
          type="application/ld+json"
          // The identity graph. Static, so crawlers that never run JS still read it.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd(lang)) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd(lang)) }}
        />
      </body>
    </html>
  )
}
