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
import { PROJECTS, projectBySlug } from '@/content/projects'
import { LANGS } from '@/content/site'
import { UI } from '@/content/ui'
import { isLang } from '@/lib/i18n'
import { breadcrumbLd, projectLd } from '@/lib/jsonld'
import { pageMeta } from '@/lib/seo'

export async function generateStaticParams() {
  return LANGS.flatMap((lang) => PROJECTS.map((p) => ({ lang, slug: p.slug })))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}): Promise<Metadata> {
  const { lang, slug } = await params
  const project = projectBySlug(slug)
  if (!isLang(lang) || !project) return {}
  return pageMeta({
    lang,
    path: `projects/${slug}`,
    title: `${project.name} — ${project.tagline[lang]}`,
    description: project.answer[lang],
  })
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { lang, slug } = await params
  const project = projectBySlug(slug)
  if (!isLang(lang) || !project) notFound()

  return (
    <Article
      file={`projects/${project.slug}.tsx`}
      eyebrow={project.tagline[lang]}
      title={project.name}
      inspector={
        <InspectorPanel title={UI.headings.inspector[lang]}>
          {project.metrics.length > 0 ? (
            <InspectorSection label={UI.headings.results[lang]}>
              {project.metrics.map((m) => (
                <InspectorRow key={m.label[lang]} label={m.label[lang]} value={m.value} />
              ))}
            </InspectorSection>
          ) : null}

          <InspectorSection label={UI.headings.stack[lang]}>
            <InspectorTags items={project.stack} />
          </InspectorSection>

          <InspectorSection label={UI.headings.links[lang]}>
            <InspectorLink href={project.repo}>{UI.actions.viewSource[lang]}</InspectorLink>
            {project.demo ? (
              <InspectorLink href={project.demo}>{UI.actions.liveDemo[lang]}</InspectorLink>
            ) : null}
            {project.license ? (
              <p className="pt-1.5 font-mono text-[12px] text-fg-muted">{project.license}</p>
            ) : null}
          </InspectorSection>
        </InspectorPanel>
      }
    >
      <div className="space-y-8">
        <Answer>{project.answer[lang]}</Answer>
        <SourceSection
          signature={project.fn}
          docTitle={`${project.name} — ${project.tagline[lang]}`}
          paragraphs={project.body[lang]}
          code={project.code}
          metrics={project.metrics}
          stack={project.stack}
          lang={lang}
          scene={project.scene}
        />
      </div>

      <p className="mt-10 border-t border-line-soft pt-6 font-mono text-[13px]">
        <Link href={`/${lang}/projects/`} className="text-amber hover:underline">
          ← {UI.headings.projects[lang]}
        </Link>
      </p>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectLd(project, lang)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbLd(lang, [
              { name: UI.headings.projects[lang], path: 'projects' },
              { name: project.name, path: `projects/${project.slug}` },
            ]),
          ),
        }}
      />
    </Article>
  )
}
