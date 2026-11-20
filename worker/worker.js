/**
 * KI-Bewertung für den Innovationsrendite-Rechner (Cloudflare Worker).
 *
 * Der Worker hält den gemeinsamen Gemini-API-Schlüssel als Secret (GEMINI_API_KEY).
 * Die Website schickt nur Name und Beschreibung einer Idee (plus Unternehmenskennzahlen);
 * der Worker baut den Bewertungsauftrag selbst und gibt ausschließlich die zwölf Punktwerte
 * mit Begründungen zurück. Freie Chat-Anfragen sind damit nicht möglich.
 *
 * Einstellungen (Cloudflare → Worker → Settings → Variables and Secrets):
 *   GEMINI_API_KEY   Secret, Pflicht
 *   ALLOWED_ORIGINS  Komma-getrennt, Standard: https://ia13400.github.io
 *   MODELS           Komma-getrennt, Standard: gemini-3.5-flash-lite,gemini-3.8-flash
 *   HOURLY_LIMIT     Bewertungen je Besucher (IP) und Stunde, Standard: 10
 */

const CRITERIA = [
  ['wirt', 'Wirtschaftlicher Nutzen', 'Umsatz/Gewinn oder Einsparpotenzial als Gewinnanteil am Unternehmensgewinn des letzten Jahres über 5 Jahre. Skala: 0 kein Gewinn · 1 ≤ 3 % · 2 ≤ 5 % · 3 ≤ 20 % · 4 ≤ 30 % · 5 > 30 %.'],
  ['kunde', 'Wahrnehmbarer Kundennutzen', 'Kann auch ein interner Kunde sein.'],
  ['komp', 'Nutzen durch neue Kompetenzen und Fähigkeiten', 'Werden Fähigkeiten aufgebaut, die auch für andere Anwendungsfelder oder Märkte wertvoll sind?'],
  ['trend', 'Chancen durch Zukunftsmarkt/Trend', 'Liegt die Idee in einem langfristigen Trend mit großen Chancen und Potenzialen?'],
  ['nachh', 'Nachhaltigkeits-Nutzen', 'Ökologischer und/oder sozialer Nutzen neben dem ökonomischen.'],
  ['bauchN', 'Nutzen/Chancen gesamt nach Bauchgefühl', 'Gesamteindruck.'],
  ['fue', 'Investitionsaufwand für Entwicklung und Kompetenzaufbau (F&E)', 'Kumulierte F&E-Kosten über 5 Jahre als Anteil am F&E-Budget des letzten Jahres. Skala: 0 keine Kosten · 1 ≤ 10 % · 2 ≤ 20 % · 3 ≤ 50 % · 4 ≤ 100 % · 5 > 100 %.'],
  ['kundeA', 'Aufwand, Kunden zu überzeugen', 'Wie schwer ist es, Kunden zum Nutzen und Kauf zu bewegen?'],
  ['tech', 'Erfolgsrisiko (technische) Umsetzbarkeit', 'Komplexität, Verfügbarkeit, weitere Unsicherheiten.'],
  ['markt', 'Erfolgsrisiko Markt und Wettbewerb', 'Wettbewerber, Marktdynamik (VUCA), gesetzliche Rahmenbedingungen.'],
  ['intern', 'Aufwand, intern zu überzeugen, und Umstellungsaufwand', 'Widerstand in der Organisation, Änderungen an Prozessen und Strukturen.'],
  ['bauchA', 'Aufwand/Risiko gesamt nach Bauchgefühl', 'Gesamteindruck.'],
];
const KEYS = CRITERIA.map(c => c[0]);
const LIMITS = { name: 120, desc: 1500, company: 120, currency: 8 };
const hits = new Map(); // best effort: gilt je Worker-Instanz

export default {
  async fetch(request, env) {
    const origins = (env.ALLOWED_ORIGINS || 'https://ia13400.github.io').split(',').map(s => s.trim()).filter(Boolean);
    const origin = request.headers.get('Origin') || '';
    const allowed = origins.includes(origin);
    const cors = {
      'Access-Control-Allow-Origin': allowed ? origin : origins[0],
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
      'Vary': 'Origin',
    };
    const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json; charset=utf-8' } });

    if (request.method === 'OPTIONS') return new Response(null, { status: allowed ? 204 : 403, headers: cors });
    if (request.method === 'GET') return json({ ok: true, service: 'innovationsrendite-ki' });
    if (request.method !== 'POST') return json({ error: 'Nur POST erlaubt.' }, 405);
    if (!allowed) return json({ error: 'Diese Website darf den Dienst nicht verwenden.' }, 403);
    if (!env.GEMINI_API_KEY) return json({ error: 'Der Dienst ist noch nicht eingerichtet (GEMINI_API_KEY fehlt).' }, 503);

    // einfache Begrenzung je Besucher
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const limit = Math.max(1, parseInt(env.HOURLY_LIMIT || '10', 10));
    const now = Date.now();
    const recent = (hits.get(ip) || []).filter(t => now - t < 3600e3);
    if (recent.length >= limit) return json({ error: `Limit erreicht: höchstens ${limit} KI-Bewertungen pro Stunde. Bitte später erneut versuchen.` }, 429);
    recent.push(now); hits.set(ip, recent);
    if (hits.size > 5000) hits.clear();

    let input;
    try { input = await request.json(); } catch { return json({ error: 'Ungültige Anfrage.' }, 400); }
    const clean = (v, n) => String(v ?? '').replace(/\s+/g, ' ').trim().slice(0, n);
    const num = v => (Number.isFinite(+v) ? +v : 0);
    const idea = { name: clean(input?.idea?.name, LIMITS.name), desc: clean(input?.idea?.desc, LIMITS.desc) };
    if (!idea.name) return json({ error: 'Name der Idee fehlt.' }, 400);
    const co = input?.company || {};
    const company = { name: clean(co.name, LIMITS.company) || 'unbekanntes Unternehmen', currency: clean(co.currency, LIMITS.currency) || 'EUR',
      revenue: num(co.revenue), profit: num(co.profit), rnd: num(co.rnd) };
    const fy = input?.fy && typeof input.fy === 'object' ? { profit5: num(input.fy.profit5), rnd5: num(input.fy.rnd5) } : null;

    const prompt = buildPrompt(idea, company, fy);
    const models = (env.MODELS || 'gemini-3.5-flash-lite,gemini-3.8-flash').split(',').map(s => s.trim()).filter(Boolean);
    let lastErr = 'Keine Antwort vom Modell.';
    for (const model of models) {
      try {
        const out = await callGemini(env.GEMINI_API_KEY, model, prompt);
        return json({ ...out, model });
      } catch (e) {
        lastErr = e.message || String(e); // nächstes Modell versuchen (z. B. Modell nicht verfügbar oder Kontingent erschöpft)
      }
    }
    return json({ error: 'KI-Bewertung fehlgeschlagen: ' + lastErr }, 502);
  },
};

function buildPrompt(idea, c, fy) {
  const list = CRITERIA.map(([k, t, d], i) => `${i + 1}. ${k} – ${t}: ${d}`).join('\n');
  const fyText = fy ? `\nAus der 5-Jahres-Kalkulation des Nutzers: Gewinn über 5 Jahre ${fy.profit5} ${c.currency}, F&E-Kosten über 5 Jahre ${fy.rnd5} ${c.currency}. Nutze diese Werte für „wirt“ und „fue“ nach der jeweiligen Skala.` : '';
  return `Du bewertest eine Innovationsidee nach dem Innovations-Rendite-Kalkulator von Prof. Dr. Gerhard Hube.
Vergib für jedes der zwölf Kriterien eine ganze Zahl von 0 (nicht vorhanden) bis 5 (sehr hoch) und begründe sie in ein bis zwei sachlichen Sätzen auf Deutsch.
Kriterien 1–6 sind Nutzen/Chancen, Kriterien 7–12 sind Aufwand/Risiko (hoher Wert = hoher Aufwand bzw. hohes Risiko).
Sei kritisch und realistisch; vergib keine Punkte aus Höflichkeit. Erfinde keine Fakten, kennzeichne Annahmen als Annahmen.

Unternehmen: ${c.name}. Kennzahlen des letzten Jahres (Mio ${c.currency}): Umsatz ${c.revenue}, Gewinn ${c.profit}, F&E-Kosten ${c.rnd}.${fyText}

Idee: ${idea.name}
Beschreibung: ${idea.desc || '(keine Beschreibung angegeben)'}

Kriterien:
${list}

Antworte nur mit JSON in dieser Form:
{"scores":{"wirt":0,…,"bauchA":0},"why":{"wirt":"…",…,"bauchA":"…"},"summary":"ein Satz Gesamturteil"}`;
}

async function callGemini(key, model, prompt) {
  const props = Object.fromEntries(KEYS.map(k => [k, { type: 'INTEGER' }]));
  const whyProps = Object.fromEntries(KEYS.map(k => [k, { type: 'STRING' }]));
  const schema = { type: 'OBJECT', properties: { scores: { type: 'OBJECT', properties: props, required: KEYS }, why: { type: 'OBJECT', properties: whyProps, required: KEYS }, summary: { type: 'STRING' } }, required: ['scores', 'why', 'summary'] };
  const send = async withSchema => {
    const body = { contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.3, responseMimeType: 'application/json', ...(withSchema ? { responseSchema: schema } : {}) } };
    return fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key }, body: JSON.stringify(body) });
  };
  let res = await send(true);
  if (res.status === 400) res = await send(false); // falls das Schemaformat nicht akzeptiert wird
  if (!res.ok) {
    const t = await res.text();
    const msg = res.status === 429 ? 'Das gemeinsame Kontingent ist ausgeschöpft. Bitte später erneut versuchen.' : `Gemini ${model}: HTTP ${res.status} ${t.slice(0, 200)}`;
    const err = new Error(msg); err.status = res.status; throw err;
  }
  const data = await res.json();
  const text = (data?.candidates?.[0]?.content?.parts || []).map(p => p.text || '').join('');
  return validate(parseJson(text));
}

function parseJson(text) {
  const t = String(text).replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();
  try { return JSON.parse(t); } catch {}
  const m = t.match(/\{[\s\S]*\}/);
  if (m) return JSON.parse(m[0]);
  throw new Error('Antwort des Modells war kein JSON.');
}

function validate(o) {
  const scores = {}, why = {};
  for (const k of KEYS) {
    const v = Math.round(Number(o?.scores?.[k]));
    if (!Number.isFinite(v)) throw new Error(`Wert für „${k}“ fehlt.`);
    scores[k] = Math.max(0, Math.min(5, v));
    why[k] = String(o?.why?.[k] ?? '').trim().slice(0, 600);
  }
  return { scores, why, summary: String(o?.summary ?? '').trim().slice(0, 400) };
}
