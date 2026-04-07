# NZ Netlify Setup

Use this branch and deployment path for `endotechnz.com` without affecting the SG site.

## Goal

- Keep `endotechsg.com` on its current deployment
- Deploy `codex/nz-commerce` to a separate Netlify site
- Point `endotechnz.com` to that new Netlify site

## Recommended steps

### 1. Create a new Netlify site

- In Netlify, choose **Add new site** from Git
- Select the GitHub repo `EndoTechNZ/endotech-homepage`
- Choose branch: `codex/nz-commerce`

### 2. Build settings

- Build command: `npm run build`
- Publish directory: `dist`

### 3. Add NZ environment variables

Use `.env.nz.example` as the source of truth.

- `PUBLIC_SITE_URL=https://endotechnz.com`
- `PUBLIC_SITE_NAME=EndoTech New Zealand`
- `PUBLIC_SITE_SHORT_NAME=EndoTech NZ`
- `PUBLIC_DOCS_TITLE=EndoTech NZ Docs`
- `PUBLIC_REGION_LABEL=New Zealand`
- `PUBLIC_CONTACT_EMAIL=Steveshepherdnz@gmail.com`
- `PUBLIC_HOMEPAGE_TITLE=EndoTech New Zealand | TransformX™ Rotary Endodontic Files`
- `PUBLIC_SITE_DESCRIPTION=EndoTech New Zealand offers TransformX rotary endodontic files, Acrobat glide path instruments, and bioceramic materials for clinically controlled shaping and sealing workflows.`
- `PUBLIC_ORGANIZATION_DESCRIPTION=Clinical endodontic systems and bioceramic materials presented for New Zealand clinicians with a workflow-first, evidence-aware approach.`

### 4. Connect domain

- Add custom domain: `endotechnz.com`
- Add `www.endotechnz.com` only if wanted
- Update DNS at the registrar to point to the new Netlify site

### 5. Keep SG safe

- Do not switch the existing SG Netlify site to this branch
- Do not reuse the SG custom domain on the NZ deployment
- Keep `main` as the SG-safe branch until NZ work is approved and launched

## After Netlify is live

Next step is Shopify:

1. Create the NZ Shopify store
2. Configure NZ pricing, GST, and shipping
3. Add Storefront API credentials to the NZ Netlify site only
4. Start with one product end-to-end before rolling commerce out across the site
