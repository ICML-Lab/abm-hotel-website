import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { useI18n } from '../i18n/I18nProvider';
import { DAY } from '../data/day';

// Chart geometry (SVG units)
const X0 = 44, X1 = 712, Y0 = 18, Y1 = 262, KMAX = 1400;
const xOf = (min: number) => X0 + (min / 1440) * (X1 - X0);
const yOf = (kw: number) => Y1 - (kw / KMAX) * (Y1 - Y0);
const pad = (n: number) => String(n).padStart(2, '0');
const hhmm = (min: number) => (min >= 1440 ? '24:00' : `${pad(Math.floor(min / 60))}:${pad(Math.floor(min % 60))}`);
const tri = (h: number, a: number, p: number, b: number) => (h <= a || h >= b ? 0 : h < p ? (h - a) / (p - a) : (b - h) / (b - p));
const CHAPTERS: [number, number][] = [[360, 1], [540, 2], [750, 3], [1080, 4], [1290, 5]];
// The visitor sets the time by moving across the chart (06:00 to 24:00). On first view the line
// draws itself from morning to the evening peak, so the whole day is seen before anyone touches it.
const START = 360, END = 1440, STATIC_AT = 1305, INTRO_TO = 1290;

// Pointer, touch or the arrow keys drive the time of day. React renders the section once per chapter;
// within a chapter the clock, readouts, sky and chart are written straight to the DOM (no re-render).
export function Day() {
  const { t, nf } = useI18n();
  const pinRef = useRef<HTMLDivElement>(null);
  const [chapter, setChapter] = useState(1);
  const [reduced] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const nfRef = useRef(nf);
  nfRef.current = nf;

  const { d, pts, peakI, q15, qmax } = useMemo(() => {
    const pts = DAY.power15.map((kw, i) => [xOf(i * 15 + 7.5), yOf(kw)] as const);
    const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
    const peakI = DAY.power15.indexOf(Math.max(...DAY.power15));
    const q15 = Array.from({ length: 96 }, (_, i) => Math.max(0, ...DAY.frames.filter((f) => f[0] >= i * 15 && f[0] < (i + 1) * 15).map((f) => f[2])));
    return { d, pts, peakI, q15, qmax: Math.max(...q15, 1) };
  }, []);

  const els = useRef<Record<string, Element | null>>({});
  const reg = (k: string) => (el: Element | null) => { els.current[k] = el; };
  const last = useRef({ clock: '', kw: -1, q: -1, tr: -1, idx: -1, peak: -1 });
  const cur = useRef(START);

  const apply = useCallback((min: number) => {
    cur.current = min;
    const e = els.current, L = last.current, fmt = nfRef.current;
    const h = min / 60;
    const frame = DAY.frames[Math.min(DAY.frames.length - 1, Math.round(min / 5))];
    const kwNow = DAY.power15[Math.min(95, Math.floor(min / 15))];
    const x = xOf(min);
    const idx = Math.floor(min / 15);
    let ch = 1;
    for (const [tm, n] of CHAPTERS) if (min >= tm) ch = n;
    setChapter(ch);
    const clock = hhmm(Math.round(min));
    if (clock !== L.clock && e.clock) { e.clock.textContent = clock; L.clock = clock; }
    const kw = Math.floor(kwNow);
    if (kw !== L.kw && e.kw) { e.kw.textContent = fmt(kw); L.kw = kw; }
    if (frame[2] !== L.q && e.q) { e.q.textContent = fmt(frame[2]); L.q = frame[2]; }
    if (frame[3] !== L.tr && e.tr) { e.tr.textContent = fmt(frame[3]); L.tr = frame[3]; }
    (e.dawn as HTMLElement | null)?.style.setProperty('opacity', String(tri(h, 4.5, 6.5, 9.5)));
    (e.noon as HTMLElement | null)?.style.setProperty('opacity', String(tri(h, 8, 12.5, 17.5) * 0.85));
    (e.dusk as HTMLElement | null)?.style.setProperty('opacity', String(tri(h, 16.5, 18.5, 21)));
    e.clip?.setAttribute('width', String(Math.max(0, x - X0)));
    e.nowLine?.setAttribute('x1', String(x)); e.nowLine?.setAttribute('x2', String(x));
    e.nowDot?.setAttribute('cx', String(x)); e.nowDot?.setAttribute('cy', String(yOf(kwNow)));
    const peak = min >= peakI * 15 ? 1 : 0;
    if (peak !== L.peak && e.peak) { (e.peak as HTMLElement).style.opacity = String(peak); L.peak = peak; }
    if (idx !== L.idx && e.strip) {
      const bars = e.strip.children;
      for (let i = 0; i < bars.length; i++) bars[i].classList.toggle('past', i <= idx);
      L.idx = idx;
    }
  }, [peakI]);

  // Intro: once the section is half in view, draw the day from morning to the evening peak,
  // unless the visitor has already taken over. With reduced motion the day simply shows the peak.
  const intro = useRef<gsap.core.Tween | null>(null);
  const touched = useRef(false);
  useLayoutEffect(() => {
    if (reduced) { apply(STATIC_AT); return; }
    apply(START);
    const el = pinRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      if (touched.current) return;
      const state = { min: cur.current };
      intro.current = gsap.to(state, { min: INTRO_TO, duration: 2.6, ease: 'power1.inOut', onUpdate: () => apply(state.min) });
    }, { threshold: 0.5 });
    io.observe(el);
    return () => { io.disconnect(); intro.current?.kill(); };
  }, [reduced, apply]);

  const take = () => { touched.current = true; intro.current?.kill(); };
  // Keyboard: the chart takes focus and the arrow keys move the time by 15 minutes (an hour with Shift).
  const fromKeys = (ev: React.KeyboardEvent<HTMLDivElement>) => {
    const d = ev.key === 'ArrowRight' ? 1 : ev.key === 'ArrowLeft' ? -1 : 0;
    if (!d) return;
    ev.preventDefault(); take();
    apply(Math.min(END, Math.max(START, cur.current + d * (ev.shiftKey ? 60 : 15))));
  };
  const fromPointer = (ev: React.PointerEvent<HTMLDivElement>) => {
    const svg = els.current.svg as SVGSVGElement | null;
    if (!svg || (ev.pointerType !== 'mouse' && ev.buttons === 0 && ev.type === 'pointermove')) return;
    const r = svg.getBoundingClientRect();
    const xv = ((ev.clientX - r.left) / r.width) * 720;
    take();
    apply(Math.min(END, Math.max(START, ((xv - X0) / (X1 - X0)) * 1440)));
  };

  // A language switch re-renders the numbers with the new format: redraw the current values.
  useLayoutEffect(() => { last.current = { clock: '', kw: -1, q: -1, tr: -1, idx: -1, peak: -1 }; apply(cur.current); }, [nf, apply]);

  const init = reduced ? STATIC_AT : START;
  const kw0 = DAY.power15[Math.floor(init / 15)];
  const f0 = DAY.frames[Math.round(init / 5)];
  const x0 = xOf(init);

  return (
    <section className="day" id="one-day" aria-labelledby="day-title">
      <div className="day-pin" ref={pinRef}>
        <div className="sky" aria-hidden="true">
          <i className="s-dawn" ref={reg('dawn')} style={{ opacity: tri(init / 60, 4.5, 6.5, 9.5) }} />
          <i className="s-noon" ref={reg('noon')} style={{ opacity: tri(init / 60, 8, 12.5, 17.5) * 0.85 }} />
          <i className="s-dusk" ref={reg('dusk')} style={{ opacity: tri(init / 60, 16.5, 18.5, 21) }} />
        </div>
        <div className="container day-inner">
          <div>
            <h2 className="day-head" id="day-title">{t('day.title')}</h2>
            <p className="day-tag">{t('day.sub')}</p>
            <p className="day-lead">{t('day.lead')}</p>
            <p className="clock mono" ref={reg('clock')}>{hhmm(init)}</p>
            <div className="chapter" aria-live="polite">
              <h3>{t(`day.ch${chapter}.t`)}</h3>
              <p>{t(`day.ch${chapter}.p`)}</p>
            </div>
            <dl className="readouts">
              <div><dt>{t('day.kw')}<span>{t('day.kwN')}</span></dt><dd className="mono"><span ref={reg('kw')}>{nf(Math.floor(kw0))}</span><small>kW</small></dd></div>
              <div><dt>{t('day.queue')}<span>{t('day.queueN')}</span></dt><dd className="mono"><span ref={reg('q')}>{nf(f0[2])}</span><small>{t('day.people')}</small></dd></div>
              <div><dt>{t('day.trav')}<span>{t('day.travN')}</span></dt><dd className="mono"><span ref={reg('tr')}>{nf(f0[3])}</span><small>{t('day.people')}</small></dd></div>
            </dl>
          </div>
          <figure>
            <div className="day-scrub" onPointerMove={fromPointer} onPointerDown={fromPointer} onKeyDown={fromKeys}
              tabIndex={0} role="group" aria-label={t('day.slider')}>
            <svg className="chart" ref={reg('svg')} viewBox="0 0 720 300" role="img" aria-labelledby="chart-desc">
              <desc id="chart-desc">{t('chart.desc')}</desc>
              <defs><clipPath id="day-clip"><rect ref={reg('clip')} x={X0} y={0} width={Math.max(0, x0 - X0)} height={300} /></clipPath></defs>
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
              <g className="peak" ref={reg('peak')} style={{ opacity: init >= peakI * 15 ? 1 : 0 }}>
                <circle cx={pts[peakI][0]} cy={pts[peakI][1]} r={6} />
                <text x={pts[peakI][0] - 12} y={pts[peakI][1] - 2} textAnchor="end">{t('chart.peak')}</text>
              </g>
              <g className="now"><line ref={reg('nowLine')} x1={x0} x2={x0} y1={Y0 - 6} y2={Y1} /><circle ref={reg('nowDot')} cx={x0} cy={yOf(kw0)} r={4} /></g>
            </svg>
            <div className="queue-strip" aria-hidden="true" ref={reg('strip')}>
              {q15.map((q, i) => <i key={i} className={i <= Math.floor(init / 15) ? 'past' : undefined} style={{ height: `${Math.max(2, (q / qmax) * 100)}%` }} />)}
            </div>
            </div>
          </figure>
        </div>
      </div>
    </section>
  );
}
