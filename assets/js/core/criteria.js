/**
 * Kriterien und feste Inhalte der Methode nach Prof. Dr. Gerhard Hube.
 *
 * Aufgabe:   Die zwölf Bewertungskriterien (je sechs für Nutzen/Chancen und Aufwand/Risiko), Standardgewichte,
 *            die neun Felder des Aufwand/Nutzen-Portfolios mit Handlungsempfehlungen und die Farbreihen der Diagramme.
 * Benötigt:  –
 * Stellt bereit: N_CRIT, A_CRIT, ALLC, HUBE_W, PF_LABELS, ADVICE, SERIES
 */

/**
 * Die sechs Kriterien für Nutzen/Chancen. k = Schlüssel, t = Titel, d = Erklärung, quant = aus der 5-Jahres-Kalkulation berechenbar.
 */
const N_CRIT = [
  {
    k: 'wirt',
    t: 'Wirtschaftlicher Nutzen',
    d: 'Umsatz/Gewinn oder Einsparpotenzial als Gewinnanteil am Unternehmensgewinn. 0 kein Gewinn · 1 ≤ 3 % · 2 ≤ 5 % · 3 ≤ 20 % · 4 ≤ 30 % · 5 > 30 %',
    quant: true,
  },
  { k: 'kunde', t: 'Wahrnehmbarer Kundennutzen', d: 'Kann auch ein interner Kunde sein.' },
  {
    k: 'komp',
    t: 'Nutzen durch neue Kompetenzen und Fähigkeiten',
    d: 'Werden Fähigkeiten aufgebaut, die auch für andere Anwendungsfelder oder Märkte wertvoll sind?',
  },
  {
    k: 'trend',
    t: 'Chancen durch Zukunftsmarkt/Trend',
    d: 'Liegt die Idee in einem langfristigen Trend mit großen Chancen und Potenzialen?',
  },
  {
    k: 'nachh',
    t: 'Nachhaltigkeits-Nutzen',
    d: 'Ökologischer und/oder sozialer Nutzen neben dem ökonomischen.',
  },
  { k: 'bauchN', t: 'Nutzen/Chancen gesamt nach Bauchgefühl', d: 'Gesamteindruck der Beurteilenden.' },
];

/**
 * Die sechs Kriterien für Aufwand/Risiko (gleicher Aufbau wie N_CRIT).
 */
const A_CRIT = [
  {
    k: 'fue',
    t: 'Investitionsaufwand für Entwicklung und Kompetenzaufbau (F&E)',
    d: 'Kumulierte F&E-Kosten als Anteil am F&E-Budget des letzten Jahres. 0 keine Kosten · 1 ≤ 10 % · 2 ≤ 20 % · 3 ≤ 50 % · 4 ≤ 100 % · 5 > 100 %',
    quant: true,
  },
  {
    k: 'kundeA',
    t: 'Aufwand, Kunden zu überzeugen',
    d: 'Wie schwer ist es, Kunden zum Nutzen und Kauf zu bewegen?',
  },
  {
    k: 'tech',
    t: 'Erfolgsrisiko (technische) Umsetzbarkeit',
    d: 'Komplexität, Verfügbarkeit, weitere Unsicherheiten.',
  },
  {
    k: 'markt',
    t: 'Erfolgsrisiko Markt und Wettbewerb',
    d: 'Wettbewerber, Marktdynamik (VUCA), gesetzliche Rahmenbedingungen.',
  },
  {
    k: 'intern',
    t: 'Aufwand, intern zu überzeugen, und Umstellungsaufwand',
    d: 'Widerstand in der Organisation, Änderungen an Prozessen und Strukturen.',
  },
  { k: 'bauchA', t: 'Aufwand/Risiko gesamt nach Bauchgefühl', d: 'Gesamteindruck der Beurteilenden.' },
];

/**
 * Alle zwölf Kriterien in der Reihenfolge des Ideen-Checks; g = Block ('n' Nutzen, 'a' Aufwand), i = Index im Block.
 */
const ALLC = [...N_CRIT.map((c, i) => ({ ...c, g: 'n', i })), ...A_CRIT.map((c, i) => ({ ...c, g: 'a', i }))];

/**
 * Standardgewichte in Prozent je Block (Summe je 100). Werden von userSeed() und „Standard nach Hube“ verwendet.
 */
const HUBE_W = { n: [10, 20, 30, 20, 10, 10], a: [20, 10, 30, 10, 10, 20] };

/**
 * Portfolio-Felder wie im Excel-Werkzeug: PF_LABELS[Aufwand-Kategorie][Nutzen-Kategorie] = [Text, Farbe g/y/r].
 */
const PF_LABELS = [
  // [aufwandKat][nutzenKat]  Kat: 1 niedrig, 2 mittel, 3 hoch
  null,
  [null, ['Nutzen prüfen/steigern!', 'y'], ['Quick win', 'g'], ['Fast zu schön um wahr zu sein!', 'g']],
  [null, ['Kritisch prüfen!', 'r'], ['?', 'y'], ['Dranbleiben!', 'g']],
  [
    null,
    ['Abbrechen!!', 'r'],
    ['Aufwand prüfen/senken, Nutzen steigern!', 'r'],
    ['Aufwand prüfen/senken!', 'y'],
  ],
];

/**
 * Kurze Handlungsempfehlung je Portfolio-Feld (Ergebnisseite und PDF).
 */
const ADVICE = {
  'Quick win': 'Wenig Aufwand bei ordentlichem Nutzen: zügig umsetzen.',
  'Fast zu schön um wahr zu sein!':
    'Hoher Nutzen bei geringem Aufwand. Prüft eure Annahmen noch einmal kritisch.',
  'Nutzen prüfen/steigern!': 'Wenig Aufwand, aber auch wenig Nutzen. Wie lässt sich der Nutzen erhöhen?',
  'Kritisch prüfen!': 'Mittlerer Aufwand bei geringem Nutzen. Genau prüfen, ob sich das lohnt.',
  '?': 'Nutzen und Aufwand liegen beide im Mittelfeld. Sammelt mehr Informationen, bevor ihr entscheidet.',
  'Dranbleiben!': 'Der hohe Nutzen rechtfertigt den Aufwand: weiterverfolgen.',
  'Abbrechen!!': 'Hoher Aufwand bei geringem Nutzen: die Idee nicht weiterverfolgen.',
  'Aufwand prüfen/senken, Nutzen steigern!':
    'Zu viel Aufwand für zu wenig Nutzen. Aufwand senken und Nutzen steigern, sonst lohnt es sich nicht.',
  'Aufwand prüfen/senken!': 'Großer Nutzen, aber auch großer Aufwand. Den Aufwand gezielt senken.',
};

/**
 * CSS-Variablen der Farbreihen für Ideen in Diagrammen (zyklisch).
 */
const SERIES = ['--s1', '--s2', '--s3', '--s4', '--s5', '--s6'];
