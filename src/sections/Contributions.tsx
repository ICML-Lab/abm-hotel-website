import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useI18n } from '../i18n/I18nProvider';
import { PhotoImg } from '../components/PhotoImg';
import { HEX, PHOTO, SOURCES } from '../config';
import { LazyBackground } from '../components/LazyBackground';
import DotField from '../components/reactbits/DotField';

// Why: the three reasons side by side over the photograph, on one screen.
export function Why() {
  const { t } = useI18n();
  return (
    <section className="scene why-scene" aria-labelledby="why-title">
      <PhotoImg photo={PHOTO.cableHughes} className="why-photo" load="eager" />
      <div className="scene-shade" aria-hidden="true" />
      <div className="container why-stage">
        <h2 className="why-kicker" id="why-title">{t('why.title')}</h2>
        <ol className="why-list">
          {[1, 2, 3].map((n) => (
            <li key={n} className="why-item">
              <h3>{t(`why.p${n}t`)}</h3>
              <p>{t(`why.p${n}p`)}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

// Overview (anchor #overview): what the project is building, for readers who have never heard of an
// agent-based model. One plain definition, the model's causal chain (it plays once when it comes into
// view; without motion or scripts it is simply there), then the three parts of the system and how far
// each has got.
const PARTS = [
  { key: 'part1', stage: 1 },
  { key: 'part2', stage: 4 },
  { key: 'part3', stage: 2 },
] as const;

export function Overview() {
  const { t, lang } = useI18n();
  const root = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const nodes = gsap.utils.toArray<HTMLElement>('.chain-node', el);
      const step = 0.35;
      const tl = gsap.timeline({ paused: true });
      tl.fromTo('.chain-line i', { scaleX: 0 }, { scaleX: 1, duration: step * (nodes.length - 1), ease: 'none' }, 0.15);
      nodes.forEach((n, i) => tl.fromTo(n, { autoAlpha: 0.15, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power2.out' }, i * step));
      const st = ScrollTrigger.create({ trigger: el.querySelector('.chain'), start: 'top 80%', once: true, onEnter: () => tl.play() });
      return () => { st.kill(); tl.kill(); };
    }, el);
    return () => mm.revert();
  }, [lang]);
  return (
    <section className="overview-scene" id="overview" ref={root} aria-labelledby="overview-title">
      <div className="container overview">
        <div className="overview-head">
          <h2 className="head-section" id="overview-title">{t('ov.title')}</h2>
          <p className="lead">{t('ov.lead')}</p>
        </div>
        <div className="chain is-compact" aria-label={t('ov.chain')}>
          <div className="chain-line" aria-hidden="true"><i /></div>
          <ol>
            {[1, 2, 3, 4, 5].map((n) => (
              <li key={n} className="chain-node">
                <span className="chain-dot mono">{n}</span>
                {n < 5 && <span className="chain-verb">{t(`approach.v${n}`)}</span>}
                <p className="chain-t">{t(`approach.n${n}`)}</p>
              </li>
            ))}
          </ol>
        </div>
        <ol className="parts">
          {PARTS.map((p, i) => (
            <li key={p.key}>
              <span className="parts-n mono">{String(i + 1).padStart(2, '0')}</span>
              <h3>{t(`${p.key}.t`)}</h3>
              <p>{t(`${p.key}.p`)}</p>
              <p className={`benefit-stage stage-${p.stage}`}>{t(`stage${p.stage}`)}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

// Each benefit names the problem, what the system does about it, and how far it has got:
// 1 runs in the prototype on assumed data, 2 is a model still in training, 3 waits for a pilot site,
// 4 is being collected now.
// A benefit backed by a published figure shows it as a highlight line with its sources.
type Benefit = { key: string; stage: 1 | 2 | 3 | 4; fact?: (keyof typeof SOURCES)[] };
const AUDIENCES = {
  hotel: [
    { key: 'h1', stage: 2, fact: ['spareCard', 'obcc'] },
    { key: 'h2', stage: 1 },
    { key: 'h3', stage: 1 },
    { key: 'h4', stage: 1 },
    { key: 'h5', stage: 2 },
  ],
  guest: [
    { key: 'g1', stage: 3 },
    { key: 'g2', stage: 3 },
    { key: 'g3', stage: 3 },
    { key: 'g4', stage: 3 },
  ],
} satisfies Record<string, Benefit[]>;
type Audience = keyof typeof AUDIENCES;

// Gains (anchor #contributions): the hotel's and the guests' benefits, one audience at a time.
// The headlines stay in a column on the left; the open one shows its detail on the right
// (below it on narrow screens). Without scripts both lists and every detail are simply there.
export function Gains() {
  const { t } = useI18n();
  const [who, setWho] = useState<Audience>('hotel');
  const [open, setOpen] = useState<Record<Audience, string>>({ hotel: 'h1', guest: 'g1' });
  return (
    <section className="gains-scene" id="contributions" aria-labelledby="gains-title">
      <div className="gains-body">
      <LazyBackground className="gains-bg">
        <DotField maxDevicePixelRatio={1} dotRadius={1.7} dotSpacing={22} gradientFrom={HEX.accent} gradientTo={HEX.leaf} glowColor={HEX.accent} holdToZoom={false} lightMode />
      </LazyBackground>
      <div className="container gains">
        <h2 className="head-section gains-title" id="gains-title">{t('gains.title')}</h2>
        <div className="gains-tabs" role="tablist" aria-label={t('gains.title')}>
          {(Object.keys(AUDIENCES) as Audience[]).map((a) => (
            <button key={a} type="button" role="tab" id={`tab-${a}`} aria-controls={`panel-${a}`} aria-selected={who === a}
              className="gains-tab" onClick={() => setWho(a)}>{t(`gains.for.${a}`)}</button>
          ))}
        </div>
        {(Object.keys(AUDIENCES) as Audience[]).map((a) => {
          const items: Benefit[] = AUDIENCES[a];
          return (
            <div key={a} id={`panel-${a}`} role="tabpanel" aria-labelledby={`tab-${a}`}
              className={`benefit-panel${who === a ? '' : ' is-off'}`}>
              <ol className="benefit-list" style={{ '--rows': items.length } as CSSProperties}>
                {items.map((b, i) => {
                  const on = open[a] === b.key;
                  const pick = () => setOpen((o) => ({ ...o, [a]: b.key }));
                  return (
                    <li key={b.key} className={`benefit${on ? ' is-open' : ''}`}>
                      <button type="button" className="benefit-head" aria-expanded={on} aria-controls={`b-${b.key}`}
                        onMouseEnter={pick} onFocus={pick} onClick={pick}>
                        <span className="benefit-n mono">{String(i + 1).padStart(2, '0')}</span>
                        <span className="benefit-t">{t(`${b.key}.t`)}</span>
                      </button>
                      <div className="benefit-body" id={`b-${b.key}`}>
                        <p className={`benefit-stage stage-${b.stage}`}>{t(`stage${b.stage}`)}</p>
                        <div className="benefit-cols">
                          <div><h3>{t('gains.why')}</h3><p>{t(`${b.key}.why`)}</p></div>
                          <div><h3>{t('gains.how')}</h3><p>{t(`${b.key}.how`)}</p></div>
                        </div>
                        {b.fact && (
                          <div className="benefit-fact">
                            <p className="benefit-fact-n">{t(`${b.key}.fact`)}</p>
                            <p>
                              {t(`${b.key}.factP`)}{' '}
                              <span className="benefit-src">
                                {t('gains.sources')}{' '}
                                {b.fact.map((s, j) => (
                                  <span key={s}>{j > 0 && ', '}<a href={SOURCES[s].url} target="_blank" rel="noopener">{SOURCES[s].label}</a></span>
                                ))}
                              </span>
                            </p>
                          </div>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
              {a === 'guest' && <p className="benefit-note">{t('gains.optin')}</p>}
            </div>
          );
        })}
        <p className="gains-status">
          <strong>{t('status.t')}</strong> {t('status.p')} <a href="#progress">{t('status.link')}</a>
        </p>
      </div>
      </div>
    </section>
  );
}
