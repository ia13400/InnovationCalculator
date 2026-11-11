# Anweisungen für Coding-Agenten

Diese Anweisungen gelten für das gesamte Repository `InnovationCalculator`, unabhängig davon, wer einen Teil der Website bearbeitet oder welchen Coding-Agenten die Person verwendet.

## Gemeinsamer Designvertrag

**Lies vor Änderungen an sichtbarer Oberfläche, Navigation, Bildern oder Animationen die [Designrichtlinie](DESIGN.md) und die betroffenen Bestandsdateien.** `DESIGN.md` ist die zentrale gestalterische Referenz. Bei einer reinen Textkorrektur genügt der betroffene Abschnitt; reine Dokumentationsarbeit benötigt keinen vollständigen UI-Test.

- Die filmische Roadmap unter `teil6/` ist die Referenz für neue und überarbeitete Oberflächen: ruhige dunkle Flächen, präzise Typografie, sparsame warme Akzente, zusammenhängende Bildräume und inhaltlich begründete Bewegung.
- Übertrage diese Prinzipien auf das jeweilige Thema. Rechner und Datentabellen müssen unmittelbar bedienbar bleiben. Raketen, Sterne und Gebäudeszenen gehören zum RocketLight-Konzept und sind keine Pflichtmotive für jeden Beitrag.
- Gestalte neue Beiträge als Teil dieser Website. Verwende vorhandene Farben, Abstände, Komponenten und Interaktionsmuster; begründe tatsächlich notwendige Erweiterungen. Ältere Oberflächen sind kein Vorbild für neue gestalterische Sonderlösungen.
- Bewahre vollständige Inhalte, Quellen, Annahmen und funktionsfähige Detailzugänge. Die kurze Erzählung ergänzt die fachliche Darstellung.
- Führe die angefragte Änderung aus. Eine Inhaltskorrektur ist kein Auftrag, andere Teamteile oder die gesamte Website umzugestalten.

## Orientierung im Repository

| Datei | Verantwortung |
| --- | --- |
| `index.html` | Einstieg der Hauptseite: Kopfnavigation, Scroll-Erzählung `#case`, Werkzeugbereich `#werkzeug` und die Reihenfolge der eingebundenen Dateien mit `?v=`-Versionen |
| `assets/css/base.css`, `dinner.css`, `roadmap.css` | Gestaltung von Rechner und Hell-/Dunkel-Darstellung, Dinner-Bereich und Roadmap-Ansichten im Dinner-Reiter |
| `assets/css/story.css`, `assets/js/story.js` | SpaceX-Case als Scroll-Erzählung: zwölf Ideen als dieselben Punkte durch acht Kapitel, Werte live aus der SpaceX-Arbeitsmappe und `calc()`; statische Kapitelansicht bei reduzierter Bewegung oder unter 560 px Fensterhöhe |
| `assets/js/model.js`, `data.js`, `state.js` | Rechenlogik nach Hube, Startdaten (`seed()`, `IDEAS`, Quellen) sowie gespeicherter Zustand und Migrationen |
| `assets/js/helpers.js`, `views.js`, `app.js` | Hilfen und SVG-Diagramme, Ansichten des Rechners, Rendering, Ereignisse und Hash-Navigation |
| `assets/js/dinner.js`, `roadmap.js` | RocketLight-Dinner-Erlebnis und Roadmap-Daten des Dinner-Reiters |
| `teil6/index.html` | Struktur und lokale Asset-Verweise der filmischen Roadmap |
| `teil6/cinema.css`, `teil6/cinema.js` | Szenengestaltung, Scroll-Zustände, Varianten, Bewegung und statische Ersatzansicht |
| `teil6/story.js` | Redaktionelle Szenen und Verknüpfung mit den Teilprojekt-IDs |
| `teil6/data.js` | Vollständige Planungsdaten: `ROCKET_DATA` und `ROCKET_META` für A und B |
| `teil6/details.js`, `teil6/style.css` | Vollständiger Detailplan, Budget, interaktive Roadmap und gemeinsame Basisgestaltung der Unterseite |
| `teil6/asset-notes.md` | Herkunft, Konzeptstatus und räumliche Anker der Bildmotive |
| `praesentation/` | Präsentationen der beiden Varianten |

`index.html` und `teil6/index.html` sind maßgeblich dafür, welche Dateien tatsächlich geladen werden. Die Skripte der Hauptseite sind klassische Skripte ohne Module (funktionieren auch per `file://`); ihre Reihenfolge in `index.html` ist Teil der Logik. Die dort nicht eingebundenen früheren Dateien, etwa `teil6/main.js`, sind kein Einstiegspunkt für neue Funktionen.

## Bestehende Verträge erhalten

1. **Daten und Rechenlogik:** Formeln, Einheiten, Zahlen, Termine, Quellen und Planannahmen nur im Rahmen des fachlichen Auftrags ändern. Keine Zahlen oder Partner für einen besseren visuellen Effekt erfinden. In Teil 6 müssen Szenen, Detailansicht und Präsentationsauswahl zur gleichen Variante passen. Roadmap-Zeile 0 ist das Gesamtprojekt; Zeilen 1–6 sind Teilprojekte, deren Zuordnung zwischen A und B unterschiedlich ist. `laneIds` nicht ungeprüft zwischen Varianten kopieren.
2. **Navigation:** Bestehende Links und Anker erhalten oder kompatibel weiterleiten. Dazu gehören die Fragmente `#dinner`, `#roadmap`, `#teil6`, `#idee`, `#spacex`, `#methode`, `#launch` und `#case` (öffnet den Reiter SpaceX-Case mit der Erzählung) der Hauptseite sowie `#vision`, `#mission`, `#path`, `#projects`, `#budget`, `#timeline` und `#sources` der Unterseite `teil6/`. Links müssen relativ zum Projektpfad `/InnovationCalculator/` aufgelöst werden. Details müssen auch beim direkten Aufruf geöffnet werden.
3. **Gespeicherter Zustand:** Bestehende Browserdaten, JSON-Import/Export und Variantenwahl erhalten. Ebenso die vorhandene Hell-/Dunkel-Darstellung und ihre Reaktion auf die Systempräferenz bewahren. Bei notwendigen Formatänderungen eine kompatible Migration vorsehen; Nutzereingaben nicht zum Zurücksetzen der Darstellung löschen.
4. **Bewegung:** Native Scroll- und Tastaturbedienung, `prefers-reduced-motion`, manuelle Reduktion und die lesbare Ersatzansicht für sehr flache Fenster erhalten. Keine benötigte Information ausschließlich in Canvas, Hover oder einer Animation verstecken.
5. **Statische Auslieferung:** HTML, CSS, JavaScript und lokale Assets funktionieren ohne Build-Schritt oder Backend. Neue Frameworks, externe Schrift- oder Animationsdienste nur einführen, wenn der konkrete Auftrag sie sachlich erfordert. Relative Pfade müssen unter `/InnovationCalculator/` funktionieren.
6. **CSS und Änderungen anderer:** Neue Komponenten im passenden Bereich kapseln. Globale Selektoren und gemeinsam genutzte Funktionen auf Nebenwirkungen prüfen. Fremde Änderungen nicht überschreiben und funktionierende Teile nicht allein zur Vereinheitlichung neu schreiben.

## Prüfen und veröffentlichen

- Richte die Prüfung am geänderten Verhalten aus; die passende Prüftiefe steht in `DESIGN.md` unter „Abnahme nach Änderungsart“. Keine neue Test-Infrastruktur für reine Dokumentations- oder Textkorrekturen einführen.
- Bei sichtbaren Änderungen die betroffenen Zustände im Browser prüfen und einen aussagekräftigen Screenshot festhalten. Tatsächlich geprüfte Browsergrößen und verbleibende Einschränkungen ehrlich benennen; Codeprüfung ersetzt keine visuelle Prüfung.
- Bei Änderungen an eingebundenem CSS oder JavaScript die vorhandenen `?v=`-Versionen in der zugehörigen HTML-Datei aus dem geänderten Dateiinhalt erneuern. Auf der Hauptseite und in Teil 6 sind dies die ersten zwölf Hex-Zeichen des SHA-256 der jeweiligen Datei. HTML und geänderte Assets zusammen veröffentlichen; keine Versionsänderung bei reinen Markdown-Änderungen.
- Vor einem Commit den aktuellen Branch und fremde Änderungen prüfen. Den vom Auftrag vorgegebenen Branch-/PR-Weg verwenden. Bereits erteilte Freigaben gelten; diese Datei fügt keine zusätzliche Freigabeschleife hinzu.
- Ein Push auf `main` startet laut Repository-Konfiguration GitHub Pages aus `/ (root)`; `.nojekyll` erhalten. Wenn Veröffentlichung Teil des Auftrags ist, den Lauf des **eigenen Commit-SHAs** prüfen. „Live“ erst melden, wenn die Veröffentlichung erfolgreich ist und die betroffene Seite den neuen Stand zeigt. Bei Fehlern erst den konkreten Lauf untersuchen.
- Zum Abschluss Änderung, relevante Prüfung und gegebenenfalls Commit-/Live-Link knapp nennen. Offene Einschränkungen benennen, keine erfolgreichen Tests oder Deployments behaupten, die nicht beobachtet wurden.

## Richtlinien pflegen

Gemeinsame Designentscheidungen in `DESIGN.md` aktualisieren. `CLAUDE.md` importiert diese Agentenanweisungen und soll keine zweite, abweichende Regelsammlung enthalten. Bereichsspezifische Ergänzungen konkretisieren den gemeinsamen Designvertrag. Ausdrückliche Vorgaben im aktuellen Auftrag haben Vorrang; eine gewünschte Ausnahme als solche kenntlich machen.
