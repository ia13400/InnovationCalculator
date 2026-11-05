# Designrichtlinie · InnovationCalculator

## 1. Ziel und Geltungsbereich

Die Website soll wie ein zusammenhängendes, hochwertig gestaltetes Produkt wirken. Neue Beiträge unterschiedlicher Teammitglieder teilen dieselbe visuelle Sprache: **ruhig, räumlich, präzise und inhaltlich geführt**. Bewegung macht eine Entwicklung oder Beziehung verständlich; jede Information behält einen gut erreichbaren, lesbaren Platz.

Diese Richtlinie gilt für neue und überarbeitete Oberflächen im gesamten Repository. Die [filmische Roadmap](https://ia13400.github.io/InnovationCalculator/teil6/) in `teil6/` ist die gestalterische Referenz. Sie legt die Richtung fest, nicht jedes einzelne Maß oder Motiv. Vorhandene ältere Bereiche werden innerhalb beauftragter Änderungen schrittweise daran angeglichen. Diese Datei ist kein Auftrag zu einem vollständigen Umbau.

InnovationCalculator bleibt die gemeinsame Website. RocketLight ist der darin dargestellte Dinner-Case. Seitenbezeichnungen, fachliche Begriffe und Navigation müssen diese Einordnung erhalten. Die Referenz an hochwertigen Produktseiten wie Apple betrifft Komposition, Übergänge und Ausführungsqualität; Assets, Texte und Markenauftritt bleiben eigenständig.

## 2. Die Darstellung folgt der Aufgabe

| Inhalt | Passende Gestaltung | Was jederzeit möglich sein muss |
| --- | --- | --- |
| Vision, Entwicklung, Strategie, Roadmap | Zusammenhängende Szene oder klar geführte Erzählung; ein Schwerpunkt pro Abschnitt; räumlich nachvollziehbare Übergänge | Kapitel wechseln, zurückscrollen, Details direkt öffnen |
| Rechner, Eingaben, Szenariovergleich | Ruhige Arbeitsfläche mit deutlichen Beschriftungen, stabilen Eingaben und unmittelbar nachvollziehbaren Ergebnissen | Werte ändern, vergleichen, Fehler erkennen, Ergebnisse lesen |
| Budget, Termine, Quellen, Methoden | Präzise Tabellen, Diagramme und gegliederte Texte; Details bei Bedarf aufklappen oder vergrößern | Zahlen prüfen, Quellen aufrufen, direkt verlinkte Abschnitte erreichen |

Alle drei Darstellungen teilen Farben, Typografie, Abstände, Navigation und Zustände. Eine fachliche Eingabe benötigt keine vorgeschaltete Scroll-Sequenz. Eine Geschichte darf ihre Details verdichten, solange der vollständige Inhalt erreichbar bleibt.

**Beispiele für die Übertragung:** Eine Marktanalyse kann eine zentrale Marktgrafik schrittweise um Segmente ergänzen. Ein Geschäftsmodell kann Beziehungen um ein gemeinsames Wertangebot aufbauen. Der Rechner erklärt die Auswirkung einer Eingabe am Ergebnis. Die Landschaft mit Rakete bleibt dort, wo sie fachlich zum Dinner-Case gehört.

## 3. Farben und Oberflächen

Die folgende Zielpalette basiert auf `teil6/cinema.css` und der ruhigen Detailfläche aus `teil6/style.css`. Sie ist die gemeinsame Referenz für neue Oberflächen.

| Rolle | Bestehende Variable | Wert | Verwendung |
| --- | --- | --- | --- |
| Hintergrund | `--cinema-bg` | `#060b10` | Große ruhige Flächen und Übergänge |
| Erhöhte Fläche | `--panel` | `#111215` | Funktionsflächen, Dialoge, Details |
| Primärer Text | `--cinema-paper` | `#eff3ed` | Überschriften, Aussagen und Werte |
| Sekundärer Text | `--cinema-muted` | `#a8b5bb` | Erläuterung und Metadaten |
| Warmer Akzent | `--cinema-copper` | `#efbd91` | Aktive Schritte, Fortschritt, wichtige Aktionen |
| Kühler Akzent | `--cinema-ice` | `#a9d9d9` | Zeichnungen, Verbindungen, Fokus |
| Feine Trennlinie | `--line` | `rgba(241,237,232,.13)` | Gruppen und Flächengrenzen |

`style.css` enthält zurzeit eine verwandte ältere Tokenfamilie, etwa `--ink: #08090b`, `--text: #f5f2ee` und `--accent: #f4b38b`. Diese bleibt kompatibler Bestand; sie begründet keine zweite neue Designsprache. In bestehenden Komponenten zunächst ihre vorhandenen Variablen verwenden. Bei einer beauftragten gestalterischen Angleichung die betroffenen Tokens kontrolliert an die Zielpalette annähern. Werden gemeinsame Tokens für mehrere Seiten extrahiert, müssen ihre Werte und ihre Bedeutung zentral bleiben. Importiere nicht unbesehen die gesamte Szenen-CSS in andere Seiten: Sie enthält auch globale und szenenspezifische Regeln.

Die Hauptseite besitzt außerdem eine bestehende Hell-/Dunkel-Darstellung über CSS und die Systempräferenz. Dieses Verhalten erhalten; die Zielpalette für neue dunkle Bereiche ist kein Auftrag, vorhandene Themenfunktionen zu entfernen.

- Große Flächen bleiben überwiegend dunkel und neutral. Warme und kühle Akzente erhalten klare Aufgaben; eine neue Unterseite bekommt keine eigene konkurrierende Hauptpalette.
- Licht, Bildverläufe und dezente Transparenz schaffen Tiefe. Text auf Bildern braucht eine ausreichend ruhige, abgedunkelte Fläche in jedem Animationszustand. Blur allein stellt keine Lesbarkeit sicher.
- Panels verwenden feine Konturen und zurückhaltende Rundungen, als Ausgangspunkt etwa 12–20 px. Pillenformen bleiben kompakten Umschaltern und vergleichbaren Bedienelementen vorbehalten.
- Farbige Diagrammserien und fachliche Statusfarben bleiben möglich. Ihre Bedeutung durch Beschriftung, Symbole oder Linienmuster zusätzlich kenntlich machen.
- Bestehende Tabellen- und Diagrammsemantik erhalten. Dekorative Akzentfarben dürfen einen kritischen Status oder eine Variantenzuordnung nicht umdeuten.

## 4. Typografie, Raster und Informationsdichte

Die Basisschrift ist der vorhandene System-Sans-Stack `-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif`. Monospace bleibt Zahlenmarkierungen, kurzen Zeitangaben und technischen Metadaten vorbehalten. Zusätzliche Webfonts sind für die gemeinsame Gestaltung nicht erforderlich.

Vergleichbare Zahlen mit `font-variant-numeric: tabular-nums` ausrichten, sofern die Schrift dies unterstützt. Werte und Einheiten gemeinsam erfassbar halten.

- Überschriften führen mit einer konkreten Aussage. Verwende klare Größenunterschiede, meist mittlere Schriftgewichte und sparsame Hervorhebung. Große Titel brauchen großzügigen Freiraum und einen bewussten Zeilenumbruch.
- Ausgangswerte für neue Bereiche: große Titel ungefähr 40–72 px am Desktop und 30–44 px auf schmalen Ansichten; Lesetext 16–18 px mit etwa 1,5–1,8 Zeilenhöhe. Mit `clamp()` und dem tatsächlichen Inhalt anpassen. Kleine Beschriftungen bleiben deutlich lesbar; wesentliche Inhalte niemals zur Dekoration verkleinern.
- Lange Texte auf ungefähr 60–75 Zeichen pro Zeile begrenzen. Kurze Szenentexte dürfen schmaler stehen. Ein kurzer Titel, ein kompakter Absatz und eine nächste Handlung reichen häufig für eine Phase.
- An der bestehenden Seitenbreite `--page: 1280px` und dem Außenabstand `--gutter: clamp(24px, 5vw, 88px)` orientieren. Abstände möglichst in einer nachvollziehbaren 8-px-Abstufung halten; optische Anpassungen sind erlaubt.
- Gemeinsame Fluchtlinien für Navigation, Überschriften, Texte und Diagramme verwenden. Karten nur einsetzen, wenn sie eine eigenständige Funktion oder Gruppe abgrenzen. Zusammengehöriger Inhalt darf eine gemeinsame Fläche teilen.
- Details passend verdichten: zunächst die zentrale Aussage, danach nachvollziehbare Vertiefung. Quellen, Budgets und Originalannahmen bleiben vollständig; dekorative Kurztexte ersetzen keine fachliche Substanz.

Die kleinen filmischen Randmarkierungen der Referenz sind kein Größenmaßstab für Formulare, Tabellen oder erklärenden Text. Lesbarkeit entscheidet über die endgültigen Maße.

## 5. Bild und Inhalt bilden eine Komposition

Für erzählerische Seiten zuerst die zentrale visuelle Idee festlegen: **Welches Objekt oder welcher Zusammenhang entwickelt sich, und was versteht man durch die nächste Veränderung besser?** Daraus entstehen Szenen, Texte und Bewegung gemeinsam.

Die Roadmap zeigt die Methode: ruhiger Ausgangsort → Standortsuche → Auswahl → Architekturentwurf → Freigabe → Bau → Betrieb. Die Gesamtprojektspur hält den Zusammenhang; entscheidende Teilprojekte und die parallele Dinner-Vorbereitung kommen zum passenden Zeitpunkt hinzu.

- Ein Bildraum kann mehrere Phasen tragen. Hintergrund, Visualisierung und Text müssen aufeinander reagieren, wenn sie denselben Prozess erklären.
- Ein dominanter Schwerpunkt pro Phase. Zusätzliche Panels zeigen die gerade relevanten Beziehungen. In der Roadmap sind das die Gesamtspur, bis zu drei entscheidende Projektspuren und bei Bedarf ein paralleler Kulinarikbereich.
- Räumliche Kontinuität erhalten: Ein ausgewählter Ort bleibt derselbe Ort. Eine Zeichnung und ihr fertiges Objekt teilen Perspektive, Maßstab, Ausschnitt und Anker. Verbindungen enden an den tatsächlich dargestellten Elementen.
- Bildmotive brauchen Freiraum für Typografie und einen geplanten Ausschnitt für schmale Ansichten. Horizont, Licht und Blickrichtung sollen zwischen zusammengehörigen Assets übereinstimmen.
- Fotografien, freigestellte Objekte und Illustrationen lokal und für ihren Zweck komprimiert einbinden. Format, Abmessungen, Alphakanal und Anker dokumentieren, wenn eine Komposition davon abhängt.
- KI-generierte oder hypothetische Motive als Konzeptvisualisierung einordnen. Sie belegen weder einen realen Standort noch eine tatsächlich gewonnene Person oder erteilte Genehmigung. Herkunft beziehungsweise Erzeugung in passenden Asset-Notizen festhalten.
- Exakte Diagramme, Kennzahlen, Beschriftungen und Architektur-Linien als HTML, SVG oder andere nachvollziehbare Datenvisualisierung umsetzen. Information nicht in ein unlesbares Hintergrundbild einbacken.

## 6. Bewegung als gemeinsame Sprache

Bewegung zeigt **Fortschritt, Ursache, Beziehung oder räumliche Kontinuität**. Wähle für jede Übergangsart ein konsistentes Muster. Die Person behält Tempo und Richtung in der Hand.

| Übergang | Ausgangspunkt für neue Komponenten |
| --- | --- |
| Hover, Fokus, gedrückter Zustand | Etwa 160–240 ms; kleine Farb-, Kontur- oder Positionsänderung |
| Inhalts- oder Variantenwechsel | Etwa 400–700 ms; kurzer Crossfade oder geringe Verschiebung; Position und Orientierung erhalten |
| Größerer Szenenwechsel | Etwa 700–1100 ms oder direkt an Scroll-Fortschritt gebunden; kontrollierter Zoom, Pan oder Aufbau |
| Atmosphäre | Langsam und unaufdringlich; Wasser, Licht oder Sterne bewegen sich hinter der Information |

Die Zeitangaben sind Startwerte, keine Wartezeiten vor der Bedienung. Vorhandene passende Übergänge wiederverwenden. Die bestehenden Kurven `cubic-bezier(.2,.75,.2,1)` und `cubic-bezier(.16,1,.3,1)` geben die ruhige Auslaufbewegung vor.

- Native Scroll-Eingaben erhalten. Sticky-Szenen und Scroll-Fortschritt sind möglich; Scroll-Richtung, Geschwindigkeit, Touch oder Tastatur nicht durch ein eigenes Zwangssystem ersetzen.
- Jede zusätzliche Scroll-Strecke muss sichtbare Entwicklung oder notwendige Lesezeit tragen. Tiefe Links, Kapitelsteuerung und der direkte Zugang zum vollständigen Inhalt verkürzen den Weg bei Bedarf.
- Übergänge sollen vorwärts und rückwärts verständlich sein. Rasches Scrollen, direkte Sprünge, Resize und Variantenwechsel dürfen keine leeren oder widersprüchlichen Zwischenzustände hinterlassen.
- Vorzugsweise `transform` und `opacity` animieren. Masken und SVG-Zeichnungen gezielt einsetzen. Layout-Messungen bündeln; keine ungebremsten DOM-Abfragen oder Render-Schleifen pro Scroll-Ereignis.
- Atmosphärische Animation pausiert außerhalb des sichtbaren Bereichs und bei verborgenem Tab. Canvas-Auflösung und Bildrate begrenzen. Die Roadmap verwendet für Atmosphäre maximal 30 fps und begrenzte Zeichenflächen; neue Effekte dürfen diese Kosten nicht unbemerkt vervielfachen.
- Dauerhaft bewegte Texte, hektische Partikel, dauernd pulsierende Aktionen und voneinander unabhängige Einfluganimationen passen nicht zur ruhigen Bildsprache. Kein Autoplay-Ton.

## 7. Bedienbarkeit, schmale Ansichten und reduzierte Bewegung

- Auf schmalen oder flachen Ansichten neu komponieren: Prioritäten, Bildausschnitt, Text und Bedienelemente anpassen. Keine verkleinerte Desktop-Gesamtfläche und keine abgeschnittenen Pflichtinformationen.
- Szenen dürfen in eine lineare Kapitelabfolge wechseln, wenn der Platz nicht reicht. Die Roadmap tut dies unter 560 px Fensterhöhe. Diese automatische Ersatzansicht darf die ausdrücklich gewählte Bewegungseinstellung nicht überschreiben.
- `prefers-reduced-motion` beachten und die vorhandene manuelle Reduktion erhalten. Die reduzierte Ansicht stellt alle Aussagen und Handlungen lesbar bereit; sie zeigt nicht einfach eine stehengebliebene Zwischenphase.
- Native Links, Buttons, Eingabefelder und passende Überschriften verwenden. Sichtbarer Tastaturfokus, sinnvolle Reihenfolge, Beschriftung und erreichbare Touch-Flächen gehören zur Gestaltung. Für neue primäre Touch-Bedienelemente etwa 44 × 44 CSS-px anstreben.
- Zustände wie aktiv, ausgewählt, Fehler und deaktiviert müssen erkennbar sein. Hover darf ergänzen, aber keine notwendige Information oder Aktion allein zugänglich machen.
- Modale Ansichten mit nachvollziehbarem Fokus, Escape zum Schließen und Rückkehr zum Auslöser gestalten. Ein fester Header darf Ankerziele und fokussierte Inhalte nicht verdecken.
- Native Semantik und Textalternativen für informative Bilder erhalten; rein dekorative Ebenen für assistive Technik ausblenden. Fachliche Inhalte außerhalb von Canvas und Animation erreichbar halten.
- Lesbarkeit auf dem tatsächlichen Hintergrund und in den Übergängen prüfen. Darstellung bei vergrößerter Schrift und schmalem Fenster berücksichtigen; breite Datentabellen dürfen einen klar erkennbaren eigenen Scroll-Bereich haben.

## 8. Inhalte und Komponenten konsistent erweitern

Oberflächentexte sind überwiegend deutsch, konkret und ruhig. Beschriftungen benennen Handlung und Ergebnis. Implementierungsdetails, Dateinamen und Agenten-Anweisungen gehören in die Projektdokumentation; die Website erklärt ihr fachliches Thema.

Trenne fachliche Daten, redaktionelle Verdichtung und Darstellung. In Teil 6 ist `data.js` die Quelle für den vollständigen Plan, `story.js` die Erzählung und `cinema.js` die Darstellung ihrer Zustände. Fachliche Änderungen müssen die betroffenen Darstellungen konsistent nachführen; reine Designänderungen lassen die zugrunde liegenden Zahlen unverändert.

Zeitliche Überschneidungen und Abhängigkeiten erhalten: Eine erzählerische Reihenfolge macht parallel geplante Arbeit nicht nachträglich sequenziell. Plantermine und animierte Fortschrittsanzeigen dürfen keinen tatsächlich erreichten Projektstatus oder eine Live-Datenquelle suggerieren.

Neue Komponenten erhalten die gleiche visuelle Grammatik wie bestehende: Typografie, Abstände, Konturen, aktive Zustände, Fokus und Bewegungsart. Kapsele bereichsspezifische CSS-Regeln. Eine gemeinsame Komponente nur dann abstrahieren, wenn sie tatsächlich wiederverwendet wird. Keine zweite globale Navigation, widersprüchliche Variantenwahl oder neue Zustandsquelle für dieselbe Information einführen.

Bei einer neuen größeren Seite genügt vor der Umsetzung eine kurze Arbeitsnotiz im Task oder PR: zentrale Aussage, visuelle Idee, Darstellungsart, Anschluss an Navigation und Daten sowie Verhalten bei wenig Platz und reduzierter Bewegung. Ein zusätzlicher Entwurfsordner ist nicht vorgeschrieben.

## 9. Abnahme nach Änderungsart

Prüfe die geänderten Risiken. Die folgende Tabelle beschreibt die passende Prüftiefe, keine Pflicht zur vollständigen Regression bei jeder kleinen Änderung.

| Änderung | Erforderliche Prüfung |
| --- | --- |
| Nur Markdown/Dokumentation | Aussagen gegen den Bestand prüfen; interne Links, Dateipfade und Agenten-Verweise kontrollieren; Diff auf unbeabsichtigte Änderungen prüfen |
| Text oder fachliche Daten | Quelle und Darstellung abgleichen; betroffene Varianten, Zeilenumbrüche und Links prüfen; Formeln nur testen, wenn sie betroffen sind |
| Layout oder neue Komponente | Betroffene Ansicht im breiten, schmalen und bei Bedarf flachen Fenster prüfen; Überlagerungen, Fokus und relevante Zustände ansehen; aussagekräftigen Screenshot festhalten |
| Animation oder Zustandslogik | Zusätzlich vorwärts/rückwärts scrollen, direkt springen, Varianten wechseln, Resize und reduzierte Bewegung prüfen; relevante Laufzeitfehler und unnötige Animation außerhalb der Ansicht ausschließen |
| Navigation, Rechner oder Speicherung | Betroffene Direktlinks, Zurück-Navigation, gespeicherte Zustände beziehungsweise repräsentative Rechen-/Import-/Exportfälle prüfen |
| Veröffentlichung | Den eigenen Commit im Deployment prüfen und die geänderte Oberfläche beziehungsweise Dokumentation am veröffentlichten Ort kontrollieren |

Für sichtbare Änderungen diese Fragen beantworten:

1. Ist die zentrale Aussage in der jeweiligen Ansicht sofort erkennbar?
2. Haben Farben, Schrift, Abstände und Zustände Anschluss an die restliche Website?
3. Erklärt jede auffällige Bewegung einen Zusammenhang, und bleiben Text und Steuerung ruhig lesbar?
4. Funktioniert der Inhalt auch mit wenig Platz, Tastatur und reduzierter Bewegung?
5. Sind vollständige Daten, Quellen und bestehende Wege weiterhin erreichbar und korrekt?

Nicht verfügbare Prüfungen offen benennen. Die Richtlinie beschreibt den Qualitätsmaßstab; ihre Existenz ist kein Nachweis, dass jede ältere Seite bereits alle Punkte erfüllt.

## 10. Gemeinsame Weiterentwicklung

Änderungen an der übergreifenden Designsprache hier dokumentieren und die betroffenen Komponenten konsistent anpassen. Bereichsspezifische Ausnahmen mit ihrem fachlichen Grund festhalten. Die Einstiegspunkte für Coding-Agenten sind [AGENTS.md](AGENTS.md) und [CLAUDE.md](CLAUDE.md); die Orientierung für Mitbearbeitende steht in der [README](README.md).
