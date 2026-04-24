// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLinksValidator from 'starlight-links-validator';
import tailwindcss from '@tailwindcss/vite';

const isGitHubPages = process.env.DEPLOY_TARGET === 'github-pages';
const netlifySite = process.env.URL || process.env.DEPLOY_PRIME_URL;
const site = process.env.PUBLIC_SITE_URL || (isGitHubPages ? 'https://endotechnz.github.io' : netlifySite || 'https://endotechnz.github.io');
const base = isGitHubPages ? '/endotech-homepage/' : '/';
const shouldNoIndex = process.env.NETLIFY === 'true' && process.env.CONTEXT !== 'production';
const docsTitle = process.env.PUBLIC_DOCS_TITLE || 'EndoTech Docs';
const contactEmail = process.env.PUBLIC_CONTACT_EMAIL || 'Steveshepherdnz@gmail.com';
const starlightHead = shouldNoIndex
  ? [
      {
        tag: /** @type {'meta'} */ ('meta'),
        attrs: { name: 'robots', content: 'noindex, nofollow' },
      },
    ]
  : [];

// https://astro.build/config
export default defineConfig({
  site,
  base,
  integrations: [
    starlight({
      title: docsTitle,
      plugins: [
        starlightLinksValidator({
          errorOnRelativeLinks: false,
          exclude: ['/products/bcs/**', '/products/acrobat-glide-path/**'],
        }),
      ],
      head: starlightHead,
      logo: {
        light: './src/assets/logo-wordmark.png',
        dark: './src/assets/logo-wordmark-dark.png',
        replacesTitle: true,
      },
      social: [
        { icon: 'email', label: 'Contact', href: `mailto:${contactEmail}` },
      ],
      sidebar: [
        {
          label: 'Products',
          items: [
            { label: 'Overview', slug: 'products/overview' },
            { label: 'Rotary Glide Path Files', slug: 'products/rotary-glide-path-files' },
            { label: 'ET TransformX Files', slug: 'products/et-transformx' },
            { label: 'PT TransformX Files', slug: 'products/pt-transformx' },
            { label: 'VortiFlow Irrigation Needle', slug: 'products/vortiflow-irrigation-needle' },
            { label: 'BCS BioCeramics Family', slug: 'products/bcs' },
          ],
        },
        {
          label: 'Technology',
          items: [
            { label: 'Transform Technology', slug: 'technology/transform-technology' },
            { label: 'Avatar Tip', slug: 'technology/avatar-tip' },
          ],
        },
        {
          label: 'Technique',
          items: [
            { label: 'Workflow Overview', slug: 'technique/workflow' },
            { label: 'ET Technique', slug: 'technique/et-technique' },
            { label: 'PT Technique', slug: 'technique/pt-technique' },
            { label: 'Motor Settings', slug: 'technique/motor-settings' },
            { label: 'MB2 File', slug: 'technique/mb2-file' },
            { label: 'Rotary Files for Curved Canals', slug: 'technique/rotary-files-for-curved-canals' },
          ],
        },
        {
          label: 'Research',
          items: [
            { label: 'Clinical Evidence', slug: 'research/evidence' },
            { label: 'Apical Control', slug: 'research/apical-control' },
          ],
        },
        {
          label: 'Resources',
          items: [
            { label: 'Downloads', slug: 'resources/downloads' },
            { label: 'Clinical Tips', slug: 'resources/clinical-tips' },
          ],
        },
        {
          label: 'About',
          items: [
            { label: 'About EndoTech', slug: 'about/company' },
            { label: 'Contact & Orders', slug: 'about/contact' },
          ],
        },
      ],
      customCss: [
        './src/styles/custom.css',
      ],
      components: {
        Header: './src/components/starlight/Header.astro',
      },
      // Disable Starlight's default homepage - our custom page handles /
      disable404Route: false,
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
