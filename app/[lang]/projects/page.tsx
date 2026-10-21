import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Article } from '@/components/ui/Article'
import { ProjectCard } from '@/components/ui/ProjectCard'
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

      <ul data-rm-target="projects" className="mt-8 grid gap-x-3 gap-y-3 sm:grid-cols-2">
        {PROJECTS.map((p) => (
          <ProjectCard key={p.slug} project={p} lang={lang} />
        ))}
      </ul>
    </Article>
  )
}
