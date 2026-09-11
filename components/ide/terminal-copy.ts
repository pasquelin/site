import type { Lang } from '@/content/types'

/**
 * Les mots du terminal, partagés par sa vue et par son narrateur.
 *
 * Ils vivaient dans `Terminal.tsx`, du temps où ce composant faisait les deux.
 * Depuis que la narration en est sortie, les deux en ont besoin — et un seul
 * endroit doit les définir.
 */
export const TERMINAL_COPY = {
  fr: {
    read: 'Lecture',
    ready: 'prêt',
    open: 'Session ouverte',
    unknown: (command: string) => `commande inconnue : ${command}`,
    helpHint: 'tapez « aide »',
    hint: 'Tapez une commande. « aide » pour la liste.',
    help: [
      'aide            cette liste',
      'ls              lister les pages',
      'open <nom>      ouvrir une page',
      'cv [fr|en]      télécharger le CV en PDF',
      'contact         écrire à Alban',
      'mode humain|dev changer la présentation',
      'lang fr|en      changer de langue',
      'clear           vider le terminal',
    ],
    label: 'Terminal',
    collapse: 'Réduire le terminal',
  },
  en: {
    read: 'Read',
    ready: 'ready',
    open: 'Session open',
    unknown: (command: string) => `unknown command: ${command}`,
    helpHint: 'type "help"',
    hint: 'Type a command. "help" for the list.',
    help: [
      'help            this list',
      'ls              list pages',
      'open <name>     open a page',
      'cv [fr|en]      download the CV as PDF',
      'contact         write to Alban',
      'mode human|dev  change presentation',
      'lang fr|en      change language',
      'clear           empty the terminal',
    ],
    label: 'Terminal',
    collapse: 'Collapse terminal',
  },
} as const satisfies Record<Lang, unknown>
