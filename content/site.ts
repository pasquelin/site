import type { Lang, Social } from './types'

/**
 * Change this one line the day the domain moves. Everything follows: canonical
 * tags, hreflang, the sitemap, the JSON-LD graph, llms.txt and cv.json.
 *
 * `www` is the canonical host, and the apex redirects to it — the same choice
 * as aidesktopstudio.com. A site has one address; serving the same pages on
 * both would split its authority between them.
 */
export const SITE_URL = 'https://www.pasquelin.com'

export const LANGS = ['fr', 'en'] as const satisfies readonly Lang[]
export const DEFAULT_LANG: Lang = 'fr'

export const PERSON = {
  name: 'Alban Pasquelin',
  givenName: 'Alban',
  familyName: 'Pasquelin',
  city: 'La Chapelle-Réanville',
  region: 'Eure',
  postalCode: '27950',
  country: 'FR',
  email: 'alban.pasquelin@gmail.com',
  phone: '+33 6 28 13 36 23',
  avatar: 'https://avatars.githubusercontent.com/u/74621260?v=4',
} as const

/**
 * Two things from the CV that are a business decision rather than a technical
 * one, so they are switches instead of hard-coded markup: a phone number on a
 * public page attracts cold calls, and published rates set an anchor before a
 * conversation starts. Flip either to `false` and it disappears everywhere.
 */
export const SHOW_PHONE = true
export const SHOW_RATES = true

export const RATES = {
  fr: { fr: '750 – 850 € / jour', en: '€750 – 850 per day' },
  ch: { fr: 'CHF 1 000 – 1 150 / jour', en: 'CHF 1,000 – 1,150 per day' },
  remote: { fr: '90 – 110 $ / heure', en: '$90 – 110 per hour' },
} as const

export const RATE_LABELS = {
  fr: { fr: 'France', en: 'France' },
  ch: { fr: 'Suisse', en: 'Switzerland' },
  remote: { fr: 'Remote international', en: 'Remote international' },
} as const

/**
 * Every profile that points back at the same person. This list becomes
 * `sameAs` in the JSON-LD graph, which is how a language model works out that
 * these accounts are one entity rather than several people.
 */
export const SOCIALS: readonly Social[] = [
  { id: 'github', label: 'GitHub', url: 'https://github.com/pasquelin', sameAs: true },
  { id: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/in/alban-pasquelin/', sameAs: true },
  { id: 'malt', label: 'Malt', url: 'https://www.malt.fr/profile/albanpasquelin', sameAs: true },
  { id: 'x', label: 'X', url: 'https://x.com/wubart', sameAs: true },
  { id: 'aids', label: 'AI Desktop Studio', url: 'https://www.aidesktopstudio.com', sameAs: true },
]

export const COMPANIES = {
  gosecure: { name: 'GoSecure', url: 'https://gosecure.fr' },
  retroroads: { name: 'RetroRoads', url: 'https://retroroads.fr' },
} as const

/**
 * Where the contact form posts.
 *
 * Same origin: nginx hands `/api/contact` to a small relay on the server's
 * loopback, which passes the message to Mailcow. No third party ever sees a
 * prospect's message.
 *
 * Set `NEXT_PUBLIC_CONTACT_ENDPOINT` to an empty string and the form falls
 * back to opening the visitor's mail client — which is what it did before the
 * relay existed, and which is worth nothing on a machine with no mail client
 * configured. The relay is the real answer; the fallback is only a net.
 */
export const CONTACT_ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT ?? '/api/contact'

export const AVAILABILITY = {
  open: true,
  when: {
    fr: 'Immédiatement, temps plein',
    en: 'Immediately, full time',
  },
  zones: {
    fr: [
      'Paris et Île-de-France — sur site ou hybride',
      'Rouen',
      'Suisse romande — facturation suisse en place',
      'Remote Europe',
    ],
    en: [
      'Paris and Île-de-France — on site or hybrid',
      'Rouen',
      'French-speaking Switzerland — Swiss invoicing in place',
      'Remote across Europe',
    ],
  },
} as const
