import { useEffect, useState } from 'react';
import { useI18n } from '../i18n/I18nProvider';
import { GREENX_URL, ASSETS } from '../config';

function Strip() {
  const { t, lang } = useI18n();
  return (
    <div className="strip">
      <div className="container">
        <a href={GREENX_URL[lang]} target="_blank" rel="noopener">
          <img src={ASSETS.logo} alt={t('strip.logoAlt')} width={900} height={135} />
        </a>
        <span>{t('strip.text')}</span>
      </div>
    </div>
  );
}

// Fixed header that takes no room in the page: the GREEN-X strip on top, then a floating frosted nav.
// Once the visitor scrolls, the strip folds away and only the nav floats over the scenes.
export function SiteHeader() {
  const { t, lang, setLang } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return (
    <div className={`site-head${scrolled ? ' is-scrolled' : ''}`}>
      <Strip />
      <header className="nav">
        <div className="nav-bar">
          <a className="wordmark" href="#top" aria-label={t('nav.home')}>
            <i aria-hidden="true" />Virtual Hotel Monitoring
          </a>
          <nav className="nav-links" aria-label={t('nav.main')}>
            <a href="#contributions">{t('nav.contrib')}</a>
            <a href="#pilot">{t('nav.pilot')}</a>
            <a href="#progress">{t('nav.status')}</a>
            <a href="#team">{t('nav.team')}</a>
            <a href="#collaborate">{t('nav.collab')}</a>
          </nav>
          <div className="lang" role="group" aria-label={t('nav.lang')}>
            {(['en', 'vi'] as const).map((l) => (
              <button key={l} type="button" lang={l} aria-pressed={lang === l} onClick={() => setLang(l)}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <a className="btn btn-primary" href="#collaborate">{t('nav.cta')}</a>
        </div>
      </header>
    </div>
  );
}
