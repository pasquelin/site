import type { I18n, I18nList, Metric } from './types'

export const AI_TITLE: I18n = {
  fr: "Travailler avec l'IA",
  en: 'Working with AI',
}

export const AI_ANSWER: I18n = {
  fr: "Alban Pasquelin construit des logiciels pilotables par des agents : AI Desktop Studio expose 310 actions via le protocole MCP, réparties en 26 familles, et un modèle Qwen spécialisé les exécute localement sur Apple Silicon, mesuré par un harnais d'évaluation automatisé.",
  en: 'Alban Pasquelin builds software that agents can drive: AI Desktop Studio exposes 310 actions over the MCP protocol across 26 families, and a specialised Qwen model executes them locally on Apple Silicon, measured by an automated evaluation harness.',
}

export const AI_METRICS: readonly Metric[] = [
  { value: '310', label: { fr: 'actions exposées à un agent', en: 'actions exposed to an agent' } },
  { value: '26', label: { fr: "familles d'actions", en: 'action families' } },
  { value: '100 %', label: { fr: 'exécutable hors ligne', en: 'runnable offline' } },
]

export const AI_BODY: I18nList = {
  fr: [
    "Beaucoup d'entreprises ajoutent une zone de discussion à leur produit et appellent cela de l'IA. Rendre un produit réellement pilotable par un agent demande bien plus.",
    "AI Desktop Studio est construit dans l'autre sens : chaque chose qu'un humain peut faire dans l'application, un agent peut la faire aussi. Trois cent dix actions, exposées par le protocole MCP et regroupées en vingt-six familles. Un agent ouvre un projet, génère une texture, l'applique sur un objet 3D et exporte le résultat, sans qu'une main touche la souris.",
    "Le modèle qui les exécute tourne sur la machine, sans service distant. Il a été spécialisé pour comprendre ces actions précises, en plusieurs langues, et il est réévalué à chaque version : une nouvelle version n'est adoptée que si la mesure prouve qu'elle fait mieux que l'ancienne. Sans cette mesure, régler un modèle revient à deviner.",
    "Dans un produit d'IA, l'appel au modèle est la partie facile. Le travail est dans les quatre-vingt-dix pour cent autour : décider ce que l'agent a le droit de faire, tracer ce qu'il a fait, et rattraper proprement le moment où il se trompe.",
  ],
  en: [
    'Plenty of companies bolt a chat box onto their product and call it AI. Making a product genuinely drivable by an agent takes far more.',
    'AI Desktop Studio is built the other way round: everything a human can do in the application, an agent can do too. Three hundred and ten actions, exposed over the MCP protocol and grouped into twenty-six families. An agent opens a project, generates a texture, applies it to a 3D object and exports the result, with no hand on the mouse.',
    'The model that runs them lives on the machine, with no remote service. It was specialised to understand those exact actions across several languages, and it is re-measured on every version: a new one ships only when the evaluation proves it beats the old one. Without that measurement, tuning a model is guesswork.',
    'In an AI product, the model call is the easy part. The work is in the ninety percent around it: deciding what the agent is allowed to do, recording what it did, and recovering cleanly the moment it gets something wrong.',
  ],
}

/** One statement per paragraph of `AI_BODY`. */
export const AI_CODE: readonly string[] = [
  "const product = chatBox.bolted(onto: app) // not enough",
  'mcp.expose(studio.actions) // 310 actions, 26 families',
  'const model = qwen.specialise({ runsOn: appleSilicon, offline: true })',
  'if (evaluate(next) <= evaluate(current)) reject(next)',
]

export const AI_PRINCIPLES: I18nList = {
  fr: [
    "Un agent qui ne peut rien casser ne sert à rien ; un agent qui peut tout casser est un incident qui attend son heure. Les permissions se conçoivent avant les fonctionnalités.",
    "Tout ce qu'un agent fait doit être traçable et annulable.",
    "Un modèle local coûte plus cher à mettre en place et beaucoup moins cher à exploiter, et les données ne quittent jamais la machine.",
    "Une amélioration qui ne se mesure pas n'a pas eu lieu.",
  ],
  en: [
    'An agent that can break nothing is useless; an agent that can break anything is an incident waiting to happen. Permissions get designed before features.',
    'Everything an agent does has to be traceable and reversible.',
    'A local model costs more to set up and far less to run, and the data never leaves the machine.',
    'An improvement you cannot measure did not happen.',
  ],
}

/**
 * How AI is used on a client's code, said before anyone has to ask. Buyers
 * hear that suppliers pocket the speed-up and ship unreviewed code; this is
 * the answer to both.
 */
export const AI_AT_WORK = {
  title: { fr: "Avec l'IA, sous contrôle", en: 'With AI, under control' },
  intro: {
    fr: "J'utilise l'IA chaque jour pour écrire, tester et relire du code, et vous en profitez : plus de travail livré pour le même budget.",
    en: 'I use AI every day to write, test and review code, and you get the benefit: more work delivered for the same budget.',
  },
  points: {
    fr: [
      'Je relis et teste tout ce que je livre, et j\'en reste responsable.',
      "Votre code ne passe par aucun outil que vous n'avez pas validé.",
      "S'il est sensible, je travaille avec des modèles qui tournent en local : aucune ligne ne quitte la machine.",
    ],
    en: [
      'I review and test everything I deliver, and I stay accountable for it.',
      'Your code goes through no tool you have not approved.',
      'If it is sensitive, I work with models that run locally: not a line leaves the machine.',
    ],
  },
} as const satisfies { title: I18n; intro: I18n; points: I18nList }
