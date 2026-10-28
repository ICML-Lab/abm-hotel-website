// Single place for values that change: the demo domain will move (the site's own domain is in site.ts).
export const DEMO_URL = 'https://abm.icclab.site/';
// The demo reads ?lang=vi|en|ru, so every link follows the site's language.
export const demoHome = (lang: string) => `${DEMO_URL}?lang=${lang}`;
export const demoPage = (hash: string, lang: string) => new URL(`dashboard.html?s=baseline&lang=${lang}#${hash}`, DEMO_URL).href;

export const CONTACT_EMAIL = 'greenx@vinuni.edu.vn';
export const GREENX_URL = { en: 'https://greenx.vinuni.edu.vn/', vi: 'https://greenx.vinuni.edu.vn/vi/trang-chu/' } as const;
export const GREENX_KHANHHOA_URL = 'https://greenx.vinuni.edu.vn/innovation/khanh-hoa/';

// WebGL components (React Bits, three.js) need hex colours: these mirror src/styles/tokens.css.
export const HEX = {
  ink: '#0f1f19', // --color-ink
  accent: '#007a46', // --color-accent
  greenx: '#134d8b', // --color-greenx
  paper: '#f4f6f0', // --color-paper
  sea: '#3f86b0', // --color-sea
  leaf: '#4fa37a', // lighter accent, for background effects on paper
  mist: '#a9d3bb', // pale accent, for background effects on paper
} as const;

const asset = (p: string) => `${import.meta.env.BASE_URL}${p}`;
export const MODEL_URL = asset('models/hontre.glb');

// Photographs (Wikimedia Commons). Every photo shows a short credit label and is listed on the credits page.
export type Photo = { id: string; src: string; alt: string; author: string; license: string; source: string };
const commons = (file: string) => `https://commons.wikimedia.org/wiki/File:${file}`;
const photo = (id: string, file: string, alt: string, author: string, license: string, source: string): Photo => ({ id, src: asset(`assets/photos/${file}`), alt, author, license, source });

export const PHOTO = {
  cable2: photo('cable2', 'cable-christophe95-2.webp', 'photoAlt.cable2', 'Christophe95', 'CC BY-SA 4.0', commons('Vinpearl_Cable_Car_2.jpg')),
  cableHughes: photo('cableHughes', 'cablecar-hughes.webp', 'photo2', 'P. Hughes', 'CC BY 4.0', commons('Nha_Trang_-_Vinpearl_Cable_Car.jpg')),
  honnoi: photo('honnoi', 'honnoi-minhducly.webp', 'photoAlt.honnoi', 'Minh Duc Ly', 'Public domain', commons('Hòn_Nội,_Nha_Trang_Bay,_Vietnam.jpg')),
  city: photo('city', 'city-leonid.webp', 'photoAlt.city', 'Leonid', 'CC BY-SA 2.0', commons('Nha_Trang,_Vietnam_-_53119835087.jpg')),
} satisfies Record<string, Photo>;

export const ALL_PHOTOS: Photo[] = Object.values(PHOTO);

export const ASSETS = {
  logo: asset('assets/greenx-logo-white.png'),
};
// Demo screenshots exist per language (captured with ?lang=en and ?lang=vi).
export const demoShot = (name: 'map' | 'energy' | 'compare' | 'rooms', lang: string) => asset(`assets/demo-${name}-${lang === 'vi' ? 'vi' : 'en'}.webp`);
