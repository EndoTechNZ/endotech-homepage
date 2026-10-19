# AGENTS.md

## Framework
- Use Astro
- Follow src/pages structure
- Use ProductLayout.astro for product pages
- For homepage hero layout, image treatment, workflow strip, and section rhythm, follow the Homepage Hero Pattern in DESIGN.md

## Brand Tone
- Clinical
- Precise
- Confident
- Avoid generic marketing language

## Product Page Rules
Each page must include:
1. Clinical Problem
2. TransformX Solution
3. Key Features
4. Clinical Benefits

## Messaging Rules

- Keep the brand name `Transform S™` on one line in all displayed text. Use a non-breaking space between `Transform` and `S`; keep any separately styled trademark inside the same no-wrap wrapper. Let surrounding words wrap, and size headings responsively without splitting the brand or changing its trademark placement.
- Always link product features to clinical problems
- Emphasise control, safety, and adaptability
- Use simple, clear, professional language
- Give every clinical blog post a compact numbered key-points panel near the opening. Tailor three to five points to the article's central clinical decisions; do not reuse a generic checklist.

## Navigation layout checks
- Keep headers in normal flow with content-driven height. Adding or changing a navigation link must never place a control outside its header or over page content.
- Keep navigation labels, including Explore and its chevron, on one line. Size buttons to their contents; wrap whole buttons when necessary. Preserve the fine animated underline on Systems, Offers and Explore, including keyboard focus and reduced-motion support.
- After navigation or offer changes, build the production output with `npm run build:github`, then run `npm run check:navigation-layout`. Test the final `dist` output because the reviewed-site publishing step inserts navigation links after Astro builds.
- Install test browsers with `npx playwright install chromium webkit` if needed. The GitHub Pages deployment checks phone, tablet and desktop widths in Chromium and WebKit before publishing.

## Website Structure
- Home
- Products
- Clinical Workflow
- Technology
- Education
- Evidence & Downloads
- About
- Contact
