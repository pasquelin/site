import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SceneMount } from '@/components/three/SceneMount'
import { DevModeHint } from '@/components/ui/DevModeHint'
import { Engagements } from '@/components/ui/Engagements'
import { Metrics } from '@/components/ui/Metrics'
import { ModeOnly } from '@/components/ui/ModeOnly'
import { AI_AT_WORK } from '@/content/ai'
import { EXPERIENCE } from '@/content/experience'
import { PROJECTS } from '@/content/projects'
import {
  AWARDS,
  CLIENTS,
  DIRECTION,
  DOCTRINE,
  HEADLINE,
  HEADLINE_METRICS,
  META_DESCRIPTION,
  PITCH,
  SITUATIONS,
  SKILLS,
  SUBHEAD,
  TESTIMONIALS,
  WAYS_OF_WORKING,
} from '@/content/profile'
import { AVAILABILITY, CV, LANGS, PERSON } from '@/content/site'
import { UI } from '@/content/ui'
import type { Lang } from '@/content/types'
import { isLang } from '@/lib/i18n'
import { profilePageLd } from '@/lib/jsonld'
import { pageMeta } from '@/lib/seo'
import { keepTogether } from '@/lib/typo'

export async function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  if (!isLang(lang)) return {}
  return pageMeta({
    lang,
    title: `${PERSON.name} | ${HEADLINE[lang]}`,
    description: META_DESCRIPTION[lang],
  })
}

/** `**Lead.** Rest` → the bold lead and the sentence that follows it. */
const splitLead = (line: string): { lead: string; rest: string } => {
  const match = /^\*\*(.+?)\*\*\s*(.*)$/.exec(line)
  return match ? { lead: match[1], rest: match[2] } : { lead: '', rest: line }
}

const SECTION = 'mt-12 border-t border-line-soft pt-10'
const HEADING = 'mb-4 font-mono text-[12px] text-fg-muted'

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
            <h1 className="text-balance text-[2.4rem] font-semibold leading-[1.05] tracking-[-0.03em] text-fg-bright sm:text-[3.5rem]">
              {PERSON.name}
            </h1>
            <p className="mt-3 text-[1.15rem] text-amber sm:text-[1.4rem]">{HEADLINE[lang]}</p>
            <p className="measure mt-6 text-[16px] leading-[1.7] text-fg">{keepTogether(PITCH[lang])}</p>
            {AVAILABILITY.open ? (
              <p className="mt-4 text-[15px] text-green">{keepTogether(UI.availableLong[lang])}</p>
            ) : null}

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/${lang}/contact/`}
                className="rounded-panel bg-amber px-4 py-2.5 font-mono text-[13px] font-medium text-ink-950 transition-colors hover:bg-amber/85"
              >
                {UI.actions.contact[lang]}
              </Link>
              <a
                href="#missions"
                className="rounded-panel border border-line px-4 py-2.5 font-mono text-[13px] text-fg transition-colors hover:border-amber/50 hover:text-fg-bright"
              >
                {UI.actions.engagements[lang]}
              </a>
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

            <DevModeHint />
            <ModeOnly mode="dev">
              <p className="mt-5 font-mono text-[13px] text-fg-muted">{SUBHEAD[lang]}</p>
            </ModeOnly>

            <div className="mt-12">
              <Metrics metrics={HEADLINE_METRICS} lang={lang} />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8">
        <section>
          <h2 className={HEADING}>{UI.headings.edge[lang]}</h2>
          <ul className="grid gap-4 lg:grid-cols-3">
            {SITUATIONS.map((s) => (
              <li key={s.title.en} className="flex flex-col rounded-panel border border-line-soft bg-ink-900 p-5">
                <span className="block text-[16px] font-medium leading-snug text-fg-bright">{keepTogether(s.title[lang])}</span>
                <span className="mt-2 block flex-1 text-[14px] leading-relaxed text-fg-muted">{keepTogether(s.body[lang])}</span>
                <span className="mt-4 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[12.5px]">
                  {s.proof.map((p) => (
                    <Link key={p.path} href={`/${lang}/${p.path}/`} className="text-amber hover:underline">
                      {p.label[lang]} →
                    </Link>
                  ))}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Le décideur lit la première version, le développeur la seconde. */}
        <ModeOnly mode="human">
          <section className={`${SECTION} grid gap-10 lg:grid-cols-2`}>
            <div>
              <h2 className={HEADING}>{UI.headings.ways[lang]}</h2>
              <ul className="space-y-4">
                {WAYS_OF_WORKING[lang].map((line) => {
                  const { lead, rest } = splitLead(line)
                  return (
                    <li key={line.slice(0, 30)} className="border-l-2 border-line pl-4">
                      <span className="block text-[15px] font-medium text-fg-bright">{keepTogether(lead)}</span>
                      <span className="mt-0.5 block text-[14px] leading-relaxed text-fg-muted">{keepTogether(rest)}</span>
                    </li>
                  )
                })}
              </ul>
            </div>
            <div>
              <h2 className={HEADING}>{AI_AT_WORK.title[lang]}</h2>
              <p className="text-[15px] leading-[1.7] text-fg">{keepTogether(AI_AT_WORK.intro[lang])}</p>
              <ul className="mt-4 space-y-3">
                {AI_AT_WORK.points[lang].map((point) => (
                  <li key={point.slice(0, 30)} className="border-l-2 border-cyan/40 pl-4 text-[14px] leading-relaxed text-fg">
                    {keepTogether(point)}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </ModeOnly>
        <ModeOnly mode="dev">
          <section className={SECTION}>
            <h2 className={HEADING}>{UI.headings.doctrine[lang]}</h2>
            <p className="measure mb-6 text-[15px] leading-[1.7] text-fg">{DIRECTION[lang]}</p>
            <ul className="measure space-y-3 text-[15px] leading-[1.7] text-fg">
              {DOCTRINE[lang].map((d) => (
                <li key={d.slice(0, 30)} className="border-l-2 border-line pl-4">
                  {d}
                </li>
              ))}
            </ul>
          </section>
        </ModeOnly>

        <section id="missions" className={`${SECTION} scroll-mt-6`}>
          <h2 className={HEADING}>{UI.headings.engagements[lang]}</h2>
          <Engagements lang={lang} />
          <Link
            href={`/${lang}/contact/`}
            className="mt-6 inline-block font-mono text-[13px] text-amber hover:underline"
          >
            {UI.contact.title[lang]} →
          </Link>
        </section>

        {TESTIMONIALS.length > 0 ? (
          <section className={SECTION}>
            <h2 className={HEADING}>{UI.headings.testimonials[lang]}</h2>
            <div className="grid gap-6 lg:grid-cols-2">
              {TESTIMONIALS.map((t) => (
                <figure key={t.author} className="m-0 border-l-2 border-amber/40 pl-5">
                  <blockquote lang={t.original} className="text-[15px] leading-[1.7] text-fg">
                    {keepTogether(t.quote[lang])}
                  </blockquote>
                  <figcaption className="mt-3 text-[13px] text-fg-muted">
                    <span className="font-medium text-fg-bright">{t.author}</span>, {t.role[lang]} ·{' '}
                    {UI.testimonial.via[lang]}{' '}
                    <a href={t.url} className="underline decoration-line underline-offset-4 hover:text-fg-bright">
                      {t.source}
                    </a>
                    , {t.year}
                    {t.original !== lang ? (
                      <span className="block italic">{UI.testimonial.translated[lang]}</span>
                    ) : null}
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        ) : null}

        <section className={SECTION}>
          <h2 className={HEADING}>{UI.headings.experience[lang]}</h2>
          <ul data-rm-target="experience" className="divide-y divide-line-soft border-y border-line-soft">
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
          <h2 className={HEADING}>{UI.headings.projects[lang]}</h2>
          <ul data-rm-target="projects" className="grid gap-3 sm:grid-cols-2">
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

        <section id="distinctions" className={`${SECTION} grid gap-10 sm:grid-cols-2`}>
          <div>
            <h2 className={HEADING}>{UI.headings.awards[lang]}</h2>
            <ul className="space-y-4 text-[14px] text-fg">
              {AWARDS.map((a) => (
                <li key={`${a.title}${a.year ?? ''}`} className="flex gap-3">
                  <span className="w-10 shrink-0 font-mono tabular-nums text-fg-muted">{a.year ?? ''}</span>
                  <span>
                    <span className="font-medium text-fg-bright">{a.title}</span>
                    {a.note ? (
                      <span className="mt-0.5 block text-[13px] leading-relaxed text-fg-muted">{keepTogether(a.note[lang])}</span>
                    ) : (
                      <span className="block text-[13px] text-fg-muted">{a.by}</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className={HEADING}>{UI.headings.clients[lang]}</h2>
            <p className="text-[14px] leading-relaxed text-fg">{CLIENTS.join(' · ')}</p>
          </div>
        </section>

        <section className={SECTION}>
          <h2 className={HEADING}>{UI.headings.stack[lang]}</h2>
          <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
            {SKILLS.map((group) => (
              <div key={group.label.en}>
                <dt className="mb-2 text-[14px] font-medium text-fg-bright">{group.label[lang]}</dt>
                <dd className="text-[13px] leading-relaxed text-fg-muted">{group.items.join(' · ')}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageLd(lang)) }}
      />
    </>
  )
}
