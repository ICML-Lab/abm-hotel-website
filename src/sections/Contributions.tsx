import { useRef } from 'react';
import gsap from 'gsap';
import { useI18n } from '../i18n/I18nProvider';
import ScrollStack, { ScrollStackItem } from '../components/reactbits/ScrollStack';
import ScrollReveal from '../components/reactbits/ScrollReveal';
import DotGrid from '../components/reactbits/DotGrid';
import Waves from '../components/reactbits/Waves';
import DotField from '../components/reactbits/DotField';
import { PhotoImg } from '../components/PhotoImg';
import { LazyBackground } from '../components/LazyBackground';
import { HEX, PHOTO, demoShot } from '../config';
import { useScene, stepSnap, peekSteps } from '../hooks/useScene';

// Why: three statements replace each other over a slow push into the resort photograph.
export function Why() {
  const { t, lang } = useI18n();
  const root = useRef<HTMLElement>(null);
  useScene(root, (el) => {
    const items = gsap.utils.toArray<HTMLElement>('.why-item', el);
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top top', end: `+=${items.length * 90}%`, pin: true, scrub: 0.5, snap: stepSnap(items.length - 1), invalidateOnRefresh: true } });
    tl.fromTo('.why-photo img', { scale: 1.02 }, { scale: 1.2, ease: 'none', duration: items.length - 1 }, 0);
    peekSteps(tl, el.querySelector('.why-list') as HTMLElement, items, 'p');
    items.forEach((_, i) => { if (i) tl.to(`.why-dots i:nth-child(${i + 1})`, { scaleX: 1, duration: 0.3 }, i - 0.35); });
  }, [lang]);
  return (
    <section className="scene why-scene" ref={root} aria-labelledby="why-title">
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
        <div className="why-dots" aria-hidden="true"><i /><i /><i /></div>
      </div>
    </section>
  );
}

// Approach: the whole agent chain at once, cause to effect, left to right.
export function Approach() {
  const { t } = useI18n();
  return (
    <section className="scene approach-scene" aria-labelledby="approach-title">
      <LazyBackground className="approach-bg">
        <DotGrid dotSize={4} gap={26} baseColor={HEX.leaf} activeColor={HEX.accent} proximity={160} clickShock={false} fade={0.35} />
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

// Levers: four full-height cards stack as the page scrolls (React Bits ScrollStack).
export function Contributions() {
  const { t, list, lang } = useI18n();
  return (
    <section className="contrib-scene" id="contributions" aria-labelledby="contrib-title">
      <LazyBackground className="contrib-bg">
        <Waves lineColor={HEX.leaf} accentColor={HEX.accent} spacing={14} amplitude={28} speed={0.5} clickRipple={false} fade={0.3} lightMode />
      </LazyBackground>
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
            <div className="lever-shot"><img src={demoShot(LEVER_SHOT[n - 1], lang)} alt={t(`lever${n}.alt`)} loading="lazy" /></div>
          </ScrollStackItem>
        ))}
      </ScrollStack>
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
        <DotField dotRadius={1.7} dotSpacing={22} gradientFrom={HEX.accent} gradientTo={HEX.leaf} glowColor={HEX.accent} holdToZoom={false} lightMode />
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
