import type { Lang } from '@/content/types'
import type { LineKind } from './ide-context'

/**
 * Les commandes cachées du terminal.
 *
 * Elles n'existent que pour amuser, et obéissent donc à une règle plus stricte
 * que le reste du site : **l'état d'avant revient toujours**. Aucune ne retire
 * un nœud du DOM — voir `play.ts`, où le nettoyage est doublé d'une minuterie
 * de sécurité.
 *
 * Chacune porte un `id` : c'est ce qui alimente le compteur de découvertes.
 * Trouver la première donne envie de chercher les quinze autres.
 */

export type Animation =
  | 'none'
  | 'fall'
  | 'wipe'
  | 'glitch'
  | 'flash'
  | 'levitate'
  | 'dissolve'
  | 'vortex'
  | 'shake'
  | 'tilt'
  | 'blackout'
  | 'forkbomb'
  | 'exit'
  | 'train'
  | 'matrix'
  | 'freeze'
  | 'progress'

export interface EggLine {
  readonly kind: LineKind
  readonly text: string
  readonly detail?: string
}

export interface Egg {
  readonly id: string
  readonly animation: Animation
  /**
   * Faux pour ce qui n'est pas une trouvaille : le mode d'emploi et l'erreur
   * de cible inconnue sont des réponses, pas des animations à collectionner.
   * Sans ce drapeau, le compteur dépassait son total — il affichait 17/16.
   */
  readonly counts?: false
  /** Section visée, pour `wipe`. */
  readonly section?: string
  /**
   * Écrit avant l'animation. Reçoit la cible et son nombre d'entrées quand il
   * y en a une : « rm(cible) · suppression en cours » ne disait rien de ce qui
   * allait disparaître.
   */
  readonly before: (lang: Lang, ctx?: { target?: string; count?: number }) => readonly EggLine[]
  /** Écrit une fois tout remis en place. */
  readonly after: (lang: Lang) => readonly EggLine[]
}

const fr = (lang: Lang) => lang === 'fr'
const pick = (lang: Lang, a: string, b: string) => (fr(lang) ? a : b)

/**
 * Les seize qui comptent, dans l'ordre où on a le plus de chances de les
 * trouver. Cette liste est la référence du compteur : un identifiant absent
 * n'est pas une découverte, et le total ne peut donc pas être dépassé.
 */
export const COUNTABLE_IDS = [
  'bare', 'root', 'no-preserve-root', 'section', 'terminal', 'sudo',
  'node-modules', 'forkbomb', 'force-push', 'npm-install', 'vim', 'chmod',
  'kill-init', 'sl', 'matrix', 'exit',
] as const

export const EGG_COUNT = COUNTABLE_IDS.length

/**
 * Les chemins que `rm` sait viser, dans les deux langues. Chacun correspond à
 * un conteneur marqué `data-rm-target` : si la page courante ne le porte pas,
 * le terminal l'ouvre avant de jouer.
 */
const SECTIONS: Record<string, string> = {
  projects: 'projects',
  projets: 'projects',
  experience: 'experience',
  parcours: 'experience',
  ai: 'ai',
  ia: 'ai',
  contact: 'contact',
}

const restore = (lang: Lang): EggLine[] => [
  { kind: 'ai', text: pick(lang, 'Restauration depuis git…', 'Restoring from git…') },
  { kind: 'ok', text: pick(lang, 'Tout est revenu. Bien tenté.', 'Everything is back. Nice try.') },
]

const EGGS: Record<string, Egg> = {
  /*
   * `rm --help` renvoyait « missing operand », c'est-à-dire le message qui
   * dit d'appeler `rm --help`. Une boucle fermée, et une faute : la vraie
   * commande affiche son mode d'emploi.
   *
   * Elle ne compte pas dans les seize — ce n'est pas une animation mais un
   * panneau indicateur. Il nomme `--no-preserve-root`, ce qui suffit à mettre
   * sur la piste sans rien dévoiler.
   */
  help: {
    id: 'help',
    animation: 'none',
    counts: false,
    before: (lang) => [
      { kind: 'out', text: 'Usage: rm [OPTION]... [FILE]...' },
      { kind: 'out', text: pick(lang, 'Supprime les fichiers indiqués.', 'Remove the given files.') },
      { kind: 'out', text: '' },
      { kind: 'out', text: pick(lang, "  -f, --force          ne demande jamais confirmation", '  -f, --force          never prompt') },
      { kind: 'out', text: pick(lang, '  -r, -R, --recursive  descend dans les dossiers', '  -r, -R, --recursive  recurse into directories') },
      { kind: 'out', text: pick(lang, "      --no-preserve-root  ne traite pas « / » à part", '      --no-preserve-root  do not treat / specially') },
      { kind: 'out', text: pick(lang, '      --help            affiche ceci', '      --help            display this') },
      { kind: 'out', text: '' },
      {
        kind: 'ai',
        text: pick(
          lang,
          'Ce terminal prend --no-preserve-root très au sérieux.',
          'This terminal takes --no-preserve-root very seriously.',
        ),
      },
    ],
    after: () => [],
  },

  bare: {
    id: 'bare',
    animation: 'none',
    before: () => [
      { kind: 'err', text: 'rm: missing operand' },
      { kind: 'out', text: "Try 'rm --help' for more information." },
    ],
    after: () => [],
  },

  root: {
    id: 'root',
    animation: 'fall',
    before: (lang) => [
      { kind: 'tool', text: 'rm(/)', detail: pick(lang, 'récursif · forcé · tout', 'recursive · forced · everything') },
    ],
    after: (lang) => [{ kind: 'err', text: 'rm: /: Permission denied' }, ...restore(lang)],
  },

  noPreserveRoot: {
    id: 'no-preserve-root',
    animation: 'vortex',
    before: (lang) => [
      {
        kind: 'ai',
        text: pick(lang, 'Vous avez lu la documentation. Respect.', 'You read the manual. Respect.'),
      },
      { kind: 'tool', text: 'rm(/) --no-preserve-root' },
    ],
    after: (lang) => [
      { kind: 'err', text: pick(lang, 'Le trou noir a tout recraché.', 'The black hole spat it all back out.') },
      ...restore(lang),
    ],
  },

  section: {
    id: 'section',
    animation: 'wipe',
    before: (lang, ctx) => [
      {
        kind: 'tool',
        text: `rm(/${ctx?.target ?? ''})`,
        detail:
          ctx?.count && ctx.count > 0
            ? pick(lang, `${ctx.count} entrées à supprimer`, `${ctx.count} entries to delete`)
            : pick(lang, 'suppression en cours', 'deleting'),
      },
    ],
    after: (lang) => [{ kind: 'err', text: 'rm: Permission denied' }, ...restore(lang)],
  },

  terminal: {
    id: 'terminal',
    animation: 'glitch',
    before: () => [{ kind: 'tool', text: 'rm(terminal)' }],
    after: (lang) => [
      { kind: 'err', text: 'rm: terminal: Device or resource busy' },
      { kind: 'ai', text: pick(lang, 'Je ne peux pas me supprimer moi-même. J’ai essayé.', 'I cannot delete myself. I tried.') },
    ],
  },

  sudo: {
    id: 'sudo',
    animation: 'flash',
    before: (lang) => [
      { kind: 'out', text: '[sudo] password for visitor: ••••••••' },
      { kind: 'out', text: pick(lang, 'Vérification…', 'Checking…') },
    ],
    after: () => [
      { kind: 'err', text: 'visitor is not in the sudoers file.' },
      { kind: 'err', text: 'This incident will be reported.' },
    ],
  },

  modules: {
    id: 'node-modules',
    animation: 'dissolve',
    before: (lang) => [
      {
        kind: 'tool',
        text: 'rm(node_modules)',
        detail: pick(lang, 'le geste le plus ancien du métier', 'the oldest gesture in the trade'),
      },
    ],
    after: (lang) => [
      { kind: 'ok', text: pick(lang, 'Poids du projet : 8 kB.', 'Project weight: 8 kB.') },
      { kind: 'ai', text: pick(lang, 'C’est déjà le poids de panels. Tout est revenu.', 'That is already what panels weighs. Everything is back.') },
    ],
  },

  forkbomb: {
    id: 'forkbomb',
    animation: 'forkbomb',
    before: (lang) => [{ kind: 'tool', text: pick(lang, 'Duplication…', 'Forking…') }],
    after: (lang) => [
      { kind: 'err', text: 'bash: fork: retry: Resource temporarily unavailable' },
      { kind: 'ai', text: pick(lang, 'Classique. Et toujours aussi impoli.', 'A classic. And still rude.') },
    ],
  },

  forcePush: {
    id: 'force-push',
    animation: 'shake',
    before: () => [{ kind: 'tool', text: 'git push --force origin main' }],
    after: (lang) => [
      { kind: 'err', text: pick(lang, 'Sur main ? Un vendredi ?', 'To main? On a Friday?') },
      { kind: 'ok', text: pick(lang, 'Refusé, pour votre bien.', 'Refused, for your own good.') },
    ],
  },

  npmInstall: {
    id: 'npm-install',
    animation: 'progress',
    before: () => [{ kind: 'cmd', text: 'npm install' }],
    after: (lang) => [
      { kind: 'ok', text: 'added 1432 packages in 4m 12s' },
      { kind: 'ai', text: pick(lang, 'Ce site en utilise zéro à l’exécution.', 'This site ships zero of them at runtime.') },
    ],
  },

  vim: {
    id: 'vim',
    animation: 'freeze',
    before: (lang) => [{ kind: 'out', text: pick(lang, 'Ouverture de vim…', 'Opening vim…') }],
    after: (lang) => [
      { kind: 'ai', text: pick(lang, 'Pour quitter : Échap, puis :q! — bonne chance.', 'To quit: Esc, then :q! — good luck.') },
    ],
  },

  chmod: {
    id: 'chmod',
    animation: 'tilt',
    before: () => [{ kind: 'tool', text: 'chmod 777 /' }],
    after: (lang) => [
      { kind: 'err', text: pick(lang, 'Tout le monde peut tout faire.', 'Everyone can do everything.') },
      { kind: 'ai', text: pick(lang, 'Mauvaise idée. C’est redressé.', 'Bad idea. Straightened up.') },
    ],
  },

  kill: {
    id: 'kill-init',
    animation: 'blackout',
    before: () => [{ kind: 'tool', text: 'kill -9 1' }],
    after: (lang) => [
      { kind: 'err', text: pick(lang, 'Vous venez de tuer init.', 'You just killed init.') },
      { kind: 'ok', text: pick(lang, 'Le noyau a redémarré sans vous. Courage.', 'The kernel rebooted without you. Chin up.') },
    ],
  },

  sl: {
    id: 'sl',
    animation: 'train',
    before: () => [],
    after: (lang) => [
      { kind: 'ai', text: pick(lang, 'Vous vouliez taper « ls ». La punition est un train.', 'You meant "ls". The punishment is a train.') },
    ],
  },

  matrix: {
    id: 'matrix',
    animation: 'matrix',
    before: (lang) => [{ kind: 'out', text: pick(lang, 'Suivez le lapin blanc.', 'Follow the white rabbit.') }],
    after: (lang) => [{ kind: 'ai', text: pick(lang, 'Il n’y a pas de cuillère.', 'There is no spoon.') }],
  },

  exit: {
    id: 'exit',
    animation: 'exit',
    before: () => [{ kind: 'out', text: 'logout' }],
    after: (lang) => [
      { kind: 'ai', text: pick(lang, 'Vous ne pouvez pas partir comme ça.', 'You cannot leave like that.') },
      { kind: 'ok', text: pick(lang, 'Il reste le formulaire de contact.', 'The contact form is still there.') },
    ],
  },
}

export interface Matched {
  readonly egg: Egg
  readonly section?: string
}

/** Reconnaît une commande cachée. Renvoie `null` pour tout le reste. */
export function matchEgg(command: string): Matched | null {
  const raw = command.trim()
  const lower = raw.toLowerCase()

  // La fork bomb ne se découpe pas en mots : on la reconnaît telle quelle.
  if (raw.replace(/\s/g, '').includes(':(){:|:&};:')) return { egg: EGGS.forkbomb }

  const parts = lower.split(/\s+/)
  const sudo = parts[0] === 'sudo'
  const words = sudo ? parts.slice(1) : parts
  const verb = words[0]

  if (verb === 'vim' || verb === 'vi' || verb === 'nvim') return { egg: EGGS.vim }
  if (verb === 'sl') return { egg: EGGS.sl }
  if (verb === 'matrix') return { egg: EGGS.matrix }
  if (verb === 'exit' || verb === 'logout' || verb === 'quit') return { egg: EGGS.exit }
  if (verb === 'chmod' && words.includes('777')) return { egg: EGGS.chmod }
  if (verb === 'kill' && words.includes('1')) return { egg: EGGS.kill }
  if (verb === 'npm' && words[1] === 'install') return { egg: EGGS.npmInstall }
  if (verb === 'git' && words[1] === 'push' && words.some((w) => w === '--force' || w === '-f')) {
    return { egg: EGGS.forcePush }
  }

  if (verb !== 'rm') return null

  const flags = words.slice(1).filter((w) => w.startsWith('-'))
  const args = words.slice(1).filter((w) => !w.startsWith('-'))

  // Avant tout le reste : un drapeau d'aide n'est pas un opérande manquant.
  if (flags.some((f) => f === '--help' || f === '-h')) return { egg: EGGS.help }
  if (args.length === 0) return { egg: EGGS.bare }

  const target = args[0].replace(/^\/+|\/+$/g, '')
  if (target === 'node_modules') return { egg: EGGS.modules }
  if (target === 'terminal') return { egg: EGGS.terminal }

  const isRoot = target === '' || target === '*'
  if (isRoot && flags.includes('--no-preserve-root')) return { egg: EGGS.noPreserveRoot }
  if (sudo) return { egg: EGGS.sudo }
  if (isRoot) return { egg: EGGS.root }

  const section = SECTIONS[target.split('/')[0]]
  if (section) return { egg: EGGS.section, section }

  return {
    egg: {
      id: 'missing',
      animation: 'none',
      counts: false,
      before: () => [{ kind: 'err', text: `rm: ${args[0]}: No such file or directory` }],
      after: () => [],
    },
  }
}
