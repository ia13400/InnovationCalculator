/**
 * Formatierung von Zahlen und Texten für die Anzeige (deutsches Zahlenformat).
 *
 * Aufgabe:   Alle Ausgaben in HTML laufen über esc(), damit Eingaben der Nutzer nie als HTML interpretiert werden.
 * Benötigt:  –
 * Stellt bereit: esc, f2, fInt, fMio, fPct, fN, label
 */

/**
 * Maskiert Text für die sichere Ausgabe in HTML.
 */
const esc = s =>
  String(s ?? '').replace(
    /[&<>"']/g,
    c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
  );

/**
 * Zahl mit zwei Nachkommastellen (deutsches Format); ∞ für unendlich, – für ungültig.
 */
const f2 = v =>
  v === Infinity
    ? '∞'
    : Number.isFinite(v)
      ? v.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : '–';

/**
 * Ganze Zahl mit Tausenderpunkten.
 */
const fInt = v => Math.round(+v || 0).toLocaleString('de-DE');

/**
 * Betrag in Millionen mit zwei Nachkommastellen, z. B. „2,41 Mio“.
 */
const fMio = v =>
  ((+v || 0) / 1e6).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' Mio';

/**
 * Anteil (0,05) als Prozent, z. B. „5,00 %“.
 */
const fPct = v =>
  ((+v || 0) * 100).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 3 }) + ' %';

/**
 * Zahl ohne feste Nachkommastellen (höchstens zwei), z. B. für Gewichte im Rechenweg.
 */
const fN = v => (+v || 0).toLocaleString('de-DE', { maximumFractionDigits: 2 });

/**
 * Anzeigename einer Bewertung: „Idee · Beurteiler“ oder nur der Name der Idee.
 */
const label = a => (a.assessor ? `${a.project} · ${a.assessor}` : a.project);
