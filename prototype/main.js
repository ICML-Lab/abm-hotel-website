(() => {
  const root = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const hasGsap = typeof window.gsap !== 'undefined';
  if (reduced) root.classList.add('reduced');
  if (hasGsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
  const tr = (k, v) => (typeof window.t === 'function' ? window.t(k, v) : k);
  const lang = () => (typeof window.getLang === 'function' ? window.getLang() : 'en');
  const nf = { format: (n) => new Intl.NumberFormat(lang() === 'vi' ? 'vi-VN' : 'en-US', { maximumFractionDigits: 0 }).format(n) };
  const pad = (n) => String(n).padStart(2, '0');
  const hhmm = (min) => `${pad(Math.floor(min / 60) % 24)}:${pad(Math.floor(min % 60))}`;

  /* ---------- demo: click-to-load ---------- */
  document.querySelectorAll('.demo-frame').forEach((frame) => {
    const btn = frame.querySelector('.play');
    const src = frame.dataset.demoSrc;
    btn.addEventListener('click', () => {
      if (window.matchMedia('(max-width: 40rem)').matches) { window.open(src, '_blank', 'noopener'); return; }
      if (frame.querySelector('iframe')) return;
      frame.classList.add('is-loading');
      const iframe = document.createElement('iframe');
      iframe.src = src;
      iframe.title = tr('demo.iframe');
      iframe.allow = 'fullscreen';
      iframe.addEventListener('load', () => { frame.classList.remove('is-loading'); frame.classList.add('is-ready'); iframe.focus(); }, { once: true });
      frame.appendChild(iframe);
    });
  });

  /* ---------- tabs ---------- */
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  const select = (tab) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      panel.hidden = !on;
      if (on && !reduced) { panel.classList.remove('is-in'); void panel.offsetWidth; panel.classList.add('is-in'); }
    });
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', (e) => {
      const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!d) return;
      const next = tabs[(i + d + tabs.length) % tabs.length];
      next.focus(); select(next);
    });
  });

  /* ---------- research questions ---------- */
  document.querySelectorAll('.rq > button').forEach((b) => {
    b.addEventListener('click', () => {
      const open = b.getAttribute('aria-expanded') !== 'true';
      b.setAttribute('aria-expanded', String(open));
      b.parentElement.classList.toggle('is-open', open);
    });
  });

  /* ---------- hero: headline reveal, light parallax, agent trail ---------- */
  if (hasGsap && !reduced) {
    gsap.from('.hero h1 .line > span', { yPercent: 105, duration: 1.1, ease: 'power4.out', stagger: 0.12, delay: 0.1 });

  }

  /* ---------- the day ---------- */
  const data = window.ABM_DAY;
  const svg = document.querySelector('[data-chart]');
  if (!data || !svg) return;
  const NS = 'http://www.w3.org/2000/svg';
  const el = (tag, attrs, parent = svg) => { const n = document.createElementNS(NS, tag); for (const k in attrs) n.setAttribute(k, attrs[k]); parent.appendChild(n); return n; };
  const X0 = 44, X1 = 712, Y0 = 18, Y1 = 262, KMAX = 1400;
  const xOf = (min) => X0 + (min / 1440) * (X1 - X0);
  const yOf = (kw) => Y1 - (kw / KMAX) * (Y1 - Y0);
  const pts = data.power15.map((kw, i) => [xOf(i * 15 + 7.5), yOf(kw)]);
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');

  const axis = el('g', { class: 'axis' });
  const kwLabels = [0, 400, 800, 1200].map((kw) => { el('line', { x1: X0, x2: X1, y1: yOf(kw), y2: yOf(kw) }, axis); const tx = el('text', { x: 0, y: yOf(kw) + 4 }, axis); tx.textContent = nf.format(kw); return [tx, kw]; });
  [0, 6, 12, 18, 24].forEach((h) => { el('text', { x: xOf(h * 60) - 8, y: 290 }, axis).textContent = pad(h); });

  el('path', { class: 'ghost', d });
  const clip = el('clipPath', { id: 'day-clip' }, el('defs', {}));
  const clipRect = el('rect', { x: X0, y: 0, width: X1 - X0, height: 300 }, clip);
  const drawn = el('g', { 'clip-path': 'url(#day-clip)' });
  el('path', { class: 'area', d: `${d} L${pts.at(-1)[0]} ${Y1} L${pts[0][0]} ${Y1} Z` }, drawn);
  el('path', { class: 'line', d }, drawn);
  const peakI = data.power15.indexOf(Math.max(...data.power15));
  const peak = el('g', { class: 'peak' });
  el('circle', { cx: pts[peakI][0], cy: pts[peakI][1], r: 6 }, peak);
  const peakText = el('text', { x: pts[peakI][0] - 12, y: pts[peakI][1] - 2, 'text-anchor': 'end' }, peak);
  peakText.textContent = tr('chart.peak');
  const now = el('g', { class: 'now' });
  const nowLine = el('line', { x1: 0, x2: 0, y1: Y0 - 6, y2: Y1 }, now);
  const nowDot = el('circle', { cx: 0, cy: 0, r: 4 }, now);

  // 96 bars, one per 15 min: the max queue of the three 5-minute frames inside it.
  const strip = document.querySelector('[data-queue-strip]');
  const q15 = Array.from({ length: 96 }, (_, i) => Math.max(...data.frames.filter((f) => f[0] >= i * 15 && f[0] < (i + 1) * 15).map((f) => f[2]), 0));
  const qmax = Math.max(...q15, 1);
  const bars = q15.map((q) => { const b = document.createElement('i'); b.style.height = `${Math.max(2, (q / qmax) * 100)}%`; strip.appendChild(b); return b; });

  const clockEl = document.querySelector('[data-clock]');
  const kwEl = document.querySelector('[data-kw]');
  const qEl = document.querySelector('[data-queue]');
  const tEl = document.querySelector('[data-trav]');
  const chapterEl = document.querySelector('[data-chapter]');
  const sky = { dawn: document.querySelector('.s-dawn'), noon: document.querySelector('.s-noon'), dusk: document.querySelector('.s-dusk') };
  const chapters = [[360, 1], [540, 2], [750, 3], [1080, 4], [1290, 5]];
  let lastChapter = -1;
  const tri = (h, a, peakH, b) => (h <= a || h >= b ? 0 : h < peakH ? (h - a) / (peakH - a) : (b - h) / (b - peakH));

  const render = (min) => {
    const h = min / 60;
    clockEl.textContent = hhmm(min);
    const f = data.frames[Math.min(data.frames.length - 1, Math.round(min / 5))];
    const kwNow = data.power15[Math.min(95, Math.floor(min / 15))];
    kwEl.textContent = nf.format(Math.floor(kwNow)); qEl.textContent = nf.format(f[2]); tEl.textContent = nf.format(f[3]);
    const x = xOf(min);
    clipRect.setAttribute('width', Math.max(0, x - X0));
    nowLine.setAttribute('x1', x); nowLine.setAttribute('x2', x);
    nowDot.setAttribute('cx', x); nowDot.setAttribute('cy', yOf(kwNow));
    peak.style.opacity = min >= peakI * 15 ? 1 : 0;
    const idx = Math.floor(min / 15);
    bars.forEach((b, i) => b.classList.toggle('past', i <= idx));
    sky.dawn.style.opacity = tri(h, 4.5, 6.5, 9.5);
    sky.noon.style.opacity = tri(h, 8, 12.5, 17.5) * 0.85;
    sky.dusk.style.opacity = tri(h, 16.5, 18.5, 21);
    let c = 0; chapters.forEach(([t], i) => { if (min >= t) c = i; });
    if (c !== lastChapter) {
      lastChapter = c;
      const n = chapters[c][1];
      chapterEl.querySelector('h3').dataset.i18n = `day.ch${n}.t`; chapterEl.querySelector('h3').textContent = tr(`day.ch${n}.t`);
      chapterEl.querySelector('p').dataset.i18n = `day.ch${n}.p`; chapterEl.querySelector('p').textContent = tr(`day.ch${n}.p`);
    }
  };

  const START = 360, END = 1425;
  const state = { min: START };
  document.addEventListener('langchange', () => {
    kwLabels.forEach(([tx, kw]) => { tx.textContent = nf.format(kw); });
    peakText.textContent = tr('chart.peak');
    lastChapter = -1; render(state.min);
  });
  if (!hasGsap || !window.ScrollTrigger || reduced) { state.min = 1305; render(1305); return; }
  render(START);
  const mm = gsap.matchMedia();
  mm.add('(min-width: 60.01rem)', () => {
    gsap.to(state, {
      min: END, ease: 'none',
      scrollTrigger: { trigger: '.day-pin', start: 'top top', end: '+=2600', pin: true, scrub: 0.6, anticipatePin: 1 },
      onUpdate: () => render(state.min),
    });
  });
  mm.add('(max-width: 60rem)', () => {
    gsap.to(state, {
      min: END, ease: 'none',
      scrollTrigger: { trigger: '.day-pin', start: 'top 70%', end: 'bottom 30%', scrub: 0.6 },
      onUpdate: () => render(state.min),
    });
  });
})();
