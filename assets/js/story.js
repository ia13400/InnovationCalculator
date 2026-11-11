/* ============================== SpaceX-Case als Scroll-Erzählung ==============================
   Zwölf Ideen bleiben über alle Kapitel dieselben Punkte: Sterne → Trendkonstellation → How-Wow-Now-Matrix →
   drei Finalisten → Bewertung → 5-Jahres-Zahlen → Portfolio → Ranking. Alle Werte kommen live aus root.spacex
   und calc(); die Kapiteltexte stehen zusätzlich als lesbares HTML bereit (reduzierte Bewegung, flache Fenster). */
(() => {
  'use strict';
  const story = document.getElementById('case');
  if (!story || typeof root === 'undefined' || !root.spacex) return;
  const NS = 'http://www.w3.org/2000/svg';
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const smooth = t => { t = clamp(t); return t * t * (3 - 2 * t); };
  const lerp = (a, b, t) => a + (b - a) * t;
  const fmt = (v, d = 2) => Number.isFinite(v) ? v.toLocaleString('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d }) : '–';
  const mio = v => fmt(v / 1e6, 1) + ' Mio USD';
  const pct = v => fmt(v * 100, 2) + ' %';
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  const MOTION_KEY = 'rocketlight:motion';
  const read = k => { try { return localStorage.getItem(k); } catch (_) { return null; } };
  const write = (k, v) => { try { localStorage.setItem(k, v); } catch (_) {} };

  /* ---------- Daten ---------- */
  const withCase = fn => { const prev = state; state = root.spacex; try { return fn(); } finally { state = prev; } };
  const avg = a => (a[0] + a[1]) / 2;
  const shortName = n => n.replace(/^SpaceX /, '').replace('Rocket-Light-Dinner', 'RocketLight Dinner');
  const TRENDS = [...new Set(IDEAS.map(i => i.trend))];
  const isKI = a => /KI|Claude/i.test(a.assessor || '');

  function model() {
    return withCase(() => {
      const finalists = IDEAS.filter(i => i.c.includes('WOW')).map(i => {
        const list = state.list.filter(a => +a.idea === i.id);
        const team = list.find(a => !isKI(a)), ki = list.find(isKI);
        const rt = team ? calc(team) : null, rk = ki ? calc(ki) : null;
        const irs = [rt, rk].filter(Boolean).map(r => r.IR).filter(Number.isFinite);
        return { idea: i, name: shortName(i.name), team, ki, rt, rk, fy: rk && rk.fy ? rk.fy : (rt && rt.fy) || null,
          mean: irs.length ? irs.reduce((x, y) => x + y, 0) / irs.length : 0 };
      });
      const ranking = finalists.slice().sort((p, q) => q.mean - p.mean);
      return { finalists, ranking, base: state.base };
    });
  }

  /* ---------- Kapitel ---------- */
  const PHASES = ['intro', 'trends', 'matrix', 'finalists', 'scores', 'numbers', 'portfolio', 'result'];
  function chapters(M) {
    const names = M.finalists.map(f => f.name);
    const list = names.length > 1 ? names.slice(0, -1).join(', ') + ' und ' + names[names.length - 1] : names.join('');
    const allSmall = M.finalists.every(f => f.fy && f.fy.pShare <= .03);
    const best = M.ranking[0];
    const row = (f, r) => r ? `${f.name} · ${r === f.rt ? 'Team' : 'KI'}: Nutzen ${fmt(r.IN)} · Aufwand ${fmt(r.IA)} · Rendite ${fmt(r.IR)}` : '';
    return [
      { eye: 'SpaceX-Case · Trend2Business · Gruppe 2', title: 'Zwölf Ideen. Drei Finalisten. Eine Rechnung.',
        text: 'Scrolle und sieh zu, wie aus Trends Geschäftsideen werden – und welche davon sich für SpaceX tatsächlich lohnt.' },
      { eye: 'Schritt 1 · Trendportfolio', title: 'Jede Idee gehört zu einem Trend.',
        text: `Aus ${TRENDS.length - 1} Megatrends hat die Gruppe je eine Geschäftsidee ausgewählt. Vier weitere entstanden in einer offenen Ideenrunde.` },
      { eye: 'Schritt 2 · How-Wow-Now', title: 'Machbar – und originell?',
        text: 'Gruppe und KI haben jede Idee nach Machbarkeit und Originalität eingeordnet. Erst ab 4 Punkten auf beiden Achsen wird aus einer Idee ein WOW.' },
      { eye: 'Schritt 3 · Finalisten', title: `${M.finalists.length} Ideen bleiben im Licht.`,
        text: `${list} erreichen das WOW-Feld. Alle anderen Ideen bleiben im Ideenpool und lassen sich weiter unten im Detail ansehen.` },
      { eye: 'Schritt 4 · Inno-Rendite-Kalkulator', title: 'Zwölf Kriterien, zwei Blickwinkel.',
        text: 'Team und KI (Claude) bewerten jede Idee getrennt nach der Methode von Prof. Hube. Rendite = Nutzen ÷ Aufwand; über 1 lohnt sich die Idee.',
        facts: M.finalists.flatMap(f => [row(f, f.rt), row(f, f.rk)]).filter(Boolean) },
      { eye: 'Schritt 5 · 5-Jahres-Kalkulation', title: allSmall ? 'Gemessen an SpaceX bleiben die Zahlen klein.' : 'Was die Ideen in fünf Jahren bringen.',
        text: `Umsatz über fünf Jahre, gerechnet mit Kennzahlen aus dem SpaceX-Börsenprospekt (Gewinn ${fmt(M.base.profit, 0)} Mio USD).` + (allSmall ? ' Jede Idee bleibt unter 3 % des Gewinns – wirtschaftlicher Nutzen 1 von 5.' : ''),
        facts: M.finalists.filter(f => f.fy).map(f => `${f.name}: Umsatz ${mio(f.fy.R)} · Gewinnanteil ${pct(f.fy.pShare)} · F&E ${mio(f.fy.C)}`) },
      { eye: 'Schritt 6 · Portfolio', title: 'Nutzen gegen Aufwand.',
        text: 'Im Aufwand/Nutzen-Portfolio nach Prof. Hube zeigt jeder Punkt eine Bewertung: gefüllt die KI, als Ring das Team. Je weiter rechts und oben, desto besser.',
        facts: M.finalists.flatMap(f => [f.rt && `${f.name} · Team: ${f.rt.pf[0]}`, f.rk && `${f.name} · KI: ${f.rk.pf[0]}`]).filter(Boolean) },
      { eye: 'Ergebnis', title: best ? `${best.name} liefert die höchste Rendite.` : 'Das Ranking',
        text: 'Rangfolge nach mittlerer Innovationsrendite aus Team- und KI-Bewertung. Alle Zahlen, Begründungen und Quellen lassen sich im Rechner prüfen und ändern.',
        facts: M.ranking.map((f, i) => `${i + 1}. ${f.name}: Rendite ${fmt(f.mean)} (Team ${f.rt ? fmt(f.rt.IR) : '–'} · KI ${f.rk ? fmt(f.rk.IR) : '–'})`), cta: true }
    ];
  }

  /* ---------- Szene ---------- */
  function el(tag, attrs = {}, parent) {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  function txt(parent, x, y, s, cls, anchor = 'start') { const t = el('text', { x, y, class: cls, 'text-anchor': anchor }, parent); t.textContent = s; return t; }

  function makeScene(svg, layout, M) {
    svg.innerHTML = '';
    const W = layout.w, H = layout.h, R = layout.region, nar = layout.narrow;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.classList.toggle('is-narrow', nar);
    const g = {}; const layer = (name, phases) => { g[name] = el('g', { class: 'sc-' + name }); g[name].dataset.ph = phases; svg.appendChild(g[name]); return g[name]; };
    const seeded = i => ((Math.sin(i * 127.1 + 311.7) * 43758.5453) % 1 + 1) % 1;
    const CW = nar ? 6.1 : 6.9, LH = 15;
    const wrap = (s, w, cw) => { const out = []; let line = '';
      s.split(' ').forEach(word => { if (line && (line + ' ' + word).length * cw > w) { out.push(line); line = word; } else line = (line + ' ' + word).trim(); });
      return out.concat(line); }; // geschätzte Zeichenbreite und Zeilenhöhe für Beschriftungen

    /* Sterne – nur Atmosphäre, statisch */
    const stars = layer('stars', '0,1,2,3,4,5,6,7');
    for (let i = 0; i < (nar ? 40 : 70); i++) el('circle', { cx: seeded(i) * W, cy: seeded(i + 99) * H, r: .6 + seeded(i + 7) * 1.1, class: 'star' }, stars);

    /* Beschriftungen ohne Überlappung: rechts, links oder leicht versetzt; auf schmalen Ansichten notfalls ausgeblendet */
    function placeLabels(pts, obstacles = []) {
      const boxes = obstacles.slice(), res = [];
      const hit = (b, ignore) => b.x0 < 2 || b.x1 > W - 2 || b.y0 < 2 || b.y1 > H - 2 ||
        boxes.some(o => o !== ignore && b.x0 < o.x1 && b.x1 > o.x0 && b.y0 < o.y1 && b.y1 > o.y0);
      pts.forEach(p => boxes.push(p.self = { x0: p.x - p.r - 2, x1: p.x + p.r + 2, y0: p.y - p.r - 2, y1: p.y + p.r + 2 }));
      for (const p of pts) {
        const w = p.label.length * CW, opts = [['r', 0], ['l', 0], ['r', -LH], ['r', LH], ['l', -LH], ['l', LH]];
        let pick = null;
        for (const [side, dy] of opts) {
          const x0 = side === 'r' ? p.x + p.r + 6 : p.x - p.r - 6 - w;
          const b = { x0, x1: x0 + w, y0: p.y + dy - 10, y1: p.y + dy + 4 };
          if (!hit(b, p.self)) { pick = { side, dy, show: 1, b }; break; }
        }
        if (!pick) pick = nar ? { side: 'r', dy: 0, show: 0 } : { side: 'r', dy: 0, show: 1 };
        if (pick.b) boxes.push(pick.b);
        res.push(pick);
      }
      return res;
    }

    /* Trendkonstellation: Trends innen, ihre Ideen außen */
    const cx = R.x + R.w / 2, cy = R.y + R.h / 2, rx = R.w * .47, ry = R.h * .46;
    const trendPos = TRENDS.map((t, i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / TRENDS.length; return { x: cx + rx * .6 * Math.cos(a), y: cy + ry * .6 * Math.sin(a), a }; });
    const links = layer('links', '1');
    const trends = layer('trends', '1');
    const trendBoxes = [];
    TRENDS.forEach((t, i) => { const p = trendPos[i]; el('circle', { cx: p.x, cy: p.y, r: 3.5, class: 'trend-dot' }, trends);
      const ty = p.y + (Math.sin(p.a) < -.2 ? -10 : 18), w = t.length * (nar ? 5.6 : 6.6);
      txt(trends, p.x, ty, t, 'trend-label', 'middle'); trendBoxes.push({ x0: p.x - w / 2, x1: p.x + w / 2, y0: ty - 11, y1: ty + 3 }); });

    /* How-Wow-Now-Matrix (Skala 1–5) */
    const mx = v => R.x + (v - 1) / 4 * R.w, my = v => R.y + R.h - (v - 1) / 4 * R.h;
    const matrix = layer('matrix', '2');
    el('rect', { x: mx(4), y: my(5), width: mx(5) - mx(4), height: my(4) - my(5), class: 'wow-zone' }, matrix);
    el('rect', { x: R.x, y: R.y, width: R.w, height: R.h, class: 'frame' }, matrix);
    el('line', { x1: mx(4), y1: R.y, x2: mx(4), y2: R.y + R.h, class: 'thresh' }, matrix);
    el('line', { x1: R.x, y1: my(4), x2: R.x + R.w, y2: my(4), class: 'thresh' }, matrix);
    txt(matrix, mx(4.5), my(4.8), 'WOW', 'quad wow', 'middle');
    txt(matrix, mx(2.5), my(4.8), 'HOW', 'quad', 'middle');
    txt(matrix, mx(4.5), my(1.15), 'NOW', 'quad', 'middle');
    txt(matrix, R.x + R.w, R.y + R.h + (nar ? 30 : 34), 'Machbarkeit →', 'axis', 'end');
    txt(matrix, R.x - 10, R.y - 10, '↑ Originalität', 'axis');
    [1, 2, 3, 4, 5].forEach(v => { txt(matrix, mx(v), R.y + R.h + 16, v, 'tick', 'middle'); txt(matrix, R.x - 10, my(v) + 4, v, 'tick', 'end'); });

    /* Finalistenspalten */
    const F = M.finalists, nF = Math.max(F.length, 1);
    const colW = R.w / nF, colX = i => R.x + colW * (i + .5), headY = R.y + 10;
    const barW = Math.min(colW * (nar ? .9 : .84), 230), bx = i => colX(i) - barW / 2;
    const heads = layer('heads', '3,4,5');
    F.forEach((f, i) => {
      const lines = nar ? wrap(f.name, barW, 7.2) : [f.name];
      const t = txt(heads, bx(i), headY + 30 - (lines.length - 1) * 7, '', 'colhead');
      lines.forEach((s, k) => { const ts = el('tspan', { x: bx(i), dy: k ? 14 : 0 }, t); ts.textContent = s; });
      if (!nar) txt(heads, bx(i), headY + 50, f.idea.trend, 'small');
    });
    const scores = layer('scores', '4');
    const numbers = layer('numbers', '5');
    const maxRev = Math.max(1, ...F.flatMap(f => f.fy ? f.fy.revenue : [0]));
    const growers = [];
    const body0 = headY + (nar ? 62 : 78);
    F.forEach((f, i) => {
      const x0 = bx(i); let y = body0;
      const rowH = nar ? Math.min(78, (R.y + R.h - body0) / 2) : 96, bh = nar ? 9 : 13, gap = nar ? 14 : 20;
      [['Team', f.rt, false], ['KI', f.rk, true]].forEach(([who, r, filled]) => {
        if (!r) return;
        txt(scores, x0, y, who, 'who');
        txt(scores, x0 + barW, y, (nar ? '' : 'Rendite ') + fmt(r.IR), 'ir' + (r.IR >= 1 ? ' ok' : ' low'), 'end');
        [['Nutzen', r.IN, 'gain'], ['Aufwand', r.IA, 'cost']].forEach(([lbl, v, cls], k) => {
          const yy = y + 9 + k * gap, full = (nar ? barW : barW * .72) * clamp(v / 5);
          el('rect', { x: x0, y: yy, width: nar ? barW : barW * .72, height: bh, rx: 3, class: 'track' }, scores);
          const b = el('rect', { x: x0, y: yy, width: full, height: bh, rx: 3, class: 'bar ' + cls + (filled ? '' : ' hollow') }, scores);
          growers.push({ node: b, phase: 4, kind: 'w', full });
          if (!nar) txt(scores, x0 + barW * .72 + 6, yy + 10, `${lbl} ${fmt(v)}`, 'barlbl');
        });
        y += rowH;
      });
      if (f.fy) {
        const top = body0, base = R.y + R.h - (nar ? 34 : 40), hMax = base - top - 14, cw = barW / 5;
        f.fy.revenue.forEach((v, k) => {
          const hgt = hMax * v / maxRev;
          el('line', { x1: x0 + k * cw + 2, y1: base, x2: x0 + (k + 1) * cw - 2, y2: base, class: 'baseline' }, numbers);
          const b = el('rect', { x: x0 + k * cw + 3, y: base - hgt, width: cw - 6, height: hgt, rx: 2, class: 'rev' }, numbers);
          growers.push({ node: b, phase: 5, base, kind: 'h', full: hgt, delay: k * .08 });
          if (!nar || k % 2 === 0) txt(numbers, x0 + (k + .5) * cw, base + 14, 'J' + (k + 1), 'tick', 'middle');
        });
        txt(numbers, x0, top - 6, nar ? fmt(f.fy.R / 1e6, 1) + ' Mio' : mio(f.fy.R) + ' Umsatz', 'who');
        txt(numbers, x0, base + (nar ? 30 : 34), nar ? pct(f.fy.pShare) : 'Gewinnanteil ' + pct(f.fy.pShare) + ' → ' + f.fy.pRating + '/5', 'small');
      }
    });

    /* Portfolio (Nutzen →, Aufwand ↓) */
    const pf = layer('portfolio', '6');
    const px = v => R.x + clamp((v - 1) / 3.5) * R.w, py = v => R.y + clamp((v - 1) / 3.5) * R.h;
    const edges = [1, 2, 3, 4.5];
    const zoneBoxes = [];
    for (let ca = 1; ca <= 3; ca++) for (let cn = 1; cn <= 3; cn++) {
      const [lbl, col] = PF_LABELS[ca][cn];
      const x = px(edges[cn - 1]), y = py(edges[ca - 1]), w = px(edges[cn]) - x;
      el('rect', { x, y, width: w, height: py(edges[ca]) - y, class: 'zone z-' + col }, pf);
      if (nar) continue;
      const t = txt(pf, x + 8, y + 16, '', 'zone-lbl'); let line = '', lines = [];
      lbl.split(' ').forEach(word => { if ((line + ' ' + word).trim().length * 5.9 > w - 14 && line) { lines.push(line); line = word; } else line = (line + ' ' + word).trim(); });
      lines.push(line);
      lines.forEach((s, k) => { const ts = el('tspan', { x: x + 8, dy: k ? 13 : 0 }, t); ts.textContent = s; });
      zoneBoxes.push({ x0: x + 6, x1: x + 8 + Math.max(...lines.map(s => s.length)) * 5.9, y0: y + 4, y1: y + 20 + (lines.length - 1) * 13 });
    }
    txt(pf, R.x + R.w, R.y + R.h + 22, 'Nutzen/Chancen →', 'axis', 'end');
    txt(pf, R.x - 10, R.y - 10, '↓ Aufwand/Risiko', 'axis');
    const pfPts = layer('pfpts', '6');
    F.forEach(f => {
      if (f.rt && f.rk) el('line', { x1: px(f.rt.IN), y1: py(f.rt.IA), x2: px(f.rk.IN), y2: py(f.rk.IA), class: 'pair' }, pfPts);
      if (f.rt) el('circle', { cx: px(f.rt.IN), cy: py(f.rt.IA), r: nar ? 6 : 8, class: 'pt-team' }, pfPts);
    });

    /* Ranking */
    const rk = layer('ranking', '7');
    const rowH = Math.min(nar ? 70 : 96, R.h / (F.length + .6)), maxIR = Math.max(2, ...M.ranking.map(f => f.mean));
    const rkX = R.x + (nar ? 46 : 74), rkW = R.w - (nar ? 96 : 130);
    M.ranking.forEach((f, i) => {
      const y = R.y + 20 + i * rowH;
      txt(rk, R.x, y + 34, String(i + 1), 'rank', 'start');
      txt(rk, rkX, y + 20, f.name, 'colhead');
      el('rect', { x: rkX, y: y + 30, width: rkW, height: 10, rx: 5, class: 'track' }, rk);
      const b = el('rect', { x: rkX, y: y + 30, width: rkW * f.mean / maxIR, height: 10, rx: 5, class: 'bar mean' + (i ? '' : ' best') }, rk);
      growers.push({ node: b, phase: 7, kind: 'w', full: rkW * f.mean / maxIR, delay: i * .1 });
      txt(rk, rkX + rkW + 8, y + 40, fmt(f.mean), 'ir ok');
      el('line', { x1: rkX + rkW / maxIR, y1: y + 24, x2: rkX + rkW / maxIR, y2: y + 46, class: 'one' }, rk);
    });
    if (M.ranking.length) txt(rk, rkX + rkW / maxIR, R.y + 20 + M.ranking.length * rowH, 'Rendite 1', 'small', 'middle');

    /* Ideenpunkte – dieselben zwölf Punkte durch alle Kapitel */
    const nodesLayer = el('g', { class: 'sc-nodes' }, svg);
    const dup = {};
    const nodes = IDEAS.map((idea, i) => {
      const gN = el('g', { class: 'node' + (idea.c.includes('WOW') ? ' fin' : '') }, nodesLayer);
      const halo = el('circle', { r: 14, class: 'halo' }, gN);
      const c = el('circle', { r: 6, class: 'core' }, gN);
      const label = txt(gN, 12, 4, shortName(idea.name), 'nlabel');
      const m = avg(idea.m), o = avg(idea.o), key = m + ':' + o; dup[key] = (dup[key] || 0) + 1;
      const k = dup[key] - 1, ddy = [0, 15, -15, 30][k] || 0, ddx = k ? 6 : 0;
      const ti = TRENDS.indexOf(idea.trend), tp = trendPos[ti];
      const sib = IDEAS.filter(x => x.trend === idea.trend), si = sib.indexOf(idea);
      const sa = tp.a + (si - (sib.length - 1) / 2) * (nar ? .34 : .26);
      const ix = cx + rx * Math.cos(sa), iy = cy + ry * Math.sin(sa);
      el('line', { x1: tp.x, y1: tp.y, x2: ix, y2: iy, class: 'link' }, links);
      const fi = F.findIndex(f => f.idea.id === idea.id), f = F[fi], rr = fi >= 0 ? M.ranking.indexOf(f) : -1;
      const S = [];
      S[0] = { x: R.x - 30 + seeded(i + 3) * (R.w + 60), y: R.y + seeded(i + 51) * R.h, r: 2.4, o: .9, lo: 0, h: 0 };
      S[1] = { x: ix, y: iy, r: nar ? 4 : 5, o: 1, lo: 1, h: 0 };
      S[2] = { x: mx(m) + ddx, y: my(o) + ddy, r: nar ? 4.5 : 6, o: 1, lo: 1, h: fi >= 0 ? .6 : 0 };
      S[3] = fi >= 0 ? { x: bx(fi) + 7, y: headY + 6, r: nar ? 6 : 8, o: 1, lo: 0, h: 1 } : { ...S[2], r: 3, o: .16, lo: 0, h: 0 };
      S[4] = fi >= 0 ? { ...S[3], h: .4 } : { ...S[3], o: 0 };
      S[5] = { ...S[4] };
      S[6] = fi >= 0 && f.rk ? { x: px(f.rk.IN), y: py(f.rk.IA), r: nar ? 6 : 8, o: 1, lo: 1, h: .5 } : { ...S[4], o: 0 };
      S[7] = fi >= 0 ? { x: R.x + (nar ? 26 : 44), y: R.y + 20 + rr * rowH + 29, r: nar ? 6 : 8, o: 1, lo: 0, h: rr === 0 ? 1 : .15 } : { ...S[4], o: 0 };
      return { gN, c, halo, label, S, idea, text: shortName(idea.name) };
    });
    [[1, trendBoxes], [2, []], [6, zoneBoxes]].forEach(([k, obs]) => {
      const pts = nodes.map(N => ({ x: N.S[k].x, y: N.S[k].y, r: N.S[k].r + 2, label: N.text, N })).filter(p => p.N.S[k].lo > 0);
      placeLabels(pts, obs).forEach((pl, j) => { const s = pts[j].N.S[k]; s.side = pl.side; s.dy = pl.dy; s.lo = pl.show; });
    });

    function update(k, t) {
      const n = PHASES.length - 1, k2 = Math.min(k + 1, n), e = smooth(t);
      for (const name in g) {
        const ph = g[name].dataset.ph.split(',').map(Number);
        let o = (ph.includes(k) ? 1 - e : 0) + (ph.includes(k2) && k2 !== k ? e : 0);
        if (k === k2 && ph.includes(k)) o = 1;
        if (name === 'stars') o = lerp(k < 2 ? 1 : .35, k2 < 2 ? 1 : .35, e);
        g[name].style.opacity = o.toFixed(3);
        g[name].style.visibility = o < .01 ? 'hidden' : 'visible';
      }
      for (const N of nodes) {
        const a = N.S[k], b = N.S[k2], L = e < .5 ? a : b;
        const x = lerp(a.x, b.x, e), y = lerp(a.y, b.y, e), r = lerp(a.r, b.r, e);
        N.gN.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
        N.gN.style.opacity = lerp(a.o, b.o, e).toFixed(3);
        N.c.setAttribute('r', r.toFixed(2));
        N.halo.setAttribute('r', (r + 7).toFixed(1)); N.halo.style.opacity = (lerp(a.h, b.h, e) * .6).toFixed(3);
        // Beschriftung blendet zur Mitte des Übergangs um, damit sie nie zwischen zwei Positionen „hängt“
        const lo = e < .5 ? a.lo * (1 - e * 2) : b.lo * (e * 2 - 1);
        N.label.style.opacity = lo.toFixed(3);
        N.label.setAttribute('text-anchor', L.side === 'l' ? 'end' : 'start');
        N.label.setAttribute('x', ((L.side === 'l' ? -1 : 1) * (r + 6)).toFixed(1));
        N.label.setAttribute('y', (4 + (L.dy || 0)).toFixed(1));
      }
      for (const G of growers) {
        const p = k === G.phase ? 1 : k2 === G.phase ? e : 0;
        const q = clamp((p - (G.delay || 0)) / (1 - (G.delay || 0))), v = G.full * smooth(q);
        if (G.kind === 'w') G.node.setAttribute('width', v.toFixed(1));
        else { G.node.setAttribute('height', v.toFixed(1)); G.node.setAttribute('y', (G.base - v).toFixed(1)); }
      }
    }
    return { update };
  }

  /* ---------- Aufbau DOM ---------- */
  const scroller = $('#case-scroll'), stage = $('#case-stage'), svg = $('#case-svg'), steps = $('#case-steps'),
    rail = $('#case-rail'), staticBox = $('#case-static'), motionBtn = $('#case-motion');
  let M, CH, scene, layoutKey = '', progress = -1, raf = 0, active = -1;
  const pref = read(MOTION_KEY);
  let preferredReduced = pref === 'reduced' || (pref !== 'full' && media.matches);
  let reduced = preferredReduced || innerHeight < 560;

  const esc2 = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  function stepHTML(c, i) {
    return `<p class="case-eye">${esc2(c.eye)}</p><h2 class="case-title">${esc2(c.title)}</h2><p class="case-text">${esc2(c.text)}</p>` +
      (c.facts && c.facts.length ? `<ul class="case-facts">${c.facts.map(f => `<li>${esc2(f)}</li>`).join('')}</ul>` : '') +
      (c.cta ? `<div class="case-cta"><a class="case-btn primary" href="#spacex" data-case-go="top">Bewertungen im Detail</a><a class="case-btn" href="#idee" data-case-go="user">Eigene Idee prüfen</a><a class="case-btn" href="#dinner" data-case-go="dinner">RocketLight Dinner</a></div>` : '');
  }
  function layoutFor(box) {
    const W = Math.max(300, Math.round(box.clientWidth)), H = Math.max(260, Math.round(box.clientHeight));
    const narrow = box.classList.contains('case-mini') ? W < 700 : !(innerWidth >= 900 && innerWidth / innerHeight > 1.05);
    if (box.classList.contains('case-mini')) return { w: W, h: H, narrow, region: { x: narrow ? 40 : 80, y: 40, w: W - (narrow ? 60 : 160), h: H - 84 } };
    if (narrow) return { w: W, h: H, narrow, region: { x: 40, y: 28, w: W - 58, h: H - 62 } };
    const x0 = Math.max(W * .43, 450);
    return { w: W, h: H, narrow, region: { x: x0, y: 64, w: W - 96 - x0, h: H - 64 - 100 } };
  }
  function build() {
    M = model(); CH = chapters(M);
    steps.innerHTML = CH.map((c, i) => `<article class="case-step" data-step="${i}" aria-hidden="true" inert>${stepHTML(c, i)}</article>`).join('');
    rail.innerHTML = CH.map((c, i) => `<button type="button" data-case-jump="${i}" aria-label="Kapitel ${i + 1}: ${esc2(c.title)}"><span></span></button>`).join('');
    const keep = $('.case-tools', staticBox); if (keep) stage.appendChild(keep);
    staticBox.innerHTML = CH.map((c, i) => `<article class="case-chapter" id="case-${PHASES[i]}">${stepHTML(c, i)}${i ? '<svg class="case-mini" aria-hidden="true" focusable="false"></svg>' : ''}</article>`).join('');
    layoutKey = ''; progress = -1; active = -1; applyMode();
    if (reduced) $$('.case-mini', staticBox).forEach(s => { const i = PHASES.indexOf(s.closest('.case-chapter').id.slice(5)); makeScene(s, layoutFor(s), M).update(i, 0); });
    measure();
  }
  function applyMode() {
    story.classList.toggle('is-static', reduced);
    scroller.hidden = reduced; staticBox.hidden = !reduced;
    const tools = $('.case-tools', story); // Bewegungsschalter bleibt in beiden Ansichten erreichbar
    if (reduced) staticBox.prepend(tools); else stage.appendChild(tools);
    motionBtn.setAttribute('aria-pressed', String(preferredReduced));
    motionBtn.textContent = preferredReduced ? 'Bewegung zulassen ◑' : 'Bewegung reduzieren ◐';
  }
  let start = 0, range = 1;
  function measure() {
    if (reduced || story.hidden) return;
    const L = layoutFor(svg), key = L.w + 'x' + L.h + L.narrow;
    if (key !== layoutKey) { layoutKey = key; scene = makeScene(svg, L, M); progress = -1; }
    const hdr = document.querySelector('header.top');
    story.style.setProperty('--case-hdr', (hdr ? hdr.offsetHeight : 0) + 'px');
    start = scroller.getBoundingClientRect().top + scrollY - (hdr ? hdr.offsetHeight : 0);
    range = Math.max(1, scroller.offsetHeight - stage.offsetHeight);
    tick();
  }
  function tick() {
    raf = 0; if (reduced || !scene) return;
    const p = clamp((scrollY - start) / range);
    if (p === progress) return; progress = p;
    const n = PHASES.length - 1, pos = p * n, k = Math.min(Math.floor(pos), n), local = pos - k;
    const t = k >= n ? 0 : clamp((local - .5) / .5); // erst halten (Lesezeit), dann überblenden
    scene.update(k, t);
    const now = t > .5 ? Math.min(k + 1, n) : k;
    if (now !== active) {
      active = now;
      $$('.case-step', steps).forEach((s, i) => { const on = i === now; s.classList.toggle('is-active', on); s.toggleAttribute('inert', !on); s.setAttribute('aria-hidden', String(!on)); });
      $$('button', rail).forEach((b, i) => b.toggleAttribute('aria-current', i === now));
    }
    story.style.setProperty('--case-p', p.toFixed(4));
  }
  const onScroll = () => { if (!raf) raf = requestAnimationFrame(tick); };
  addEventListener('scroll', onScroll, { passive: true });
  let rT; addEventListener('resize', () => { clearTimeout(rT); rT = setTimeout(() => {
    const was = reduced; reduced = preferredReduced || innerHeight < 560;
    if (was !== reduced) build(); else measure(); }, 150); });
  rail.addEventListener('click', e => { const b = e.target.closest('[data-case-jump]'); if (!b) return;
    const i = +b.dataset.caseJump, n = PHASES.length - 1;
    scrollTo({ top: start + range * (i / n) + (i ? 2 : 0), behavior: preferredReduced ? 'instant' : 'smooth' }); });
  motionBtn.addEventListener('click', () => { preferredReduced = !preferredReduced; write(MOTION_KEY, preferredReduced ? 'reduced' : 'full');
    reduced = preferredReduced || innerHeight < 560; build(); });
  story.addEventListener('click', e => {
    if (e.target.closest('#case-skip')) { toTool('smooth'); return; }
    const a = e.target.closest('[data-case-go]'); if (!a) return;
    e.preventDefault();
    if (a.dataset.caseGo === 'top') go('top');
    else goCtx(a.dataset.caseGo);
  });
  /* Wenn die Arbeitsmappe im Rechner geändert wird, zieht die Erzählung beim Zurückscrollen nach. */
  let sig = '';
  const signature = () => { try { return JSON.stringify([root.spacex.list.map(a => [a.id, a.n, a.a, a.link, a.fy && a.fy.qty, a.fy && a.fy.price]), root.spacex.w, root.spacex.base]); } catch (_) { return ''; } };
  new IntersectionObserver(es => { if (es.some(x => x.isIntersecting)) { const s = signature(); if (s !== sig) { sig = s; build(); } } }).observe(story);
  sig = signature(); if (!story.hidden) build();
  window.caseStory = { refresh: build };
})();
