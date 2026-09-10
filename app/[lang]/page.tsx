import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SceneMount } from '@/components/three/SceneMount'
import { Metrics } from '@/components/ui/Metrics'
import { EXPERIENCE } from '@/content/experience'
import { PROJECTS } from '@/content/projects'
import {
  ANSWER,
  AWARDS,
  CLIENTS,
  DIRECTION,
  DOCTRINE,
  EDGE,
  HEADLINE,
  HEADLINE_METRICS,
  PITCH,
  SKILLS,
  SUBHEAD,
} from '@/content/profile'
import { AVAILABILITY, CV, LANGS, PERSON } from '@/content/site'
import { UI } from '@/content/ui'
import type { Lang } from '@/content/types'
import { isLang } from '@/lib/i18n'
import { profilePageLd } from '@/lib/jsonld'
import { pageMeta } from '@/lib/seo'

export async function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  if (!isLang(lang)) return {}
  return pageMeta({
    lang,
    title: `${PERSON.name} — ${HEADLINE[lang]}`,
    description: ANSWER[lang],
  })
}

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: raw } = await params
  if (!isLang(raw)) notFound()
  const lang: Lang = raw

  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-line-soft">
        <SceneMount className="pointer-events-none absolute inset-0 opacity-55 [mask-image:radial-gradient(70%_95%_at_82%_50%,black_25%,transparent_85%)]" />
        {/* Keeps the headline the brightest thing on the page, whatever the scene does behind it. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink-850 from-30% via-ink-850/90 to-ink-850/15 lg:via-ink-850/70"
        />

        <div className="relative mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="rise max-w-2xl">
            {AVAILABILITY.open ? (
              <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-green/30 bg-green/10 px-3 py-1 font-mono text-[12px] text-green">
                <span aria-hidden className="size-1.5 rounded-full bg-green" />
                {UI.availableLong[lang]}
              </p>
            ) : null}

            <h1 className="text-balance text-[2.4rem] font-semibold leading-[1.05] tracking-[-0.03em] text-fg-bright sm:text-[3.5rem]">
              {PERSON.name}
            </h1>
            <p className="mt-3 text-[1.15rem] text-amber sm:text-[1.4rem]">{HEADLINE[lang]}</p>
            <p className="mt-1 font-mono text-[13px] text-fg-muted">{SUBHEAD[lang]}</p>
            <p className="measure mt-6 text-[16px] leading-[1.7] text-fg">{PITCH[lang]}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/${lang}/contact/`}
                className="rounded-panel bg-amber px-4 py-2.5 font-mono text-[13px] font-medium text-ink-950 transition-colors hover:bg-amber/85"
              >
                {UI.actions.contact[lang]}
              </Link>
              <Link
                href={`/${lang}/experience/`}
                className="rounded-panel border border-line px-4 py-2.5 font-mono text-[13px] text-fg transition-colors hover:border-amber/50 hover:text-fg-bright"
              >
                {UI.headings.experience[lang]}
              </Link>
              {/* Le PDF est ce qu'un recruteur transfère à son client. Il doit
                  être atteignable dès le premier écran, sans chercher. */}
              <a
                href={CV[lang]}
                download
                className="rounded-panel px-4 py-2.5 font-mono text-[13px] text-fg-muted underline decoration-line underline-offset-4 transition-colors hover:text-fg-bright hover:decoration-amber"
              >
                {UI.actions.downloadCv[lang]}
              </a>
            </div>

            <div className="mt-12">
              <Metrics metrics={HEADLINE_METRICS} lang={lang} />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8">
        <section>
          <h2 className="mb-4 font-mono text-[12px] text-fg-muted">{UI.headings.edge[lang]}</h2>
          <ul className="grid gap-4 sm:grid-cols-2">
            {EDGE[lang].map((line) => {
              const [, lead, rest] = /^\*\*(.+?)\*\*\s*(.*)$/.exec(line) ?? [null, '', line]
              return (
                <li key={line.slice(0, 30)} className="border-l-2 border-line pl-4">
                  {lead ? (
                    <span className="block text-[15px] font-medium text-fg-bright">{lead}</span>
                  ) : null}
                  <span className="mt-1 block text-[14px] leading-relaxed text-fg-muted">{rest}</span>
                </li>
              )
            })}
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="mb-4 font-mono text-[12px] text-fg-muted">{UI.headings.experience[lang]}</h2>
          <ul className="divide-y divide-line-soft border-y border-line-soft">
            {EXPERIENCE.map((e) => (
              <li key={e.slug}>
                <Link
                  href={`/${lang}/experience/${e.slug}/`}
                  className="group flex flex-wrap items-baseline gap-x-4 gap-y-1 py-4 transition-colors hover:bg-ink-900/60"
                >
                  <span className="text-[15px] font-medium text-fg-bright group-hover:text-amber">
                    {e.company}
                  </span>
                  <span className="text-[14px] text-fg-muted">{e.role[lang]}</span>
                  {e.period ? (
                    <span className="ml-auto font-mono text-[12px] tabular-nums text-fg-muted">
                      {e.period.from}–{e.period.to === 'present' ? (lang === 'fr' ? "aujourd'hui" : 'now') : e.period.to}
                    </span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="mb-4 font-mono text-[12px] text-fg-muted">{UI.headings.projects[lang]}</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {PROJECTS.slice(0, 4).map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/${lang}/projects/${p.slug}/`}
                  className="flex h-full flex-col rounded-panel border border-line-soft bg-ink-900 p-4 transition-colors hover:border-amber/40"
                >
                  <span className="font-mono text-[14px] text-fg-bright">{p.name}</span>
                  <span className="mt-1.5 text-[13px] leading-snug text-fg-muted">{p.tagline[lang]}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href={`/${lang}/projects/`}
            className="mt-4 inline-block font-mono text-[13px] text-amber hover:underline"
          >
            {lang === 'fr' ? 'Tous les projets' : 'All projects'}
          </Link>
        </section>

        <section className="mt-12 border-t border-line-soft pt-10">
          <h2 className="mb-4 font-mono text-[12px] text-fg-muted">{UI.headings.stack[lang]}</h2>
          <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
            {SKILLS.map((group) => (
              <div key={group.label.en}>
                <dt className="mb-2 text-[14px] font-medium text-fg-bright">{group.label[lang]}</dt>
                <dd className="text-[13px] leading-relaxed text-fg-muted">{group.items.join(' · ')}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-12 border-t border-line-soft pt-10">
          <h2 className="mb-4 font-mono text-[12px] text-fg-muted">{UI.headings.doctrine[lang]}</h2>
          <p className="measure mb-6 text-[15px] leading-[1.7] text-fg">{DIRECTION[lang]}</p>
          <ul className="measure space-y-3 text-[15px] leading-[1.7] text-fg">
            {DOCTRINE[lang].map((d) => (
              <li key={d.slice(0, 30)} className="border-l-2 border-line pl-4">
                {d}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12 grid gap-10 border-t border-line-soft pt-10 sm:grid-cols-2">
          <div>
            <h2 className="mb-4 font-mono text-[12px] text-fg-muted">{UI.headings.awards[lang]}</h2>
            <ul className="space-y-2 text-[14px] text-fg">
              {AWARDS.map((a) => (
                <li key={`${a.title}${a.year ?? ''}`} className="flex gap-3">
                  <span className="w-10 shrink-0 font-mono tabular-nums text-fg-muted">{a.year ?? ''}</span>
                  <span>
                    {a.title}
                    <span className="block text-[13px] text-fg-muted">{a.by}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="mb-4 font-mono text-[12px] text-fg-muted">{UI.headings.clients[lang]}</h2>
            <p className="text-[14px] leading-relaxed text-fg">{CLIENTS.join(' · ')}</p>
          </div>
        </section>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageLd(lang)) }}
      />
    </>
  )
}
