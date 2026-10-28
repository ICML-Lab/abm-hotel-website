import { useEffect, useRef, useState, type ReactNode } from 'react';

// Mounts an animated background only while its section is near the viewport, and unmounts it
// when the visitor scrolls far away, so at most one or two WebGL/canvas backgrounds run at a time.
// With reduced motion the background is not rendered at all.
export function LazyBackground({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [reduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const io = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { rootMargin: '300px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);
  return (
    <div ref={ref} className={`section-bg ${className}`} aria-hidden="true">
      {near && children}
    </div>
  );
}
