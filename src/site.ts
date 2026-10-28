// The site's own address: the only place to change when the final domain is chosen.
// Canonical links, hreflang, the sitemap, robots.txt, link previews and structured data all read it.
export const SITE_URL = 'https://abm-hotel-website.vercel.app';

// Each language has its own path so search engines can index both.
export const LANG_PATH = { en: '/', vi: '/vi/' } as const;
export const pageUrl = (lang: keyof typeof LANG_PATH) => new URL(LANG_PATH[lang], SITE_URL).href;
