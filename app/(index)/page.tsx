import type { Metadata } from 'next'
import Link from 'next/link'
import { PERSON, SITE_URL } from '@/content/site'

/**
 * `/` carries no content of its own: it points at the French entry page and
 * declares it canonical, so the two never compete in an index. Where the host
 * redirects (see `vercel.json`) the redirect answers first, and this page is
 * only seen by a crawler following a stale link, or in `next dev`.
 */
export const metadata: Metadata = {
  title: PERSON.name,
  alternates: {
    canonical: `${SITE_URL}/fr/`,
    languages: { 'fr-FR': `${SITE_URL}/fr/`, en: `${SITE_URL}/en/`, 'x-default': `${SITE_URL}/fr/` },
  },
  robots: { index: false, follow: true },
}

const link = { color: '#f5a742' }

export default function IndexPage() {
  return (
    <>
      {/* React hoists it into <head>: the static export redirects without a server. */}
      <meta httpEquiv="refresh" content="0;url=/fr/" />
      <p>{PERSON.name}</p>
      <p>
        <Link href="/fr/" style={link}>
          Français
        </Link>{' '}
        ·{' '}
        <Link href="/en/" style={link}>
          English
        </Link>
      </p>
    </>
  )
}
