/* ============================== KI-Bewertung ============================== */
/* Zweite Meinung durch ein KI-Modell über den gemeinsamen Dienst (Cloudflare Worker, siehe worker/README.md).
   Der API-Schlüssel liegt nur im Worker. Nach der Einrichtung hier die Worker-Adresse eintragen. */
const AI_ENDPOINT='https://mute-union-8e80.salluma0711.workers.dev/';
const AI_TIMEOUT=60000;
const aiOf=a=>a&&state.list.find(x=>x.aiOf===a.id);
const aiParent=a=>a&&a.aiOf&&state.list.find(x=>x.id===a.aiOf);
const aiModelName=m=>m?String(m).split('-').map(w=>w.charAt(0).toUpperCase()+w.slice(1)).join(' '):'KI';

async function requestAI(a){
  if(!AI_ENDPOINT)throw new Error('Der KI-Dienst ist noch nicht verbunden.');
  const b=state.base,fy=a.fy&&a.link?calcFY(a.fy,b):null;
  const body={idea:{name:a.project,desc:a.desc||''},
    company:{name:b.company,currency:b.currency,revenue:b.revenue,profit:b.profit,rnd:b.rnd},
    fy:fy?{profit5:Math.round(fy.P),rnd5:Math.round(fy.C)}:null};
  const ctl=new AbortController(),t=setTimeout(()=>ctl.abort(),AI_TIMEOUT);
  let res,data;
  try{res=await fetch(AI_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),signal:ctl.signal});
    data=await res.json().catch(()=>({}))}
  catch(e){throw new Error(e.name==='AbortError'?'Die KI hat nicht rechtzeitig geantwortet. Bitte erneut versuchen.':'Der KI-Dienst ist nicht erreichbar.')}
  finally{clearTimeout(t)}
  if(!res.ok||!data.scores)throw new Error(data.error||`Der KI-Dienst meldet einen Fehler (${res.status}).`);
  const pick=list=>list.map(c=>{const v=Math.round(+data.scores[c.k]);return Number.isFinite(v)?Math.max(0,Math.min(5,v)):0});
  const why={};[...N_CRIT,...A_CRIT].forEach(c=>{why[c.k]=String((data.why||{})[c.k]||'')});
  const old=aiOf(a);
  const k={id:old?old.id:'k'+Date.now().toString(36),project:a.project,desc:a.desc||'',assessor:'KI · '+aiModelName(data.model),aiOf:a.id,
    aiModel:data.model||'',aiSummary:String(data.summary||''),aiAt:Date.now(),idea:'',link:false,n:pick(N_CRIT),a:pick(A_CRIT),why,fy:null};
  if(old)state.list[state.list.indexOf(old)]=k;else state.list.splice(state.list.indexOf(a)+1,0,k);
  save();return k;
}

function vAI(a){
  const par=aiParent(a);
  if(a.aiOf)return `<section class="panel ai"><header><h2>KI-Bewertung</h2><span class="muted">${esc(aiModelName(a.aiModel))}${a.aiAt?' · '+new Date(a.aiAt).toLocaleDateString('de-DE'):''}</span></header>
    <p class="muted">Diese Bewertung hat die KI für „${esc(a.project)}“ erstellt. Sie ist eine zweite Meinung und ersetzt keine eigene Einschätzung.</p>
    ${par?`<div class="row" style="margin-top:16px"><button class="btn" data-wizopen="${par.id}">Zur eigenen Bewertung und zum Vergleich</button></div>`:''}</section>`;
  const k=aiOf(a),busy=ui.aiBusy===a.id,err=ui.aiErr&&ui.aiErr.id===a.id?ui.aiErr.msg:'';
  const privacy=`<p class="fine">Beim Erstellen werden Name, Beschreibung und die Unternehmenskennzahlen an Google Gemini gesendet (kostenlose Stufe, Google kann die Daten zur Verbesserung seiner Dienste nutzen). Bitte keine vertraulichen Ideen eingeben.</p>`;
  if(!k){
    const off=!AI_ENDPOINT;
    return `<section class="panel ai"><header><h2>Zweite Meinung: <em>KI-Bewertung</em></h2><span class="muted">Team vs. KI</span></header>
     <div class="ai-start"><p>Lass dieselben zwölf Kriterien unabhängig von einer KI bewerten, mit Begründung je Kriterium. Danach siehst du beide Bewertungen nebeneinander, und die KI-Bewertung erscheint auch im Ranking, Portfolio und in der Netzgrafik.</p>
      ${a.desc?'':'<p class="muted">Tipp: Mit einer kurzen Beschreibung der Idee wird die KI-Bewertung deutlich genauer.</p>'}
      <div class="row"><button class="btn primary" data-act="ai" ${busy||off?'disabled':''}>${busy?'<span class="spin" aria-hidden="true"></span>KI bewertet …':'KI-Bewertung erstellen →'}</button>
      ${off?'<span class="muted">Der KI-Dienst ist noch nicht verbunden.</span>':''}</div>
      ${err?`<div class="notice">${esc(err)}</div>`:''}${privacy}</div></section>`;
  }
  const r=calc(a),q=calc(k);
  const rows=(list,g)=>list.map((c,i)=>{const u=(g==='n'?r.n:r.x)[i],v=(g==='n'?q.n:q.x)[i],d=(+v||0)-(+u||0);
    return `<tr><td>${esc(c.t)}</td><td class="r num">${u??'–'}</td><td class="r num">${v??'–'}</td><td class="r num ${d===0?'muted':''}">${d>0?'+':''}${d}</td><td class="why-ai">${esc(k.why[c.k]||'')}</td></tr>`}).join('');
  const col=(lab,x,cls)=>`<div class="tile"><span class="eyebrow">${lab}</span><span class="v ${cls}">${f2(x.IR)}</span><span class="s">Nutzen ${f2(x.IN)} · Aufwand ${f2(x.IA)} · ${esc(x.pf[0])}</span></div>`;
  return `<section class="panel ai"><header><h2>Du vs. <em>KI</em></h2><span class="muted">${esc(aiModelName(k.aiModel))} · ${new Date(k.aiAt).toLocaleDateString('de-DE')}</span></header>
   <div class="tiles" style="margin-bottom:22px">${col('Deine Rendite',r,'acc')}${col('Rendite laut KI',q,'gain')}</div>
   ${k.aiSummary?`<p class="ai-summary">„${esc(k.aiSummary)}“</p>`:''}
   <div class="tablewrap"><table class="cmp"><thead><tr><th>Kriterium</th><th class="r">Du</th><th class="r">KI</th><th class="r">Diff.</th><th>Begründung der KI</th></tr></thead>
    <tbody><tr class="grp"><td colspan="5">Nutzen/Chancen</td></tr>${rows(N_CRIT,'n')}<tr class="grp"><td colspan="5">Aufwand/Risiko</td></tr>${rows(A_CRIT,'a')}</tbody></table></div>
   <div class="row" style="margin-top:18px"><button class="btn" data-act="ai" ${busy||!AI_ENDPOINT?'disabled':''}>${busy?'<span class="spin" aria-hidden="true"></span>KI bewertet …':'Neu bewerten lassen'}</button><button class="btn" data-wizopen="${k.id}">KI-Bewertung einzeln öffnen</button></div>
   ${err?`<div class="notice" style="margin-top:12px">${esc(err)}</div>`:''}${privacy}</section>`;
}
