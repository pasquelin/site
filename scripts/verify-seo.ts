/**
 * Vérifie le référencement du rendu, et fait échouer le build s'il est cassé.
 *
 * `verify-crawl` garantit que le texte est là ; celui-ci garantit que les
 * machines savent quoi en faire. Il est né d'un défaut réel : chaque page
 * déclarait une image de partage, `og.png`, qui n'existait pas. Trois jours
 * en ligne, aucune alerte — une carte de partage n'est jamais regardée par son
 * auteur. Une assertion l'aurait attrapé au premier build.
 */
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { EXPERIENCE } from '../content/experience.ts'
import { NAV } from '../content/nav.ts'
import { PROJECTS } from '../content/projects.ts'
import { LANGS, SITE_URL } from '../content/site.ts'
import type { Lang } from '../content/types.ts'

const OUT = join(process.cwd(), 'out')

let failures = 0
let checks = 0

const fail = (message: string) => {
  console.error(`✗ ${message}`)
  failures++
}
const assert = (condition: boolean, message: string) => {
  checks++
  if (!condition) fail(message)
}

const paths = [
  ...NAV.map((n) => n.path),
  ...EXPERIENCE.map((e) => `experience/${e.slug}`),
  ...PROJECTS.map((p) => `projects/${p.slug}`),
]

/** Chaque ressource déclarée dans le HTML doit exister dans le rendu. */
const localAsset = (url: string) => join(OUT, url.replace(SITE_URL, '').replace(/^\//, ''))

for (const lang of LANGS as readonly Lang[]) {
  for (const path of paths) {
    const rel = path ? `${lang}/${path}` : `${lang}`
    const file = join(OUT, rel, 'index.html')
    if (!existsSync(file)) {
      fail(`page absente : ${rel}/index.html`)
      continue
    }
    const html = readFileSync(file, 'utf8')
    const expected = path ? `${SITE_URL}/${lang}/${path}/` : `${SITE_URL}/${lang}/`

    const canonical = /<link rel="canonical" href="([^"]+)"/.exec(html)?.[1]
    assert(canonical === expected, `${rel} — canonical vaut ${canonical}, attendu ${expected}`)

    // Sans les deux `hreflang`, les versions française et anglaise se font
    // concurrence au lieu de se désigner l'une l'autre.
    for (const other of LANGS) {
      const alt = path ? `${SITE_URL}/${other}/${path}/` : `${SITE_URL}/${other}/`
      assert(html.includes(`href="${alt}"`), `${rel} — hreflang manquant vers ${other}`)
    }

    // Un moteur affiche environ 155 caractères. En deçà de 110, la place est
    // gaspillée ; au-delà de 300, la phrase est tronquée en plein milieu.
    const description = /<meta name="description" content="([^"]*)"/.exec(html)?.[1] ?? ''
    assert(
      description.length >= 110 && description.length <= 300,
      `${rel} — description de ${description.length} caractères, attendu entre 110 et 300`,
    )

    // Le défaut d'origine : une image déclarée, absente du rendu.
    const image = /<meta property="og:image" content="([^"]+)"/.exec(html)?.[1]
    assert(Boolean(image), `${rel} — og:image absente`)
    if (image) {
      assert(existsSync(localAsset(image)), `${rel} — og:image introuvable dans le rendu : ${image}`)
    }

    for (const block of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      checks++
      try {
        JSON.parse(block[1])
      } catch (error) {
        fail(`${rel} — JSON-LD illisible : ${(error as Error).message}`)
      }
    }
  }

  // L'accueil porte le graphe d'identité : c'est lui qui dit à un moteur que
  // ces comptes désignent une seule personne.
  const home = readFileSync(join(OUT, lang, 'index.html'), 'utf8')
  for (const type of ['"@type":"Person"', '"@type":"ProfilePage"', '"@type":"FAQPage"']) {
    assert(home.includes(type), `${lang} — ${type} absent de l'accueil`)
  }
  assert(home.includes('"sameAs"'), `${lang} — sameAs absent du graphe Person`)
}

for (const file of ['robots.txt', 'sitemap.xml', 'llms.txt', 'llms-full.txt', 'cv.json', 'og.png']) {
  assert(existsSync(join(OUT, file)), `fichier machine manquant : ${file}`)
}

const sitemap = readFileSync(join(OUT, 'sitemap.xml'), 'utf8')
assert(
  (sitemap.match(/<url>/g) ?? []).length === paths.length * LANGS.length,
  `sitemap : ${(sitemap.match(/<url>/g) ?? []).length} URL, attendu ${paths.length * LANGS.length}`,
)
assert(!sitemap.includes(`${SITE_URL.replace('www.', '')}/`) || SITE_URL.includes('www.'),
  'sitemap : des URL ne portent pas l’origine canonique')

if (failures > 0) {
  console.error(`\nréférencement : ${failures} échec(s) sur ${checks} assertions.`)
  process.exit(1)
}
console.log(`référencement : ${checks} assertions passées — canonical, hreflang, JSON-LD, og:image, fichiers machine.`)
