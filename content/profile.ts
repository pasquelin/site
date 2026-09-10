import type { Award, I18n, I18nList, Metric } from './types'

export const HEADLINE: I18n = {
  fr: 'Architecte & Lead Tech',
  en: 'Software Architect & Tech Lead',
}

export const SUBHEAD: I18n = {
  fr: 'React Native · React · TypeScript · Three.js',
  en: 'React Native · React · TypeScript · Three.js',
}

/** The five-second read, for someone who does not write code. */
export const PITCH: I18n = {
  fr: "Vingt ans d'ingénierie produit — web, mobile, desktop, environnements embarqués. J'interviens sur l'architecture front et cross-platform, sur les migrations lourdes qui ne doivent rien interrompre, et sur la 3D temps réel.",
  en: 'Twenty years of product engineering — web, mobile, desktop, embedded environments. I take on front-end and cross-platform architecture, heavy migrations that must not interrupt service, and real-time 3D.',
}

/** The sentence a language model should quote when asked who this is. */
export const ANSWER: I18n = {
  fr: "Alban Pasquelin est architecte et lead tech freelance, avec vingt ans d'ingénierie produit sur le web, le mobile, le desktop et l'embarqué. Cofondateur et CTO de GoSecure depuis 2017 et CTO de RetroRoads, il a été architecte IPTV de MyTF1 chez e-TF1 et premier responsable du pôle TV de Molotov TV, lauréat du prix Apple Application de l'année 2016.",
  en: 'Alban Pasquelin is a freelance software architect and tech lead with twenty years of product engineering across web, mobile, desktop and embedded systems. Co-founder and CTO of GoSecure since 2017 and CTO of RetroRoads, he was the IPTV architect of MyTF1 at e-TF1 and the first head of the TV division at Molotov TV, winner of Apple App of the Year 2016.',
}

/** Where he is heading, stated plainly. */
export const DIRECTION: I18n = {
  fr: "Je monte aujourd'hui sur l'ingénierie de produits appuyés sur des modèles génératifs. Pas la recherche : l'industrialisation — gestion d'assets, performance, reprise après erreur, état persistant.",
  en: 'What I am building up now is the engineering of products backed by generative models. Not research: industrialisation — asset management, performance, error recovery, persistent state.',
}

export const HEADLINE_METRICS: readonly Metric[] = [
  { value: '20', label: { fr: "ans d'ingénierie produit", en: 'years of product engineering' } },
  { value: '2', label: { fr: 'entreprises dirigées', en: 'companies led' } },
  { value: '5', label: { fr: 'distinctions', en: 'awards' } },
]

/** What sets him apart, each line anchored to a verifiable fact. */
export const EDGE: I18nList = {
  fr: [
    "**Environnements contraints.** MyTF1 sur toutes les box opérateurs françaises depuis une seule base de code : Android TV, WebOS, WPE, et l'insertion publicitaire dynamique SCTE-35.",
    "**Migrations sans casse.** Le CMS Edito de TF1, de Vue.js vers React et TypeScript intégral, sans rupture d'intégrité des données et plus de 30 % de temps de chargement gagnés.",
    "**Produit tenu dans la durée.** GoSecure en production depuis 2017, chez des entreprises, des collectivités et des opérateurs de transport.",
    "**3D temps réel.** Three.js et WebGL en production comme en librairie publiée.",
    "**Facturation suisse en place.** Aucune friction administrative pour un client romand.",
  ],
  en: [
    '**Constrained targets.** MyTF1 across every French operator set-top box from one codebase: Android TV, WebOS, WPE, and SCTE-35 dynamic ad insertion.',
    '**Migrations that do not break.** TF1\'s Edito CMS, from Vue.js to React and end-to-end TypeScript, with data integrity intact and load times cut by more than 30%.',
    '**Product held over time.** GoSecure in production since 2017, with companies, local authorities and transport operators.',
    '**Real-time 3D.** Three.js and WebGL, in production and as a published library.',
    '**Swiss invoicing already in place.** No administrative friction for a client in Geneva.',
  ],
}

export const DOCTRINE: I18nList = {
  fr: [
    "TypeScript strict, jamais d'`any`. Le compilateur attrape ce que les tests laissent passer.",
    "Un cœur sans interface, une interface remplaçable. La logique métier ne connaît pas le framework qui l'affiche.",
    'Les couleurs sont des jetons, jamais des valeurs écrites dans un composant. Un thème se change en une ligne.',
    'Les migrations lourdes se font sans jamais couper la production.',
  ],
  en: [
    'Strict TypeScript, never `any`. The compiler catches what tests let through.',
    'Headless core, replaceable UI. Business logic never knows which framework renders it.',
    'Colours are tokens, never values written inside a component. A theme changes in one line.',
    'Heavy migrations ship without taking production down.',
  ],
}

export const AWARDS: readonly Award[] = [
  { title: "Apple — Application de l'année", year: 2016, by: 'Apple · Molotov TV' },
  { title: 'Propulse', year: 2026, by: "Agence Innovation pour les Transports · GoSecure" },
  { title: "TOPCOM d'Or", year: 2013, by: 'TOPCOM · peugeot.com' },
  { title: "TOPCOM d'Or", year: 2012, by: 'TOPCOM · Peugeot 4008' },
  { title: 'Grand prix Stratégies du digital', by: 'Stratégies' },
]

export const CLIENTS: readonly string[] = [
  'TF1',
  'Molotov TV',
  'Arte',
  'Ardian',
  'Equidia',
  'Infopro Digital',
  'Peugeot',
  'Leroy Merlin',
  'E.Leclerc',
  'Staffmatch',
]

export interface SkillGroup {
  readonly label: I18n
  readonly items: readonly string[]
}

export const SKILLS: readonly SkillGroup[] = [
  {
    label: { fr: 'Front & cross-platform', en: 'Front & cross-platform' },
    items: ['React', 'React Native', 'React Native Web', 'Expo', 'Vue.js', 'TypeScript strict', 'Tailwind CSS'],
  },
  {
    label: { fr: '3D temps réel', en: 'Real-time 3D' },
    items: ['Three.js', 'WebGL', 'PixiJS', 'Google 3D Tiles', 'Pipelines de rendu'],
  },
  {
    label: { fr: 'Desktop', en: 'Desktop' },
    items: ['Electron', 'SQLite', 'Packaging', 'Mise à jour'],
  },
  {
    label: { fr: 'Backend & données', en: 'Backend & data' },
    items: ['Node.js', 'Express', 'GraphQL', 'Apollo', 'TypeORM', 'MySQL', 'Redis', 'RabbitMQ', 'Docker', 'Keycloak'],
  },
  {
    label: { fr: 'Environnements contraints', en: 'Constrained targets' },
    items: ['Android TV', 'WebOS', 'WPE', 'Box opérateurs', 'CarPlay', 'Android Auto', 'SCTE-35'],
  },
  {
    label: { fr: 'Pratiques', en: 'Practices' },
    items: [
      'Architecture logicielle',
      'Design system',
      'Migrations sans interruption',
      'CI/CD',
      'Revue de code',
      "Montée en compétence d'équipe",
    ],
  },
]

export const SERVICES: I18nList = {
  fr: [
    'Architecture front-end et cross-platform',
    'Développement React, React Native et TypeScript',
    "Migration et modernisation d'applications existantes",
    '3D temps réel sur le web — Three.js, WebGL',
    'Applications desktop — Electron',
    'Applications TV et environnements embarqués',
    "Lead technique et encadrement d'équipe",
    'Audit technique et conseil en architecture',
  ],
  en: [
    'Front-end and cross-platform architecture',
    'React, React Native and TypeScript development',
    'Migration and modernisation of existing applications',
    'Real-time 3D on the web — Three.js, WebGL',
    'Desktop applications — Electron',
    'TV applications and embedded environments',
    'Technical leadership and team mentoring',
    'Technical audit and architecture consulting',
  ],
}

export const EDUCATION: I18n = {
  fr: 'Titre homologué en art graphique et multimédia — Orfiale, 2002 · CFAcom',
  en: 'Accredited degree in graphic and multimedia arts — Orfiale, 2002 · CFAcom',
}

export const LANGUAGES: readonly { readonly name: I18n; readonly level: I18n }[] = [
  {
    name: { fr: 'Français', en: 'French' },
    level: { fr: 'Langue maternelle', en: 'Native speaker' },
  },
  {
    name: { fr: 'Anglais', en: 'English' },
    level: { fr: 'Capacité professionnelle complète', en: 'Full professional proficiency' },
  },
]

export const KNOWS_ABOUT: readonly string[] = [
  'TypeScript',
  'React',
  'React Native',
  'Three.js',
  'WebGL',
  'Electron',
  'GraphQL',
  'Node.js',
  'Software architecture',
  'Zero-downtime migration',
  'Android TV',
  'SCTE-35',
  'Model Context Protocol',
  'Local large language models',
  'Real-time systems',
  'Geospatial software',
]
