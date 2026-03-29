// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLinksValidator from 'starlight-links-validator';
import tailwindcss from '@tailwindcss/vite';

const isGitHubPages = process.env.DEPLOY_TARGET === 'github-pages';
const site = isGitHubPages ? 'https://endotechnz.github.io' : undefined;
const base = isGitHubPages ? '/endotech-homepage/' : '/';

// https://astro.build/config
export default defineConfig({
  site,
  base,
  integrations: [
    starlight({
      title: 'EndoTech Docs',
      plugins: [
        starlightLinksValidator({
          errorOnRelativeLinks: false,
          exclude: ['/products/iroot/**'],
        }),
      ],
      head: [
        ...(isGitHubPages ? [] : [
          { tag: 'meta', attrs: { name: 'robots', content: 'noindex, nofollow' } },
        ]),
      ],
      logo: {
        light: './src/assets/logo-wordmark.png',
        dark: './src/assets/logo-wordmark-dark.png',
        replacesTitle: true,
      },
      social: [
        { icon: 'email', label: 'Contact', href: 'mailto:info@endotechsg.com' },
      ],
      sidebar: [
        {
          label: 'Products',
          items: [
            { label: 'Overview', slug: 'products/overview' },
            { label: 'ET TransformX Files', slug: 'products/et-transformx' },
            { label: 'PT TransformX Files', slug: 'products/pt-transformx' },
            { label: 'iRoot Sealer', slug: 'products/iroot-sealer' },
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
      // Disable Starlight's default homepage - our custom page handles /
      disable404Route: false,
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
