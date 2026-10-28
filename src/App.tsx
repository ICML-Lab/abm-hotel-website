import { useEffect, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SiteHeader } from './sections/Header';
import { Hero } from './sections/Hero';
import { Why, Approach, Gains } from './sections/Contributions';
import { Day } from './sections/Day';
import { Pilot } from './sections/Pilot';
import { Progress, Footer } from './sections/Closing';
import { Credits } from './sections/Credits';
import { Team } from './sections/Team';
import { ScrollProgress } from './components/ScrollProgress';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { useMotion } from './hooks/useMotion';

// A pitch to operators: the problem (a resort day), why it is hard, what the hotel and its guests gain,
// how it works, where it is tried first, where the project stands, who runs it, and the invitation.
export default function App() {
  const [route, setRoute] = useState(() => (typeof window !== 'undefined' ? window.location.hash : ''));
  useSmoothScroll();
  useMotion([route]);
  useEffect(() => {
    const on = () => { setRoute(window.location.hash); if (window.location.hash === '#credits') window.scrollTo(0, 0); };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);

  // Pinned scenes are created by several sections; once all have mounted (and again when images and
  // fonts settle) put the triggers in page order and recompute their positions.
  useEffect(() => {
    const refresh = () => { ScrollTrigger.sort(); ScrollTrigger.refresh(); };
    const id = requestAnimationFrame(refresh);
    window.addEventListener('load', refresh);
    document.fonts?.ready.then(refresh);
    return () => { cancelAnimationFrame(id); window.removeEventListener('load', refresh); };
  }, [route]);

  if (route === '#credits') {
    return (<><SiteHeader /><Credits /><Footer /></>);
  }
  return (
    <>
      <ScrollProgress />
      <SiteHeader />
      <main id="top">
        <Hero />
        <Day />
        <Why />
        <Gains />
        <Approach />
        <Pilot />
        <Progress />
        <Team />
      </main>
      <Footer />
    </>
  );
}
