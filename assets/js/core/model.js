/**
 * Rechenlogik der Innovationsrendite (reine Funktionen, keine Darstellung).
 *
 * Aufgabe:   Entspricht den Formeln des Excel-Werkzeugs „Inno-Rendite-Kalkulator“: gewichtete Bewertung, IN, IA,
 *            Innovationsrendite IR = IN ÷ IA, Bilanz, Kategorien, Portfolio-Feld sowie die 5-Jahres-Kalkulation.
 * Benötigt:  core/criteria.js (PF_LABELS); liest die Gewichte und Bezugsgrößen aus `state` (store/state.js)
 * Stellt bereit: sum, cat, catName, profitRating, costRating, calcFY, effScores, calc
 */

/**
 * Summe eines Arrays; leere oder ungültige Werte zählen als 0.
 */
const sum = a => a.reduce((x, y) => x + (+y || 0), 0);

/**
 * Kategorie eines Summenwerts (IN oder IA): 1 niedrig (< 2), 2 mittel (2 bis < 3), 3 hoch (≥ 3). Wie Excel: WENN(x>=3;3;WENN(x>=2;2;1)).
 */
function cat(v) {
  return v >= 3 ? 3 : v >= 2 ? 2 : 1;
}

/**
 * Name einer Kategorie (1–3) für die Anzeige.
 */
function catName(c) {
  return ['', 'niedrig', 'mittel', 'hoch'][c];
}

/**
 * Punkte für „Wirtschaftlicher Nutzen“ aus dem Gewinnanteil (Skala nach Hube): 0 kein Gewinn · 1 ≤ 3 % · 2 ≤ 5 % · 3 ≤ 20 % · 4 ≤ 30 % · 5 > 30 %.
 * @param {number} profit Gewinn der Idee über 5 Jahre
 * @param {number} share  Gewinnanteil am Unternehmensgewinn (0,05 = 5 %)
 */
function profitRating(profit, share) {
  if (profit <= 0) return 0;
  if (share <= 0.03) return 1;
  if (share <= 0.05) return 2;
  if (share <= 0.2) return 3;
  if (share <= 0.3) return 4;
  return 5;
}

/**
 * Punkte für „Investitionsaufwand F&E“ aus dem Kostenanteil: 0 keine Kosten · 1 ≤ 10 % · 2 ≤ 20 % · 3 ≤ 50 % · 4 ≤ 100 % · 5 > 100 %.
 * @param {number} cost  F&E-Kosten der Idee über 5 Jahre
 * @param {number} share Kostenanteil am F&E-Budget (1 = 100 %)
 */
function costRating(cost, share) {
  if (cost <= 0) return 0;
  if (share <= 0.1) return 1;
  if (share <= 0.2) return 2;
  if (share <= 0.5) return 3;
  if (share <= 1) return 4;
  return 5;
}

/**
 * 5-Jahres-Kalkulation einer Idee.
 * Umsatz = Menge × Preis; Gewinn = Umsatz × Umsatzrendite des Unternehmens (Gewinn ÷ Umsatz);
 * F&E-Kosten = Σ (FTE × Kosten je FTE) + Sachkosten; Anteile beziehen sich auf Gewinn bzw. F&E-Budget des letzten Jahres (in Mio).
 * pRating/cRating sind null, wenn die Bezugsgröße ≤ 0 ist (Anteil nicht berechenbar).
 * @param {object} fy   Eingaben der Kalkulation (Mengen, Preise, Personal, Sachkosten)
 * @param {object} base Bezugsgrößen des Unternehmens (revenue, profit, rnd in Mio)
 * @returns {object} Zeitreihen je Jahr, Summen R/P/C, Anteile und Punkte
 */
function calcFY(fy, base) {
  const margin = base.revenue > 0 ? base.profit / base.revenue : 0;
  const revenue = fy.qty.map((q, i) => (+q || 0) * (+fy.price[i] || 0));
  const profit = revenue.map(r => r * margin);
  const staffCost = [0, 1, 2, 3, 4].map(i => sum(fy.staff.map(s => (+s.fte[i] || 0) * (+s.cost || 0))));
  const rnd = staffCost.map((s, i) => s + (+fy.material[i] || 0));
  const P = sum(profit),
    C = sum(rnd);
  const pShare = base.profit > 0 ? P / (base.profit * 1e6) : 0,
    cShare = base.rnd > 0 ? C / (base.rnd * 1e6) : 0;
  return {
    margin,
    revenue,
    profit,
    staffCost,
    rnd,
    R: sum(revenue),
    P,
    C,
    pShare,
    cShare,
    pRating: base.profit > 0 ? profitRating(P, pShare) : null,
    cRating: base.rnd > 0 ? costRating(C, cShare) : null,
    qtySum: sum(fy.qty.map(Number)),
  };
}

/**
 * Wirksame Punkte einer Bewertung: Ist die 5-Jahres-Kalkulation verknüpft, ersetzt sie die Punkte
 * der beiden quantitativen Kriterien (jeweils Index 0); sonst gelten die eingegebenen Punkte.
 */
function effScores(a) {
  const n = a.n.slice(),
    x = a.a.slice();
  let fy = null;
  if (a.fy) {
    fy = calcFY(a.fy, state.base);
    if (a.link) {
      if (fy.pRating !== null) n[0] = fy.pRating;
      if (fy.cRating !== null) x[0] = fy.cRating;
    }
  }
  return { n, x, fy };
}

/**
 * Ergebnis einer Bewertung nach Hube.
 * IN = Σ (Punkte × Gewicht) ÷ 100 (Nutzen), IA entsprechend (Aufwand), IR = IN ÷ IA, Bilanz = IN − IA,
 * Mittelwerte = IN ÷ 6 bzw. IA ÷ 6, Kategorien und Portfolio-Feld. `open` zählt unbeantwortete Kriterien.
 * @param {object} a Bewertung (n, a = Punkte je Block; link/fy = optionale 5-Jahres-Kalkulation)
 */
function calc(a) {
  const { n, x, fy } = effScores(a);
  /* Gewichtete Bewertung = Punkte × Gewicht ÷ 100 (wie im Excel-Werkzeug). Summiert wird über Punkte × Gewicht
     und erst danach durch 100 geteilt und auf 9 Nachkommastellen gerundet: So ergibt z. B. 2,00 exakt 2 und nicht
     1,9999999999999998, und die Kategoriegrenzen 2 und 3 werden nicht durch Rundungsfehler verfehlt. */
  const r9 = v => Math.round(v * 1e9) / 1e9;
  const pn = n.map((s, i) => (+s || 0) * (+state.w.n[i] || 0)),
    pa = x.map((s, i) => (+s || 0) * (+state.w.a[i] || 0));
  const wn = pn.map(v => r9(v / 100)),
    wa = pa.map(v => r9(v / 100));
  const IN = r9(sum(pn) / 100),
    IA = r9(sum(pa) / 100);
  const open = [...n, ...x].filter(v => v === null || v === undefined || v === '').length;
  return {
    n,
    x,
    fy,
    wn,
    wa,
    IN,
    IA,
    IR: IA > 0 ? IN / IA : Infinity,
    bil: r9(IN - IA),
    open,
    mN: r9(IN / 6),
    mA: r9(IA / 6),
    cN: cat(IN),
    cA: cat(IA),
    pf: PF_LABELS[cat(IA)][cat(IN)],
  };
}
