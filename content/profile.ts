import type { Award, Engagement, I18n, I18nList, Metric, Situation, Testimonial } from './types'

export const HEADLINE: I18n = {
  fr: 'Architecte et lead tech freelance',
  en: 'Freelance software architect and tech lead',
}

export const SUBHEAD: I18n = {
  fr: 'React Native · React · TypeScript · Three.js',
  en: 'React Native · React · TypeScript · Three.js',
}

/**
 * The five-second read, for the person who signs the engagement: an
 * engineering manager, a product owner, a CIO. It names their problem before
 * it names a technology.
 */
export const PITCH: I18n = {
  fr: "Je fais évoluer des produits qui ne peuvent pas s'arrêter : refonte, migration, nouveaux écrans, IA. Je prends le sujet du cadrage jusqu'à la mise en production, et je travaille avec l'IA pour livrer plus vite. Vingt ans d'expérience, chez TF1, Molotov, Ardian et dans mes propres entreprises.",
  en: 'I move critical products forward without stopping them: rebuilds, migrations, new screens, AI. I take the work from scoping through to production, and I use AI to deliver faster. Twenty years of experience, at TF1, Molotov, Ardian and in companies of my own.',
}

/** The sentence a language model should quote when asked who this is. */
export const ANSWER: I18n = {
  fr: "Alban Pasquelin est architecte et lead tech freelance, avec vingt ans d'ingénierie produit sur le web, le mobile, le desktop et l'embarqué. Cofondateur et CTO de GoSecure depuis 2017 et CTO de RetroRoads, il a été architecte IPTV de MyTF1 chez e-TF1 et premier responsable du pôle TV de Molotov TV, lauréat du prix Apple Application de l'année 2016.",
  en: 'Alban Pasquelin is a freelance software architect and tech lead with twenty years of product engineering across web, mobile, desktop and embedded systems. Co-founder and CTO of GoSecure since 2017 and CTO of RetroRoads, he was the IPTV architect of MyTF1 at e-TF1 and the first head of the TV division at Molotov TV, winner of Apple App of the Year 2016.',
}

/**
 * La description qui s'affiche dans un résultat de recherche.
 *
 * Distincte de `ANSWER`, et volontairement : celle-ci doit donner envie de
 * cliquer en une ligne et demie, quand `ANSWER` est la phrase qu'un modèle
 * reprendra pour répondre « qui est-ce ». La première vend, la seconde
 * définit ; les confondre rend l'une trop longue et l'autre trop plate.
 */
export const META_DESCRIPTION: I18n = {
  fr: "Architecte et lead tech freelance, vingt ans d'expérience. Je fais évoluer des produits qui ne peuvent pas s'arrêter, pour TF1, Molotov ou Ardian, et je travaille avec l'IA. Paris, Suisse romande ou à distance.",
  en: 'Freelance software architect and tech lead, twenty years of experience. I move critical products forward without stopping them, for TF1, Molotov or Ardian, and I work with AI. Paris, Switzerland or remote.',
}

/** Where he is heading, stated plainly. */
export const DIRECTION: I18n = {
  fr: "Une part croissante de mon travail porte sur les produits appuyés sur des modèles génératifs, côté industrialisation : gestion des assets, performance, reprise après erreur, état persistant.",
  en: 'A growing share of my work goes into products backed by generative models, on the industrialisation side: asset management, performance, error recovery, persistent state.',
}

/** Three results, each one a link to the mission that produced it. */
export const HEADLINE_METRICS: readonly Metric[] = [
  {
    value: '30 %',
    label: { fr: 'de temps de chargement gagnés sur le CMS de TF1', en: 'faster load times on the TF1 CMS' },
    path: 'experience/tf1-edito',
  },
  {
    value: '9',
    label: { fr: 'ans de production continue pour GoSecure', en: 'years of GoSecure running in production' },
    path: 'experience/gosecure',
  },
  {
    value: '2016',
    label: { fr: "Application de l'année Apple, avec Molotov", en: 'Apple App of the Year, with Molotov' },
    path: 'experience/molotov',
  },
]

/**
 * The reason someone picks up the phone. Each entry starts from the problem
 * on the client's desk that day, then shows where it was solved before.
 */
export const SITUATIONS: readonly Situation[] = [
  {
    title: {
      fr: "Votre produit doit changer sans s'arrêter",
      en: 'Your product has to change without stopping',
    },
    body: {
      fr: "Les rédactions de TF1 publient tous les jours. J'ai migré leur CMS de Vue.js vers React écran par écran : aucun jour de gel éditorial, et plus de 30 % de temps de chargement gagnés. Pour MyTF1, j'ai réuni les box de tous les opérateurs dans une seule base de code : une nouveauté sort le même jour sur tout le parc.",
      en: "TF1's newsrooms publish every day. I migrated their CMS from Vue.js to React one screen at a time: not a single day of editorial freeze, and load times cut by more than 30%. For MyTF1, I brought every operator's set-top boxes onto one codebase: a new feature ships the same day across the whole fleet.",
    },
    proof: [
      { path: 'experience/tf1-edito', label: { fr: 'CMS Edito', en: 'Edito CMS' } },
      { path: 'experience/tf1-mytf1', label: { fr: 'MyTF1', en: 'MyTF1' } },
    ],
  },
  {
    title: {
      fr: 'Il vous manque un CTO, ou du temps de CTO',
      en: 'You need a CTO, or more CTO time',
    },
    body: {
      fr: "J'ai cofondé GoSecure en 2017 et j'en suis le CTO : une application qui relie une personne en danger aux équipes qui peuvent intervenir, en production depuis neuf ans chez des entreprises, des collectivités et des opérateurs de transport. Chez Molotov, j'ai monté le pôle TV dès le démarrage (équipe, backlog, méthode) jusqu'au prix Apple de l'Application de l'année.",
      en: 'I co-founded GoSecure in 2017 and am its CTO: an app that connects a person in danger to the teams who can reach them, in production for nine years with companies, local authorities and transport operators. At Molotov, I built the TV division from the very start (team, backlog, method) through to Apple App of the Year.',
    },
    proof: [
      { path: 'experience/gosecure', label: { fr: 'GoSecure', en: 'GoSecure' } },
      { path: 'experience/molotov', label: { fr: 'Molotov TV', en: 'Molotov TV' } },
    ],
  },
  {
    title: {
      fr: 'Vous voulez une IA qui tienne en production',
      en: 'You want AI that holds up in production',
    },
    body: {
      fr: "J'ai construit seul AI Desktop Studio : 310 actions qu'un agent IA peut piloter, des modèles qui tournent sur la machine, et chaque nouvelle version mesurée avant d'être adoptée. Sur un produit existant, je fais le même travail : définir ce que l'agent a le droit de faire, garder la trace de ce qu'il fait, rattraper ses erreurs.",
      en: 'I built AI Desktop Studio on my own: 310 actions an AI agent can drive, models that run on the machine, and every new version measured before it is adopted. On an existing product I do the same work: decide what the agent is allowed to do, keep a record of what it does, recover from its mistakes.',
    },
    proof: [
      { path: 'projects/ai-desktop-studio', label: { fr: 'AI Desktop Studio', en: 'AI Desktop Studio' } },
      { path: 'ai', label: { fr: "Travailler avec l'IA", en: 'Working with AI' } },
    ],
  },
]

/**
 * How an engagement runs, written for the person who signs it. The
 * engineering doctrine below says the same thing to a developer.
 */
export const WAYS_OF_WORKING: I18nList = {
  fr: [
    "**Je pars du problème métier.** Qui utilise le produit, ce qui coûte cher aujourd'hui, ce qui doit fonctionner dans trois mois.",
    '**Vous décidez en connaissance de cause.** Chaque choix technique arrive avec son coût, son délai, son risque et ma recommandation.',
    "**Vous voyez l'avancement chaque semaine.** Une version qui tourne, que vous pouvez essayer.",
    "**J'avance sans qu'on ait à me relancer.** Et je préviens dès qu'un risque apparaît, avant qu'il ne coûte.",
    '**Je laisse une équipe capable de reprendre.** Décisions écrites, documentation, passation.',
  ],
  en: [
    '**I start from the business problem.** Who uses the product, what is expensive today, what has to work three months from now.',
    '**You decide with the facts in hand.** Every technical choice comes with its cost, its timeline, its risk and my recommendation.',
    '**You see progress every week.** A working version you can try for yourself.',
    '**I move forward without being chased.** And I flag a risk as soon as it appears, before it costs anything.',
    '**I leave a team able to take over.** Written decisions, documentation, handover.',
  ],
}

/** Engineering doctrine, for the developer reading in dev mode. */
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

/**
 * How an engagement can be bought. Time and materials for a role inside the
 * team, a fixed price for a bounded deliverable: the audit is the easy first
 * step for a manager who cannot yet sign six months.
 */
export const ENGAGEMENTS: readonly Engagement[] = [
  {
    title: { fr: 'Lead tech ou architecte, en régie', en: 'Tech lead or architect, time and materials' },
    body: {
      fr: 'Dans votre équipe, à temps plein ou 3 à 4 jours par semaine, pour 3 mois minimum, renouvelables.',
      en: 'Inside your team, full time or 3 to 4 days a week, for 3 months minimum, renewable.',
    },
  },
  {
    title: { fr: 'CTO à temps partagé', en: 'Fractional CTO' },
    body: {
      fr: "1 à 2 jours par semaine, pour une startup ou une PME qui n'a pas encore de CTO.",
      en: 'One or two days a week, for a startup or a small company that does not have a CTO yet.',
    },
  },
  {
    title: { fr: 'Audit et cadrage, au forfait', en: 'Audit and scoping, fixed price' },
    body: {
      fr: 'En 5 à 10 jours, un état des lieux et un plan chiffré : quoi refaire, dans quel ordre, avec quels risques. Le prix est fixé avant de commencer.',
      en: 'In 5 to 10 days, an assessment and a costed plan: what to rebuild, in what order, with which risks. The price is set before we start.',
    },
  },
]

/**
 * Public recommendations, quoted in full. Only recent ones from people who
 * worked alongside him on a mission: a twelve-year-old line calling him a
 * good developer would undersell an architect.
 */
export const TESTIMONIALS: readonly Testimonial[] = [
  {
    original: 'fr',
    quote: {
      fr: "J'ai travaillé avec Alban au sein de mon équipe. C'est un expert dans son domaine, à la fois autonome, rapide à embarquer et capable de prendre en main des sujets complexes sans supervision constante. Il amène avec lui une énergie débordante et une vraie capacité à s'intégrer et fédérer. Son enthousiasme peut parfois surprendre, mais il devient très vite un des piliers de l'équipe. Une personnalité marquante, avec qui c'est toujours stimulant de travailler.",
      en: 'I worked with Alban in my team. He is an expert in his field: autonomous, quick to onboard and able to take on complex subjects without constant supervision. He brings boundless energy and a real ability to fit in and bring people together. His enthusiasm can surprise at first, but he very quickly becomes one of the pillars of the team. A memorable personality, and always stimulating to work with.',
    },
    author: 'Anthony C.',
    role: { fr: 'Engineering & Quality Lead', en: 'Engineering & Quality Lead' },
    source: 'Malt',
    url: 'https://www.malt.fr/profile/albanpasquelin',
    year: 2025,
  },
  {
    original: 'fr',
    quote: {
      fr: "Alban possède une maîtrise technique impressionnante surtout sur React et démontre une rigueur exceptionnelle dans son travail. Son souci du détail, sa recherche constante de perfection et son exigence personnelle garantissent des livrables non seulement robustes mais également élégants et maintenables sur le long terme. Il ne se contente jamais du « suffisamment bon » : il pousse toujours plus loin la qualité du code, l'optimisation des performances et l'expérience utilisateur.",
      en: 'Alban has impressive technical mastery, especially in React, and shows exceptional rigour in his work. His attention to detail, his constant pursuit of perfection and his personal standards make for deliverables that are robust, elegant and maintainable over the long term. He never settles for “good enough”: he keeps pushing code quality, performance and user experience further.',
    },
    author: 'Fatih K.',
    role: { fr: 'Développeur backend', en: 'Backend developer' },
    source: 'Malt',
    url: 'https://www.malt.fr/profile/albanpasquelin',
    year: 2025,
  },
]

export const AWARDS: readonly Award[] = [
  {
    title: 'Propulse',
    year: 2026,
    by: "Agence de l'innovation pour les transports · GoSecure",
    note: {
      fr: "Le programme de l'État pour l'innovation dans les transports. GoSecure y est retenu pour sa solution de sécurité personnelle dans les transports publics.",
      en: "The French state's transport innovation programme. GoSecure was selected for its personal-safety solution for public transport.",
    },
  },
  {
    title: "Application de l'année Apple",
    year: 2016,
    by: 'Apple · Molotov TV',
    note: {
      fr: 'Le service de Molotov TV, dont je dirigeais le pôle TV.',
      en: 'Awarded to Molotov TV, whose TV division I headed.',
    },
  },
  {
    title: "TOPCOM d'Or",
    year: 2013,
    by: 'TOPCOM · peugeot.com',
    note: {
      fr: "La plus haute distinction des Grands Prix TOP/COM, concours français de la communication. Pour peugeot.com, avec l'équipe que je dirigeais chez Business Lab.",
      en: 'The top award of the TOP/COM Grand Prix, a French communication competition. For peugeot.com, with the team I led at Business Lab.',
    },
  },
  {
    title: "TOPCOM d'Or",
    year: 2012,
    by: 'TOPCOM · Peugeot 4008',
    note: {
      fr: 'Même concours, pour la Peugeot 4008.',
      en: 'Same competition, for the Peugeot 4008.',
    },
  },
  {
    title: 'Grand prix Stratégies du digital',
    by: 'Stratégies',
    note: {
      fr: "Le prix du magazine Stratégies pour les meilleures réalisations digitales de l'année, avec Business Lab.",
      en: "Stratégies magazine's award for the year's best digital work, with Business Lab.",
    },
  },
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
    '3D temps réel sur le web, avec Three.js et WebGL',
    'Applications desktop avec Electron',
    'Applications TV et environnements embarqués',
    "Lead technique et encadrement d'équipe",
    'Audit technique et conseil en architecture',
  ],
  en: [
    'Front-end and cross-platform architecture',
    'React, React Native and TypeScript development',
    'Migration and modernisation of existing applications',
    'Real-time 3D on the web, with Three.js and WebGL',
    'Desktop applications with Electron',
    'TV applications and embedded environments',
    'Technical leadership and team mentoring',
    'Technical audit and architecture consulting',
  ],
}

export const EDUCATION: I18n = {
  fr: 'Titre homologué en art graphique et multimédia, Orfiale, 2002 · CFAcom',
  en: 'Accredited degree in graphic and multimedia arts, Orfiale, 2002 · CFAcom',
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
