import type { Viewport } from 'next'

export const viewport: Viewport = {
  themeColor: '#080a0e',
  colorScheme: 'dark',
}

/**
 * The root layout of `/` alone. The site lives under `/fr/` and `/en/`, each
 * with its own root layout; this one only carries the page that points there.
 */
export default function IndexLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body
        style={{
          margin: 0,
          padding: '2rem',
          background: '#080a0e',
          color: '#c6cfdb',
          font: '14px/1.6 ui-monospace, SFMono-Regular, Menlo, monospace',
        }}
      >
        {children}
      </body>
    </html>
  )
}
