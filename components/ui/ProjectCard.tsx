import Link from 'next/link'
import type { Lang, Project } from '@/content/types'
import { keepTogether } from '@/lib/typo'

/**
 * One card, the same on the home page and the projects page: name, tagline
 * on one line, then the stack as tags pinned to the bottom. Figures vary too much from one
 * project to the next to sit side by side; they live on each project's page.
 * A subgrid lines up the three rows across the cards of a row.
 */
export function ProjectCard({ project, lang }: { project: Project; lang: Lang }) {
  return (
    <li className="row-span-3 grid grid-rows-subgrid">
      <Link
        href={`/${lang}/projects/${project.slug}/`}
        className="group row-span-3 grid grid-rows-subgrid gap-0 rounded-panel border border-line-soft bg-ink-900 p-5 transition-colors hover:border-amber/40"
      >
        <span className="font-mono text-[15px] text-fg-bright group-hover:text-amber">{project.name}</span>
        <span title={project.tagline[lang]} className="mt-1.5 truncate text-[13px] leading-snug text-fg-muted">
          {keepTogether(project.tagline[lang])}
        </span>
        <span className="mt-4 flex flex-wrap gap-1.5 self-end">
          {project.stack.slice(0, 4).map((item) => (
            <span key={item} className="rounded border border-amber/30 bg-amber/5 px-1.5 py-0.5 font-mono text-[11.5px] text-amber">
              {item}
            </span>
          ))}
        </span>
      </Link>
    </li>
  )
}
