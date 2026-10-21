/**
 * Content core — the single source of truth for the whole site.
 *
 * Everything the site produces is derived from this module: the rendered
 * pages, the JSON-LD graph, `llms.txt`, `llms-full.txt`, `cv.json` and the
 * sitemap. Nothing is written twice, so nothing can drift.
 */

export type Lang = 'fr' | 'en'

/** A string that exists in both languages. */
export type I18n = Readonly<Record<Lang, string>>

/** A list of strings that exists in both languages. */
export type I18nList = Readonly<Record<Lang, readonly string[]>>

export interface Period {
  /** Four-digit start year. */
  readonly from: number
  /** Four-digit end year, or `'present'` for ongoing work. */
  readonly to: number | 'present'
}

/** A quantified outcome. Recruiters read these before they read anything else. */
export interface Metric {
  /** The number itself, pre-formatted: `'1'`, `'310'`, `'8 kB'`. */
  readonly value: string
  readonly label: I18n
  /**
   * Where the proof lives, without the language segment, e.g.
   * `experience/tf1-edito`. A number nobody can click is a claim; a number
   * that leads to its mission is evidence.
   */
  readonly path?: string
}

/** A link to the page that backs a claim. */
export interface ProofLink {
  /** Path without the language segment, e.g. `experience/gosecure`. */
  readonly path: string
  readonly label: I18n
}

/**
 * A problem a client has on the day they call, in their words, followed by
 * what was done about it elsewhere and how it turned out.
 */
export interface Situation {
  readonly title: I18n
  readonly body: I18n
  readonly proof: readonly ProofLink[]
}

/** An engagement format: what is bought, how long, how it is billed. */
export interface Engagement {
  readonly title: I18n
  readonly body: I18n
}

/**
 * Someone who worked with Alban, quoted from a public recommendation. The
 * original wording is kept; the other language is a labelled translation.
 */
export interface Testimonial {
  /** The language the recommendation was written in. */
  readonly original: Lang
  readonly quote: I18n
  /** As displayed on the source, initial included. */
  readonly author: string
  readonly role: I18n
  readonly source: string
  readonly url: string
  readonly year: number
}

export interface Experience {
  readonly slug: string
  readonly company: string
  readonly role: I18n
  readonly period?: Period
  /** Rendered as the TypeScript signature in dev mode. */
  readonly fn: string
  /**
   * One statement per paragraph of `body`, in order. The prose becomes the
   * comment above the line that carries it out, so the page reads as a
   * function doing the work rather than as a paragraph in disguise.
   */
  readonly code?: readonly string[]
  /**
   * One self-contained sentence, factual and dated. This is the sentence a
   * language model will quote, so it has to survive being lifted out of the
   * page on its own.
   */
  readonly answer: I18n
  /** Plain-language body. Each entry is a paragraph. No jargon without a gloss. */
  readonly body: I18nList
  readonly metrics: readonly Metric[]
  readonly stack: readonly string[]
  /** Key of the Three.js scene that visualises this mission. */
  readonly scene?: SceneKey
  readonly url?: string
}

export interface Project {
  readonly slug: string
  readonly name: string
  /** When work on it started, as written on the CV. */
  readonly since?: I18n
  /** Published package name, when there is one. */
  readonly npm?: string
  readonly tagline: I18n
  /** Rendered as the TypeScript signature in dev mode. */
  readonly fn: string
  readonly answer: I18n
  /**
   * Description pour les résultats de recherche, quand `answer` est trop
   * longue pour ce rôle. Sans elle, `answer` sert des deux.
   */
  readonly meta?: I18n
  readonly body: I18nList
  /** One statement per paragraph of `body`, in order. */
  readonly code?: readonly string[]
  readonly metrics: readonly Metric[]
  readonly stack: readonly string[]
  readonly repo: string
  readonly demo?: string
  readonly license?: string
  readonly scene?: SceneKey
}

export type SceneKey =
  | 'codeCube'
  | 'convergence'
  | 'alertNetwork'
  | 'mcpConstellation'
  | 'panelChassis'
  | 'timelineDepth'
  | 'migration'

export interface Award {
  readonly title: string
  readonly year?: number
  readonly by: string
  /** What the award rewards and for which work, for someone who has never heard of it. */
  readonly note?: I18n
}

export interface Social {
  readonly id: string
  readonly label: string
  readonly url: string
  /** Feeds `sameAs` in the JSON-LD Person graph — entity reconciliation. */
  readonly sameAs: boolean
}
