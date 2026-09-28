const defaultDescription =
  'EndoTech NZ supplies rotary NiTi endodontic files, glide path instruments, irrigation products, and bioceramic materials to New Zealand dentists and endodontists.';

export const siteConfig = {
  name: import.meta.env.PUBLIC_SITE_NAME ?? 'EndoTech NZ',
  shortName: import.meta.env.PUBLIC_SITE_SHORT_NAME ?? 'EndoTechNZ',
  docsTitle: import.meta.env.PUBLIC_DOCS_TITLE ?? 'EndoTech NZ Docs',
  email: import.meta.env.PUBLIC_CONTACT_EMAIL ?? 'Steveshepherdnz@gmail.com',
  shopifyAccountUrl: import.meta.env.PUBLIC_SHOPIFY_ACCOUNT_URL ?? 'https://shopify.com/67488153666/account',
  regionLabel: import.meta.env.PUBLIC_REGION_LABEL ?? 'New Zealand',
  homepageTitle: import.meta.env.PUBLIC_HOMEPAGE_TITLE ?? 'EndoTech NZ | Rotary NiTi & Endodontic Files',
  defaultDescription: import.meta.env.PUBLIC_SITE_DESCRIPTION ?? defaultDescription,
  organizationDescription:
    import.meta.env.PUBLIC_ORGANIZATION_DESCRIPTION ??
    'New Zealand supplier of rotary NiTi endodontic files, glide path instruments, irrigation products, and bioceramic materials for clinically controlled workflows.',
};

export type SiteConfig = typeof siteConfig;
