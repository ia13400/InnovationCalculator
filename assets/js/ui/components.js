/**
 * Kleine wiederverwendbare Bausteine der Oberfläche.
 *
 * Aufgabe:   Hinweise (toast), Kennzahl-Chips, leerer Zustand, Gewichtungswarnung und die Ideen-Auswahlleiste.
 * Benötigt:  core/format.js, core/model.js, store/state.js
 * Stellt bereit: toast, irChip, pfChip, emptyMsg, wNotice, picker
 */

/**
 * Zeigt kurz eine Meldung unten rechts.
 */
function toast(t) {
  const el = document.getElementById('toast');
  el.textContent = t;
  el.hidden = false;
  clearTimeout(toast.t);
  toast.t = setTimeout(() => (el.hidden = true), 2200);
}

/**
 * Chip mit der Innovationsrendite, farbig nach Höhe (≥ 1,5 gut, ≥ 1 mittel, sonst schwach).
 */
function irChip(r) {
  const v = r.IR;
  const c = v >= 1.5 ? 'ok' : v >= 1 ? 'mid' : 'bad';
  return `<span class="chip ${c}">IR ${f2(v)}</span>`;
}

/**
 * Chip mit dem Portfolio-Feld in der Farbe des Feldes.
 */
function pfChip(r) {
  const c = { g: 'ok', y: 'mid', r: 'bad' }[r.pf[1]];
  return `<span class="chip ${c}">${esc(r.pf[0])}</span>`;
}

/**
 * Hinweis, wenn noch keine Idee geprüft wurde.
 */
const emptyMsg = () =>
  `<section class="panel"><p style="font-size:1.15rem">Noch keine Idee geprüft. Starte mit dem Ideen-Check.</p><div class="row" style="margin-top:16px"><button class="btn primary" data-tabgo="wizard">Zum Ideen-Check</button></div></section>`;

/**
 * Warnung, wenn die Gewichte eines Blocks nicht 100 % ergeben.
 */
function wNotice() {
  const ok = sum(state.w.n) === 100 && sum(state.w.a) === 100;
  return ok
    ? ''
    : `<div class="notice">Die Gewichte ergeben nicht je 100 % (Nutzen ${sum(state.w.n)} %, Aufwand ${sum(state.w.a)} %). Unter „Feintuning“ korrigieren.</div>`;
}

/**
 * Auswahlleiste der Ideen (Feintuning, 5-Jahres-Kalkulation).
 * @param {boolean} withAdd zusätzlich „+ Neue Idee“ anzeigen
 */
function picker(withAdd = true) {
  return `<div class="picker" role="group" aria-label="Bewertung wählen">${state.list.map(a => `<button aria-pressed="${a.id === ui.sel[ui.ctx]}" data-sel="${a.id}"><i class="dot" style="background:${colorOf(a)}"></i>${esc(label(a))}</button>`).join('')}
  ${withAdd ? `<button data-act="new">+ Neue Idee</button>` : ''}</div>`;
}
