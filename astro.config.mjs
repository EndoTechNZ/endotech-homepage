// @ts-check
import { existsSync, readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLinksValidator from 'starlight-links-validator';
import tailwindcss from '@tailwindcss/vite';

const isGitHubPages = process.env.DEPLOY_TARGET === 'github-pages';
const netlifySite = process.env.URL || process.env.DEPLOY_PRIME_URL;
const cnamePath = new URL('./public/CNAME', import.meta.url);
const customDomain = existsSync(cnamePath)
  ? readFileSync(cnamePath, 'utf8').trim()
  : '';
const publicSiteUrl = process.env.PUBLIC_SITE_URL;
const usesCustomDomain =
  Boolean(customDomain) ||
  (Boolean(publicSiteUrl) && !publicSiteUrl.includes('github.io'));
const site =
  publicSiteUrl ||
  (customDomain
    ? `https://${customDomain}`
    : isGitHubPages
      ? 'https://endotechnz.github.io'
      : netlifySite || 'https://endotechnz.github.io');
const base = isGitHubPages ? (usesCustomDomain ? '/' : '/endotech-homepage/') : '/';
const shouldNoIndex = process.env.NETLIFY === 'true' && process.env.CONTEXT !== 'production';
const docsTitle = process.env.PUBLIC_DOCS_TITLE || 'EndoTech Docs';
const contactEmail = process.env.PUBLIC_CONTACT_EMAIL || 'Steveshepherdnz@gmail.com';
const googleAnalyticsId = process.env.PUBLIC_GOOGLE_ANALYTICS_ID;
const clarityProjectId = process.env.PUBLIC_CLARITY_PROJECT_ID;
const starlightHead = [
  ...(shouldNoIndex
    ? [
      {
        tag: /** @type {'meta'} */ ('meta'),
        attrs: { name: 'robots', content: 'noindex, nofollow' },
      },
    ]
    : []),
  ...(googleAnalyticsId
    ? [
        {
          tag: /** @type {'script'} */ ('script'),
          attrs: {
            async: true,
            src: `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`,
          },
        },
        {
          tag: /** @type {'script'} */ ('script'),
          content: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config',${JSON.stringify(googleAnalyticsId)});`,
        },
      ]
    : []),
  ...(clarityProjectId
    ? [
        {
          tag: /** @type {'script'} */ ('script'),
          content: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script",${JSON.stringify(clarityProjectId)});`,
        },
      ]
    : []),
];

// https://astro.build/config
export default defineConfig({
  site,
  base,
  redirects: {
    '/products/et-transformx': '/products/transform-s-et',
    '/products/pt-transformx': '/products/transform-s-pt',
    '/products/acrobat-glide-path': '/products/micro-path',
  },
  integrations: [
    starlight({
      title: docsTitle,
      plugins: [
        starlightLinksValidator({
          errorOnRelativeLinks: false,
          exclude: ['/products/micro-path/**', '/products/c-plus/**', '/products/k-files/**'],
        }),
      ],
      head: starlightHead,
      favicon: '/brand/endotech-nz-logo-2026.jpg',
      logo: {
        light: './src/assets/endotech-nz-logo-2026.jpg',
        dark: './src/assets/endotech-nz-logo-2026.jpg',
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
            { label: 'Micro-Path™ Files', slug: 'products/micro-path' },
            { label: 'Transform S™ ET Files', slug: 'products/transform-s-et' },
            { label: 'Transform S™ PT Files', slug: 'products/transform-s-pt' },
            { label: 'Transform S™ C+ Files', slug: 'products/c-plus' },
            { label: 'Transform S™ K-Files', slug: 'products/k-files' },
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
