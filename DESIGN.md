# EndoTech DESIGN.md

## Purpose

This file defines the visual design system for EndoTech NZ and EndoTech SG across:

- homepage and landing pages
- product overview and product detail pages
- workflow and technology pages
- evidence and downloads pages
- contact, company, and support pages
- ecommerce and enquiry pages

Use this file as the single source of truth for visual direction.

The current EndoTech redesign direction is led by:

- **Google Stitch**: centered product heroes, modular section rhythm, premium studio presentation, calm page composition
- **Linear**: disciplined spacing, sharp hierarchy, minimal chrome, exact UI structure
- **Apple**: product confidence, white space, clean imagery, restrained clarity
- **Documentation clarity where needed**: dense information made readable, especially for evidence and downloads

EndoTech must feel like a **premium clinical dental technology company**. It must not feel like a generic SaaS startup, consumer electronics brand, lifestyle brand, or playful AI product.

---

## Brand Personality

EndoTech is:

- Clinical
- Precise
- Engineered
- Premium
- Trustworthy
- Evidence-led
- Calm
- Commercially credible

EndoTech should communicate:

- Better endodontic workflow design
- Safer and more controlled canal shaping
- Clear system logic from glide path to final seal
- Clinical seriousness
- Distributor and dealer credibility
- Dentist-friendly product clarity

Avoid:

- Generic SaaS gradients
- Playful startup illustrations
- Consumer electronics styling
- Dark futuristic sci-fi interfaces
- Automotive drama
- Excessive animation
- Crowded dental-supply catalogue styling
- Aggressive marketing language

---

## Core Visual Direction

The EndoTech design direction is now:

```text
60% Google Stitch
20% Linear
15% Apple
5% documentation clarity
```

Interpret that as:

- **Google Stitch influence**:
  - centered heroes
  - modular product-landing-page sections
  - clean white and soft-grey surfaces
  - calm premium composition
  - strong product-image framing
- **Linear influence**:
  - exact spacing
  - minimal chrome
  - quiet borders
  - disciplined typography
- **Apple influence**:
  - product confidence
  - large isolated renders
  - negative space
  - concise messaging
- **Documentation clarity**:
  - only where useful for evidence, downloads, workflow, and technical pages

EndoTech should now look less like a mixed docs/marketing site and more like a **premium clinical product-system website**.

---

## Color System

### Primary Palette

Use EndoTech's own clinical palette.

```yaml
colors:
  canvas: "#FFFFFF"
  canvas_soft: "#F7F9FC"
  canvas_clinical: "#F3F6F8"
  canvas_warm: "#F5F5F7"

  surface: "#FFFFFF"
  surface_soft: "#F8FAFC"
  surface_blue_tint: "#EEF6FB"
  surface_steel: "#E8EDF2"

  ink: "#111827"
  ink_secondary: "#24364A"
  ink_muted: "#607084"
  ink_subtle: "#8A94A3"
  ink_inverse: "#FFFFFF"

  primary: "#0B75B7"
  primary_hover: "#09639B"
  primary_deep: "#064B78"
  primary_soft: "#DCEFF8"
  primary_pale: "#EEF8FC"

  accent_teal: "#1BA6A6"
  accent_green: "#4BAE73"
  accent_warning: "#B7791F"
  accent_error: "#C2413A"

  hairline: "#E3E8EE"
  hairline_strong: "#CAD5E0"
  hairline_blue: "#B8D8EA"

  dark_canvas: "#0C1730"
  dark_surface: "#0F1C38"
  dark_hairline: "#24364A"
  dark_ink: "#F8FAFC"
  dark_ink_muted: "#C4CFDB"
```

### Color Principles

- Default to **white and soft clinical grey** surfaces.
- Use EndoTech blue as the primary action colour.
- Use teal or green only for irrigation, flow, confirmation, or positive clinical signals.
- Use dark navy only for:
  - CTA endings
  - technical proof cards
  - occasional product-support sections
- Avoid heavy gradients.
- Avoid bright consumer colours.
- Avoid decorative colour systems that compete with the products.

### Approved Surface Treatments

Use subtle surfaces only.

```css
--surface-hero: linear-gradient(180deg, #ffffff 0%, #f7f9fc 100%);
--surface-panel: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
--surface-blue-panel: linear-gradient(180deg, #eef6fb 0%, #f8fbfd 100%);
--surface-dark-cta: linear-gradient(180deg, #0c1730 0%, #101b36 100%);
```

Do not use rainbow mesh gradients, startup glows, or overly dramatic lighting.

---

## Typography

### Font Stack

Use Inter as the primary typeface.

```css
font-family: Inter, "SF Pro Display", "SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
```

For mono, technical references, and SKUs:

```css
font-family: "Geist Mono", "SF Mono", ui-monospace, Menlo, Consolas, monospace;
```

### Typography Tokens

```yaml
typography:
  hero_display:
    size: 64px
    weight: 600
    line_height: 1.02
    letter_spacing: -2px

  display_lg:
    size: 48px
    weight: 600
    line_height: 1.08
    letter_spacing: -1.2px

  display_md:
    size: 36px
    weight: 600
    line_height: 1.14
    letter_spacing: -0.8px

  heading_lg:
    size: 28px
    weight: 600
    line_height: 1.2
    letter_spacing: -0.3px

  heading_md:
    size: 22px
    weight: 600
    line_height: 1.28
    letter_spacing: -0.1px

  heading_sm:
    size: 18px
    weight: 600
    line_height: 1.36

  lead:
    size: 20px
    weight: 400
    line_height: 1.5

  body:
    size: 16px
    weight: 400
    line_height: 1.65

  body_sm:
    size: 14px
    weight: 400
    line_height: 1.55

  eyebrow:
    size: 12px
    weight: 600
    line_height: 1.3
    letter_spacing: 0.18em
    text_transform: uppercase

  button:
    size: 14px
    weight: 600
    line_height: 1.2

  mono:
    size: 13px
    weight: 400
    line_height: 1.5
```

### Typography Principles

- Use Inter consistently.
- Use negative tracking on larger headings.
- Prefer 600 weight over heavy 700 or 800.
- Headlines should feel calm and exact, not shouty.
- Body text should stay clinically readable, not ad-like.
- Avoid self-referential design copy.
- Avoid giant blocks of explanatory marketing text.

---

## Layout and Spacing

### Grid

Use a **12-column grid** with a **1280px max content width** for major landing and product pages.

```yaml
containers:
  narrow: 760px
  prose: 820px
  standard: 1180px
  wide: 1280px
```

### Spacing Scale

Use an 8px system with 4px fine increments.

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

### Layout Principles

- Favor centered composition on major heroes.
- Use clean modular sections instead of long mixed-content blocks.
- Keep sections visually distinct, but restrained.
- Use whitespace generously, but do not make pages feel empty.
- Use product-image dominance where appropriate.
- Keep evidence pages structured and controlled, not cluttered.

### Preferred Section Rhythm

For major product and landing pages, prefer this structure:

1. Centered hero
2. Primary product image or system visual
3. One or two primary CTAs
4. Two-card proof or feature band
5. Workflow split section
6. Supporting product or system block
7. Evidence or downloads module
8. Dark CTA ending

This is now the clearest EndoTech page grammar.

---

## Homepage Hero Pattern

The EndoTech NZ homepage uses a typography-led clinical workflow hero. Treat this as the default landing-page pattern unless a future redesign explicitly replaces it.

### Structure

Use this order:

1. Light sticky navigation
2. Centered hero eyebrow, headline, restrained subhead, and two CTAs
3. Low-opacity product-system background image, secondary to the text
4. Glide / Shape / Finish workflow navigation strip
5. Generous breathing space
6. Thin clinical separator
7. Core Systems section

The hero should remain calm and mostly white. The product image should support trust and product recognition without becoming a conventional photo hero.

### Hero Copy Pattern

Use short, direct clinical workflow language.

Current homepage headline:

```text
Shape with confidence.
Clean with purpose.
Seal with control.
```

The first verb in each line may be dark ink, with the supporting phrase in pale grey. Maintain strong readability and avoid placing product detail directly behind this text.

### Product Background Treatment

Use a complete, recognizable product-system image as a soft background layer. Current example: TransformX ET box, black-handled files, tray, clinical tabletop, and soft operatory setting.

Treatment:

- Position the product image to the right side and lower hero transition.
- Keep the headline zone nearly clean white.
- Use approximately 8-10% image visibility behind central text.
- Use approximately 16-22% image visibility on the right-side product zone.
- Use blur around 18-28px and a white overlay or gradient mask to protect text contrast.
- Keep the image complete enough to recognize the product system; do not wash it out until it becomes meaningless.
- Let the image fade toward the Core Systems transition rather than sitting as a hard background panel.

Future products such as BCS Sealer, BCS Putty, or other systems may replace the TransformX image, but the same rules apply: product visible, text dominant, clinical calm preserved.

### Workflow Strip

Place a restrained horizontal workflow strip below the hero CTAs and before Core Systems. It should bridge the headline promise into the product systems without feeling like a heavy card.

Use:

- Three items: Glide, Shape, Finish
- Small step numbers: 01, 02, 03
- Circular tooth/canal line icons
- Thin vertical dividers
- Small circular arrow controls between steps
- Compact clinical descriptions
- Hairline borders and white/soft-grey surfaces only

Copy:

```text
01 Glide
Establish and maintain a consistent glide path.

02 Shape
Adaptive shaping for efficient dentin removal and anatomy conformance.

03 Finish
Refine the canal to final taper for optimal cleaning and disinfection.
```

### Separator and Section Transition

Do not let Core Systems crowd the workflow strip. Provide roughly 64-96px of breathing space after the strip, then use a very thin clinical hairline separator before Core Systems begins.

The separator should be subtle:

```css
border-top: 1px solid #E3E8EE;
```

Core Systems should begin below the separator with a clear centered eyebrow and heading.

### Mobile Behavior

On mobile:

- Keep the hero text first and readable.
- Reduce or hide the product background if it competes with text.
- Stack the workflow strip into three vertical steps.
- Preserve the separator and spacing before Core Systems.
- Do not require the image for understanding the page.

---

## Elevation and Borders

EndoTech should use restrained depth.

```yaml
elevation:
  flat: none
  hairline: "1px solid #E3E8EE"
  card: "0 1px 3px rgba(0, 55, 112, 0.06)"
  floating_panel: "0 8px 24px rgba(0, 55, 112, 0.08), 0 2px 6px rgba(0, 55, 112, 0.04)"
  product_shadow: "0 24px 48px rgba(16, 32, 51, 0.10)"
```

### Elevation Principles

- Rely mostly on white surfaces and hairline borders.
- Use shadow sparingly.
- Product renders may carry soft studio depth.
- Do not make every card float heavily.
- Do not use glow effects.

---

## Border Radius

```yaml
rounded:
  xs: 4px
  sm: 6px
  md: 8px
  lg: 12px
  xl: 16px
  xxl: 24px
  pill: 9999px
```

### Radius Principles

- Use 8px to 12px for most cards.
- Use 16px for larger product panels or media frames.
- Use pill radius for buttons and small badges.
- Avoid playful, overly round UI.

---

## Components

### Buttons

#### Primary Button

Use for:
- Product Systems
- Contact
- Order
- View Product
- View Evidence

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

```yaml
button_secondary:
  background: "#FFFFFF"
  text: "#0B75B7"
  border: "1px solid #B8D8EA"
  padding: "10px 20px"
  radius: "9999px"
```

#### Dark CTA Button

```yaml
button_on_dark:
  background: "#FFFFFF"
  text: "#0C1730"
  padding: "10px 20px"
  radius: "9999px"
```

### Cards

#### Clinical Card

```yaml
clinical_card:
  background: "#FFFFFF"
  border: "1px solid #E3E8EE"
  radius: "12px"
  padding: "24px"
```

Use for:
- workflow steps
- clinical notes
- feature summaries
- contact blocks

#### Proof Card

```yaml
proof_card:
  background: "#FFFFFF"
  border: "1px solid #E3E8EE"
  radius: "16px"
  padding: "28px"
```

Use in:
- two-card technical bands
- product proof modules
- evidence highlights

#### Dark Proof Card

```yaml
proof_card_dark:
  background: "#0B75B7"
  text: "#FFFFFF"
  radius: "16px"
  padding: "28px"
```

Use sparingly to create the Stitch-style white-card / blue-card contrast.

#### Evidence Card

```yaml
evidence_card:
  background: "#FFFFFF"
  border: "1px solid #E3E8EE"
  radius: "12px"
  padding: "24px"
```

Use for:
- evidence areas
- literature summaries
- document previews
- downloads modules

Do not duplicate multiple evidence-card systems on the same page unless there is a clear hierarchy.

### Tables

```yaml
table:
  header_background: "#F6F9FC"
  row_background: "#FFFFFF"
  row_alt_background: "#FAFCFE"
  border: "1px solid #E3E8EE"
  text: "#111827"
  muted_text: "#607084"
  radius: "12px"
```

Use tables for:
- product comparisons
- technical files
- SKUs
- evidence summaries
- downloads listings

### Navigation

```yaml
nav:
  background: "rgba(255,255,255,0.88)"
  backdrop_filter: "blur(16px)"
  border_bottom: "1px solid #E3E8EE"
  height: "64px"
  text: "#24364A"
  active: "#0B75B7"
```

Navigation should feel:
- light
- minimal
- premium
- calm

### Footer

Footer direction is now:
- more corporate
- more structured
- multi-column
- restrained
- useful rather than decorative

Use:
- brand block
- product links
- clinical/resource links
- company/support links
- lower legal or guidance row

Do not use a casual lightweight footer on primary pages.

---

## Imagery and Product Presentation

### Product Imagery Principles

- Product renders should be crisp, isolated, and high-resolution.
- Use white, pale grey, or soft clinical backgrounds.
- Let product imagery breathe.
- Prefer studio-style product presentation.
- Avoid cluttered catalogue imagery.
- Avoid decorative stock-photo dependency.

### Hero Imagery

Preferred hero pattern:

- centered composition
- one short eyebrow
- one short headline
- one restrained subhead
- one dominant product or system image
- one or two CTAs maximum

### Media Placement

Videos should be treated as:
- evidence modules
- workflow support modules
- product-support visuals

Not as decorative media dumps.

Frame videos carefully and pair them closely with the text that explains why they matter.

---

## Clinical Claim Style

Use responsible clinical language.

Prefer:

- “designed to support”
- “intended to help”
- “supports controlled shaping”
- “helps maintain canal path”
- “engineered for flexibility and control”
- “evidence-informed workflow”
- “supports safer, more predictable preparation”

Avoid:

- “eliminates risk”
- “guarantees”
- “prevents all”
- “best in the world”
- “clinically proven superior” unless directly and specifically supported

---

## Page Type Guidance

### Homepage

Design direction:
- Google Stitch + Linear + Apple restraint

Use:
- centered product-systems hero
- core system cards
- workflow split section
- supporting BCS or system block
- evidence/downloads block
- dark CTA ending

### Product Page

Design direction:
- Stitch-led product landing page

Use:
- centered hero
- large product render
- two-card proof band
- workflow or mechanism section
- supporting system block
- comparison or evidence module
- dark CTA ending

### Evidence and Downloads Page

Design direction:
- cleaner, sharper, more controlled than old docs pages

Use:
- centered title and evidence promise
- featured document block
- clearly grouped downloads
- controlled evidence cards
- carefully framed videos
- no duplicated card systems
- no self-referential design language

### Clinical Workflow Page

Design direction:
- Stitch composition with clinical clarity

Use:
- centered hero
- workflow cards
- supporting product associations
- structured progression from assess to restore

### Technology Page

Design direction:
- product-tech explanation, not generic education page

Use:
- hero
- design/technology modules
- controlled diagrams or videos
- direct link back to product system

### Ecommerce / Order Pages

Design direction:
- clean and trustworthy
- commerce-ready
- less stylized than marketing pages

Use:
- clear product grouping
- clear SKU/pack/order logic
- strong trust signals
- minimal visual distraction

Do not risk breaking Shopify or ordering logic for visual flourish.

---

## Motion and Interaction

Motion must be subtle and purposeful.

Use:
- 150ms to 250ms transitions
- gentle hover lift
- soft border and shadow transitions
- restrained reveals

Avoid:
- bouncy interactions
- parallax-heavy motion
- neon or glow effects
- decorative animation

---

## WebGL and Three.js Guidance

WebGL and Three.js are optional tools for EndoTech, not a default design layer.

They may be used only when motion or interactive 3D materially improves clinical or product understanding, such as:

- rotating product inspection for files, instruments, or packaging
- Transform Technology visualisation
- Avatar Tip explanation
- canal-shaping pathway demonstration
- VortiFlow irrigation or fluid-movement explanation
- controlled engineering or material-behaviour visualisations

WebGL must never be used as decoration alone. Do not use it for:

- ambient background effects
- abstract motion with no clinical meaning
- gaming-style interaction
- black or neon sci-fi visuals
- flashy hero gimmicks
- motion that reduces trust, clarity, or page readability

### Preferred Media Hierarchy

Use the simplest medium that communicates the idea clearly.

Prefer **CSS, SVG, Lottie, video, or static imagery** when they can explain the concept well enough.

Use:

- **CSS** for subtle interface motion, hover states, reveals, and small transitions
- **SVG** for diagrams, linework, process explanation, and scalable technical visuals
- **Lottie** for lightweight instructional animations with fixed paths and repeatable motion
- **Video** for real product footage, clinical demonstrations, irrigation flow clips, and controlled explanatory media
- **WebGL / Three.js** only when true 3D interaction, spatial understanding, or live viewpoint control adds clear educational value

If a concept works well as video or SVG, do not rebuild it in WebGL.

### Performance Requirements

All WebGL usage must be lightweight, progressive, and isolated.

Requirements:

- lazy load all WebGL code and assets
- never block first contentful render or core page content
- provide a static fallback image or poster state before interaction loads
- keep mobile performance as a first-class requirement, not an afterthought
- avoid heavy particle systems, complex physics, or large scene graphs
- keep GPU usage restrained and clinically calm
- ensure pages remain usable if WebGL fails or is unsupported
- do not make WebGL a dependency for primary navigation, product selection, ordering, or core content understanding

On mobile:

- default to simpler scenes, lower fidelity, or static/video fallback where needed
- avoid battery-heavy continuous rendering
- pause or reduce rendering when off-screen

### Accessibility Requirements

WebGL components must remain accessible and optional.

Requirements:

- honor `prefers-reduced-motion`
- provide a reduced-motion or static alternative
- do not autoplay aggressive or disorienting motion
- ensure essential information is also available in text, labels, captions, or static visuals
- do not rely on motion alone to explain a clinical claim
- preserve keyboard accessibility where controls are interactive
- maintain sufficient contrast and legibility around overlays, labels, and annotations

### Visual Tone

Any WebGL or Three.js component must match EndoTech's clinical visual tone:

- clean
- premium
- medical
- evidence-led
- calm
- trustworthy
- precise
- restrained

3D scenes should feel like product or clinical explanation tools, not tech demos.

Use:

- white, soft grey, and restrained blue-grey environments
- clean studio lighting
- disciplined camera movement
- minimal UI chrome
- simple labels or callouts where useful

Avoid:

- neon glows
- dark sci-fi environments
- decorative particles
- glossy gaming aesthetics
- dramatic cinematic effects
- excessive camera motion

### Implementation Guidance

WebGL must be isolated to specific components, never used as the foundation of the whole site.

Implementation rules:

- confine WebGL to self-contained modules such as `ProductViewer`, `TechnologyExplainer`, or `FlowVisualization`
- keep the rest of the page in standard HTML/CSS/Astro
- load WebGL only inside the section that needs it
- ensure every component has a static fallback state
- keep content architecture independent from the WebGL layer
- do not build whole-page layouts, navigation, or general page backgrounds in WebGL

EndoTech should remain a fast, clinically credible website first. WebGL is permitted only as a focused explanatory tool where it improves understanding of the product, workflow, or clinical mechanism.

---

## Accessibility

- Maintain strong contrast.
- Do not drop important body text below 14px.
- Ensure button focus states are clear.
- Do not rely on colour alone.
- Make tables and downloads readable on mobile.
- Keep evidence videos and documents understandable in context.

---

## Implementation Instructions for AI Agents

When generating EndoTech pages or components:

1. Use this file as the visual source of truth.
2. Favor Google Stitch-style composition adapted for a serious clinical brand.
3. Use white, soft grey, EndoTech blue, and restrained dark navy.
4. Build around modular sections, not long mixed-content blocks.
5. Keep product imagery central and well-framed.
6. Use evidence, downloads, and workflow content in clean controlled modules.
7. Keep claims responsible and evidence-led.
8. Avoid generic SaaS patterns.
9. Avoid consumer electronics tone.
10. Avoid self-referential filler copy about design or layout.

---

## Quick Build Prompt

```text
Use the DESIGN.md file as the visual design system for the EndoTech website. Build a premium clinical dental technology page in a Google Stitch-inspired style, with centered product heroes, crisp white and soft-grey surfaces, restrained blue accents, strong product imagery, modular landing-page sections, disciplined spacing, and evidence-led clarity. Keep the result clinical, precise, premium, and commercially credible. Avoid generic SaaS gradients, playful startup illustrations, consumer electronics styling, dark futuristic UI, messy documentation layouts, and overclaimed marketing language.
```

---

## Do / Do Not Summary

### Do

- Use centered heroes where appropriate.
- Use premium white and soft-grey clinical surfaces.
- Use EndoTech blue for key actions.
- Use modular sections with clear spacing.
- Use crisp product renders and controlled videos.
- Use a darker CTA ending sparingly and deliberately.
- Make pages feel trustworthy to dentists, dealers, and regulators.

### Do Not

- Use generic startup gradients.
- Use heavy decorative effects.
- Use duplicated card systems on evidence pages.
- Use playful or consumer-tech styling.
- Overload pages with claims, icons, or badges.
- Let downloads or evidence pages fall back into cluttered legacy layouts.
- Make the website feel like a commodity dental catalogue.
