import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Answer } from '@/components/ui/Answer'
import { Article } from '@/components/ui/Article'
import {
  InspectorLink,
  InspectorPanel,
  InspectorRow,
  InspectorSection,
  InspectorTags,
} from '@/components/ui/Inspector'
import { SourceSection } from '@/components/ui/SourceSection'
import { EXPERIENCE, experienceBySlug } from '@/content/experience'
import { LANGS } from '@/content/site'
import { UI } from '@/content/ui'
import { isLang } from '@/lib/i18n'
import { breadcrumbLd, experienceLd } from '@/lib/jsonld'
import { pageMeta } from '@/lib/seo'

export async function generateStaticParams() {
  return LANGS.flatMap((lang) => EXPERIENCE.map((e) => ({ lang, slug: e.slug })))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}): Promise<Metadata> {
  const { lang, slug } = await params
  const exp = experienceBySlug(slug)
  if (!isLang(lang) || !exp) return {}
  return pageMeta({
    lang,
    path: `experience/${slug}`,
    title: `${exp.company} — ${exp.role[lang]}`,
    description: exp.answer[lang],
  })
}

export default async function ExperiencePage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { lang, slug } = await params
  const exp = experienceBySlug(slug)
  if (!isLang(lang) || !exp) notFound()

  const period = exp.period
    ? `${exp.period.from}–${exp.period.to === 'present' ? (lang === 'fr' ? "aujourd'hui" : 'now') : exp.period.to}`
    : undefined

  return (
    <Article
      file={`experience/${exp.slug}.ts`}
      eyebrow={[exp.role[lang], period].filter(Boolean).join(' · ')}
      title={exp.company}
      inspector={
        <InspectorPanel title={UI.headings.inspector[lang]}>
          {exp.metrics.length > 0 ? (
            <InspectorSection label={UI.headings.results[lang]}>
              {exp.metrics.map((m) => (
                <InspectorRow key={m.label[lang]} label={m.label[lang]} value={m.value} />
              ))}
            </InspectorSection>
          ) : null}

          <InspectorSection label={UI.headings.stack[lang]}>
            <InspectorTags items={exp.stack} />
          </InspectorSection>

          {exp.url ? (
            <InspectorSection label={UI.headings.links[lang]}>
              <InspectorLink href={exp.url}>{exp.company}</InspectorLink>
            </InspectorSection>
          ) : null}
        </InspectorPanel>
      }
    >
      <div className="space-y-8">
        <Answer>{exp.answer[lang]}</Answer>
        <SourceSection
          signature={exp.fn}
          docTitle={[exp.company, exp.role[lang], period].filter(Boolean).join(' · ')}
          paragraphs={exp.body[lang]}
          code={exp.code}
          metrics={exp.metrics}
          stack={exp.stack}
          lang={lang}
          scene={exp.scene}
        />
      </div>

      <p className="mt-10 border-t border-line-soft pt-6 font-mono text-[13px]">
        <Link href={`/${lang}/experience/`} className="text-amber hover:underline">
          ← {UI.headings.experience[lang]}
        </Link>
      </p>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(experienceLd(exp, lang)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbLd(lang, [
              { name: UI.headings.experience[lang], path: 'experience' },
              { name: exp.company, path: `experience/${exp.slug}` },
            ]),
          ),
        }}
      />
    </Article>
  )
}
