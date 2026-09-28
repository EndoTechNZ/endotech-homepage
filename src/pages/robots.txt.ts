import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const lines = [
    'User-agent: *',
    'Allow: /',
    '',
    'User-agent: OAI-SearchBot',
    'Allow: /',
  ];

  if (site) {
    lines.push(`Sitemap: ${new URL('/sitemap-index.xml', site).toString()}`);
  }

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
