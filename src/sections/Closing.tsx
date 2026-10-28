import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useScene, stepSnap, peekSteps } from '../hooks/useScene';
import { PhotoImg } from '../components/PhotoImg';
import { LazyBackground } from '../components/LazyBackground';
import Threads from '../components/reactbits/Threads';
import { useI18n } from '../i18n/I18nProvider';
import { ASSETS, HEX, CONTACT_EMAIL, GREENX_KHANHHOA_URL, GREENX_URL, PHOTO, demoHome, demoPage } from '../config';

export function Research() {
  const { t, lang } = useI18n();
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<number[]>([1]);
  const toggle = (n: number) => setOpen((o) => (o.includes(n) ? o.filter((x) => x !== n) : [...o, n]));
  // On wide screens each question takes the whole stage in turn.
  useScene(root, (el) => {
    const qs = gsap.utils.toArray<HTMLElement>('.rq', el);
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top top', end: `+=${qs.length * 55}%`, pin: true, scrub: 0.3, snap: stepSnap(qs.length - 1), invalidateOnRefresh: true } });
    peekSteps(tl, el.querySelector('.rq-list') as HTMLElement, qs, '.rq-body');
    qs.forEach((_, i) => { if (i) tl.to('.rq-progress i', { scaleY: (i + 1) / qs.length, duration: 0.45 }, i - 0.35); });
  }, [lang]);
  return (
    <section className="scene rq-scene" id="research" ref={root} aria-labelledby="rq-title">
      <LazyBackground className="rq-bg">
        <Threads maxDpr={1} color={HEX.leaf} accentColor={HEX.accent} lineCount={60} amplitude={1.2} speed={0.35} brightness={1} enableMouseInteraction />
      </LazyBackground>
      <div className="container rq-grid">
        <div className="rq-side">
          <h2 className="head-section" id="rq-title">{t('rq.title')}</h2>
          <p className="lead">{t('rq.lead')}</p>
          <div className="rq-progress" aria-hidden="true"><i /></div>
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
    <section className="scene collab" id="collaborate" aria-labelledby="collab-title">
      <PhotoImg photo={PHOTO.city} className="collab-photo" load="eager" />
      <div className="collab-shade" aria-hidden="true" />
      <div className="container collab-stage">
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
