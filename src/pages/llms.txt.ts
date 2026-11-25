import type { APIRoute } from 'astro';
import { business, areaGroups, serviceGroups } from '../config/site';
import { services, areas, areaUrl } from '../lib/data';

/** Plain-text map of main pages for AI crawlers (llms.txt convention). */
export const GET: APIRoute = ({ site }) => {
  const origin = (site?.origin ?? 'https://bondcleaningco.com').replace(/\/$/, '');
  const line = (path: string, label: string) => `- ${label}: ${origin}${path}`;

  const core = [
    '# Bond Cleaning Brisbane Co.',
    `# ${business.identity}`,
    `# Phone: ${business.phone}`,
    `# Email: ${business.email}`,
    `# Area: ${business.serviceArea}`,
    '',
    '## Primary pages',
    line('/', 'Bond cleaning in Brisbane (homepage)'),
    line('/services/', 'All bond cleaning services'),
    line('/areas/', 'Areas we clean (Northside & inner north)'),
    line('/pricing/', 'Get a free quote'),
    line('/end-of-lease-cleaning-brisbane/', 'End of lease cleaning Brisbane'),
    line('/carpet-steam-cleaning-brisbane/', 'Carpet steam cleaning Brisbane'),
    line('/bond-back-guarantee/', 'Bond Back Guarantee'),
    line('/bond-cleaning-checklist/', 'QLD bond cleaning checklist'),
    line('/faq/', 'Bond cleaning FAQs'),
    line('/our-work/', 'Before & after photos'),
    line('/reviews/', 'Reviews'),
    line('/about/', 'About us'),
    line('/contact/', 'Contact & quote'),
    line('/blog/', 'Tips & guides'),
    '',
    '## Service pages',
  ];

  for (const g of serviceGroups) {
    core.push(`### ${g.name}`);
    for (const s of services.filter((x) => x.group === g.key)) {
      core.push(line(s.url, s.name));
    }
    core.push('');
  }

  core.push('## Suburb pages');
  for (const g of areaGroups) {
    core.push(`### ${g.name}`);
    for (const slug of g.slugs) {
      const a = areas.find((x) => x.slug === slug);
      if (a) core.push(line(areaUrl(slug), `Bond cleaning ${a.name}`));
    }
    core.push('');
  }

  core.push('## Notes');
  core.push(`- Complimentary carpet steam cleaning with every bond clean.`);
  core.push(`- Bond Back Guarantee: ${business.bondBackGuarantee}`);
  core.push(`- Quotes are free and fixed in writing from property details (no published dollar prices).`);
  core.push(`- Sitemap: ${origin}/sitemap-index.xml`);
  core.push('');

  return new Response(core.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
