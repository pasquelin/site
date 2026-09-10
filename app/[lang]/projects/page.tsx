import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Article } from '@/components/ui/Article'
import { PROJECTS } from '@/content/projects'
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
    path: 'projects',
    title: UI.headings.projects[lang],
    description: UI.meta.projectsDescription[lang],
  })
}

export default async function ProjectsIndex({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!isLang(lang)) notFound()

  return (
    <Article file="projects/" title={UI.headings.projects[lang]}>
      <p className="measure text-[15px] leading-[1.7] text-fg">{UI.meta.projectsIntro[lang]}</p>

      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {PROJECTS.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/${lang}/projects/${p.slug}/`}
              className="flex h-full flex-col rounded-panel border border-line-soft bg-ink-900 p-5 transition-colors hover:border-amber/40"
            >
              <span className="font-mono text-[15px] text-fg-bright">{p.name}</span>
              <span className="mt-2 text-[13px] leading-snug text-fg-muted">{p.tagline[lang]}</span>
              {p.metrics.length > 0 ? (
                <span className="mt-4 font-mono text-[12px] text-amber">
                  {p.metrics.map((m) => `${m.value} ${m.label[lang]}`).join(' · ')}
                </span>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </Article>
  )
}
