/**
 * Le texte du CV en PDF, en français et en anglais.
 *
 * Il n'est pas dérivé de `content/` : un CV imprimé tient en deux pages, et
 * chaque ligne y est coupée à la main pour que la mise en page tienne. Le site
 * raconte, le PDF résume.
 *
 * Mise en forme en ligne : `**gras**` et `*italique*`, rien d'autre.
 */
import type { Lang } from '../../content/types.ts'

export interface CvEntry {
  readonly title: string
  /** Après le tiret cadratin, en gris : l'entreprise. */
  readonly org?: string
  readonly period: string
  readonly summary?: string
  readonly bullets?: readonly string[]
  readonly tags?: readonly string[]
}

export interface CvProject {
  readonly name: string
  readonly year: string
  readonly summary: string
  readonly tags: readonly string[]
}

export interface Cv {
  readonly title: string
  readonly headline: string
  readonly contact: readonly string[]
  readonly headings: {
    readonly profile: string
    readonly experience: string
    readonly projects: string
    readonly skills: string
    readonly awards: string
    readonly education: string
    readonly languages: string
  }
  readonly profile: string
  readonly experience: readonly CvEntry[]
  readonly projects: readonly CvProject[]
  readonly skills: readonly (readonly [string, string])[]
  readonly awards: readonly string[]
  readonly education: string
  readonly languages: string
  readonly terms: string
}

const CONTACT_LINKS = [
  'alban.pasquelin@gmail.com',
  'linkedin.com/in/alban-pasquelin',
  'github.com/pasquelin',
  'malt.fr/profile/albanpasquelin',
]

const STACKS = {
  gosecure: ['React Native', 'React', 'Node.js'],
  retroroads: ['Express 5', 'Apollo', 'TypeGraphQL', 'TypeORM/MySQL', 'Redis', 'RabbitMQ', 'Expo SDK 57'],
  ardian: ['React', 'Tailwind CSS', 'DaisyUI', 'REST'],
  edito: ['React', 'TypeScript', 'GraphQL', 'Apollo', 'Tailwind CSS'],
  mytf1: ['React Native', 'React Native Web', 'Android TV', 'WebOS', 'WPE', 'SCTE-35'],
  innso: ['Vue.js', 'Vuex', 'Vuetify'],
  molotov: ['React', 'JavaScript ES6/ES7', 'HTML5 video', 'DRM', 'Apple TV', 'Smart TV'],
  aids: ['Electron', 'React 19', 'TypeScript', 'three.js', 'PixiJS', 'SQLite'],
  trillion3d: ['Rust', 'TypeScript', 'WebGPU', 'WebGL2', 'WebAssembly'],
  map3d: ['React 19', 'Three.js', 'Google Photorealistic 3D Tiles', 'WebGL'],
  panels: ['React 19', 'TypeScript', 'MIT', 'npm @pasquelin/panels'],
}

export const CV: Record<Lang, Cv> = {
  fr: {
    title: 'Alban Pasquelin — CV',
    headline: 'Architecte & Lead Tech — React Native · React · TypeScript · Three.js',
    contact: ['Paris & Genève', ...CONTACT_LINKS],
    headings: {
      profile: 'Profil',
      experience: 'Expérience',
      projects: 'Projets personnels',
      skills: 'Compétences',
      awards: 'Distinctions',
      education: 'Formation',
      languages: 'Langues',
    },
    profile:
      "Vingt ans d'ingénierie produit — web, mobile, desktop, environnements embarqués. J'interviens sur l'architecture front et cross-platform, sur les migrations lourdes qui ne doivent rien interrompre, et sur la 3D temps réel. Co-fondateur et CTO de GoSecure depuis 2017, CTO de RetroRoads. Je monte aujourd'hui sur l'ingénierie de produits appuyés sur des modèles génératifs : pas la recherche, **l'industrialisation** — gestion d'assets, performance, reprise après erreur, état persistant.",
    experience: [
      {
        title: 'Co-fondateur & CTO',
        org: 'GoSecure',
        period: "2017 → aujourd'hui",
        summary: 'Plateforme de sécurité citoyenne : application mobile et console SaaS temps réel.',
        bullets: [
          "Architecture d'ensemble, du mobile au backend temps réel, portée en production depuis neuf ans",
          'Alertes géolocalisées avec photo ou vidéo, console de réception et de coordination des interventions',
          'Intégration aux systèmes existants des clients par API, tableaux de bord de pilotage',
          'Déployée chez des entreprises, des collectivités et des opérateurs de transport',
          "Lauréate 2026 du programme Propulse de l'Agence Innovation pour les Transports",
        ],
        tags: [...STACKS.gosecure, 'temps réel', 'SaaS'],
      },
      {
        title: 'CTO',
        org: 'RetroRoads',
        period: "mai 2026 → aujourd'hui",
        summary: "Application grand public dédiée à l'automobile de collection. Produit en bêta privée.",
        bullets: [
          "Architecture des trois briques : API GraphQL, panel d'administration, application mobile",
          'Le schéma GraphQL est la source de vérité ; les clients consomment un miroir généré',
          'Modèle de visibilité transverse centralisé dans un service unique, contenu traduit en vingt langues',
          'Mobile Expo avec cartes natives, enregistrement GPS des parcours, CarPlay et Android Auto',
        ],
        tags: STACKS.retroroads,
      },
      {
        title: 'Développeur front-end React — refonte applicative',
        org: 'Ardian',
        period: 'juil. 2025 → janv. 2026',
        summary: "Société d'investissement. Refonte d'un outil métier stratégique.",
        bullets: [
          "Modernisation de la stack et de l'expérience utilisateur, participation à l'architecture front",
          "Design system, intégration des maquettes Figma, consommation d'APIs REST",
        ],
        tags: STACKS.ardian,
      },
      {
        title: 'Responsable de la refonte du CMS Edito',
        org: 'e-TF1',
        period: 'janv. 2024 → juil. 2025',
        bullets: [
          'Pilotage de la refonte complète du CMS éditorial, migration de Vue.js vers React',
          'Passage à TypeScript intégral, réduisant fortement les régressions en production',
          'GraphQL pour les échanges client-serveur, validation de schémas, composants atomiques',
          'Intégrité des données préservée pendant toute la migration, temps de chargement réduits de plus de 30 %',
        ],
        tags: STACKS.edito,
      },
      {
        title: 'Architecte IPTV — MyTF1 multi-plateformes',
        org: 'e-TF1',
        period: 'janv. 2021 → janv. 2024',
        bullets: [
          "Refonte de MyTF1 sur l'ensemble des box opérateurs françaises, une seule base de code",
          'Déploiement sur Android TV, WebOS et WPE, avec leurs contraintes matérielles propres',
          'Génération automatisée de sites en marque blanche pour les chaînes thématiques du groupe',
          "Publicité dynamique SCTE-35 intégrée à l'écosystème Freewheel",
        ],
        tags: STACKS.mytf1,
      },
      {
        title: 'Développeur front senior',
        org: 'Innso',
        period: 'mars 2019 → déc. 2020',
        summary:
          'Refonte de la plateforme de relation client ; architecture front et studio de conception de chatbots.',
        tags: [...STACKS.innso, 'cross-platform iOS/Android'],
      },
      {
        title: 'Responsable du pôle TV, puis Head of TV & product design advisor',
        org: 'Molotov TV',
        period: 'févr. 2015 → déc. 2016',
        summary:
          'Lancement du service. Premier responsable du pôle TV, de la phase initiale de la startup à la sortie.',
        bullets: [
          'Structuration du pôle TV : équipe, backlog produit, méthodologie de développement',
          "Conception et développement d'un player vidéo HTML5 compatible DRM pour la diffusion sécurisée",
          'Applications TV connectées — Apple TV, LG, Samsung — plus iPhone, iPad et desktop',
          "Direction de l'expérience et de l'interface sur l'ensemble des plateformes",
          "**Apple — Application de l'année 2016**",
        ],
        tags: STACKS.molotov,
      },
      {
        title: 'Autres missions',
        period: '2005 → 2019',
        summary:
          'Infopro Digital (plateforme de webinars temps réel, Vue.js et OpenTok) · Arte (application Apple TV, tvOS) · Equidia (refonte du SI, via DonkeyCode) · Staffmatch · Amplement (directeur R&D stratégie produit) · Business Lab (lead développeur puis chef de projet technique, équipe de dix) · Peugeot · Leroy Merlin · E.Leclerc (Qui est le moins cher)',
      },
    ],
    projects: [
      {
        name: 'AI Desktop Studio',
        year: '2026',
        summary:
          "Studio de création générative sur le bureau. Sept espaces de travail, catalogue local indexé en SQLite, éditeur d'image sur canvas, timeline vidéo qui décode réellement, textures et skyboxes générées appliquées dans le viewport 3D. 310 actions MCP : l'interface est pilotable par un agent.",
        tags: STACKS.aids,
      },
      {
        name: 'Trillion3D',
        year: '2026',
        summary:
          'Moteur de rendu web à géométrie virtualisée, comme les moteurs de jeu : compilateur natif en Rust qui découpe les modèles en grappes de 128 triangles, moteur WebGPU sous budget mémoire fixe, tri sur GPU, antialiasing temporel. Chaque chiffre est mesuré sur banc.',
        tags: STACKS.trillion3d,
      },
      {
        name: 'map3d',
        year: '2026',
        summary:
          'Librairie de cartographie 3D temps réel pour React. Du globe photoréaliste à la rue, mode piéton, éditeur de dessin géospatial avec import et export GeoJSON, thèmes typés.',
        tags: STACKS.map3d,
      },
      {
        name: 'panels',
        year: '2026',
        summary:
          "Le châssis d'une application outil, publié en MIT : rails d'icônes, zones redimensionnables, centre libre acceptant documents à onglets ou route applicative. 8 ko gzip, zéro dépendance.",
        tags: STACKS.panels,
      },
    ],
    skills: [
      ['Front & cross-platform', 'React, React Native, React Native Web, Expo, Vue.js, TypeScript strict, Tailwind CSS'],
      ['3D temps réel', 'Three.js, WebGL, WebGPU, PixiJS, Google 3D Tiles, pipelines de rendu'],
      ['Desktop', 'Electron, SQLite, packaging et mise à jour'],
      ['Backend & données', 'Node.js, Express, GraphQL, Apollo, TypeORM, MySQL, Redis, RabbitMQ, Docker, Keycloak'],
      ['Environnements contraints', 'Android TV, WebOS, WPE, box opérateurs, CarPlay, Android Auto, SCTE-35'],
      [
        'Pratiques',
        "Architecture logicielle, design system, migrations sans interruption, CI/CD, revue de code, montée en compétence d'équipe",
      ],
    ],
    awards: [
      "**Apple** — Application de l'année 2016",
      "**TOPCOM d'Or 2013** — peugeot.com",
      "**TOPCOM d'Or 2012** — Peugeot 4008",
      '**Grand prix Stratégies du digital**',
      '**Propulse 2026** — Agence Innovation pour les Transports (GoSecure)',
      'Publication « PHP Solutions » — janvier 2009',
    ],
    education: 'Titre homologué en art graphique et multimédia — Orfiale, 2002. CFAcom.',
    languages: 'Français — langue maternelle. Anglais — capacité professionnelle complète.',
    terms:
      '**Disponibilité** — Paris et Île-de-France (sur site ou hybride), Suisse romande, remote Europe. **Facturation suisse en place**, donc aucune friction administrative pour un client romand. **Tarif** — 750 à 850 € par jour en France, CHF 1 000 à 1 150 en Suisse.',
  },
  en: {
    title: 'Alban Pasquelin — CV',
    headline: 'Software Architect & Tech Lead — React Native · React · TypeScript · Three.js',
    contact: ['Paris & Geneva', ...CONTACT_LINKS],
    headings: {
      profile: 'Profile',
      experience: 'Experience',
      projects: 'Personal projects',
      skills: 'Skills',
      awards: 'Awards',
      education: 'Education',
      languages: 'Languages',
    },
    profile:
      'Twenty years of product engineering — web, mobile, desktop, embedded environments. I take on front-end and cross-platform architecture, heavy migrations that must not interrupt service, and real-time 3D. Co-founder and CTO of GoSecure since 2017, CTO of RetroRoads. What I am building up now is the engineering of products backed by generative models: not research, **industrialisation** — asset management, performance, error recovery, persistent state.',
    experience: [
      {
        title: 'Co-founder & CTO',
        org: 'GoSecure',
        period: '2017 → present',
        summary: 'A public-safety platform: mobile app plus a real-time SaaS console.',
        bullets: [
          'Whole-system architecture, from mobile to the real-time backend, in production for nine years',
          'Geolocated alerts with photo or video; a console that receives and coordinates response',
          'API integration with the systems clients already run; reporting dashboards',
          'Deployed with companies, local authorities and transport operators',
          'Selected by the 2026 Propulse programme, French Transport Innovation Agency',
        ],
        tags: [...STACKS.gosecure, 'real time', 'SaaS'],
      },
      {
        title: 'CTO',
        org: 'RetroRoads',
        period: 'May 2026 → present',
        summary: 'A consumer app for classic cars. Currently in private beta.',
        bullets: [
          'Architecture of all three parts: GraphQL API, admin panel, mobile app',
          'The GraphQL schema is the source of truth; clients consume a generated mirror',
          'One cross-cutting visibility model in a single service; content translated into twenty languages',
          'Expo mobile app with native maps, GPS route recording, CarPlay and Android Auto',
        ],
        tags: STACKS.retroroads,
      },
      {
        title: 'React front-end developer — internal tool rebuild',
        org: 'Ardian',
        period: 'Jul 2025 → Jan 2026',
        summary: 'Investment firm. Rebuild of a strategic internal tool.',
        bullets: [
          'Stack and UX modernisation; contribution to the front-end architecture',
          'Design system, Figma implementation, REST API integration',
        ],
        tags: STACKS.ardian,
      },
      {
        title: 'Lead — Edito CMS rebuild',
        org: 'e-TF1',
        period: 'Jan 2024 → Jul 2025',
        bullets: [
          'Led the full rebuild of the editorial CMS, migrating the front-end from Vue.js to React',
          'Moved to end-to-end TypeScript, sharply reducing production regressions',
          'GraphQL for client-server exchange, schema validation, atomic components',
          'Data integrity preserved throughout; load times cut by more than 30%',
        ],
        tags: STACKS.edito,
      },
      {
        title: 'IPTV architect — MyTF1 across all platforms',
        org: 'e-TF1',
        period: 'Jan 2021 → Jan 2024',
        bullets: [
          'Rebuilt MyTF1 across every French operator set-top box from a single codebase',
          'Shipped to Android TV, WebOS and WPE, each with its own hardware constraints',
          "Automated white-label site generation for the group's thematic channels",
          'SCTE-35 dynamic ad insertion integrated with the Freewheel stack',
        ],
        tags: STACKS.mytf1,
      },
      {
        title: 'Senior front-end developer',
        org: 'Innso',
        period: 'Mar 2019 → Dec 2020',
        summary: 'Customer-relations platform rebuild; front-end architecture and a chatbot design studio.',
        tags: [...STACKS.innso, 'cross-platform iOS/Android'],
      },
      {
        title: 'Head of TV division, then head of TV & product design advisor',
        org: 'Molotov TV',
        period: 'Feb 2015 → Dec 2016',
        summary: "Launch of the service. First head of the TV division, from the startup's early phase to release.",
        bullets: [
          'Built the TV division: team, product backlog, development methodology',
          'Designed and built a DRM-capable HTML5 video player for secure delivery',
          'Connected-TV apps — Apple TV, LG, Samsung — plus iPhone, iPad and desktop',
          'Owned the experience and the interface across every platform',
          '**Apple — App of the Year 2016**',
        ],
        tags: STACKS.molotov,
      },
      {
        title: 'Earlier work',
        period: '2005 → 2019',
        summary:
          'Infopro Digital (real-time webinar platform, Vue.js and OpenTok) · Arte (Apple TV app, tvOS) · Equidia (information system rebuild, via DonkeyCode) · Staffmatch · Amplement (R&D and product strategy director) · Business Lab (lead developer, then technical project manager, team of ten) · Peugeot · Leroy Merlin · E.Leclerc (price comparator)',
      },
    ],
    projects: [
      {
        name: 'AI Desktop Studio',
        year: '2026',
        summary:
          'A generative creation studio on the desktop. Seven workspaces, a locally indexed SQLite catalogue, a canvas image editor, a video timeline that actually decodes, generated textures and skyboxes applied inside the 3D viewport. 310 MCP actions: the whole UI is drivable by an agent.',
        tags: STACKS.aids,
      },
      {
        name: 'Trillion3D',
        year: '2026',
        summary:
          'Game-engine virtualized geometry for the web: a native Rust compiler cuts models into 128-triangle clusters, a WebGPU engine streams them under a fixed memory budget, with GPU culling and temporal antialiasing. Every number is proven on a bench.',
        tags: STACKS.trillion3d,
      },
      {
        name: 'map3d',
        year: '2026',
        summary:
          'A real-time 3D mapping library for React. Photorealistic globe down to street level, pedestrian mode, a geospatial drawing editor with GeoJSON import and export, typed themes.',
        tags: STACKS.map3d,
      },
      {
        name: 'panels',
        year: '2026',
        summary:
          'The chassis of a tool application, released under MIT: icon rails, resizable zones, a free centre taking either tabbed documents or an application route. 8 kB gzipped, zero dependencies.',
        tags: STACKS.panels,
      },
    ],
    skills: [
      ['Front & cross-platform', 'React, React Native, React Native Web, Expo, Vue.js, strict TypeScript, Tailwind CSS'],
      ['Real-time 3D', 'Three.js, WebGL, WebGPU, PixiJS, Google 3D Tiles, rendering pipelines'],
      ['Desktop', 'Electron, SQLite, packaging and updates'],
      ['Backend & data', 'Node.js, Express, GraphQL, Apollo, TypeORM, MySQL, Redis, RabbitMQ, Docker, Keycloak'],
      ['Constrained targets', 'Android TV, WebOS, WPE, operator set-top boxes, CarPlay, Android Auto, SCTE-35'],
      ['Practices', 'Software architecture, design systems, zero-downtime migrations, CI/CD, code review, growing a team'],
    ],
    awards: [
      '**Apple** — App of the Year 2016',
      "**TOPCOM d'Or 2013** — peugeot.com",
      "**TOPCOM d'Or 2012** — Peugeot 4008",
      '**Grand prix Stratégies du digital**',
      '**Propulse 2026** — French Transport Innovation Agency (GoSecure)',
      'Published in *PHP Solutions* — January 2009',
    ],
    education: 'Accredited degree in graphic and multimedia arts — Orfiale, 2002. CFAcom.',
    languages: 'French — native. English — full professional proficiency.',
    terms:
      '**Availability** — Paris and Île-de-France (on site or hybrid), French-speaking Switzerland, remote across Europe. **Swiss invoicing already in place**, so a client in Geneva has no administrative friction to handle. **Rate** — €750–850 per day in France, CHF 1,000–1,150 in Switzerland.',
  },
}
