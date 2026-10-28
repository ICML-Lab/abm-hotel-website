import type { Photo } from '../config';
import { useI18n } from '../i18n/I18nProvider';

// A photograph with its short credit label in the corner (full credits on the credits page).
// `load`: 'high' for the hero, 'eager' for scene backgrounds that must be ready when a pinned scene arrives.
export function PhotoImg({ photo, className = '', load = 'lazy', sizes }: { photo: Photo; className?: string; load?: 'lazy' | 'eager' | 'high'; sizes?: string }) {
  const { t } = useI18n();
  return (
    <figure className={`photo ${className}`}>
      <img src={photo.src} alt={t(photo.alt)} loading={load === 'lazy' ? 'lazy' : 'eager'} fetchPriority={load === 'high' ? 'high' : load === 'eager' ? 'low' : 'auto'} decoding="async" sizes={sizes} />
      <figcaption className="photo-credit">
        <a href={photo.source} target="_blank" rel="noopener">{photo.author}, {photo.license}</a>
      </figcaption>
    </figure>
  );
}
