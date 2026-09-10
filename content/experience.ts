import type { Experience } from './types'

/**
 * Career, from Alban's CV. Nothing here is inferred: every date, title and
 * figure comes from the source document.
 */
export const EXPERIENCE: readonly Experience[] = [
  {
    slug: 'gosecure',
    company: 'GoSecure',
    role: { fr: 'Cofondateur et CTO', en: 'Co-founder and CTO' },
    period: { from: 2017, to: 'present' },
    fn: 'function dispatchAlert(alert: GeolocatedAlert): OperatorResponse',
    answer: {
      fr: "Alban Pasquelin est cofondateur et CTO de GoSecure, une plateforme de sécurité citoyenne en production depuis 2017 chez des entreprises, des collectivités et des opérateurs de transport, lauréate 2026 du programme Propulse de l'Agence Innovation pour les Transports.",
      en: 'Alban Pasquelin is co-founder and CTO of GoSecure, a public-safety platform in production since 2017 with companies, local authorities and transport operators, selected by the 2026 Propulse programme of the French Transport Innovation Agency.',
    },
    body: {
      fr: [
        "GoSecure relie une personne en danger aux équipes capables d'intervenir. Une alerte géolocalisée part du téléphone, avec photo ou vidéo, et arrive sur une console où un opérateur reçoit, qualifie et coordonne la réponse.",
        "J'en ai conçu l'architecture d'ensemble, du mobile jusqu'au backend temps réel, et je la tiens en production depuis neuf ans. La difficulté n'est pas d'envoyer un message : c'est de garantir qu'il arrive, à chaque fois, même sur un mauvais réseau, même à trois heures du matin.",
        "La plateforme se branche par API sur les systèmes que le client utilise déjà, et remonte des tableaux de bord de pilotage. Elle est déployée chez des entreprises, des collectivités et des opérateurs de transport, et a été retenue en 2026 par le programme Propulse de l'Agence Innovation pour les Transports.",
      ],
      en: [
        'GoSecure connects a person in danger to the teams who can reach them. A geolocated alert leaves the phone, carrying a photo or a video, and lands on a console where an operator receives it, assesses it and coordinates the response.',
        'I designed the whole architecture, from the mobile app to the real-time backend, and have kept it in production for nine years. The hard part is not sending a message: it is guaranteeing that it arrives every single time, on a poor network, at three in the morning.',
        'The platform plugs into the systems a client already runs through APIs, and reports into management dashboards. It is deployed with companies, local authorities and transport operators, and was selected in 2026 by the Propulse programme of the French Transport Innovation Agency.',
      ],
    },
    code: [
      'const alert = mobileApp.raise({ position: gps(), media: [photo, video] })',
      'const platform = architect({ from: mobileApp, to: realtimeBackend })',
      'clientSystems.integrate({ via: \'api\' }).report(operationDashboards)',
    ],
    metrics: [
      { value: '2017', label: { fr: 'en production depuis', en: 'in production since' } },
      { value: '9', label: { fr: "ans d'exploitation continue", en: 'years running without a break' } },
      { value: '2026', label: { fr: 'lauréate Propulse', en: 'Propulse programme' } },
    ],
    stack: ['React Native', 'React', 'Node.js', 'Temps réel', 'SaaS'],
    scene: 'alertNetwork',
    url: 'https://gosecure.fr',
  },
  {
    slug: 'retroroads',
    company: 'RetroRoads',
    role: { fr: 'CTO', en: 'CTO' },
    period: { from: 2026, to: 'present' },
    fn: 'function buildRetroRoads(schema: GraphQLSchema): [Api, AdminPanel, MobileApp]',
    answer: {
      fr: "Alban Pasquelin est CTO de RetroRoads depuis mai 2026, une application grand public dédiée à l'automobile de collection dont il a architecturé les trois briques — API GraphQL, panel d'administration et application mobile Expo — avec un contenu traduit en vingt langues.",
      en: 'Alban Pasquelin has been CTO of RetroRoads since May 2026, a consumer app for classic cars whose three parts he architected — a GraphQL API, an admin panel and an Expo mobile app — with content translated into twenty languages.',
    },
    body: {
      fr: [
        "RetroRoads est une application grand public pour les passionnés d'automobile de collection, actuellement en bêta privée. Trois briques : une API, un panel d'administration et une application mobile.",
        "Le schéma GraphQL est la source de vérité. Les clients n'écrivent pas leurs propres types : ils consomment un miroir généré depuis ce schéma. Quand l'API change, les applications le savent à la compilation, pas au moment où un utilisateur tombe sur un écran vide.",
        "La visibilité de chaque contenu — qui voit quoi, et quand — est décidée par un service unique plutôt que dispersée dans chaque requête. Une règle de confidentialité se change à un seul endroit. Le contenu est traduit en vingt langues.",
        "L'application mobile embarque des cartes natives, l'enregistrement GPS des parcours, CarPlay et Android Auto — parce qu'un carnet de route se consulte au volant, pas en marchant.",
      ],
      en: [
        'RetroRoads is a consumer app for classic-car enthusiasts, currently in private beta. Three parts: an API, an admin panel and a mobile app.',
        'The GraphQL schema is the source of truth. Clients do not write their own types: they consume a mirror generated from that schema. When the API changes, the apps find out at compile time rather than when a user hits an empty screen.',
        'Who can see which content, and when, is decided by a single service instead of being scattered across every query. A privacy rule changes in one place. Content is translated into twenty languages.',
        'The mobile app carries native maps, GPS route recording, CarPlay and Android Auto — because a road log gets read at the wheel, not on foot.',
      ],
    },
    code: [
      'const [api, adminPanel, mobileApp] = build({ from: schema })',
      'type ClientTypes = CodegenMirror<typeof schema> // one source of truth',
      'const visible = visibilityService.resolve(content, viewer, locale)',
      'expoApp.use(nativeMaps, gpsRouteRecorder, carPlay, androidAuto)',
    ],
    metrics: [
      { value: '3', label: { fr: 'briques architecturées', en: 'systems architected' } },
      { value: '20', label: { fr: 'langues', en: 'languages' } },
      { value: '1', label: { fr: 'source de vérité', en: 'source of truth' } },
    ],
    stack: ['Express 5', 'Apollo', 'TypeGraphQL', 'TypeORM', 'MySQL', 'Redis', 'RabbitMQ', 'Expo SDK 57'],
    url: 'https://retroroads.fr',
  },
  {
    slug: 'ardian',
    company: 'Ardian',
    role: { fr: 'Développeur front-end React — refonte applicative', en: 'React front-end developer — internal tool rebuild' },
    period: { from: 2025, to: 2026 },
    fn: 'function modernizeBusinessTool(tool: InvestmentWorkflow): ReactFrontend',
    answer: {
      fr: "Alban Pasquelin est intervenu chez Ardian de juillet 2025 à janvier 2026 sur la refonte d'un outil métier stratégique : modernisation de la stack et de l'expérience utilisateur, design system et intégration des maquettes Figma.",
      en: 'Alban Pasquelin worked at Ardian from July 2025 to January 2026 on the rebuild of a strategic internal tool: stack and user-experience modernisation, a design system, and Figma implementation.',
    },
    body: {
      fr: [
        "Ardian est une société d'investissement. L'outil refondu est utilisé quotidiennement par les équipes métier : il ne pouvait pas devenir plus lent ni moins fiable en changeant de peau.",
        "J'ai participé à l'architecture front, monté le design system, intégré les maquettes Figma et branché les APIs REST existantes. Moderniser la stack sans faire perdre leurs repères aux utilisateurs est la moitié du travail.",
      ],
      en: [
        'Ardian is an investment firm. The rebuilt tool is used daily by the business teams: it could not become slower or less reliable while changing its skin.',
        'I contributed to the front-end architecture, built the design system, implemented the Figma designs and wired up the existing REST APIs. Modernising the stack without making users lose their bearings is half the job.',
      ],
    },
    code: [
      'const tool = investmentTeams.dailyDriver // never slower, never less reliable',
      'const ui = designSystem(tailwind, daisyUI).from(figmaSpecs).bind(restApi)',
    ],
    metrics: [],
    stack: ['React', 'Tailwind CSS', 'DaisyUI', 'REST', 'Figma'],
  },
  {
    slug: 'tf1-edito',
    company: 'e-TF1',
    role: { fr: 'Responsable de la refonte du CMS Edito', en: 'Lead — Edito CMS rebuild' },
    period: { from: 2024, to: 2025 },
    fn: 'function rebuildEditoCMS(cms: VueApp): TypedReactCMS',
    answer: {
      fr: "Alban Pasquelin a piloté la refonte du CMS Edito de TF1 de janvier 2024 à juillet 2025, migrant le front de Vue.js vers React avec un TypeScript intégral, sans rupture d'intégrité des données et avec plus de 30 % de temps de chargement gagnés.",
      en: 'Alban Pasquelin led the rebuild of TF1\'s Edito CMS from January 2024 to July 2025, migrating the front end from Vue.js to React with end-to-end TypeScript, preserving data integrity throughout and cutting load times by more than 30%.',
    },
    body: {
      fr: [
        "Edito est l'outil avec lequel les équipes éditoriales de TF1 fabriquent ce que voient les téléspectateurs. Il ne peut pas s'arrêter : une rédaction publie tous les jours.",
        "La migration de Vue.js vers React s'est donc faite progressivement, l'ancien et le nouveau cohabitant dans la même application. Personne n'a eu à attendre une grande bascule, et l'intégrité des données a été préservée d'un bout à l'autre.",
        "Le passage à TypeScript intégral a fait chuter les régressions en production : une erreur de structure se voit à la compilation, pas un dimanche soir. Les échanges client-serveur passent par GraphQL avec validation de schéma, et l'interface est construite en composants atomiques.",
        "Les temps de chargement ont baissé de plus de trente pour cent. Pour une rédaction qui publie toute la journée, c'est du temps rendu aux gens.",
      ],
      en: [
        'Edito is the tool TF1\'s editorial teams use to build what viewers see. It cannot stop: a newsroom publishes every day.',
        'So the Vue.js-to-React migration ran incrementally, old and new living side by side in the same application. Nobody had to wait for a big-bang switchover, and data integrity held throughout.',
        'Moving to end-to-end TypeScript sharply cut production regressions: a structural mistake shows up at compile time, not on a Sunday night. Client-server exchange goes through GraphQL with schema validation, and the interface is built from atomic components.',
        'Load times dropped by more than thirty percent. For a newsroom publishing all day, that is time handed back to people.',
      ],
    },
    code: [
      'const cms = editorialTeams.publishTo(viewers) // every single day',
      'for (const screen of cms.screens) migrate(screen, { from: vue, to: react })',
      'type EditoPayload = ApolloCodegen<typeof editoSchema>',
      'expect(loadTime).toBeLessThan(before * 0.7)',
    ],
    metrics: [
      { value: '30 %', label: { fr: 'de temps de chargement gagnés', en: 'faster load times' } },
      { value: '0', label: { fr: 'jour de gel éditorial', en: 'days of editorial freeze' } },
    ],
    stack: ['React', 'TypeScript', 'GraphQL', 'Apollo', 'Tailwind CSS', 'Vue.js'],
    scene: 'migration',
  },
  {
    slug: 'tf1-mytf1',
    company: 'e-TF1',
    role: { fr: 'Architecte IPTV — MyTF1 multi-plateformes', en: 'IPTV architect — MyTF1 across all platforms' },
    period: { from: 2021, to: 2024 },
    fn: 'function unifyMyTF1(fleet: OperatorSetTopBox[]): SingleCodebase',
    answer: {
      fr: "Alban Pasquelin a été architecte IPTV chez e-TF1 de janvier 2021 à janvier 2024, refondant MyTF1 sur l'ensemble des box opérateurs françaises depuis une seule base de code — Android TV, WebOS et WPE — avec publicité dynamique SCTE-35 intégrée à l'écosystème Freewheel.",
      en: 'Alban Pasquelin was IPTV architect at e-TF1 from January 2021 to January 2024, rebuilding MyTF1 across every French operator set-top box from a single codebase — Android TV, WebOS and WPE — with SCTE-35 dynamic ad insertion integrated into the Freewheel stack.',
    },
    body: {
      fr: [
        "L'application TF1 doit tourner sur les box de tous les opérateurs français. Chaque box a son système, sa télécommande et sa puissance — certaines ont dix ans. La réponse habituelle est d'écrire une application par système, puis de les maintenir séparément.",
        "J'ai refondu l'ensemble en une seule base de code, déployée sur Android TV, WebOS et WPE. Une correction est écrite une fois et arrive partout. Une fonctionnalité sort le même jour sur tout le parc.",
        "Les sites en marque blanche des chaînes thématiques du groupe sont générés automatiquement depuis la même base : une nouvelle chaîne ne demande plus un nouveau projet.",
        "La publicité est insérée dans le direct au standard SCTE-35, intégré à l'écosystème Freewheel : le flux porte des marqueurs indiquant où placer un spot, et chaque spectateur reçoit le sien sans que l'image ne saute.",
      ],
      en: [
        'The TF1 app has to run on the set-top boxes of every French operator. Each box has its own system, its own remote and its own horsepower — some are ten years old. The usual answer is one app per system, then maintaining them separately.',
        'I rebuilt all of it into a single codebase deployed on Android TV, WebOS and WPE. A fix is written once and lands everywhere. A feature ships on the same day across the whole fleet.',
        'White-label sites for the group\'s thematic channels are generated automatically from that same codebase: a new channel no longer means a new project.',
        'Advertising is inserted into the live stream using SCTE-35, integrated with the Freewheel stack: the feed carries markers saying where a spot belongs, and each viewer receives their own without the picture ever stuttering.',
      ],
    },
    code: [
      'const fleet = frenchOperators.flatMap((operator) => operator.setTopBoxes)',
      'const myTF1 = reactNativeWeb.buildOnce().deployTo(androidTV, webOS, wpe)',
      'thematicChannels.forEach((channel) => generateWhiteLabelSite(channel))',
      'liveStream.on(\'scte35\', (cue) => freewheel.insertAd(cue, viewer))',
    ],
    metrics: [
      { value: '1', label: { fr: 'base de code', en: 'codebase' } },
      { value: '3', label: { fr: 'systèmes de box', en: 'set-top box systems' } },
      { value: 'SCTE-35', label: { fr: 'publicité dynamique', en: 'dynamic ad insertion' } },
    ],
    stack: ['React Native', 'React Native Web', 'Android TV', 'WebOS', 'WPE', 'SCTE-35', 'Freewheel'],
    scene: 'convergence',
  },
  {
    slug: 'innso',
    company: 'Innso',
    role: { fr: 'Développeur front senior', en: 'Senior front-end developer' },
    period: { from: 2019, to: 2020 },
    fn: 'function rebuildCustomerRelations(legacy: SupportPlatform): ChatbotStudio',
    answer: {
      fr: "Alban Pasquelin a été développeur front senior chez Innso de mars 2019 à décembre 2020, refondant la plateforme de relation client et construisant un studio de conception de chatbots.",
      en: 'Alban Pasquelin was a senior front-end developer at Innso from March 2019 to December 2020, rebuilding the customer-relations platform and building a chatbot design studio.',
    },
    body: {
      fr: [
        "Refonte de la plateforme de relation client : architecture front, et un studio dans lequel des équipes non techniques dessinent des parcours de chatbot au lieu de les faire coder.",
        "L'application est cross-platform, iOS et Android depuis la même base.",
      ],
      en: [
        'A rebuild of the customer-relations platform: front-end architecture, plus a studio where non-technical teams draw chatbot journeys instead of having them coded.',
        'The application is cross-platform, iOS and Android from the same codebase.',
      ],
    },
    code: [
      'const platform = rebuild(legacy, { with: [vue, vuex, vuetify] })',
      'chatbotStudio.let(supportTeams).design(journeys) // without writing code',
    ],
    metrics: [],
    stack: ['Vue.js', 'Vuex', 'Vuetify', 'iOS', 'Android'],
  },
  {
    slug: 'molotov',
    company: 'Molotov TV',
    role: {
      fr: 'Responsable du pôle TV, puis Head of TV & product design advisor',
      en: 'Head of TV division, then head of TV & product design advisor',
    },
    period: { from: 2015, to: 2016 },
    fn: 'function leadTvDivision(startup: MolotovTV): ConnectedTvApps',
    answer: {
      fr: "Alban Pasquelin a été le premier responsable du pôle TV de Molotov TV de février 2015 à décembre 2016, de la phase de démarrage jusqu'à la sortie du service, qui a reçu le prix Apple Application de l'année 2016.",
      en: 'Alban Pasquelin was the first head of the TV division at Molotov TV from February 2015 to December 2016, from the startup\'s early phase through to launch — a service that won Apple App of the Year 2016.',
    },
    body: {
      fr: [
        "Molotov réinventait la télévision en France. Je suis arrivé au démarrage et j'ai structuré le pôle TV : l'équipe, le backlog produit, la méthode de développement.",
        "J'ai conçu et développé un lecteur vidéo HTML5 compatible DRM, la condition pour diffuser des chaînes protégées dans un navigateur. Puis les applications de télévision connectée — Apple TV, LG, Samsung — en plus d'iPhone, d'iPad et du bureau.",
        "J'ai dirigé l'expérience et l'interface sur l'ensemble des plateformes. Le service a reçu le prix Apple de l'Application de l'année 2016.",
      ],
      en: [
        'Molotov was reinventing television in France. I joined at the beginning and built the TV division: the team, the product backlog, the development method.',
        'I designed and built a DRM-capable HTML5 video player, the precondition for streaming protected channels in a browser. Then the connected-TV apps — Apple TV, LG, Samsung — alongside iPhone, iPad and desktop.',
        'I owned the experience and the interface across every platform. The service won Apple App of the Year 2016.',
      ],
    },
    code: [
      'const tvDivision = build({ team, productBacklog, method })',
      'const player = new Html5Player({ drm: [\'widevine\', \'fairplay\'], live: true })',
      'ship([appleTV, lgWebOS, samsungTizen, iPhone, iPad, desktop])',
    ],
    metrics: [
      { value: '2016', label: { fr: "Apple Application de l'année", en: 'Apple App of the Year' } },
      { value: '6', label: { fr: 'plateformes livrées', en: 'platforms shipped' } },
    ],
    stack: ['React', 'JavaScript ES6', 'HTML5 video', 'DRM', 'Apple TV', 'Smart TV'],
  },
  {
    slug: 'earlier',
    company: 'Infopro Digital, Arte, Equidia, Amplement, Business Lab',
    role: { fr: 'Missions précédentes', en: 'Earlier work' },
    period: { from: 2005, to: 2019 },
    fn: 'function earlierMissions(from: 2005, to: 2019): TrackRecord',
    answer: {
      fr: "Entre 2005 et 2019, Alban Pasquelin a travaillé pour Infopro Digital, Arte, Equidia, Staffmatch, Amplement et Business Lab, où il a dirigé une équipe de dix personnes pour Peugeot, Leroy Merlin et E.Leclerc, remportant deux TOPCOM d'Or et le Grand prix Stratégies du digital.",
      en: 'Between 2005 and 2019, Alban Pasquelin worked for Infopro Digital, Arte, Equidia, Staffmatch, Amplement and Business Lab, where he led a team of ten for Peugeot, Leroy Merlin and E.Leclerc, winning two TOPCOM d\'Or awards and the Grand prix Stratégies du digital.',
    },
    body: {
      fr: [
        "Infopro Digital — une plateforme de webinars en temps réel. Arte — l'application Apple TV. Equidia — la refonte du système d'information, via DonkeyCode. Staffmatch.",
        "Amplement — directeur R&D et stratégie produit.",
        "Business Lab — lead développeur puis chef de projet technique, à la tête d'une équipe de dix personnes, pour Peugeot, Leroy Merlin et le comparateur de prix d'E.Leclerc. Deux TOPCOM d'Or, en 2013 pour peugeot.com et en 2012 pour la Peugeot 4008, et le Grand prix Stratégies du digital.",
      ],
      en: [
        'Infopro Digital — a real-time webinar platform. Arte — the Apple TV app. Equidia — an information-system rebuild, via DonkeyCode. Staffmatch.',
        'Amplement — R&D and product strategy director.',
        'Business Lab — lead developer, then technical project manager, heading a team of ten for Peugeot, Leroy Merlin and the E.Leclerc price comparator. Two TOPCOM d\'Or awards, in 2013 for peugeot.com and in 2012 for the Peugeot 4008, plus the Grand prix Stratégies du digital.',
      ],
    },
    code: [
      'const missions = [infoproWebinars, arteTvOS, equidiaInformationSystem]',
      'amplement.direct({ scope: [\'r&d\', \'productStrategy\'] })',
      'businessLab.lead(team.of(10), { clients: [peugeot, leroyMerlin, leclerc] })',
    ],
    metrics: [
      { value: '10', label: { fr: 'personnes encadrées', en: 'people led' } },
      { value: '3', label: { fr: 'distinctions', en: 'awards' } },
    ],
    stack: ['Vue.js', 'OpenTok', 'tvOS', 'PHP', 'JavaScript'],
  },
]

export const experienceBySlug = (slug: string): Experience | undefined =>
  EXPERIENCE.find((e) => e.slug === slug)
