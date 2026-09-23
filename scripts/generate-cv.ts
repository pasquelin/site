/**
 * Imprime le CV en PDF, en français et en anglais, dans `public/cv/`.
 *
 * Le texte vit dans `scripts/cv/content.ts`, la mise en page dans
 * `scripts/cv/template.ts`. Chrome headless fait l'impression : c'est le moteur
 * qui a produit le premier tirage, et le seul dont le rendu soit prévisible.
 *
 * Hors du build : il faut un Chrome local, et un PDF se relit avant d'être
 * publié. `npm run cv`, puis on ouvre les deux fichiers.
 */
import { spawn } from 'node:child_process'
import { existsSync, mkdtempSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { setTimeout as sleep } from 'node:timers/promises'
import { CV as CV_PDF } from '../content/site.ts'
import type { Lang } from '../content/types.ts'
import { CV } from './cv/content.ts'
import { renderCv } from './cv/template.ts'

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
]

const chrome = CHROME_CANDIDATES.find((path) => path && existsSync(path))
if (!chrome) throw new Error('Chrome introuvable — renseigner CHROME_PATH.')

const scratch = mkdtempSync(join(tmpdir(), 'cv-'))

/**
 * Chrome headless écrit le PDF puis, sous macOS, ne se termine pas toujours.
 * On attend que le fichier cesse de grossir, et on ferme Chrome soi-même.
 */
async function print(html: string, pdf: string) {
  rmSync(pdf, { force: true })
  const browser = spawn(chrome!, [
    '--headless',
    '--no-pdf-header-footer',
    '--no-first-run',
    '--disable-extensions',
    `--user-data-dir=${join(scratch, 'profile')}`,
    `--print-to-pdf=${pdf}`,
    `file://${html}`,
  ], { stdio: 'ignore' })
  let size = -1
  for (let waited = 0; waited < 60_000; waited += 250) {
    await sleep(250)
    const now = existsSync(pdf) ? statSync(pdf).size : -1
    if (now > 0 && now === size) break
    size = now
  }
  browser.kill()
  if (size <= 0) throw new Error(`cv: ${pdf} n'a pas été imprimé.`)
}

for (const lang of Object.keys(CV) as Lang[]) {
  const html = join(scratch, `cv-${lang}.html`)
  const pdf = resolve('public', CV_PDF[lang].replace(/^\//, ''))
  writeFileSync(html, renderCv(CV[lang], lang))
  await print(html, pdf)
  console.log(`cv: ${pdf}`)
}
