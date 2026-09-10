import type { I18n } from './types'

export type IconName =
  | 'user'
  | 'briefcase'
  | 'cube'
  | 'sparkle'
  | 'mail'
  | 'terminal'
  | 'search'
  | 'github'
  | 'linkedin'
  | 'external'

export interface NavEntry {
  readonly id: string
  /** Path without the language prefix. */
  readonly path: string
  /** Shown in dev mode — the file this section would be. */
  readonly file: string
  readonly label: I18n
  readonly icon: IconName
}

export const NAV: readonly NavEntry[] = [
  { id: 'whoami', path: '', file: 'whoami.ts', label: { fr: 'Profil', en: 'Profile' }, icon: 'user' },
  { id: 'experience', path: 'experience', file: 'experience/', label: { fr: 'Parcours', en: 'Experience' }, icon: 'briefcase' },
  { id: 'projects', path: 'projects', file: 'projects/', label: { fr: 'Projets', en: 'Projects' }, icon: 'cube' },
  { id: 'ai', path: 'ai', file: 'ai.md', label: { fr: 'IA', en: 'AI' }, icon: 'sparkle' },
  { id: 'contact', path: 'contact', file: 'contact.sh', label: { fr: 'Contact', en: 'Contact' }, icon: 'mail' },
]
