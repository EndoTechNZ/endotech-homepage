# EndoTech Remotion Template

This Remotion project is now scaffolded as a reusable promo template instead of a single hard-coded demo.

## What to edit

Update [`src/promoData.ts`](C:\Users\Stephen\Documents\GitHub\endotech-homepage\endotech-video\src\promoData.ts) to create new video variants.

Each video object controls:

- title and subtitle
- clinical problem
- TransformX solution
- key features
- clinical benefits
- closing CTA
- product imagery and accent colours
- per-scene timing overrides

## Current composition

The default render target is:

- `EndoTechPromo-transformx`

Output file:

- `public/videos/transformx-promo.mp4`

## Commands

From the repo root:

```bash
npm run video:start
npm run video:render
```

Or from `endotech-video`:

```bash
npm start
npm run render
```

## Recommended workflow

1. Duplicate the object in `promoVideos`.
2. Change `id`, copy, products, and imagery.
3. Render a new composition using `EndoTechPromo-your-id`.
4. Keep the scene order fixed so each product video stays clinically structured and consistent.
