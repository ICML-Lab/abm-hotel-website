import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useI18n } from '../i18n/I18nProvider';
import { DAY } from '../data/day';

gsap.registerPlugin(ScrollTrigger);

// Chart geometry (SVG units)
const X0 = 44, X1 = 712, Y0 = 18, Y1 = 262, KMAX = 1400;
const xOf = (min: number) => X0 + (min / 1440) * (X1 - X0);
const yOf = (kw: number) => Y1 - (kw / KMAX) * (Y1 - Y0);
const pad = (n: number) => String(n).padStart(2, '0');
const hhmm = (min: number) => (min >= 1440 ? '24:00' : `${pad(Math.floor(min / 60))}:${pad(Math.floor(min % 60))}`);
const tri = (h: number, a: number, p: number, b: number) => (h <= a || h >= b ? 0 : h < p ? (h - a) / (p - a) : (b - h) / (b - p));
const CHAPTERS: [number, number][] = [[360, 1], [540, 2], [750, 3], [1080, 4], [1290, 5]];
// The day advances in 3-hour stops: 06, 09, 12, 15, 18, 21, 24. One stop per short scroll, snapped.
const START = 360, END = 1440, STEP = 180, STATIC_AT = 1305;
const STOPS = (END - START) / STEP;
const PX_PER_STOP = 260;

export function Day() {
  const { t, nf } = useI18n();
  const pinRef = useRef<HTMLDivElement>(null);
  const [min, setMin] = useState(START);
  const [reduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  const { d, pts, peakI, q15, qmax } = useMemo(() => {
    const pts = DAY.power15.map((kw, i) => [xOf(i * 15 + 7.5), yOf(kw)] as const);
    const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
    const peakI = DAY.power15.indexOf(Math.max(...DAY.power15));
    const q15 = Array.from({ length: 96 }, (_, i) => Math.max(0, ...DAY.frames.filter((f) => f[0] >= i * 15 && f[0] < (i + 1) * 15).map((f) => f[2])));
    return { d, pts, peakI, q15, qmax: Math.max(...q15, 1) };
  }, []);

  useEffect(() => {
    if (reduced) { setMin(STATIC_AT); return; }
    const state = { min: START };
    const mm = gsap.matchMedia();
    const make = (vars: ScrollTrigger.Vars) => gsap.to(state, { min: END, ease: 'none', scrollTrigger: vars, onUpdate: () => setMin(state.min) });
    mm.add('(min-width: 60.01rem)', () => {
      make({
        trigger: pinRef.current, start: 'top top', end: `+=${STOPS * PX_PER_STOP}`, pin: true, scrub: 0.5, anticipatePin: 1,
        snap: { snapTo: 1 / STOPS, directional: true, inertia: false, duration: { min: 0.25, max: 0.6 }, delay: 0.08, ease: 'power2.inOut' },
      });
    });
    mm.add('(max-width: 60rem)', () => { make({ trigger: pinRef.current, start: 'top 70%', end: 'bottom 30%', scrub: 0.6 }); });
    return () => mm.revert();
  }, [reduced]);

  const h = min / 60;
  const frame = DAY.frames[Math.min(DAY.frames.length - 1, Math.round(min / 5))];
  const kwNow = DAY.power15[Math.min(95, Math.floor(min / 15))];
  const x = xOf(min);
  const idx = Math.floor(min / 15);
  let chapter = 1;
  for (const [tm, n] of CHAPTERS) if (min >= tm) chapter = n;

  return (
    <section className="day" id="one-day" aria-labelledby="day-title">
      <div className="day-pin" ref={pinRef}>
        <div className="sky" aria-hidden="true">
          <i className="s-dawn" style={{ opacity: tri(h, 4.5, 6.5, 9.5) }} />
          <i className="s-noon" style={{ opacity: tri(h, 8, 12.5, 17.5) * 0.85 }} />
          <i className="s-dusk" style={{ opacity: tri(h, 16.5, 18.5, 21) }} />
        </div>
        <div className="container day-inner">
          <div>
            <h2 className="day-head" id="day-title">{t('day.title')}</h2>
            <p className="day-tag">{t('day.sub')}</p>
            <p className="clock mono">{hhmm(Math.round(min))}</p>
            <div className="chapter" aria-live="polite">
              <h3>{t(`day.ch${chapter}.t`)}</h3>
              <p>{t(`day.ch${chapter}.p`)}</p>
            </div>
            <dl className="readouts">
              <div><dt>{t('day.kw')}</dt><dd className="mono">{nf(Math.floor(kwNow))}<small>kW</small></dd></div>
              <div><dt>{t('day.queue')}</dt><dd className="mono">{nf(frame[2])}<small>{t('day.people')}</small></dd></div>
              <div><dt>{t('day.trav')}</dt><dd className="mono">{nf(frame[3])}<small>{t('day.people')}</small></dd></div>
            </dl>
          </div>
          <figure>
            <svg className="chart" viewBox="0 0 720 300" role="img" aria-labelledby="chart-desc">
              <desc id="chart-desc">{t('chart.desc')}</desc>
              <defs><clipPath id="day-clip"><rect x={X0} y={0} width={Math.max(0, x - X0)} height={300} /></clipPath></defs>
              <g className="axis">
                {[0, 400, 800, 1200].map((kw) => (
                  <g key={kw}><line x1={X0} x2={X1} y1={yOf(kw)} y2={yOf(kw)} /><text x={0} y={yOf(kw) + 4}>{nf(kw)}</text></g>
                ))}
                {[0, 6, 12, 18, 24].map((hr) => <text key={hr} x={xOf(hr * 60) - 8} y={290}>{pad(hr)}</text>)}
              </g>
              <path className="ghost" d={d} />
              <g clipPath="url(#day-clip)">
                <path className="area" d={`${d} L${pts[pts.length - 1][0]} ${Y1} L${pts[0][0]} ${Y1} Z`} />
                <path className="line" d={d} />
              </g>
              <g className="peak" style={{ opacity: min >= peakI * 15 ? 1 : 0 }}>
                <circle cx={pts[peakI][0]} cy={pts[peakI][1]} r={6} />
                <text x={pts[peakI][0] - 12} y={pts[peakI][1] - 2} textAnchor="end">{t('chart.peak')}</text>
              </g>
              <g className="now"><line x1={x} x2={x} y1={Y0 - 6} y2={Y1} /><circle cx={x} cy={yOf(kwNow)} r={4} /></g>
            </svg>
            <div className="queue-strip" aria-hidden="true">
              {q15.map((q, i) => <i key={i} className={i <= idx ? 'past' : undefined} style={{ height: `${Math.max(2, (q / qmax) * 100)}%` }} />)}
            </div>
            <figcaption className="chart-caption">{t('chart.caption')}</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
