/**
 * Gespeicherter Zustand (Arbeitsmappe im Browser) und Zustand der Oberfläche.
 *
 * Aufgabe:   Lädt die Arbeitsmappe aus localStorage (Schlüssel innorendite.v4), migriert ältere Stände und speichert
 *            Änderungen verzögert. `state` ist die aktive Arbeitsmappe, `ui` der Zustand der Oberfläche (Schritt, Auswahl, Dialoge).
 * Benötigt:  store/seed.js (userSeed), core/criteria.js (SERIES)
 * Stellt bereit: KEY, root, state, ui, useCtx, save, cur, colorOf
 */

/**
 * Schlüssel in localStorage. Nicht ändern, sonst gehen gespeicherte Ideen verloren (ggf. Migration vorsehen).
 */
const KEY = 'innorendite.v4';

/**
 * root = gesamter gespeicherter Inhalt; state = aktive Arbeitsmappe (root.user).
 */
let root = null,
  state;

/**
 * Zustand der Oberfläche (wird teilweise mitgespeichert):
 * ctx = Reiter ('user' Rechner, 'method' Methode), wiz = Schritt im Ideen-Check (0–13), sub = aktiver Schritt,
 * sel = ausgewählte Idee, confirm = offener Bestätigungsdialog, aiBusy/aiErr = Status der KI-Bewertung.
 */
const ui = {
  ctx: 'user',
  wiz: 0,
  sub: { user: 'wizard' },
  sel: { user: 'u1' },
  confirm: null,
  aiBusy: null,
  aiErr: null,
};

try {
  root = JSON.parse(localStorage.getItem(KEY) || 'null');
} catch (e) {}

/* Gespeicherte Arbeitsmappen bleiben erhalten; ältere Einträge anderer Bereiche werden nur nicht mehr angezeigt. */
if (!root || !root.user || !Array.isArray(root.user.list)) {
  root = Object.assign(root && typeof root === 'object' ? root : {}, { user: userSeed() });
}

try {
  const u = JSON.parse(localStorage.getItem(KEY + '.ui') || 'null');
  if (u) {
    if (u.sub && u.sub.user) ui.sub.user = u.sub.user === 'settings' ? 'ranking' : u.sub.user;
    if (u.sel && u.sel.user) ui.sel.user = u.sel.user;
  }
} catch (e) {}

/**
 * Wechselt den Reiter und stellt sicher, dass eine vorhandene Idee ausgewählt ist.
 */
function useCtx(c) {
  ui.ctx = c;
  state = root.user;
  if (c === 'user' && !state.list.find(a => a.id === ui.sel.user)) ui.sel.user = (state.list[0] || {}).id;
}

/**
 * Timer für das verzögerte Speichern.
 */
let saveT;

/**
 * Speichert Arbeitsmappe und Oberflächenzustand nach 250 ms (mehrere Eingaben werden zusammengefasst).
 */
function save() {
  clearTimeout(saveT);
  saveT = setTimeout(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(root));
      localStorage.setItem(KEY + '.ui', JSON.stringify({ sub: ui.sub, sel: ui.sel }));
    } catch (e) {}
  }, 250);
}

/**
 * Die aktuell ausgewählte Bewertung.
 */
const cur = () => state.list.find(a => a.id === ui.sel.user);

/**
 * Farbe einer Bewertung in Diagrammen (nach Position in der Liste).
 */
const colorOf = a => `var(${SERIES[state.list.indexOf(a) % SERIES.length]})`;
