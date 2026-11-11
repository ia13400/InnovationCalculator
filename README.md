# InnovationCalculator

Innovationsrendite-Rechner nach dem Inno-Rendite-Kalkulator von Prof. Dr. Gerhard Hube (THWS) – Trend2Business-Projekt SpaceX, Gruppe 2.

- Statische Website ohne Build-Schritt oder eigenes Backend. Die Hauptseite hat die Reiter „Eigene Idee prüfen“, „SpaceX-Case“, „RocketLight Dinner“ und „Methode & Quellen“. Im Reiter „SpaceX-Case“ steht oben die Scroll-Erzählung `#case` (Trends → zwölf Ideen → How-Wow-Now → drei Finalisten → Bewertung → 5-Jahres-Zahlen → Portfolio → Ranking), darunter unter `#werkzeug` die Schritte mit allen Details. Die Teil-6-Seite liegt in `teil6/`.
- Dateien: `index.html` bindet `assets/css/*.css` und `assets/js/*.js` ein (Aufteilung siehe [AGENTS.md](AGENTS.md)). Bei Änderungen an CSS/JS die `?v=`-Version in `index.html` erneuern (erste zwölf Hex-Zeichen des SHA-256 der Datei).
- Finalisten des SpaceX-Case: RocketLight Dinner, Starlink Insights und SpaceX Launch Engineering Cloud – jeweils als Team-Bewertung und als KI-Bewertung (Claude) mit 5-Jahres-Kalkulation. Gespeicherte Arbeitsmappen erhalten die beiden neuen KI-Bewertungen einmalig per Migration.
- Hosting: GitHub → Settings → Pages → Branch `main`, Ordner `/ (root)`. Jeder Push auf `main` startet automatisch einen GitHub-Pages-Veröffentlichungslauf; `.nojekyll` kennzeichnet die Dateien für die direkte statische Auslieferung.
- Rechenlogik: IR = IN / IA, Bilanz = IN − IA, Portfolio-Kategorien < 2 / 2–3 / ≥ 3; 5-Jahres-Kalkulation mit Gewinnanteil- und Kostenanteil-Skala wie im Excel-Tool.
- Daten werden im Browser gespeichert; Austausch über Export/Import (JSON) unter „Gewichtung & Daten“.

## Gemeinsam gestalten · Einstieg für Mitbearbeitende und Coding-Agenten

**Für neue und überarbeitete Oberflächen gilt die [Designrichtlinie in DESIGN.md](DESIGN.md).** Die filmische Roadmap ist die Referenz für die gemeinsame Bildsprache: ruhige dunkle Flächen, klare Typografie, gezielte Akzente und Übergänge, die den Inhalt erklären. Rechner und Datenansichten bleiben unmittelbar bedienbar. Die Prinzipien gelten für alle Beiträge; das Raketenmotiv gehört zum Dinner-Case.

| Datei | Zweck |
| --- | --- |
| [DESIGN.md](DESIGN.md) | Gemeinsame Regeln für Farben, Typografie, Layout, Bildsprache, Animation, Bedienbarkeit und angemessene Prüfung |
| [AGENTS.md](AGENTS.md) | Projektweite Arbeitsanweisungen für Codex und andere Coding-Agenten; verweist bei UI-Arbeit verbindlich auf die Designrichtlinie |
| [CLAUDE.md](CLAUDE.md) | Einstieg für Claude Code; importiert dieselbe `AGENTS.md`, damit keine zweite Regelsammlung entsteht |

Zum Start den aktuellen Repository-Stand im Coding-Agenten öffnen. Für einen neuen Beitrag kann der Auftrag beispielsweise so beginnen:

> Lies AGENTS.md und für die Gestaltung DESIGN.md. Ergänze meinen Bereich [Bereich/Inhalt] im gemeinsamen Stil der Website. Übernimm die vorhandenen Komponenten und Datenkonventionen. Passe die Inszenierung an den Inhalt an und prüfe die betroffenen Ansichten, Navigation und reduzierte Bewegung.

Codex verwendet `AGENTS.md` als Repository-Anweisung; Claude Code unterstützt den Import über `CLAUDE.md`. Die Dateien müssen dem jeweiligen Agenten im Projekt verfügbar sein. In einem normalen Chat ohne Repository-Zugriff diese Dateien ausdrücklich mitgeben. Die Konventionen sind in der [OpenAI-Dokumentation](https://developers.openai.com/cookbook/examples/codex/iterating-development-workflows-with-codex) und der [Claude-Code-Dokumentation](https://code.claude.com/docs/en/memory) beschrieben.

Gemeinsame Designänderungen zentral in `DESIGN.md` pflegen. Eine kleine Inhaltsänderung verlangt keinen Umbau anderer Teambeiträge; die Prüftiefe richtet sich nach dem geänderten Verhalten.

## Teil 6: Roadmap & Maßnahmenplan

Die eigenständige Seite [`teil6/`](https://ia13400.github.io/InnovationCalculator/teil6/) führt als zusammenhängende, filmische Scroll-Erzählung vom RocketLight-Dinner-Konzept bis zur Umsetzung: Standortscan, Architekturzeichnung, Freigabe, Bau und Betrieb entwickeln sich in derselben Landschaft. Gesamtprojekt, relevante Teilprojekte und die parallele Kulinarik bleiben verknüpft. Die bisherigen Direktlinks `#roadmap` und `#teil6` öffnen diese neue Erfahrung. Auch die Schritte „Umsetzung · Teil 6“ im Dinner-Reiter führen zum passenden Abschnitt.

- Aktuelle Einstiege: Geschichte (`#cinema`) und vollständiger Plan (`#plan`). Die älteren Direktlinks `#vision` (Geschichtenbeginn), `#mission` (4 W-Fragen) und `#path` (Standortsuche) bleiben als kompatible Verknüpfungen erhalten. `#projects`, `#budget`, `#timeline` und `#sources` öffnen die jeweiligen Detailabschnitte.
- Umschalter zwischen Variante A (mobiler Pavillon, passend zu Kalkulator und 5P-Mix) und Variante B (feste Lounge in Titusville); die Wahl wird im Browser gespeichert.
- Die vollständigen Planungsdaten, Zahlen, Quellen und Annahmen bleiben in `teil6/data.js` erhalten. `ROCKET_DATA` enthält beide Originalvarianten, `ROCKET_META` die zugehörigen Kennzahlen und Gates.
- Die passenden Folien liegen als PPTX in `praesentation/` (je 6 Folien im Design der Gruppenpräsentation, mit Sprechernotizen).
- Einstieg in die aktuelle Umsetzung: `teil6/index.html`, `cinema.css` und `cinema.js`; Szeneninhalte in `story.js`, vollständiger Plan in `data.js` und `details.js`. `style.css` liefert die Basis für Typografie und Detailansichten. Die tatsächlich eingebundenen Dateien stehen in `teil6/index.html`.
- Über „Plan & Quellen“ sind die vollständigen Daten direkt erreichbar. Reduzierte Bewegung und sehr flache Fenster erhalten eine lesbare Kapitelansicht.
