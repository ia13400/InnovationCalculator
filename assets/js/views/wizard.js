/**
 * Ansicht „Ideen-Check“: Start, zwölf Fragen nacheinander und Ergebnisseite.
 *
 * Aufgabe:   ui.wiz steuert den Schritt: 0 = Start, 1–12 = Fragen (Reihenfolge wie ALLC), 13 = Ergebnis.
 * Benötigt:  core/*, store/state.js, ui/*, features/ai.js (vAI)
 * Stellt bereit: Q, OPT_L, OPT_Q, answered, vWizard, vWizResult
 */

/**
 * Fragetext je Kriterium im Ideen-Check.
 */
const Q = {
  wirt: 'Wie viel Gewinn bringt die Idee im Vergleich zum heutigen Unternehmensgewinn?',
  kunde: 'Wie deutlich spüren Kunden den Nutzen?',
  komp: 'Baut ihr damit Fähigkeiten auf, die auch anderswo wertvoll sind?',
  trend: 'Wie stark trägt ein langfristiger Trend die Idee?',
  nachh: 'Wie groß ist der ökologische oder soziale Nutzen?',
  bauchN: 'Dein Bauchgefühl: Wie groß ist der Nutzen insgesamt?',
  fue: 'Wie hoch sind die Entwicklungskosten im Vergleich zum F&E-Budget?',
  kundeA: 'Wie schwer wird es, Kunden zu überzeugen?',
  tech: 'Wie hoch ist das technische Risiko?',
  markt: 'Wie riskant sind Markt, Wettbewerb und Regulierung?',
  intern: 'Wie viel Widerstand und Umstellung gibt es intern?',
  bauchA: 'Dein Bauchgefühl: Wie groß sind Aufwand und Risiko insgesamt?',
};

/**
 * Beschriftung der Antworten 0–5 für qualitative Kriterien.
 */
const OPT_L = ['nicht vorhanden', 'sehr gering', 'gering', 'mittel', 'hoch', 'sehr hoch'];

/**
 * Beschriftung der Antworten 0–5 für die quantitativen Kriterien (Skalen nach Hube).
 */
const OPT_Q = {
  wirt: ['kein Gewinn', '≤ 3 %', '≤ 5 %', '≤ 20 %', '≤ 30 %', '> 30 %'],
  fue: ['keine Kosten', '≤ 10 %', '≤ 20 %', '≤ 50 %', '≤ 100 %', '> 100 %'],
};

/**
 * Ist Kriterium k (Index in ALLC) der Bewertung a beantwortet?
 */
const answered = (a, k) => {
  const c = ALLC[k];
  const v = (c.g === 'n' ? a.n : a.a)[c.i];
  return v !== null && v !== undefined;
};

/**
 * Ideen-Check: Startseite (ui.wiz = 0), eine Frage (1–12) oder das Ergebnis (13).
 */
function vWizard() {
  const a = cur(),
    st = ui.wiz;
  if (!a || st === 0) {
    const open = state.list.filter(x => ALLC.some((_, k) => !answered(x, k)));
    return `<section class="hero">
     <div><div class="eyebrow">Innovationsrendite-Check nach Prof. Hube</div>
      <h2 class="claim">Idee rein.<span>Rendite raus<em>.</em></span></h2>
      <p class="lead">Zwölf Fragen, ein Ergebnis: Lohnt sich deine Idee, oder frisst der Aufwand den Nutzen?</p>
      <div class="howto"><div><b>6</b><span>Fragen zum Nutzen</span></div><div><b>6</b><span>Fragen zum Aufwand</span></div><div><b>1</b><span>klares Ergebnis</span></div></div></div>
     <form class="panel startcard" id="wizStart">
      <h3>Welche Idee willst du prüfen?</h3>
      <label class="f">Name der Idee<input id="wiz-name" placeholder="z. B. Lieferdrohne für Apotheken" autocomplete="off"></label>
      <label class="f">Kurz beschrieben (optional)<textarea id="wiz-desc" class="in" rows="2" placeholder="Was ist neu, für wen, warum?"></textarea></label>
      <button class="btn primary" type="submit">Check starten →</button>
      ${
        state.list.length
          ? `<div style="display:grid;gap:6px;margin-top:4px"><span class="eyebrow">Deine Ideen</span><div class="row">${state.list
              .map(x => {
                const done = ALLC.every((_, k) => answered(x, k));
                return `<button type="button" class="btn small" data-wizopen="${x.id}">${esc(x.aiOf ? label(x) : x.project)}${done ? ` · IR ${f2(calc(x).IR)}` : ' · weitermachen'}</button>`;
              })
              .join('')}</div></div>`
          : ''
      }
     </form></section>`;
  }
  if (st === 13) return vWizResult(a);
  const k = st - 1,
    c = ALLC[k],
    arr = c.g === 'n' ? a.n : a.a,
    val = arr[c.i],
    gc = c.g === 'n' ? 'g' : 'c';
  const lock = c.quant && a.link && a.fy;
  const labels = OPT_Q[c.k] || OPT_L;
  return `<div class="wiz">
   <div class="prog" aria-label="Fortschritt">${ALLC.map((x, j) => `<button data-wizgo="${j + 1}" class="${x.g === 'n' ? 'g' : 'c'} ${answered(a, j) ? 'done' : ''} ${j === k ? 'here' : ''}" aria-label="Frage ${j + 1}"></button>`).join('')}</div>
   <div><div class="eyebrow" style="color:var(${c.g === 'n' ? '--gain' : '--cost'})">${c.g === 'n' ? 'Nutzen/Chancen' : 'Aufwand/Risiko'} · Frage ${st} von 12 · Gewicht ${state.w[c.g][c.i]} %</div>
    <div class="muted" style="margin-top:2px">${esc(a.project)}</div></div>
   <h2 class="q">${esc(Q[c.k])}</h2>
   <p class="qdesc">${esc(c.d)}</p>
   ${lock ? `<div class="notice info">Dieser Wert kommt aus deiner 5-Jahres-Kalkulation: ${quantWhy(a, c.g === 'n' ? 'gain' : 'cost')}</div>` : ''}
   ${c.quant && !lock ? `<p class="ref-line">Bezug: ${c.g === 'n' ? 'Gewinn' : 'F&amp;E-Kosten'} von ${esc(state.base.company)} im letzten Jahr <b class="num">${fInt(c.g === 'n' ? state.base.profit : state.base.rnd)} Mio ${esc(state.base.currency)}</b> · <button class="linkbtn" data-tabgo="fy">ändern oder genau berechnen</button></p>` : ''}
   <div class="opts" role="group" aria-label="Bewertung">${[0, 1, 2, 3, 4, 5].map(v => `<button class="opt ${gc}" data-opt="${v}" aria-pressed="${val === v}" ${lock ? 'disabled' : ''}><span class="d">${v}</span><span class="l">${esc(labels[v])}</span></button>`).join('')}</div>
   <label class="f">Begründung (optional)<textarea class="in" rows="2" data-why="${c.k}" placeholder="Warum diese Einschätzung?">${esc(a.why[c.k] || '')}</textarea></label>
   <div class="wiznav"><button class="btn" data-wiz="prev">← Zurück</button><span class="kbd">Tasten 0–5 · Enter</span><button class="btn primary" data-wiz="next" ${answered(a, k) ? '' : 'disabled'}>${st === 12 ? 'Ergebnis zeigen' : 'Weiter →'}</button></div>
  </div>`;
}

/**
 * Ergebnisseite einer Bewertung: Rendite, Empfehlung, Rechenweg, KI-Vergleich, Portfolio und Netzgrafik.
 */
function vWizResult(a) {
  const r = calc(a);
  const vc = { g: 'ok', y: 'mid', r: 'bad' }[r.pf[1]];
  const contrib = g =>
    (g === 'n' ? N_CRIT : A_CRIT)
      .map((c, i) => ({ t: c.t, v: (g === 'n' ? r.wn : r.wa)[i], s: (g === 'n' ? r.n : r.x)[i] }))
      .sort((p, q) => q.v - p.v)
      .slice(0, 3);
  return `<div class="wiz" style="max-width:1100px">
   <section class="panel"><div class="res-hero">
    <div><div class="eyebrow">Innovationsrendite</div><div class="giant ${r.IR >= 1.5 ? 'ok' : r.IR >= 1 ? 'mid' : 'bad'}">${f2(r.IR)}</div></div>
    <div style="display:grid;gap:14px"><h2>${esc(a.project)}</h2>${a.desc ? `<p class="muted" style="font-size:1.1rem">${esc(a.desc)}</p>` : ''}
     <div><span class="chip big ${vc}">${esc(r.pf[0])}</span></div>
     <p class="verdict-line">${r.IR >= 1 ? 'Die Idee ist „profitabel“: Der Nutzen übersteigt den Aufwand.' : 'Die Idee ist nicht „profitabel“: Der Aufwand übersteigt den Nutzen.'} ${esc(ADVICE[r.pf[0]] || '')}</p></div></div>
    <div class="grid2" style="margin-top:20px;gap:16px">
     <div class="bar2"><div class="t"><span>Nutzen/Chancen IN</span><b class="num" style="color:var(--gain)">${f2(r.IN)}</b></div><div class="track"><div class="fill" style="width:${(r.IN / 5) * 100}%;background:var(--gain)"></div></div></div>
     <div class="bar2"><div class="t"><span>Aufwand/Risiko IA</span><b class="num" style="color:var(--cost)">${f2(r.IA)}</b></div><div class="track"><div class="fill" style="width:${(r.IA / 5) * 100}%;background:var(--cost)"></div></div></div>
    </div>
    <div class="sw" style="margin-top:20px">
     <div><span class="eyebrow">Bilanz</span><div class="num" style="font-size:1.4rem">${r.bil >= 0 ? '+' : ''}${f2(r.bil)}</div></div>
     <div><span class="eyebrow">Größte Nutzentreiber</span><ul>${contrib('n')
       .map(o => `<li>${esc(o.t)} <span class="num muted">(${o.s} → ${f2(o.v)})</span></li>`)
       .join('')}</ul></div>
     <div><span class="eyebrow">Größte Aufwandstreiber</span><ul>${contrib('a')
       .map(o => `<li>${esc(o.t)} <span class="num muted">(${o.s} → ${f2(o.v)})</span></li>`)
       .join('')}</ul></div>
    </div></section>
   <section class="panel"><header><h2>So wurde gerechnet</h2><span class="muted">Formeln nach Prof. Hube mit deinen Zahlen</span></header>${rechenweg(a)}</section>
   ${vAI(a)}
   <section class="panel"><header><h2>Aufwand/Nutzen-Portfolio</h2></header>${portfolio(aiOf(a) ? [a, aiOf(a)] : [a])}</section>
   <section class="panel"><header><h2>Netzgrafik</h2><span class="muted">Einzelbewertungen 0–5</span></header><div class="chartbox">${radar(aiOf(a) ? [a, aiOf(a)] : [a])}</div>${aiOf(a) ? legend([a, aiOf(a)]) : ''}</section>
   <div class="wiznav"><button class="btn" data-wizgo="12">← Antworten ändern</button>
    <span class="row"><button class="btn" data-act="pdf">Als PDF exportieren</button><button class="btn" data-tabgo="fy">5-Jahres-Kalkulation ergänzen</button><button class="btn" data-tabgo="ranking">Mit anderen Ideen vergleichen</button><button class="btn primary" data-wiz="restart">Neue Idee prüfen</button></span></div>
  </div>`;
}
