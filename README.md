# Jovan Matthew — Portfolio

An editorial personal portfolio and security research archive built with Next.js App Router, TypeScript, Tailwind CSS, and Markdown. All portfolio content is local and rendered at build time; no database, CMS, GitHub API, or runtime third-party script is required.

## Run locally

```bash
npm install
npm run dev
```

Use `npm run build`, `npm run typecheck`, and `npm run lint` before deployment.

## Add a finding

Create a Markdown file in `content/findings/`. Its filename becomes the `/research/[slug]` route. Required frontmatter:

```yaml
---
title: "Finding title, or a neutral severity label until a public title is available"
protocol: "Protocol name"
protocolType: "Protocol category"
severity: "Medium"
platform: "Contest platform"
contestPeriod: "Mar 2026"
contestSort: 202603
rank: 1
rankTotal: 100 # optional
featured: true
summary: "A short, source-backed summary."
contest: "https://example.com/competition"
report: "https://example.com/original-report"
poc: null # optional URL
writeupNote: "Optional explanation when a source does not expose attributable technical details."
---

## Summary

Long-form Markdown content can follow the frontmatter. Use only sections supported by a public write-up: Summary, Invariant, Root Cause, Attack / Failure Path, Impact, Proof of Concept, Mitigation, References, and Original Report.
```

The homepage selects `featured: true` findings. The archive and audit experience list read all Markdown files automatically. `contestPeriod` controls the displayed month and year; `contestSort` is a `YYYYMM` number used to order contests. Ranks appear only in the contest record. Finding totals are calculated from the findings listed here.

## Canonical URL

Set `NEXT_PUBLIC_SITE_URL` to the production origin in the deployment environment. This enables absolute canonical metadata and the sitemap; without a confirmed domain, the app does not guess one.

## Structure

- `app/`: homepage, research archive, static finding routes, metadata, robots, and sitemap.
- `components/`: reusable navigation, layout, research, and experience presentation.
- `content/findings/`: source-backed finding metadata and optional long-form Markdown.
- `data/`: profile, links, and stack content.
- `lib/findings.ts`: frontmatter validation and content loading shared by routes and components.
