import type { I18n, SceneKey } from './types'

/**
 * Every scene carries a written caption.
 *
 * The caption is in the DOM before any WebGL loads, so it is what a crawler
 * reads, what a screen reader announces, and what someone sees when motion is
 * reduced. It also does the real work for a non-technical reader: the
 * animation is a diagram, and a diagram needs a legend.
 */
export interface SceneMeta {
  readonly title: I18n
  readonly caption: I18n
}

export const SCENES: Record<SceneKey, SceneMeta> = {
  convergence: {
    title: { fr: 'Trois systèmes, une base de code', en: 'Three systems, one codebase' },
    caption: {
      fr: "Trois flux de code séparés — Android TV, WebOS, WPE — fusionnent en un flux unique qui alimente les trois box. Le marqueur orange est une insertion publicitaire SCTE-35 remplacée pendant la diffusion.",
      en: 'Three separate code streams — Android TV, WebOS, WPE — merge into a single stream feeding all three boxes. The amber marker is an SCTE-35 ad insertion swapped mid-broadcast.',
    },
  },
  alertNetwork: {
    title: { fr: 'Une alerte, en quelques secondes', en: 'An alert, within seconds' },
    caption: {
      fr: "Une alerte part d'un point du territoire et se propage aux intervenants les plus proches. Chaque anneau est un accusé de réception : le système ne considère l'alerte transmise que lorsqu'un humain l'a acceptée.",
      en: 'An alert leaves one point on the territory and propagates to the nearest responders. Each ring is an acknowledgement: the system only counts an alert as delivered once a human accepts it.',
    },
  },
  migration: {
    title: { fr: 'Migrer sans couper la production', en: 'Migrating without downtime' },
    caption: {
      fr: "Chaque carré est un écran du CMS. Ils passent de Vue à React un par un, pendant que la barre du bas — la disponibilité du service — ne bouge jamais.",
      en: 'Each square is one CMS screen. They move from Vue to React one at a time while the bar at the bottom — service availability — never moves.',
    },
  },
  mcpConstellation: {
    title: { fr: '310 actions, 26 familles', en: '310 actions, 26 families' },
    caption: {
      fr: "Chaque point est une action qu'un agent peut déclencher, groupée par famille. Le tracé cyan est un agent qui enchaîne les actions : ouvrir, générer, appliquer, exporter.",
      en: 'Each point is an action an agent can trigger, grouped by family. The cyan trace is an agent chaining actions: open, generate, apply, export.',
    },
  },
  panelChassis: {
    title: { fr: 'Le châssis se démonte', en: 'The chassis comes apart' },
    caption: {
      fr: "Les zones d'une application outil — rails, panneaux, centre — se séparent puis se réassemblent. C'est tout ce que fait la bibliothèque, en 8 kB.",
      en: 'The zones of a tool application — rails, panels, centre — come apart and reassemble. That is everything the library does, in 8 kB.',
    },
  },
  timelineDepth: {
    title: { fr: 'Les pistes se composent', en: 'Tracks compose' },
    caption: {
      fr: "Vidéo, texte, autocollants, transitions : chaque piste est un plan, et l'export les aplatit en une seule image animée.",
      en: 'Video, text, stickers, transitions: each track is a plane, and the export flattens them into one moving image.',
    },
  },
  codeCube: {
    title: { fr: 'Un monde fait de cubes', en: 'A world made of cubes' },
    caption: {
      fr: "Les blocs qui composent le monde du jeu se rassemblent, puis se dispersent — la géométrie même du moteur.",
      en: 'The blocks the game world is made of gather, then scatter — the engine\'s own geometry.',
    },
  },
}
