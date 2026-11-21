/**
 * Start der Anwendung: Direktlinks auswerten und die erste Ansicht anzeigen.
 *
 * Aufgabe:   Wird als letztes Skript geladen. #idee öffnet den Rechner, #methode die Quellen; frühere Links auf
 *            entfernte Bereiche (#spacex, #dinner, teil6/ …) führen zum Rechner.
 * Benötigt:  alle übrigen Skripte
 * Stellt bereit: ROUTE
 */

/**
 * Direktlink (#…) → Reiter.
 */
const ROUTE = k => ({ methode: 'method', method: 'method' })[k] || 'user';

/**
 * Beim Laden aufgerufener Direktlink ohne #.
 */
const h = (location.hash || '').slice(1);

// Reiter aus dem Direktlink wählen; unbekannte frühere Links auf #idee umschreiben
useCtx(ROUTE(h));

if (h && !['idee', 'methode', 'method', 'werkzeug'].includes(h)) {
  try {
    history.replaceState(null, '', '#idee');
  } catch (e) {}
}

// Erste Ansicht anzeigen
render();

// Direktlinks auch bei Änderung des # ohne Neuladen
addEventListener('hashchange', () => {
  const k = (location.hash || '').slice(1);
  useCtx(ROUTE(k));
  ui.confirm = null;
  render();
  toTool();
});
