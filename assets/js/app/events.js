/**
 * Ereignisse: verbindet Klicks, Eingaben und Tastatur mit Zustand und Aktionen.
 *
 * Aufgabe:   Event-Delegation am Werkzeugbereich #view: Die Ansichten erzeugen nur Markup mit data-Attributen,
 *            hier wird darauf reagiert. Benannte Knopf-Aktionen stehen in app/actions.js (ACTIONS).
 * Benötigt:  store/state.js, app/navigation.js, app/actions.js, views/fy.js (fillFY)
 * Stellt bereit: – (registriert nur Ereignis-Handler)
 */

/* ---- Reiter „Eigene Idee prüfen“ / „Methode & Quellen“ ---- */
document.getElementById('tabs').addEventListener('click', e => {
  const b = e.target.closest('button[data-ctx]');
  if (b) goCtx(b.dataset.ctx);
});

/* ---- Ideen-Check starten (Formular auf der Startseite) ---- */
document.getElementById('view').addEventListener('submit', e => {
  if (e.target.id !== 'wizStart') return;
  e.preventDefault();
  const name =
    (document.getElementById('wiz-name').value || '').trim() || 'Meine Idee ' + (state.list.length + 1);
  const a = newAssessment();
  a.project = name;
  a.desc = document.getElementById('wiz-desc').value || '';
  a.n = [null, null, null, null, null, null];
  a.a = [null, null, null, null, null, null];
  wizSet(1);
});

/* ---- Tastatur im Ideen-Check: 0–5 antwortet, Enter weiter, ← bzw. Rücktaste zurück ---- */
document.addEventListener('keydown', e => {
  if (ui.ctx !== 'user' || ui.sub.user !== 'wizard' || ui.wiz < 1 || ui.wiz > 12) return;
  if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
  if (/^[0-5]$/.test(e.key)) {
    const b = document.querySelector(`[data-opt="${e.key}"]`);
    if (b && !b.disabled) b.click();
  } else if (e.key === 'Enter') {
    const b = document.querySelector('[data-wiz="next"]');
    if (b && !b.disabled) {
      e.preventDefault();
      b.click();
    }
  } else if (e.key === 'Backspace' || e.key === 'ArrowLeft') {
    wizSet(ui.wiz - 1);
  }
});

/* ---- Klicks im Werkzeugbereich ----
   Reihenfolge: zuerst Knöpfe mit eigener Navigation (Ideen-Check, Auswahl, Schritte, Punkte),
   danach die benannten Aktionen aus ACTIONS (data-act). */
document.getElementById('view').addEventListener('click', e => {
  const t = e.target.closest('button,[data-open]');
  if (!t) return;

  // Ideen-Check: Antwort 0–5 auf die aktuelle Frage
  if (t.dataset.opt !== undefined) {
    const a = cur(),
      c = ALLC[ui.wiz - 1];
    (c.g === 'n' ? a.n : a.a)[c.i] = +t.dataset.opt;
    render();
    return;
  }
  // Ideen-Check: direkt zu einer Frage springen (Fortschrittsleiste)
  if (t.dataset.wizgo) {
    wizSet(+t.dataset.wizgo);
    return;
  }
  // Ideen-Check: gespeicherte Idee öffnen, bei der ersten offenen Frage weitermachen
  if (t.dataset.wizopen) {
    ui.sel.user = t.dataset.wizopen;
    const a = cur();
    const k = ALLC.findIndex((_, j) => !answered(a, j));
    wizSet(k < 0 ? 13 : k + 1);
    return;
  }
  // Ideen-Check: weiter, zurück, neu starten
  if (t.dataset.wiz) {
    const w = t.dataset.wiz;
    if (w === 'next') wizSet(ui.wiz + 1);
    if (w === 'prev') wizSet(ui.wiz - 1);
    if (w === 'restart') wizSet(0);
    return;
  }
  // Idee aus Ranking oder Portfolio öffnen → Ergebnisseite
  if (t.dataset.open) {
    ui.sel.user = t.dataset.open;
    ui.sub.user = 'wizard';
    wizSet(13);
    return;
  }
  // Idee in der Auswahlleiste (picker) wählen
  if (t.dataset.sel) {
    ui.sel[ui.ctx] = t.dataset.sel;
    ui.confirm = null;
    render(true);
    return;
  }
  // Link-Knopf zu einem anderen Schritt
  if (t.dataset.tabgo) {
    let g = t.dataset.tabgo;
    if (g === 'overview') g = 'ranking';
    if (g === 'wizard') ui.wiz = 0;
    go(g);
    return;
  }
  // Schrittleiste oben
  if (t.dataset.sub) {
    go(t.dataset.sub);
    return;
  }
  // Feintuning: Punktzahl eines Kriteriums setzen (data-score="gain|cost:index:punkte")
  if (t.dataset.score) {
    const [k, i, s] = t.dataset.score.split(':');
    const a = cur();
    (k === 'gain' ? a.n : a.a)[+i] = +s;
    render(true);
    return;
  }
  // Benannte Aktionen (siehe app/actions.js)
  const action = ACTIONS[t.dataset.act];
  if (action) action(cur(), t);
});

/* ---- Abgeschlossene Änderungen (Checkbox, Auswahl, Datei, Zahlenfelder): neu rechnen ---- */
document.getElementById('view').addEventListener('change', e => {
  const t = e.target;
  if (t.id === 'importFile' && t.files[0]) {
    const r = new FileReader();
    r.onload = () => tryImport(r.result);
    r.readAsText(t.files[0]);
    return;
  }
  if (t.dataset.act === 'link') {
    cur().link = t.checked;
    render(true);
    return;
  }
  if (t.dataset.set === 'mode') {
    state.mode = t.value;
    render(true);
    return;
  }
  if (
    t.dataset.w ||
    t.dataset.base === 'revenue' ||
    t.dataset.base === 'profit' ||
    t.dataset.base === 'rnd'
  ) {
    render(true);
  }
});

/* ---- Laufende Eingaben: Werte übernehmen und speichern, ohne die Ansicht neu aufzubauen ---- */
document.getElementById('view').addEventListener('input', e => {
  const t = e.target,
    a = cur();
  if (t.tagName === 'TEXTAREA') autoGrow(t);
  if (t.dataset.why) {
    a.why[t.dataset.why] = t.value;
    save();
    return;
  }
  if (t.dataset.field) {
    a[t.dataset.field] = t.value;
    save();
    return;
  }
  if (t.dataset.fy) {
    setPath(a.fy, t.dataset.fy, t.value === '' ? 0 : +t.value);
    fillFY();
    save();
    return;
  }
  if (t.dataset.fyt) {
    setPath(a.fy, t.dataset.fyt, t.value);
    save();
    return;
  }
  if (t.dataset.w) {
    const [k, i] = t.dataset.w.split('.');
    state.w[k][+i] = t.value === '' ? 0 : +t.value;
    fillW();
    save();
    return;
  }
  if (t.dataset.base) {
    const k = t.dataset.base;
    state.base[k] = ['revenue', 'profit', 'rnd'].includes(k) ? +t.value || 0 : t.value;
    save();
    return;
  }
  if (t.dataset.set) {
    state[t.dataset.set] = t.value;
    save();
    return;
  }
});
