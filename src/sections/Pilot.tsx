import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n/I18nProvider';
import DepthCarousel from '../components/reactbits/DepthCarousel';
import { ASSETS, DEMO_URL, PHOTOS, demoPage } from '../config';

const IslandModel = lazy(() => import('../components/IslandModel'));

function ModelSlot() {
  const { t } = useI18n();
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setNear(true); io.disconnect(); } }, { rootMargin: '600px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <figure>
      <div className="model-frame" ref={ref}>
        {near ? (
          <Suspense fallback={<span className="model-loading">{t('pilot.modelLoad')}</span>}>
            <IslandModel label={t('pilot.modelAlt')} />
          </Suspense>
        ) : (
          <span className="model-loading">{t('pilot.modelLoad')}</span>
        )}
      </div>
      <figcaption className="model-cap">{t('pilot.modelCap')}</figcaption>
    </figure>
  );
}

function useCardSize() {
  const calc = () => { const w = Math.min(720, Math.round(window.innerWidth * 0.78)); return { w, h: Math.round(w * 0.64) }; };
  const [size, setSize] = useState(calc);
  useEffect(() => {
    const on = () => setSize(calc());
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  return size;
}

function Photos() {
  const { t } = useI18n();
  const [i, setI] = useState(0);
  const card = useCardSize();
  const p = PHOTOS[i];
  return (
    <div className="photos">
      <div className="photos-head">
        <h3 className="demo-title">{t('photos.title')}</h3>
        <p className="lead">{t('photos.lead')}</p>
      </div>
      <div className="photos-stage" style={{ height: card.h + 64 }}>
      <DepthCarousel
        items={PHOTOS.map((ph) => ({ image: ph.src, alt: t(ph.caption) }))}
        cardWidth={card.w}
        cardHeight={card.h}
        radius={12}
        autoplay
        autoplayDelay={5200}
        loop
        showControls
        showIndicators
        onChange={(n) => setI(n)}
      />
      </div>
      <p className="photos-cap" aria-live="polite">
        <span>{t(p.caption)}</span>
        <small><a href={p.source} target="_blank" rel="noopener">{t(p.credit)}</a></small>
      </p>
    </div>
  );
}

function DemoEmbed() {
  const { t } = useI18n();
  const [state, setState] = useState<'idle' | 'loading' | 'ready'>('idle');
  const play = () => {
    if (window.matchMedia('(max-width: 40rem)').matches) { window.open(DEMO_URL, '_blank', 'noopener'); return; }
    setState('loading');
  };
  return (
    <>
      <div className={`demo-frame${state === 'loading' ? ' is-loading' : ''}${state === 'ready' ? ' is-ready' : ''}`}>
        <img className="poster" src={ASSETS.demoMap} alt={t('demo.posterAlt')} width={1600} height={1000} loading="lazy" />
        {state !== 'idle' && <iframe src={DEMO_URL} title={t('demo.iframe')} allow="fullscreen" onLoad={() => setState('ready')} />}
        <button className="play" type="button" aria-label={t('demo.playAria')} onClick={play}>
          <span className="play-dot"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 1.8v12.4L14 8z" fill="currentColor" /></svg></span>
          <span>{t('demo.play')}</span>
        </button>
      </div>
      <div className="demo-meta">
        <span>{t('demo.meta')}</span>
        <a href={DEMO_URL} target="_blank" rel="noopener">{t('demo.full')} <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M4 2h6v6M10 2 2 10" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg></a>
      </div>
    </>
  );
}

const TABS = [
  { id: 'energy', img: ASSETS.demoEnergy, w: 1440, h: 900 },
  { id: 'compare', img: ASSETS.demoCompare, w: 1440, h: 900 },
  { id: 'rooms', img: ASSETS.demoRooms, w: 1440, h: 900 },
] as const;

function Screens() {
  const { t } = useI18n();
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
            <a href={demoPage(tab.id)} target="_blank" rel="noopener">{t(`p.${tab.id}.a`)}</a>
          </div>
          <div className="panel-shot"><img src={tab.img} alt={t(`p.${tab.id}.alt`)} loading="lazy" width={tab.w} height={tab.h} /></div>
        </div>
      ))}
    </>
  );
}

export function Pilot() {
  const { t } = useI18n();
  return (
    <section className="section" id="pilot" aria-labelledby="pilot-title">
      <div className="container">
        <div className="island-grid">
          <div className="island-copy">
            <h2 className="head-section" id="pilot-title">{t('pilot.title')}</h2>
            <p>{t('pilot.p1')}</p>
            <p>{t('pilot.p2')}</p>
            <p className="pilot-next">{t('pilot.next')}</p>
          </div>
          <ModelSlot />
        </div>

        <Photos />

        <div className="demo" id="simulation">
          <div className="demo-head">
            <h3 className="demo-title">{t('demo.title')}</h3>
            <p className="lead">{t('demo.lead')}</p>
          </div>
          <DemoEmbed />
          <Screens />
        </div>
      </div>
    </section>
  );
}
