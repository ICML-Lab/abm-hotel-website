import type { Photo } from '../config';
import { useI18n } from '../i18n/I18nProvider';

// A photograph with its short credit label in the corner (full credits on the credits page).
export function PhotoImg({ photo, className = '', eager = false, sizes }: { photo: Photo; className?: string; eager?: boolean; sizes?: string }) {
  const { t } = useI18n();
  return (
    <figure className={`photo ${className}`}>
      <img src={photo.src} alt={t(photo.alt)} loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : 'auto'} decoding="async" sizes={sizes} />
      <figcaption className="photo-credit">
        <a href={photo.source} target="_blank" rel="noopener">{photo.author}, {photo.license}</a>
      </figcaption>
    </figure>
  );
}
