import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { I18nProvider } from './i18n/I18nProvider';
import App from './App';
import type { Lang } from './i18n/dict';

export { DICT } from './i18n/dict';
export { SITE_URL, LANG_PATH, pageUrl } from './site';
export { CONTACT_EMAIL, GREENX_URL } from './config';

// Build-time prerender: the page's real markup for each language, so crawlers and link previews
// read the full text without running scripts. The browser then renders the live page over it.
export function render(lang: Lang) {
  return renderToString(
    <StrictMode>
      <I18nProvider initial={lang}>
        <App />
      </I18nProvider>
    </StrictMode>,
  );
}
