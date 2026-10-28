import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n/I18nProvider';
import { HEX, demoHome, demoShot } from '../config';
import { LazyBackground } from '../components/LazyBackground';
import LineWaves from '../components/reactbits/LineWaves';

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
        <a href={url} target="_blank" rel="noopener">{t('demo.full')} <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M4 2h6v6M10 2 2 10" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg></a>
      </div>
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


      <section className="section demo-scene" id="simulation" aria-labelledby="demo-title">
        <LazyBackground className="demo-bg">
          <LineWaves maxDevicePixelRatio={1} color1={HEX.leaf} color2={HEX.accent} color3={HEX.leaf} speed={0.2} lineCount={48} lineWidth={1.2} brightness={1.4} highlight={0.35} clickRipple={false} edgeFade={0.2} lightMode />
        </LazyBackground>
        <div className="container">
          <div className="demo-head">
            <h2 className="head-section" id="demo-title">{t('demo.title')}</h2>
            <p className="lead">{t('demo.lead')}</p>
          </div>
          <DemoEmbed />
        </div>
      </section>
    </>
  );
}
