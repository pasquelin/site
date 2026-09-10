<div align="center">

# pasquelin.com

**Le site personnel d'Alban Pasquelin — architecte logiciel freelance.**
Un CV rendu comme une fenêtre d'éditeur, pré-rendu en HTML statique pour qu'un robot qui n'exécute aucun JavaScript en lise quand même chaque mot.

[![Next.js](https://img.shields.io/badge/Next.js-16.3-2b2d30?logo=next.js&logoColor=ffffff)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.2-2b2d30?logo=react&logoColor=61dafb)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5%20strict-2b2d30?logo=typescript&logoColor=3178c6)](tsconfig.json)
[![three.js](https://img.shields.io/badge/three.js-0.186-2b2d30?logo=three.js&logoColor=ffffff)](https://threejs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-2b2d30?logo=tailwindcss&logoColor=38bdf8)](https://tailwindcss.com)
[![Export statique](https://img.shields.io/badge/sortie-export%20statique-2b2d30?logo=vercel&logoColor=ffffff)](next.config.ts)
[![Licence](https://img.shields.io/badge/code-MIT%20%C2%B7%20contenu%20r%C3%A9serv%C3%A9-2b2d30)](LICENSE)

**[Site en ligne ↗](https://pasquelin.com)** · **[Documentation 🇬🇧](README.md)** · **[llms.txt ↗](https://pasquelin.com/llms.txt)** · **[cv.json ↗](https://pasquelin.com/cv.json)** · **[→ AI Desktop Studio](https://www.aidesktopstudio.com/)**

</div>

---

## Ce que contient ce dépôt

Le site de **pasquelin.com**, en français et en anglais. C'est un CV, et il s'adresse à deux
lecteurs à la fois.

**Un humain** reçoit une fenêtre d'éditeur : barre d'activité, onglets, barre d'état, un terminal
qui répond à de vraies commandes et une palette `⌘K`. Qui n'en veut pas tape `mode humain` : tout
l'habillage éditeur disparaît et il reste un CV lisible.

**Une machine** reçoit du HTML complet. GPTBot, ClaudeBot, PerplexityBot et CCBot n'exécutent pas
de script : ce qui n'est pas dans le fichier servi n'existe pas pour eux. Chaque route est donc
pré-rendue (`output: 'export'`), porte un graphe d'identité JSON-LD, et est doublée de fichiers
écrits pour des modèles plutôt que pour des lecteurs — `llms.txt`, `llms-full.txt`, `cv.json`.
`npm run verify:crawl` fait échouer le build si les mots d'une page manquent à son HTML : la
propriété ne peut pas se perdre par accident.

## Le contenu est la source

Tout ce que produit le site vient de `content/`. Les pages, le JSON-LD, `llms.txt`,
`llms-full.txt`, `cv.json` et le sitemap en dérivent tous : rien n'est écrit deux fois, donc rien
ne peut diverger.

| Module | Ce qu'il contient |
| --- | --- |
| `content/site.ts` | Domaine, langues, identité, profils, disponibilité, TJM, interrupteurs |
| `content/profile.ts` | Accroche, pitch, la phrase qu'un modèle doit citer, chiffres, distinctions, formation |
| `content/experience.ts` | 8 missions — GoSecure, RetroRoads, Ardian, e-TF1 (Edito et MyTF1), Innso, Molotov TV, débuts |
| `content/projects.ts` | 7 projets — AI Desktop Studio, map3D, panels, media-studio, Enigma Cube, plugins map3D, fine-tuning LLM local |
| `content/ai.ts` | La page « Travailler avec l'IA » |
| `content/scenes.ts` | Titres et légendes écrites des sept scènes 3D |
| `content/nav.ts`, `content/ui.ts` | Entrées de navigation et textes d'interface |
| `content/types.ts` | Le contrat de contenu que respectent tous les modules ci-dessus |
| `content/MISSING.md` | Les faits du CV encore manquants, énoncés plutôt qu'approximés |

Chaque expérience et chaque projet porte une `answer` : une phrase autonome, factuelle et datée,
écrite pour survivre à son extraction hors de la page. C'est celle qu'un modèle de langage cite.

## L'interface

- **Terminal** — `aide`, `ls`, `open <nom>`, `cv`, `contact`, `mode humain|dev`, `lang fr|en`,
  `clear`. Plusieurs sessions, chacune avec son historique, et un séparateur déplaçable.
- **Palette de commandes** — `⌘K` / `Ctrl K`.
- **Un seul catalogue** — le terminal, la palette et la barre d'onglets lisent tous
  `lib/catalog.ts` : une page nouvelle apparaît dans les trois d'un coup.
- **Sept scènes Three.js**, une par mission ou projet : trois flux de code qui convergent, une
  alerte qui se propage aux intervenants, une migration Vue → React où la barre de disponibilité
  ne bouge jamais, la constellation des 310 actions MCP. Chacune ne se monte qu'à l'écran, jamais
  en mouvement réduit ni sur petit écran. La légende de chaque scène est dans le DOM avant tout
  chargement WebGL : un robot, un lecteur d'écran et un visiteur en mouvement réduit reçoivent le
  schéma en mots.

## Routes

40 pages de contenu — 20 par langue, chacune déclarant sa jumelle en `hreflang`.

| Route | Rôle |
| --- | --- |
| `/` | Pointe vers `/fr/` et la déclare canonique (redirection dans `vercel.json`, repli statique écrit par `postbuild`) |
| `/{fr,en}/` | Profil |
| `/{fr,en}/experience/` et `/experience/[slug]/` | Les 8 missions |
| `/{fr,en}/projects/` et `/projects/[slug]/` | Les 7 projets |
| `/{fr,en}/ai/` | Travailler avec l'IA |
| `/{fr,en}/contact/` | Formulaire de contact |

## Écrit pour les machines

| Fichier | Écrit par | Rôle |
| --- | --- | --- |
| `public/llms.txt` | `scripts/generate-machine-files.ts` | L'index court : qui, quoi, liens |
| `public/llms-full.txt` | idem | Le contenu complet, deux langues, en un fichier |
| `public/cv.json` | idem | Le CV en données structurées |
| `sitemap.xml` | `app/sitemap.ts` | Chaque page, dans les deux langues, avec ses alternates |
| `robots.txt` | `app/robots.ts` | **Autorise** explicitement 16 robots d'IA au lieu de les bloquer |
| JSON-LD | `lib/jsonld.ts` | `Person`, `ProfilePage`, `Article`, `SoftwareApplication`, `FAQPage`, `BreadcrumbList` — `sameAs` relie tous les profils à une seule entité |

## Démarrer

Prérequis : Node 20 ou plus, npm.

```bash
npm install
npm run dev       # http://localhost:3000 → /fr/
```

```bash
npm run build     # génère les fichiers machine, exporte dans out/, puis vérifie la lisibilité robot
npm start         # sert out/ en local
```

| Script | Ce qu'il fait |
| --- | --- |
| `dev` | Serveur de développement Next |
| `prebuild` | Écrit `llms.txt`, `llms-full.txt` et `cv.json` depuis `content/` |
| `build` | Export statique dans `out/` |
| `postbuild` | Écrit le document racine, puis lance la vérification de lisibilité |
| `verify:crawl` | Échoue si les mots d'une page manquent au HTML servi |
| `typecheck` | `tsc --noEmit` |
| `lint` | ESLint (`eslint-config-next`) |

## Structure

```
app/[lang]/          Les routes, un dossier par section ; robots.ts et sitemap.ts à côté
components/ide/      L'éditeur : barre de titre, onglets, barre d'activité, rail, terminal, palette
components/three/    Le montage des scènes et les sept scènes
components/ui/       Article, bloc réponse, chiffres, inspecteur, vue source, formulaire
content/             La source unique — tout le site en dérive
lib/                 Catalogue, i18n, métadonnées SEO, JSON-LD, générateur déterministe
scripts/             Fichiers machine, document racine, vérification de lisibilité
```

## Déploiement

Export statique sur Vercel. `vercel.json` redirige `/` vers `/fr/` et sert les fichiers
`llms*.txt` en `text/plain; charset=utf-8`. Le domaine tient en une ligne — `SITE_URL` dans
`content/site.ts` : on le change et les pages, les canoniques, le sitemap, le JSON-LD et les
fichiers machine suivent.

Trois interrupteurs relèvent d'une décision commerciale plutôt que technique :

| Interrupteur | Où | Effet |
| --- | --- | --- |
| `SHOW_PHONE` | `content/site.ts` | Publie le numéro de mobile, ou le retire partout |
| `SHOW_RATES` | `content/site.ts` | Publie les fourchettes de TJM, ou les retire partout |
| `NEXT_PUBLIC_CONTACT_ENDPOINT` | environnement | URL Formspree/Web3Forms ; sans valeur, le formulaire retombe sur le client mail du visiteur |

## Manques connus

- `lib/seo.ts` pointe les cartes Open Graph et Twitter vers `/og.png`, qui **n'est pas** dans
  `public/`. Les aperçus sociaux tombent sur une image absente tant qu'elle n'est pas ajoutée.
- `content/MISSING.md` liste les faits du CV encore inconnus : l'année du Grand prix Stratégies du
  digital, les résultats RetroRoads (bêta privée) et une entrée Ardian trop mince.
- Aucune suite de tests. `verify:crawl` est le seul garde-fou automatique, et il ne couvre que la
  lisibilité par un robot.

## Licence

Code source sous **licence MIT**. Le contenu éditorial — les textes de `content/`, les données du
CV, les coordonnées et les fichiers qui en sont générés — est **© Alban Pasquelin, tous droits
réservés**. Voir [LICENSE](LICENSE).
