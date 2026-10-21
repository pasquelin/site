import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { LANGS } from '@/content/site'
import { UI } from '@/content/ui'
import { isLang } from '@/lib/i18n'

/**
 * The missions before 2019 used to share this one page; each now has its own.
 * The address stays alive for old links and points to the career list.
 */
export async function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }))
}

export const metadata: Metadata = { robots: { index: false, follow: true } }

export default async function EarlierRedirect({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!isLang(lang)) notFound()
  return (
    <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
      <meta httpEquiv="refresh" content={`0;url=/${lang}/experience/`} />
      <Link href={`/${lang}/experience/`} className="font-mono text-[13px] text-amber hover:underline">
        {UI.headings.experience[lang]} →
      </Link>
    </div>
  )
}
