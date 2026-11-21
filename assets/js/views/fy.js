/**
 * Ansicht „5-Jahres-Kalkulation“: Umsatz, Gewinn und F&E-Kosten über fünf Jahre.
 *
 * Aufgabe:   Ergibt die Punkte für „Wirtschaftlicher Nutzen“ und „Investitionsaufwand F&E“. fillFY() aktualisiert die
 *            berechneten Felder bei jeder Eingabe, ohne die Seite neu aufzubauen (Fokus bleibt im Eingabefeld).
 * Benötigt:  core/*, store/state.js, ui/*, views/panels.js (basePanel)
 * Stellt bereit: vFY, fillFY
 */

/**
 * „5-Jahres-Kalkulation“ der ausgewählten Idee (mit Bezugsgrößen des Unternehmens oben).
 */
function vFY() {
  const a = cur();
  if (!a) return basePanel() + emptyMsg();
  const pk = basePanel() + `<section class="panel">${picker(false)}</section>`;
  if (!a.fy)
    return (
      pk +
      `<section class="panel" style="display:grid;gap:16px"><h2>${esc(a.project)}</h2><p style="font-size:1.1rem;max-width:60ch">Für diese Idee gibt es noch keine 5-Jahres-Kalkulation. Sie berechnet „Wirtschaftlicher Nutzen“ und „Investitionsaufwand F&amp;E“ aus Umsatz, Gewinn und Entwicklungskosten statt aus dem Bauchgefühl.</p><div><button class="btn primary" data-act="addfy">5-Jahres-Kalkulation anlegen</button></div></section>`
    );
  const fy = a.fy,
    b = state.base,
    cu = esc(b.currency),
    yrs = [0, 1, 2, 3, 4];
  const numIn = (path, v, step = 'any') =>
    `<input class="in" type="number" step="${step}" data-fy="${path}" value="${v}" aria-label="${path}">`;
  return (
    pk +
    `
  <section class="tiles">
   <div class="tile"><span class="eyebrow">Umsatz 5 Jahre</span><span class="v" data-out="Rm"></span><span class="s">${cu}</span></div>
   <div class="tile"><span class="eyebrow">Gewinn 5 Jahre</span><span class="v gain" data-out="Pm"></span><span class="s">Umsatz × <span data-out="margin"></span> Umsatzrendite</span></div>
   <div class="tile"><span class="eyebrow">F&amp;E-Kosten 5 Jahre</span><span class="v cost" data-out="Cm"></span><span class="s">Personal + Sachkosten</span></div>
  </section>
  <div class="grid2">
   <section class="panel"><header><h2>Wirtschaftlicher Nutzen</h2><span class="giant ok" style="font-size:3.4rem" data-out="pRating"></span></header>
    <p>Gewinnanteil <b class="num" data-out="pShare"></b> = Gewinn über 5 Jahre ÷ Gewinn ${esc(b.company)} im letzten Jahr (${fInt(b.profit)} Mio ${cu})</p><div class="scale" data-out="pScale"></div></section>
   <section class="panel"><header><h2>Investitionsaufwand F&amp;E</h2><span class="giant" style="font-size:3.4rem;color:var(--cost)" data-out="cRating"></span></header>
    <p>Kostenanteil <b class="num" data-out="cShare"></b> = F&amp;E-Kosten über 5 Jahre ÷ F&amp;E-Budget ${esc(b.company)} (${fInt(b.rnd)} Mio ${cu})</p><div class="scale" data-out="cScale"></div></section>
  </div>
  <section class="panel"><header><h2>Rechenweg</h2><span class="muted">aktualisiert sich bei jeder Eingabe</span></header><div data-out="fyfx">${fyRechenweg(a)}</div></section>
  ${a.link ? '' : '<div class="notice">Die Übernahme in die Bewertung ist ausgeschaltet. Unter „Feintuning“ den Haken setzen.</div>'}
  <section class="panel"><header><h2>Gewinnrechnung</h2><span class="muted">Gewinn = Umsatz × Umsatzrendite</span></header>
   <div class="tablewrap"><table class="fy"><thead><tr><th>Jahr</th>${yrs.map(i => `<th class="r">${i + 1}</th>`).join('')}<th class="r">Summe</th></tr></thead><tbody>
    <tr><td><input class="in wide" data-fyt="unit" value="${esc(fy.unit)}" aria-label="Einheit Menge"></td>${yrs.map(i => `<td>${numIn('qty.' + i, fy.qty[i], '1')}</td>`).join('')}<td class="calc" data-out="qtySum"></td></tr>
    <tr><td><input class="in wide" data-fyt="priceUnit" value="${esc(fy.priceUnit)}" aria-label="Bezeichnung Preis"></td>${yrs.map(i => `<td>${numIn('price.' + i, fy.price[i])}</td>`).join('')}<td></td></tr>
    <tr><td>Umsatz (${cu})</td>${yrs.map(i => `<td class="calc" data-out="rev.${i}"></td>`).join('')}<td class="calc" data-out="R"></td></tr>
    <tr class="sum"><td>Gewinn (${cu})</td>${yrs.map(i => `<td class="calc" data-out="pro.${i}"></td>`).join('')}<td class="calc" data-out="P"></td></tr>
   </tbody></table></div>
  </section>
  <section class="panel"><header><h2>F&amp;E-Kosten</h2><span class="muted">Entwicklung und Kompetenzaufbau</span></header>
   <div class="tablewrap"><table class="fy"><thead><tr><th>Position (FTE je Jahr)</th>${yrs.map(i => `<th class="r">${i + 1}</th>`).join('')}<th class="r">${cu}/FTE</th><th></th></tr></thead><tbody>
    ${fy.staff.map((s, k) => `<tr><td><input class="in wide" data-fyt="staff.${k}.label" value="${esc(s.label)}" aria-label="Bezeichnung Personal"></td>${yrs.map(i => `<td>${numIn(`staff.${k}.fte.${i}`, s.fte[i])}</td>`).join('')}<td>${numIn(`staff.${k}.cost`, s.cost)}</td><td><button class="btn small danger" data-act="rmstaff" data-k="${k}" aria-label="Zeile entfernen">✕</button></td></tr>`).join('')}
    <tr><td colspan="8"><button class="btn small" data-act="addstaff">+ Personalposition</button></td></tr>
    <tr><td>Personalkosten (${cu})</td>${yrs.map(i => `<td class="calc" data-out="stc.${i}"></td>`).join('')}<td class="calc" data-out="STC"></td><td></td></tr>
    <tr><td>Sachkosten (${cu})</td>${yrs.map(i => `<td>${numIn('material.' + i, fy.material[i])}</td>`).join('')}<td class="calc" data-out="MAT"></td><td></td></tr>
    <tr class="sum"><td>Summe F&amp;E (${cu})</td>${yrs.map(i => `<td class="calc" data-out="rnd.${i}"></td>`).join('')}<td class="calc" data-out="C"></td><td></td></tr>
   </tbody></table></div>
  </section>
  <section class="panel notes"><header style="margin:0"><h2>Annahmen &amp; Begründungen</h2></header>
   <label class="f">Menge: ${esc(fy.unit)}<textarea class="in" rows="2" data-fyt="qtyNote">${esc(fy.qtyNote || '')}</textarea></label>
   <label class="f">Preis: ${esc(fy.priceUnit)}<textarea class="in" rows="2" data-fyt="priceNote">${esc(fy.priceNote || '')}</textarea></label>
   ${fy.staff.map((s, k) => `<label class="f">Personal: ${esc(s.label)}<textarea class="in" rows="1" data-fyt="staff.${k}.note">${esc(s.note || '')}</textarea></label>`).join('')}
   <label class="f">Sachkosten<textarea class="in" rows="2" data-fyt="materialNote">${esc(fy.materialNote || '')}</textarea></label>
  </section>
  <section class="panel"><header><h2>Quellen</h2><button class="btn small" data-act="addsrc">+ Quelle</button></header>
   <ol class="src">${(fy.sources || []).map((s, k) => `<li><span class="row" style="flex-wrap:nowrap;align-items:flex-start"><textarea class="in" rows="2" data-fyt="sources.${k}" aria-label="Quelle ${k + 1}">${esc(s)}</textarea><button class="btn small danger" data-act="rmsrc" data-k="${k}" aria-label="Quelle entfernen">✕</button></span></li>`).join('')}</ol>
  </section>`
  );
}

/**
 * Aktualisiert alle berechneten Felder der 5-Jahres-Kalkulation (data-out) ohne neues Rendering.
 */
function fillFY() {
  const a = cur();
  if (!a || !a.fy) return;
  const c = calcFY(a.fy, state.base);
  const set = (k, v) => document.querySelectorAll(`[data-out="${k}"]`).forEach(e => (e.innerHTML = v));
  set('margin', fPct(c.margin));
  set('qtySum', fInt(c.qtySum));
  c.revenue.forEach((v, i) => set('rev.' + i, fInt(v)));
  c.profit.forEach((v, i) => set('pro.' + i, fInt(v)));
  c.staffCost.forEach((v, i) => set('stc.' + i, fInt(v)));
  c.rnd.forEach((v, i) => set('rnd.' + i, fInt(v)));
  a.fy.staff.forEach((s, k) => set('fte.' + k, sum(s.fte).toLocaleString('de-DE')));
  set('R', fInt(c.R));
  set('Rm', fMio(c.R));
  set('Pm', fMio(c.P));
  set('Cm', fMio(c.C));
  set('P', fInt(c.P));
  set('STC', fInt(sum(c.staffCost)));
  set('MAT', fInt(sum(a.fy.material)));
  set('C', fInt(c.C));
  set('pShare', fPct(c.pShare));
  set('cShare', fPct(c.cShare));
  set('pRating', c.pRating ?? '–');
  set('cRating', c.cRating ?? '–');
  set('fyfx', fyRechenweg(a));
  const pl = ['0', '≤3 %', '≤5 %', '≤20 %', '≤30 %', '>30 %'],
    cl = ['0', '≤10 %', '≤20 %', '≤50 %', '≤100 %', '>100 %'];
  set(
    'pScale',
    pl.map((t, i) => `<span class="${i === c.pRating ? 'on' : ''}"><b>${i}</b><br>${t}</span>`).join('')
  );
  set(
    'cScale',
    cl.map((t, i) => `<span class="${i === c.cRating ? 'on' : ''}"><b>${i}</b><br>${t}</span>`).join('')
  );
}
