'use client'

import { useEffect, useState } from 'react'

/** Le seuil `md` de Tailwind, celui où le châssis passe de mobile à bureau. */
const DESKTOP = '(min-width: 768px)'

/**
 * Vrai au-dessus de 768 px.
 *
 * Le rendu est statique : le serveur ignore la taille de l'écran. On part donc
 * du bureau — ce que le HTML servi suppose déjà — puis on corrige après
 * hydratation. Le premier rendu client est ainsi identique au HTML reçu, et
 * React n'a rien à signaler.
 *
 * Sert à ne monter qu'une seule surface de terminal : masquer la seconde en
 * CSS la laissait vivante, avec son propre champ de saisie et sa propre région
 * `log` annoncée aux lecteurs d'écran.
 */
export function useIsDesktop(): boolean {
  const [isDesktop, setIsDesktop] = useState(true)

  useEffect(() => {
    const query = window.matchMedia(DESKTOP)
    const sync = () => setIsDesktop(query.matches)
    sync()
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])

  return isDesktop
}
