import { useI18n } from '../i18n/I18nProvider';
import ScrollVelocity from '../components/reactbits/ScrollVelocity';

// A band of the four research themes that runs with the scroll speed (React Bits ScrollVelocity).
export function Marquee() {
  const { t } = useI18n();
  const themes = ['hero.k1', 'hero.k2', 'hero.k3', 'hero.k4'].map((k) => t(k));
  return (
    <div className="marquee" aria-hidden="true">
      <ScrollVelocity texts={[themes.join('  /  '), themes.slice().reverse().join('  /  ')]} velocity={60} className="marquee-text" />
    </div>
  );
}
