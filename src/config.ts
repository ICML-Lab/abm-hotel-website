// Single place for values that change: the demo domain will move.
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
} as const;

const asset = (p: string) => `${import.meta.env.BASE_URL}${p}`;
export const MODEL_URL = asset('models/hontre.glb');

export const PHOTOS = [
  { src: asset('assets/photos/cablecar-lewison.webp'), caption: 'photo1', credit: 'credit1', source: 'https://commons.wikimedia.org/wiki/File:Vinpearl_Cable_Car_to_Hon_Tre,_Nha_Trang,_Khanh_Hoa.jpg' },
  { src: asset('assets/photos/cablecar-hughes.webp'), caption: 'photo2', credit: 'credit2', source: 'https://commons.wikimedia.org/wiki/File:Nha_Trang_-_Vinpearl_Cable_Car.jpg' },
  { src: asset('assets/photos/bay-bvi4092.webp'), caption: 'photo3', credit: 'credit3', source: 'https://commons.wikimedia.org/wiki/File:Arriving_in_Nha_Trang_-_Vietnam.jpg' },
  { src: asset('assets/photos/bay-sentinel2.webp'), caption: 'photo4', credit: 'credit4', source: 'https://commons.wikimedia.org/wiki/File:Satellite_pictures_of_Nha_Trang_Bay_2022-03-18.png' },
] as const;

export const ASSETS = {
  logo: asset('assets/greenx-logo-white.png'),
};
// Demo screenshots exist per language (captured with ?lang=en and ?lang=vi).
export const demoShot = (name: 'map' | 'energy' | 'compare' | 'rooms', lang: string) => asset(`assets/demo-${name}-${lang === 'vi' ? 'vi' : 'en'}.webp`);
