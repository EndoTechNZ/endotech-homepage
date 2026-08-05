export interface NavItem {
  label: string;
  href: string;
}

export interface FooterSection {
  title: string;
  links: NavItem[];
}

export const getProductMenu = (base: string): NavItem[] => [
  { label: 'Product Overview', href: `${base}products/overview/` },
  { label: 'Transform S™ ET Files', href: `${base}products/transform-s-et/` },
  { label: 'Transform S™ PT Files', href: `${base}products/transform-s-pt/` },
  { label: 'Micro-Path Files', href: `${base}products/micro-path/` },
  { label: 'Transform S™ C+ Files', href: `${base}products/c-plus/` },
  { label: 'Transform S™ K-Files', href: `${base}products/k-files/` },
];

export const getTechnologyMenu = (base: string): NavItem[] => [
  { label: 'Technology Overview', href: `${base}technology/` },
  { label: 'Transform Technology', href: `${base}technology/transform-technology/` },
  { label: 'Avatar Tip', href: `${base}technology/avatar-tip/` },
];

export const getOrderMenu = (base: string): NavItem[] => [
  { label: 'Request a pro forma invoice', href: `${base}quote-request/` },
  { label: 'Request information', href: `${base}about/contact/` },
  { label: 'Account ordering', href: `${base}order/` },
];

export const getPrimaryNavItems = (base: string): NavItem[] => [
  { label: 'Home', href: base },
  { label: 'Products', href: `${base}products/overview/` },
  { label: 'Clinical Workflow', href: `${base}technique/workflow/` },
  { label: 'Technology', href: `${base}technology/` },
  { label: 'Blog', href: `${base}resources/ideas/` },
  { label: 'Order', href: `${base}order/` },
  { label: 'Education', href: `${base}resources/clinical-tips/` },
  { label: 'Evidence & Downloads', href: `${base}resources/downloads/` },
  { label: 'About', href: `${base}about/company/` },
];

export const getProductMobileNavItems = (base: string): NavItem[] => [
  { label: 'Home', href: base },
  { label: 'Product Overview', href: `${base}products/overview/` },
  { label: 'Transform S™ ET', href: `${base}products/transform-s-et/` },
  { label: 'Transform S™ PT', href: `${base}products/transform-s-pt/` },
  { label: 'Micro-Path', href: `${base}products/micro-path/` },
  { label: 'Transform S™ C+', href: `${base}products/c-plus/` },
  { label: 'Transform S™ K-Files', href: `${base}products/k-files/` },
  { label: 'Clinical Workflow', href: `${base}technique/workflow/` },
  { label: 'Technology Overview', href: `${base}technology/` },
  { label: 'Transform Technology', href: `${base}technology/transform-technology/` },
  { label: 'Avatar Tip', href: `${base}technology/avatar-tip/` },
  { label: 'Order', href: `${base}order/` },
  { label: 'Blog', href: `${base}resources/ideas/` },
  { label: 'Education', href: `${base}resources/clinical-tips/` },
  { label: 'Evidence & Downloads', href: `${base}resources/downloads/` },
  { label: 'About', href: `${base}about/company/` },
];

export const getHomepageMobileNavItems = (base: string): NavItem[] => [
  { label: 'Home', href: base },
  { label: 'Product Overview', href: `${base}products/overview/` },
  { label: 'Clinical Workflow', href: `${base}technique/workflow/` },
  { label: 'Technology Overview', href: `${base}technology/` },
  { label: 'Transform Technology', href: `${base}technology/transform-technology/` },
  { label: 'Avatar Tip', href: `${base}technology/avatar-tip/` },
  { label: 'Order', href: `${base}order/` },
  { label: 'Blog', href: `${base}resources/ideas/` },
  { label: 'Micro-Path', href: `${base}products/micro-path/` },
  { label: 'Transform S™ ET', href: `${base}products/transform-s-et/` },
  { label: 'Transform S™ PT', href: `${base}products/transform-s-pt/` },
  { label: 'Transform S™ C+', href: `${base}products/c-plus/` },
  { label: 'Transform S™ K-Files', href: `${base}products/k-files/` },
  { label: 'Education', href: `${base}resources/clinical-tips/` },
  { label: 'Evidence & Downloads', href: `${base}resources/downloads/` },
  { label: 'About', href: `${base}about/company/` },
  { label: 'Contact', href: `${base}about/contact/` },
];

export const getFooterSections = (base: string): FooterSection[] => [
  {
    title: 'Products',
    links: [
      { label: 'Product Overview', href: `${base}products/overview/` },
      { label: 'Transform S™ ET', href: `${base}products/transform-s-et/` },
      { label: 'Transform S™ PT', href: `${base}products/transform-s-pt/` },
      { label: 'Micro-Path', href: `${base}products/micro-path/` },
      { label: 'Transform S™ C+', href: `${base}products/c-plus/` },
      { label: 'Transform S™ K-Files', href: `${base}products/k-files/` },
    ],
  },
  {
    title: 'Clinical',
    links: [
      { label: 'Clinical Workflow', href: `${base}technique/workflow/` },
      { label: 'Technology', href: `${base}technology/` },
      { label: 'Blog', href: `${base}resources/ideas/` },
      { label: 'Education', href: `${base}resources/clinical-tips/` },
      { label: 'Evidence & Downloads', href: `${base}resources/downloads/` },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: `${base}about/company/` },
      { label: 'Contact', href: `${base}about/contact/` },
      { label: 'Order', href: `${base}order/` },
    ],
  },
];

export const getFooterUtilityLinks = (base: string): NavItem[] => [
  { label: 'Contact', href: `${base}about/contact/` },
  { label: 'Blog', href: `${base}resources/ideas/` },
  { label: 'Evidence & Downloads', href: `${base}resources/downloads/` },
];
