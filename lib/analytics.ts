export type Consent = 'granted' | 'denied' | null
export const CONSENT_COOKIE = 'site-analytics'
export const CONSENT_EVENT = 'site-consent-change'
export const SETTINGS_EVENT = 'site-cookie-settings'
export const CONSENT_MAX_AGE = 60 * 60 * 24 * 180
export const GA_MEASUREMENT_ID = 'G-SHZLE53XWT'

type EventName = 'page_view' | 'navigation_click' | 'language_change' | 'outbound_click' | 'contact_click' | 'file_download' | 'ui_interaction' | 'scroll_depth' | 'form_start' | 'form_submit_attempt' | 'form_error' | 'generate_lead' | 'terminal_command' | 'mode_change' | 'palette_select' | 'easter_egg' | 'tool_toggle'
type Parameters = { action?: string; target?: string; area?: string; percent_scrolled?: number; page_referrer?: string; display_mode?: 'dev' | 'human' }

declare global {
  interface Window {
    [key: `ga-disable-${string}`]: boolean | undefined
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

export function safeUrl(raw: string, base?: string): string {
  try {
    const url = new URL(raw, base)
    return /^https?:$/.test(url.protocol) ? `${url.origin}${url.pathname}` : ''
  } catch { return '' }
}

export function linkEvent(href: string, base: string, download = false): { name: EventName; target: string } | null {
  if (href.startsWith('mailto:')) return { name: 'contact_click', target: 'email' }
  if (href.startsWith('tel:')) return { name: 'contact_click', target: 'phone' }
  if (!href || href.startsWith('#')) return null
  const target = safeUrl(href, base)
  if (!target) return null
  const url = new URL(target)
  const current = new URL(base)
  const name = download || /\.pdf$/i.test(url.pathname) ? 'file_download'
    : url.origin !== current.origin ? 'outbound_click'
    : /^\/(fr|en)\//.test(url.pathname) && url.pathname.split('/')[1] !== current.pathname.split('/')[1] ? 'language_change'
    : 'navigation_click'
  return { name, target }
}

export function consentFromCookie(cookies: string): Consent {
  const value = cookies.split('; ').find((cookie) => cookie.startsWith(`${CONSENT_COOKIE}=`))?.split('=')[1]
  return value === 'granted' || value === 'denied' ? value : null
}

export function readConsent(): Consent {
  return consentFromCookie(document.cookie)
}

export function track(name: EventName, parameters: Parameters = {}) {
  if (typeof window === 'undefined' || readConsent() !== 'granted') return
  try {
    const page = new URL(location.href)
    let mode = 'dev'
    try { if (localStorage.getItem('ide-mode') === 'human') mode = 'human' } catch { /* default mode */ }
    window.dataLayer = window.dataLayer ?? []
    // Reset optional values so GTM never reuses a previous event's properties.
    window.dataLayer.push({ analytics: null })
    const analytics = {
        page_location: safeUrl(page.href),
        page_path: page.pathname,
        language: document.documentElement.lang,
        page_title: document.title,
        action: parameters.action ?? '',
        target: parameters.target ?? '',
        area: parameters.area ?? '',
        percent_scrolled: parameters.percent_scrolled ?? 0,
        page_referrer: parameters.page_referrer ?? '',
        display_mode: parameters.display_mode ?? mode,
    }
    window.dataLayer.push({ event: 'site_analytics', analytics: { name, ...analytics } })
    // GTM loads the Google tag only after consent. gtag queues events until ready.
    window.gtag?.('event', name, { ...analytics, send_to: GA_MEASUREMENT_ID })
  } catch {
    // An unavailable or blocked analytics provider must never break the site.
  }
}

export function applyConsent(consent: Exclude<Consent, null>) {
  window[`ga-disable-${GA_MEASUREMENT_ID}`] = consent !== 'granted'
  window.gtag?.('consent', 'update', { analytics_storage: consent })
  if (consent === 'granted') {
    window.dataLayer?.push({ event: 'site_consent_granted', analytics: { page_location: safeUrl(location.href) } })
  }
}

export function saveConsent(consent: Exclude<Consent, null>) {
  const wasGranted = readConsent() === 'granted'
  document.cookie = `${CONSENT_COOKIE}=${consent}; Max-Age=${CONSENT_MAX_AGE}; Path=/; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`
  if (consent === 'denied') {
    applyConsent(consent)
    const parts = location.hostname.split('.')
    for (const cookie of document.cookie.split('; ')) {
      const name = cookie.split('=')[0]
      if (name !== '_ga' && !name.startsWith('_ga_')) continue
      for (const domain of ['', ...parts.map((_, i) => `; Domain=${parts.slice(i).join('.')}`)]) {
        document.cookie = `${name}=; Max-Age=0; Path=/${domain}`
      }
    }
    // A fresh document unloads already running Google tags after withdrawal.
    if (wasGranted) location.reload()
  }
  window.dispatchEvent(new Event(CONSENT_EVENT))
}
