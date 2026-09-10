/**
 * Génère l'image de partage, `public/og.png`.
 *
 * Elle est produite au build depuis le cœur de contenu, comme le reste : le
 * nom, le titre et les chiffres affichés sont ceux du site. Une image dessinée
 * à la main dériverait le jour où une ligne du CV change, et personne ne s'en
 * apercevrait — une carte de partage n'est jamais regardée par son auteur.
 *
 * 1200 × 630, le format que LinkedIn, X, Slack et WhatsApp attendent tous.
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import sharp from 'sharp'
import { HEADLINE, HEADLINE_METRICS, SUBHEAD } from '../content/profile.ts'
import { PERSON, SITE_URL } from '../content/site.ts'

const WIDTH = 1200
const HEIGHT = 630

/* Les jetons de globals.css. Une seule palette pour le site et son image. */
const INK = '#0b0e14'
const PANEL = '#12161e'
const LINE = '#232b39'
const AMBER = '#f5a742'
const CYAN = '#4fd1e0'
const BRIGHT = '#eef2f7'
const MUTED = '#6c7a8d'
const COMMENT = '#93a79f'

const escape = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

/** Le champ de cubes du hero, en version figée et discrète. */
function voxels(): string {
  let seed = 0x5eed
  const random = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff
    return seed / 0x7fffffff
  }
  const palette = [LINE, LINE, LINE, AMBER, CYAN]
  const out: string[] = []
  for (let i = 0; i < 90; i++) {
    const x = 700 + random() * 520
    const y = 40 + random() * 560
    const size = 14 + random() * 46
    const fill = palette[Math.floor(random() * palette.length)]
    const opacity = (0.1 + random() * 0.45).toFixed(2)
    out.push(
      `<rect x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="${size.toFixed(0)}" height="${size.toFixed(0)}" rx="3" fill="${fill}" opacity="${opacity}"/>`,
    )
  }
  return out.join('')
}

const metrics = HEADLINE_METRICS.map((m) => ({ value: m.value, label: m.label.fr }))

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="veil" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0.30" stop-color="${PANEL}" stop-opacity="1"/>
      <stop offset="0.72" stop-color="${PANEL}" stop-opacity="0.86"/>
      <stop offset="1" stop-color="${PANEL}" stop-opacity="0.30"/>
    </linearGradient>
  </defs>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="${INK}"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${PANEL}"/>
  ${voxels()}
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#veil)"/>

  <!-- La barre de titre de l'éditeur : elle dit ce qu'est le site avant qu'on l'ouvre. -->
  <rect x="0" y="0" width="${WIDTH}" height="52" fill="#171d26"/>
  <line x1="0" y1="52" x2="${WIDTH}" y2="52" stroke="${LINE}" stroke-width="1"/>
  <circle cx="34" cy="26" r="7" fill="#ff7b6b" opacity="0.85"/>
  <circle cx="58" cy="26" r="7" fill="${AMBER}" opacity="0.85"/>
  <circle cx="82" cy="26" r="7" fill="#7ec699" opacity="0.85"/>
  <text x="112" y="32" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="17" fill="${MUTED}">${escape(SITE_URL.replace(/^https?:\/\//, ''))}</text>

  <text x="80" y="176" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="19" fill="${COMMENT}">/** ${escape(HEADLINE.fr)} **/</text>

  <text x="80" y="268" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="76" font-weight="600" letter-spacing="-2" fill="${BRIGHT}">${escape(PERSON.name)}</text>

  <text x="80" y="322" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="22" fill="${AMBER}">${escape(SUBHEAD.fr)}</text>

  <line x1="80" y1="378" x2="620" y2="378" stroke="${LINE}" stroke-width="1"/>

  ${metrics
    .map((m, i) => {
      const x = 80 + i * 190
      return `<text x="${x}" y="452" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="46" fill="${AMBER}">${escape(m.value)}</text>
  <text x="${x}" y="484" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="17" fill="${MUTED}">${escape(m.label)}</text>`
    })
    .join('\n  ')}

  <rect x="78" y="540" width="270" height="42" rx="7" fill="none" stroke="#7ec699" stroke-opacity="0.35"/>
  <circle cx="102" cy="561" r="5" fill="#7ec699"/>
  <text x="118" y="567" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="17" fill="#7ec699">Disponible en freelance</text>
</svg>`

const publicDir = join(process.cwd(), 'public')
mkdirSync(publicDir, { recursive: true })

const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer()
writeFileSync(join(publicDir, 'og.png'), png)

// Une image de partage vide passe inaperçue jusqu'au premier partage raté.
if (png.length < 8_000) {
  console.error(`og.png ne fait que ${png.length} octets — le rendu a probablement échoué.`)
  process.exit(1)
}
console.log(`og.png : ${WIDTH}×${HEIGHT}, ${(png.length / 1024).toFixed(0)} ko`)
