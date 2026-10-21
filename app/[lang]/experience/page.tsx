import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Article } from '@/components/ui/Article'
import { BrandLogo } from '@/components/ui/BrandLogo'
import { BRANDS } from '@/content/brands'
import { EXPERIENCE } from '@/content/experience'
import { formatPeriod } from '@/lib/period'
import { LANGS } from '@/content/site'
import { UI } from '@/content/ui'
import { isLang } from '@/lib/i18n'
import { pageMeta } from '@/lib/seo'

export async function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  if (!isLang(lang)) return {}
  return pageMeta({
    lang,
    path: 'experience',
    title: UI.headings.experience[lang],
    description: UI.meta.experienceDescription[lang],
  })
}

export default async function ExperienceIndex({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!isLang(lang)) notFound()

  return (
    <Article file="experience/" title={UI.headings.experience[lang]}>
      <p className="measure text-[15px] leading-[1.7] text-fg">{UI.meta.experienceIntro[lang]}</p>

      <ul data-rm-target="experience" className="mt-8 divide-y divide-line-soft border-y border-line-soft">
        {EXPERIENCE.map((e) => (
          <li key={e.slug}>
            <Link href={`/${lang}/experience/${e.slug}/`} className="group block py-5 transition-colors hover:bg-ink-900/60">
              <div className="flex gap-x-4">
                {/* Même case fixe que sur l'accueil : les textes partent tous du même bord. */}
                <span aria-hidden className="hidden h-8 w-24 shrink-0 items-center justify-center sm:flex">
                  {e.brand && BRANDS[e.brand] ? <BrandLogo brand={BRANDS[e.brand]} size={30} className="opacity-90" /> : null}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <span className="text-[16px] font-medium text-fg-bright group-hover:text-amber">{e.company}</span>
                    <span className="text-[14px] text-fg-muted">{e.role[lang]}</span>
                    {e.period ? (
                      <span className="ml-auto whitespace-nowrap font-mono text-[12px] tabular-nums text-fg-muted">
                        {formatPeriod(e.period, lang)}
                      </span>
                    ) : null}
                  </div>
                  <p className="measure mt-2 text-[14px] leading-relaxed text-fg">{e.answer[lang]}</p>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </Article>
  )
}
