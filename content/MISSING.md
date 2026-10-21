# Contenu à compléter

Le parcours vient du CV et rien n'y est inventé : un champ inconnu ne
s'affiche pas plutôt que d'être approximé.

## Encore inconnu

- **Grand prix Stratégies du digital** — année manquante. L'entrée s'affiche
  sans date dans la liste des distinctions.
- **RetroRoads** — le produit est en bêta privée, donc les chiffres de
  résultat manquent. La page tient sur l'architecture.
- **Business Lab** : ni le CV ni LinkedIn ne donnent les dates. La mission
  s'affiche sans période. Infopro Digital, Staffmatch, Equidia, Arte et
  Amplement sont datés d'après le profil LinkedIn.
- **Ardian** — deux lignes seulement dans le CV. C'est la page la plus mince
  du parcours ; un ou deux résultats chiffrés la mettraient à niveau.

## À valider

Rédigés d'après les retours sur le site, en attente de confirmation :

- **Formats de mission** (`ENGAGEMENTS` dans `content/profile.ts`) : régie à
  3 ou 4 jours par semaine, CTO à temps partagé, audit au forfait de 5 à
  10 jours. `AVAILABILITY.when` annonce aussi le temps partiel.
- **Engagements de méthode** (`WAYS_OF_WORKING`) : la démo chaque semaine.
- **Usage de l'IA** (`AI_AT_WORK` dans `content/ai.ts`) : les modèles en local
  pour le code sensible.
- **Témoignages** (`TESTIMONIALS`) : recommandations Malt publiques, citées en
  entier. Prévenir Anthony C. et Fatih K., et demander s'ils acceptent que
  l'entreprise de la mission soit nommée.

## À décider

- `SHOW_PHONE` et `SHOW_RATES` dans `content/site.ts` sont à `true`. Le numéro
  de mobile et les fourchettes de TJM sont donc publics — sur la page, dans le
  JSON-LD, dans la FAQ et dans `llms.txt`. Passer l'un à `false` le retire
  partout.

## Comment compléter

Tout se modifie dans `content/`. Le site, le JSON-LD, `llms.txt`,
`llms-full.txt` et `cv.json` se régénèrent au build.
