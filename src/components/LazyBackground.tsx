import { useEffect, useRef, useState, type ReactNode } from 'react';

// Mounts an animated background only while its section is on screen and unmounts it once the
// section leaves, so at most one or two WebGL backgrounds run at a time. It watches the section
// itself: a background pinned to the viewport (position: fixed) would always look visible.
// With reduced motion the background is not rendered at all.
export function LazyBackground({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [reduced] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const el = ref.current?.parentElement;
    if (!el || reduced) return;
    const io = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { rootMargin: '80px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);
  return (
    <div ref={ref} className={`section-bg ${className}`} aria-hidden="true">
      {near && children}
    </div>
  );
}
