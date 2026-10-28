import { useLayoutEffect, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// A pinned, scroll-scrubbed scene. The build function runs only on wide screens with motion allowed;
// everywhere else the section keeps its static, stacked layout (CSS default), so nothing is hidden.
// While the scene runs, the root gets `is-scened`, which switches the CSS to the layered layout.
export const SCENE_MEDIA = '(min-width: 60.01rem) and (prefers-reduced-motion: no-preference)';

export function useScene(root: RefObject<HTMLElement | null>, build: (el: HTMLElement) => void, deps: unknown[] = []) {
  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add(SCENE_MEDIA, () => {
      el.classList.add('is-scened');
      const ctx = gsap.context(() => build(el), el);
      return () => { ctx.revert(); el.classList.remove('is-scened'); };
    });
    return () => mm.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

// Snap helper for a scene with `steps` equal stops.
export const stepSnap = (steps: number) => ({ snapTo: 1 / steps, directional: true, inertia: false, duration: { min: 0.2, max: 0.55 }, delay: 0.06, ease: 'power2.inOut' });

// One-at-a-time list with a peek: the current item sits in the list box and the next item waits
// below it as a small faded heading, so the reader sees what comes next. Passed items lift away.
// Adds one step per item (at timeline positions 1..n-1) to `tl`.
export function peekSteps(tl: gsap.core.Timeline, list: HTMLElement, items: HTMLElement[], detailSel: string) {
  const PEEK = 0.36, GAP = 28, FAR = 70;
  const at = (rel: number) => {
    if (rel === 0) return { y: 0, scale: 1, autoAlpha: 1 };
    if (rel === 1) return { y: () => list.offsetHeight + GAP, scale: PEEK, autoAlpha: 0.42 };
    return rel > 0
      ? { y: () => list.offsetHeight + GAP + FAR, scale: PEEK, autoAlpha: 0 }
      : { y: -FAR, scale: 1, autoAlpha: 0 };
  };
  items.forEach((el, j) => {
    gsap.set(el, { transformOrigin: 'left top', ...at(j) });
    gsap.set(el.querySelector(detailSel), { autoAlpha: j ? 0 : 1 });
  });
  for (let i = 1; i < items.length; i++) {
    items.forEach((el, j) => {
      const rel = j - i;
      if (Math.abs(rel) > 2) return;
      tl.to(el, { ...at(rel), duration: 0.5, ease: 'power2.inOut' }, i - 0.55);
      if (rel === 0) tl.to(el.querySelector(detailSel), { autoAlpha: 1, duration: 0.3 }, i - 0.3);
      if (rel === -1) tl.to(el.querySelector(detailSel), { autoAlpha: 0, duration: 0.2 }, i - 0.55);
    });
  }
}
