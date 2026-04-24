# NZ Commerce Architecture

This branch is the safe working area for `endotechnz.com`.

## Guardrails

- Do not change `main` while NZ commerce is being built.
- Keep `endotechsg.com` on its current deployment and content path.
- Use this branch for NZ-only commerce setup and config work.
- Use a separate Shopify store for NZ pricing, GST, shipping, orders, and checkout.

## Recommended rollout

### Phase 1: NZ branch and deployment

- Build on `codex/nz-commerce`
- Create a separate Netlify site for the NZ branch
- Point `endotechnz.com` at the NZ deployment
- Set NZ-specific environment variables there only

### Phase 2: Shopify backend

- Create a Shopify store dedicated to NZ
- Configure NZD pricing, GST, shipping zones, and checkout rules
- Load initial products:
  - ET TransformX
  - PT TransformX
  - Acrobat Glide Path
  - BCS BioCeramic Sealer
  - BCS BioCeramic Putty

### Phase 3: Astro + Shopify Storefront API

- Keep Astro/Netlify as the customer-facing front end
- Use Shopify Storefront API for:
  - product data
  - variants
  - cart
  - checkout redirect
- Start with one product end-to-end before rolling out across the catalog

### Phase 4: NZ UX and launch

- Keep the current EndoTech design language
- Add commerce controls carefully:
  - pricing
  - add to cart
  - cart
  - checkout
- Test GST, shipping, mobile UX, and checkout before launch

## Environment variables planned for NZ

- `PUBLIC_SITE_URL`
- `PUBLIC_SITE_NAME`
- `PUBLIC_SITE_SHORT_NAME`
- `PUBLIC_DOCS_TITLE`
- `PUBLIC_REGION_LABEL`
- `PUBLIC_CONTACT_EMAIL`
- `PUBLIC_SITE_DESCRIPTION`
- `PUBLIC_ORGANIZATION_DESCRIPTION`

## Current state

- This branch introduces a shared site identity config so SG and NZ can diverge safely without duplicating the whole codebase.
- The SG defaults remain in place unless NZ deployment variables are supplied.
