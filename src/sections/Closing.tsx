import { PhotoImg } from '../components/PhotoImg';
import { useI18n } from '../i18n/I18nProvider';
import { ASSETS, PHOTO, CONTACT_EMAIL, GREENX_KHANHHOA_URL, GREENX_URL, demoHome, demoPage } from '../config';

// Progress: the four stages of the project on one line, with the current one marked, and a plain
// statement that it is not ready for wide use yet. The research questions sit folded underneath.
const NOW = 2; // collecting data and training the models

export function Progress() {
  const { t } = useI18n();
  return (
    <section className="progress-scene on-photo" id="progress" aria-labelledby="progress-title">
      <PhotoImg photo={PHOTO.hondo} className="section-photo" />
      <div className="scene-shade" aria-hidden="true" />
      <div className="container">
        <div className="progress-head">
          <h2 className="head-section" id="progress-title">{t('progress.title')}</h2>
          <p className="lead">{t('progress.lead')}</p>
        </div>
        <ol className="timeline">
          {[1, 2, 3, 4].map((n) => (
            <li key={n} className={n === NOW ? 'is-now' : n < NOW ? 'is-done' : undefined} aria-current={n === NOW ? 'step' : undefined}>
              <span className="timeline-dot" aria-hidden="true" />
              <span className="when">{t(`path${n}.w`)}</span>
              <h3>{t(`path${n}.t`)}</h3>
              <p>{t(`path${n}.p`)}</p>
            </li>
          ))}
        </ol>
        <details className="rq-more">
          <summary>{t('rq.more')}</summary>
          <ol>{[1, 2, 3, 4, 5].map((n) => <li key={n}>{t(`rq${n}.q`)}</li>)}</ol>
        </details>
      </div>
    </section>
  );
}

// Footer: the GREEN-X band (its own message and the contact action), then the site's links.
// It carries the #collaborate anchor that the nav and the hero's contact button point to.
export function Footer() {
  const { t, lang } = useI18n();
  const mail = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(t('mail.subject'))}`;
  return (
    <footer className="footer" id="collaborate">
      <div className="footer-band">
        <div className="container footer-band-grid">
          <figure className="greenx-quote">
            <img src={ASSETS.logo} alt={t('strip.logoAlt')} width={900} height={135} loading="lazy" />
            <blockquote>{t('quote')}</blockquote>
            <figcaption>{t('quote.cap')}</figcaption>
          </figure>
          <div className="footer-cta">
            <p>{t('collab.lead')}</p>
            <a className="btn btn-light" href={mail}>{t('collab.cta')}</a>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="footer-grid">
          <div><a className="wordmark" href="#top"><i aria-hidden="true" />Virtual Hotel Monitoring</a></div>
          <div>
            <h4>{t('f.project')}</h4>
            <ul>
              <li><a href="#contributions">{t('nav.contrib')}</a></li>
              <li><a href="#progress">{t('nav.status')}</a></li>
              <li><a href="#team">{t('nav.team')}</a></li>
              <li><a href="#collaborate">{t('nav.collab')}</a></li>
            </ul>
          </div>
          <div>
            <h4>{t('f.sim')}</h4>
            <ul>
              <li><a href={demoHome(lang)} target="_blank" rel="noopener">{t('tab.map')}</a></li>
              <li><a href={demoPage('energy', lang)} target="_blank" rel="noopener">{t('tab.energy')}</a></li>
              <li><a href={demoPage('compare', lang)} target="_blank" rel="noopener">{t('tab.compare')}</a></li>
            </ul>
          </div>
          <div>
            <h4>{t('f.greenx')}</h4>
            <ul>
              <li><a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></li>
              <li><a href={GREENX_URL[lang]} target="_blank" rel="noopener">{t('f.greenxHome')}</a></li>
              <li><a href={GREENX_KHANHHOA_URL} target="_blank" rel="noopener">{t('f.khanhhoa')}</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-base">
          <span>{t('f.copy')}</span>
          <span className="footer-links"><a href="#credits">{t('credits.link')}</a><a href="#top">{t('f.top')}</a></span>
        </div>
      </div>
    </footer>
  );
}
