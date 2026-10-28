import { useRef } from 'react';
import gsap from 'gsap';
import { useI18n } from '../i18n/I18nProvider';
import ScrollStack, { ScrollStackItem } from '../components/reactbits/ScrollStack';
import ScrollReveal from '../components/reactbits/ScrollReveal';
import Topography from '../components/reactbits/Topography';
import { PhotoImg } from '../components/PhotoImg';
import { HEX, PHOTO, demoShot } from '../config';
import { useScene, stepSnap } from '../hooks/useScene';

// Why: three statements replace each other over a slow push into the resort photograph.
export function Why() {
  const { t, lang } = useI18n();
  const root = useRef<HTMLElement>(null);
  useScene(root, (el) => {
    const items = gsap.utils.toArray<HTMLElement>('.why-item', el);
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top top', end: `+=${items.length * 90}%`, pin: true, scrub: 0.5, snap: stepSnap(items.length - 1) } });
    tl.fromTo('.why-photo img', { scale: 1.02 }, { scale: 1.2, ease: 'none', duration: items.length - 1 }, 0);
    items.forEach((it, i) => {
      if (i === 0) gsap.set(it, { autoAlpha: 1, y: 0 }); else gsap.set(it, { autoAlpha: 0, y: 70 });
      if (i > 0) {
        tl.to(items[i - 1], { autoAlpha: 0, y: -70, duration: 0.3 }, i - 0.6)
          .to(it, { autoAlpha: 1, y: 0, duration: 0.35 }, i - 0.3)
          .to(`.why-dots i:nth-child(${i + 1})`, { scaleX: 1, duration: 0.3 }, i - 0.35);
      }
    });
  }, [lang]);
  return (
    <section className="scene why-scene" ref={root} aria-labelledby="why-title">
      <PhotoImg photo={PHOTO.cableHughes} className="why-photo" />
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
        <div className="why-dots" aria-hidden="true"><i /><i /><i /></div>
      </div>
    </section>
  );
}

// Approach: the agent chain lights up link by link.
export function Approach() {
  const { t, lang } = useI18n();
  const root = useRef<HTMLElement>(null);
  useScene(root, (el) => {
    const nodes = gsap.utils.toArray<HTMLElement>('.chain-node', el);
    gsap.set(nodes, { autoAlpha: 0.18, y: 30 });
    gsap.set('.chain-line i', { scaleX: 0 });
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top top', end: `+=${nodes.length * 55}%`, pin: true, scrub: 0.5, snap: stepSnap(nodes.length - 1) } });
    nodes.forEach((n, i) => {
      tl.to(n, { autoAlpha: 1, y: 0, duration: 0.5 }, i === 0 ? 0 : i - 0.5);
      if (i > 0) tl.to('.chain-line i', { scaleX: i / (nodes.length - 1), duration: 0.5, ease: 'none' }, i - 0.5);
    });
  }, [lang]);
  return (
    <section className="scene approach-scene" ref={root} aria-labelledby="approach-title">
      <div className="approach-topo" aria-hidden="true">
        <Topography color={HEX.accent} lineCount={30} lineWidth={1} elevation={1.2} speed={0.1} opacity={0.6} />
      </div>
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
                <h3>{t(`approach.n${n}`)}</h3>
                <p>{t(`approach.n${n}p`)}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

const LEVER_SHOT = ['rooms', 'energy', 'map', 'compare'] as const;

// Levers: four full-height cards stack as the page scrolls (React Bits ScrollStack).
export function Contributions() {
  const { t, list, lang } = useI18n();
  return (
    <section className="contrib-scene" id="contributions" aria-labelledby="contrib-title">
      <div className="container contrib-intro">
        <h2 className="head-display" id="contrib-title">{t('contrib.title')}</h2>
        <p className="lead">{t('contrib.lead')}</p>
      </div>
      <ScrollStack useWindowScroll itemDistance={120} itemStackDistance={28} stackPosition="14%" baseScale={0.9} itemScale={0.025} blurAmount={1.5} className="levers-stack">
        {[1, 2, 3, 4].map((n) => (
          <ScrollStackItem key={n} itemClassName={`lever-card${n === 1 ? ' lever-card--key' : ''}`}>
            <div className="lever-copy">
              <span className="lever-n mono">0{n}</span>
              <h3>{t(`lever${n}.t`)}</h3>
              <p>{t(`lever${n}.p`)}</p>
              <div className="lever-measure">
                <span>{t('lever.read')}</span>
                <ul>{list(`lever${n}.g`).map((g) => <li key={g}>{g}</li>)}</ul>
              </div>
            </div>
            <div className="lever-shot"><img src={demoShot(LEVER_SHOT[n - 1], lang)} alt="" loading="lazy" /></div>
          </ScrollStackItem>
        ))}
      </ScrollStack>
      <p className="container contrib-foot">{t('contrib.foot')}</p>
    </section>
  );
}

// Gains: one statement brightens word by word over a resort photograph, then the two audiences.
export function Gains() {
  const { t } = useI18n();
  return (
    <section className="gains-scene" aria-label={t('gains.aria')}>
      <div className="gains-hero">
        <PhotoImg photo={PHOTO.honnoi} className="gains-photo" />
        <div className="scene-shade" aria-hidden="true" />
        <div className="container gains-statement">
          <ScrollReveal baseOpacity={0.12} enableBlur baseRotation={2} blurStrength={6} textClassName="gains-reveal">
            {t('gains.statement')}
          </ScrollReveal>
        </div>
      </div>
      <div className="container gains">
        <div>
          <h3 className="gains-head">{t('out.title')}</h3>
          <dl className="outcomes">
            {[1, 2, 3, 4].map((n) => (
              <div key={n}><dt><span className="mono">0{n}</span>{t(`out${n}.t`)}</dt><dd>{t(`out${n}.p`)}</dd></div>
            ))}
          </dl>
        </div>
        <div>
          <h3 className="gains-head">{t('sci.title')}</h3>
          <ol className="science">{[1, 2, 3, 4].map((n) => <li key={n}>{t(`sci${n}`)}</li>)}</ol>
          <p className="science-out">{t('sci.out')}</p>
        </div>
      </div>
    </section>
  );
}
