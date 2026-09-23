/*
 * Bandeau de consentement et mesure d'audience, en une seule copie pour tous les sites.
 *
 *   <script defer src="https://www.pasquelin.com/shared/consent.v1.js"
 *           data-ga="G-XXXXXXXXXX"></script>
 *
 * Une balise par site, l'identifiant de mesure en attribut : le script est le meme partout,
 * seule la propriete change. Il est servi depuis www.pasquelin.com, que le deploiement de ce
 * depot publie ; les autres depots n'en portent que la ligne ci-dessus.
 *
 * Ce que ce fichier garantit, et pourquoi il est ecrit a la main plutot que colle depuis
 * Google : AUCUNE requete vers Google avant un accord explicite. Le mode Consentement est
 * arme sur "denied" avant tout chargement, et gtag.js n'est meme pas demande tant que le
 * visiteur n'a pas choisi. Refuser ne laisse donc aucune trace, et retirer son accord efface
 * les cookies deja poses.
 *
 * VERSIONNE DANS LE NOM DU FICHIER. Une evolution qui casse le contrat ci-dessus devient
 * `consent.v2.js` : les sites deja en ligne continuent de servir la v1 jusqu'a ce que chacun
 * migre. Ne jamais changer le comportement de cette version en place.
 *
 * Les evenements ne sont pas mesures ici : les "mesures ameliorees" du flux GA4 couvrent
 * pages vues, defilement, clics sortants et telechargements sans une ligne de code. Le
 * dispositif complet de pasquelin.com (evenements explicites, dimensions personnalisees) vit
 * dans `lib/analytics.ts` et ne passe pas par ce fichier.
 */
(function () {
  'use strict'

  /* `currentScript` designe la balise en cours d'execution, y compris en `defer`. Le repli
     couvre le cas ou le script serait charge autrement (injection, module). */
  var tag = document.currentScript || document.querySelector('script[data-ga]')
  var id = tag && tag.getAttribute('data-ga')
  if (!id || !/^G-[A-Z0-9]+$/.test(id)) return

  var COOKIE = 'site-analytics'
  var MAX_AGE = 60 * 60 * 24 * 180 // 6 mois, la duree annoncee dans le bandeau
  var POLICY = 'https://policies.google.com/technologies/partner-sites'

  /* Le bandeau parle la langue de la page, pas celle du navigateur : c'est la page que le
     visiteur a sous les yeux. Les quinze langues sont celles de la vitrine d'AI Desktop
     Studio ; une langue inconnue retombe sur l'anglais. */
  var TEXT = {
    fr: ['Mesure d’audience', 'Avec votre accord, Google Analytics dépose des cookies pour mesurer la fréquentation de ce site. Votre choix est conservé 6 mois.', 'Accepter', 'Refuser', 'Utilisation des données par Google'],
    en: ['Audience measurement', 'With your permission, Google Analytics uses cookies to measure visits to this site. Your choice is kept for 6 months.', 'Accept', 'Decline', 'How Google uses data'],
    de: ['Reichweitenmessung', 'Mit Ihrer Zustimmung verwendet Google Analytics Cookies, um die Besuche dieser Website zu messen. Ihre Wahl wird 6 Monate gespeichert.', 'Akzeptieren', 'Ablehnen', 'Wie Google Daten verwendet'],
    es: ['Medición de audiencia', 'Con su permiso, Google Analytics utiliza cookies para medir las visitas a este sitio. Su elección se conserva durante 6 meses.', 'Aceptar', 'Rechazar', 'Cómo usa Google los datos'],
    it: ['Misurazione del pubblico', 'Con il tuo consenso, Google Analytics utilizza i cookie per misurare le visite a questo sito. La tua scelta viene conservata per 6 mesi.', 'Accetta', 'Rifiuta', 'Come Google utilizza i dati'],
    pt: ['Medição de audiência', 'Com a sua autorização, o Google Analytics utiliza cookies para medir as visitas a este site. A sua escolha é guardada durante 6 meses.', 'Aceitar', 'Recusar', 'Como a Google utiliza os dados'],
    ru: ['Измерение аудитории', 'С вашего согласия Google Analytics использует файлы cookie для подсчёта посещений этого сайта. Ваш выбор сохраняется 6 месяцев.', 'Принять', 'Отклонить', 'Как Google использует данные'],
    ja: ['アクセス解析', '同意いただける場合、Google アナリティクスが Cookie を使用してこのサイトの訪問数を測定します。選択内容は 6 か月間保存されます。', '同意する', '拒否する', 'Google によるデータの使用'],
    ko: ['방문자 측정', '동의하시면 Google 애널리틱스가 쿠키를 사용해 이 사이트의 방문을 측정합니다. 선택은 6개월간 저장됩니다.', '동의', '거부', 'Google의 데이터 사용 방식'],
    zh: ['访问量统计', '在您同意后，Google Analytics 将使用 Cookie 统计本站的访问量。您的选择将保存 6 个月。', '同意', '拒绝', 'Google 如何使用数据'],
    ar: ['قياس الزيارات', 'بموافقتك، يستخدم Google Analytics ملفات تعريف الارتباط لقياس زيارات هذا الموقع. يُحفظ اختيارك لمدة 6 أشهر.', 'موافقة', 'رفض', 'كيف تستخدم Google البيانات'],
    hi: ['दर्शक मापन', 'आपकी अनुमति से, Google Analytics इस साइट की विज़िट मापने के लिए कुकीज़ का उपयोग करता है। आपका चयन 6 महीने तक सहेजा जाता है।', 'स्वीकार करें', 'अस्वीकार करें', 'Google डेटा का उपयोग कैसे करता है'],
    id: ['Pengukuran pengunjung', 'Dengan izin Anda, Google Analytics menggunakan cookie untuk mengukur kunjungan ke situs ini. Pilihan Anda disimpan selama 6 bulan.', 'Terima', 'Tolak', 'Cara Google menggunakan data'],
    tr: ['Ziyaretçi ölçümü', 'İzninizle Google Analytics, bu sitenin ziyaretlerini ölçmek için çerez kullanır. Seçiminiz 6 ay boyunca saklanır.', 'Kabul et', 'Reddet', 'Google verileri nasıl kullanır'],
    vi: ['Đo lường lượt truy cập', 'Khi bạn đồng ý, Google Analytics sử dụng cookie để đo lường lượt truy cập trang này. Lựa chọn của bạn được lưu trong 6 tháng.', 'Đồng ý', 'Từ chối', 'Cách Google sử dụng dữ liệu']
  }

  /* Deux lettres minuscules, quoi que porte l'attribut : « pt-BR » comme « FR » doivent
     trouver leur dictionnaire, et une page sans `lang` ne doit pas faire tomber le script. */
  function pageLang() {
    return String(document.documentElement.lang || '').slice(0, 2).toLowerCase()
  }

  function words() {
    return TEXT[pageLang()] || TEXT.en
  }

  /* ------------------------------------------------------------------ apparence
   *
   * Le panneau emprunte ses couleurs a la page qui l'accueille plutot que d'imposer les
   * siennes : le meme fichier s'affiche sur une vitrine sombre, un portail clair et deux
   * pages GitHub, et un encart generique jurerait sur au moins l'un des quatre. Rien n'est
   * emprunte aux feuilles de style du site — elles ne sont pas les memes d'un depot a
   * l'autre — mais tout est LU sur le rendu final, ce qui revient au meme sans couplage.
   *
   * L'ordre des sources va du plus explicite au plus devine :
   *   1. les variables CSS `--consent-*`, si le site en declare ;
   *   2. les attributs `data-*` de la balise, pour regler un site sans toucher a son CSS ;
   *   3. ce qui est mesure sur la page (fond, texte, police, couleur de lien, arrondi) ;
   *   4. un repli sobre, accorde au theme clair ou sombre du systeme.
   */

  function fromRgb(text) {
    var match = /^rgba?\(([^)]+)\)/.exec(text)
    if (!match) return null
    var n = match[1].split(/[\s,\/]+/).filter(Boolean).map(parseFloat)
    if (n.length < 3 || n.some(isNaN)) return null
    if (n.length > 3 && n[3] === 0) return null // transparent : ne renseigne rien
    return [n[0], n[1], n[2]]
  }

  /* Un canevas 1x1 sert de traducteur : la couleur y est PEINTE, puis le pixel relu en rouge,
     vert, bleu. Tout ce que le navigateur sait lire passe ainsi — `oklch()`, `color(srgb ...)`,
     `lab()` —, alors que relire `fillStyle` rendrait la notation d'origine telle quelle, ce qui
     n'apprend rien. Sans ce detour, un site ecrit avec les couleurs modernes — Trillion3D l'est
     — ne renseignerait rien et le panneau retomberait sur ses couleurs de repli, ce qui est
     exactement ce qu'on cherche a eviter.

     La couleur est peinte deux fois, sur fond noir puis sur fond blanc : une valeur que le
     navigateur refuse laisse le fond en place et les deux lectures divergent, au lieu de faire
     passer ce fond pour la couleur du site. Une couleur translucide diverge de meme, et ne
     renseigne donc rien — c'est voulu, elle depend de ce qu'il y a derriere. */
  var brush = null
  function painted(text, over) {
    brush.fillStyle = over
    brush.fillRect(0, 0, 1, 1)
    brush.fillStyle = over
    brush.fillStyle = text
    brush.fillRect(0, 0, 1, 1)
    var data = brush.getImageData(0, 0, 1, 1).data
    return [data[0], data[1], data[2]]
  }

  function fromCanvas(text) {
    try {
      if (brush === null) {
        var canvas = document.createElement('canvas')
        canvas.width = canvas.height = 1
        brush = (canvas.getContext && canvas.getContext('2d')) || false
      }
      if (!brush) return null
      var onBlack = painted(text, '#000000')
      var onWhite = painted(text, '#ffffff')
      for (var i = 0; i < 3; i++) if (Math.abs(onBlack[i] - onWhite[i]) > 1) return null
      return onBlack
    } catch {
      /* Un canevas indisponible ne renseigne rien : l'appelant retombe sur la source suivante. */
      return null
    }
  }

  /* Rend `[r, g, b]`, ou `null` quand la valeur ne renseigne rien — absente, transparente ou
     illisible. L'appelant retombe alors sur la source suivante. */
  function parse(value) {
    var text = String(value || '').trim()
    if (!text) return null
    return fromRgb(text) || fromCanvas(text)
  }

  function rgb(color) { return 'rgb(' + Math.round(color[0]) + ',' + Math.round(color[1]) + ',' + Math.round(color[2]) + ')' }

  function mix(from, to, ratio) {
    return [
      from[0] + (to[0] - from[0]) * ratio,
      from[1] + (to[1] - from[1]) * ratio,
      from[2] + (to[2] - from[2]) * ratio
    ]
  }

  /* Luminance relative simplifiee : elle ne sert qu'a trancher clair/sombre, pas a calculer
     un rapport de contraste. */
  function light(color) {
    return (0.2126 * color[0] + 0.7152 * color[1] + 0.0722 * color[2]) / 255 > 0.5
  }

  var WHITE = [255, 255, 255]
  var BLACK = [0, 0, 0]

  function custom(name) {
    var value = getComputedStyle(document.documentElement).getPropertyValue('--consent-' + name)
    return value ? value.trim() : ''
  }

  function setting(name) {
    return custom(name) || (tag.getAttribute('data-' + name) || '').trim()
  }

  /* Remonte jusqu'a trouver un fond reellement peint : un `body` transparent laisse voir
     celui de `html`, et une page peut n'en declarer aucun. */
  function background() {
    var nodes = [document.body, document.documentElement]
    for (var i = 0; i < nodes.length; i++) {
      var color = nodes[i] && parse(getComputedStyle(nodes[i]).backgroundColor)
      if (color) return color
    }
    return null
  }

  /* La couleur d'accent se lit sur un lien du contenu : c'est le seul endroit ou un site
     montre sa couleur vive de maniere fiable. `theme-color` ne convient pas — il porte
     presque toujours la couleur de FOND. Un lien qui ne se distingue pas du texte courant
     n'apprend rien, et le repli prend la main. */
  function saturation(color) {
    return Math.max(color[0], color[1], color[2]) - Math.min(color[0], color[1], color[2])
  }

  function distance(a, b) {
    return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2])
  }

  function accentOf(fg, base, dark) {
    var candidates = document.querySelectorAll('a[href], button')
    var neutral = null
    for (var i = 0; i < candidates.length && i < 24; i++) {
      var style = getComputedStyle(candidates[i])
      /* Le fond d'abord : la couleur de marque d'un site est sur son bouton d'action, dont le
         TEXTE est presque toujours blanc. Ne lire que `color` rendait blanc sur une vitrine
         dont le bouton est bleu. Un fond doit toutefois se detacher de la page, sans quoi on
         releve le fond de la page elle-meme sur un bouton qui n'en a pas. */
      var fill = parse(style.backgroundColor)
      if (fill && saturation(fill) > 25 && distance(fill, base) > 60) return fill

      var ink = parse(style.color)
      if (!ink || distance(ink, fg) < 60) continue
      /* Une couleur franche est celle que le site a choisie ; un gris plus clair que le texte
         n'est qu'une nuance de la meme encre, garde en second choix. */
      if (saturation(ink) > 25) return ink
      if (!neutral) neutral = ink
    }
    return neutral || (dark ? [138, 180, 248] : [26, 86, 219])
  }

  /* L'arrondi du site, releve sur un de ses boutons : c'est ce qui trahit le plus vite un
     encart etranger a la page. */
  function radiusOf() {
    var nodes = document.querySelectorAll('button, .btn, [role="button"]')
    for (var i = 0; i < nodes.length && i < 8; i++) {
      var value = getComputedStyle(nodes[i]).borderRadius
      var size = parseFloat(value)
      if (size > 0 && size < 40) return Math.min(size + 4, 20) + 'px'
    }
    return '12px'
  }

  function theme() {
    var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    var page = background()
    var dark = page ? !light(page) : !!prefersDark
    var base = page || (dark ? [18, 20, 24] : [255, 255, 255])

    var text = parse(document.body && getComputedStyle(document.body).color)
    var fg = text || (dark ? [230, 232, 236] : [26, 29, 33])

    /* Une surface legerement decalee du fond : assez proche pour appartenir a la page,
       assez distincte pour se lire comme un encart pose dessus. */
    var surface = mix(base, dark ? WHITE : BLACK, dark ? 0.08 : 0.02)
    var border = mix(surface, dark ? WHITE : BLACK, 0.16)
    var accent = accentOf(fg, base, dark)

    return {
      dark: dark,
      bg: setting('bg') || rgb(surface),
      fg: setting('fg') || rgb(fg),
      muted: rgb(mix(fg, base, 0.25)),
      border: setting('border') || rgb(border),
      accent: setting('accent') || rgb(accent),
      /* Le fond du bouton d'accord : l'accent a peine pose sur la surface, pour rester
         lisible avec la couleur de texte de la page quelle qu'elle soit. */
      accentSoft: rgb(mix(surface, accent, dark ? 0.22 : 0.14)),
      font: setting('font') || (document.body && getComputedStyle(document.body).fontFamily) ||
        'system-ui,-apple-system,Segoe UI,Roboto,sans-serif',
      radius: setting('radius') || radiusOf(),
      shadow: dark ? '0 10px 40px rgba(0,0,0,.45)' : '0 10px 40px rgba(0,0,0,.14)'
    }
  }

  /* ------------------------------------------------------------------ consentement */

  function readChoice() {
    var parts = document.cookie.split('; ')
    for (var i = 0; i < parts.length; i++) {
      if (parts[i].indexOf(COOKIE + '=') === 0) {
        var value = parts[i].slice(COOKIE.length + 1)
        if (value === 'granted' || value === 'denied') return value
      }
    }
    return null
  }

  /* La file `dataLayer` existe avant gtag.js : les ordres passes maintenant sont rejoues dans
     l'ordre au chargement. C'est ce qui permet d'armer le refus par defaut sans avoir rien
     demande a Google. */
  window.dataLayer = window.dataLayer || []
  var gtag = window.gtag || function () { window.dataLayer.push(arguments) }
  window.gtag = gtag

  gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied'
  })

  var loaded = false
  function load() {
    if (loaded) return
    loaded = true
    gtag('consent', 'update', { analytics_storage: 'granted' })
    var script = document.createElement('script')
    script.async = true
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id)
    document.head.appendChild(script)
    gtag('js', new Date())
    /* Le chemin suffit a situer une page ; les parametres d'URL peuvent porter un jeton ou
       une recherche, et n'ont rien a faire dans des statistiques de frequentation. */
    gtag('config', id, { page_location: location.origin + location.pathname })
  }

  /* Un cookie pose par gtag.js l'a ete sur le domaine du site ou sur son domaine parent ; on
     efface les deux, sans quoi le refus laisserait l'identifiant en place. */
  function forget() {
    var parts = location.hostname.split('.')
    var names = document.cookie.split('; ')
    for (var i = 0; i < names.length; i++) {
      var name = names[i].split('=')[0]
      if (name !== '_ga' && name.indexOf('_ga_') !== 0) continue
      for (var j = 0; j < parts.length; j++) {
        document.cookie = name + '=; Max-Age=0; Path=/; Domain=' + parts.slice(j).join('.')
      }
      document.cookie = name + '=; Max-Age=0; Path=/'
    }
  }

  function choose(choice) {
    var wasGranted = readChoice() === 'granted'
    document.cookie = COOKIE + '=' + choice + '; Max-Age=' + MAX_AGE + '; Path=/; SameSite=Lax' +
      (location.protocol === 'https:' ? '; Secure' : '')
    close()
    if (choice === 'granted') { load(); return }
    gtag('consent', 'update', { analytics_storage: 'denied' })
    forget()
    /* Un document neuf est le seul moyen de decharger une balise deja active : la retirer du
       DOM ne defait pas ce qu'elle a installe. */
    if (wasGranted) location.reload()
  }

  /* ------------------------------------------------------------------ panneau */

  var panel = null
  function close() {
    if (panel && panel.parentNode) panel.parentNode.removeChild(panel)
    panel = null
  }

  function show() {
    if (panel || !document.body) return
    var t = words()
    var s = theme()
    var rtl = document.documentElement.dir === 'rtl' || pageLang() === 'ar'
    var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

    panel = document.createElement('div')
    panel.setAttribute('role', 'dialog')
    panel.setAttribute('aria-label', t[0])
    panel.dir = rtl ? 'rtl' : 'ltr'
    panel.style.cssText = [
      'position:fixed', 'z-index:2147483000', 'bottom:16px', 'left:16px', 'right:16px',
      'width:auto', 'max-width:23rem', 'box-sizing:border-box',
      rtl ? 'margin-right:auto' : 'margin-left:auto',
      'padding:18px 20px',
      'border-radius:' + s.radius,
      'background:' + s.bg, 'color:' + s.fg, 'border:1px solid ' + s.border,
      'box-shadow:' + s.shadow,
      'font-family:' + s.font, 'font-size:14px', 'line-height:1.5',
      'color-scheme:' + (s.dark ? 'dark' : 'light'),
      'opacity:' + (still ? '1' : '0'),
      still ? '' : 'transform:translateY(6px)',
      still ? '' : 'transition:opacity .18s ease,transform .18s ease'
    ].filter(Boolean).join(';')

    var title = document.createElement('strong')
    title.textContent = t[0]
    title.style.cssText = 'display:block;margin-bottom:6px;font-size:15px;font-weight:600'

    var body = document.createElement('p')
    body.textContent = t[1]
    body.style.cssText = 'margin:0 0 10px;color:' + s.muted

    var policy = document.createElement('a')
    policy.href = POLICY
    policy.target = '_blank'
    policy.rel = 'noopener noreferrer'
    policy.textContent = t[4]
    policy.style.cssText = 'color:' + s.accent + ';text-decoration:underline;text-underline-offset:3px'

    var row = document.createElement('div')
    row.style.cssText = 'display:flex;gap:10px;margin-top:14px'

    /* Refuser doit etre aussi simple qu'accepter : meme taille, meme rang, meme typographie,
       un seul clic. Seul le fond differe, d'une nuance ; les deux restent egalement lisibles
       et egalement evidents. */
    function button(label, choice, accented) {
      var element = document.createElement('button')
      element.type = 'button'
      element.textContent = label
      element.style.cssText = [
        'flex:1', 'padding:9px 12px', 'cursor:pointer',
        'border-radius:calc(' + s.radius + ' - 4px)',
        'border:1px solid ' + (accented ? s.accent : s.border),
        'background:' + (accented ? s.accentSoft : 'transparent'),
        'color:' + s.fg, 'font:inherit', 'font-weight:500'
      ].join(';')
      element.addEventListener('click', function () { choose(choice) })
      return element
    }

    row.appendChild(button(t[3], 'denied', false))
    row.appendChild(button(t[2], 'granted', true))
    panel.appendChild(title)
    panel.appendChild(body)
    panel.appendChild(policy)
    panel.appendChild(row)
    document.body.appendChild(panel)

    /* Meme raison qu'au-dessus : une frame n'arrive pas dans un onglet cache, et le panneau
       resterait a l'opacite zero. */
    if (!still) setTimeout(function () {
      if (!panel) return
      panel.style.opacity = '1'
      panel.style.transform = 'translateY(0)'
    }, 20)
  }

  /* Le panneau attend que la page soit peinte pour se construire, et pas seulement analysee.
     Les couleurs qu'il releve seraient sinon celles d'un etat transitoire : le portail de
     Trillion3D ouvre sa page en theme clair, dans le HTML, et bascule en sombre depuis son
     script — un panneau construit avant se serait accorde a un theme deja disparu. Les
     relever a chaque ouverture suffit ensuite a suivre un site qui rebascule. */
  function whenPainted(run) {
    var fired = false
    /* `setTimeout` et non `requestAnimationFrame` : dans un onglet ouvert en arriere-plan, le
       navigateur ne peint pas et n'appelle donc jamais de frame — le panneau n'apparaitrait
       qu'au retour du visiteur, ou jamais. */
    var settle = function () {
      if (fired) return
      fired = true
      setTimeout(run, 60)
    }
    if (document.readyState === 'complete') return settle()
    /* Au premier des deux : `load` attend les images et la 3D d'une vitrine, ce qui ferait
       trop attendre, et le seul DOM arrive avant les scripts qui posent le theme. */
    window.addEventListener('load', settle, { once: true })
    var afterDom = function () { setTimeout(settle, 300) }
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', afterDom, { once: true })
    } else afterDom()
  }

  function open() {
    if (panel) return
    whenPainted(show)
  }

  var choice = readChoice()
  if (choice === 'granted') load()
  else if (choice === null) open()

  /* De quoi revenir sur son choix : n'importe quel element portant `data-consent-settings`
     rouvre le panneau, et la fonction globale sert aux pages qui preferent l'appeler. */
  window.consentSettings = open
  document.addEventListener('click', function (event) {
    var node = event.target
    while (node && node !== document) {
      if (node.hasAttribute && node.hasAttribute('data-consent-settings')) {
        event.preventDefault()
        open()
        return
      }
      node = node.parentNode
    }
  })
})()
