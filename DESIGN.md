# EndoTech DESIGN.md

## Purpose

This file defines the visual design system for EndoTech SG and EndoTech NZ websites, product pages, clinical education pages, ecommerce pages, evidence pages, and AI-generated components.

Use this file as the single source of truth for visual direction. It blends:

- **Stripe**: clean commercial polish, confident product sections, conversion clarity, subtle technical/commercial energy.
- **Linear**: precision, restrained spacing, sharp hierarchy, technical confidence, minimal chrome.
- **Mintlify**: documentation clarity, evidence structure, clinical education readability, dense but legible information pages.
- **Apple**: premium product presentation, quiet confidence, photography-first hero sections, disciplined simplicity.

EndoTech must feel like a **premium clinical dental technology company**, not a generic SaaS startup, consumer-electronics brand, automotive/lifestyle brand, or playful AI tool.

---

## Brand Personality

EndoTech is:

- Clinical, precise, engineered, premium, trustworthy.
- Evidence-led, calm, and commercially polished.
- Modern but not trendy.
- Technical but not cold.
- Premium but not luxury-fashion.
- Confident but not overclaimed.

EndoTech should communicate:

- Better endodontic workflow design.
- Safer and more controlled canal shaping.
- Clean 3D irrigation and obturation logic.
- Regulatory and clinical seriousness.
- Dealer/distributor confidence.
- Dentist-friendly product clarity.

Avoid:

- Generic SaaS gradients.
- Overly playful startup illustrations.
- Consumer-electronics styling that feels like phones or headphones.
- Over-dark futuristic sci-fi interfaces.
- Automotive drama unless used very lightly for engineering precision.
- Excessive animation or decorative effects.
- Aggressive sales language.
- Crowded dental-supply catalogue styling.

---

## Core Visual Formula

The EndoTech design direction is:

```text
70% Stripe + Linear
20% Mintlify
10% Apple
```

Use this interpretation:

- **Stripe influence**: white canvas, polished commercial sections, clean CTA structure, soft off-white bands, subtle product mockups, refined conversion flow.
- **Linear influence**: exact spacing, quiet hairline borders, disciplined cards, precise typography, minimal UI chrome.
- **Mintlify influence**: documentation pages, evidence blocks, clinical references, tables, comparison grids, code/technical-style clarity where needed.
- **Apple influence**: product-first hero sections, large clean product renders, strong white/grey negative space, concise headlines, minimal distractions.

---

## Color System

### Primary Palette

Use EndoTech’s own clinical palette, not the source brands’ palettes.

```yaml
colors:
  canvas: "#FFFFFF"
  canvas_soft: "#F6F9FC"
  canvas_clinical: "#F3F6F8"
  canvas_parchment: "#F5F5F7"
  surface: "#FFFFFF"
  surface_soft: "#F8FAFC"
  surface_lifted: "#FFFFFF"
  surface_blue_tint: "#EEF6FB"
  surface_steel: "#E8EDF2"

  ink: "#102033"
  ink_secondary: "#273951"
  ink_muted: "#64748D"
  ink_subtle: "#8A94A3"
  ink_inverse: "#FFFFFF"

  primary: "#0B75B7"
  primary_hover: "#09639B"
  primary_deep: "#064B78"
  primary_soft: "#DCEFF8"
  primary_pale: "#EEF8FC"

  accent_teal: "#1BA6A6"
  accent_green: "#4BAE73"
  accent_purple: "#6E6BD9"
  accent_warning: "#B7791F"
  accent_error: "#C2413A"

  hairline: "#E3E8EE"
  hairline_strong: "#CAD5E0"
  hairline_blue: "#B8D8EA"

  dark_canvas: "#07111D"
  dark_surface: "#0D1A2A"
  dark_surface_lifted: "#122236"
  dark_hairline: "#24364A"
  dark_ink: "#F7FAFC"
  dark_ink_muted: "#B8C4D1"
```

### Color Principles

- Default to **white and soft clinical grey** surfaces.
- Use EndoTech blue as the primary action colour.
- Use teal/green only for success, flow, irrigation, confirmation, or clinical-positive signals.
- Use purple/lavender sparingly for TransformX technology, metallurgy, or premium technical accents.
- Use dark navy only for product mockups, technical panels, or selected dramatic product sections.
- Do not use Stripe-style rainbow gradients directly. If a gradient is needed, make it clinical: blue-grey, pale cyan, soft steel, or very subtle blue-to-white.
- Avoid red except for warnings or clinical cautions.
- Avoid bright consumer colours.

### Approved Gradients

Use very subtle gradients only.

```css
--gradient-clinical-hero: linear-gradient(135deg, #ffffff 0%, #f6f9fc 45%, #eef6fb 100%);
--gradient-technical-blue: radial-gradient(circle at 30% 20%, rgba(11,117,183,0.16), transparent 34%), linear-gradient(135deg, #ffffff 0%, #f3f7fb 100%);
--gradient-dark-technical: radial-gradient(circle at 70% 20%, rgba(27,166,166,0.18), transparent 34%), linear-gradient(135deg, #07111d 0%, #0d1a2a 100%);
```

Never use saturated rainbow mesh gradients as the main EndoTech look.

---

## Typography

### Font Stack

Use system-safe premium sans typography.

```css
font-family: Inter, "SF Pro Display", "SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
```

For mono, evidence tags, part numbers, SKU references, and technical data:

```css
font-family: "Geist Mono", "SF Mono", ui-monospace, Menlo, Consolas, monospace;
```

### Typography Tokens

```yaml
typography:
  hero_display:
    size: 64px
    weight: 600
    line_height: 1.06
    letter_spacing: -1.8px

  display_lg:
    size: 48px
    weight: 600
    line_height: 1.10
    letter_spacing: -1.2px

  display_md:
    size: 36px
    weight: 600
    line_height: 1.16
    letter_spacing: -0.6px

  heading_lg:
    size: 28px
    weight: 600
    line_height: 1.22
    letter_spacing: -0.3px

  heading_md:
    size: 22px
    weight: 600
    line_height: 1.30
    letter_spacing: -0.1px

  heading_sm:
    size: 18px
    weight: 600
    line_height: 1.38
    letter_spacing: 0

  lead:
    size: 20px
    weight: 400
    line_height: 1.50
    letter_spacing: -0.1px

  body:
    size: 16px
    weight: 400
    line_height: 1.55
    letter_spacing: 0

  body_sm:
    size: 14px
    weight: 400
    line_height: 1.50
    letter_spacing: 0

  caption:
    size: 13px
    weight: 400
    line_height: 1.40
    letter_spacing: 0

  eyebrow:
    size: 12px
    weight: 600
    line_height: 1.30
    letter_spacing: 0.6px
    text_transform: uppercase

  button:
    size: 14px
    weight: 600
    line_height: 1.20
    letter_spacing: 0

  mono:
    size: 13px
    weight: 400
    line_height: 1.50
    letter_spacing: 0
```

### Typography Principles

- Use **negative tracking** for large headings, inspired by Stripe, Linear, and Apple.
- Use **600 weight**, not heavy 700/800, for premium clinical confidence.
- Body text should be readable and calm, closer to Mintlify documentation clarity than marketing hype.
- Use 14–16px body type for dense evidence and product tables.
- Use mono only for SKUs, file sequences, ISO sizes, GTIN/UDI references, code-like labels, or regulatory identifiers.
- Avoid overly thin 300-weight typography for clinical claims; it can feel fragile.
- Avoid huge all-caps marketing headlines.

---

## Layout and Spacing

### Spacing Scale

Use an 8px rhythm with 4px fine increments.

```yaml
spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  section_sm: 64px
  section: 96px
  hero: 120px
```

### Containers

```yaml
containers:
  narrow: 760px
  prose: 820px
  standard: 1180px
  wide: 1280px
  product: 1440px
```

### Layout Principles

- Use generous whitespace like Apple, but not empty consumer-electronics minimalism.
- Use Linear’s precise card and grid discipline.
- Use Stripe’s polished section flow: hero → proof → product explanation → workflow → evidence → CTA.
- Use Mintlify’s 3-column or 2-column layouts for clinical/evidence pages.
- Do not make pages look like a dense dental catalogue.
- Do not make pages feel like a developer-only documentation site unless it is an evidence/downloads page.

### Recommended Page Rhythm

For product pages:

1. Premium product hero.
2. Short clinical positioning line.
3. Product render or clinical mechanism visual.
4. Workflow placement: Assess → Access → Glide → Shape → Clean 3D → Seal → Restore.
5. Key design/technology section.
6. Clinical benefit cards.
7. Evidence or references.
8. Product variants/SKUs.
9. Dealer/contact CTA.

For evidence pages:

1. Page title and evidence promise.
2. Summary cards.
3. Study table.
4. Clinical interpretation blocks.
5. Limitations / responsible claims.
6. Downloads and citations.

For ecommerce pages:

1. Clean product title.
2. Product image/render.
3. Clear pack size and SKU information.
4. Clinical use summary.
5. Sequence/size table.
6. Add-to-cart or enquiry CTA.
7. IFU/SDS/download links.

---

## Elevation and Depth

EndoTech should use restrained elevation.

```yaml
elevation:
  flat: none
  hairline: "1px solid #E3E8EE"
  card: "0 1px 3px rgba(0, 55, 112, 0.08)"
  floating_panel: "0 8px 24px rgba(0, 55, 112, 0.08), 0 2px 6px rgba(0, 55, 112, 0.04)"
  product_shadow: "0 24px 48px rgba(16, 32, 51, 0.12)"
```

### Elevation Principles

- Use shadows sparingly.
- Cards should mostly rely on white surface + hairline border.
- Product renders may have soft Apple-like product shadow.
- Technical mockups can float gently like Stripe panels.
- Do not add heavy drop shadows to every card.
- Do not use neon glow effects.

---

## Border Radius

```yaml
rounded:
  none: 0px
  xs: 4px
  sm: 6px
  md: 8px
  lg: 12px
  xl: 16px
  xxl: 24px
  pill: 9999px
  full: 9999px
```

### Radius Principles

- Use 12px for standard cards.
- Use 16px for product mockups and larger panels.
- Use pill radius for CTAs, tags, and chips.
- Avoid overly bubbly, playful rounded corners.
- Avoid sharp corporate 0px corners except in full-width sections or technical diagrams.

---

## Components

### Buttons

#### Primary Button

Use for main action: Buy, Enquire, Request Samples, Contact Distributor.

```yaml
button_primary:
  background: "#0B75B7"
  text: "#FFFFFF"
  padding: "10px 20px"
  radius: "9999px"
  font: "14px / 600"
  hover: "#09639B"
```

#### Secondary Button

Use for Learn More, View Evidence, Download IFU.

```yaml
button_secondary:
  background: "#FFFFFF"
  text: "#0B75B7"
  border: "1px solid #B8D8EA"
  padding: "10px 20px"
  radius: "9999px"
```

#### Ghost Button

Use for quiet secondary navigation.

```yaml
button_ghost:
  background: "transparent"
  text: "#273951"
  padding: "8px 12px"
  radius: "8px"
```

#### Dark-Surface Button

Use on dark navy technical sections.

```yaml
button_on_dark:
  background: "#FFFFFF"
  text: "#07111D"
  padding: "10px 20px"
  radius: "9999px"
```

### Cards

#### Standard Clinical Card

```yaml
clinical_card:
  background: "#FFFFFF"
  border: "1px solid #E3E8EE"
  radius: "12px"
  padding: "24px"
  shadow: "none or subtle card shadow"
```

Use for product benefits, clinical notes, workflow steps, feature explanations.

#### Technical Feature Card

```yaml
technical_card:
  background: "#F8FAFC"
  border: "1px solid #E3E8EE"
  radius: "16px"
  padding: "32px"
```

Use for Transform Technology, Avatar Tip, metallurgy, fatigue, file design, irrigation mechanism.

#### Evidence Card

```yaml
evidence_card:
  background: "#FFFFFF"
  border: "1px solid #E3E8EE"
  radius: "12px"
  padding: "24px"
  title_style: "heading_sm"
  body_style: "body_sm"
```

Must include:

- Study title or topic.
- Clinical meaning.
- Responsible limitation if needed.
- Optional PubMed/download link.

#### Product Render Panel

```yaml
product_render_panel:
  background: "linear-gradient(135deg, #ffffff 0%, #f6f9fc 100%)"
  radius: "24px"
  padding: "48px"
  shadow: "0 24px 48px rgba(16, 32, 51, 0.12)"
```

Use for premium product imagery, packaging, files, irrigation needles, sealers.

### Badges and Tags

Use for SKU, ISO size, taper, sterile, single-use, evidence level, workflow step.

```yaml
badge:
  background: "#EEF8FC"
  text: "#064B78"
  border: "1px solid #B8D8EA"
  radius: "9999px"
  padding: "4px 10px"
  typography: "caption / 600"
```

Approved badge examples:

- Sterile
- Single-use
- NiTi Rotary
- Glide Path
- Shape
- Finish
- ISO 25
- .04 Taper
- Evidence
- IFU
- SDS

### Tables

Use tables for clinical evidence, SKU lists, GTIN/UDI, sequence comparisons, pricing, and distributor information.

```yaml
table:
  header_background: "#F6F9FC"
  row_background: "#FFFFFF"
  row_alt_background: "#FAFCFE"
  border: "1px solid #E3E8EE"
  text: "#102033"
  muted_text: "#64748D"
  radius: "12px"
```

Table rules:

- Use 14px body text.
- Use mono for SKU, GTIN, UDI, REF, ISO size, taper.
- Keep row height comfortable.
- Use clear column names.
- Avoid decorative colours in clinical tables.

### Navigation

Use a clean white or frosted white nav.

```yaml
nav:
  background: "rgba(255,255,255,0.88)"
  backdrop_filter: "blur(16px)"
  border_bottom: "1px solid #E3E8EE"
  height: "64px"
  text: "#273951"
  active: "#0B75B7"
```

Navigation should feel premium and restrained. Do not use a black Apple-style global nav as the default EndoTech nav.

---

## Imagery and Product Presentation

### Product Imagery Principles

- Product renders should be crisp, isolated, and high resolution.
- Use white, soft grey, or clinical blue-grey backgrounds.
- Allow product imagery to breathe.
- Packaging and file renders should sit on premium studio surfaces.
- Avoid cluttered catalogue imagery.
- Avoid stock photos of dentists unless authentic, restrained, and high quality.
- Prefer clinical mechanism diagrams, engineering sketches, product renders, and macro material detail.

### Hero Imagery

Use Apple-like product confidence:

- Large product render on right or centered.
- Short headline.
- One-line clinical promise.
- Two CTAs maximum.
- Plenty of whitespace.

Do not create a hero with too many claims, badges, icons, and buttons.

### Technical Diagrams

Use EndoTech’s established engineering sketch style:

- Pencil/technical linework.
- Precise labels.
- Clean grey/blue surfaces.
- Minimal accent colours.
- Dotted callouts or fine leader lines where needed.

---

## Clinical Claim Style

EndoTech must use responsible clinical language.

Prefer:

- “designed to support”
- “intended to help”
- “supports controlled shaping”
- “helps maintain canal path”
- “engineered for flexibility and control”
- “evidence-informed workflow”
- “supports safer, more predictable preparation”

Avoid unsupported absolutes:

- “eliminates risk”
- “guarantees no separation”
- “prevents all ledging”
- “best in the world”
- “clinically proven superior” unless supported directly and specifically

---

## Page Type Guidance

### Home Page

Design direction: Stripe + Apple + Linear.

- White clinical hero.
- Premium product or workflow visual.
- One strong positioning statement.
- Clear product family navigation.
- Dealer/distributor credibility.
- Evidence-led product sections.

### Product Page

Design direction: Apple + Stripe + Linear.

- Product first.
- Short clinical reason to care.
- Clear technology explanation.
- Sequence/SKU clarity.
- Evidence or IFU/download links.
- Strong CTA.

### Evidence and Downloads Page

Design direction: Mintlify + Linear.

- Dense but readable.
- Use filters, tables, cards, citations, downloads.
- White/soft grey backgrounds.
- Minimal decoration.
- Strong document hierarchy.

### Clinical Workflow Page

Design direction: Stripe + Mintlify.

- Use workflow steps: Assess → Access → Glide → Shape → Clean 3D → Seal → Restore.
- Each step should have: clinical objective, EndoTech product fit, evidence/education link.
- Use diagrams and structured cards.

### Ecommerce / NZ Product Catalogue

Design direction: Shopify lightly + Stripe + Linear.

- Clean product cards.
- Clear SKU/pack/price/stock status.
- Trust and regulatory readiness.
- Avoid marketplace clutter.

---

## Motion and Interaction

Motion must be subtle and purposeful.

Use:

- 150–250ms transitions.
- Gentle hover lift on cards.
- Soft button colour transitions.
- Subtle reveal animations for product/diagram sections.
- Carefully controlled scroll animations for mechanism explanations.

Avoid:

- Bouncy interactions.
- Overly playful hover effects.
- Excessive parallax.
- Neon glow animations.
- Motion that distracts from clinical credibility.

---

## Accessibility

- Maintain high contrast for all text.
- Body text should not drop below 14px except legal fine print.
- Buttons must have clear focus states.
- Do not rely on colour alone for clinical status or warnings.
- Ensure evidence tables are readable on mobile.
- Avoid tiny grey text for important clinical or regulatory information.

---

## Implementation Instructions for AI Agents

When generating EndoTech pages or components:

1. Use this DESIGN.md as the single source of visual truth.
2. Build with a premium clinical technology feel.
3. Use white, soft grey, EndoTech blue, restrained teal/green, and dark navy only when needed.
4. Use generous but disciplined spacing.
5. Keep product imagery or diagrams central.
6. Use cards, tables, and evidence blocks for clinical information.
7. Keep claims responsible and evidence-led.
8. Avoid generic SaaS visual clichés.
9. Avoid consumer-electronics or automotive styling.
10. Make the final result look suitable for a serious dental medical-device company.

---

## Quick Build Prompt

Use this prompt with Codex, Stitch, Cursor, Claude, or another AI build tool:

```text
Use the DESIGN.md file as the visual design system for the EndoTech website. Build a premium clinical dental technology page with Stripe-level commercial polish, Linear-level precision and spacing, Mintlify-level documentation clarity, and Apple-level product presentation. Keep the design white, clinical, restrained, evidence-led, and product-focused. Avoid generic SaaS gradients, playful startup illustrations, consumer electronics styling, automotive drama, and over-dark futuristic UI.
```

---

## Do / Do Not Summary

### Do

- Use premium white/grey clinical surfaces.
- Use EndoTech blue as the main CTA colour.
- Use restrained cards and hairline borders.
- Use precise spacing and clear hierarchy.
- Use product renders, diagrams, workflow visuals, and evidence blocks.
- Make pages feel trustworthy to dentists, dealers, and regulators.

### Do Not

- Copy Stripe’s colourful mesh gradient directly.
- Copy Linear’s nearly black full-site canvas as the default.
- Copy Mintlify’s playful atmospheric SaaS hero too strongly.
- Copy Apple’s consumer-electronics tone too literally.
- Use generic AI/startup design clichés.
- Overload pages with claims, icons, or badges.
- Make the website feel like a commodity dental catalogue.
