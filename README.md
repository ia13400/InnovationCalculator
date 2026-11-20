# InnovationCalculator

Innovationsrendite-Rechner nach dem Inno-Rendite-Kalkulator von Prof. Dr. Gerhard Hube (THWS) – studentischer Nachbau für die Vorlesung Innovationsmanagement.

**Live: [ia13400.github.io/InnovationCalculator](https://ia13400.github.io/InnovationCalculator/)**

- Statische Website ohne Build-Schritt oder Backend. Zwei Bereiche: **„Eigene Idee prüfen“** (Ideen-Check in zwölf Fragen, Ranking, Portfolio & Netz, Rendite & Bilanz, Feintuning mit Gewichtung, 5-Jahres-Kalkulation mit den Kennzahlen des Unternehmens) und **„Methode & Quellen“** (Rechenweg und Veröffentlichungen von Prof. Hube).
- Gestaltung wie der Pitch der Gruppe: dunkler Hintergrund, System-Schrift, Kupfer- und Eis-Akzent (siehe [DESIGN.md](DESIGN.md)).
- Dateien: `index.html` bindet `assets/css/base.css` und `assets/js/*.js` ein (Aufteilung siehe [AGENTS.md](AGENTS.md)). Bei Änderungen an CSS/JS die `?v=`-Version in `index.html` erneuern (erste zwölf Hex-Zeichen des SHA-256 der Datei).
- **KI-Bewertung:** Auf der Ergebnisseite lässt sich eine zweite Meinung durch Google Gemini erstellen (zwölf Punktwerte mit Begründung, Vergleich „Du vs. KI“). Der gemeinsame Schlüssel liegt in einem Cloudflare Worker, nicht in der Website; Einrichtung siehe [worker/README.md](worker/README.md).
- Rechenlogik: IR = IN / IA, Bilanz = IN − IA, Portfolio-Kategorien < 2 / 2–3 / ≥ 3; 5-Jahres-Kalkulation mit Gewinnanteil- und Kostenanteil-Skala wie im Excel-Tool.
- Daten werden nur im Browser gespeichert; Austausch über Export/Import (JSON) unter „Meine Ideen“.
- Direktlinks: `#idee` (Rechner) und `#methode` (Methode & Quellen). Ältere Links auf entfernte Bereiche (z. B. `#spacex`, `#dinner`, `teil6/`) führen zum Rechner.
- Hosting: GitHub → Settings → Pages → Branch `main`, Ordner `/ (root)`. Jeder Push auf `main` veröffentlicht automatisch; `.nojekyll` bleibt erhalten.

## Mitarbeiten

Für Gestaltung gilt [DESIGN.md](DESIGN.md), für Arbeitsweise und Dateiaufteilung [AGENTS.md](AGENTS.md). [CLAUDE.md](CLAUDE.md) importiert dieselben Anweisungen für Claude Code.
