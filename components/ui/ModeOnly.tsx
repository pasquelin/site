'use client'

import type { ReactNode } from 'react'
import { useIde, type Mode } from '@/components/ide/ide-context'

/** Shows its children only in one presentation mode. */
export function ModeOnly({ mode, children }: { mode: Mode; children: ReactNode }) {
  const { mode: current } = useIde()
  return current === mode ? <>{children}</> : null
}
