import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { useI18n } from '../i18n/I18nProvider';
import { PhotoImg } from '../components/PhotoImg';
import { DECK_URL, PHOTO } from '../config';
import { useScene } from '../hooks/useScene';

// One headline line, split into letters inside a mask so each letter can rise into view.
// Words stay unbreakable; the letters are hidden from assistive tech (the h1's label carries the text).
function Line({ text, n }: { text: string; n: 1 | 2 }) {
  return (
    <span className={`hero-line hero-line-${n}`} aria-hidden="true">
      <span className="hero-line-inner">
        {text.split(' ').map((word, w, all) => (
          <span key={w} className="hero-word">
            {[...word].map((ch, c) => <span key={c} className="hero-char">{ch}</span>)}
            {w < all.length - 1 ? ' ' : null}
          </span>
        ))}
      </span>
    </span>
  );
}

let introPlayed = false;

// Full-screen photograph. On first load the loading panel lifts and the headline rises letter by
// letter; as the hero scrolls away its two lines glide from the edges toward the centre while the
// photo trails behind (parallax).
export function Hero() {
  const { t, lang } = useI18n();
  const root = useRef<HTMLElement>(null);

  // Intro: wait for fonts and the hero photo (at least a short beat, at most a few seconds), then
  // lift the loader and raise the letters. With reduced motion the loader simply fades.
  useLayoutEffect(() => {
    const loader = document.querySelector<HTMLElement>('.loader');
    if (introPlayed || !loader) { loader?.remove(); return; }
    introPlayed = true;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const el = root.current!;
    const chars = el.querySelectorAll('.hero-char');
    const after = el.querySelectorAll('.hero-lead, .hero-actions, .hero-scroll');
    if (!reduced) gsap.set(chars, { yPercent: 115 });
    if (!reduced) gsap.set(after, { autoAlpha: 0, y: 24 });
    const img = el.querySelector<HTMLImageElement>('.hero-photo img');
    const ready = Promise.all([
      document.fonts?.ready,
      img && !img.complete ? new Promise((r) => { img.addEventListener('load', r, { once: true }); img.addEventListener('error', r, { once: true }); }) : null,
      new Promise((r) => setTimeout(r, 1100)),
    ]);
    let tl: gsap.core.Timeline | undefined;
    const go = () => {
      if (tl) return;
      tl = gsap.timeline({ onComplete: () => loader.remove() });
      if (reduced) { tl.to(loader, { autoAlpha: 0, duration: 0.3 }); return; }
      tl.to(loader.querySelector('.loader-mark'), { autoAlpha: 0, y: -20, duration: 0.4, ease: 'power2.in' })
        .to(loader, { yPercent: -100, duration: 1, ease: 'power4.inOut' }, '-=0.1')
        .to(chars, { yPercent: 0, duration: 0.9, ease: 'power3.out', stagger: 0.028 }, '-=0.45')
        .to(after, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out', stagger: 0.1 }, '-=0.5');
    };
    ready.then(go);
    const cap = setTimeout(go, 3500);
    return () => clearTimeout(cap);
  }, []);

  // Scroll: the lines glide inward, the photo trails, the sentence and actions fade.
  useScene(root, (el) => {
    const shift = (sel: string, dir: 1 | -1) => () => {
      const line = el.querySelector<HTMLElement>(sel);
      const inner = line?.querySelector<HTMLElement>('.hero-line-inner');
      return line && inner ? dir * Math.max(0, (line.clientWidth - inner.offsetWidth) / 2) : 0;
    };
    gsap.timeline({ scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: 0.6, invalidateOnRefresh: true } })
      .fromTo('.hero-photo img', { scale: 1.14, yPercent: 0 }, { scale: 1.06, yPercent: 7, ease: 'none' }, 0)
      .to('.hero-shade', { opacity: 0.92, ease: 'none' }, 0)
      .fromTo('.hero-line-1 .hero-line-inner', { x: 0 }, { x: shift('.hero-line-1', 1), ease: 'none', duration: 0.4 }, 0)
      .fromTo('.hero-line-2 .hero-line-inner', { x: 0 }, { x: shift('.hero-line-2', -1), ease: 'none', duration: 0.4 }, 0)
      .fromTo('.hero-lead, .hero-actions', { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -20, ease: 'power2.in', duration: 0.3, immediateRender: false }, 0)
      .fromTo('.hero-scroll', { opacity: 1 }, { opacity: 0, duration: 0.2, immediateRender: false }, 0);
  }, [lang]);

  return (
    <section className="scene hero-scene" ref={root} aria-labelledby="hero-title">
      <PhotoImg photo={PHOTO.cable2} className="hero-photo" load="high" />
      <div className="hero-shade" aria-hidden="true" />
      <div className="container hero-stage">
        <div className="hero-intro">
          <h1 id="hero-title" key={lang} aria-label={`${t('hero.l1')} ${t('hero.l2')}`}>
            <Line text={t('hero.l1')} n={1} />{' '}
            <Line text={t('hero.l2')} n={2} />
          </h1>
          <p className="hero-lead">{t('hero.lead')}</p>
          <div className="hero-actions">
            {DECK_URL
              ? <a className="btn btn-primary" href={DECK_URL} target="_blank" rel="noopener">{t('hero.cta1')}</a>
              : <a className="btn btn-primary" href="#contributions">{t('hero.cta1')}</a>}
            <a className="btn btn-glass" href="#collaborate">{t('hero.cta2')}</a>
            <a className="hero-status" href="#progress">{t('hero.status')}</a>
          </div>
        </div>
        <p className="hero-scroll" aria-hidden="true">{t('hero.scroll')}</p>
      </div>
    </section>
  );
}
