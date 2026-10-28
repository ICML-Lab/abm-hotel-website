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
