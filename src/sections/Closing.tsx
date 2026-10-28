import { useState } from 'react';
import { PhotoImg } from '../components/PhotoImg';
import { LazyBackground } from '../components/LazyBackground';
import Threads from '../components/reactbits/Threads';
import { useI18n } from '../i18n/I18nProvider';
import { ASSETS, HEX, CONTACT_EMAIL, GREENX_KHANHHOA_URL, GREENX_URL, PHOTO, demoHome, demoPage } from '../config';

// Research: all five questions at once. Hovering (or focusing, or tapping) one sets it large and
// shows what it asks in the left column; the others step back.
export function Research() {
  const { t } = useI18n();
  const [active, setActive] = useState<number | null>(null);
  return (
    <section className="scene rq-scene" id="research" aria-labelledby="rq-title">
      <LazyBackground className="rq-bg">
        <Threads maxDpr={1} color={HEX.leaf} accentColor={HEX.accent} lineCount={60} amplitude={1.2} speed={0.35} brightness={1} enableMouseInteraction />
      </LazyBackground>
      <div className="container rq-grid">
        <div className="rq-side">
          <h2 className="head-section" id="rq-title">{t('rq.title')}</h2>
          <p className="lead rq-detail" aria-live="polite">{active ? t(`rq${active}.a`) : t('rq.lead')}</p>
          <p className="rq-hint">{t('rq.hint')}</p>
        </div>
        <ol className={`rq-list${active ? ' has-active' : ''}`} onMouseLeave={() => setActive(null)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <li key={n}>
              <button type="button" className={`rq-item${active === n ? ' is-active' : ''}`} aria-pressed={active === n}
                onMouseEnter={() => setActive(n)} onFocus={() => setActive(n)} onClick={() => setActive(n)}>
                <span className="rq-id">RQ{n}</span>
                <span className="rq-q">{t(`rq${n}.q`)}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

// Progress: the four stages of the project on one line, with the current one marked.
export function Progress() {
  const { t } = useI18n();
  return (
    <section className="progress-scene" id="progress" aria-labelledby="progress-title">
      <div className="container">
        <h2 className="head-section" id="progress-title">{t('progress.title')}</h2>
        <ol className="timeline">
          {[1, 2, 3, 4].map((n) => (
            <li key={n} className={n === 1 ? 'is-now' : undefined} aria-current={n === 1 ? 'step' : undefined}>
              <span className="timeline-dot" aria-hidden="true" />
              <span className="when">{t(`path${n}.w`)}</span>
              <h3>{t(`path${n}.t`)}</h3>
              <p>{t(`path${n}.p`)}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Collaborate() {
  const { t } = useI18n();
  const mail = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(t('mail.subject'))}`;
  return (
    <section className="scene collab" id="collaborate" aria-labelledby="collab-title">
      <PhotoImg photo={PHOTO.city} className="collab-photo" load="eager" />
      <div className="collab-shade" aria-hidden="true" />
      <div className="container collab-stage">
        <h2 className="head-section" id="collab-title">{t('collab.title')}</h2>
        <p className="lead collab-lead">{t('collab.lead')}</p>
        <div className="collab-foot">
          <figure className="greenx-quote">
            <img src={ASSETS.logo} alt={t('strip.logoAlt')} width={900} height={135} loading="lazy" />
            <blockquote>{t('quote')}</blockquote>
            <figcaption>{t('quote.cap')}</figcaption>
          </figure>
          <div className="collab-cta">
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
