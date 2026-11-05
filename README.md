# InnovationCalculator

Innovationsrendite-Rechner nach dem Inno-Rendite-Kalkulator von Prof. Dr. Gerhard Hube (THWS) – Trend2Business-Projekt SpaceX, Gruppe 2.

- Statische Website ohne Build-Schritt oder eigenes Backend. `index.html` enthält den Kalkulator und den bisherigen Dinner-Bereich; die neue Teil-6-Seite liegt in `teil6/`.
- Hosting: GitHub → Settings → Pages → Branch `main`, Ordner `/ (root)`. Jeder Push auf `main` startet automatisch einen GitHub-Pages-Veröffentlichungslauf; `.nojekyll` kennzeichnet die Dateien für die direkte statische Auslieferung.
- Rechenlogik: IR = IN / IA, Bilanz = IN − IA, Portfolio-Kategorien < 2 / 2–3 / ≥ 3; 5-Jahres-Kalkulation mit Gewinnanteil- und Kostenanteil-Skala wie im Excel-Tool.
- Daten werden im Browser gespeichert; Austausch über Export/Import (JSON) unter „Gewichtung & Daten“.

## Teil 6: Roadmap & Maßnahmenplan

Die eigenständige Seite `teil6/` führt als visuelle Scroll-Erzählung vom RocketLight-Dinner-Konzept bis zur Umsetzung. Die bisherigen Direktlinks `#roadmap` und `#teil6` öffnen diese neue Erfahrung. Auch die Schritte „Umsetzung · Teil 6“ im Dinner-Reiter führen zum passenden Abschnitt.

- Abschnitte: Vision (`#vision`), 4 W-Fragen (`#mission`), Stage-Gates (`#path`), Teilprojekte (`#projects`), Budget (`#budget`), Roadmap (`#timeline`) und Quellen (`#sources`).
- Umschalter zwischen Variante A (mobiler Pavillon, passend zu Kalkulator und 5P-Mix) und Variante B (feste Lounge in Titusville); die Wahl wird im Browser gespeichert.
- Die vollständigen Planungsdaten, Zahlen, Quellen und Annahmen bleiben in `teil6/data.js` erhalten. `ROCKET_DATA` enthält beide Originalvarianten, `ROCKET_META` die zugehörigen Kennzahlen und Gates.
- Die passenden Folien liegen als PPTX in `praesentation/` (je 6 Folien im Design der Gruppenpräsentation, mit Sprechernotizen).
