import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { DICT, type Lang } from './dict';
import { LANG_PATH } from '../site';

type I18n = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
  list: (key: string) => string[];
  nf: (n: number) => string;
};

const Ctx = createContext<I18n | null>(null);
const STORE = 'abm-lang';

// Order: ?lang= (old links), then the path (/vi/), then the visitor's saved choice, then English.
// During the build-time prerender there is no window, so the page's own language is used.
const initialLang = (fallback: Lang): Lang => {
  if (typeof window === 'undefined') return fallback;
  const fromUrl = new URLSearchParams(window.location.search).get('lang');
  if (fromUrl === 'en' || fromUrl === 'vi') return fromUrl;
  if (window.location.pathname.startsWith(LANG_PATH.vi)) return 'vi';
  try {
    const saved = localStorage.getItem(STORE);
    if (saved === 'en' || saved === 'vi') return saved;
  } catch {
    /* storage unavailable: fall back to English */
  }
  return 'en';
};

export function I18nProvider({ children, initial = 'en' }: { children: ReactNode; initial?: Lang }) {
  const [lang, setLangState] = useState<Lang>(() => initialLang(initial));

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try { localStorage.setItem(STORE, l); } catch { /* ignore */ }
  }, []);

  const value = useMemo<I18n>(() => {
    const dict = DICT[lang];
    const raw = (key: string) => dict[key] ?? DICT.en[key] ?? key;
    const t = (key: string, vars?: Record<string, string | number>) => {
      let s = raw(key);
      if (Array.isArray(s)) s = s.join(', ');
      if (vars) for (const k in vars) s = s.replace(`{${k}}`, String(vars[k]));
      return s;
    };
    const list = (key: string) => { const v = raw(key); return Array.isArray(v) ? v : [v]; };
    const fmt = new Intl.NumberFormat(lang === 'vi' ? 'vi-VN' : 'en-US', { maximumFractionDigits: 0 });
    return { lang, setLang, t, list, nf: (n) => fmt.format(n) };
  }, [lang, setLang]);

  // Keep the address on the language's own path (/ or /vi/), keeping the hash.
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('lang');
      url.pathname = LANG_PATH[lang];
      if (url.href !== window.location.href) window.history.replaceState(null, '', url);
    } catch { /* ignore */ }
    document.documentElement.lang = lang;
    document.title = value.t('meta.title');
    document.querySelector('meta[name="description"]')?.setAttribute('content', value.t('meta.desc'));
  }, [lang, value]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useI18n must be used inside I18nProvider');
  return v;
}
