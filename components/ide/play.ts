import type { Animation, EggLine } from './easter-eggs'

/**
 * Joue une commande cachée, puis remet tout en place.
 *
 * Aucun nœud du site n'est retiré : on pose des classes et des variables CSS,
 * et les seuls éléments créés — fantômes, flash, train, pluie — vivent dans
 * leur propre calque jetable. Le nettoyage est dans un `finally`, doublé d'une
 * minuterie de sécurité : si une animation ne se termine jamais, la page se
 * répare quand même.
 */

const REDUCED = '(prefers-reduced-motion: reduce)'
const SAFETY_MS = 12000

/**
 * Le temps d'arrêt, une fois tout par terre.
 *
 * Sans lui, la reconstruction enchaîne sur la destruction et on ne voit ni
 * l'une ni l'autre. Ce silence est ce qui donne son poids à la blague : la
 * page reste cassée assez longtemps pour qu'on y croie.
 */
const HOLD_MS = 1200

const CLASSES = [
  'rm-fall', 'rm-restore', 'rm-levitate', 'rm-land', 'rm-vortex', 'rm-unvortex',
  'rm-wipe', 'rm-unwipe', 'rm-tilt', 'rm-dissolve', 'rm-install',
]
const VARS = ['--rm-x', '--rm-r', '--rm-d', '--rm-cx', '--rm-cy', '--rm-z', '--rm-rx', '--rm-ry']

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

const terminalEl = () => document.querySelector<HTMLElement>('[data-rm-terminal]')
const rootEl = () => document.querySelector<HTMLElement>('[data-rm-root]')
const logEl = () => document.querySelector<HTMLElement>('[data-rm-terminal] [role="log"]')

/** Un élément contenu dans un autre élément retenu bougerait deux fois. */
const dropNested = (elements: HTMLElement[]) =>
  elements.filter((el) => !elements.some((other) => other !== el && other.contains(el)))

const visible = (el: HTMLElement) => {
  const rect = el.getBoundingClientRect()
  return rect.width > 24 && rect.height > 8 && rect.bottom > 0 && rect.top < window.innerHeight
}

const PIECES = [
  'main h1', 'main h2', 'main p', 'main li', 'main figure', 'main dl > div',
  'main a', 'main button',
  'header nav a', '[role="tablist"] > *', 'nav[aria-label] a', 'nav[aria-label] button',
].join(',')

/**
 * Les panneaux : le châssis lui-même, terminal compris.
 *
 * Ils partent dans un second temps, une fois leur contenu envolé. Animer le
 * contenu en laissant les panneaux en place donnait l'impression d'un bug —
 * des rectangles sombres flottant au milieu de rien. Ou l'on détruit tout, ou
 * l'on ne détruit rien.
 */
const PANELS = [
  '[data-rm-root] > header',
  '[data-rm-root] > footer',
  'nav[aria-label]',
  '[role="tablist"]',
  'main',
  '[data-rm-terminal]',
  '[role="separator"]',
].join(',')

function collectPanels(): HTMLElement[] {
  return [...document.querySelectorAll<HTMLElement>(PANELS)].filter(visible)
}

function collectPieces(): HTMLElement[] {
  const found = [...document.querySelectorAll<HTMLElement>(PIECES)].filter(visible)
  return dropNested(found).slice(0, 80)
}

function collectSection(section: string): HTMLElement[] {
  const items: HTMLElement[] = []
  for (const container of document.querySelectorAll<HTMLElement>(`[data-rm-target="${section}"]`)) {
    for (const child of container.children) if (child instanceof HTMLElement) items.push(child)
  }
  return items.filter(visible)
}

/**
 * Attend qu'une section apparaisse dans le document, après une navigation.
 *
 * Rend faux si elle ne vient jamais — on répond alors comme `rm`, plutôt que
 * d'animer dans le vide.
 */
export async function waitForSection(section: string, timeout = 3000): Promise<boolean> {
  const deadline = performance.now() + timeout
  while (performance.now() < deadline) {
    if (document.querySelector(`[data-rm-target="${section}"]`)) return true
    await wait(80)
  }
  return false
}

/** Combien d'entrées la section visée contient, qu'elles soient à l'écran ou non. */
export function countSection(section: string): number {
  let total = 0
  for (const container of document.querySelectorAll(`[data-rm-target="${section}"]`)) {
    total += container.children.length
  }
  return total
}

/**
 * Amène la section à l'écran avant de la supprimer.
 *
 * `visible` écarte ce qui est hors cadre — sans quoi on animerait dans le vide.
 * Mais sur l'accueil, la liste du parcours est sous la ligne de flottaison :
 * la commande répondait « rien à supprimer » alors que la section existe. On
 * y va d'abord, puis on supprime.
 */
async function bringIntoView(section: string): Promise<void> {
  const container = document.querySelector(`[data-rm-target="${section}"]`)
  if (!container) return
  const rect = container.getBoundingClientRect()
  if (rect.top > 80 && rect.bottom < window.innerHeight) return
  container.scrollIntoView({ behavior: 'smooth', block: 'center' })
  await wait(650)
}

function cleanup(elements: HTMLElement[]) {
  for (const el of [...elements, ...document.querySelectorAll<HTMLElement>(PANELS)]) {
    el.classList.remove(...CLASSES)
    for (const name of VARS) el.style.removeProperty(name)
  }
  terminalEl()?.classList.remove('rm-glitch', 'rm-exit', 'rm-shake')
  rootEl()?.classList.remove('rm-shake', 'rm-space')
  for (const node of document.querySelectorAll(
    '.rm-flash, .rm-blackout, .rm-ghosts, .rm-overlay, .rm-shockwave, .rm-vignette',
  )) {
    node.remove()
  }
}

/** Un calque jetable, plein écran ou posé sur le terminal. */
function overlay(className: string, parent: HTMLElement = document.body): HTMLElement {
  const el = document.createElement('div')
  el.className = className
  el.setAttribute('aria-hidden', 'true')
  parent.append(el)
  return el
}

/* ── Les animations ────────────────────────────────────────────────────── */

/**
 * Pose les variables d'une sortie sur un élément. Le délai est confié à
 * l'appelant : c'est lui qui décide de l'ordre de la vague.
 */
function aim(el: HTMLElement, delay: number, spread = 44) {
  const rect = el.getBoundingClientRect()
  const centreX = window.innerWidth / 2
  const centreY = window.innerHeight / 2
  el.style.setProperty('--rm-x', `${(Math.random() - 0.5) * spread}vw`)
  el.style.setProperty('--rm-z', `${-300 - Math.random() * 700}px`)
  el.style.setProperty('--rm-rx', `${30 + Math.random() * 110}deg`)
  el.style.setProperty('--rm-ry', `${(Math.random() - 0.5) * 160}deg`)
  el.style.setProperty('--rm-r', `${(Math.random() - 0.5) * 120}deg`)
  el.style.setProperty('--rm-d', `${delay}ms`)
  el.style.setProperty('--rm-cx', `${centreX - (rect.left + rect.width / 2)}px`)
  el.style.setProperty('--rm-cy', `${centreY - (rect.top + rect.height / 2)}px`)
}

async function depart(elements: HTMLElement[], animation: Animation) {
  const going = animation === 'levitate' ? 'rm-levitate' : animation === 'vortex' ? 'rm-vortex' : 'rm-fall'
  const back = animation === 'levitate' ? 'rm-land' : animation === 'vortex' ? 'rm-unvortex' : 'rm-restore'
  const root = rootEl()

  // La perspective vit sur la racine : sans elle, `rotateX` aplatit au lieu
  // de faire tourner. C'est ce seul réglage qui sépare un volume d'un glissement.
  root?.classList.add('rm-space')
  if (animation === 'fall') {
    overlay('rm-shockwave')
    overlay('rm-vignette')
  }

  const order = [...elements].sort(
    (a, b) => b.getBoundingClientRect().top - a.getBoundingClientRect().top,
  )

  order.forEach((el, i) => {
    const rect = el.getBoundingClientRect()
    // L'onde part du bas : le délai suit la distance au terminal, donc la
    // vague monte à travers la page au lieu de tout lâcher d'un coup.
    const fromBottom = (window.innerHeight - rect.bottom) / window.innerHeight
    aim(el, Math.max(0, fromBottom) * 420 + i * 6)
    el.classList.add(going)
  })

  if (animation === 'fall') {
    // La secousse arrive avec l'onde, pas au lancement de la commande.
    setTimeout(() => root?.classList.add('rm-shake'), 90)
    setTimeout(() => root?.classList.remove('rm-shake'), 800)
  }

  // Second temps : les panneaux vidés s'en vont à leur tour, la racine avec
  // eux. Sans les panneaux il resterait des rectangles sombres ; sans la
  // racine, il resterait toujours une arête — une bordure, un fond de
  // conteneur — qu'aucune liste de sélecteurs n'attrape complètement.
  const panels = collectPanels()
  if (root) panels.push(root)
  await wait(260)
  panels.forEach((el, i) => {
    aim(el, i * 70, 60)
    el.classList.add(going)
  })

  await wait(1500)
  await wait(HOLD_MS)

  // Le retour suit l'ordre inverse : le châssis d'abord, son contenu ensuite.
  panels.forEach((el, i) => {
    el.classList.remove(going)
    el.style.setProperty('--rm-d', `${i * 60}ms`)
    el.classList.add(back)
  })
  await wait(panels.length * 60 + 420)

  order.forEach((el, i) => {
    el.classList.remove(going)
    el.style.setProperty('--rm-d', `${(order.length - 1 - i) * 14}ms`)
    el.classList.add(back)
  })
  await wait(order.length * 14 + 900)
  panels.forEach((el) => {
    el.classList.remove(back)
    for (const name of VARS) el.style.removeProperty(name)
  })
  root?.classList.remove('rm-space')
}

/**
 * La dissolution : chaque élément perd sa matière, ne laisse qu'un contour de
 * module introuvable, puis s'écrase vers le terminal. Le châssis y passe aussi
 * — supprimer `node_modules` ne ménage pas l'éditeur.
 */
async function dissolve(elements: HTMLElement[]) {
  const root = rootEl()
  root?.classList.add('rm-space')
  overlay('rm-vignette')

  // Tout part ensemble, contenu et panneaux confondus. Une version précédente
  // faisait sortir les panneaux après leur contenu : la scène se lisait en deux
  // temps, et l'effondrement perdait son unité.
  //
  // La racine ferme la marche. Sans elle il restait toujours une arête — une
  // bordure de panneau, un fond de conteneur — qu'aucune liste de sélecteurs
  // n'attrapait complètement. La faire disparaître garantit l'écran vide, quoi
  // qu'on ait oublié en chemin.
  const all = [...elements, ...collectPanels()]
  if (root) all.push(root)
  const stagger = 120 / Math.max(all.length, 1)

  all.forEach((el, i) => {
    el.style.setProperty('--rm-x', `${(Math.random() - 0.5) * 20}vw`)
    el.style.setProperty('--rm-d', `${i * stagger}ms`)
    el.classList.add('rm-dissolve')
  })

  await wait(1500)
  await wait(HOLD_MS)

  all.forEach((el, i) => {
    el.classList.remove('rm-dissolve')
    el.style.setProperty('--rm-d', `${i * stagger}ms`)
    el.classList.add('rm-install')
  })
  await wait(900)
  for (const el of all) {
    el.classList.remove('rm-install')
    for (const name of VARS) el.style.removeProperty(name)
  }
  root?.classList.remove('rm-space')
}

async function wipe(elements: HTMLElement[]) {
  elements.forEach((el, i) => {
    el.style.setProperty('--rm-d', `${i * 95}ms`)
    el.classList.add('rm-wipe')
  })
  await wait(elements.length * 95 + 500)
  await wait(HOLD_MS)
  elements.forEach((el, i) => {
    el.classList.remove('rm-wipe')
    el.style.setProperty('--rm-d', `${(elements.length - 1 - i) * 70}ms`)
    el.classList.add('rm-unwipe')
  })
  await wait(elements.length * 70 + 450)
}

async function tilt(elements: HTMLElement[]) {
  elements.forEach((el, i) => {
    el.style.setProperty('--rm-r', `${(Math.random() - 0.5) * 7}deg`)
    el.style.setProperty('--rm-x', `${(Math.random() - 0.5) * 10}px`)
    el.style.setProperty('--rm-d', `${i * 14}ms`)
    el.classList.add('rm-tilt')
  })
  await wait(elements.length * 14 + 2200)
}

/** Des copies de contour qui se multiplient, puis s'évanouissent. */
async function forkbomb(elements: HTMLElement[]) {
  const layer = overlay('rm-ghosts')
  const sources = elements.slice(0, 14)

  for (let wave = 0; wave < 4; wave++) {
    for (const source of sources) {
      const rect = source.getBoundingClientRect()
      const ghost = document.createElement('div')
      ghost.className = 'rm-ghost'
      ghost.style.left = `${rect.left}px`
      ghost.style.top = `${rect.top}px`
      ghost.style.width = `${rect.width}px`
      ghost.style.height = `${rect.height}px`
      ghost.style.setProperty('--rm-x', `${(Math.random() - 0.5) * 60}vw`)
      ghost.style.setProperty('--rm-r', `${(Math.random() - 0.5) * 60}vh`)
      ghost.style.setProperty('--rm-d', `${Math.random() * 180}ms`)
      layer.append(ghost)
    }
    await wait(260)
  }
  await wait(900)
  layer.remove()
}

const TRAIN = String.raw`
                  (@@) (  ) (@)  ( )  @@    ()    @     O     @     O      @
             (   )
         (@@@@)
      (    )

    (@@@)
    ====        ________                ___________
_D _|  |_______/        \__I_I_____===__|_________|
 |(_)---  |   H\________/ |   |        =|___ ___|      _________________
 /     |  |   H  |  |     |   |         ||_| |_||     _|                \_____A
|      |  |   H  |__--------------------| [___] |   =|                        |
| ________|___H__/__|_____/[][]~\_______|       |   -|                        |
|/ |   |-----------I_____I [][] []  D   |=======|____|________________________|_
__/ =| o |=-~~\  /~~\  /~~\  /~~\ ____Y___________|__|__________________________|_
 |/-=|___|=O=====O=====O=====O   |_____/~\___/          |_D__D__D_|  |_D__D__D_|
  \_/      \__/  \__/  \__/  \__/      \_/               \_/   \_/    \_/   \_/`

/**
 * Le train.
 *
 * Il traverse le terminal, pas la page : c'est là qu'on a tapé la commande,
 * c'est là que la punition se joue. Deux versions ont raté leur cible — l'une
 * à neuf pixels dans le journal, invisible ; l'autre en travers de l'écran,
 * hors sujet.
 *
 * Sa taille se déduit du journal : assez grand pour se lire, assez petit pour
 * que le convoi y tienne en hauteur.
 *
 * Il roule dans la zone de journal seule, pas sur tout le panneau : la version
 * précédente débordait sur la ligne de commande et sur les onglets de session,
 * ce qui donnait un calque posé de travers plutôt qu'un train sur ses rails.
 */
async function train() {
  const terminal = terminalEl()
  const log = logEl()
  if (!terminal || !log) return
  const box = log.getBoundingClientRect()

  const layer = overlay('rm-overlay')
  layer.style.cssText = `position:fixed;left:${box.left}px;top:${box.top}px;width:${box.width}px;height:${box.height}px;pointer-events:none;z-index:86;display:flex;align-items:center;overflow:hidden`

  // Le dessin fait douze lignes sur environ cent dix colonnes : la taille est
  // le plus petit des deux ajustements, sinon il déborde d'un côté.
  const size = Math.max(5, Math.min(box.height / 12, box.width / 105))
  const pre = document.createElement('pre')
  pre.textContent = TRAIN
  pre.style.cssText = `margin:0;white-space:pre;font:${size}px/1.06 ui-monospace,"SF Mono",monospace;color:var(--color-amber);text-shadow:0 0 10px rgb(245 167 66 / .4)`
  layer.append(pre)

  // Seul le terminal tremble : le reste de la page n'est pas concerné.
  terminal.classList.add('rm-shake')

  const run = pre.animate(
    [{ transform: `translateX(${box.width}px)` }, { transform: 'translateX(-105%)' }],
    { duration: 3400, easing: 'cubic-bezier(.25,.1,.4,1)' },
  )
  await run.finished.catch(() => undefined)

  terminal.classList.remove('rm-shake')
  layer.remove()
}

/**
 * Le terminal qui tente de se supprimer lui-même.
 *
 * Son journal est recopié dans un calque posé par-dessus, et c'est cette copie
 * qui se brouille caractère par caractère — le vrai texte, géré par React,
 * n'est jamais touché. Le panneau se déchire en tranches décalées pendant ce
 * temps. La version précédente se contentait de trembler ; on ne voyait pas
 * ce qu'elle racontait.
 */
const NOISE = '¡#$%&/()=?¿@£¶§∆ØΩ≈ç√∫~µ≤≥÷01'

async function selfDelete() {
  const terminal = terminalEl()
  const host = logEl()
  if (!terminal || !host) return

  const original = host.innerText
  const box = host.getBoundingClientRect()

  const layer = overlay('rm-overlay')
  layer.style.cssText = `position:fixed;left:${box.left}px;top:${box.top}px;width:${box.width}px;height:${box.height}px;pointer-events:none;z-index:86;overflow:hidden`

  const pre = document.createElement('pre')
  pre.style.cssText =
    'margin:0;padding:8px 12px;white-space:pre-wrap;font:12.5px/1.65 ui-monospace,monospace;color:var(--color-coral)'
  pre.textContent = original
  layer.append(pre)
  host.style.opacity = '0'
  terminal.classList.add('rm-glitch')

  const chars = [...original]
  const started = performance.now()
  const SCRAMBLE_MS = 900

  await new Promise<void>((resolve) => {
    const frame = (now: number) => {
      const ratio = Math.min((now - started) / SCRAMBLE_MS, 1)
      pre.textContent = chars
        .map((c) => (c === '\n' || Math.random() > ratio ? c : NOISE[(Math.random() * NOISE.length) | 0]))
        .join('')
      // La déchirure : le calque saute latéralement, par à-coups.
      pre.style.transform = `translateX(${(Math.random() - 0.5) * 14 * ratio}px)`
      if (ratio >= 1) return resolve()
      requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
  })

  // L'effondrement, puis le retour : le terminal se ressaisit.
  pre.style.transition = 'transform .25s ease-in, opacity .25s ease-in'
  pre.style.transform = 'scaleY(0.02)'
  pre.style.opacity = '0'
  await wait(320)

  terminal.classList.remove('rm-glitch')
  host.style.removeProperty('opacity')
  layer.remove()
}

/**
 * `sudo` va plus loin.
 *
 * C'est la blague : avec les droits, la suppression commence vraiment — tout
 * décroche — et c'est le fichier sudoers qui l'arrête en plein vol. Le retour
 * est sec, sans animation, comme une bande rembobinée. Un simple flash rouge
 * ne racontait rien.
 */
async function almost(elements: HTMLElement[]) {
  const root = rootEl()
  root?.classList.add('rm-space')
  root?.classList.add('rm-shake')

  const order = [...elements].sort(
    (a, b) => b.getBoundingClientRect().top - a.getBoundingClientRect().top,
  )
  order.forEach((el, i) => {
    aim(el, i * 8)
    el.classList.add('rm-fall')
  })

  await wait(620)

  // Coupure nette : on retire les classes sans animation de retour.
  overlay('rm-flash')
  for (const el of order) {
    el.classList.remove('rm-fall')
    for (const name of VARS) el.style.removeProperty(name)
  }
  root?.classList.remove('rm-shake', 'rm-space')
  await wait(700)
}

/* Katakana en demi-chasse, chiffres et quelques signes : le jeu d'origine. */
const GLYPHS = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789:･."=*+-<>¦'

const glyph = () => GLYPHS[(Math.random() * GLYPHS.length) | 0]

interface Column {
  /** Position de la tête, en lignes. Fractionnaire : chaque colonne a sa vitesse. */
  head: number
  speed: number
  /** Le caractère de tête, qui mute plus souvent que le reste. */
  char: string
}

/**
 * La pluie.
 *
 * La traînée n'est pas dessinée caractère par caractère : à chaque image, un
 * voile noir presque transparent recouvre l'ensemble, ce qui efface le passé
 * par degrés. Il ne reste donc qu'un `fillText` par colonne et par image, et
 * la traînée vient gratuitement — c'est ce qui permet de tenir le plein écran
 * à soixante images par seconde.
 *
 * Ce qui fait la différence avec une pluie verte quelconque : la tête est
 * presque blanche et porte un halo, la ligne juste derrière est d'un vert vif,
 * et le reste s'éteint. Sans ce dégradé de trois valeurs, on ne lit qu'un
 * rideau uniforme.
 */
async function matrix() {
  const layer = overlay('rm-overlay')
  layer.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:80'

  // Le fond doit être presque opaque : la pluie ne se lit pas par-dessus une
  // page éclairée, et l'original se joue sur du noir.
  const backdrop = document.createElement('div')
  backdrop.style.cssText =
    'position:absolute;inset:0;background:#040705;opacity:0;transition:opacity .5s ease'
  layer.append(backdrop)
  requestAnimationFrame(() => {
    backdrop.style.opacity = '0.94'
  })

  const canvas = document.createElement('canvas')
  const width = window.innerWidth
  const height = window.innerHeight
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  canvas.width = width * dpr
  canvas.height = height * dpr
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%'
  layer.append(canvas)

  const context = canvas.getContext('2d', { alpha: true })
  if (!context) {
    layer.remove()
    return
  }
  context.scale(dpr, dpr)

  // Le lapin a son propre calque : React s'en occupe, la pluie reste en 2D.
  const stage = document.createElement('div')
  stage.style.cssText = 'position:absolute;inset:0;pointer-events:none'
  layer.append(stage)
  const [{ createRoot }, { createElement }, rabbit] = await Promise.all([
    import('react-dom/client'),
    import('react'),
    import('@/components/three/WhiteRabbit'),
  ])
  const root = createRoot(stage)
  root.render(createElement(rabbit.default))

  const size = 16
  const rows = Math.ceil(height / size)
  const columns: Column[] = Array.from({ length: Math.ceil(width / size) }, () => ({
    head: -Math.random() * rows,
    speed: 0.35 + Math.random() * 0.55,
    char: glyph(),
  }))

  const started = performance.now()
  const DURATION_MS = 7000

  await new Promise<void>((resolve) => {
    const frame = (now: number) => {
      const age = now - started
      // Le voile : plus il est opaque, plus la traînée est courte.
      context.fillStyle = 'rgba(4, 7, 5, 0.075)'
      context.fillRect(0, 0, width, height)
      context.font = `${size}px ui-monospace, "SF Mono", monospace`
      context.textBaseline = 'top'

      for (let i = 0; i < columns.length; i++) {
        const column = columns[i]
        const x = i * size
        const y = Math.floor(column.head) * size

        if (y > -size && y < height) {
          // Un cran derrière la tête, en vert vif : c'est ce qui donne
          // l'impression que le caractère vient d'être frappé.
          context.shadowBlur = 0
          context.fillStyle = '#4fd67a'
          context.fillText(column.char, x, y - size)

          context.shadowBlur = 10
          context.shadowColor = '#7ec699'
          context.fillStyle = '#dcffe6'
          context.fillText(glyph(), x, y)
          context.shadowBlur = 0
        }

        column.head += column.speed
        if (Math.random() > 0.94) column.char = glyph()
        // Une colonne repart d'en haut à un moment imprévisible : sans ce
        // hasard, toutes retomberaient en cadence et la pluie se verrait.
        if (y > height && Math.random() > 0.975) {
          column.head = -Math.random() * 12
          column.speed = 0.35 + Math.random() * 0.55
        }
      }

      if (age > DURATION_MS) return resolve()
      requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
  })

  // Démonter React avant de retirer le calque : sinon le contexte WebGL reste
  // vivant et la carte graphique garde une scène que plus personne ne regarde.
  backdrop.style.opacity = '0'
  canvas.style.transition = 'opacity .45s ease'
  canvas.style.opacity = '0'
  await wait(480)
  root.unmount()
  layer.remove()
}

const BAR = (ratio: number) => {
  const width = 28
  const filled = Math.round(width * ratio)
  return `[${'█'.repeat(filled)}${'░'.repeat(width - filled)}] ${Math.round(ratio * 100)}%`
}

async function progress(push: (batch: readonly EggLine[]) => void) {
  for (const step of [0.18, 0.42, 0.61, 0.63, 0.64, 0.97, 1]) {
    push([{ kind: 'out', text: BAR(step) }])
    // Le palier à 63 % est la blague : tout le monde l'a déjà vécu.
    await wait(step > 0.6 && step < 0.7 ? 620 : 280)
  }
}

/* ── Orchestration ─────────────────────────────────────────────────────── */

export interface PlayContext {
  readonly push: (batch: readonly EggLine[]) => void
  readonly setFrozen: (frozen: boolean) => void
}

export interface PlayResult {
  /** Faux quand la cible n'est pas à l'écran : le terminal répond alors comme `rm`. */
  readonly played: boolean
}

export async function playEgg(
  animation: Animation,
  context: PlayContext,
  section?: string,
): Promise<PlayResult> {
  if (animation === 'none') return { played: true }

  if (animation === 'wipe' && section) await bringIntoView(section)

  const elements =
    animation === 'wipe'
      ? collectSection(section ?? '')
      : ['fall', 'levitate', 'vortex', 'tilt', 'forkbomb', 'dissolve', 'flash'].includes(animation)
        ? collectPieces()
        : []

  if (animation === 'wipe' && elements.length === 0) return { played: false }

  // Le mouvement disparaît, le texte reste : la blague survit sans secouer
  // quelqu'un que le mouvement gêne.
  if (window.matchMedia(REDUCED).matches) {
    if (animation === 'progress') await progress(context.push)
    return { played: true }
  }

  const safety = setTimeout(() => cleanup(elements), SAFETY_MS)

  try {
    switch (animation) {
      case 'fall':
      case 'levitate':
      case 'vortex':
        await depart(elements, animation)
        break
      case 'wipe':
        await wipe(elements)
        break
      case 'dissolve':
        await dissolve(elements)
        break
      case 'tilt':
        await tilt(elements)
        break
      case 'forkbomb':
        await forkbomb(elements)
        break
      case 'glitch':
        await selfDelete()
        break
      case 'shake':
        rootEl()?.classList.add('rm-shake')
        await wait(700)
        break
      case 'exit':
        terminalEl()?.classList.add('rm-exit')
        await wait(1550)
        break
      case 'flash':
        await almost(elements)
        break
      case 'blackout':
        overlay('rm-blackout')
        await wait(1550)
        break
      case 'train':
        await train()
        break
      case 'matrix':
        await matrix()
        break
      case 'progress':
        await progress(context.push)
        break
      case 'freeze':
        context.setFrozen(true)
        await wait(2100)
        break
    }
    return { played: true }
  } finally {
    clearTimeout(safety)
    context.setFrozen(false)
    cleanup(elements)
  }
}
