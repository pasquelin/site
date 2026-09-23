/**
 * Le CV en HTML imprimable, A4, deux pages.
 *
 * Les polices sont celles du premier tirage, imprimé sous Linux : TeX Gyre
 * Heros et Liberation Mono. Sur macOS elles cèdent la place à Helvetica et
 * Menlo, aux chasses identiques ou presque — les lignes se coupent aux mêmes
 * mots, quelle que soit la machine.
 */
import type { Cv, CvEntry, CvProject } from './content.ts'

const escape = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** `**gras**` et `*italique*`, après échappement. */
const inline = (value: string) =>
  escape(value)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')

const tags = (list?: readonly string[]) =>
  list?.length ? `<p class="tags">${list.map(escape).join(' · ')}</p>` : ''

const head = (title: string, org: string | undefined, period: string) => `
  <div class="head">
    <h3>${escape(title)}${org ? ` <span class="org">— ${escape(org)}</span>` : ''}</h3>
    <span class="period">${escape(period)}</span>
  </div>`

const entry = (e: CvEntry) => `
  <article>
    ${head(e.title, e.org, e.period)}
    ${e.summary ? `<p class="summary">${inline(e.summary)}</p>` : ''}
    ${e.bullets?.length ? `<ul>${e.bullets.map((b) => `<li>${inline(b)}</li>`).join('')}</ul>` : ''}
    ${tags(e.tags)}
  </article>`

const project = (p: CvProject) => `
  <article>
    ${head(p.name, undefined, p.year)}
    <p class="summary">${inline(p.summary)}</p>
    ${tags(p.tags)}
  </article>`

const STYLE = `
  @page { size: A4; margin: 14mm; }
  :root {
    --ink: #16202b; --soft: #45535f; --muted: #6c7a86; --dash: #9aa6b1;
    --accent: #2f5d7c; --rule: #c9d2da; --tint: #f6f8fa;
    --sans: 'TeX Gyre Heros', Helvetica, Arial, sans-serif;
    --mono: 'Liberation Mono', Menlo, 'Courier New', monospace;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font: 12.47px/1.524 var(--sans); color: var(--ink); background: #fff; }
  h1 { font-size: 27.5px; line-height: 1.1; letter-spacing: -0.01em; margin-top: -2.7px; }
  .headline { font-size: 13.86px; font-weight: 700; color: var(--accent); margin-top: 1.7px; }
  .contact { font-size: 11px; color: var(--soft); margin-top: 6.7px; padding-bottom: 9.3px; border-bottom: 2px solid var(--ink); }
  .contact span + span::before { content: ' · '; color: var(--dash); }
  h2 {
    font-size: 10px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: var(--accent);
    margin-top: 14.7px; padding-bottom: 5px; border-bottom: 1px solid var(--rule); margin-bottom: 4.7px;
  }
  article { break-inside: avoid; margin-bottom: 9.3px; }
  .head { display: flex; justify-content: space-between; align-items: baseline; gap: 16px; }
  h3 { font-size: 12.83px; font-weight: 700; }
  .org { font-weight: 400; color: var(--soft); }
  .period { font: 10.93px var(--mono); color: var(--muted); white-space: nowrap; }
  .summary { font-size: 11.18px; line-height: 16px; color: var(--muted); margin-top: 0.7px; }
  ul { list-style: none; margin-top: 5.3px; }
  li { font-size: 12.1px; line-height: 19px; padding-left: 12px; position: relative; }
  li::before { content: '–'; position: absolute; left: 0; color: var(--dash); }
  .tags { font: 10.93px/1.5 var(--mono); color: var(--accent); margin-top: -0.3px; }
  .summary + .tags { margin-top: 3.7px; }
  .skills { display: grid; grid-template-columns: 139.2px 1fr; row-gap: 3px; font-size: 11.73px; line-height: 16px; }
  .skills dt { font-weight: 700; color: var(--soft); padding-right: 8px; }
  .columns { display: grid; grid-template-columns: 1fr 1fr; column-gap: 21.5px; }
  .awards li { font-size: 11.55px; line-height: 17px; margin-bottom: 1px; }
  .columns p { font-size: 11.55px; line-height: 16px; }
  .terms {
    margin-top: 12px; padding: 7px 11px; background: var(--tint); border: 1px solid var(--rule);
    font-size: 11.37px; line-height: 16px; break-inside: avoid;
  }
  .terms strong { color: var(--accent); }
`

export const renderCv = (cv: Cv, lang: string) => `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<title>${escape(cv.title)}</title>
<style>${STYLE}</style>
</head>
<body>
  <header>
    <h1>Alban Pasquelin</h1>
    <p class="headline">${escape(cv.headline)}</p>
    <p class="contact">${cv.contact.map((c) => `<span>${escape(c)}</span>`).join('')}</p>
  </header>

  <h2>${escape(cv.headings.profile)}</h2>
  <p>${inline(cv.profile)}</p>

  <h2>${escape(cv.headings.experience)}</h2>
  ${cv.experience.map(entry).join('')}

  <h2>${escape(cv.headings.projects)}</h2>
  ${cv.projects.map(project).join('')}

  <h2>${escape(cv.headings.skills)}</h2>
  <dl class="skills">${cv.skills.map(([k, v]) => `<dt>${escape(k)}</dt><dd>${escape(v)}</dd>`).join('')}</dl>

  <div class="columns">
    <section>
      <h2>${escape(cv.headings.awards)}</h2>
      <ul class="awards">${cv.awards.map((a) => `<li>${inline(a)}</li>`).join('')}</ul>
    </section>
    <section>
      <h2>${escape(cv.headings.education)}</h2>
      <p>${escape(cv.education)}</p>
      <h2>${escape(cv.headings.languages)}</h2>
      <p>${escape(cv.languages)}</p>
    </section>
  </div>

  <p class="terms">${inline(cv.terms)}</p>
</body>
</html>
`
