/**
 * Verifie le script partage `public/shared/consent.v1.js`, celui que les autres depots
 * chargent depuis ce site.
 *
 * Il est execute ici dans un DOM simule reduit a ce qu'il touche vraiment, plutot que teste
 * a la main dans un navigateur : ce fichier est servi a quatre sites qui ne le compilent pas
 * et ne le relisent pas, et une regression y passerait inapercue jusqu'a la production.
 *
 * Ce qui compte et que ces cas gardent : rien ne part chez Google avant un accord, refuser
 * efface, et le panneau prend les couleurs de la page qui l'accueille.
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { runInNewContext } from 'node:vm'
import { join } from 'node:path'

const SOURCE = readFileSync(join(import.meta.dirname, '../public/shared/consent.v1.js'), 'utf8')

type Node = {
  tagName: string
  style: { cssText: string }
  children: Node[]
  attributes: Record<string, string>
  textContent: string
  src?: string
  lang?: string
  dir?: string
  parentNode: Node | null
  setAttribute(name: string, value: string): void
  getAttribute(name: string): string | null
  hasAttribute(name: string): boolean
  appendChild(child: Node): Node
  removeChild(child: Node): Node
  addEventListener(type: string, handler: () => void): void
  click(): void
}

function element(tagName: string): Node {
  const handlers: Record<string, Array<() => void>> = {}
  const node: Node = {
    tagName,
    style: { cssText: '' },
    children: [],
    attributes: {},
    textContent: '',
    parentNode: null,
    setAttribute(name, value) { node.attributes[name] = value },
    getAttribute(name) { return name in node.attributes ? node.attributes[name] : null },
    hasAttribute(name) { return name in node.attributes },
    appendChild(child) { node.children.push(child); child.parentNode = node; return child },
    removeChild(child) {
      node.children = node.children.filter((one) => one !== child)
      child.parentNode = null
      return child
    },
    addEventListener(type, handler) { (handlers[type] ??= []).push(handler) },
    click() { for (const handler of handlers.click ?? []) handler() },
  }
  return node
}

type Page = {
  /** L'attribut `lang` de `<html>`, qui decide de la langue du panneau. */
  lang?: string
  /** Le cookie de choix deja pose, s'il y en a un. */
  choice?: 'granted' | 'denied'
  /** L'identifiant passe en `data-ga`. */
  ga?: string | null
  /** Le rendu que `getComputedStyle` renverra pour la page. */
  style?: { backgroundColor?: string; color?: string; fontFamily?: string; borderRadius?: string }
}

type World = {
  /** Les balises ajoutees au `<head>` : c'est la que gtag.js apparaitrait. */
  head: Node[]
  /** Le panneau, s'il est affiche. */
  panel: () => Node | undefined
  /** Les cookies, apres coup. */
  cookies: Record<string, string>
  /** Les ordres empiles pour gtag, dans l'ordre. */
  orders: unknown[][]
  reloaded: () => boolean
}

function run(page: Page = {}): World {
  const html = element('html')
  /* `lang` et `dir` sont des proprietes reelles en navigateur, jamais `undefined` : le stub
     les expose comme telles pour ne pas rendre le script plus tolerant qu'il n'a besoin. */
  html.lang = page.lang ?? 'en'
  html.dir = ''
  const body = element('body')
  const head = element('head')
  const script = element('script')
  if (page.ga !== null) script.setAttribute('data-ga', page.ga ?? 'G-TESTID0001')

  const cookies: Record<string, string> = {}
  if (page.choice) cookies['site-analytics'] = page.choice
  let reloaded = false

  const computed = {
    backgroundColor: page.style?.backgroundColor ?? 'rgb(12, 13, 15)',
    color: page.style?.color ?? 'rgb(230, 232, 236)',
    fontFamily: page.style?.fontFamily ?? 'Archivo, sans-serif',
    borderRadius: page.style?.borderRadius ?? '0px',
    getPropertyValue: () => '',
  }

  const document = {
    /* Le script attend la peinture de la page ; dans ces cas elle a deja eu lieu. */
    readyState: 'complete',
    currentScript: script,
    documentElement: html,
    body,
    head,
    querySelector: () => null,
    querySelectorAll: () => [] as Node[],
    createElement: element,
    addEventListener: () => {},
    get cookie() {
      return Object.entries(cookies).map(([name, value]) => `${name}=${value}`).join('; ')
    },
    set cookie(raw: string) {
      const [pair, ...rest] = raw.split('; ')
      const index = pair.indexOf('=')
      const name = pair.slice(0, index)
      if (rest.some((part) => /^Max-Age=0$/i.test(part))) delete cookies[name]
      else cookies[name] = pair.slice(index + 1)
    },
  }

  const context = {
    document,
    getComputedStyle: () => computed,
    setTimeout: (fn: () => void) => fn(),
    matchMedia: () => ({ matches: false }),
    location: {
      hostname: 'www.example.com',
      protocol: 'https:',
      origin: 'https://www.example.com',
      pathname: '/page/',
      reload: () => { reloaded = true },
    },
    encodeURIComponent,
    Math,
    Date,
    isNaN,
    parseFloat,
    String,
    RegExp,
  } as Record<string, unknown>
  context.window = context

  runInNewContext(SOURCE, context)

  return {
    head: head.children,
    panel: () => body.children.find((child) => child.attributes.role === 'dialog'),
    cookies,
    orders: ((context.dataLayer ?? []) as unknown[]).map((one) => Array.from(one as ArrayLike<unknown>)),
    reloaded: () => reloaded,
  }
}

test('sans choix, rien n’est demande a Google et le panneau s’affiche', () => {
  const world = run()
  assert.equal(world.head.length, 0, 'aucune balise ne doit etre ajoutee au head')
  assert.ok(world.panel(), 'le panneau doit etre affiche')
  assert.deepEqual(world.orders[0]?.[0], 'consent')
  assert.deepEqual(world.orders[0]?.[1], 'default')
  assert.equal((world.orders[0]?.[2] as Record<string, string>).analytics_storage, 'denied')
})

test('apres un refus, rien n’est charge et le panneau ne revient pas', () => {
  const world = run({ choice: 'denied' })
  assert.equal(world.head.length, 0)
  assert.equal(world.panel(), undefined)
})

test('apres un accord, gtag.js est charge avec l’identifiant du site', () => {
  const world = run({ choice: 'granted', ga: 'G-ABC1234567' })
  assert.equal(world.head.length, 1)
  assert.match(world.head[0].src ?? '', /googletagmanager\.com\/gtag\/js\?id=G-ABC1234567$/)
  assert.equal(world.panel(), undefined, 'le choix etant fait, le panneau reste ferme')
  const config = world.orders.find((one) => one[0] === 'config')
  assert.equal((config?.[2] as Record<string, string>).page_location, 'https://www.example.com/page/',
    'l’URL envoyee est nettoyee de ses parametres')
})

test('un identifiant absent ou mal forme ne declenche rien', () => {
  for (const ga of [null, '', 'UA-12345-1', 'G-abc'] as Array<string | null>) {
    const world = run({ ga })
    assert.equal(world.head.length, 0, `aucun chargement pour ${JSON.stringify(ga)}`)
    assert.equal(world.panel(), undefined, `aucun panneau pour ${JSON.stringify(ga)}`)
  }
})

test('accepter pose le cookie de choix et charge la mesure', () => {
  const world = run()
  const panel = world.panel()
  const [refuser, accepter] = panel!.children.at(-1)!.children
  assert.ok(refuser && accepter)
  accepter.click()
  assert.equal(world.cookies['site-analytics'], 'granted')
  assert.equal(world.head.length, 1)
  assert.equal(world.panel(), undefined, 'le panneau se ferme apres le choix')
})

test('refuser pose le cookie, ne charge rien et ne recharge pas la page', () => {
  const world = run()
  const panel = world.panel()
  panel!.children.at(-1)!.children[0].click()
  assert.equal(world.cookies['site-analytics'], 'denied')
  assert.equal(world.head.length, 0)
  assert.equal(world.reloaded(), false, 'rien n’etait charge : inutile de recharger')
})

test('le panneau parle la langue de la page, anglais pour une langue inconnue', () => {
  const titre = (lang: string) => run({ lang }).panel()!.children[0].textContent
  assert.equal(titre('fr'), 'Mesure d’audience')
  assert.equal(titre('ja'), 'アクセス解析')
  assert.equal(titre('pt-BR'), 'Medição de audiência')
  assert.equal(titre('sv'), 'Audience measurement')
})

test('les couleurs du panneau viennent de la page', () => {
  const sombre = run({ style: { backgroundColor: 'rgb(12, 13, 15)', color: 'rgb(230, 232, 236)' } })
  assert.match(sombre.panel()!.style.cssText, /color-scheme:dark/)

  const clair = run({ style: { backgroundColor: 'rgb(255, 255, 255)', color: 'rgb(20, 20, 20)' } })
  const style = clair.panel()!.style.cssText
  assert.match(style, /color-scheme:light/)
  assert.match(style, /color:rgb\(20,20,20\)/, 'le texte reprend celui de la page')
  assert.doesNotMatch(style, /background:rgb\(12,13,15\)/, 'aucune couleur codee en dur')
})

test('la police et l’arrondi du site sont repris', () => {
  const world = run({ style: { fontFamily: 'IBM Plex Sans, sans-serif' } })
  assert.match(world.panel()!.style.cssText, /font-family:IBM Plex Sans, sans-serif/)
})
