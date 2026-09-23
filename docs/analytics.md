# Statistiques de pasquelin.com

## Accès et configuration

- [Google Analytics — propriété 554160025](https://analytics.google.com/analytics/web/#/a408020120p554160025/reports/intelligenthome)
- Flux Web : `G-SHZLE53XWT` (15777423148).
- [Google Tag Manager — conteneur GTM-TB35T4HS](https://tagmanager.google.com/?hl=fr#/container/accounts/6376860509/containers/264132670/workspaces/2)
- Version GTM 2 publiée le 14 septembre 2026 : une balise Google, déclenchée uniquement par `site_consent_granted`.

Le site envoie explicitement les événements avec `gtag('event', …)` et `send_to: G-SHZLE53XWT`. La copie `site_analytics` dans `dataLayer` sert à la vérification : **ne pas lui ajouter une deuxième balise GA4**, qui doublerait les événements. Ne pas coller une deuxième installation gtag dans le site.

La balise GTM désactive `send_page_view`, `allow_google_signals`, `allow_ad_personalization_signals` et `cookie_update`. `cookie_expires` vaut 15552000 secondes. La variable de couche de données `analytics.page_location` fournit une URL sans paramètres ni fragment. Les mesures améliorées automatiques du flux restent désactivées : pages, formulaires, liens et défilement sont mesurés par le site.

## Ce qui est mesuré

| Événement | Signification | Détails utiles |
| --- | --- | --- |
| `page_view` | Page affichée, y compris les navigations sans rechargement | Page, titre, langue, page précédente, mode |
| `navigation_click` | Lien interne ou navigation depuis le terminal | Destination et zone |
| `mode_change` | Changement effectif dev/humain | Nouveau mode |
| `terminal_command` | Commande exécutée | Verbe connu, jeu reconnu ou `other` |
| `easter_egg` | Animation cachée effectivement jouée | Identifiant du jeu |
| `tool_toggle` | Ouverture/fermeture terminal ou palette, clavier compris | Outil et état |
| `palette_select` | Destination choisie dans la palette | Page cible |
| `ui_interaction` | Clic sur un contrôle | Action stable, cible, zone |
| `scroll_depth` | Palier de défilement de la zone de contenu | 25, 50, 75, 90, 100 %, une fois par visite de page |
| `language_change` | Changement de langue | Destination ou langue |
| `outbound_click` | Départ vers un site externe | URL sans paramètres |
| `file_download` | Clic de téléchargement, notamment CV | Document et zone ; ne prouve pas la fin du téléchargement |
| `contact_click` | Clic e-mail/téléphone | Canal uniquement |
| `form_start` | Première interaction avec le formulaire après accord | Formulaire contact |
| `form_submit_attempt` | Tentative d’envoi | Formulaire contact |
| `form_error` | Validation refusée, quota ou erreur réseau | Catégorie de l’erreur |
| `generate_lead` | Envoi du contact accepté par le serveur | Événement clé ; ne garantit pas la livraison de l’e-mail |

Un clic peut produire une interaction puis un résultat : par exemple `ui_interaction` et `mode_change`. Pour compter les changements de mode, filtrer sur `mode_change`, pas sur tous les événements.

Les dimensions personnalisées de portée événement sont : **Mode affichage** (`display_mode`), **Action** (`action`), **Cible** (`target`), **Zone du site** (`area`) et **Profondeur de lecture** (`percent_scrolled`). Chaque événement explicite porte aussi l’URL nettoyée, la langue et le mode courant.

## Lire les résultats

- **Temps réel** : vérifier les visites et événements récents.
- **Rapports / Engagement / Événements** : comparer les commandes, jeux, changements de mode et contacts.
- **Explorer / Format libre** : lignes « Nom de l’événement », « Action », « Cible » ; colonnes « Mode affichage » ; valeurs « Nombre d’événements » et « Nombre total d’utilisateurs ».
- **Explorer / Exploration du chemin** : suivre les pages parcourues et les sorties, en choisissant le chemin de page comme type de nœud.
- Pour le formulaire, comparer `form_start` → `form_submit_attempt` → `generate_lead`, et examiner `form_error` séparément.

Les dimensions créées ne retraitent pas les anciennes données. Les rapports standards et explorations peuvent demander 24 à 48 heures avant de proposer les premières données traitées. Les essais de recette sur localhost se distinguent via le nom d’hôte ; filtrer `www.pasquelin.com` pour analyser la production.

## Consentement et limites

Le choix est proposé en français et anglais, modifiable avec **Cookies** dans la barre inférieure, conservé 180 jours. Avant accord ou après refus, aucun événement GA4 n’est envoyé. GTM lui-même est chargé pour administrer la balise. Au retrait de l’accord, les cookies GA sont supprimés et la page rechargée pour arrêter les balises déjà actives.

Aucun nom, e-mail, message, entreprise, recherche de palette ou texte libre du terminal n’est envoyé. Seuls les verbes autorisés et identifiants de jeux sont mesurés ; les autres commandes sont classées `other`. Les paramètres et fragments des URL sont retirés, y compris les paramètres de campagne UTM : l’attribution des campagnes via UTM n’est donc pas disponible dans cette configuration.

Ces statistiques décrivent les visites consenties et non bloquées par le navigateur. Elles ne constituent ni une identification nominative des visiteurs ni un enregistrement de leur écran. Les paliers de défilement indiquent du contenu atteint, pas une preuve de lecture.

## Les autres sites

`public/shared/consent.v1.js` est le bandeau de consentement et le chargeur Google Analytics des
autres sites, en un seul fichier. Il est publié par le déploiement de ce dépôt, à
[https://www.pasquelin.com/shared/consent.v1.js](https://www.pasquelin.com/shared/consent.v1.js),
et chacun des quatre autres ne porte qu'une ligne :

```html
<script defer src="https://www.pasquelin.com/shared/consent.v1.js" data-ga="G-XXXXXXXXXX"></script>
```

| Site | Propriété GA4 | Où est posée la ligne |
| --- | --- | --- |
| [www.aidesktopstudio.com](https://www.aidesktopstudio.com/) | `G-YRFNHZLMJH` | `site/template.html` du dépôt `AIDesktopStudio` |
| [www.trillion3d.com](https://www.trillion3d.com/) | `G-488KCZW3JQ` | injectée au build par `scripts/docs/measurement.ts` du dépôt `Trillion3D` |
| [pasquelin.github.io/map3D](https://pasquelin.github.io/map3D/) | `G-X64BG5H958` | `site/template.html` du dépôt `map3D` |
| [pasquelin.github.io/panels](https://pasquelin.github.io/panels/) | `G-SZ5H3MS3D4` | `site/template.html` du dépôt `panels` |

Les quatre propriétés vivent dans le compte Analytics **Site perso**, celui de `pasquelin.com`.
L'identifiant de mesure n'est pas un secret : toute page qui le porte le montre à qui lit sa
source. Il n'y a donc ni secret de dépôt ni variable d'environnement dans ce dispositif.

Ce que ce fichier garantit, et que `lib/consent-shared.test.ts` vérifie à chaque déploiement :
rien n'est demandé à Google avant un accord explicite — le mode Consentement est armé sur
`denied` et `gtag.js` n'est même pas téléchargé —, refuser efface les cookies `_ga` déjà posés,
et un identifiant absent ou mal formé ne déclenche rien du tout. Le panneau parle la langue de
la page parmi quinze, et emprunte ses couleurs, sa police et ses arrondis au site qui l'accueille
plutôt que d'imposer les siens ; un site peut passer outre avec les variables CSS `--consent-bg`,
`--consent-fg`, `--consent-accent`, `--consent-border`, `--consent-radius`, ou les attributs
`data-bg`, `data-fg`, `data-accent`, `data-border`, `data-radius` sur la balise. N'importe quel
élément portant `data-consent-settings` rouvre le panneau, comme le fait « Cookies » ici.

Ces sites ne mesurent que les pages vues, le défilement, les clics sortants et les
téléchargements, par les **mesures améliorées** du flux GA4 — aucun événement explicite, aucune
dimension personnalisée. Le dispositif complet décrit plus haut reste propre à `pasquelin.com`.

Le nom du fichier porte sa version. Une évolution qui change ce contrat devient `consent.v2.js`
et les sites migrent un par un ; le comportement de la `v1` ne change jamais en place, puisque
quatre sites déjà en ligne la chargent sans que rien ne les prévienne.

## Vérification et maintenance

`npm run test:analytics` vérifie la classification, le consentement et la suppression des données sensibles. Il est exécuté dans le workflow de production avec le typage, le lint, la compilation et les vérifications de contenu/SEO.

La recette navigateur couvre refus/acceptation/retrait, page vue unique, navigation SPA, modes, terminal connu/inconnu, palette au clavier, défilement et formulaire. Les envois du formulaire sont simulés localement : ils ne doivent pas créer de faux contacts en production. Vérifier aussi les requêtes Google `/g/collect` : destination `G-SHZLE53XWT`, URL nettoyée, événement et mode attendus.
