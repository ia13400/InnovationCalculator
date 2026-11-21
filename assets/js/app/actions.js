/**
 * Aktionen: alles, was Daten verändert und durch einen Knopf ausgelöst wird.
 *
 * Aufgabe:   Benannte Aktionen für die Knöpfe mit `data-act="…"` (Tabelle ACTIONS) sowie
 *            Hilfsfunktionen zum Anlegen, Ändern und Importieren von Bewertungen.
 * Benötigt:  store/state.js (state, ui, cur, save), store/seed.js (userSeed, blankFY),
 *            core/criteria.js (HUBE_W), ui/components.js (toast), app/navigation.js (render, wizSet),
 *            features/ai.js (runAI), features/report.js (printReport)
 * Stellt bereit: newAssessment, setPath, tryImport, ACTIONS
 */

/**
 * Legt eine neue, leere Bewertung an, fügt sie der Liste hinzu und wählt sie aus.
 * Startwerte 3 für alle Kriterien; der Ideen-Check überschreibt sie mit „offen“ (null).
 * @returns {object} die neue Bewertung
 */
function newAssessment() {
  const a = {
    id: 'b' + Date.now().toString(36),
    project: 'Neue Idee ' + (state.list.length + 1),
    assessor: state.mode === 'Multibeurteilende' ? 'Beurteiler ' + (state.list.length + 1) : '',
    idea: '',
    link: false,
    n: [3, 3, 3, 3, 3, 3],
    a: [3, 3, 3, 3, 3, 3],
    why: {},
    fy: null,
  };
  state.list.push(a);
  ui.sel[ui.ctx] = a.id;
  return a;
}

/**
 * Setzt einen Wert in einem verschachtelten Objekt über einen Punkt-Pfad,
 * z. B. setPath(fy, 'staff.0.fte.2', 1.5). Genutzt für die Eingabefelder der 5-Jahres-Kalkulation.
 */
function setPath(obj, path, val) {
  const p = path.split('.');
  let o = obj;
  for (let i = 0; i < p.length - 1; i++) o = o[p[i]];
  o[p[p.length - 1]] = val;
}

/**
 * Übernimmt eine exportierte Arbeitsmappe (JSON-Text) und ersetzt die aktuelle.
 * Ungültige Dateien werden abgelehnt, ohne vorhandene Daten zu verändern.
 * @param {string} txt Inhalt der Export-Datei
 */
function tryImport(txt) {
  try {
    const s = JSON.parse(txt);
    if (!s || !Array.isArray(s.list) || !s.w || !s.base) throw 0;
    s.version = 3;
    root.user = s;
    ui.sel[ui.ctx] = (s.list[0] || {}).id;
    useCtx(ui.ctx);
    render();
    toast(`${s.list.length} Bewertungen importiert`);
  } catch (e) {
    toast('Import fehlgeschlagen: keine gültige Export-Datei');
  }
}

/**
 * Aktionen der Knöpfe mit `data-act="name"`. Jede Aktion erhält die gerade ausgewählte
 * Bewertung `a` und den gedrückten Knopf `t` (für zusätzliche data-Attribute wie data-k).
 * Neue Knöpfe: hier eine Funktion ergänzen und im Markup `data-act="name"` setzen.
 */
const ACTIONS = {
  /* ---- Ideen anlegen, kopieren, löschen ---- */
  new() {
    ui.sub.user = 'wizard';
    wizSet(0);
  },
  dup(a) {
    const c = JSON.parse(JSON.stringify(a));
    c.id = 'b' + Date.now().toString(36);
    c.assessor = (c.assessor || '') + ' (Kopie)';
    state.list.push(c);
    ui.sel[ui.ctx] = c.id;
    render(true);
    toast('Bewertung dupliziert');
  },
  del() {
    ui.confirm = 'del';
    render(true);
  },
  'del-no'() {
    ui.confirm = null;
    render(true);
  },
  'del-yes'(a) {
    state.list = state.list.filter(x => x !== a);
    ui.sel[ui.ctx] = (state.list[0] || {}).id;
    ui.confirm = null;
    render(true);
    toast('Bewertung gelöscht');
  },

  /* ---- KI-Bewertung und PDF-Bericht ---- */
  ai(a) {
    runAI(a);
  },
  pdf(a) {
    printReport([a.id]);
  },
  pdfall() {
    printReport(state.list.map(x => x.id));
  },

  /* ---- 5-Jahres-Kalkulation ---- */
  addfy(a) {
    a.fy = blankFY();
    a.link = true;
    ui.sub[ui.ctx] = 'fy';
    render();
  },
  addstaff(a) {
    a.fy.staff.push({ label: 'Neue Position', fte: [0, 0, 0, 0, 0], cost: 150000, note: '' });
    render(true);
  },
  rmstaff(a, t) {
    a.fy.staff.splice(+t.dataset.k, 1);
    render(true);
  },
  addsrc(a) {
    (a.fy.sources ??= []).push('');
    render(true);
  },
  rmsrc(a, t) {
    a.fy.sources.splice(+t.dataset.k, 1);
    render(true);
  },

  /* ---- Gewichtung ---- */
  hubew() {
    state.w = { n: HUBE_W.n.slice(), a: HUBE_W.a.slice() };
    render(true);
    toast('Gewichte nach Hube gesetzt');
  },

  /* ---- Teilen und sichern (Export, Import, Zurücksetzen) ---- */
  export() {
    const s = JSON.stringify(state, null, 1);
    document.getElementById('io').value = s;
    (navigator.clipboard ? navigator.clipboard.writeText(s) : Promise.reject())
      .then(() => toast('JSON in die Zwischenablage kopiert'))
      .catch(() => {
        const io = document.getElementById('io');
        io.focus();
        io.select();
        toast('JSON markiert – mit Strg+C kopieren');
      });
  },
  download() {
    try {
      const blob = new Blob([JSON.stringify(state, null, 1)], { type: 'application/json' });
      const u = URL.createObjectURL(blob);
      const l = document.createElement('a');
      l.href = u;
      l.download = 'innovationsrendite.json';
      document.body.appendChild(l);
      l.click();
      l.remove();
      setTimeout(() => URL.revokeObjectURL(u), 2000);
      toast('Download gestartet (falls blockiert: „JSON kopieren“)');
    } catch (err) {
      toast('Download nicht möglich – „JSON kopieren“ nutzen');
    }
  },
  import() {
    tryImport(document.getElementById('io').value);
  },
  reset() {
    ui.confirm = 'reset';
    render(true);
  },
  'reset-no'() {
    ui.confirm = null;
    render(true);
  },
  'reset-yes'() {
    root.user = userSeed();
    useCtx(ui.ctx);
    ui.confirm = null;
    render(true);
    toast('Zurückgesetzt');
  },
};
