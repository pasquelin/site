import type { Project } from './types'

export const PROJECTS: readonly Project[] = [
  {
    slug: 'ai-desktop-studio',
    name: 'AI Desktop Studio',
    since: { fr: 'depuis août 2026', en: 'since August 2026' },
    tagline: {
      fr: "Un studio de création générative qui tourne sur votre machine",
      en: 'A generative creation studio that runs on your own machine',
    },
    fn: 'function openStudio(workspace: Workspace): GenerativeSession',
    answer: {
      fr: "AI Desktop Studio est un studio de création générative pour ordinateur de bureau, construit seul par Alban Pasquelin : 310 actions MCP réparties en 26 familles, sept espaces de travail pour l'image, la vidéo, la 3D, l'audio, les matières et les ciels, en Electron, React 19, Three.js, PixiJS et SQLite.",
      en: 'AI Desktop Studio is a desktop generative creation studio built solo by Alban Pasquelin: 310 MCP actions across 26 families, seven workspaces covering image, video, 3D, audio, materials and skyboxes, in Electron, React 19, Three.js, PixiJS and SQLite.',
    },
    body: {
      fr: [
        "Une application de bureau où l'on génère et retravaille des images, des vidéos, des scènes 3D, du son, des matières et des ciels, sans quitter la fenêtre. Les modèles peuvent tourner en local, sur la machine, plutôt que dans un service distant.",
        "Elle est aussi pilotable par un agent : 310 actions exposées via le protocole MCP, groupées en 26 familles. Une IA peut ouvrir un projet, générer une texture, l'appliquer sur un objet 3D et exporter le résultat — sans qu'un humain touche la souris.",
        "La partie difficile d'un produit d'IA n'est jamais l'appel au modèle. Ce sont les quatre-vingt-dix pour cent autour : le catalogue indexé, l'éditeur d'image, la timeline vidéo qui décode réellement, la reprise après erreur.",
      ],
      en: [
        'A desktop application where you generate and rework images, video, 3D scenes, audio, materials and skyboxes without leaving the window. Models can run locally, on your own machine, rather than in a remote service.',
        'It is also drivable by an agent: 310 actions exposed over the MCP protocol, grouped into 26 families. An AI can open a project, generate a texture, apply it to a 3D object and export the result, with no human touching the mouse.',
        'The hard part of an AI product is never the model call. It is the ninety percent around it: the indexed catalogue, the image editor, a video timeline that actually decodes, recovery when something fails.',
      ],
    },
    code: [
      'const studio = new DesktopStudio({ workspaces: 7, catalogue: sqlite })',
      'mcp.expose(studio.actions) // 310 actions across 26 families',
      'const texture = await model.generate(prompt); viewport.apply(texture)',
    ],
    metrics: [
      { value: '310', label: { fr: 'actions pilotables par agent', en: 'agent-drivable actions' } },
      { value: '26', label: { fr: "familles d'actions", en: 'action families' } },
      { value: '7', label: { fr: 'espaces de travail', en: 'workspaces' } },
    ],
    stack: ['Electron', 'React 19', 'Three.js', 'PixiJS', 'SQLite', 'TypeScript', 'MCP', 'llama.cpp'],
    repo: 'https://github.com/pasquelin/AIDesktopStudio',
    demo: 'https://www.aidesktopstudio.com',
    license: 'PolyForm Noncommercial 1.0.0',
    scene: 'mcpConstellation',
  },
  {
    slug: 'map3d',
    name: 'map3D',
    since: { fr: 'depuis juillet 2026', en: 'since July 2026' },
    npm: '@pasquelin/map3d',
    tagline: {
      fr: 'Cartographie 3D temps réel pour React',
      en: 'Real-time 3D mapping for React',
    },
    fn: 'function renderGlobe(tiles: Photorealistic3DTiles): Map3DSurface',
    answer: {
      fr: "map3D est une bibliothèque de cartographie 3D temps réel pour React, écrite par Alban Pasquelin : globe photoréaliste sur les tuiles 3D Google jusqu'au niveau de la rue, marqueurs et regroupements en DOM, éditeur de dessin géospatial, moteur Three.js impératif sous une surface déclarative.",
      en: 'map3D is a real-time 3D mapping library for React by Alban Pasquelin: a photorealistic globe on Google 3D Tiles down to street level, DOM markers and clusters, a geospatial drawing editor, an imperative Three.js engine under a declarative surface.',
    },
    body: {
      fr: [
        "Un globe photoréaliste que l'on traverse de l'orbite jusqu'au trottoir, sans coupure. Les bâtiments sont les vrais bâtiments, texturés depuis les tuiles 3D de Google.",
        "On y pose des marqueurs, on les regroupe automatiquement quand ils se chevauchent, et on descend en mode piéton. On dessine dessus comme dans Figma : formes, mesures, annotations géolocalisées, avec import et export GeoJSON.",
        "Dessous, un moteur Three.js impératif et optimisé. Dessus, une API React déclarative où l'on écrit des composants. Le développeur ne voit jamais le moteur, sauf s'il en a besoin.",
      ],
      en: [
        'A photorealistic globe you can travel from orbit to pavement without a seam. The buildings are the real buildings, textured from Google 3D Tiles.',
        'You place markers on it, they cluster automatically when they overlap, and you can drop into pedestrian mode. You draw on top of it the way you would in Figma: shapes, measurements, geolocated annotations, with GeoJSON import and export.',
        'Underneath, an imperative and heavily optimised Three.js engine. On top, a declarative React API made of components. The developer never sees the engine unless they need it.',
      ],
    },
    code: [
      '<Map3D tiles={googlePhotorealistic3DTiles} mode=\'pedestrian\' />',
      'map.add(<Markers cluster />).add(<DrawingEditor geojson />)',
      'export const surface = declarative(imperativeThreeEngine)',
    ],
    metrics: [
      { value: 'React 19', label: { fr: 'API déclarative', en: 'declarative API' } },
      { value: 'MIL-STD-2525D', label: { fr: 'symbologie supportée', en: 'symbology supported' } },
    ],
    stack: ['TypeScript', 'React 19', 'Three.js', 'WebGL', 'Google 3D Tiles', 'Cesium ion', 'GeoJSON'],
    repo: 'https://github.com/pasquelin/map3D',
    demo: 'https://pasquelin.github.io/map3D/',
  },
  {
    slug: 'panels',
    name: 'panels',
    since: { fr: 'depuis septembre 2026', en: 'since September 2026' },
    npm: '@pasquelin/panels',
    tagline: {
      fr: "Le châssis d'une application outil, en 8 kB",
      en: 'The chassis of a tool application, in 8 kB',
    },
    fn: 'function mountChassis(layout: WorkbenchLayout): PanelTree',
    answer: {
      fr: "panels est une bibliothèque React d'Alban Pasquelin qui fournit le châssis d'une application outil — rails d'icônes, zones redimensionnables, centre libre avec onglets déplaçables — en 8 kB compressés, sans aucune dépendance, sous licence MIT.",
      en: 'panels is a React library by Alban Pasquelin providing the chassis of a tool application — icon rails, resizable zones, a free centre with draggable tabs — in 8 kB gzipped, with zero dependencies, MIT licensed.',
    },
    body: {
      fr: [
        "Toutes les applications outil se ressemblent : des barres d'icônes sur les côtés, des panneaux que l'on redimensionne, et au centre des documents en onglets que l'on déplace. Tout le monde le réécrit, mal, à chaque projet.",
        "panels fournit ce châssis une fois pour toutes. Il est sans interface imposée : la mécanique est fournie, l'apparence reste la vôtre.",
        "8 kB compressés, zéro dépendance, MIT. Le poids est un choix de conception, pas un accident.",
      ],
      en: [
        'Every tool application looks the same: icon rails down the sides, panels you resize, and tabbed documents in the middle that you drag around. Everyone rewrites it, badly, on every project.',
        'panels supplies that chassis once and for all. It is headless: the mechanics come with it, the appearance stays yours.',
        '8 kB gzipped, zero dependencies, MIT. The weight is a design decision, not an accident.',
      ],
    },
    code: [
      '<Panels rails={[leftIcons, rightIcons]} center={<Documents tabs />} />',
      'const chassis = headless(Panels) // mechanics included, appearance yours',
      'expect(gzipSize).toBe(\'8 kB\'); expect(dependencies).toHaveLength(0)',
    ],
    metrics: [
      { value: '8 kB', label: { fr: 'compressé', en: 'gzipped' } },
      { value: '0', label: { fr: 'dépendance', en: 'dependencies' } },
      { value: 'MIT', label: { fr: 'licence', en: 'licence' } },
    ],
    stack: ['TypeScript', 'React', 'Headless UI'],
    repo: 'https://github.com/pasquelin/panels',
    demo: 'https://pasquelin.github.io/panels/',
    license: 'MIT',
    scene: 'panelChassis',
  },
  {
    slug: 'media-studio',
    name: 'media-studio',
    tagline: {
      fr: 'Capture, montage et export vidéo sur mobile',
      en: 'Capture, editing and video export on mobile',
    },
    fn: 'function captureAndExport(session: CaptureSession): ExportedClip',
    answer: {
      fr: "media-studio est un SDK React Native et Expo d'Alban Pasquelin pour la capture photo et vidéo, le montage et l'export sur iOS et Android : filtres, textes animés, autocollants, transitions, timeline et export en tâche de fond, avec un cœur entièrement sans interface.",
      en: 'media-studio is a React Native and Expo SDK by Alban Pasquelin for photo and video capture, editing and export on iOS and Android: filters, animated text, stickers, transitions, a timeline and background export, with a fully headless core.',
    },
    body: {
      fr: [
        "Tout ce qu'attend un utilisateur d'application mobile en 2026 : filmer, couper, ajouter du texte animé, des autocollants, des transitions, puis exporter — sans que l'application ne bloque pendant le rendu.",
        "Le cœur est sans interface. Une équipe branche son propre design par-dessus au lieu de subir celui du SDK.",
      ],
      en: [
        'Everything a mobile app user expects in 2026: shoot, cut, add animated text, stickers, transitions, then export — without the app freezing during the render.',
        'The core is headless. A team plugs their own design on top instead of inheriting the SDK\'s.',
      ],
    },
    code: [
      'const clip = await camera.capture({ photo: true, video: true })',
      'timeline.add(filters, animatedText, stickers, transitions).exportInBackground()',
    ],
    metrics: [
      { value: 'iOS + Android', label: { fr: 'une seule base de code', en: 'one codebase' } },
    ],
    stack: ['React Native', 'Expo', 'Skia', 'FFmpeg', 'TypeScript', 'Turborepo'],
    repo: 'https://github.com/pasquelin/media-studio',
    scene: 'timelineDepth',
  },
  {
    slug: 'enigma-cube',
    name: 'Enigma Cube',
    tagline: {
      fr: 'Un RPG-puzzle en WebGL, moteur compris',
      en: 'A WebGL puzzle RPG, engine included',
    },
    fn: 'function runEngine(world: VoxelWorld): Frame',
    answer: {
      fr: "Enigma Cube est un jeu de rôle et de réflexion en WebGL construit par Alban Pasquelin, avec son propre moteur Three.js : héros, personnages non joueurs et leur intelligence, éditeur de niveaux, éditeur de cartes et banque de 43 modèles 3D.",
      en: 'Enigma Cube is a WebGL puzzle role-playing game built by Alban Pasquelin with its own Three.js engine: hero, non-player characters and their behaviour, a level editor, a map editor and a bank of 43 3D models.',
    },
    body: {
      fr: [
        "Un monde fait de cubes, où l'on résout des énigmes. Le moteur, l'éditeur de niveaux, l'éditeur de cartes et les modèles 3D ont été construits pour l'occasion.",
        "Faire un jeu apprend ce qu'aucune application métier n'enseigne : tenir soixante images par seconde, gérer la mémoire, et concevoir un outil que l'on utilise soi-même tous les jours.",
      ],
      en: [
        'A world made of cubes where you solve puzzles. The engine, the level editor, the map editor and the 3D models were all built for it.',
        'Making a game teaches what no business application ever will: holding sixty frames a second, managing memory, and designing a tool you use yourself every day.',
      ],
    },
    code: [
      'const world = voxelEngine.generate({ models: 43, npcs, quests })',
      'engine.tick(() => expect(framesPerSecond).toBe(60))',
    ],
    metrics: [
      { value: '43', label: { fr: 'modèles 3D', en: '3D models' } },
      { value: '60 fps', label: { fr: 'cible tenue', en: 'target held' } },
    ],
    stack: ['Three.js', 'WebGL', 'JavaScript', 'PHP', 'MySQL', 'Voxel'],
    repo: 'https://github.com/pasquelin/enigma-cube',
    scene: 'codeCube',
  },
  {
    slug: 'map3d-plugins',
    name: 'map3D plugins',
    tagline: {
      fr: "L'écosystème officiel de map3D",
      en: 'The official map3D ecosystem',
    },
    fn: 'function registerPlugins(map: Map3D): GeographicSources',
    answer: {
      fr: "Les plugins map3D d'Alban Pasquelin forment un monorepo pnpm où chaque source de données géographiques — IGN, BD TOPO, Géoplateforme, webcams, Windy — devient un paquet indépendant.",
      en: 'Alban Pasquelin\'s map3D plugins form a pnpm monorepo where each geographic data source — IGN, BD TOPO, Géoplateforme, webcams, Windy — becomes an independent package.',
    },
    body: {
      fr: [
        "Un plugin, un paquet. On installe la donnée dont on a besoin — cadastre français, webcams, météo — et rien d'autre.",
        "C'est la preuve qu'une bibliothèque est bien découpée : si l'on peut lui ajouter des capacités depuis l'extérieur sans la modifier, les frontières étaient justes.",
      ],
      en: [
        'One plugin, one package. You install the data you need — French land registry, webcams, weather — and nothing else.',
        'This is the proof a library is well split: if capabilities can be added from the outside without touching it, the boundaries were drawn correctly.',
      ],
    },
    code: [
      'import ign from \'@pasquelin/map3d-plugin-ign\'',
      'map.use(ign, bdTopo, geoplateforme, webcams, windy)',
    ],
    metrics: [],
    stack: ['TypeScript', 'React 19', 'Three.js', 'pnpm', 'IGN', 'WFS'],
    repo: 'https://github.com/pasquelin/plugingsMap3D',
  },
  {
    slug: 'local-llm-finetuning',
    name: 'Fine-tuning local',
    tagline: {
      fr: 'Entraîner et évaluer un assistant qui tourne hors ligne',
      en: 'Training and evaluating an assistant that runs offline',
    },
    fn: 'function specialiseModel(base: Qwen): LocalAssistant',
    answer: {
      fr: "Alban Pasquelin a construit un harnais de préparation et d'évaluation pour spécialiser un modèle Qwen multilingue destiné à piloter AI Desktop Studio, exécuté localement sur Apple Silicon dans des machines virtuelles Tart.",
      en: 'Alban Pasquelin built a preparation and evaluation harness to specialise a multilingual Qwen model driving AI Desktop Studio, run locally on Apple Silicon inside Tart virtual machines.',
    },
    body: {
      fr: [
        "Un modèle généraliste ne sait pas piloter une application précise. Celui-ci est spécialisé pour comprendre les 310 actions d'AI Desktop Studio, dans plusieurs langues.",
        "Tout se passe sur la machine : préparation des données, entraînement, puis évaluation automatisée qui mesure si la nouvelle version fait réellement mieux que l'ancienne. Sans cette mesure, on ne fait pas du fine-tuning, on fait de la superstition.",
      ],
      en: [
        'A general model cannot drive a specific application. This one is specialised to understand the 310 actions of AI Desktop Studio, across several languages.',
        'Everything happens on the machine: data preparation, training, then an automated evaluation measuring whether the new version genuinely beats the old one. Without that measurement you are not fine-tuning, you are practising superstition.',
      ],
    },
    code: [
      'const model = qwen.specialise({ actions: 310, languages: \'multi\' })',
      'if (evaluate(candidate) <= evaluate(shipped)) reject(candidate)',
    ],
    metrics: [
      { value: '100 %', label: { fr: 'exécution locale', en: 'run locally' } },
    ],
    stack: ['Qwen', 'Apple Silicon', 'Tart', 'Node.js', 'TypeScript', 'Vitest'],
    repo: 'https://github.com/pasquelin/ai-desktop-studio-finetuning',
  },
]

export const projectBySlug = (slug: string): Project | undefined =>
  PROJECTS.find((p) => p.slug === slug)
