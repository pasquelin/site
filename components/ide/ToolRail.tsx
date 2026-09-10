'use client'

import { SOCIALS } from '@/content/site'
import { UI } from '@/content/ui'
import type { IconName } from '@/content/nav'
import type { Lang } from '@/content/types'
import { Icon } from './icons'
import { useIde } from './ide-context'

const SOCIAL_ICONS: Record<string, IconName> = {
  github: 'github',
  linkedin: 'linkedin',
}

/**
 * The left rail holds tools, not pages — the sections moved up into the title
 * bar. Search and the terminal sit at the top, the profiles that prove any of
 * this is real sit at the foot.
 */
export function ToolRail({ lang }: { lang: Lang }) {
  const { setPaletteOpen, terminalOpen, setTerminalOpen } = useIde()

  const item = (active: boolean) =>
    `group relative flex size-10 items-center justify-center rounded-panel transition-colors ${
      active ? 'text-amber' : 'text-fg-muted hover:text-fg-bright'
    }`

  const marker = (active: boolean) => (
    <span
      aria-hidden
      className={`absolute left-0 h-5 w-0.5 rounded-r bg-amber transition-opacity ${
        active ? 'opacity-100' : 'opacity-0'
      }`}
    />
  )

  return (
    <nav
      aria-label={lang === 'fr' ? 'Outils' : 'Tools'}
      className="hidden w-rail shrink-0 flex-col items-center gap-1 border-r border-line-soft bg-rail py-2 md:flex"
    >
      <button
        type="button"
        onClick={() => setPaletteOpen(true)}
        title={`${lang === 'fr' ? 'Aller à…' : 'Go to…'} (⌘K)`}
        className={item(false)}
      >
        <Icon name="search" />
        <span className="sr-only">{lang === 'fr' ? 'Aller à…' : 'Go to…'}</span>
      </button>

      <button
        type="button"
        onClick={() => setTerminalOpen(!terminalOpen)}
        aria-pressed={terminalOpen}
        title={terminalOpen ? UI.actions.closeTerminal[lang] : UI.actions.openTerminal[lang]}
        className={item(terminalOpen)}
      >
        {marker(terminalOpen)}
        <Icon name="terminal" />
        <span className="sr-only">
          {terminalOpen ? UI.actions.closeTerminal[lang] : UI.actions.openTerminal[lang]}
        </span>
      </button>

      <div className="mt-auto flex flex-col items-center gap-1">
        {SOCIALS.filter((s) => SOCIAL_ICONS[s.id]).map((social) => (
          <a
            key={social.id}
            href={social.url}
            target="_blank"
            rel="me noopener noreferrer"
            title={social.label}
            className={item(false)}
          >
            <Icon name={SOCIAL_ICONS[social.id]} />
            <span className="sr-only">{social.label}</span>
          </a>
        ))}
      </div>
    </nav>
  )
}
