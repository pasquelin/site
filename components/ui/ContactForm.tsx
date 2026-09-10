'use client'

import { useState } from 'react'
import { CONTACT_ENDPOINT, PERSON } from '@/content/site'
import { UI } from '@/content/ui'
import type { Lang } from '@/content/types'

type Status = 'idle' | 'sending' | 'sent' | 'failed'

const FIELD =
  'w-full rounded-panel border border-line-soft bg-ink-900 px-3 py-2.5 text-[15px] text-fg-bright caret-amber outline-none transition-colors placeholder:text-fg-muted focus:border-amber/60'

const LABEL = 'mb-1.5 block text-[13px] text-fg-muted'

export function ContactForm({ lang }: { lang: Lang }) {
  const c = UI.contact
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)

    // Bots fill every field they find; people never see this one.
    if (data.get('website')) return

    const name = String(data.get('name') ?? '').trim()
    const email = String(data.get('email') ?? '').trim()
    const message = String(data.get('message') ?? '').trim()

    const next: Record<string, string> = {}
    if (!name) next.name = c.errName[lang]
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = c.errEmail[lang]
    if (message.length < 10) next.message = c.errMessage[lang]
    setErrors(next)
    if (Object.keys(next).length > 0) return

    // With no endpoint configured the form still works: it hands the message
    // to the visitor's mail client rather than failing silently.
    if (!CONTACT_ENDPOINT) {
      const subject = encodeURIComponent(`${lang === 'fr' ? 'Projet' : 'Project'} — ${name}`)
      const body = encodeURIComponent(`${message}\n\n—\n${name}\n${email}\n${data.get('company') ?? ''}`)
      window.location.href = `mailto:${PERSON.email}?subject=${subject}&body=${body}`
      setStatus('sent')
      return
    }

    setStatus('sending')
    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data,
      })
      if (!response.ok) throw new Error(String(response.status))
      form.reset()
      setStatus('sent')
    } catch {
      setStatus('failed')
    }
  }

  if (status === 'sent') {
    return (
      <p role="status" className="measure rounded-panel border border-green/30 bg-green/10 px-4 py-3 text-[15px] text-green">
        {c.sent[lang]}
      </p>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate className="measure space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={LABEL}>
            {c.name[lang]}
          </label>
          <input id="name" name="name" className={FIELD} autoComplete="name" aria-describedby={errors.name ? 'name-err' : undefined} />
          {errors.name ? (
            <p id="name-err" className="mt-1.5 text-[13px] text-coral">
              {errors.name}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="email" className={LABEL}>
            {c.email[lang]}
          </label>
          <input id="email" name="email" type="email" className={FIELD} autoComplete="email" aria-describedby={errors.email ? 'email-err' : undefined} />
          {errors.email ? (
            <p id="email-err" className="mt-1.5 text-[13px] text-coral">
              {errors.email}
            </p>
          ) : null}
        </div>
      </div>

      <div>
        <label htmlFor="company" className={LABEL}>
          {c.company[lang]}
        </label>
        <input id="company" name="company" className={FIELD} autoComplete="organization" />
      </div>

      <div>
        <label htmlFor="message" className={LABEL}>
          {c.message[lang]}
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          className={`${FIELD} resize-y`}
          placeholder={c.messagePlaceholder[lang]}
          aria-describedby={errors.message ? 'message-err' : undefined}
        />
        {errors.message ? (
          <p id="message-err" className="mt-1.5 text-[13px] text-coral">
            {errors.message}
          </p>
        ) : null}
      </div>

      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] size-px opacity-0"
      />

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="rounded-panel bg-amber px-4 py-2.5 font-mono text-[13px] font-medium text-ink-950 transition-colors hover:bg-amber/85 disabled:opacity-60"
        >
          {status === 'sending' ? c.sending[lang] : c.send[lang]}
        </button>
        <span className="font-mono text-[13px] text-fg-muted">
          {c.orDirect[lang]}{' '}
          <a href={`mailto:${PERSON.email}`} className="text-amber hover:underline">
            {PERSON.email}
          </a>
        </span>
      </div>

      {status === 'failed' ? (
        <p role="alert" className="text-[14px] text-coral">
          {c.failed[lang]}{' '}
          <a href={`mailto:${PERSON.email}`} className="underline">
            {PERSON.email}
          </a>
        </p>
      ) : null}
    </form>
  )
}
