# EndoTech DESIGN.md

## Purpose

This file is the single source of truth for visual design direction across EndoTech NZ and EndoTech SG pages, including:

- Homepage
- Product pages
- Clinical workflow pages
- Technology pages
- Education pages
- Evidence and downloads pages
- Ecommerce and ordering pages
- AI-generated sections and components

Use this file when redesigning or extending EndoTech pages in Astro. The goal is a premium clinical medical-device website for dentists and clinical buyers, not a generic SaaS site, not a consumer electronics landing page, and not a playful startup brand.

---

## Core Direction

EndoTech should follow a **Studio Minimalism** direction:

- Soft clinical grey backgrounds
- Crisp white cards and surfaces
- Restrained medical blue accents
- Inter typography
- Product-led studio imagery
- Evidence-led medical-device presentation
- Precise layout discipline
- Minimal decoration

The site should feel:

- Clinical
- Precise
- Calm
- Trustworthy
- Evidence-led
- Commercially polished
- Technically serious

The site should not feel like:

- Generic SaaS marketing
- Consumer electronics advertising
- Dark futuristic tech
- Automotive or lifestyle branding
- Playful startup illustration work

---

## Brand Personality

EndoTech is:

- Clinical, engineered, and premium
- Evidence-led, calm, and commercially credible
- Modern but not trendy
- Technical but not cold
- Professional without being sterile or bureaucratic

EndoTech should communicate:

- Better workflow design in endodontics
- Safer and more controlled canal shaping
- Clean 3D irrigation logic
- Predictable obturation and sealing pathways
- Regulatory and clinical seriousness
- New Zealand distributor and clinic confidence

---

## Visual Formula

Use this overall mix:

```text
50% Studio Minimalism
20% Linear precision
20% Mintlify clarity
10% Apple product confidence
```

Interpretation:

- **Studio Minimalism**: soft grey studio backgrounds, white content cards, product-led imagery, restrained surfaces
- **Linear precision**: exact spacing, hairline borders, compact discipline, quiet hierarchy
- **Mintlify clarity**: evidence structure, educational readability, tables, references, downloads
- **Apple product confidence**: strong product presentation, generous whitespace, concise hero framing

Avoid copying any source style too literally. EndoTech should remain a clinical dental medical-device brand.

---

## Color System

### Primary Palette

Use a restrained, clinical palette.

```yaml
colors:
  canvas: "#F9F9FB"
  canvas_soft: "#F5F5F7"
  canvas_clinical: "#F3F3F5"
  canvas_section: "#EEEFF2"

  surface: "#FFFFFF"
  surface_soft: "#F8FAFC"
  surface_tint: "#EEF6FB"
  surface_recessed: "#E8E8EA"

  ink: "#1A1C1D"
  ink_secondary: "#273951"
  ink_muted: "#64748D"
  ink_subtle: "#8A94A3"
  ink_inverse: "#FFFFFF"

  primary: "#005596"
  primary_hover: "#00497E"
  primary_deep: "#003E6F"
  primary_soft: "#DCEFF8"
  primary_pale: "#EEF8FC"

  accent_teal: "#1BA6A6"
  accent_green: "#4BAE73"
  accent_warning: "#B7791F"
  accent_error: "#BA1A1A"

  hairline: "#E3E8EE"
  hairline_strong: "#C1C7D2"
  outline: "#727781"
```

### Color Principles

- Default to soft grey or off-white backgrounds, not pure flat white everywhere
- Use crisp white for cards, panels, tables, and active content surfaces
- Use medical blue only for CTAs, links, highlights, and selected technical accents
- Use green or teal sparingly for positive clinical signals only
- Use red only for warnings, errors, or cautions
- Prefer tonal layering over strong color blocking

### Gradient Rules

Gradients should be rare and very restrained.

Approved use:

- Soft white-to-clinical-grey transitions
- Very subtle blue-white technical background moments

Avoid:

- Heavy gradients
- Mesh gradients
- Rainbow gradients
- Dark moody gradient canvases

Example approved gradients:

```css
--gradient-clinical-soft: linear-gradient(180deg, #ffffff 0%, #f6f9fc 100%);
--gradient-technical-soft: linear-gradient(135deg, #ffffff 0%, #f3f7fb 100%);
```

---

## Typography

### Font Stack

Use Inter as the primary typeface.

```css
font-family: Inter, "SF Pro Display", "SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
```

For technical identifiers, SKUs, GTIN/UDI, and dense numeric data:

```css
font-family: "Geist Mono", "SF Mono", ui-monospace, Menlo, Consolas, monospace;
```

### Typography Tokens

```yaml
typography:
  hero_display:
    font_family: Inter
    size: 56px
    weight: 600
    line_height: 1.06
    letter_spacing: -0.02em

  display_lg:
    font_family: Inter
    size: 48px
    weight: 600
    line_height: 1.10
    letter_spacing: -0.02em

  display_md:
    font_family: Inter
    size: 36px
    weight: 600
    line_height: 1.14
    letter_spacing: -0.015em

  heading_lg:
    font_family: Inter
    size: 28px
    weight: 600
    line_height: 1.22
    letter_spacing: -0.01em

  heading_md:
    font_family: Inter
    size: 22px
    weight: 600
    line_height: 1.28
    letter_spacing: -0.01em

  heading_sm:
    font_family: Inter
    size: 18px
    weight: 600
    line_height: 1.36
    letter_spacing: 0

  lead:
    font_family: Inter
    size: 20px
    weight: 400
    line_height: 1.55
    letter_spacing: 0

  body:
    font_family: Inter
    size: 16px
    weight: 400
    line_height: 1.55
    letter_spacing: 0

  body_sm:
    font_family: Inter
    size: 14px
    weight: 400
    line_height: 1.5
    letter_spacing: 0

  caption:
    font_family: Inter
    size: 13px
    weight: 400
    line_height: 1.4
    letter_spacing: 0

  eyebrow:
    font_family: Inter
    size: 12px
    weight: 600
    line_height: 1.2
    letter_spacing: 0.08em
    text_transform: uppercase

  button:
    font_family: Inter
    size: 14px
    weight: 600
    line_height: 1.2
    letter_spacing: 0

  mono:
    font_family: Geist Mono
    size: 13px
    weight: 500
    line_height: 1.45
    letter_spacing: 0.02em
```

### Typography Principles

- Prefer clean, locked-in Inter typography over expressive display fonts
- Use negative tracking only on major headings
- Use 600 for most headings and buttons
- Avoid heavy 800-weight marketing typography
- Keep body text calm and readable
- Use uppercase labels sparingly for section markers, technical identifiers, and eyebrow text
- Avoid huge all-caps headlines

---

## Layout and Grid

### Grid System

Use a **12-column grid** with a **maximum content width of 1280px**.

```yaml
grid:
  columns: 12
  max_width: 1280px
  gutter: 24px
  outer_margin_desktop: 32px
  outer_margin_mobile: 18px
```

### Spacing System

Use a strict **8px spacing system**.

```yaml
spacing:
  base: 8px
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

### Container Sizes

```yaml
containers:
  narrow: 760px
  prose: 820px
  standard: 1180px
  wide: 1280px
```

### Layout Principles

- Use breathable spacing and a disciplined grid
- Favor white cards on soft clinical grey backgrounds
- Use whitespace to reduce cognitive load
- Keep product imagery prominent and uncluttered
- Do not crowd sections with too many claims, chips, or micro-panels
- Do not make pages look like a dental supply catalogue

### Recommended Section Rhythm

General page rhythm:

1. Hero
2. Product or clinical framing
3. Supporting product or workflow section
4. Evidence or educational support
5. CTA

---

## Elevation and Depth

Use tonal layering first, shadow second.

```yaml
elevation:
  flat: none
  hairline: "1px solid #E3E8EE"
  card: "0 1px 3px rgba(16, 32, 51, 0.06)"
  floating_panel: "0 8px 24px rgba(16, 32, 51, 0.08)"
  overlay: "0 16px 40px rgba(16, 32, 51, 0.10)"
  product_shadow: "0 24px 48px rgba(16, 32, 51, 0.12)"
```

### Elevation Principles

- Use soft ambient shadows only
- Most hierarchy should come from background tone and border contrast
- Cards should be white with hairline borders
- Product renders may use a subtle studio shadow
- Avoid heavy drop shadows and glow effects

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

- Use 12px to 16px for most cards and panels
- Use 24px for larger product imagery containers or feature panels
- Use pill radius for CTAs, tags, and status badges where appropriate
- Avoid bubbly or playful rounding

---

## Components

### Buttons

#### Primary Button

Use for main action:

- Contact
- Enquire
- Request pricing
- Order
- Request samples

```yaml
button_primary:
  background: "#005596"
  text: "#FFFFFF"
  padding: "10px 20px"
  radius: "9999px"
  font: "14px / 600"
  hover: "#00497E"
```

#### Secondary Button

Use for:

- Learn more
- View evidence
- Download IFU
- Review workflow

```yaml
button_secondary:
  background: "#FFFFFF"
  text: "#003E6F"
  border: "1px solid #C1C7D2"
  padding: "10px 20px"
  radius: "9999px"
```

#### Ghost Button

```yaml
button_ghost:
  background: "transparent"
  text: "#273951"
  padding: "8px 12px"
  radius: "8px"
```

### Cards

#### Standard Clinical Card

```yaml
clinical_card:
  background: "#FFFFFF"
  border: "1px solid #E3E8EE"
  radius: "16px"
  padding: "24px"
  shadow: "subtle only"
```

Use for:

- Product benefits
- Clinical notes
- Workflow steps
- Product-system summaries

#### Technical Feature Card

```yaml
technical_card:
  background: "#FFFFFF"
  border: "1px solid #E3E8EE"
  radius: "16px"
  padding: "24px to 32px"
```

Use for:

- Transform Technology
- Avatar Tip
- Irrigation mechanism
- Material or metallurgy explanation

#### Evidence Card

```yaml
evidence_card:
  background: "#FFFFFF"
  border: "1px solid #E3E8EE"
  radius: "16px"
  padding: "24px"
  title_style: "heading_sm"
  body_style: "body_sm"
```

Must support:

- Study title or topic
- Clinical meaning
- Responsible limitation where needed
- Citation or download link

#### Product Render Panel

```yaml
product_render_panel:
  background: "#FFFFFF"
  border: "1px solid #E3E8EE"
  radius: "24px"
  padding: "32px to 48px"
  shadow: "0 24px 48px rgba(16, 32, 51, 0.12)"
```

Use for:

- Packaging renders
- Rotary files
- Needles
- Sealer presentations
- Product system hero imagery

### Badges and Tags

```yaml
badge:
  background: "#EEF8FC"
  text: "#003E6F"
  border: "1px solid #C1C7D2"
  radius: "9999px"
  padding: "4px 10px"
  typography: "caption / 600"
```

Approved badge examples:

- Sterile
- Single-use
- Glide Path
- Shape
- Seal
- Evidence
- IFU
- SDS
- ISO 25
- .04 Taper

### Tables

```yaml
table:
  header_background: "#F6F9FC"
  row_background: "#FFFFFF"
  row_alt_background: "#FAFCFE"
  border: "1px solid #E3E8EE"
  text: "#1A1C1D"
  muted_text: "#64748D"
  radius: "12px"
```

Table rules:

- Use 14px body text
- Use mono for SKU, GTIN, UDI, REF, ISO size, taper
- Keep linework thin and quiet
- Avoid decorative color coding unless medically meaningful

### Navigation

```yaml
nav:
  background: "rgba(255,255,255,0.92)"
  backdrop_filter: "blur(16px)"
  border_bottom: "1px solid #E3E8EE"
  text: "#273951"
  active: "#005596"
```

Navigation should feel restrained, clinical, and premium. Default to white or frosted-white navigation rather than dark global headers.

---

## Imagery and Product Presentation

### Product Imagery Principles

- Use product-led studio imagery
- Prefer isolated hardware on white or soft clinical grey backgrounds
- Keep imagery crisp, high-resolution, and spacious
- Let the product be the hero
- Use mechanism diagrams and engineering visuals where helpful

Avoid:

- Stock-photo dentist lifestyle scenes as the main visual language
- Playful illustrations
- Cartoon iconography
- Busy collage layouts
- Consumer electronics glamour styling

### Hero Imagery

Hero sections should feel like premium medical-device presentation:

- Product render, system render, or clinical workflow visual
- One concise headline
- One short evidence-aware supporting line
- One or two primary actions, maximum three
- Strong whitespace discipline

### Technical Diagrams

Use:

- Precise linework
- Neutral surfaces
- Clear labels
- Fine leader lines
- Minimal accent color

Avoid:

- Decorative infographics
- Over-illustrated diagrams
- Dense unlabeled visual complexity

---

## Clinical Claim Style

Use responsible clinical language.

Prefer:

- “designed to support”
- “intended to help”
- “supports controlled shaping”
- “helps maintain canal path”
- “engineered for flexibility and control”
- “evidence-led”
- “supports safer, more predictable preparation”

Avoid unsupported absolutes:

- “eliminates risk”
- “guarantees no separation”
- “prevents all ledging”
- “best in the world”
- “clinically proven superior” unless directly and specifically supported

---

## Page Type Guidance

### Home Page

Design direction:

- Studio Minimalism
- Product-led hero
- Workflow-first framing
- Clear product family overview
- Evidence/downloads support
- NZ contact and availability confidence

### Product Page

Design direction:

- Product first
- Short clinical problem
- Clear solution framing
- Key features
- Clinical benefits
- Evidence/download links
- Strong CTA

Every product page should still support the core EndoTech structure:

1. Clinical Problem
2. TransformX Solution
3. Key Features
4. Clinical Benefits

### Evidence and Downloads Page

Design direction:

- Dense but readable
- White cards on soft grey backgrounds
- Strong document hierarchy
- Filters, tables, cards, citations, downloads
- Minimal decoration

### Clinical Workflow Page

Design direction:

- Structured cards and diagrams
- Sequential logic
- Each step should connect objective, product fit, and education/evidence

Workflow order:

Assess → Access → Glide → Shape → Clean 3D → Seal → Restore

### Ecommerce / NZ Catalogue / Order Pages

Design direction:

- Clean product cards
- Clear SKU, pack, and enquiry paths
- Professional purchasing confidence
- No marketplace clutter

---

## Motion and Interaction

Motion must be subtle and purposeful.

Use:

- 150ms to 250ms transitions
- Gentle hover lift on cards
- Soft button color shifts
- Quiet reveal animations only where helpful

Avoid:

- Bouncy interactions
- Playful hover effects
- Neon glow
- Heavy parallax
- Constant animation

---

## Accessibility

- Maintain strong contrast
- Keep body text at 14px minimum except legal fine print
- Ensure visible focus states
- Do not rely on color alone for warnings or status
- Make tables and downloads readable on mobile
- Avoid tiny muted text for important clinical information

---

## Implementation Instructions for Codex

When generating or redesigning EndoTech pages:

1. Use this file as the single source of visual direction.
2. Follow Studio Minimalism, not generic SaaS.
3. Use soft clinical grey backgrounds and crisp white cards.
4. Use restrained medical blue accents only where needed.
5. Use Inter typography throughout.
6. Follow a 12-column grid with a 1280px max width.
7. Use an 8px spacing system.
8. Keep product imagery central and uncluttered.
9. Present evidence, downloads, workflow, and product rationale clearly.
10. Keep claims responsible and medically credible.
11. Avoid consumer-electronics styling, playful illustrations, dark futuristic themes, and heavy gradients.

---

## Quick Build Prompt

```text
Use DESIGN.md as the visual design system for EndoTech NZ. Build a premium clinical dental medical-device page using Studio Minimalism: soft clinical grey backgrounds, crisp white cards, restrained medical blue accents, Inter typography, a 12-column 1280px grid, and an 8px spacing system. Keep the page product-led, evidence-led, precise, and commercially credible. Avoid generic SaaS styling, consumer electronics feel, playful illustrations, dark futuristic styling, and heavy gradients.
```

---

## Do / Do Not Summary

### Do

- Use soft clinical grey backgrounds
- Use crisp white cards
- Use restrained medical blue for actions and highlights
- Use Inter with precise hierarchy
- Use product-led studio imagery
- Use evidence blocks, tables, workflow sections, and downloads clearly
- Make the site feel credible to dentists, clinics, distributors, and regulators

### Do Not

- Use generic SaaS hero patterns
- Use colorful mesh gradients
- Use dark moody tech canvases as the default
- Use consumer electronics tropes
- Use playful illustrations or startup iconography
- Overload pages with badges, claims, or decorative UI
- Make the brand feel like a commodity dental catalogue
