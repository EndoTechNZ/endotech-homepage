export interface NavItem {
  label: string;
  href: string;
}

export const getProductMenu = (base: string): NavItem[] => [
  { label: 'Product Overview', href: `${base}products/overview/` },
  { label: 'ET TransformX Files', href: `${base}products/et-transformx/` },
  { label: 'PT TransformX Files', href: `${base}products/pt-transformx/` },
  { label: 'Acrobat Glide Path Files', href: `${base}products/acrobat-glide-path/` },
  { label: 'VortiFlow Irrigation Needle', href: `${base}products/vortiflow-irrigation-needle/` },
  { label: 'BCS BioCeramics Family', href: `${base}products/bcs/` },
];

export const getPrimaryNavItems = (base: string): NavItem[] => [
  { label: 'Home', href: base },
  { label: 'Products', href: `${base}products/overview/` },
  { label: 'Clinical Workflow', href: `${base}technique/workflow/` },
  { label: 'Technology', href: `${base}technology/transform-technology/` },
  { label: 'Order', href: `${base}order/` },
  { label: 'Education', href: `${base}resources/clinical-tips/` },
  { label: 'Evidence & Downloads', href: `${base}products/bcs/evidence/` },
  { label: 'About', href: `${base}about/company/` },
];

export const getProductMobileNavItems = (base: string): NavItem[] => [
  { label: 'Home', href: base },
  { label: 'Shape Overview', href: `${base}products/overview/` },
  { label: 'ET TransformX', href: `${base}products/et-transformx/` },
  { label: 'PT TransformX', href: `${base}products/pt-transformx/` },
  { label: 'Acrobat Glide Path', href: `${base}products/acrobat-glide-path/` },
  { label: 'VortiFlow', href: `${base}products/vortiflow-irrigation-needle/` },
  { label: 'BCS Family', href: `${base}products/bcs/` },
  { label: 'Clinical Workflow', href: `${base}technique/workflow/` },
  { label: 'Technology', href: `${base}technology/transform-technology/` },
  { label: 'Order', href: `${base}order/` },
  { label: 'Education', href: `${base}resources/clinical-tips/` },
  { label: 'Evidence & Downloads', href: `${base}products/bcs/evidence/` },
  { label: 'About', href: `${base}about/company/` },
];

export const getHomepageMobileNavItems = (base: string): NavItem[] => [
  { label: 'Home', href: base },
  { label: 'Product Overview', href: `${base}products/overview/` },
  { label: 'Clinical Workflow', href: `${base}technique/workflow/` },
  { label: 'Technology', href: `${base}technology/transform-technology/` },
  { label: 'Order', href: `${base}order/` },
  { label: 'Acrobat Glide Path', href: `${base}products/acrobat-glide-path/` },
  { label: 'ET TransformX', href: `${base}products/et-transformx/` },
  { label: 'PT TransformX', href: `${base}products/pt-transformx/` },
  { label: 'VortiFlow', href: `${base}products/vortiflow-irrigation-needle/` },
  { label: 'BCS Family', href: `${base}products/bcs/` },
  { label: 'Education', href: `${base}resources/clinical-tips/` },
  { label: 'Evidence & Downloads', href: `${base}products/bcs/evidence/` },
  { label: 'About', href: `${base}about/company/` },
  { label: 'Contact', href: `${base}about/contact/` },
];
