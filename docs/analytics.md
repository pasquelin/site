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

## Vérification et maintenance

`npm run test:analytics` vérifie la classification, le consentement et la suppression des données sensibles. Il est exécuté dans le workflow de production avec le typage, le lint, la compilation et les vérifications de contenu/SEO.

La recette navigateur couvre refus/acceptation/retrait, page vue unique, navigation SPA, modes, terminal connu/inconnu, palette au clavier, défilement et formulaire. Les envois du formulaire sont simulés localement : ils ne doivent pas créer de faux contacts en production. Vérifier aussi les requêtes Google `/g/collect` : destination `G-SHZLE53XWT`, URL nettoyée, événement et mode attendus.
