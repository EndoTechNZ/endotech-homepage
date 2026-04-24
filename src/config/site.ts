const defaultDescription =
  'EndoTech NZ offers TransformX rotary endodontic files, Acrobat glide path instruments, and bioceramic materials for clinically controlled shaping and sealing workflows.';

export const siteConfig = {
  name: import.meta.env.PUBLIC_SITE_NAME ?? 'EndoTech NZ',
  shortName: import.meta.env.PUBLIC_SITE_SHORT_NAME ?? 'EndoTechNZ',
  docsTitle: import.meta.env.PUBLIC_DOCS_TITLE ?? 'EndoTech NZ Docs',
  email: import.meta.env.PUBLIC_CONTACT_EMAIL ?? 'Steveshepherdnz@gmail.com',
  regionLabel: import.meta.env.PUBLIC_REGION_LABEL ?? 'New Zealand',
  homepageTitle: import.meta.env.PUBLIC_HOMEPAGE_TITLE ?? 'EndoTech NZ | TransformX Rotary Endodontic Files',
  defaultDescription: import.meta.env.PUBLIC_SITE_DESCRIPTION ?? defaultDescription,
  organizationDescription:
    import.meta.env.PUBLIC_ORGANIZATION_DESCRIPTION ??
    'Clinical endodontic systems and bioceramic materials presented for New Zealand clinicians with a workflow-first, evidence-aware approach.',
};

export type SiteConfig = typeof siteConfig;
