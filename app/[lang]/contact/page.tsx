import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Article, Section } from '@/components/ui/Article'
import { ContactForm } from '@/components/ui/ContactForm'
import {
  InspectorDownload,
  InspectorLink,
  InspectorPanel,
  InspectorRow,
  InspectorSection,
} from '@/components/ui/Inspector'
import { SERVICES } from '@/content/profile'
import {
  AVAILABILITY,
  CV,
  LANGS,
  PERSON,
  RATES,
  RATE_LABELS,
  SHOW_PHONE,
  SHOW_RATES,
  SOCIALS,
} from '@/content/site'
import { UI } from '@/content/ui'
import { isLang } from '@/lib/i18n'
import { pageMeta } from '@/lib/seo'

export async function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  if (!isLang(lang)) return {}
  return pageMeta({
    lang,
    path: 'contact',
    title: UI.contact.title[lang],
    description: UI.contact.description[lang],
  })
}

export default async function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!isLang(lang)) notFound()

  return (
    <Article
      file="contact.sh"
      title={UI.contact.title[lang]}
      inspector={
        <InspectorPanel title={UI.headings.inspector[lang]}>
          <InspectorSection label={UI.headings.availability[lang]}>
            <p className="pb-2 text-[13px] text-green">{AVAILABILITY.when[lang]}</p>
            <ul className="space-y-1.5 text-[13px] leading-snug text-fg">
              {AVAILABILITY.zones[lang].map((zone) => (
                <li key={zone}>{zone}</li>
              ))}
            </ul>
          </InspectorSection>

          {SHOW_RATES ? (
            <InspectorSection label={UI.headings.rates[lang]}>
              {(['fr', 'ch', 'remote'] as const).map((key) => (
                <InspectorRow key={key} label={RATE_LABELS[key][lang]} value={RATES[key][lang]} />
              ))}
            </InspectorSection>
          ) : null}

          <InspectorSection label={UI.headings.cv[lang]}>
            <InspectorDownload href={CV.fr}>Français — PDF</InspectorDownload>
            <InspectorDownload href={CV.en}>English — PDF</InspectorDownload>
          </InspectorSection>

          <InspectorSection label={UI.headings.elsewhere[lang]}>
            {SOCIALS.map((social) => (
              <InspectorLink key={social.id} href={social.url}>
                {social.label}
              </InspectorLink>
            ))}
          </InspectorSection>
        </InspectorPanel>
      }
    >
      <p className="measure mb-8 text-[15px] leading-[1.7] text-fg">{UI.contact.intro[lang]}</p>

      <ContactForm lang={lang} />

      {SHOW_PHONE ? (
        <p className="mt-6 font-mono text-[13px] text-fg-muted">
          {lang === 'fr' ? 'Par téléphone' : 'By phone'}{' '}
          <a href={`tel:${PERSON.phone.replace(/\s/g, '')}`} className="text-amber hover:underline">
            {PERSON.phone}
          </a>
        </p>
      ) : null}

      <Section title={UI.headings.services[lang]}>
        <ul className="measure grid gap-x-8 gap-y-2 text-[14px] text-fg sm:grid-cols-2">
          {SERVICES[lang].map((service) => (
            <li key={service}>{service}</li>
          ))}
        </ul>
      </Section>
    </Article>
  )
}
