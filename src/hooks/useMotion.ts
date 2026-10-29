import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Page-wide scroll motion, two layers:
// 1. Parallax: the photographs behind sections move slower than the page, so the text seems to
//    lead and the picture follows a step behind.
// 2. Reveal: headings, list items, cards and stages rise into place once, a few at a time, as they
//    reach the lower part of the screen.
// Both run only when motion is allowed; without scripts (or with reduced motion) everything simply shows.
const PARALLAX = '.why-photo img, .section-photo img';
const REVEAL = [
  '.why-kicker', '.why-item',
  '.overview-head > *', '.parts > li',
  '.gains-title', '.gains-status',
  '.pilot-card', '.demo-head > *',
  '.progress-head > *', '.timeline > li', '.rq-more',
  '#team-title', '.team-grid > li',
].join(', ');

export function useMotion(deps: unknown[]) {
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.utils.toArray<HTMLElement>(PARALLAX).forEach((img) => {
        const section = img.closest('section');
        if (!section) return;
        gsap.fromTo(img, { yPercent: -14, scale: 1.32 }, {
          yPercent: 14, scale: 1.32, ease: 'none',
          scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true },
        });
      });
      const items = gsap.utils.toArray<HTMLElement>(REVEAL);
      gsap.set(items, { autoAlpha: 0, y: 40 });
      ScrollTrigger.batch(items, {
        start: 'top 88%',
        once: true,
        onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08, overwrite: true }),
      });
    });
    return () => mm.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
