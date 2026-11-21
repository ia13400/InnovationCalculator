/**
 * Startdaten für neue Arbeitsmappen und neue 5-Jahres-Kalkulationen.
 *
 * Aufgabe:   Liefert die leere Arbeitsmappe mit Standardgewichten und Beispiel-Bezugsgrößen aus der Vorlesung.
 * Benötigt:  core/criteria.js (HUBE_W)
 * Stellt bereit: userSeed, blankFY
 */

/**
 * Leere Arbeitsmappe mit Standardgewichten und Beispiel-Bezugsgrößen.
 */
function userSeed() {
  return {
    version: 3,
    workbook: 'Eigene Idee',
    mode: 'Multiprojekt',
    horizon: '5 Jahre',
    w: { n: HUBE_W.n.slice(), a: HUBE_W.a.slice() },
    base: {
      company: 'Mein Unternehmen',
      currency: 'EUR',
      revenue: 10,
      profit: 1,
      rnd: 10,
      note: 'Beispielwerte aus der Vorlesung (Gewinn 1 Mio €, F&E-Budget 10 Mio €). Bitte durch die Zahlen deines Unternehmens ersetzen.',
    },
    list: [],
  };
}

/**
 * Leere 5-Jahres-Kalkulation mit einer Personal-Position.
 */
function blankFY() {
  return {
    unit: 'Stück',
    priceUnit: 'Preis je Stück',
    qty: [0, 0, 0, 0, 0],
    price: [0, 0, 0, 0, 0],
    qtyNote: '',
    priceNote: '',
    staff: [{ label: 'F&E-Mitarbeiter', fte: [0, 0, 0, 0, 0], cost: 150000, note: '' }],
    material: [0, 0, 0, 0, 0],
    materialNote: '',
    sources: [],
  };
}
