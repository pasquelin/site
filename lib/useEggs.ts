'use client'

import { useCallback, useEffect, useState } from 'react'
import { COUNTABLE_IDS, EGG_COUNT } from '@/components/ide/easter-eggs'

const KEY = 'eggs-found'

/**
 * Les commandes cachées déjà trouvées, gardées dans le navigateur.
 *
 * C'est ce compteur qui donne envie de chercher les suivantes : une animation
 * seule amuse dix secondes, une collection incomplète fait rester. Rien n'en
 * sort — ni serveur, ni identifiant, juste un tableau de noms dans le
 * stockage local.
 */
export function useEggs() {
  const [found, setFound] = useState<readonly string[]>([])

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(KEY)
      const parsed: unknown = saved ? JSON.parse(saved) : []
      // Filtré contre la liste de référence : une version précédente y a écrit
      // des identifiants qui ne comptent pas, et le total était dépassé.
      //
      // La lecture du stockage n'est possible qu'après hydratation : cet état
      // commence donc bien dans un effet.
      if (Array.isArray(parsed)) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFound(
          parsed.filter(
            (v): v is string =>
              typeof v === 'string' && (COUNTABLE_IDS as readonly string[]).includes(v),
          ),
        )
      }
    } catch {
      /* stockage indisponible : le compteur repart de zéro, sans conséquence */
    }
  }, [])

  const discover = useCallback((id: string) => {
    if (!(COUNTABLE_IDS as readonly string[]).includes(id)) return
    setFound((previous) => {
      if (previous.includes(id)) return previous
      const next = [...previous, id]
      try {
        window.localStorage.setItem(KEY, JSON.stringify(next))
      } catch {
        /* rien à rattraper : la découverte vaut pour cette visite */
      }
      return next
    })
  }, [])

  return { found, discover, total: EGG_COUNT, count: found.length }
}
