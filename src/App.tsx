import { useEffect, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Strip, Header } from './sections/Header';
import { Hero } from './sections/Hero';
import { Why, Approach, Contributions, Gains } from './sections/Contributions';
import { Day } from './sections/Day';
import { Pilot } from './sections/Pilot';
import { Research, Collaborate, Footer } from './sections/Closing';
import { Credits } from './sections/Credits';
import { Marquee } from './sections/Marquee';

// The story, one screen per beat: the problem (a resort day), why it is hard, how the model works,
// the levers to test, who gains, where it is tried first, what we will learn, and the invitation.
export default function App() {
  const [route, setRoute] = useState(() => window.location.hash);
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
    return (<><Strip /><Header /><Credits /><Footer /></>);
  }
  return (
    <>
      <Strip />
      <Header />
      <main id="top">
        <Hero />
        <Day />
        <Why />
        <Approach />
        <Marquee />
        <Contributions />
        <Gains />
        <Pilot />
        <Research />
        <Collaborate />
      </main>
      <Footer />
    </>
  );
}
