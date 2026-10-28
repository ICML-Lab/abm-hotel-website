import { useI18n } from '../i18n/I18nProvider';
import { TEAM } from '../config';

// The principal investigators, as their VinUni profiles name them; each card opens that profile in a new tab.
export function Team() {
  const { t, list, lang } = useI18n();
  return (
    <section className="team-scene" id="team" aria-labelledby="team-title">
      <div className="container">
        <h2 className="head-section" id="team-title">{t('team.title')}</h2>
        <ul className="team-grid">
          {TEAM.map((p) => (
            <li key={p.id}>
              <a className="team-card" href={p.profile[lang]} target="_blank" rel="noopener">
                <img src={p.img} alt="" width={720} height={720} loading="lazy" />
                <h3>{t(`team.${p.id}.name`)}</h3>
                <span className="team-role">{list(`team.${p.id}.role`).map((r) => <span key={r}>{r}</span>)}<span className="team-uni">{t('team.uni')}</span></span>
              </a>
              {p.email && <a className="team-email" href={`mailto:${p.email}`}>{p.email}</a>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
