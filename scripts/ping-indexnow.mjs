/**
 * Ping Bing IndexNow after a production deploy.
 * Usage: SITE_URL=https://bondcleaningco.com node scripts/ping-indexnow.mjs [url1 url2 ...]
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const origin = (process.env.SITE_URL || 'https://bondcleaningco.com').replace(/\/$/, '');
const key = 'bcbc-indexnow-7f3a9c2e';
const defaults = [
  `${origin}/`,
  `${origin}/end-of-lease-cleaning-brisbane/`,
  `${origin}/carpet-steam-cleaning-brisbane/`,
  `${origin}/pricing/`,
  `${origin}/services/`,
  `${origin}/areas/`,
  `${origin}/faq/`,
  `${origin}/bond-back-guarantee/`,
];
const urlList = process.argv.slice(2).length ? process.argv.slice(2) : defaults;

const body = {
  host: new URL(origin).host,
  key,
  keyLocation: `${origin}/${key}.txt`,
  urlList,
};

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify(body),
});

console.log(`IndexNow ${res.status} ${res.statusText}`);
if (!res.ok) {
  console.error(await res.text());
  process.exit(1);
}

// Touch key file presence check for local sanity (optional)
try {
  readFileSync(resolve('public', `${key}.txt`), 'utf8');
} catch {
  /* key ships in public/ and dist after build */
}
