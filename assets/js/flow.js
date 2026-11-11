/* ============================== Durchgehende Seite: Kapitel bauen sich beim Scrollen auf ==============================
   Gilt für die Reiter „SpaceX-Case“ und „RocketLight Dinner“. Jeder Block eines Kapitels erscheint, sobald er ins Bild kommt;
   Balken wachsen, Netzgrafiken öffnen sich, Kennzahlen zählen hoch. Bereits gesehene Blöcke bleiben nach einem Neuzeichnen
   sofort sichtbar. Bei reduzierter Bewegung (System oder Schalter „rocketlight:motion“) ist alles sofort sichtbar. */
window.flowFx = (() => {
  'use strict';
  const seen = new Set();
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  let io = null, spy = null, curCtx = null;
  const reduced = () => { let p = null; try { p = localStorage.getItem('rocketlight:motion'); } catch (_) {}
    return p === 'reduced' || (p !== 'full' && media.matches); };
  const STAGGER = '.tiles>*,.cards>*,.ideas>*,.pf>.cell,.pf .item,.hwn>*,.legend>*,.fields>*,.src>li,.course,.gpass,.xstats>div';

  function countUp(block) {
    block.querySelectorAll('.giant,.tile .v,.xstats b').forEach(el => {
      const raw = el.textContent.trim();
      if (!/^-?[\d.]+(,\d+)?$/.test(raw) || el.dataset.counted) return;
      const dec = (raw.split(',')[1] || '').length, v = parseFloat(raw.replace(/\./g, '').replace(',', '.'));
      if (!Number.isFinite(v) || v === 0) return;
      el.dataset.counted = '1';
      const t0 = performance.now(), dur = 900;
      const f = now => { const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3);
        el.textContent = (v * e).toLocaleString('de-DE', { minimumFractionDigits: dec, maximumFractionDigits: dec });
        if (k < 1 && el.isConnected) requestAnimationFrame(f); else el.textContent = raw; };
      requestAnimationFrame(f);
    });
  }
  function setActive(ch) {
    if (!curCtx || ui.ctx !== curCtx) return;
    document.querySelectorAll('#view .subnav button[data-sub]').forEach(b => b.toggleAttribute('aria-current', b.dataset.sub === ch));
    document.querySelectorAll('#view .subnav button[aria-current]').forEach(b => b.setAttribute('aria-current', 'step'));
    if (ui.sub[curCtx] !== ch) { ui.sub[curCtx] = ch; if (typeof save === 'function') save(); }
  }
  function mount(ctx) {
    if (io) io.disconnect(); if (spy) spy.disconnect(); io = spy = null;
    const view = document.getElementById('view');
    curCtx = ctx;
    view.classList.toggle('flow', !!ctx);
    if (!ctx) return;
    const calm = reduced();
    view.classList.toggle('flow-calm', calm);
    const blocks = [];
    view.querySelectorAll('.chapter').forEach(ch => {
      [...ch.children].forEach((el, i) => {
        const key = ctx + ':' + ch.dataset.ch + ':' + i;
        el.dataset.fx = key;
        el.querySelectorAll(STAGGER).forEach((c, k) => c.style.setProperty('--k', Math.min(k, 14)));
        el.querySelectorAll('svg').forEach(s => s.querySelectorAll('rect[rx="5"],polygon[stroke-width="3"],circle[r="5"]').forEach((r, k) => r.style.setProperty('--k', Math.min(k, 24))));
        if (calm || seen.has(key)) el.classList.add('is-in'); else blocks.push(el);
      });
    });
    if (blocks.length) {
      io = new IntersectionObserver(es => es.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in'); seen.add(e.target.dataset.fx); countUp(e.target); io.unobserve(e.target);
      }), { rootMargin: '0px 0px -10% 0px', threshold: 0 });
      blocks.forEach(b => io.observe(b));
    }
    spy = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) setActive(e.target.dataset.ch); }),
      { rootMargin: '-35% 0px -60% 0px' });
    view.querySelectorAll('.chapter').forEach(ch => spy.observe(ch));
  }
  return { mount };
})();
