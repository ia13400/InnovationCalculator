# InnovationCalculator

Innovationsrendite-Rechner nach dem Inno-Rendite-Kalkulator von Prof. Dr. Gerhard Hube (THWS). Studentischer Nachbau für die Vorlesung Innovationsmanagement.

**Live: [ia13400.github.io/InnovationCalculator](https://ia13400.github.io/InnovationCalculator/)**

## Was die Website kann

Die Website hat zwei Reiter:

- **„Eigene Idee prüfen“** (`#idee`)
  - **Ideen-Check:** zwölf Fragen, danach eine Ergebnisseite mit Innovationsrendite, Empfehlung, Rechenweg, Portfolio und Netzgrafik.
  - **Meine Ideen:** Ranking aller Ideen. Hier stehen auch die Arbeitsmappe sowie Export, Import und Zurücksetzen.
  - **Portfolio & Netz** und **Rendite & Bilanz:** alle Ideen im Vergleich.
  - **Feintuning:** alle Kriterien einer Idee mit Begründungen und Gewichtung.
  - **5-Jahres-Kalkulation:** Umsatz, Gewinn und F&E-Kosten, bezogen auf die Kennzahlen des Unternehmens.
- **„Methode & Quellen“** (`#methode`): Formeln und Veröffentlichungen von Prof. Hube.

Dazu kommen zwei Zusatzfunktionen:

- **KI-Bewertung („zweite Meinung“):** Auf der Ergebnisseite bewertet Google Gemini dieselbe Idee. Die Website zeigt beide Bewertungen im Vergleich „Du vs. KI“. Der gemeinsame API-Schlüssel liegt nur im Cloudflare Worker, nicht in der Website (siehe [worker/README.md](worker/README.md)).
- **PDF-Bericht:** „Als PDF exportieren“ (Ergebnisseite) und „Alle Ideen als PDF“ (Meine Ideen) öffnen den Druckdialog. Dort „Als PDF speichern“ wählen.

Alle Daten bleiben im Browser (localStorage, Schlüssel `innorendite.v4`). Zum Austausch gibt es Export und Import als JSON. Ältere Direktlinks (z. B. `#spacex`, `#dinner`, `teil6/`) führen zum Rechner.

## Rechenlogik (Kurzfassung)

| Größe | Formel |
| --- | --- |
| Gewichtete Bewertung | Punkte (0–5) × Gewicht ÷ 100 |
| IN / IA | Summe der gewichteten Bewertungen für Nutzen/Chancen bzw. Aufwand/Risiko |
| Innovationsrendite IR | IN ÷ IA |
| Bilanz | IN − IA |
| Kategorie | < 2 niedrig · 2 bis < 3 mittel · ≥ 3 hoch → Feld im Aufwand/Nutzen-Portfolio |
| 5-Jahres-Kalkulation | Gewinnanteil am Unternehmensgewinn und Kostenanteil am F&E-Budget, umgerechnet in Punkte nach den Skalen von Prof. Hube |

Die Formeln entsprechen dem Excel-Werkzeug. Die Website zeigt sie mit den eingesetzten Zahlen unter „So wurde gerechnet“, das PDF ebenso.

## Dateistruktur

```
InnovationCalculator/
├── index.html              Einstieg: Kopfzeile, Reiter, Werkzeugbereich; bindet CSS und JS in fester Reihenfolge ein
├── assets/
│   ├── css/                Gestaltung, in dieser Reihenfolge geladen
│   │   ├── tokens.css      Farben, Schriften, Abstände (CSS-Variablen)
│   │   ├── base.css        Seite, Typografie, Kopfzeile, Schrittleiste
│   │   ├── wizard.css      Ideen-Check und Ergebnisseite
│   │   ├── components.css  Panels, Knöpfe, Chips, Tabellen, Kennzahlen
│   │   ├── calculator.css  Portfolio, Feintuning, 5-Jahres-Kalkulation
│   │   ├── charts.css      Diagramme
│   │   ├── features.css    Rechenweg und KI-Bewertung
│   │   ├── method.css      Methode & Quellen, Fußzeile
│   │   ├── motion.css      Übergänge (nur ohne „reduzierte Bewegung“)
│   │   └── print.css       PDF-Bericht (nur im Druck)
│   └── js/                 Klassische Skripte ohne Build-Schritt; jede Datei nutzt nur zuvor geladene
│       ├── core/           Fachlogik ohne Oberfläche
│       │   ├── criteria.js   Zwölf Kriterien, Standardgewichte, Portfolio-Felder, Empfehlungen
│       │   ├── model.js      Berechnung: IN, IA, IR, Bilanz, Kategorien, 5-Jahres-Kalkulation
│       │   └── format.js     Zahlen- und Textformatierung, HTML-Maskierung
│       ├── store/          Daten
│       │   ├── seed.js       Startwerte einer neuen Arbeitsmappe
│       │   └── state.js      Laden, Migrieren und Speichern im Browser; Zustand der Oberfläche
│       ├── ui/             Wiederverwendbare Bausteine
│       │   ├── components.js Hinweise, Chips, Ideen-Auswahl
│       │   ├── charts.js     Balken, Netzgrafik, Portfolio (SVG/HTML)
│       │   └── formulas.js   Rechenweg mit eingesetzten Zahlen
│       ├── views/          Ansichten (erzeugen nur Markup)
│       │   ├── panels.js     Gewichtung, Bezugsgrößen, Arbeitsmappe, Teilen und sichern
│       │   ├── wizard.js     Ideen-Check und Ergebnisseite
│       │   ├── compare.js    Meine Ideen, Portfolio & Netz, Rendite & Bilanz
│       │   ├── assess.js     Feintuning
│       │   ├── fy.js         5-Jahres-Kalkulation
│       │   └── method.js     Methode & Quellen
│       ├── features/
│       │   ├── ai.js         KI-Bewertung über den Worker
│       │   └── report.js     PDF-Bericht (Druckansicht)
│       └── app/            Anwendung
│           ├── navigation.js Schritte, Rendering, Seitenwechsel
│           ├── actions.js    Knopf-Aktionen (data-act → Funktion)
│           ├── events.js     Klick-, Eingabe- und Tastatur-Ereignisse
│           └── main.js       Start und Direktlinks (wird zuletzt geladen)
├── worker/                 Cloudflare Worker für die KI-Bewertung (hält den Gemini-Schlüssel als Secret)
│   ├── worker.js
│   ├── wrangler.toml
│   └── README.md           Einrichtung Schritt für Schritt
├── teil6/index.html        Weiterleitung früherer Links auf den Rechner
├── .nojekyll               GitHub Pages liefert die Dateien unverändert aus
├── AGENTS.md               Arbeitsregeln für Coding-Agenten (Architektur, Prüfung, Veröffentlichung)
├── CLAUDE.md               Importiert AGENTS.md für Claude Code
└── DESIGN.md               Gestaltungsrichtlinie
```

Jede JavaScript-Datei beginnt mit einem Kopfkommentar: Aufgabe, benötigte Dateien und bereitgestellte Funktionen. Die Abhängigkeiten laufen nur in eine Richtung: `core` → `store` → `ui` → `views` → `features` → `app`.

## Lokal starten und veröffentlichen

- **Lokal:** `index.html` direkt öffnen oder `python3 -m http.server` im Repository starten und `http://localhost:8000/` aufrufen. Ein Build-Schritt ist nicht nötig.
- **Cache-Versionen:** Nach Änderungen an einer CSS- oder JS-Datei in `index.html` die `?v=`-Angabe dieser Datei erneuern. Sie besteht aus den ersten zwölf Hex-Zeichen des SHA-256 der Datei.
- **Hosting:** GitHub Pages aus Branch `main`, Ordner `/ (root)`. Jeder Push auf `main` veröffentlicht automatisch.

## Mitarbeiten

Für die Gestaltung gilt [DESIGN.md](DESIGN.md), für Arbeitsweise und Architektur [AGENTS.md](AGENTS.md).
