/**
 * Reiter „Methode & Quellen“: Erklärung der Methode, Formeln und Quellen von Prof. Hube.
 *
 * Aufgabe:   Statischer Inhalt; keine Eingaben.
 * Benötigt:  core/format.js
 * Stellt bereit: vMethod
 */

/**
 * Inhalt des Reiters „Methode & Quellen“.
 */
function vMethod() {
  return `<section class="panel method" style="display:grid;gap:16px">
  <h2>So rechnet der Kalkulator</h2>
  <p>Der Rechner bildet den Innovations-Rendite-Kalkulator von Prof. Dr. Gerhard Hube nach. Er ist ein Scoring-Modell: Quantitative und qualitative Kriterien werden in dimensionslose Punkte umgewandelt. Die Innovationsrendite ist ein Indikator, keine finanzielle Rendite.</p>
  <div class="fx">
   <div class="fx-row"><span class="fx-l">Bewertung</span><span class="fx-f">Punkte 0 (nicht vorhanden) bis 5 (sehr hoch) je Kriterium</span><span class="fx-n">je sechs Kriterien für Nutzen/Chancen und Aufwand/Risiko</span></div>
   <div class="fx-row"><span class="fx-l">Gewichtete Bewertung</span><span class="fx-f">Punkte × Gewicht ÷ 100</span><span class="fx-n">Gewichte je Block zusammen 100 %</span></div>
   <div class="fx-row"><span class="fx-l">Nutzen IN</span><span class="fx-f">Σ (Punkte × Gewicht) ÷ 100 der sechs Nutzen-Kriterien</span><span class="fx-n">Wertebereich 0 bis 5</span></div>
   <div class="fx-row"><span class="fx-l">Aufwand IA</span><span class="fx-f">Σ (Punkte × Gewicht) ÷ 100 der sechs Aufwand-Kriterien</span><span class="fx-n">Wertebereich 0 bis 5</span></div>
   <div class="fx-row"><span class="fx-l">Innovationsrendite IR</span><span class="fx-f"><b>IR = IN ÷ IA</b></span><span class="fx-n">über 1 „profitabel“; bei IA = 0 geht IR gegen unendlich</span></div>
   <div class="fx-row"><span class="fx-l">Bilanz</span><span class="fx-f">IN − IA</span></div>
   <div class="fx-row"><span class="fx-l">Mittelwerte</span><span class="fx-f">IN ÷ 6 und IA ÷ 6</span><span class="fx-n">Durchschnitt der gewichteten Bewertungen</span></div>
   <div class="fx-row"><span class="fx-l">Kategorien</span><span class="fx-f">unter 2 niedrig · 2 bis unter 3 mittel · ab 3 hoch</span><span class="fx-n">für IN und IA; zusammen ergeben sie das Portfolio-Feld</span></div>
  </div>
  <p class="muted">Die Innovationsrendite ist ein Indikator aus dimensionslosen Punkten, keine finanzielle Rendite. Gerechnet wird mit vollen Nachkommastellen; angezeigt werden zwei.</p>
  <h3>5-Jahres-Kalkulation</h3>
  <div class="fx">
   <div class="fx-row"><span class="fx-l">Umsatzrendite</span><span class="fx-f">Gewinn ÷ Umsatz des Unternehmens im letzten Jahr</span></div>
   <div class="fx-row"><span class="fx-l">Umsatz</span><span class="fx-f">Menge × Preis je Jahr</span></div>
   <div class="fx-row"><span class="fx-l">Gewinn</span><span class="fx-f">Umsatz × Umsatzrendite je Jahr</span></div>
   <div class="fx-row"><span class="fx-l">Gewinnanteil</span><span class="fx-f">Σ Gewinn über 5 Jahre ÷ Gewinn des Unternehmens im letzten Jahr</span><span class="fx-n">Skala: 0 kein Gewinn · 1 ≤ 3 % · 2 ≤ 5 % · 3 ≤ 20 % · 4 ≤ 30 % · 5 &gt; 30 %</span></div>
   <div class="fx-row"><span class="fx-l">F&amp;E-Kosten</span><span class="fx-f">Σ (FTE × Jahreskosten je FTE) + Sachkosten je Jahr</span></div>
   <div class="fx-row"><span class="fx-l">Kostenanteil</span><span class="fx-f">Σ F&amp;E-Kosten über 5 Jahre ÷ F&amp;E-Kosten des Unternehmens im letzten Jahr</span><span class="fx-n">Skala: 0 keine · 1 ≤ 10 % · 2 ≤ 20 % · 3 ≤ 50 % · 4 ≤ 100 % · 5 &gt; 100 %</span></div>
  </div>
  <h3>Portfolio-Felder</h3>
  <div class="tablewrap"><table><thead><tr><th>Aufwand ↓ / Nutzen →</th><th>niedrig</th><th>mittel</th><th>hoch</th></tr></thead><tbody>
   ${[1, 2, 3].map(ca => `<tr><td>${catName(ca)}</td>${[1, 2, 3].map(cn => `<td>${esc(PF_LABELS[ca][cn][0])}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
  </section>
  <section class="panel method" id="hube" style="display:grid;gap:16px">
   <div><div class="eyebrow">Urheber der Methode</div><h2>Prof. Dr. Gerhard Hube</h2></div>
   <p>Die Innovationsrendite-Formel, der Innovationsrendite-Kalkulator, die Innovationsformel I = N × U und der Innovationsprüfstand wurden von Prof. Dr. Gerhard Hube entwickelt, Professor für Strategisches Innovationsmanagement an der THWS Business School (Technische Hochschule Würzburg-Schweinfurt). Diese Website ist ein studentischer Nachbau seines Excel-Kalkulators für die Vorlesung Innovationsmanagement / New Business Development am Graduate Campus der Hochschule Aalen. Alle Rechte an Methode und Originalwerkzeugen liegen beim Urheber.</p>
   <p><a href="https://business.thws.de/en/business-school/contact-persons/person/prof-dr-gerhard-hube/" target="_blank" rel="noopener">Profil von Prof. Dr. Gerhard Hube an der THWS Business School</a></p>
   <h3>Veröffentlichungen</h3>
   <ol class="src">
    <li>Hube, G. (2024): Innovationsrendite-Formel und Innovationsrendite-Kalkulator. In: Wissenschaftsmanagement, 20.03.2024. <a href="https://www.wissenschaftsmanagement.de/news/innovationsrendite-formel-und-innovationsrendite-kalkulator" target="_blank" rel="noopener">wissenschaftsmanagement.de</a></li>
    <li>Hube, G. (2024): Innovation return formula and Innovation-return-calculator. Wissenschaftsmanagement, Open Access, 23.03.2024. <a href="https://www.wissenschaftsmanagement.de/open-access/innovation-return-formula-and-innovation-return-calculator" target="_blank" rel="noopener">Artikel</a> · <a href="https://www.wissenschaftsmanagement.de/dateien/downloads-open-access/wima_2023_prof_hube_englisch_open_access_0.pdf" target="_blank" rel="noopener">PDF</a></li>
    <li>Hube, G. (2024): Innovation Return Formula. In: WIBF@Doğuş 2024 Conference Proceedings. DOI <a href="https://doi.org/10.53174/UAS/WS/2024" target="_blank" rel="noopener">10.53174/UAS/WS/2024</a> · <a href="https://wibf.thws.de/fileadmin/wibf/Media/WIBF_2024/WIBF%40Dogus_2024_Conference_Proceedings_Book.pdf" target="_blank" rel="noopener">Tagungsband (PDF)</a></li>
    <li>Hube, G. (2022): Innovationsformel und Innovationsprüfstand. Entwicklung eines Instrumentes zur Bestimmung des Innovationsstatus in der Gegenwart. In: Wissenschaftsmanagement, 15.10.2022. <a href="https://www.wissenschaftsmanagement.de/news/innovationsformel-und-innovationspruefstand" target="_blank" rel="noopener">wissenschaftsmanagement.de</a></li>
    <li>Hube, G. (2022): Innovation Formula and Innovation Test Bed: Development of an instrument to determine the Innovation Status in the Present. Open Access, THWS Fakultät Wirtschaftswissenschaften, DOI 10.53174/UAS/WS/2022. <a href="https://www.wissenschaftsmanagement.de/dateien/downloads-open-access/wima_2022_hube_open_access_0.pdf" target="_blank" rel="noopener">PDF</a></li>
    <li>Hube, G. (2023): Innovation Formula and Innovation Test Bed. In: WIBF 6th International Business Conference, Proceedings.</li>
   </ol>
   <h3>Video</h3>
   <ol class="src">
    <li>Hube, G. (Kanal „Inno-Prof“, 24.02.2024): How to calculate the Innovation-Return? Erklärvideo zur Innovationsrendite-Formel. <a href="https://www.youtube.com/watch?v=vAL8CZqFMqw" target="_blank" rel="noopener">YouTube</a></li>
   </ol>
   <h3>Lehrmaterial (Kurs-Canvas, nicht öffentlich)</h3>
   <ol class="src">
    <li>Hube, G. (2026): Innovationsmanagement / New Business Development, Vorlesungsfolien Kapitel 1–5 und „Innovationsformel nach Hube / Innovationsprüfstand“, Graduate Campus Hochschule Aalen.</li>
    <li>Hube, G.: Innovations-Rendite-Kalkulator V3.1 (Excel, mit Beispielen), Vorlage für diese Website.</li>
    <li>Hube, G.: Innovations-Prüfstand V6 (Excel, mit 5 Beispielen).</li>
   </ol>
   <h3>So zitieren</h3>
   <p class="mono" style="font-size:.85rem;background:var(--surface-2);padding:12px;border-radius:var(--r)">Hube, G. (2024): Innovationsrendite-Formel und Innovationsrendite-Kalkulator. In: Wissenschaftsmanagement, 20.03.2024.</p>
  </section>`;
}
