import { useRef } from 'react';
import gsap from 'gsap';
import { useI18n } from '../i18n/I18nProvider';
import SplitText from '../components/reactbits/SplitText';
import { PhotoImg } from '../components/PhotoImg';
import { PHOTO } from '../config';
import { useScene } from '../hooks/useScene';

// Full-screen photograph. Scrolling pins the hero: the photo settles, the headline lifts away
// and the four research themes rise in its place.
export function Hero() {
  const { t, lang } = useI18n();
  const root = useRef<HTMLElement>(null);

  useScene(root, () => {
    gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top top', end: '+=110%', pin: true, scrub: 0.6 } })
      .fromTo('.hero-photo img', { scale: 1.16 }, { scale: 1, ease: 'none' }, 0)
      .to('.hero-shade', { opacity: 0.92, ease: 'none' }, 0)
      .to('.hero-intro', { yPercent: -40, opacity: 0, ease: 'power2.in' }, 0)
      .fromTo('.hero-keys li', { y: 80, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.07, ease: 'power3.out' }, 0.3);
  }, [lang]);

  return (
    <section className="scene hero-scene" ref={root} aria-labelledby="hero-title">
      <PhotoImg photo={PHOTO.cable2} className="hero-photo" eager />
      <div className="hero-shade" aria-hidden="true" />
      <div className="container hero-stage">
        <div className="hero-intro">
          <h1 id="hero-title" key={lang}>
            <SplitText tag="span" text={t('hero.l1')} splitType="words, chars" trigger="load" delay={18} duration={0.9} from={{ opacity: 0, y: 60 }} to={{ opacity: 1, y: 0 }} textAlign="left" />
            <SplitText tag="span" text={t('hero.l2')} splitType="words, chars" trigger="load" delay={18} duration={0.9} from={{ opacity: 0, y: 60 }} to={{ opacity: 1, y: 0 }} textAlign="left" />
          </h1>
          <p className="lead">{t('hero.lead')}</p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#contributions">{t('hero.cta1')}</a>
            <a className="btn btn-glass" href="#collaborate">{t('hero.cta2')}</a>
          </div>
        </div>
        <ul className="hero-keys">
          {['hero.k1', 'hero.k2', 'hero.k3', 'hero.k4'].map((k, i) => (
            <li key={k}><span className="mono">0{i + 1}</span><span>{t(k)}</span></li>
          ))}
        </ul>
        <p className="hero-scroll" aria-hidden="true">{t('hero.scroll')}</p>
      </div>
    </section>
  );
}
