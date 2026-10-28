import { useI18n } from '../i18n/I18nProvider';
import { ALL_PHOTOS } from '../config';

// A plain listing of every photograph, reached from the footer (#credits).
export function Credits() {
  const { t } = useI18n();
  return (
    <main className="credits container" id="top">
      <h1 className="head-section">{t('credits.title')}</h1>
      <p className="lead">{t('credits.lead')}</p>
      <ol className="credits-list">
        {ALL_PHOTOS.map((p) => (
          <li key={p.id}>
            <img src={p.src} alt="" loading="lazy" />
            <div>
              <strong>{t(p.alt)}</strong>
              <span>{t('credits.photo')}: {p.author}, {p.license}</span>
              <a href={p.source} target="_blank" rel="noopener">Wikimedia Commons</a>
            </div>
          </li>
        ))}
      </ol>
      <a className="btn btn-primary" href="#">{t('credits.back')}</a>
    </main>
  );
}
