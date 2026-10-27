import { useI18n } from '../i18n/I18nProvider';
import { GREENX_URL, ASSETS } from '../config';

export function Strip() {
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

export function Header() {
  const { t, lang, setLang } = useI18n();
  return (
    <header className="nav">
      <div className="container">
        <a className="wordmark" href="#top" aria-label={t('nav.home')}>
          <i aria-hidden="true" />Virtual Hotel Monitoring
        </a>
        <nav className="nav-links" aria-label={t('nav.main')}>
          <a href="#contributions">{t('nav.contrib')}</a>
          <a href="#pilot">{t('nav.pilot')}</a>
          <a href="#research">{t('nav.research')}</a>
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
  );
}
