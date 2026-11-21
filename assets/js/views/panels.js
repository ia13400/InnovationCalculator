/**
 * Einstellungsblöcke, die in mehreren Ansichten erscheinen.
 *
 * Aufgabe:   Früher Reiter „Einstellungen“; jetzt steht jeder Block dort, wo er die Rechnung beeinflusst:
 *            Gewichtung → Feintuning, Bezugsgrößen → 5-Jahres-Kalkulation, Arbeitsmappe sowie Teilen und sichern → Meine Ideen.
 * Benötigt:  core/*, store/state.js
 * Stellt bereit: wPanel, wbPanel, basePanel, sharePanel
 */

/**
 * Gewichtung der Kriterien mit Summenprüfung (im Feintuning).
 */
function wPanel() {
  const wRow = (list, kind) =>
    list
      .map(
        (c, i) =>
          `<tr><td>${esc(c.t)}</td><td class="r"><input class="in" style="width:96px;text-align:right" type="number" min="0" max="100" data-w="${kind}.${i}" value="${state.w[kind][i]}" aria-label="Gewicht ${esc(c.t)}"></td><td class="r num muted">${HUBE_W[kind][i]} %</td></tr>`
      )
      .join('');
  return `<section class="panel"><header><h2>Gewichtung der Kriterien</h2><button class="btn small" data-act="hubew">Standard nach Hube</button></header>
   <p class="muted" style="margin-bottom:12px">Die Gewichte gelten für alle Bewertungen und müssen je Block 100 % ergeben.</p>
   <div class="tablewrap"><table><thead><tr><th>Nutzen/Chancen</th><th class="r">Gewicht %</th><th class="r">Hube</th></tr></thead><tbody>${wRow(N_CRIT, 'n')}
    <tr><td><b>Summe</b></td><td class="r num"><b data-out="wsum-n"></b></td><td></td></tr></tbody></table></div>
   <div class="tablewrap" style="margin-top:18px"><table><thead><tr><th>Aufwand/Risiko</th><th class="r">Gewicht %</th><th class="r">Hube</th></tr></thead><tbody>${wRow(A_CRIT, 'a')}
    <tr><td><b>Summe</b></td><td class="r num"><b data-out="wsum-a"></b></td><td></td></tr></tbody></table></div>
  </section>`;
}

/**
 * Arbeitsmappe: Name, Verwendung, Zeithorizont (unter „Meine Ideen“).
 */
function wbPanel() {
  return `<section class="panel"><header><h2>Arbeitsmappe</h2><span class="muted">Gilt für alle Ideen</span></header><div class="fields">
   <label class="f">Name<input id="s-wb" data-set="workbook" value="${esc(state.workbook)}"></label>
   <label class="f">Verwendung als<select id="s-mode" data-set="mode"><option ${state.mode === 'Multiprojekt' ? 'selected' : ''}>Multiprojekt</option><option ${state.mode === 'Multibeurteilende' ? 'selected' : ''}>Multibeurteilende</option></select></label>
   <label class="f">Zeithorizont<input id="s-hz" data-set="horizon" value="${esc(state.horizon)}"></label></div>
   <p class="muted" style="margin-top:12px">Multiprojekt: mehrere Ideen vergleichen. Multibeurteilende: eine Idee aus Sicht mehrerer Personen (z. B. F&amp;E, Marketing, Geschäftsführung).</p></section>`;
}

/**
 * Bezugsgrößen des Unternehmens: Umsatz, Gewinn, F&E-Kosten des letzten Jahres (in der 5-Jahres-Kalkulation).
 */
function basePanel() {
  const b = state.base;
  return `<section class="panel"><header><h2>Bezugsgrößen des Unternehmens</h2><span class="muted">Gelten für alle Ideen · Werte in Mio</span></header><div class="fields">
   <label class="f">Unternehmen<input id="b-co" data-base="company" value="${esc(b.company)}"></label>
   <label class="f">Währung<input id="b-cur" data-base="currency" value="${esc(b.currency)}"></label>
   <label class="f">Umsatz letztes Jahr (Mio)<input id="b-rev" type="number" data-base="revenue" value="${b.revenue}"></label>
   <label class="f">Gewinn letztes Jahr (Mio)<input id="b-pro" type="number" data-base="profit" value="${b.profit}"></label>
   <label class="f">F&amp;E-Kosten letztes Jahr (Mio)<input id="b-rnd" type="number" data-base="rnd" value="${b.rnd}"></label></div>
   <label class="f" style="margin-top:12px">Erläuterung<textarea id="b-note" class="in" rows="3" data-base="note">${esc(b.note)}</textarea></label></section>`;
}

/**
 * Teilen und sichern: Export, Import und Zurücksetzen (unter „Meine Ideen“).
 */
function sharePanel() {
  return `<section class="panel"><header><h2>Teilen und sichern</h2></header>
   <p class="muted" style="margin-bottom:12px">Alle Eingaben liegen nur in diesem Browser. Zum Teilen exportieren und bei der Gruppe importieren.</p>
   <div class="row"><button class="btn" data-act="export">JSON kopieren</button><button class="btn" data-act="download">JSON herunterladen</button><label class="btn" for="importFile">Datei importieren</label><input type="file" id="importFile" accept="application/json,.json" hidden></div>
   <textarea id="io" class="in" rows="4" style="margin-top:12px;font-family:var(--f-mono);font-size:.78rem" placeholder="JSON hier einfügen und „Einfügen übernehmen“ klicken"></textarea>
   <div class="row" style="margin-top:8px"><button class="btn small" data-act="import">Einfügen übernehmen</button>
   ${ui.confirm === 'reset' ? `<span class="row"><span>Alle eigenen Ideen löschen und neu beginnen?</span><button class="btn small danger" data-act="reset-yes">Ersetzen</button><button class="btn small" data-act="reset-no">Abbrechen</button></span>` : `<button class="btn small danger" data-act="reset">Zurücksetzen</button>`}</div>
  </section>`;
}
