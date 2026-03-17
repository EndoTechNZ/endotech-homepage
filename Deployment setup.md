# Deployment Setup

## GitHub Repo

- Repo owner: `EndoTechNZ`
- Repo name: `endotech-homepage`
- Remote URL: `https://github.com/EndoTechNZ/endotech-homepage.git`
- Primary branch: `main`

## Hosting

- Hosting platform: `GitHub Pages`
- Public URL: `https://endotechnz.github.io/endotech-homepage/`
- Deployment method: `GitHub Actions`

## Workflow

- Workflow file: `.github/workflows/deploy-pages.yml`
- Trigger: pushes to `main`
- Can also be run manually with `workflow_dispatch`

## Astro Config

- Production Pages deploys use `DEPLOY_TARGET=github-pages`
- GitHub Pages site URL is set to `https://endotechnz.github.io`
- GitHub Pages base path is `/endotech-homepage/`
- Local development uses the normal root path `/`

## Build Commands

- Local dev server: `npm run dev`
- Standard build: `npm run build`
- GitHub Pages build: `npm run build:github`
- Legacy staging-style build: `npm run build:staging`

## Validation

- Post-build validation is handled by `scripts/validate-all-links.js`
- The validator was updated to understand the GitHub Pages base path

## Notes

- The old secret-path/password-gate staging flow was removed from the default deployment path to make free public deployment simpler
- GitHub Pages is now the easiest shareable option for team review
- If the live site does not update immediately after a push, wait for the GitHub Actions deploy to finish

## Useful Links

- Repo: `https://github.com/EndoTechNZ/endotech-homepage`
- Actions: `https://github.com/EndoTechNZ/endotech-homepage/actions`
- Live site: `https://endotechnz.github.io/endotech-homepage/`
