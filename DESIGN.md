version: 6
name: jopantech - Web3 security research
description: Compact charcoal portfolio with a subtle dark gradient, blue, cyan, and periwinkle accents, contest records, and direct contact.
colors:
  ground: "#0a0d12"
  surface: "#111720"
  ink: "#edf3fc"
  secondary: "#b0bfd2"
  hairline: "#2a3544"
  signal: "#82b7ff"
  supporting_accents: ["#5bd0d5", "#b09cff", "#f0ad58"]
typography:
  display: "system monospace, bold"
  interface: "system monospace"
  metadata: "system monospace"
geometry:
  controls: "8px radius"
  rules: "fine borders around evidence rows and contact details"
  movement: "one focus rotator, honor reduced motion"

# Design read

This is a personal Web3 security research portfolio for protocol teams and other auditors. Use Faris Maulana's page as the visual reference for its dark mono type, green accent, numbered section bars, contest rows, findings table, and contact panel. Keep the content and links specific to Jovan.

# Layout

- Header brand is the `jopantech` text wordmark. Navigation links to About, Contests, and Findings, followed by a clear review action.
- Keep home sections in this order: Hero, About, Contest record, Selected findings, Writing, Contact.
- Place a compact clickable protocol wordmark strip sourced from published finding records immediately before Contact; do not add it to numbered section navigation.
- Do not show a general ecosystem section, a theme switch, or GitHub links.
- Keep the hero greeting, researcher role, changing research focus, concise evidence-led bullets, and paths to contact and contest records.
- The About section leads with security research. Education remains secondary.
- Present contest records as individual outlined rows. Present selected findings as a compact source-linked table.
- Make Telegram `@jopanmatthew` the primary contact action. Keep email and X available beside it.
- The Writing section summarizes source-backed finding records and links to `/writing`; `/writing` is the editorial index and `/research/[slug]` contains each report record and any available technical write-up. `/research` remains the complete source-linked archive.
- `/research/[slug]` displays only technical content present in the finding Markdown.
- Use the same deep navy background with restrained blue, cyan, and periwinkle accents across home, archive, finding detail, and footer.

# Content contract

Profile data and finding Markdown files are the source of truth. Do not add vulnerability descriptions, PoCs, metrics, or experience that the records do not support. Show contest placement ranks only in the contest record, not in the findings archive or write-ups. Display report details and PoCs only when public and attributable. Otherwise explain the source limit and link the original record.

# Responsive and accessible behavior

- Stack content at phone widths without hiding links or report fields.
- Retain semantic tables, keyboard focus, descriptive external links, and a reduced-motion fallback.
- Keep CTA text at WCAG AA contrast and on one line.
