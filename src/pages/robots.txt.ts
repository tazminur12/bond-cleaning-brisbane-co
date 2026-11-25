import type { APIRoute } from 'astro';

/**
 * Production: allow Google, Bing, and major AI/search crawlers; list sitemap + llms.txt.
 * Preview builds stay crawlable so noindex headers/meta can be verified; thank-you + styleguide stay disallowed.
 */
export const GET: APIRoute = ({ site }) => {
  const origin = site?.origin ?? 'https://bondcleaningco.com';
  const sitemap = `${origin}/sitemap-index.xml`;
  const llms = `${origin}/llms.txt`;
  const bots = [
    'Googlebot',
    'Google-Extended',
    'Bingbot',
    'GPTBot',
    'OAI-SearchBot',
    'ChatGPT-User',
    'ClaudeBot',
    'Claude-SearchBot',
    'PerplexityBot',
    'Applebot',
  ];

  const lines = [
    '# Bond Cleaning Brisbane Co. — crawl rules',
    'User-agent: *',
    'Allow: /',
    'Disallow: /thank-you/',
    'Disallow: /styleguide/',
    '',
    ...bots.flatMap((ua) => [`User-agent: ${ua}`, 'Allow: /', '']),
    `Sitemap: ${sitemap}`,
    `# AI/search summary of main pages: ${llms}`,
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
