'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import type { Lang } from '@/content/types'
import { applyConsent, CONSENT_EVENT, linkEvent, readConsent, safeUrl, saveConsent, SETTINGS_EVENT, track, type Consent } from '@/lib/analytics'

function subscribe(callback: () => void) {
  window.addEventListener(CONSENT_EVENT, callback)
  window.addEventListener('focus', callback)
  return () => {
    window.removeEventListener(CONSENT_EVENT, callback)
    window.removeEventListener('focus', callback)
  }
}
const serverConsent = (): Consent => null

export function AnalyticsSettings() {
  return <button type="button" data-analytics-ignore className="rounded px-1.5 py-0.5 hover:bg-ink-800 hover:text-fg-bright"
    onClick={() => window.dispatchEvent(new Event(SETTINGS_EVENT))}>Cookies</button>
}

export function Analytics({ lang }: { lang: Lang }) {
  const pathname = usePathname()
  const consent = useSyncExternalStore(subscribe, readConsent, serverConsent)
  const [editing, setEditing] = useState(false)
  const previousPage = useRef('')
  const lastConsent = useRef<Consent>(null)

  useEffect(() => {
    if (lastConsent.current === consent) return
    lastConsent.current = consent
    applyConsent(consent ?? 'denied')
    if (consent !== 'granted') previousPage.current = ''
  }, [consent])

  useEffect(() => {
    const open = () => setEditing(true)
    window.addEventListener(SETTINGS_EVENT, open)
    return () => window.removeEventListener(SETTINGS_EVENT, open)
  }, [])

  useEffect(() => {
    if (consent !== 'granted') return
    const page = safeUrl(location.href)
    if (previousPage.current !== page) {
      track('page_view', { page_referrer: previousPage.current || safeUrl(document.referrer) })
      previousPage.current = page
    }
    const content = document.getElementById('content')
    const milestones = new Set<number>()
    let scheduled = 0
    const scroll = () => {
      if (scheduled) return
      scheduled = requestAnimationFrame(() => {
        scheduled = 0
        if (!content || content.scrollHeight <= content.clientHeight) return
        const percent = 100 * (content.scrollTop + content.clientHeight) / content.scrollHeight
        for (const threshold of [25, 50, 75, 90, 100]) {
          if (percent + 0.1 >= threshold && !milestones.has(threshold)) {
            milestones.add(threshold)
            track('scroll_depth', { percent_scrolled: threshold, area: 'content' })
          }
        }
      })
    }
    content?.addEventListener('scroll', scroll, { passive: true })
    return () => { content?.removeEventListener('scroll', scroll); cancelAnimationFrame(scheduled) }
  }, [pathname, consent])

  useEffect(() => {
    const click = (event: MouseEvent) => {
      if (event.type === 'auxclick' && event.button !== 1) return
      const source = event.target instanceof Element ? event.target : null
      const element = source?.closest<HTMLElement>('a[href], button, [data-analytics-action]')
      if (!element || element.closest('[data-analytics-ignore]') || element.hasAttribute('disabled')) return
      const area = element.closest<HTMLElement>('[data-analytics-area]')?.dataset.analyticsArea ?? 'content'
      if (element instanceof HTMLAnchorElement) {
        const info = linkEvent(element.getAttribute('href') ?? '', location.href, element.hasAttribute('download'))
        if (info) track(info.name, { target: info.target, area })
      } else {
        // Only developer-authored identifiers; never textContent or input values.
        track('ui_interaction', { action: element.dataset.analyticsAction ?? 'button', target: element.dataset.analyticsTarget ?? '', area })
      }
    }
    document.addEventListener('click', click, true)
    document.addEventListener('auxclick', click, true)
    return () => { document.removeEventListener('click', click, true); document.removeEventListener('auxclick', click, true) }
  }, [])

  function choose(choice: Exclude<Consent, null>) {
    saveConsent(choice)
    setEditing(false)
  }
  const fr = lang === 'fr'
  if (consent !== null && !editing) return null
  return (
    <section aria-labelledby="analytics-title" data-analytics-ignore className="fixed bottom-16 left-3 right-3 z-50 max-h-[75vh] overflow-auto rounded-panel border border-line bg-rail p-5 text-sm text-fg shadow-xl sm:left-auto sm:w-96 print:hidden">
      <h2 id="analytics-title" className="mb-2 font-semibold text-fg-bright">{fr ? 'Mesure d’audience' : 'Audience measurement'}</h2>
      <p>{fr
        ? 'Avec votre accord, Google Analytics utilise des cookies pour mesurer les visites et les interactions avec ce site. Les informations saisies dans le formulaire et le terminal ne sont pas transmises à Google. Votre choix est conservé 6 mois et peut être modifié via « Cookies » en bas de page.'
        : 'With your permission, Google Analytics uses cookies to measure visits and interactions with this site. Information typed in the form and terminal is not sent to Google. Your choice is saved for 6 months and can be changed using “Cookies” at the bottom of the page.'}</p>
      <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-amber underline underline-offset-4">{fr ? 'Utilisation des données par Google' : 'How Google uses data'}</a>
      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" onClick={() => choose('denied')} className="rounded border border-line px-4 py-2 text-fg-bright hover:bg-ink-800">{fr ? 'Refuser' : 'Decline'}</button>
        <button type="button" onClick={() => choose('granted')} className="rounded border border-line px-4 py-2 text-fg-bright hover:bg-ink-800">{fr ? 'Accepter' : 'Accept'}</button>
        {consent !== null && <button type="button" onClick={() => setEditing(false)} className="rounded px-3 py-2 hover:bg-ink-800">{fr ? 'Fermer' : 'Close'}</button>}
      </div>
    </section>
  )
}
