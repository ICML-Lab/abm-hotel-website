import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useI18n } from '../i18n/I18nProvider';
import ScrollReveal from '../components/reactbits/ScrollReveal';
import DotGrid from '../components/reactbits/DotGrid';
import Waves from '../components/reactbits/Waves';
import DotField from '../components/reactbits/DotField';
import { PhotoImg } from '../components/PhotoImg';
import { LazyBackground } from '../components/LazyBackground';
import { HEX, PHOTO, demoShot } from '../config';

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

// Approach: no pin. When the section comes into view the chain plays once, cause to effect:
// the line runs from the first step to the last and each step lights as the line reaches it.
// Without motion (or without scripts) the whole chain is simply there.
export function Approach() {
  const { t, lang } = useI18n();
  const root = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const nodes = gsap.utils.toArray<HTMLElement>('.chain-node', el);
      const step = 0.45;
      const tl = gsap.timeline({ paused: true });
      tl.fromTo('.chain-line i', { scaleX: 0 }, { scaleX: 1, duration: step * (nodes.length - 1), ease: 'none' }, 0.15);
      nodes.forEach((n, i) => tl.fromTo(n, { autoAlpha: 0.15, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' }, i * step));
      tl.fromTo('.chain-note', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '>-0.2');
      const st = ScrollTrigger.create({ trigger: el.querySelector('.chain'), start: 'top 75%', once: true, onEnter: () => tl.play() });
      return () => { st.kill(); tl.kill(); };
    }, el);
    return () => mm.revert();
  }, [lang]);
  return (
    <section className="scene approach-scene" ref={root} aria-labelledby="approach-title">
      <LazyBackground className="approach-bg">
        <DotGrid dpr={1} dotSize={4} gap={26} baseColor={HEX.leaf} activeColor={HEX.accent} proximity={160} clickShock={false} fade={0.35} />
      </LazyBackground>
      <div className="container approach-stage">
        <div className="approach-head">
          <h2 className="head-display" id="approach-title">{t('approach.title')}</h2>
          <p className="lead">{t('approach.lead')}</p>
        </div>
        <div className="chain">
          <div className="chain-line" aria-hidden="true"><i /></div>
          <ol>
            {[1, 2, 3, 4, 5].map((n) => (
              <li key={n} className="chain-node">
                <span className="chain-dot mono">{n}</span>
                {n < 5 && <span className="chain-verb">{t(`approach.v${n}`)}</span>}
                <h3>{t(`approach.n${n}`)}</h3>
                <p>{t(`approach.n${n}p`)}</p>
              </li>
            ))}
          </ol>
          <p className="chain-note">{t('approach.note')}</p>
        </div>
      </div>
    </section>
  );
}

const LEVER_SHOT = ['rooms', 'energy', 'map', 'compare'] as const;

// Levers: four cards in a two-by-two grid, each with its prototype screen and one line.
export function Contributions() {
  const { t, lang } = useI18n();
  return (
    <section className="contrib-scene" id="contributions" aria-labelledby="contrib-title">
      <LazyBackground className="contrib-bg">
        <Waves dpr={1} lineColor={HEX.leaf} accentColor={HEX.accent} spacing={14} amplitude={28} speed={0.5} clickRipple={false} fade={0.3} lightMode />
      </LazyBackground>
      <div className="container contrib-intro">
        <h2 className="head-display" id="contrib-title">{t('contrib.title')}</h2>
        <p className="lead">{t('contrib.lead')}</p>
      </div>
      <ol className="container levers-grid">
        {[1, 2, 3, 4].map((n) => (
          <li key={n} className="lever">
            <div className="lever-shot"><img src={demoShot(LEVER_SHOT[n - 1], lang)} alt={t(`lever${n}.alt`)} loading="lazy" /></div>
            <h3>{t(`lever${n}.t`)}</h3>
            <p>{t(`lever${n}.p`)}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

// Gains: one statement brightens word by word over a resort photograph, then what each audience gets.
export function Gains() {
  const { t } = useI18n();
  return (
    <section className="gains-scene" aria-labelledby="gains-title">
      <div className="gains-hero">
        <PhotoImg photo={PHOTO.honnoi} className="gains-photo" load="eager" />
        <div className="scene-shade" aria-hidden="true" />
        <div className="container gains-statement">
          <ScrollReveal baseOpacity={0.12} enableBlur baseRotation={2} blurStrength={6} textClassName="gains-reveal">
            {t('gains.statement')}
          </ScrollReveal>
        </div>
      </div>
      <div className="gains-body">
      <LazyBackground className="gains-bg">
        <DotField maxDevicePixelRatio={1} dotRadius={1.7} dotSpacing={22} gradientFrom={HEX.accent} gradientTo={HEX.leaf} glowColor={HEX.accent} holdToZoom={false} lightMode />
      </LazyBackground>
      <div className="container gains">
        <h2 className="head-section gains-title" id="gains-title">{t('gains.aria')}</h2>
        <section className="gains-ops" aria-labelledby="gains-ops-head">
          <h3 className="gains-sub" id="gains-ops-head">{t('out.title')}</h3>
          <ol className="gains-grid">
            {[1, 2, 3, 4].map((n) => (
              <li key={n}><h4>{t(`out${n}.t`)}</h4><p>{t(`out${n}.p`)}</p></li>
            ))}
          </ol>
        </section>
        <section className="gains-sci" aria-labelledby="gains-sci-head">
          <h3 className="gains-sub" id="gains-sci-head">{t('sci.title')}</h3>
          <ol className="gains-rows">{[1, 2, 3, 4].map((n) => <li key={n}>{t(`sci${n}`)}</li>)}</ol>
        </section>
      </div>
      </div>
    </section>
  );
}
