const defaultDescription =
  'EndoTech Singapore offers TransformX rotary endodontic files, Acrobat glide path instruments, and bioceramic materials for clinically controlled shaping and sealing workflows.';

export const siteConfig = {
  name: import.meta.env.PUBLIC_SITE_NAME ?? 'EndoTech Singapore',
  shortName: import.meta.env.PUBLIC_SITE_SHORT_NAME ?? 'EndoTech',
  docsTitle: import.meta.env.PUBLIC_DOCS_TITLE ?? 'EndoTech Docs',
  email: import.meta.env.PUBLIC_CONTACT_EMAIL ?? 'Steveshepherdnz@gmail.com',
  regionLabel: import.meta.env.PUBLIC_REGION_LABEL ?? 'Singapore',
  homepageTitle: import.meta.env.PUBLIC_HOMEPAGE_TITLE ?? 'EndoTech Singapore | TransformX™ Rotary Endodontic Files',
  defaultDescription: import.meta.env.PUBLIC_SITE_DESCRIPTION ?? defaultDescription,
  organizationDescription:
    import.meta.env.PUBLIC_ORGANIZATION_DESCRIPTION ??
    'Clinical endodontic systems and bioceramic materials presented with a workflow-first, evidence-aware approach.',
};

export type SiteConfig = typeof siteConfig;
