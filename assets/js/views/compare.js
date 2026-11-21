/**
 * Vergleichsansichten: „Meine Ideen“ (Ranking), „Portfolio & Netz“ und „Rendite & Bilanz“.
 *
 * Aufgabe:   Ranking nach Innovationsrendite; unvollständige Ideen stehen am Ende.
 * Benötigt:  core/*, store/state.js, ui/*, views/panels.js
 * Stellt bereit: irSort, ranked, vRanking, vPortfolio, vBars
 */

/**
 * Sortierung für das Ranking: vollständige Ideen zuerst, dann nach IR absteigend (∞ ganz oben).
 */
const irSort = (p, q) =>
  !!p.r.open - !!q.r.open || (q.r.IR === Infinity ? 1e9 : q.r.IR) - (p.r.IR === Infinity ? 1e9 : p.r.IR);

/**
 * Alle Bewertungen mit Ergebnis, sortiert für das Ranking.
 */
function ranked() {
  return state.list.map(a => ({ a, r: calc(a) })).sort(irSort);
}

/**
 * „Meine Ideen“: Kennzahlen, Arbeitsmappe, Ranking-Tabelle sowie Teilen und sichern.
 */
function vRanking() {
  const L = state.list;
  if (!L.length) return emptyMsg() + wbPanel() + sharePanel();
  const R = ranked(),
    best = R[0];
  const avgN = sum(R.map(o => o.r.IN)) / R.length,
    avgA = sum(R.map(o => o.r.IA)) / R.length;
  return `${wNotice()}
  <section class="tiles">
    <div class="tile"><span class="eyebrow">Höchste Rendite</span><span class="v acc">${f2(best.r.IR)}</span><span class="s">${esc(best.a.project)}</span></div>
    <div class="tile"><span class="eyebrow">Bewertungen</span><span class="v">${L.length}</span><span class="s">${esc(state.horizon)}</span></div>
    <div class="tile"><span class="eyebrow">Ø Nutzen</span><span class="v gain">${f2(avgN)}</span><span class="s">von 5</span></div>
    <div class="tile"><span class="eyebrow">Ø Aufwand</span><span class="v cost">${f2(avgA)}</span><span class="s">von 5</span></div>
  </section>
  ${wbPanel()}
  <section class="panel"><header><h2>Ranking nach Innovationsrendite</h2><span class="row"><span class="muted">Zeile anklicken für Details</span><button class="btn small" data-act="pdfall">Alle Ideen als PDF</button></span></header>
   <div class="tablewrap"><table><thead><tr><th>#</th><th>Idee</th><th class="r">Nutzen</th><th class="r">Aufwand</th><th class="r">Rendite</th><th>Portfolio</th></tr></thead><tbody>
   ${R.map(
     (
       o,
       i
     ) => `<tr class="clickable" data-open="${o.a.id}"><td class="num" style="font-size:1.3rem">${i + 1}</td><td><span class="row" style="flex-wrap:nowrap"><i class="dot" style="background:${colorOf(o.a)}"></i><span><b style="font-size:1.1rem">${esc(o.a.project)}</b>${o.a.assessor ? `<br><span class="muted">${esc(o.a.assessor)}</span>` : ''}</span></span></td>
   <td class="r num">${f2(o.r.IN)}</td><td class="r num">${f2(o.r.IA)}</td><td class="r">${irChip(o.r)}</td><td>${pfChip(o.r)}${o.r.open ? ` <span class="chip neutral" title="Offene Kriterien werden mit 0 gerechnet">unvollständig (${12 - o.r.open}/12)</span>` : ''}</td></tr>`
   ).join('')}
   </tbody></table></div></section>
  ${sharePanel()}`;
}

/**
 * „Portfolio & Netz“: alle Ideen im Portfolio und in der Netzgrafik.
 */
function vPortfolio() {
  const L = state.list;
  if (!L.length) return emptyMsg();
  return `<section class="panel"><header><h2>Aufwand/Nutzen-Portfolio</h2></header>${portfolio(L)}</section>
  <section class="panel"><header><h2>Netzgrafik</h2><span class="muted">Alle zwölf Einzelbewertungen, 0 bis 5</span></header><div class="chartbox">${radar(L)}</div>${legend(L)}</section>`;
}

/**
 * „Rendite & Bilanz“: Balkendiagramme aller Ideen.
 */
function vBars() {
  const L = state.list;
  if (!L.length) return emptyMsg();
  const R = ranked().map(o => o.a);
  return `<section class="panel"><header><h2>Rendite</h2><span class="muted">Nutzen ÷ Aufwand · gestrichelte Linie = 1</span></header>${barChart(R, { key: 'IR', ref: 1, title: 'Rendite je Bewertung' })}</section>
  <section class="panel"><header><h2>Bilanz</h2><span class="muted">Nutzen − Aufwand</span></header>${barChart(R, { key: 'bil', title: 'Bilanz je Bewertung' })}</section>`;
}
