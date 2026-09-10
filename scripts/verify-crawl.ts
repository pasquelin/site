/**
 * Asserts that the site is readable without JavaScript.
 *
 * GPTBot, ClaudeBot, PerplexityBot and CCBot do not run scripts: whatever is
 * not in the served HTML does not exist to them. This walks the built output
 * and fails the build if a page's own words are missing from its file, so the
 * property can never be lost by accident.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { EXPERIENCE } from '../content/experience.ts'
import { PROJECTS } from '../content/projects.ts'
import { ANSWER } from '../content/profile.ts'
import { LANGS } from '../content/site.ts'
import type { Lang } from '../content/types.ts'

const OUT = join(process.cwd(), 'out')

const decode = (html: string) =>
  html
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;|&#34;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')

interface Check {
  readonly path: string
  readonly needles: readonly string[]
}

function checksFor(lang: Lang): Check[] {
  return [
    { path: `${lang}`, needles: [ANSWER[lang].slice(0, 60)] },
    ...EXPERIENCE.map((e) => ({
      path: `${lang}/experience/${e.slug}`,
      needles: [e.answer[lang].slice(0, 60), e.body[lang][0].slice(0, 60)],
    })),
    ...PROJECTS.map((p) => ({
      path: `${lang}/projects/${p.slug}`,
      needles: [p.answer[lang].slice(0, 60), p.body[lang][0].slice(0, 60)],
    })),
  ]
}

let failures = 0
let checked = 0

for (const lang of LANGS) {
  for (const check of checksFor(lang)) {
    const file = join(OUT, check.path, 'index.html')
    let html: string
    try {
      html = decode(readFileSync(file, 'utf8'))
    } catch {
      console.error(`✗ missing file: ${check.path}/index.html`)
      failures++
      continue
    }
    for (const needle of check.needles) {
      checked++
      if (!html.includes(needle)) {
        console.error(`✗ ${check.path} — text absent from the served HTML:\n    "${needle}…"`)
        failures++
      }
    }
  }
}

if (failures > 0) {
  console.error(`\ncrawlability: ${failures} failure(s). AI crawlers would not see this content.`)
  process.exit(1)
}
console.log(`crawlability: ${checked} assertions passed — every page is complete in its HTML.`)
