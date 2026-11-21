/**
 * Rechenweg mit den tatsächlichen Zahlen einer Bewertung („So wurde gerechnet“).
 *
 * Aufgabe:   Zeigt die Formeln nach Prof. Hube mit eingesetzten Werten. Genutzt auf der Ergebnisseite, im Feintuning,
 *            in der 5-Jahres-Kalkulation und im PDF-Bericht, damit alle Stellen dieselbe Herleitung zeigen.
 * Benötigt:  core/model.js, core/format.js, store/state.js
 * Stellt bereit: quantWhy, rechenweg, fyRechenweg
 */

/**
 * Kurze Begründung der berechneten Punkte für ein quantitatives Kriterium.
 * @param {object} a Bewertung mit 5-Jahres-Kalkulation
 * @param {'gain'|'cost'} kind Wirtschaftlicher Nutzen oder F&E-Aufwand
 */
function quantWhy(a, kind) {
  const c = calcFY(a.fy, state.base),
    cu = esc(state.base.currency);
  if (kind === 'gain' && c.pRating === null)
    return `Gewinnanteil nicht berechenbar: Der Unternehmensgewinn muss größer als 0 sein. Es gilt die manuell vergebene Punktzahl.`;
  if (kind !== 'gain' && c.cRating === null)
    return `Kostenanteil nicht berechenbar: Das F&E-Budget des Unternehmens muss größer als 0 sein. Es gilt die manuell vergebene Punktzahl.`;
  return kind === 'gain'
    ? `Quantitativ: 5-Jahres-Gewinn ${fMio(c.P)} ${cu} = ${fPct(c.pShare)} des Unternehmensgewinns (${fInt(state.base.profit)} Mio ${cu}) → Bewertung ${c.pRating}.`
    : `Quantitativ: kumulierte F&E-Kosten ${fMio(c.C)} ${cu} = ${fPct(c.cShare)} des F&E-Budgets (${fInt(state.base.rnd)} Mio ${cu}) → Bewertung ${c.cRating}.`;
}

/**
 * „So wurde gerechnet“: alle Formeln einer Bewertung mit eingesetzten Zahlen, plus Hinweise
 * bei Gewichten ≠ 100 % oder offenen Kriterien.
 */
function rechenweg(a) {
  const r = calc(a),
    w = state.w,
    cu = esc(state.base.currency);
  const terms = (sc, ws) =>
    sc.map((v, i) => `${v === null || v === undefined ? 0 : v}×${fN(ws[i])}`).join(' + ');
  const sN = sum(w.n),
    sA = sum(w.a);
  const row = (l, f, note = '') =>
    `<div class="fx-row"><span class="fx-l">${l}</span><span class="fx-f">${f}</span>${note ? `<span class="fx-n">${note}</span>` : ''}</div>`;
  let h = '';
  h += row(
    'Gewichtete Bewertung',
    'Punkte × Gewicht ÷ 100',
    'je Kriterium, Skala 0–5, Gewichte je Block 100 %'
  );
  h += row('Nutzen IN', `Σ (Punkte × Gewicht) ÷ 100 = (${terms(r.n, w.n)}) ÷ 100 = <b>${f2(r.IN)}</b>`);
  h += row('Aufwand IA', `Σ (Punkte × Gewicht) ÷ 100 = (${terms(r.x, w.a)}) ÷ 100 = <b>${f2(r.IA)}</b>`);
  h += row(
    'Innovationsrendite IR',
    r.IA > 0 ? `IN ÷ IA = ${f2(r.IN)} ÷ ${f2(r.IA)} = <b>${f2(r.IR)}</b>` : `IN ÷ IA mit IA = 0 → <b>∞</b>`,
    r.IR >= 1 ? 'über 1: „profitabel“' : 'unter 1: nicht „profitabel“'
  );
  h += row('Bilanz', `IN − IA = ${f2(r.IN)} − ${f2(r.IA)} = <b>${r.bil >= 0 ? '+' : ''}${f2(r.bil)}</b>`);
  h += row(
    'Mittelwerte',
    `IN ÷ 6 = ${f2(r.mN)} · IA ÷ 6 = ${f2(r.mA)}`,
    'Durchschnitt der gewichteten Bewertungen'
  );
  h += row(
    'Portfolio-Feld',
    `Nutzen ${f2(r.IN)} → ${catName(r.cN)} · Aufwand ${f2(r.IA)} → ${catName(r.cA)} → <b>${esc(r.pf[0])}</b>`,
    'Kategorien: unter 2 niedrig · 2 bis unter 3 mittel · ab 3 hoch'
  );
  if (a.fy && a.link) {
    const c = calcFY(a.fy, state.base);
    h += row(
      'Wirtschaftlicher Nutzen',
      c.pRating === null
        ? 'nicht berechenbar (Unternehmensgewinn ≤ 0), manuelle Punktzahl'
        : `Gewinn 5 Jahre ÷ Unternehmensgewinn = ${fInt(c.P)} ÷ ${fInt(state.base.profit * 1e6)} ${cu} = ${fPct(c.pShare)} → <b>${c.pRating}</b>`,
      'Skala: 0 kein Gewinn · 1 ≤ 3 % · 2 ≤ 5 % · 3 ≤ 20 % · 4 ≤ 30 % · 5 > 30 %'
    );
    h += row(
      'Investitionsaufwand F&amp;E',
      c.cRating === null
        ? 'nicht berechenbar (F&amp;E-Budget ≤ 0), manuelle Punktzahl'
        : `F&amp;E-Kosten 5 Jahre ÷ F&amp;E-Budget = ${fInt(c.C)} ÷ ${fInt(state.base.rnd * 1e6)} ${cu} = ${fPct(c.cShare)} → <b>${c.cRating}</b>`,
      'Skala: 0 keine Kosten · 1 ≤ 10 % · 2 ≤ 20 % · 3 ≤ 50 % · 4 ≤ 100 % · 5 > 100 %'
    );
  }
  const warn = [
    sN !== 100 || sA !== 100
      ? `Die Gewichte ergeben nicht je 100 % (Nutzen ${fN(sN)} %, Aufwand ${fN(sA)} %).`
      : '',
    r.open ? `${r.open} von 12 Kriterien sind noch offen und werden mit 0 gerechnet.` : '',
  ].filter(Boolean);
  return `<div class="fx">${h}</div>${warn.map(t => `<div class="notice" style="margin-top:12px">${esc(t)}</div>`).join('')}`;
}

/**
 * Rechenweg der 5-Jahres-Kalkulation (Umsatzrendite, Umsatz, Gewinn, Gewinnanteil, F&E-Kosten, Kostenanteil).
 */
function fyRechenweg(a) {
  const c = calcFY(a.fy, state.base),
    b = state.base,
    cu = esc(b.currency);
  const row = (l, f, note = '') =>
    `<div class="fx-row"><span class="fx-l">${l}</span><span class="fx-f">${f}</span>${note ? `<span class="fx-n">${note}</span>` : ''}</div>`;
  return `<div class="fx">
   ${row('Umsatzrendite', `Gewinn ÷ Umsatz des Unternehmens = ${fN(b.profit)} ÷ ${fN(b.revenue)} Mio ${cu} = <b>${fPct(c.margin)}</b>`)}
   ${row('Umsatz', `Menge × Preis je Jahr; Summe 5 Jahre = <b>${fInt(c.R)} ${cu}</b>`)}
   ${row('Gewinn', `Umsatz × Umsatzrendite je Jahr; Summe 5 Jahre = ${fInt(c.R)} × ${fPct(c.margin)} = <b>${fInt(c.P)} ${cu}</b>`)}
   ${row('Gewinnanteil', c.pRating === null ? 'nicht berechenbar: Unternehmensgewinn muss größer als 0 sein' : `Gewinn 5 Jahre ÷ Unternehmensgewinn = ${fInt(c.P)} ÷ ${fInt(b.profit * 1e6)} ${cu} = ${fPct(c.pShare)} → <b>Bewertung ${c.pRating}</b>`, 'Skala: 0 kein Gewinn · 1 ≤ 3 % · 2 ≤ 5 % · 3 ≤ 20 % · 4 ≤ 30 % · 5 > 30 %')}
   ${row('F&amp;E-Kosten', `Σ (FTE × Jahreskosten je FTE) + Sachkosten je Jahr; Summe 5 Jahre = <b>${fInt(c.C)} ${cu}</b>`)}
   ${row('Kostenanteil', c.cRating === null ? 'nicht berechenbar: F&amp;E-Budget muss größer als 0 sein' : `F&amp;E-Kosten 5 Jahre ÷ F&amp;E-Budget = ${fInt(c.C)} ÷ ${fInt(b.rnd * 1e6)} ${cu} = ${fPct(c.cShare)} → <b>Bewertung ${c.cRating}</b>`, 'Skala: 0 keine Kosten · 1 ≤ 10 % · 2 ≤ 20 % · 3 ≤ 50 % · 4 ≤ 100 % · 5 > 100 %')}
  </div>`;
}
