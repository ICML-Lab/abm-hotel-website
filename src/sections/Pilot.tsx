import type React from 'react';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useI18n } from '../i18n/I18nProvider';
import { PhotoImg } from '../components/PhotoImg';
import { STRIP, demoHome, demoPage, demoShot } from '../config';
import { useScene } from '../hooks/useScene';

const IslandModel = lazy(() => import('../components/IslandModel'));

// The 3D island fills the screen; it loads once the visitor is near.
function ModelStage() {
  const { t } = useI18n();
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setNear(true); io.disconnect(); } }, { rootMargin: '800px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div className="model-stage" ref={ref}>
      {near ? (
        <Suspense fallback={<span className="model-loading">{t('pilot.modelLoad')}</span>}>
          <IslandModel label={t('pilot.modelAlt')} />
        </Suspense>
      ) : (
        <span className="model-loading">{t('pilot.modelLoad')}</span>
      )}
    </div>
  );
}

// Photographs of the pilot site travel sideways while the section is pinned.
function PhotoStrip() {
  const { t, lang } = useI18n();
  const root = useRef<HTMLElement>(null);
  useScene(root, (el) => {
    const track = el.querySelector<HTMLElement>('.strip-track')!;
    const dist = () => track.scrollWidth - window.innerWidth + 64;
    gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: el, start: 'top top', end: () => `+=${dist()}`, pin: true, scrub: 0.6, invalidateOnRefresh: true } });
    gsap.utils.toArray<HTMLElement>('.strip-item img', el).forEach((img) => {
      gsap.fromTo(img, { scale: 1.18 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top top', end: () => `+=${dist()}`, scrub: true } });
    });
  }, [lang]);
  return (
    <section className="scene strip-scene" ref={root} aria-labelledby="strip-title">
      <div className="container strip-head">
        <h3 className="head-section" id="strip-title">{t('pilot.photosTitle')}</h3>
      </div>
      <div className="strip-track">
        {STRIP.map((p, i) => (
          <div key={p.id} className={`strip-item strip-item--${i % 3}`}>
            <PhotoImg photo={p} />
            <p className="strip-cap">{t(p.alt)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function DemoEmbed() {
  const { t, lang } = useI18n();
  const url = demoHome(lang);
  const [state, setState] = useState<'idle' | 'loading' | 'ready'>('idle');
  const play = () => {
    if (window.matchMedia('(max-width: 40rem)').matches) { window.open(url, '_blank', 'noopener'); return; }
    setState('loading');
  };
  return (
    <>
      <div className={`demo-frame${state === 'loading' ? ' is-loading' : ''}${state === 'ready' ? ' is-ready' : ''}`}>
        <img className="poster" src={demoShot('map', lang)} alt={t('demo.posterAlt')} width={1600} height={1000} loading="lazy" />
        {state !== 'idle' && <iframe src={url} title={t('demo.iframe')} allow="fullscreen" onLoad={() => setState('ready')} />}
        <button className="play" type="button" aria-label={t('demo.playAria')} onClick={play}>
          <span className="play-dot"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 1.8v12.4L14 8z" fill="currentColor" /></svg></span>
          <span>{t('demo.play')}</span>
        </button>
      </div>
      <div className="demo-meta">
        <span>{t('demo.meta')}</span>
        <a href={url} target="_blank" rel="noopener">{t('demo.full')} <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M4 2h6v6M10 2 2 10" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg></a>
      </div>
    </>
  );
}

const TABS = [
  { id: 'energy', w: 1440, h: 900 },
  { id: 'compare', w: 1440, h: 900 },
  { id: 'rooms', w: 1440, h: 900 },
] as const;

function Screens() {
  const { t, lang } = useI18n();
  const [sel, setSel] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKey = (e: React.KeyboardEvent, i: number) => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!d) return;
    const n = (i + d + TABS.length) % TABS.length;
    setSel(n); refs.current[n]?.focus();
  };
  return (
    <>
      <div className="tabs" role="tablist" aria-label={t('demo.tabs')}>
        {TABS.map((tab, i) => (
          <button key={tab.id} ref={(el) => { refs.current[i] = el; }} className="tab" role="tab" id={`t-${tab.id}`} aria-controls={`p-${tab.id}`} aria-selected={sel === i} tabIndex={sel === i ? 0 : -1} onClick={() => setSel(i)} onKeyDown={(e) => onKey(e, i)}>
            {t(tab.id === 'energy' ? 'tab.energy' : tab.id === 'compare' ? 'tab.compare' : 'tab.rooms')}
          </button>
        ))}
      </div>
      {TABS.map((tab, i) => (
        <div key={tab.id} className={`panel${sel === i ? ' is-in' : ''}`} role="tabpanel" id={`p-${tab.id}`} aria-labelledby={`t-${tab.id}`} hidden={sel !== i}>
          <div className="panel-copy">
            <div><h3>{t(`p.${tab.id}.t`)}</h3><p>{t(`p.${tab.id}.p`)}</p></div>
            <a href={demoPage(tab.id, lang)} target="_blank" rel="noopener">{t(`p.${tab.id}.a`)}</a>
          </div>
          <div className="panel-shot"><img src={demoShot(tab.id, lang)} alt={t(`p.${tab.id}.alt`)} loading="lazy" width={tab.w} height={tab.h} /></div>
        </div>
      ))}
    </>
  );
}

export function Pilot() {
  const { t } = useI18n();
  return (
    <>
      <section className="scene pilot-scene" id="pilot" aria-labelledby="pilot-title">
        <ModelStage />
        <div className="container pilot-overlay">
          <div className="pilot-card">
            <h2 className="head-section" id="pilot-title">{t('pilot.title')}</h2>
            <p>{t('pilot.p1')}</p>
            <p>{t('pilot.p2')}</p>
            <p className="pilot-next">{t('pilot.next')}</p>
          </div>
          <p className="model-cap">{t('pilot.modelCap')}</p>
        </div>
      </section>

      <PhotoStrip />

      <section className="section demo-scene" id="simulation" aria-labelledby="demo-title">
        <div className="container">
          <div className="demo-head">
            <h2 className="head-section" id="demo-title">{t('demo.title')}</h2>
            <p className="lead">{t('demo.lead')}</p>
          </div>
          <DemoEmbed />
          <Screens />
        </div>
      </section>
    </>
  );
}
