import type { NextConfig } from 'next'

/**
 * Static export. Every route is pre-rendered to complete HTML at build time.
 *
 * This is not a preference — AI crawlers (GPTBot, ClaudeBot, PerplexityBot,
 * CCBot) do not execute JavaScript. A client-rendered page is literally empty
 * to them. `npm run verify:crawl` asserts this never regresses.
 */
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  /* The dev-only overlay badge; it never shipped, and it gets in the way. */
  devIndicators: false,
}

export default nextConfig
