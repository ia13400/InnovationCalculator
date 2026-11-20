# KI-Bewertung einrichten (gemeinsamer Gemini-Schlüssel)

Die Website ist statisch (GitHub Pages) und darf keinen API-Schlüssel enthalten. Deshalb läuft die KI-Bewertung über einen kleinen **Cloudflare Worker**: Er hält den Gemini-Schlüssel geheim, baut den Bewertungsauftrag selbst und gibt nur die zwölf Punktwerte mit Begründungen zurück. Alle Besucher teilen sich das kostenlose Kontingent dieses einen Schlüssels.

Dauer: etwa 10 Minuten. Kosten: keine (kostenlose Stufen von Google AI Studio und Cloudflare, keine Kreditkarte nötig).

## 1. Gemini-API-Schlüssel erstellen

1. [Google AI Studio](https://aistudio.google.com/) mit einem Google-Konto öffnen.
2. **Get API key** → **Create API key** → Schlüssel kopieren.
3. Den Schlüssel nirgends veröffentlichen (nicht ins Repository, nicht in den Chat der Gruppe).

## 2. Worker bei Cloudflare anlegen

1. Kostenloses Konto auf [dash.cloudflare.com](https://dash.cloudflare.com/) anlegen.
2. **Workers & Pages** → **Create** → **Create Worker** (Vorlage „Hello World“) → Name z. B. `innovationsrendite-ki` → **Deploy**.
3. **Edit code** → den gesamten Inhalt durch [`worker.js`](worker.js) aus diesem Ordner ersetzen → **Deploy**.

## 3. Schlüssel und Einstellungen hinterlegen

Im Worker unter **Settings → Variables and Secrets** → **Add**:

| Name | Typ | Wert |
| --- | --- | --- |
| `GEMINI_API_KEY` | **Secret** | der Schlüssel aus Schritt 1 |
| `ALLOWED_ORIGINS` | Text | `https://ia13400.github.io` |
| `MODELS` | Text (optional) | `gemini-3.5-flash-lite,gemini-3.8-flash` |
| `HOURLY_LIMIT` | Text (optional) | `10` (Bewertungen je Besucher und Stunde) |

Danach **Deploy** bzw. speichern.

## 4. Testen

Die Worker-Adresse steht oben im Worker, z. B. `https://innovationsrendite-ki.<dein-name>.workers.dev`. Beim Öffnen im Browser muss `{"ok":true,"service":"innovationsrendite-ki"}` erscheinen.

## 5. Website verbinden

In [`assets/js/ai.js`](../assets/js/ai.js) die Adresse eintragen:

```js
const AI_ENDPOINT='https://innovationsrendite-ki.<dein-name>.workers.dev/';
```

Danach die `?v=`-Version von `ai.js` in `index.html` erneuern und auf `main` pushen. Auf der Ergebnisseite des Ideen-Checks erscheint dann der Knopf **„KI-Bewertung erstellen“**.

Alternativ per Kommandozeile: `npx wrangler deploy` und `npx wrangler secret put GEMINI_API_KEY` in diesem Ordner (Einstellungen siehe `wrangler.toml`).

## Gut zu wissen

- **Kontingent:** Alle Besucher teilen sich die kostenlosen Grenzen des Google-Projekts. Ist es ausgeschöpft, meldet die Website „Das gemeinsame Kontingent ist ausgeschöpft“; das Kontingent setzt sich täglich zurück.
- **Daten:** In der kostenlosen Stufe kann Google die gesendeten Texte zur Verbesserung seiner Dienste verwenden. Die Website weist darauf hin; keine vertraulichen Ideen eingeben.
- **Schutz:** Der Worker nimmt nur Anfragen der eingetragenen Website an, begrenzt Bewertungen je Besucher (bestmöglich, je Worker-Instanz) und kürzt Eingaben. Er bietet keine freie Chat-Funktion. Der Herkunftscheck schützt vor fremden Websites, nicht vor gezielten Skripten; bei Missbrauch den Schlüssel in AI Studio löschen und neu erstellen.
- **Modell wechseln:** `MODELS` ändern; der Worker versucht die Modelle der Reihe nach.
