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
  { label: 'TransformX™ ET Files', href: `${base}products/et-transformx/` },
  { label: 'TransformX™ PT Files', href: `${base}products/pt-transformx/` },
  { label: 'Acrobat Glide Path Files', href: `${base}products/acrobat-glide-path/` },
  { label: 'VortiFlow Irrigation Needle', href: `${base}products/vortiflow-irrigation-needle/` },
  { label: 'BCS BioCeramics Family', href: `${base}products/bcs/` },
  { label: 'Laschal Instruments', href: `${base}products/laschal/` },
];

export const getTechnologyMenu = (base: string): NavItem[] => [
  { label: 'Transform Technology', href: `${base}technology/transform-technology/` },
  { label: 'Avatar Tip', href: `${base}technology/avatar-tip/` },
];

export const getOrderMenu = (base: string): NavItem[] => [
  { label: 'Request information', href: `${base}about/contact/` },
  { label: 'Order products', href: `${base}order/` },
];

export const getPrimaryNavItems = (base: string): NavItem[] => [
  { label: 'Home', href: base },
  { label: 'Products', href: `${base}products/overview/` },
  { label: 'Clinical Workflow', href: `${base}technique/workflow/` },
  { label: 'Technology', href: `${base}technology/transform-technology/` },
  { label: 'Blog', href: `${base}resources/ideas/` },
  { label: 'Order', href: `${base}order/` },
  { label: 'Education', href: `${base}resources/clinical-tips/` },
  { label: 'Evidence & Downloads', href: `${base}resources/downloads/` },
  { label: 'About', href: `${base}about/company/` },
];

export const getProductMobileNavItems = (
  base: string,
  accountUrl = 'https://shopify.com/67488153666/account',
): NavItem[] => [
  { label: 'Home', href: base },
  { label: 'Product Overview', href: `${base}products/overview/` },
  { label: 'TransformX™ ET', href: `${base}products/et-transformx/` },
  { label: 'TransformX™ PT', href: `${base}products/pt-transformx/` },
  { label: 'Acrobat Glide Path', href: `${base}products/acrobat-glide-path/` },
  { label: 'VortiFlow', href: `${base}products/vortiflow-irrigation-needle/` },
  { label: 'BCS Family', href: `${base}products/bcs/` },
  { label: 'Laschal Instruments', href: `${base}products/laschal/` },
  { label: 'Clinical Workflow', href: `${base}technique/workflow/` },
  { label: 'Transform Technology', href: `${base}technology/transform-technology/` },
  { label: 'Avatar Tip', href: `${base}technology/avatar-tip/` },
  { label: 'Order', href: `${base}order/` },
  { label: 'Account / Orders', href: accountUrl },
  { label: 'Blog', href: `${base}resources/ideas/` },
  { label: 'Education', href: `${base}resources/clinical-tips/` },
  { label: 'Evidence & Downloads', href: `${base}resources/downloads/` },
  { label: 'About', href: `${base}about/company/` },
];

export const getHomepageMobileNavItems = (
  base: string,
  accountUrl = 'https://shopify.com/67488153666/account',
): NavItem[] => [
  { label: 'Home', href: base },
  { label: 'Product Overview', href: `${base}products/overview/` },
  { label: 'Clinical Workflow', href: `${base}technique/workflow/` },
  { label: 'Transform Technology', href: `${base}technology/transform-technology/` },
  { label: 'Avatar Tip', href: `${base}technology/avatar-tip/` },
  { label: 'Order', href: `${base}order/` },
  { label: 'Account / Orders', href: accountUrl },
  { label: 'Blog', href: `${base}resources/ideas/` },
  { label: 'Acrobat Glide Path', href: `${base}products/acrobat-glide-path/` },
  { label: 'TransformX™ ET', href: `${base}products/et-transformx/` },
  { label: 'TransformX™ PT', href: `${base}products/pt-transformx/` },
  { label: 'VortiFlow', href: `${base}products/vortiflow-irrigation-needle/` },
  { label: 'BCS Family', href: `${base}products/bcs/` },
  { label: 'Laschal Instruments', href: `${base}products/laschal/` },
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
      { label: 'TransformX™ ET', href: `${base}products/et-transformx/` },
      { label: 'TransformX™ PT', href: `${base}products/pt-transformx/` },
      { label: 'Acrobat Glide Path', href: `${base}products/acrobat-glide-path/` },
      { label: 'VortiFlow', href: `${base}products/vortiflow-irrigation-needle/` },
      { label: 'BCS Family', href: `${base}products/bcs/` },
      { label: 'Laschal Instruments', href: `${base}products/laschal/` },
    ],
  },
  {
    title: 'Clinical',
    links: [
      { label: 'Clinical Workflow', href: `${base}technique/workflow/` },
      { label: 'Technology', href: `${base}technology/transform-technology/` },
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
