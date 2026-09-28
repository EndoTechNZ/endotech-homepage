const defaultDescription =
  'EndoTech NZ supplies Transform S™ rotary and reciprocating NiTi files, Micro-Path™ glide-path instruments, irrigation products, and bioceramic materials throughout New Zealand.';

export const siteConfig = {
  name: import.meta.env.PUBLIC_SITE_NAME ?? 'EndoTech NZ',
  shortName: import.meta.env.PUBLIC_SITE_SHORT_NAME ?? 'EndoTechNZ',
  docsTitle: import.meta.env.PUBLIC_DOCS_TITLE ?? 'EndoTech NZ Docs',
  email: import.meta.env.PUBLIC_CONTACT_EMAIL ?? 'Steveshepherdnz@gmail.com',
  regionLabel: import.meta.env.PUBLIC_REGION_LABEL ?? 'New Zealand',
  homepageTitle: import.meta.env.PUBLIC_HOMEPAGE_TITLE ?? 'EndoTech NZ | Rotary, Reciprocating & NiTi Files',
  defaultDescription: import.meta.env.PUBLIC_SITE_DESCRIPTION ?? defaultDescription,
  organizationDescription:
    import.meta.env.PUBLIC_ORGANIZATION_DESCRIPTION ??
    'New Zealand supplier of rotary and reciprocating NiTi endodontic files, glide-path instruments, irrigation products, and bioceramic materials for clinically controlled workflows.',
};

export type SiteConfig = typeof siteConfig;
