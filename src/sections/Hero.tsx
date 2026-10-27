import { useI18n } from '../i18n/I18nProvider';
import Topography from '../components/reactbits/Topography';
import SplitText from '../components/reactbits/SplitText';
import { HEX } from '../config';

export function Hero() {
  const { t, lang } = useI18n();
  const keys = ['hero.k1', 'hero.k2', 'hero.k3', 'hero.k4'];
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-bg" aria-hidden="true">
        <div className="hero-topo">
          <Topography color={HEX.accent} lineCount={26} lineWidth={1} elevation={1.1} speed={0.12} opacity={0.9} mouseInteraction intro />
        </div>
      </div>
      <div className="container">
        <div className="hero-copy">
          <h1 id="hero-title" key={lang}>
            <SplitText tag="span" text={t('hero.l1')} splitType="words" trigger="load" delay={60} duration={0.9} from={{ opacity: 0, y: 32 }} to={{ opacity: 1, y: 0 }} textAlign="left" />
            <SplitText tag="span" text={t('hero.l2')} splitType="words" trigger="load" delay={60} duration={0.9} from={{ opacity: 0, y: 32 }} to={{ opacity: 1, y: 0 }} textAlign="left" />
          </h1>
          <div className="hero-side">
            <p className="lead">{t('hero.lead')}</p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#contributions">{t('hero.cta1')}</a>
              <a className="btn btn-quiet" href="#collaborate">{t('hero.cta2')}</a>
            </div>
          </div>
        </div>
        <ul className="hero-keys">
          {keys.map((k, i) => (
            <li key={k}><span className="mono">0{i + 1}</span><span>{t(k)}</span></li>
          ))}
        </ul>
      </div>
    </section>
  );
}
