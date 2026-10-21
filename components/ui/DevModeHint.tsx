'use client'

import { useIde } from '@/components/ide/ide-context'
import { UI } from '@/content/ui'
import { keepTogether } from '@/lib/typo'

/**
 * Human mode is the default, because the person who signs the engagement
 * rarely writes code. This line is how the developer reading alongside them
 * finds the editor view.
 */
export function DevModeHint() {
  const { mode, setMode, lang } = useIde()
  if (mode !== 'human') return null

  return (
    <p className="mt-5 text-[13px] text-fg-muted">
      {keepTogether(UI.devHint.question[lang])}{' '}
      <button
        type="button"
        onClick={() => setMode('dev')}
        data-analytics-action="mode_select"
        data-analytics-target="dev"
        className="ml-1.5 font-mono text-amber underline decoration-amber/40 underline-offset-4 transition-colors hover:decoration-amber"
      >
        {UI.devHint.action[lang]}
      </button>
    </p>
  )
}
