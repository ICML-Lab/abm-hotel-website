import type React from 'react';
import { useI18n } from '../i18n/I18nProvider';
import SpotlightCard from '../components/reactbits/SpotlightCard';
import AnimatedContent from '../components/reactbits/AnimatedContent';

export function Why() {
  const { t } = useI18n();
  return (
    <section className="section" aria-labelledby="why-title">
      <div className="container problem-grid">
        <div>
          <h2 className="head-section" id="why-title">{t('why.title')}</h2>
          <ol className="problem-list">
            {[1, 2, 3].map((n) => (
              <li key={n}><div><h3>{t(`why.p${n}t`)}</h3><p>{t(`why.p${n}p`)}</p></div></li>
            ))}
          </ol>
        </div>
        <aside className="answer" aria-label={t('why.ansAria')}>
          <h3>{t('why.ansT')}</h3>
          <p>{t('why.ansP')}</p>
          <ul>{['why.a1', 'why.a2', 'why.a3'].map((k) => <li key={k}>{t(k)}</li>)}</ul>
        </aside>
      </div>
    </section>
  );
}

export function Contributions() {
  const { t, list } = useI18n();
  return (
    <section className="section contrib" id="contributions" aria-labelledby="contrib-title">
      <div className="container">
        <div className="contrib-head">
          <h2 className="head-section" id="contrib-title">{t('contrib.title')}</h2>
          <p className="lead">{t('contrib.lead')}</p>
        </div>
        <p className="levers-note">{t('lever.read')}</p>
        <AnimatedContent className="levers" distance={40} duration={0.8} stagger={0.08} threshold={0.15}>
          {[1, 2, 3, 4].map((n) => (
            <SpotlightCard
              key={n}
              className={`lever${n === 1 ? ' lever-key' : ''}`}
              theme={n === 1 ? 'dark' : 'light'}
              spotlightSize={260}
              intensity={0.5}
              style={n === 1 ? ({ '--spotlight-card-surface': 'var(--color-accent-deep)' } as React.CSSProperties) : undefined}
            >
              <h3>{t(`lever${n}.t`)}</h3>
              <p>{t(`lever${n}.p`)}</p>
              <div className="lever-measure">
                <ul>{list(`lever${n}.g`).map((g) => <li key={g}>{g}</li>)}</ul>
              </div>
            </SpotlightCard>
          ))}
        </AnimatedContent>
        <p className="contrib-foot">{t('contrib.foot')}</p>
      </div>
    </section>
  );
}

export function Gains() {
  const { t } = useI18n();
  return (
    <section className="section gains-section" aria-label={t('gains.aria')}>
      <div className="container">
        <div className="gains">
          <div>
            <h3 className="gains-head">{t('out.title')}</h3>
            <dl className="outcomes">
              {[1, 2, 3, 4].map((n) => (
                <div key={n}><dt>{t(`out${n}.t`)}</dt><dd>{t(`out${n}.p`)}</dd></div>
              ))}
            </dl>
          </div>
          <div>
            <h3 className="gains-head">{t('sci.title')}</h3>
            <ol className="science">{[1, 2, 3, 4].map((n) => <li key={n}>{t(`sci${n}`)}</li>)}</ol>
          </div>
        </div>
      </div>
    </section>
  );
}
