/**
 * Generates the files written for machines rather than for people:
 * `llms.txt`, `llms-full.txt` and `cv.json`.
 *
 * They are produced from the same content modules the pages render, so a
 * change to an experience updates the site and everything a language model
 * reads in the same commit. Nothing here is maintained by hand.
 */
import { execFileSync } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { AI_ANSWER, AI_BODY, AI_METRICS, AI_TITLE } from '../content/ai.ts'
import { EXPERIENCE } from '../content/experience.ts'
import { PROJECTS } from '../content/projects.ts'
import { ANSWER, AWARDS, CLIENTS, DOCTRINE, HEADLINE, KNOWS_ABOUT, PITCH } from '../content/profile.ts'
import { AVAILABILITY, PERSON, SITE_URL, SOCIALS } from '../content/site.ts'
import type { Lang } from '../content/types.ts'

const PUBLIC_DIR = join(process.cwd(), 'public')

const url = (lang: Lang, path = '') => (path ? `${SITE_URL}/${lang}/${path}/` : `${SITE_URL}/${lang}/`)

/** The index: short, linked, and readable in one screen. */
function llmsTxt(): string {
  const lines: string[] = []
  lines.push(`# ${PERSON.name}`)
  lines.push('')
  lines.push(`> ${ANSWER.en}`)
  lines.push('')
  lines.push(PITCH.en)
  lines.push('')
  lines.push(`Available for freelance work: ${AVAILABILITY.zones.en.join(', ')}.`)
  lines.push(`Contact: ${PERSON.email}`)
  lines.push('')

  lines.push('## Experience')
  lines.push('')
  for (const e of EXPERIENCE) {
    const period = e.period ? ` (${e.period.from}–${e.period.to})` : ''
    lines.push(`- [${e.company} — ${e.role.en}${period}](${url('en', `experience/${e.slug}`)}): ${e.answer.en}`)
  }
  lines.push('')

  lines.push('## Projects')
  lines.push('')
  for (const p of PROJECTS) {
    lines.push(`- [${p.name}](${url('en', `projects/${p.slug}`)}): ${p.answer.en}`)
  }
  lines.push('')

  lines.push('## AI')
  lines.push('')
  lines.push(`- [${AI_TITLE.en}](${url('en', 'ai')}): ${AI_ANSWER.en}`)
  lines.push('')

  lines.push('## Elsewhere')
  lines.push('')
  for (const s of SOCIALS) lines.push(`- [${s.label}](${s.url})`)
  lines.push('')

  lines.push('## Optional')
  lines.push('')
  lines.push(`- [Full content, both languages](${SITE_URL}/llms-full.txt)`)
  lines.push(`- [Machine-readable CV, JSON Resume schema](${SITE_URL}/cv.json)`)
  lines.push(`- [CV as PDF, English](${SITE_URL}/cv/CV-Alban-Pasquelin-EN.pdf)`)
  lines.push(`- [CV en PDF, français](${SITE_URL}/cv/CV-Alban-Pasquelin-FR.pdf)`)
  lines.push(`- [French version](${url('fr')})`)
  lines.push('')

  return lines.join('\n')
}

/** The whole site as plain prose, in both languages, in one file. */
function llmsFullTxt(): string {
  const out: string[] = []

  for (const lang of ['en', 'fr'] as const) {
    out.push(`# ${PERSON.name} — ${HEADLINE[lang]} (${lang})`)
    out.push('')
    out.push(ANSWER[lang])
    out.push('')
    out.push(PITCH[lang])
    out.push('')
    out.push(`Location: ${PERSON.city}, France. Email: ${PERSON.email}.`)
    out.push(`Availability: ${AVAILABILITY.zones[lang].join(' · ')}.`)
    out.push(`Awards: ${AWARDS.map((a) => (a.year ? `${a.title} (${a.year})` : a.title)).join(', ')}.`)
    out.push(`Clients: ${CLIENTS.join(', ')}.`)
    out.push(`Skills: ${KNOWS_ABOUT.join(', ')}.`)
    out.push('')

    out.push('## Method')
    out.push('')
    for (const d of DOCTRINE[lang]) out.push(`- ${d}`)
    out.push('')

    out.push('## Experience')
    out.push('')
    for (const e of EXPERIENCE) {
      const period = e.period ? ` (${e.period.from}–${e.period.to})` : ''
      out.push(`### ${e.company} — ${e.role[lang]}${period}`)
      out.push('')
      out.push(url(lang, `experience/${e.slug}`))
      out.push('')
      out.push(e.answer[lang])
      out.push('')
      for (const p of e.body[lang]) out.push(`${p}\n`)
      if (e.metrics.length > 0) {
        out.push(`Results: ${e.metrics.map((m) => `${m.value} ${m.label[lang]}`).join(' · ')}.`)
        out.push('')
      }
      out.push(`Technologies: ${e.stack.join(', ')}.`)
      out.push('')
    }

    out.push('## Projects')
    out.push('')
    for (const p of PROJECTS) {
      out.push(`### ${p.name} — ${p.tagline[lang]}`)
      out.push('')
      out.push(url(lang, `projects/${p.slug}`))
      out.push('')
      out.push(p.answer[lang])
      out.push('')
      for (const para of p.body[lang]) out.push(`${para}\n`)
      if (p.metrics.length > 0) {
        out.push(`Results: ${p.metrics.map((m) => `${m.value} ${m.label[lang]}`).join(' · ')}.`)
        out.push('')
      }
      out.push(`Technologies: ${p.stack.join(', ')}. Repository: ${p.repo}.`)
      out.push('')
    }

    out.push(`## ${AI_TITLE[lang]}`)
    out.push('')
    out.push(url(lang, 'ai'))
    out.push('')
    out.push(AI_ANSWER[lang])
    out.push('')
    for (const p of AI_BODY[lang]) out.push(`${p}\n`)
    out.push(`Results: ${AI_METRICS.map((m) => `${m.value} ${m.label[lang]}`).join(' · ')}.`)
    out.push('')
    out.push('---')
    out.push('')
  }

  return out.join('\n')
}

/** JSON Resume schema — a format other tools already know how to read. */
function cvJson(): string {
  return JSON.stringify(
    {
      $schema: 'https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json',
      basics: {
        name: PERSON.name,
        label: HEADLINE.en,
        image: PERSON.avatar,
        email: PERSON.email,
        url: SITE_URL,
        summary: ANSWER.en,
        location: { city: PERSON.city, countryCode: PERSON.country },
        profiles: SOCIALS.map((s) => ({ network: s.label, url: s.url })),
      },
      work: EXPERIENCE.map((e) => ({
        name: e.company,
        position: e.role.en,
        url: e.url,
        ...(e.period ? { startDate: String(e.period.from), ...(e.period.to !== 'present' ? { endDate: String(e.period.to) } : {}) } : {}),
        summary: e.answer.en,
        highlights: e.metrics.map((m) => `${m.value} ${m.label.en}`),
      })),
      projects: PROJECTS.map((p) => ({
        name: p.name,
        description: p.answer.en,
        url: p.demo ?? p.repo,
        keywords: p.stack,
      })),
      skills: [{ name: 'Engineering', keywords: KNOWS_ABOUT }],
      awards: AWARDS.map((a) => ({ title: a.title, awarder: a.by, ...(a.year ? { date: String(a.year) } : {}) })),
      languages: [
        { language: 'French', fluency: 'Native speaker' },
        { language: 'English', fluency: 'Professional working proficiency' },
      ],
    },
    null,
    2,
  )
}

/**
 * Date du dernier commit ayant touché un fichier, pour le `lastmod` du
 * sitemap. Sans historique — un checkout superficiel — on ne renvoie rien
 * plutôt qu'une date inventée : le champ disparaît alors du sitemap.
 */
function lastCommit(file: string): string | undefined {
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cI', '--', file], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
    return out || undefined
  } catch {
    return undefined
  }
}

function writeLastmod(): void {
  const sources: Record<string, string> = {
    '': 'content/profile.ts',
    experience: 'content/experience.ts',
    projects: 'content/projects.ts',
    ai: 'content/ai.ts',
    contact: 'content/ui.ts',
  }
  for (const e of EXPERIENCE) sources[`experience/${e.slug}`] = 'content/experience.ts'
  for (const p of PROJECTS) sources[`projects/${p.slug}`] = 'content/projects.ts'

  const dates: Record<string, string> = {}
  for (const [path, file] of Object.entries(sources)) {
    const date = lastCommit(file)
    if (date) dates[path] = date
  }
  writeFileSync(join(process.cwd(), 'content', '.lastmod.json'), JSON.stringify(dates, null, 2), 'utf8')
  const known = Object.keys(dates).length
  console.log(known > 0 ? `lastmod : ${known} chemins datés depuis git` : 'lastmod : aucun historique, champ omis')
}

mkdirSync(PUBLIC_DIR, { recursive: true })
writeLastmod()
writeFileSync(join(PUBLIC_DIR, 'llms.txt'), llmsTxt(), 'utf8')
writeFileSync(join(PUBLIC_DIR, 'llms-full.txt'), llmsFullTxt(), 'utf8')
writeFileSync(join(PUBLIC_DIR, 'cv.json'), cvJson(), 'utf8')
console.log('machine files: public/llms.txt, public/llms-full.txt, public/cv.json')
