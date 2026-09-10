<div align="center">

# pasquelin.com

**The personal site of Alban Pasquelin — freelance software architect.**
A CV rendered as an editor window, pre-rendered to static HTML so that a crawler running no JavaScript still reads every word.

[![Deploy](https://github.com/pasquelin/site/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/pasquelin/site/actions/workflows/deploy.yml)
[![Next.js](https://img.shields.io/badge/Next.js-16.3-2b2d30?logo=next.js&logoColor=ffffff)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.2-2b2d30?logo=react&logoColor=61dafb)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5%20strict-2b2d30?logo=typescript&logoColor=3178c6)](tsconfig.json)
[![three.js](https://img.shields.io/badge/three.js-0.186-2b2d30?logo=three.js&logoColor=ffffff)](https://threejs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-2b2d30?logo=tailwindcss&logoColor=38bdf8)](https://tailwindcss.com)
[![Static export](https://img.shields.io/badge/output-static%20export-2b2d30?logo=vercel&logoColor=ffffff)](next.config.ts)
[![License](https://img.shields.io/badge/code-MIT%20%C2%B7%20content%20reserved-2b2d30)](LICENSE)

**[Live site ↗](https://pasquelin.com)** · **[Documentation 🇫🇷](README.fr.md)** · **[llms.txt ↗](https://pasquelin.com/llms.txt)** · **[cv.json ↗](https://pasquelin.com/cv.json)** · **[→ AI Desktop Studio](https://www.aidesktopstudio.com/)**

</div>

---

## What this repository is

The site behind **pasquelin.com**, in French and English. It is a CV, and it is built for two
readers at once.

**A human** gets an editor window: activity bar, tabs, status bar, a terminal that answers real
commands and a `⌘K` palette. Whoever does not want any of that types `mode humain` and the
whole editor treatment falls away, leaving a plain, readable CV.

**A machine** gets complete HTML. GPTBot, ClaudeBot, PerplexityBot and CCBot do not run scripts:
whatever is not in the served file does not exist to them. So every route is pre-rendered
(`output: 'export'`), carries a JSON-LD identity graph, and is doubled by files written for
models rather than for people — `llms.txt`, `llms-full.txt`, `cv.json`. `npm run verify:crawl`
fails the build if a page's own words are missing from its HTML, so the property cannot be lost
by accident.

## Content is the source

Everything the site produces comes from `content/`. Pages, JSON-LD, `llms.txt`, `llms-full.txt`,
`cv.json` and the sitemap are all derived from the same modules, so nothing is written twice and
nothing can drift.

| Module | What it holds |
| --- | --- |
| `content/site.ts` | Domain, languages, identity, social profiles, availability, rates, feature switches |
| `content/profile.ts` | Headline, pitch, the sentence a model should quote, metrics, awards, education |
| `content/experience.ts` | 8 missions — GoSecure, RetroRoads, Ardian, e-TF1 (Edito and MyTF1), Innso, Molotov TV, earlier work |
| `content/projects.ts` | 7 projects — AI Desktop Studio, map3D, panels, media-studio, Enigma Cube, map3D plugins, local LLM fine-tuning |
| `content/ai.ts` | The "Working with AI" page |
| `content/scenes.ts` | Titles and written captions for the seven 3D scenes |
| `content/nav.ts`, `content/ui.ts` | Navigation entries and interface strings |
| `content/types.ts` | The content contract every module above satisfies |
| `content/MISSING.md` | CV facts still missing, stated rather than approximated |

Each experience and project carries an `answer`: one self-contained, factual, dated sentence,
written so it survives being lifted out of the page on its own. That is the sentence a language
model quotes.

## The shell

- **Terminal** — `aide`, `ls`, `open <name>`, `cv`, `contact`, `mode humain|dev`, `lang fr|en`,
  `clear`. Several sessions, each with its own scrollback, and a draggable divider.
- **Command palette** — `⌘K` / `Ctrl K`.
- **One catalogue** — the terminal, the palette and the tab bar all read `lib/catalog.ts`, so a
  new page appears in the three of them at once.
- **Seven Three.js scenes**, one per mission or project: converging code streams, an alert
  propagating to responders, a Vue → React migration with the availability bar never moving, the
  310-action MCP constellation. Each mounts only when it is on screen, and never when motion is
  reduced or the screen is small. Every scene's caption sits in the DOM before any WebGL loads,
  so a crawler, a screen reader and a reduced-motion visitor all get the diagram in words.

## Routes

40 content pages — 20 per language, each declaring its counterpart with `hreflang`.

| Route | What it is |
| --- | --- |
| `/` | Points at `/fr/` and declares it canonical (redirect in `vercel.json`, static fallback from `postbuild`) |
| `/{fr,en}/` | Profile |
| `/{fr,en}/experience/` and `/experience/[slug]/` | The 8 missions |
| `/{fr,en}/projects/` and `/projects/[slug]/` | The 7 projects |
| `/{fr,en}/ai/` | Working with AI |
| `/{fr,en}/contact/` | Contact form |

## Written for machines

| File | Written by | What it is |
| --- | --- | --- |
| `public/llms.txt` | `scripts/generate-machine-files.ts` | The short index: who, what, links |
| `public/llms-full.txt` | same | Full content, both languages, in one file |
| `public/cv.json` | same | The CV as structured data |
| `sitemap.xml` | `app/sitemap.ts` | Every page, in both languages, with its alternates |
| `robots.txt` | `app/robots.ts` | Explicitly **allows** 16 AI crawlers rather than blocking them |
| JSON-LD | `lib/jsonld.ts` | `Person`, `ProfilePage`, `Article`, `SoftwareApplication`, `FAQPage`, `BreadcrumbList` — `sameAs` ties every profile to one entity |

## Getting started

Requirements: Node **24** (see [`.nvmrc`](.nvmrc)), npm.

```bash
npm install
npm run dev       # http://localhost:3000 → /fr/
```

```bash
npm run build     # generates the machine files, exports to out/, then verifies crawlability
npm start         # serves out/ locally
```

| Script | What it does |
| --- | --- |
| `dev` | Next dev server |
| `prebuild` | Writes `llms.txt`, `llms-full.txt` and `cv.json` from `content/` |
| `build` | Static export to `out/` |
| `postbuild` | Writes the root document, then runs the crawlability check |
| `verify:crawl` | Fails if a page's own words are absent from its served HTML |
| `typecheck` | `tsc --noEmit` |
| `lint` | ESLint (`eslint-config-next`) |

## Structure

```
app/[lang]/          Routes, one folder per section; robots.ts and sitemap.ts alongside
components/ide/      Editor shell: title bar, tabs, activity bar, tool rail, terminal, palette
components/three/    Scene mounting and the seven scenes
components/ui/       Article, answer block, metrics, inspector, source view, contact form
content/             The single source of truth — the whole site derives from here
lib/                 Catalogue, i18n helpers, SEO metadata, JSON-LD, deterministic rng
scripts/             Machine files, root document, crawlability check
.github/workflows/   Check on every commit, deploy from main
```

## Deployment

`main` deploys itself. [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) replays
`typecheck`, `lint` and `build` — the last one runs `verify-crawl`, so a page that loses its text
in the served HTML blocks the merge and not merely the deployment. A pull request builds without
deploying, and a manual run deploys only if its box is ticked.

The export then travels to the server by `rsync`, over a key locked down with
`command="rrsync -wo <folder>"`: no shell, no other directory, write only. Around it: an artefact
missing `out/fr/index.html` or `llms.txt`, or holding fewer than 60 files, is refused rather than
`--delete`d over a live site; HTML, CSS, JS, SVG, JSON, XML and text are pre-compressed at
`gzip -9` for nginx's `gzip_static`; and afterwards `/fr/`, `/en/` and `/llms.txt` must all answer
200. With no deployment secrets set, the push is skipped instead of failing red.

The apex is canonical and `www` redirects to it. The domain lives in one line — `SITE_URL` in
`content/site.ts`; change it and pages, canonicals, sitemap, JSON-LD and machine files all follow.
`vercel.json` is kept for a Vercel deployment: it redirects `/` to `/fr/` and serves the
`llms*.txt` files as `text/plain; charset=utf-8`. On the nginx server that redirect is the root
document `postbuild` writes.

Three switches are business decisions rather than technical ones:

| Switch | Where | Effect |
| --- | --- | --- |
| `SHOW_PHONE` | `content/site.ts` | Publishes the mobile number, or removes it everywhere |
| `SHOW_RATES` | `content/site.ts` | Publishes the day rates, or removes them everywhere |
| `NEXT_PUBLIC_CONTACT_ENDPOINT` | environment | Formspree/Web3Forms URL; with none set, the form falls back to the visitor's mail client |

## Known gaps

- `lib/seo.ts` points Open Graph and Twitter cards at `/og.png`, which is **not** in `public/`.
  Social previews resolve to a missing image until it is added.
- `content/MISSING.md` lists the CV facts still unknown: the year of the Grand prix Stratégies du
  digital, RetroRoads results (private beta), and a thin Ardian entry.
- No test suite. `verify:crawl` is the only automated guard, and it covers crawlability alone.

## License

Source code under the **MIT licence**. The editorial content — the texts in `content/`, the CV
data, the personal details and the files generated from them — is **© Alban Pasquelin, all rights
reserved**. See [LICENSE](LICENSE).
