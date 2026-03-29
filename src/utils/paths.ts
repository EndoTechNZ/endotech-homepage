export function withBasePath(href: string) {
  if (!href || href.startsWith('#') || /^[a-z]+:/i.test(href)) {
    return href;
  }

  const base = import.meta.env.BASE_URL;
  const normalized = href.startsWith('/') ? href.slice(1) : href;
  return `${base}${normalized}`;
}
