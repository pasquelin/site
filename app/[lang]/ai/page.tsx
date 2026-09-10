import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Answer } from '@/components/ui/Answer'
import { Article, Section } from '@/components/ui/Article'
import {
  InspectorLink,
  InspectorPanel,
  InspectorRow,
  InspectorSection,
} from '@/components/ui/Inspector'
import { SourceSection } from '@/components/ui/SourceSection'
import { AI_ANSWER, AI_BODY, AI_CODE, AI_METRICS, AI_PRINCIPLES, AI_TITLE } from '@/content/ai'
import { LANGS } from '@/content/site'
import { UI } from '@/content/ui'
import { isLang } from '@/lib/i18n'
import { pageMeta } from '@/lib/seo'

export async function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  if (!isLang(lang)) return {}
  return pageMeta({ lang, path: 'ai', title: AI_TITLE[lang], description: AI_ANSWER[lang] })
}

export default async function AiPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!isLang(lang)) notFound()

  return (
    <Article
      file="ai.md"
      title={AI_TITLE[lang]}
      inspector={
        <InspectorPanel title={UI.headings.inspector[lang]}>
          <InspectorSection label={UI.headings.results[lang]}>
            {AI_METRICS.map((m) => (
              <InspectorRow key={m.label[lang]} label={m.label[lang]} value={m.value} />
            ))}
          </InspectorSection>
          <InspectorSection label={UI.headings.links[lang]}>
            <InspectorLink href="https://github.com/pasquelin/AIDesktopStudio">
              AI Desktop Studio
            </InspectorLink>
            <InspectorLink href="https://github.com/pasquelin/ai-desktop-studio-finetuning">
              Fine-tuning
            </InspectorLink>
          </InspectorSection>
        </InspectorPanel>
      }
    >
      <div className="space-y-8">
        <Answer>{AI_ANSWER[lang]}</Answer>
        <SourceSection
          signature="function driveWithAgents(studio: DesktopStudio): AgentSurface"
          docTitle={AI_TITLE[lang]}
          paragraphs={AI_BODY[lang]}
          code={AI_CODE}
          metrics={AI_METRICS}
          stack={['MCP', 'Qwen', 'Electron', 'TypeScript', 'llamacpp']}
          lang={lang}
          scene="mcpConstellation"
        />
      </div>

      <Section title={UI.headings.doctrine[lang]}>
        <ul className="measure space-y-3 text-[15px] leading-[1.7] text-fg">
          {AI_PRINCIPLES[lang].map((p) => (
            <li key={p.slice(0, 30)} className="border-l-2 border-cyan/40 pl-4">
              {p}
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <Link href={`/${lang}/projects/ai-desktop-studio/`} className="font-mono text-[13px] text-amber hover:underline">
          AI Desktop Studio →
        </Link>
      </Section>
    </Article>
  )
}
