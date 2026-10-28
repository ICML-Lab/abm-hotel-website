// Runs after `vite build` and the server build: writes the prerendered page for each language
// (dist/index.html, dist/vi/index.html) with its own head tags, then robots.txt and sitemap.xml.
// Every address comes from src/site.ts through the server bundle.
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = `${root}dist/`;
const ssr = await import(pathToFileURL(`${root}dist-ssr/entry-server.js`).href);
const { render, DICT, SITE_URL, LANG_PATH, pageUrl, CONTACT_EMAIL, GREENX_URL } = ssr;

const LANGS = ['en', 'vi'];
const LOCALE = { en: 'en_US', vi: 'vi_VN' };
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const abs = (p) => new URL(p, SITE_URL).href;
const template = await readFile(`${dist}index.html`, 'utf8');

function head(lang) {
  const t = (k) => DICT[lang][k] ?? DICT.en[k];
  const url = pageUrl(lang);
  const image = abs(`og/og-${lang}.jpg`);
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'ResearchProject',
    name: 'Virtual Hotel Monitoring',
    alternateName: 'Agent-Based Modeling for Tourism Hotel Management and Optimal Carbon Footprint Trajectories',
    description: t('meta.desc'),
    url,
    image,
    inLanguage: lang,
    email: CONTACT_EMAIL,
    keywords: t('meta.keywords'),
    parentOrganization: {
      '@type': 'ResearchOrganization',
      name: t('strip.logoAlt'),
      url: GREENX_URL[lang],
      parentOrganization: { '@type': 'CollegeOrUniversity', name: 'VinUniversity', url: 'https://vinuni.edu.vn/' },
    },
  };
  return [
    `<title>${esc(t('meta.title'))}</title>`,
    `<meta name="description" content="${esc(t('meta.desc'))}" />`,
    `<link rel="canonical" href="${url}" />`,
    ...LANGS.map((l) => `<link rel="alternate" hreflang="${l}" href="${pageUrl(l)}" />`),
    `<link rel="alternate" hreflang="x-default" href="${pageUrl('en')}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Virtual Hotel Monitoring" />`,
    `<meta property="og:title" content="${esc(t('meta.title'))}" />`,
    `<meta property="og:description" content="${esc(t('meta.desc'))}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:locale" content="${LOCALE[lang]}" />`,
    ...LANGS.filter((l) => l !== lang).map((l) => `<meta property="og:locale:alternate" content="${LOCALE[l]}" />`),
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${esc(t('meta.ogAlt'))}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(t('meta.title'))}" />`,
    `<meta name="twitter:description" content="${esc(t('meta.desc'))}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    `<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>`,
  ].join('\n    ');
}

for (const lang of LANGS) {
  const html = template
    .replace(/<html lang="[^"]*"/, `<html lang="${lang}"`)
    .replace(/<title>[\s\S]*?<\/title>\s*<meta name="description"[^>]*>/, head(lang))
    .replace('<div id="root"></div>', `<div id="root">${render(lang)}</div>`);
  if (!html.includes('og:image') || !html.includes('<div id="root"><')) throw new Error(`prerender: template markers not found for ${lang}`);
  const out = `${dist}${LANG_PATH[lang].replace(/^\//, '')}`;
  await mkdir(out, { recursive: true });
  await writeFile(`${out}index.html`, html);
}

await writeFile(`${dist}robots.txt`, `User-agent: *\nAllow: /\n\nSitemap: ${abs('sitemap.xml')}\n`);
const alt = LANGS.map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${pageUrl(l)}"/>`).join('\n');
await writeFile(`${dist}sitemap.xml`, `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${LANGS.map((l) => `  <url>\n    <loc>${pageUrl(l)}</loc>\n${alt}\n    <xhtml:link rel="alternate" hreflang="x-default" href="${pageUrl('en')}"/>\n  </url>`).join('\n')}
</urlset>
`);
await rm(`${root}dist-ssr`, { recursive: true, force: true });
console.log(`prerendered ${LANGS.map((l) => LANG_PATH[l]).join(', ')} for ${SITE_URL}`);
