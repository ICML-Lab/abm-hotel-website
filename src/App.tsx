import { Strip, Header } from './sections/Header';
import { Hero } from './sections/Hero';
import { Why, Contributions, Gains } from './sections/Contributions';
import { Day } from './sections/Day';
import { Pilot } from './sections/Pilot';
import { Research, Collaborate, Footer } from './sections/Closing';

export default function App() {
  return (
    <>
      <Strip />
      <Header />
      <main id="top">
        <Hero />
        <Why />
        <Contributions />
        <Day />
        <Gains />
        <Pilot />
        <Research />
        <Collaborate />
      </main>
      <Footer />
    </>
  );
}
