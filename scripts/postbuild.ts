/**
 * Writes the root document.
 *
 * `/` carries no content of its own — it points at the French entry page and
 * declares it canonical, so the two never compete in an index. On hosts that
 * support redirects (see `vercel.json`) the redirect answers first and this
 * file is only ever seen by a crawler following a stale link.
 */
import { existsSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { PERSON, SITE_URL } from '../content/site.ts'

const OUT = join(process.cwd(), 'out')
if (!existsSync(OUT)) {
  console.error('postbuild: out/ is missing — run `next build` first')
  process.exit(1)
}

const html = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${PERSON.name}</title>
<link rel="canonical" href="${SITE_URL}/fr/">
<link rel="alternate" hreflang="fr-FR" href="${SITE_URL}/fr/">
<link rel="alternate" hreflang="en" href="${SITE_URL}/en/">
<link rel="alternate" hreflang="x-default" href="${SITE_URL}/fr/">
<meta http-equiv="refresh" content="0;url=/fr/">
<meta name="robots" content="noindex,follow">
<style>body{background:#080a0e;color:#c6cfdb;font:14px/1.6 ui-monospace,monospace;padding:2rem}a{color:#f5a742}</style>
</head>
<body>
<p>${PERSON.name}</p>
<p><a href="/fr/">Français</a> · <a href="/en/">English</a></p>
</body>
</html>
`

writeFileSync(join(OUT, 'index.html'), html, 'utf8')
console.log('postbuild: out/index.html written')
