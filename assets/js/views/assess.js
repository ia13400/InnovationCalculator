/**
 * Ansicht „Feintuning“: alle zwölf Kriterien einer Idee auf einer Seite.
 *
 * Aufgabe:   Punkte, Begründungen, Name, Verknüpfung mit der 5-Jahres-Kalkulation, Ergebnis-Karte, Rechenweg und Gewichtung.
 * Benötigt:  core/*, store/state.js, ui/*, views/panels.js (wPanel)
 * Stellt bereit: critBlock, resultCard, vAssess
 */

/**
 * Block mit sechs Kriterien im Feintuning (Punkte-Knöpfe, Gewicht, Begründung).
 */
function critBlock(list, arr, scoresEff, kind, a) {
  return list
    .map((c, i) => {
      const locked = c.quant && a.link && a.fy;
      const val = scoresEff[i];
      const w = state.w[kind === 'gain' ? 'n' : 'a'][i];
      return `<div class="crit"><div><div class="name">${esc(c.t)}</div>${locked ? `<div class="linked">Automatisch aus der 5-Jahres-Kalkulation</div>` : ''}</div>
     <div class="row" style="justify-content:flex-end"><div class="seg ${kind}" role="group" aria-label="${esc(c.t)}">${[0, 1, 2, 3, 4, 5].map(s => `<button aria-pressed="${val === s}" ${locked ? 'disabled' : ''} data-score="${kind}:${i}:${s}">${s}</button>`).join('')}</div>
     <span class="meta">× ${w} % = <b data-out="w-${kind}-${i}">${f2(((+val || 0) * w) / 100)}</b></span></div>
     <div class="desc">${esc(c.d)}</div>
     ${locked ? `<div class="why muted">${quantWhy(a, kind)}</div>` : ''}
     <div class="why"><textarea class="in" rows="1" placeholder="${locked ? 'Ergänzende Begründung (optional)' : 'Begründung'}" data-why="${c.k}" aria-label="Begründung ${esc(c.t)}">${esc(a.why[c.k] || '')}</textarea></div></div>`;
    })
    .join('');
}

/**
 * Ergebnis-Karte neben den Kriterien im Feintuning.
 */
function resultCard(a) {
  const r = calc(a);
  const maxv = 5;
  const vcls = { g: 'ok', y: 'mid', r: 'bad' }[r.pf[1]];
  return `<div class="panel result-card sticky">
   <div><div class="eyebrow">Innovationsrendite</div><div class="giant ${r.IR >= 1.5 ? 'ok' : r.IR >= 1 ? 'mid' : 'bad'}" style="font-size:5rem">${f2(r.IR)}</div><div class="muted">${r.IR >= 1 ? '„profitabel“: Nutzen übersteigt Aufwand' : 'nicht „profitabel“: Aufwand übersteigt Nutzen'}</div></div>
   <div class="bar2"><div class="t"><span>Nutzen/Chancen IN</span><b class="num" style="color:var(--gain)">${f2(r.IN)}</b></div><div class="track"><div class="fill" style="width:${(r.IN / maxv) * 100}%;background:var(--gain)"></div></div></div>
   <div class="bar2"><div class="t"><span>Aufwand/Risiko IA</span><b class="num" style="color:var(--cost)">${f2(r.IA)}</b></div><div class="track"><div class="fill" style="width:${(r.IA / maxv) * 100}%;background:var(--cost)"></div></div></div>
   <table><tbody>
    <tr><td>Bilanz IN − IA</td><td class="r num">${r.bil >= 0 ? '+' : ''}${f2(r.bil)}</td></tr>
    <tr><td>Mittelwert Nutzen</td><td class="r num">${f2(r.mN)}</td></tr>
    <tr><td>Mittelwert Aufwand</td><td class="r num">${f2(r.mA)}</td></tr>
    <tr><td>Kategorie Nutzen / Aufwand</td><td class="r">${catName(r.cN)} / ${catName(r.cA)}</td></tr>
   </tbody></table>
   <div class="verdict chip ${vcls}" style="display:block;border-radius:var(--r);white-space:normal">Portfolio: ${esc(r.pf[0])}</div>
  </div>`;
}

/**
 * „Feintuning“ einer Idee.
 */
function vAssess() {
  const a = cur();
  if (!a) return `<section class="panel">${picker()}</section>` + wPanel();
  const r = calc(a);
  const conf =
    ui.confirm === 'del'
      ? `<span class="row"><span>Bewertung wirklich löschen?</span><button class="btn small danger" data-act="del-yes">Löschen</button><button class="btn small" data-act="del-no">Abbrechen</button></span>`
      : `<button class="btn small danger" data-act="del">Löschen</button>`;
  return `<section class="panel">${picker()}</section>
  <div class="layout-edit">
   <div style="display:grid;gap:24px;min-width:0">
    <section class="panel"><div class="fields">
      <label class="f">Projekt / Idee<input id="f-project" data-field="project" value="${esc(a.project)}"></label>
      <label class="f">${state.mode === 'Multibeurteilende' ? 'Beurteiler (Name, Funktion)' : 'Beurteilt von (optional)'}<input id="f-assessor" data-field="assessor" value="${esc(a.assessor)}"></label>
     </div>
     <div class="row" style="margin-top:14px;justify-content:space-between">
      <label class="row"><input type="checkbox" style="width:22px;height:22px" id="f-link" data-act="link" ${a.link && a.fy ? 'checked' : ''} ${a.fy ? '' : 'disabled'}> Wirtschaftlichen Nutzen und F&amp;E-Aufwand aus der 5-Jahres-Kalkulation übernehmen</label>
      <span class="row">${a.fy ? `<button class="btn small" data-tabgo="fy">5-Jahres-Kalkulation öffnen</button>` : `<button class="btn small" data-act="addfy">5-Jahres-Kalkulation anlegen</button>`}<button class="btn small" data-act="dup">Duplizieren</button>${conf}</span>
     </div></section>
    <section class="panel"><div class="block-title gain"><h3>Nutzen/Chancen</h3><span class="mono">Gewichte ${sum(state.w.n)} %</span></div>
     <p class="muted">Skala: 0 nicht vorhanden · 1 sehr gering … 5 sehr hoch</p>
     ${critBlock(N_CRIT, a.n, r.n, 'gain', a)}</section>
    <section class="panel"><div class="block-title cost"><h3>Aufwand/Risiko</h3><span class="mono">Gewichte ${sum(state.w.a)} %</span></div>
     <p class="muted">Skala: 0 nicht vorhanden · 1 sehr gering … 5 sehr hoch</p>
     ${critBlock(A_CRIT, a.a, r.x, 'cost', a)}</section>
   </div>
   <div id="resultSlot">${resultCard(a)}</div>
  </div>
  <section class="panel"><header><h2>So wurde gerechnet</h2><span class="muted">Formeln nach Prof. Hube mit diesen Zahlen</span></header>${rechenweg(a)}</section>
  ${wPanel()}`;
}
