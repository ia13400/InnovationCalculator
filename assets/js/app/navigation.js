/**
 * Navigation und Rendering: welche Ansicht wann gezeigt wird.
 *
 * Aufgabe:   VIEWS ordnet Schritte ihren Ansichtsfunktionen zu, STEPS legt die Reihenfolge der Schrittleiste fest,
 *            render() baut den Werkzeugbereich #view aus Intro, Schrittleiste, Ansicht und Blätter-Knöpfen neu auf.
 * Benötigt:  alle views/*, store/state.js, ui/components.js
 * Stellt bereit: VIEWS, STEPS, INTRO, toTool, subnav, pager, render, fillW, autoGrow, go, goCtx, wizSet
 */

/**
 * Schritt → Ansichtsfunktion des Rechners.
 */
const VIEWS = {
  wizard: vWizard,
  ranking: vRanking,
  portfolio: vPortfolio,
  bars: vBars,
  assess: vAssess,
  fy: vFY,
};

/**
 * Reihenfolge und Beschriftung der Schrittleiste: [Schlüssel, Gruppe, Titel].
 */
const STEPS = {
  user: [
    ['wizard', '1', 'Ideen-Check'],
    ['ranking', '2', 'Meine Ideen'],
    ['portfolio', '3', 'Portfolio & Netz'],
    ['bars', '4', 'Rendite & Bilanz'],
    ['assess', 'Extra', 'Feintuning'],
    ['fy', 'Extra', '5-Jahres-Kalkulation'],
  ],
};

/**
 * Überschrift und Einleitung je Schritt: [Gruppe, Titel, Text].
 */
const INTRO = {
  user: {
    wizard: null,
    ranking: [
      'Vergleich',
      'Meine Ideen im Ranking',
      'Alle Ideen, die du geprüft hast, sortiert nach Innovationsrendite. Unten kannst du die Ideen exportieren und importieren.',
    ],
    portfolio: [
      'Vergleich',
      'Wo landen deine Ideen?',
      'Das Aufwand/Nutzen-Portfolio zeigt auf einen Blick, welche Idee ein Quick win ist und welche du abbrechen solltest.',
    ],
    bars: [
      'Vergleich',
      'Rendite und Bilanz',
      'Rendite = Nutzen ÷ Aufwand. Über 1 ist die Idee „profitabel“.',
    ],
    assess: [
      'Extra',
      'Feintuning',
      'Alle zwölf Kriterien auf einer Seite: Punkte anpassen und Begründungen ergänzen. Darunter die Gewichtung der Kriterien.',
    ],
    fy: [
      'Extra',
      '5-Jahres-Kalkulation',
      'Lege die Kennzahlen deines Unternehmens fest und berechne Gewinn und Entwicklungskosten über fünf Jahre. Daraus ergeben sich zwei der zwölf Bewertungen automatisch.',
    ],
  },
};

/**
 * Scrollt an den Anfang des Werkzeugbereichs (nicht an den Seitenanfang).
 */
function toTool(behavior) {
  const w = document.getElementById('werkzeug');
  if (!w) {
    window.scrollTo(0, 0);
    return;
  }
  const hd = document.querySelector('header.top');
  window.scrollTo({
    top: Math.max(0, w.getBoundingClientRect().top + scrollY - (hd ? hd.offsetHeight : 0)),
    behavior: behavior || 'instant',
  });
}

/**
 * Schrittleiste oben im Werkzeug.
 */
function subnav() {
  const L = STEPS[ui.ctx],
    btn = ([k, n, t]) =>
      `<button data-sub="${k}" ${ui.sub[ui.ctx] === k ? 'aria-current="step"' : ''}><span class="n">${n}</span><span class="t">${esc(t)}</span></button>`;
  if (!L.some(x => x[3])) return `<nav class="subnav" aria-label="Schritte">${L.map(btn).join('')}</nav>`;
  const G = [];
  L.forEach(x => {
    if (!G.length || G[G.length - 1].g !== x[3]) G.push({ g: x[3], items: [] });
    G[G.length - 1].items.push(x);
  });
  return `<nav class="subnav grouped" aria-label="Schritte">${G.map(o => `<div class="sg"><span class="sgl">${esc(o.g)}</span><div class="sgb">${o.items.map(btn).join('')}</div></div>`).join('')}</nav>`;
}

/**
 * Knöpfe „Zurück“/„Weiter“ am Ende eines Schritts.
 */
function pager() {
  const L = STEPS[ui.ctx],
    i = L.findIndex(x => x[0] === ui.sub[ui.ctx]);
  const p = L[i - 1],
    n = L[i + 1];
  return `<nav class="pager">${p ? `<button data-sub="${p[0]}"><span class="n">← ${esc(p[1])}</span><span class="t">${esc(p[2])}</span></button>` : ''}${n ? `<button class="next" data-sub="${n[0]}"><span class="n">${esc(n[1])} →</span><span class="t">${esc(n[2])}</span></button>` : ''}</nav>`;
}

/**
 * Baut den Werkzeugbereich neu auf und füllt dynamische Felder.
 * @param {boolean} keepScroll Scrollposition beibehalten (bei Änderungen innerhalb einer Ansicht)
 */
function render(keepScroll) {
  document
    .querySelectorAll('#tabs button')
    .forEach(b => b.setAttribute('aria-selected', b.dataset.ctx === ui.ctx));
  const y = window.scrollY;
  let html;
  if (ui.ctx === 'method') {
    html = vMethod();
  } else {
    if (!STEPS[ui.ctx].some(x => x[0] === ui.sub[ui.ctx])) ui.sub[ui.ctx] = STEPS[ui.ctx][0][0];
    const sub = ui.sub[ui.ctx];
    const it = INTRO[ui.ctx][sub];
    const intro = x =>
      x
        ? `<section class="intro"><div class="eyebrow">${esc(x[0])}</div><h2 style="font-size:clamp(2.2rem,5vw,3.4rem)">${esc(x[1])}</h2><p>${esc(x[2])}</p></section>`
        : '';
    html =
      subnav() + intro(it) + VIEWS[sub]() + (sub === 'wizard' && ui.wiz > 0 && ui.wiz < 13 ? '' : pager());
  }
  document.getElementById('view').innerHTML = html;
  const sub = ui.sub[ui.ctx];
  if (ui.ctx !== 'method' && sub === 'fy') fillFY();
  if (ui.ctx !== 'method' && sub === 'assess') fillW();
  document.querySelectorAll('textarea.in').forEach(autoGrow);
  if (keepScroll) window.scrollTo(0, y);
  save();
}

/**
 * Aktualisiert die Summen der Gewichte (100 %-Prüfung) während der Eingabe.
 */
function fillW() {
  ['n', 'a'].forEach(k => {
    const s = sum(state.w[k]);
    document.querySelectorAll(`[data-out="wsum-${k}"]`).forEach(e => {
      e.textContent = s + ' %';
      e.style.color = s === 100 ? 'var(--gain)' : 'var(--bad)';
    });
  });
}

/**
 * Passt die Höhe eines Textfeldes an seinen Inhalt an.
 */
function autoGrow(t) {
  t.style.height = 'auto';
  t.style.height = Math.min(t.scrollHeight + 2, 320) + 'px';
}

/**
 * Wechselt zu einem Schritt im aktuellen Reiter.
 */
function go(sub) {
  ui.sub[ui.ctx] = sub;
  ui.confirm = null;
  render();
  toTool();
}

/**
 * Wechselt den Reiter (Rechner oder Methode) und aktualisiert den Direktlink.
 */
function goCtx(c) {
  useCtx(c);
  ui.confirm = null;
  try {
    history.replaceState(null, '', '#' + { user: 'idee', method: 'methode' }[c]);
  } catch (e) {}
  render();
  toTool();
}

/**
 * Setzt den Schritt im Ideen-Check (0–13) und zeigt ihn an.
 */
function wizSet(n) {
  ui.wiz = Math.max(0, Math.min(13, n));
  render();
  toTool();
}
