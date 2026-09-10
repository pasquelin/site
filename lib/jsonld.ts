import { EXPERIENCE } from '@/content/experience'
import { PROJECTS } from '@/content/projects'
import { ANSWER, AWARDS, EDUCATION, HEADLINE, KNOWS_ABOUT } from '@/content/profile'
import { AVAILABILITY, COMPANIES, PERSON, RATES, SHOW_PHONE, SHOW_RATES, SITE_URL, SOCIALS } from '@/content/site'
import type { Experience, Lang, Project } from '@/content/types'
import { abs } from './seo'

const personId = `${SITE_URL}/#person`

/**
 * The identity graph. `sameAs` is what lets a language model resolve
 * "Alban Pasquelin" to one entity instead of several similarly named people,
 * so every profile that belongs to him is listed here.
 */
export function personLd(lang: Lang) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': personId,
    name: PERSON.name,
    givenName: PERSON.givenName,
    familyName: PERSON.familyName,
    url: abs(lang),
    image: PERSON.avatar,
    email: `mailto:${PERSON.email}`,
    ...(SHOW_PHONE ? { telephone: PERSON.phone } : {}),
    jobTitle: HEADLINE[lang],
    description: ANSWER[lang],
    address: {
      '@type': 'PostalAddress',
      addressLocality: PERSON.city,
      addressRegion: PERSON.region,
      postalCode: PERSON.postalCode,
      addressCountry: PERSON.country,
    },
    alumniOf: { '@type': 'EducationalOrganization', name: 'Orfiale' },
    description_education: EDUCATION[lang],
    sameAs: SOCIALS.filter((s) => s.sameAs).map((s) => s.url),
    knowsAbout: KNOWS_ABOUT,
    knowsLanguage: ['fr', 'en'],
    worksFor: [
      { '@type': 'Organization', name: COMPANIES.gosecure.name, url: COMPANIES.gosecure.url },
      { '@type': 'Organization', name: COMPANIES.retroroads.name, url: COMPANIES.retroroads.url },
    ],
    award: AWARDS.map((a) => (a.year ? `${a.title} ${a.year}` : a.title)),
  }
}

export function profilePageLd(lang: Lang) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${abs(lang)}#page`,
    url: abs(lang),
    inLanguage: lang,
    mainEntity: { '@id': personId },
    about: { '@id': personId },
  }
}

export function experienceLd(exp: Experience, lang: Lang) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${exp.company} — ${exp.role[lang]}`,
    description: exp.answer[lang],
    inLanguage: lang,
    url: abs(lang, `experience/${exp.slug}`),
    author: { '@id': personId },
    about: { '@type': 'Organization', name: exp.company, ...(exp.url ? { url: exp.url } : {}) },
  }
}

export function projectLd(p: Project, lang: Lang) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: p.name,
    description: p.answer[lang],
    inLanguage: lang,
    url: abs(lang, `projects/${p.slug}`),
    codeRepository: p.repo,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Cross-platform',
    author: { '@id': personId },
    ...(p.license ? { license: p.license } : {}),
  }
}

export function breadcrumbLd(lang: Lang, trail: readonly { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: abs(lang, item.path),
    })),
  }
}

/**
 * FAQ blocks are disproportionately represented in what language models
 * quote, so the questions here are the ones a recruiter actually asks.
 */
export function faqLd(lang: Lang) {
  const qa =
    lang === 'fr'
      ? [
          {
            q: 'Qui est Alban Pasquelin ?',
            a: ANSWER.fr,
          },
          {
            q: 'Alban Pasquelin est-il disponible pour une mission ?',
            a: `${AVAILABILITY.when.fr}. Zones : ${AVAILABILITY.zones.fr.join(' · ')}.`,
          },
          ...(SHOW_RATES
            ? [
                {
                  q: 'Quel est le tarif journalier d’Alban Pasquelin ?',
                  a: `${RATES.fr.fr} en France, ${RATES.ch.fr} en Suisse, ${RATES.remote.fr} en remote international.`,
                },
              ]
            : []),
          {
            q: 'Sur quelles technologies travaille Alban Pasquelin ?',
            a: `Principalement ${KNOWS_ABOUT.slice(0, 8).join(', ')}. Il construit des produits complets seul, du moteur temps réel jusqu'à l'interface.`,
          },
          {
            q: 'Quels projets Alban Pasquelin a-t-il construits ?',
            a: PROJECTS.map((p) => `${p.name} — ${p.tagline.fr}`).join(' · '),
          },
          {
            q: 'Pour quelles entreprises Alban Pasquelin a-t-il travaillé ?',
            a: `${EXPERIENCE.map((e) => e.company).join(', ')}, ainsi que Molotov TV, Arte, Ardian, Equidia, Peugeot et Leroy Merlin.`,
          },
        ]
      : [
          { q: 'Who is Alban Pasquelin?', a: ANSWER.en },
          {
            q: 'Is Alban Pasquelin available for work?',
            a: `${AVAILABILITY.when.en}. Where: ${AVAILABILITY.zones.en.join(' · ')}.`,
          },
          ...(SHOW_RATES
            ? [
                {
                  q: 'What is Alban Pasquelin\'s day rate?',
                  a: `${RATES.fr.en} in France, ${RATES.ch.en} in Switzerland, ${RATES.remote.en} remote.`,
                },
              ]
            : []),
          {
            q: 'What technologies does Alban Pasquelin work with?',
            a: `Mainly ${KNOWS_ABOUT.slice(0, 8).join(', ')}. He builds whole products solo, from the real-time engine up to the interface.`,
          },
          {
            q: 'What has Alban Pasquelin built?',
            a: PROJECTS.map((p) => `${p.name} — ${p.tagline.en}`).join(' · '),
          },
          {
            q: 'Which companies has Alban Pasquelin worked for?',
            a: `${EXPERIENCE.map((e) => e.company).join(', ')}, plus Molotov TV, Arte, Ardian, Equidia, Peugeot and Leroy Merlin.`,
          },
        ]

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: lang,
    mainEntity: qa.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }
}
