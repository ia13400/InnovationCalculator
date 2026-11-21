# Anweisungen für Coding-Agenten

Diese Anweisungen gelten für das gesamte Repository `InnovationCalculator`, unabhängig davon, wer einen Teil der Website bearbeitet oder welchen Coding-Agenten die Person verwendet.

## Gemeinsamer Designvertrag

**Lies vor Änderungen an sichtbarer Oberfläche, Navigation, Bildern oder Animationen die [Designrichtlinie](DESIGN.md) und die betroffenen Bestandsdateien.** `DESIGN.md` ist die zentrale gestalterische Referenz. Bei einer reinen Textkorrektur genügt der betroffene Abschnitt; reine Dokumentationsarbeit benötigt keinen vollständigen UI-Test.

- Gestalterische Referenz ist der Pitch der Gruppe (Repository `InnovationManagement`, `pitch/`): dunkler Hintergrund, System-Schrift, sparsame Kupfer- und Eis-Akzente, feine Linien. `assets/css/` setzt diese Sprache um (Variablen in `tokens.css`).
- Die Website enthält nur den Rechner („Eigene Idee prüfen“) und „Methode & Quellen“. Inhalte zum SpaceX-Case oder zum RocketLight Dinner gehören nicht hierher.
- Rechner und Datentabellen müssen unmittelbar bedienbar bleiben. Verwende vorhandene Farben, Abstände, Komponenten und Interaktionsmuster.
- Bewahre vollständige Inhalte, Quellen, Annahmen und funktionsfähige Detailzugänge.
- Führe die angefragte Änderung aus. Eine Inhaltskorrektur ist kein Auftrag, andere Teile umzugestalten.

## Orientierung im Repository

| Datei / Ordner | Verantwortung |
| --- | --- |
| `index.html` | Einstieg: Kopfzeile mit den Reitern „Eigene Idee prüfen“ und „Methode & Quellen“, Werkzeugbereich `#werkzeug` und die Reihenfolge der eingebundenen Dateien mit `?v=`-Versionen |
| `assets/css/` | Gestaltung in Kaskadenreihenfolge: `tokens` (Variablen) → `base` → `wizard` → `components` → `calculator` → `charts` → `features` → `method` → `motion` → `print` (PDF-Bericht unter `@media print`) |
| `assets/js/core/` | Fachlogik ohne Oberfläche: `criteria.js` (Kriterien, Gewichte, Portfolio-Felder), `model.js` (Rechenlogik nach Hube), `format.js` (Formatierung, `esc`) |
| `assets/js/store/` | `seed.js` (Startdaten `userSeed()`), `state.js` (gespeicherter Zustand `innorendite.v4`, Migration, `ui`-Zustand) |
| `assets/js/ui/` | Wiederverwendbare Bausteine: `components.js`, `charts.js` (SVG-Diagramme), `formulas.js` (Rechenweg) |
| `assets/js/views/` | Ansichten, die nur Markup erzeugen: `panels`, `wizard`, `compare`, `assess`, `fy`, `method` |
| `assets/js/features/` | `ai.js` (KI-Bewertung über `AI_ENDPOINT`, Speicherung mit `aiOf`, Vergleich) und `report.js` (PDF-Bericht in `#report`) |
| `assets/js/app/` | `navigation.js` (Schritte, `render()`), `actions.js` (Knopf-Aktionen `ACTIONS[data-act]`), `events.js` (Ereignis-Delegation), `main.js` (Start, Direktlinks; zuletzt geladen) |
| `worker/` | Cloudflare Worker mit dem gemeinsamen Gemini-Schlüssel (Secret) und Einrichtungsanleitung |
| `teil6/index.html` | Nur noch Weiterleitung früherer Links auf den Rechner |

## Code-Architektur

- Die Skripte sind klassische Skripte ohne Module (funktionieren auch per `file://`); ihre Reihenfolge in `index.html` ist Teil der Logik. Abhängigkeiten laufen nur in eine Richtung: `core` → `store` → `ui` → `views` → `features` → `app`. Eine Datei darf beim Laden nur verwenden, was davor geladen wurde; Aufrufe innerhalb von Funktionen werden erst zur Laufzeit aufgelöst.
- Jede JS-Datei beginnt mit einem Kopfkommentar (Aufgabe, Benötigt, Stellt bereit); Funktionen haben einen kurzen JSDoc-Kommentar. Neue Dateien folgen diesem Muster und werden in `index.html`, `README.md` und dieser Tabelle ergänzt.
- Ansichten erzeugen Markup mit `data-`Attributen; Reaktionen stehen in `app/events.js`. Neue Knöpfe mit `data-act="name"` bekommen einen Eintrag in `ACTIONS` (`app/actions.js`).
- Rechenlogik gehört nach `core/model.js`, nicht in Ansichten. Formeln, die angezeigt werden, kommen aus `ui/formulas.js`, damit Website und PDF dieselbe Herleitung zeigen.

## Bestehende Verträge erhalten

1. **Daten und Rechenlogik:** Formeln, Einheiten, Skalen und Quellen nur im Rahmen des fachlichen Auftrags ändern. Keine Zahlen für einen besseren visuellen Effekt erfinden.
2. **Navigation:** Die Fragmente `#idee` und `#methode` erhalten. Frühere Fragmente (`#spacex`, `#case`, `#dinner`, `#launch`, `#roadmap`, `#teil6`) und `teil6/` leiten auf den Rechner weiter. Links müssen relativ zum Projektpfad `/InnovationCalculator/` funktionieren.
3. **Gespeicherter Zustand:** Bestehende Browserdaten (`innorendite.v4`) und JSON-Import/Export erhalten. Bei Formatänderungen eine kompatible Migration vorsehen; Nutzereingaben nicht löschen.
4. **Bewegung:** Native Scroll- und Tastaturbedienung und `prefers-reduced-motion` erhalten. Keine benötigte Information ausschließlich in Hover oder einer Animation verstecken.
5. **Statische Auslieferung:** HTML, CSS, JavaScript und lokale Assets funktionieren ohne Build-Schritt oder Backend. Einzige Ausnahme ist der Worker in `worker/` für die KI-Bewertung; ohne ihn bleibt der Rechner voll nutzbar. Niemals API-Schlüssel in Website-Dateien eintragen. Keine externen Schrift- oder Animationsdienste ohne sachlichen Grund.
6. **CSS:** Globale Selektoren und gemeinsam genutzte Funktionen auf Nebenwirkungen prüfen. Fremde Änderungen nicht überschreiben.

## Prüfen und veröffentlichen

- Richte die Prüfung am geänderten Verhalten aus; die passende Prüftiefe steht in `DESIGN.md` unter „Abnahme nach Änderungsart“. Keine neue Test-Infrastruktur für reine Dokumentations- oder Textkorrekturen einführen.
- Bei sichtbaren Änderungen die betroffenen Zustände im Browser prüfen und einen aussagekräftigen Screenshot festhalten. Tatsächlich geprüfte Browsergrößen und verbleibende Einschränkungen ehrlich benennen; Codeprüfung ersetzt keine visuelle Prüfung.
- Bei Änderungen an eingebundenem CSS oder JavaScript die vorhandenen `?v=`-Versionen in der zugehörigen HTML-Datei aus dem geänderten Dateiinhalt erneuern. Auf der Hauptseite sind dies die ersten zwölf Hex-Zeichen des SHA-256 der jeweiligen Datei. HTML und geänderte Assets zusammen veröffentlichen; keine Versionsänderung bei reinen Markdown-Änderungen.
- Vor einem Commit den aktuellen Branch und fremde Änderungen prüfen. Den vom Auftrag vorgegebenen Branch-/PR-Weg verwenden. Bereits erteilte Freigaben gelten; diese Datei fügt keine zusätzliche Freigabeschleife hinzu.
- Ein Push auf `main` startet laut Repository-Konfiguration GitHub Pages aus `/ (root)`; `.nojekyll` erhalten. Wenn Veröffentlichung Teil des Auftrags ist, den Lauf des **eigenen Commit-SHAs** prüfen. „Live“ erst melden, wenn die Veröffentlichung erfolgreich ist und die betroffene Seite den neuen Stand zeigt. Bei Fehlern erst den konkreten Lauf untersuchen.
- Zum Abschluss Änderung, relevante Prüfung und gegebenenfalls Commit-/Live-Link knapp nennen. Offene Einschränkungen benennen, keine erfolgreichen Tests oder Deployments behaupten, die nicht beobachtet wurden.

## Richtlinien pflegen

Gemeinsame Designentscheidungen in `DESIGN.md` aktualisieren. `CLAUDE.md` importiert diese Agentenanweisungen und soll keine zweite, abweichende Regelsammlung enthalten. Bereichsspezifische Ergänzungen konkretisieren den gemeinsamen Designvertrag. Ausdrückliche Vorgaben im aktuellen Auftrag haben Vorrang; eine gewünschte Ausnahme als solche kenntlich machen.
