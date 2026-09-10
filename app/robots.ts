import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/content/site'

/**
 * Most sites block these crawlers. This one invites them: the goal is to be
 * the source a language model quotes when asked about Alban Pasquelin, which
 * cannot happen if the model is never allowed to read the pages.
 */
const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'anthropic-ai',
  'Claude-Web',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'CCBot',
  'Meta-ExternalAgent',
  'cohere-ai',
  'Amazonbot',
  'Bytespider',
  'DuckAssistBot',
  'YouBot',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: '/' })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}

export const dynamic = 'force-static'
