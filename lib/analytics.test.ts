import assert from 'node:assert/strict'
import { test } from 'node:test'
import { safeUrl, linkEvent, consentFromCookie, track } from './analytics.ts'

test('URLs never expose query values, fragments or credentials', () => {
  assert.equal(safeUrl('https://user:secret@example.com/path?email=a@b.com#private'), 'https://example.com/path')
  assert.equal(safeUrl('mailto:person@example.com?body=secret'), '')
  assert.equal(safeUrl('javascript:alert(1)'), '')
})

test('contact links report only their channel', () => {
  assert.deepEqual(linkEvent('mailto:person@example.com?body=secret', 'https://www.pasquelin.com/fr/'), { name: 'contact_click', target: 'email' })
  assert.deepEqual(linkEvent('tel:+33600000000', 'https://www.pasquelin.com/fr/'), { name: 'contact_click', target: 'phone' })
})

test('downloads, language changes, navigation and outbound links stay distinct', () => {
  const base = 'https://www.pasquelin.com/fr/'
  assert.deepEqual(linkEvent('/cv/CV-Alban-Pasquelin-FR.pdf?token=secret', base, true), { name: 'file_download', target: 'https://www.pasquelin.com/cv/CV-Alban-Pasquelin-FR.pdf' })
  assert.deepEqual(linkEvent('/en/', base), { name: 'language_change', target: 'https://www.pasquelin.com/en/' })
  assert.deepEqual(linkEvent('/fr/projects/', base), { name: 'navigation_click', target: 'https://www.pasquelin.com/fr/projects/' })
  assert.deepEqual(linkEvent('https://github.com/pasquelin?secret=123', base), { name: 'outbound_click', target: 'https://github.com/pasquelin' })
  assert.equal(linkEvent('#content', base), null)
  assert.equal(linkEvent('javascript:alert(1)', base), null)
})

test('tracking requires an exact explicit consent cookie', () => {
  assert.equal(consentFromCookie(''), null)
  assert.equal(consentFromCookie('other=granted; site-analytics=unknown'), null)
  assert.equal(consentFromCookie('site-analytics=granted'), 'granted')
  assert.equal(consentFromCookie('site-analytics=denied; other=yes'), 'denied')
})

test('events are blocked before consent and optional data is reset between events', () => {
  const names = ['window', 'document', 'location', 'localStorage'] as const
  const original = names.map((key) => Object.getOwnPropertyDescriptor(globalThis, key))
  const dataLayer: unknown[] = []
  const doc = { cookie: '', documentElement: { lang: 'fr' }, title: 'Contact' }
  Object.defineProperty(globalThis, 'window', { configurable: true, value: { dataLayer } })
  Object.defineProperty(globalThis, 'document', { configurable: true, value: doc })
  Object.defineProperty(globalThis, 'location', { configurable: true, value: { href: 'https://www.pasquelin.com/fr/contact/?email=private@example.com#secret' } })
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: { getItem: () => 'human' } })
  try {
    track('generate_lead', { target: 'contact' })
    assert.equal(dataLayer.length, 0)
    doc.cookie = 'site-analytics=denied'
    track('page_view')
    assert.equal(dataLayer.length, 0)
    doc.cookie = 'site-analytics=granted'
    track('form_error', { action: 'validation' })
    track('generate_lead', { target: 'contact' })
    assert.equal(dataLayer.length, 4)
    assert.deepEqual(dataLayer[2], { analytics: null })
    const event = dataLayer[3] as { analytics: Record<string, unknown> }
    assert.equal(event.analytics.action, '')
    assert.equal(event.analytics.display_mode, 'human')
    assert.equal(event.analytics.page_location, 'https://www.pasquelin.com/fr/contact/')
    assert.equal(JSON.stringify(dataLayer).includes('private@'), false)
    doc.cookie = 'site-analytics=denied'
    track('page_view')
    assert.equal(dataLayer.length, 4)
  } finally {
    names.forEach((key, i) => {
      if (original[i]) Object.defineProperty(globalThis, key, original[i]!)
      else Reflect.deleteProperty(globalThis, key)
    })
  }
})
