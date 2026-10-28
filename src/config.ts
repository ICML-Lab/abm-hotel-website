// Single place for values that change: the demo domain will move (the site's own domain is in site.ts).
export const DEMO_URL = 'https://abm.icclab.site/';
// The demo reads ?lang=vi|en|ru, so every link follows the site's language.
export const demoHome = (lang: string) => `${DEMO_URL}?lang=${lang}`;
export const demoPage = (hash: string, lang: string) => new URL(`dashboard.html?s=baseline&lang=${lang}#${hash}`, DEMO_URL).href;

export const CONTACT_EMAIL = 'greenx@vinuni.edu.vn';
// The project's pitch deck (details live there, the site stays short). Empty until the link exists:
// the hero's Details button then scrolls to the contributions instead.
export const DECK_URL = '';
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
  night: photo('night', 'night-cloudshepherd.webp', 'photoAlt.night', 'cloud.shepherd', 'CC BY 2.0', commons('Nha_Trang,_Vietnam_at_night_(24267026625).jpg')),
  hondo: photo('hondo', 'hondo-dominicnelson.webp', 'photoAlt.hondo', 'Dominic Nelson', 'CC BY-SA 4.0', commons('Nha_Trang_-_fishing_boats_and_Hòn_Đỏ_island_Mar_2024.jpg')),
} satisfies Record<string, Photo>;

export const ALL_PHOTOS: Photo[] = Object.values(PHOTO);

export const ASSETS = {
  logo: asset('assets/greenx-logo-white.png'),
};
// Demo screenshots exist per language (captured with ?lang=en and ?lang=vi).
export const demoShot = (name: 'map', lang: string) => asset(`assets/demo-${name}-${lang === 'vi' ? 'vi' : 'en'}.webp`);

// Principal investigators: names and positions as on their VinUni profile pages (28/10/2026).
// Portraits come from those pages in their original colour, set on one template (square, same face
// size and eye line, one studio-grey backdrop) so the three read as a set; credited on #credits.
export type Person = { id: string; img: string; email?: string; profile: { en: string; vi: string } };
export const TEAM: Person[] = [
  { id: 'p1', img: asset('assets/team/thuc-anh.webp'), profile: { en: 'https://vinuni.edu.vn/people/phan-thi-thuc-anh/', vi: 'https://vinuni.edu.vn/vi/people/ts-phan-thi-thuc-anh/' } },
  { id: 'p2', img: asset('assets/team/qin.webp'), email: 'zengchang.q@vinuni.edu.vn', profile: { en: 'https://vinuni.edu.vn/people/zengchang-qin/', vi: 'https://vinuni.edu.vn/vi/people/zengchang-qin-2/' } },
  { id: 'p3', img: asset('assets/team/yin.webp'), email: 'chunyang.y@vinuni.edu.vn', profile: { en: 'https://vinuni.edu.vn/people/chun-yang-yin/', vi: 'https://vinuni.edu.vn/vi/people/chun-yang-yin-2/' } },
];
