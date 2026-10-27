import { useState } from 'react';
import { useI18n } from '../i18n/I18nProvider';
import { ASSETS, CONTACT_EMAIL, DEMO_URL, GREENX_KHANHHOA_URL, GREENX_URL, PHOTOS, demoPage } from '../config';

export function Research() {
  const { t } = useI18n();
  const [open, setOpen] = useState<number[]>([1]);
  const toggle = (n: number) => setOpen((o) => (o.includes(n) ? o.filter((x) => x !== n) : [...o, n]));
  return (
    <section className="section" id="research" aria-labelledby="rq-title" style={{ paddingTop: 0 }}>
      <div className="container rq-grid">
        <div>
          <h2 className="head-section" id="rq-title">{t('rq.title')}</h2>
          <p className="lead" style={{ marginTop: 'var(--space-md)' }}>{t('rq.lead')}</p>
        </div>
        <div className="rq-list">
          {[1, 2, 3, 4, 5].map((n) => {
            const isOpen = open.includes(n);
            return (
              <div key={n} className={`rq${isOpen ? ' is-open' : ''}`}>
                <button type="button" aria-expanded={isOpen} aria-controls={`rq${n}`} onClick={() => toggle(n)}>
                  <span className="rq-id mono">RQ{n}</span>
                  <span className="rq-q">{t(`rq${n}.q`)}</span>
                  <span className="rq-icon" aria-hidden="true" />
                </button>
                <div className="rq-body" id={`rq${n}`}><div><p>{t(`rq${n}.a`)}</p></div></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function Collaborate() {
  const { t } = useI18n();
  const mail = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(t('mail.subject'))}`;
  return (
    <section className="section collab" id="collaborate" aria-labelledby="collab-title">
      <div className="container">
        <h2 className="head-section" id="collab-title">{t('collab.title')}</h2>
        <p className="lead collab-lead">{t('collab.lead')}</p>
        <ol className="path">
          {[1, 2, 3, 4].map((n) => (
            <li key={n} className={n === 1 ? 'is-now' : undefined}>
              <span className="when">{t(`path${n}.w`)}</span>
              <h3>{t(`path${n}.t`)}</h3>
              <p>{t(`path${n}.p`)}</p>
            </li>
          ))}
        </ol>
        <div className="collab-foot">
          <figure className="greenx-quote">
            <img src={ASSETS.logo} alt={t('strip.logoAlt')} width={900} height={135} loading="lazy" />
            <blockquote>{t('quote')}</blockquote>
            <figcaption>{t('quote.cap')}</figcaption>
          </figure>
          <div>
            <ul className="privacy" aria-label={t('privacy')}>
              {['priv1', 'priv2', 'priv3'].map((k) => <li key={k}>{t(k)}</li>)}
            </ul>
            <a className="btn btn-light" href={mail}>{t('collab.cta')}</a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const { t, lang } = useI18n();
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div><a className="wordmark" href="#top"><i aria-hidden="true" />Virtual Hotel Monitoring</a></div>
          <div>
            <h4>{t('f.project')}</h4>
            <ul>
              <li><a href="#contributions">{t('nav.contrib')}</a></li>
              <li><a href="#research">{t('nav.research')}</a></li>
              <li><a href="#collaborate">{t('nav.collab')}</a></li>
            </ul>
          </div>
          <div>
            <h4>{t('f.sim')}</h4>
            <ul>
              <li><a href={DEMO_URL} target="_blank" rel="noopener">{t('tab.map')}</a></li>
              <li><a href={demoPage('energy')} target="_blank" rel="noopener">{t('tab.energy')}</a></li>
              <li><a href={demoPage('compare')} target="_blank" rel="noopener">{t('tab.compare')}</a></li>
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
        <div className="footer-credits">
          <span>{t('photos.credits')}:</span>
          {PHOTOS.map((p) => (
            <span key={p.src}>{t(p.caption)}, <a href={p.source} target="_blank" rel="noopener">{t(p.credit)}</a></span>
          ))}
        </div>
        <div className="footer-base">
          <span>{t('f.copy')}</span>
          <a href="#top">{t('f.top')}</a>
        </div>
      </div>
    </footer>
  );
}
