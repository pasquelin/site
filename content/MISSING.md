# Contenu à compléter

Le parcours vient du CV et rien n'y est inventé : un champ inconnu ne
s'affiche pas plutôt que d'être approximé.

## Encore inconnu

- **Grand prix Stratégies du digital** — année manquante. L'entrée s'affiche
  sans date dans la liste des distinctions.
- **RetroRoads** — le produit est en bêta privée, donc les chiffres de
  résultat manquent. La page tient sur l'architecture.
- **Ardian** — deux lignes seulement dans le CV. C'est la page la plus mince
  du parcours ; un ou deux résultats chiffrés la mettraient à niveau.

## À décider

- `SHOW_PHONE` et `SHOW_RATES` dans `content/site.ts` sont à `true`. Le numéro
  de mobile et les fourchettes de TJM sont donc publics — sur la page, dans le
  JSON-LD, dans la FAQ et dans `llms.txt`. Passer l'un à `false` le retire
  partout.

## Comment compléter

Tout se modifie dans `content/`. Le site, le JSON-LD, `llms.txt`,
`llms-full.txt` et `cv.json` se régénèrent au build.
