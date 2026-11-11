/* ============================== Views ============================== */
function ranked(){return state.list.map(a=>({a,r:calc(a)})).sort((p,q)=>(q.r.IR===Infinity?1e9:q.r.IR)-(p.r.IR===Infinity?1e9:p.r.IR))}
const emptyMsg=()=>`<section class="panel"><p style="font-size:1.15rem">${isX()?'Noch keine Bewertungen.':'Noch keine Idee geprüft. Starte mit dem Ideen-Check.'}</p>${isX()?'':'<div class="row" style="margin-top:16px"><button class="btn primary" data-tabgo="wizard">Zum Ideen-Check</button></div>'}</section>`;
function wNotice(){const ok=sum(state.w.n)===100&&sum(state.w.a)===100;return ok?'':`<div class="notice">Die Gewichte ergeben nicht je 100 % (Nutzen ${sum(state.w.n)} %, Aufwand ${sum(state.w.a)} %). Unter „Einstellungen“ korrigieren.</div>`}
function vRanking(){
  const L=state.list;if(!L.length)return emptyMsg();
  const R=ranked(),best=R[0];
  const avgN=sum(R.map(o=>o.r.IN))/R.length, avgA=sum(R.map(o=>o.r.IA))/R.length;
  return `${wNotice()}
  <section class="tiles">
    <div class="tile"><span class="eyebrow">Höchste Rendite</span><span class="v acc">${f2(best.r.IR)}</span><span class="s">${esc(best.a.project)}</span></div>
    <div class="tile"><span class="eyebrow">Bewertungen</span><span class="v">${L.length}</span><span class="s">${esc(state.horizon)}</span></div>
    <div class="tile"><span class="eyebrow">Ø Nutzen</span><span class="v gain">${f2(avgN)}</span><span class="s">von 5</span></div>
    <div class="tile"><span class="eyebrow">Ø Aufwand</span><span class="v cost">${f2(avgA)}</span><span class="s">von 5</span></div>
  </section>
  <section class="panel"><header><h2>Ranking nach Innovationsrendite</h2><span class="muted">Zeile anklicken für Details</span></header>
   <div class="tablewrap"><table><thead><tr><th>#</th><th>Idee</th><th class="r">Nutzen</th><th class="r">Aufwand</th><th class="r">Rendite</th><th>Portfolio</th></tr></thead><tbody>
   ${R.map((o,i)=>`<tr class="clickable" data-open="${o.a.id}"><td class="num" style="font-size:1.3rem">${i+1}</td><td><span class="row" style="flex-wrap:nowrap"><i class="dot" style="background:${colorOf(o.a)}"></i><span><b style="font-size:1.1rem">${esc(o.a.project)}</b>${o.a.assessor?`<br><span class="muted">${esc(o.a.assessor)}</span>`:''}</span></span></td>
   <td class="r num">${f2(o.r.IN)}</td><td class="r num">${f2(o.r.IA)}</td><td class="r">${irChip(o.r)}</td><td>${pfChip(o.r)}</td></tr>`).join('')}
   </tbody></table></div></section>`;
}
function vPortfolio(){
  const L=state.list;if(!L.length)return emptyMsg();
  return `<section class="panel"><header><h2>Aufwand/Nutzen-Portfolio</h2></header>${portfolio(L)}</section>
  <section class="panel"><header><h2>Netzgrafik</h2><span class="muted">Alle zwölf Einzelbewertungen, 0 bis 5</span></header><div class="chartbox">${radar(L)}</div>${legend(L)}</section>`;
}
function vBars(){
  const L=state.list;if(!L.length)return emptyMsg();const R=ranked().map(o=>o.a);
  return `<section class="panel"><header><h2>Rendite</h2><span class="muted">Nutzen ÷ Aufwand · gestrichelte Linie = 1</span></header>${barChart(R,{key:'IR',ref:1,title:'Rendite je Bewertung'})}</section>
  <section class="panel"><header><h2>Bilanz</h2><span class="muted">Nutzen − Aufwand</span></header>${barChart(R,{key:'bil',title:'Bilanz je Bewertung'})}</section>`;
}
function vTop(){
  const R=ranked();
  return `<section class="cards">${R.map(({a,r})=>{const vc=r.IR>=1.5?'ok':r.IR>=1?'mid':'bad';return `<button class="card" style="--c:${colorOf(a)}" data-open="${a.id}">
    <div><div class="eyebrow">${esc(a.assessor||'')}</div><h3>${esc(a.project)}</h3></div>
    <div class="ir giant ${vc}" style="font-size:4.2rem">${f2(r.IR)}</div>
    <div class="bar2"><div class="t"><span>Nutzen</span><b class="num" style="color:var(--gain)">${f2(r.IN)}</b></div><div class="track"><div class="fill" style="width:${r.IN/5*100}%;background:var(--gain)"></div></div></div>
    <div class="bar2"><div class="t"><span>Aufwand</span><b class="num" style="color:var(--cost)">${f2(r.IA)}</b></div><div class="track"><div class="fill" style="width:${r.IA/5*100}%;background:var(--cost)"></div></div></div>
    <div>${pfChip(r)}</div></button>`}).join('')}</section>`;
}
function vDetail(){
  const a=cur();if(!a)return emptyMsg();
  if(ui.edit)return `<div class="row"><button class="btn primary" data-act="readmode">✓ Fertig bearbeitet</button></div>`+vAssess();
  const r=calc(a),vc=r.IR>=1.5?'ok':r.IR>=1?'mid':'bad';
  const rows=(list,g)=>list.map((c,i)=>{const sc=(g==='n'?r.n:r.x)[i],w=state.w[g][i];const locked=c.quant&&a.link&&a.fy;
    return `<div class="rrow"><div class="score ${g==='n'?'g':'c'}">${sc??'–'}</div><div><h4>${esc(c.t)}</h4><div class="w">Gewicht ${w} % · gewichtet ${f2((+sc||0)*w/100)}</div>
     <p>${locked?esc(quantWhy(a,g==='n'?'gain':'cost')):''} ${esc(a.why[c.k]||'')}</p></div></div>`}).join('');
  return `<section class="panel">${picker(false)}</section>
  <section class="panel"><div class="res-hero"><div class="giant ${vc}">${f2(r.IR)}</div>
    <div style="display:grid;gap:12px"><div class="eyebrow">${esc(a.assessor||'')}</div><h2>${esc(a.project)}</h2><div>${pfChip(r).replace('class="chip','class="chip big')}</div>
    <p class="verdict-line">Nutzen <b class="num" style="color:var(--gain)">${f2(r.IN)}</b> · Aufwand <b class="num" style="color:var(--cost)">${f2(r.IA)}</b> · Bilanz <b class="num">${r.bil>=0?'+':''}${f2(r.bil)}</b></p>
    <div class="row"><button class="btn" data-act="editmode">Bewertung bearbeiten</button>${a.fy?'<button class="btn" data-tabgo="fy">Zur 5-Jahres-Kalkulation</button>':''}</div></div></div></section>
  <div class="grid2">
   <section class="panel"><div class="block-title gain"><h3>Nutzen/Chancen</h3><span class="num" style="font-size:1.3rem">${f2(r.IN)}</span></div>${rows(N_CRIT,'n')}</section>
   <section class="panel"><div class="block-title cost"><h3>Aufwand/Risiko</h3><span class="num" style="font-size:1.3rem">${f2(r.IA)}</span></div>${rows(A_CRIT,'a')}</section>
  </div>`;
}
function picker(withAdd=true){
  return `<div class="picker" role="group" aria-label="Bewertung wählen">${state.list.map(a=>`<button aria-pressed="${a.id===ui.sel[ui.ctx]}" data-sel="${a.id}"><i class="dot" style="background:${colorOf(a)}"></i>${esc(label(a))}</button>`).join('')}
  ${withAdd?`<button data-act="new">${isX()?'+ Neue Bewertung':'+ Neue Idee'}</button>`:''}</div>`;
}
function critBlock(list,arr,scoresEff,kind,a){
  return list.map((c,i)=>{
    const locked=c.quant&&a.link&&a.fy;const val=scoresEff[i];const w=state.w[kind==='gain'?'n':'a'][i];
    return `<div class="crit"><div><div class="name">${esc(c.t)}</div>${locked?`<div class="linked">Automatisch aus der 5-Jahres-Kalkulation</div>`:''}</div>
     <div class="row" style="justify-content:flex-end"><div class="seg ${kind}" role="group" aria-label="${esc(c.t)}">${[0,1,2,3,4,5].map(s=>`<button aria-pressed="${val===s}" ${locked?'disabled':''} data-score="${kind}:${i}:${s}">${s}</button>`).join('')}</div>
     <span class="meta">× ${w} % = <b data-out="w-${kind}-${i}">${f2((+val||0)*w/100)}</b></span></div>
     <div class="desc">${esc(c.d)}</div>
     ${locked?`<div class="why muted">${quantWhy(a,kind)}</div>`:''}
     <div class="why"><textarea class="in" rows="1" placeholder="${locked?'Ergänzende Begründung (optional)':'Begründung'}" data-why="${c.k}" aria-label="Begründung ${esc(c.t)}">${esc(a.why[c.k]||'')}</textarea></div></div>`}).join('');
}
function quantWhy(a,kind){const c=calcFY(a.fy,state.base),cu=esc(state.base.currency);
  return kind==='gain'?`Quantitativ: 5-Jahres-Gewinn ${fMio(c.P)} ${cu} = ${fPct(c.pShare)} des Unternehmensgewinns (${fInt(state.base.profit)} Mio ${cu}) → Bewertung ${c.pRating}.`
  :`Quantitativ: kumulierte F&E-Kosten ${fMio(c.C)} ${cu} = ${fPct(c.cShare)} des F&E-Budgets (${fInt(state.base.rnd)} Mio ${cu}) → Bewertung ${c.cRating}.`}
function resultCard(a){
  const r=calc(a);const maxv=5;
  const vcls={g:'ok',y:'mid',r:'bad'}[r.pf[1]];
  return `<div class="panel result-card sticky">
   <div><div class="eyebrow">Innovationsrendite</div><div class="giant ${r.IR>=1.5?'ok':r.IR>=1?'mid':'bad'}" style="font-size:5rem">${f2(r.IR)}</div><div class="muted">${r.IR>=1?'„profitabel“: Nutzen übersteigt Aufwand':'nicht „profitabel“: Aufwand übersteigt Nutzen'}</div></div>
   <div class="bar2"><div class="t"><span>Nutzen/Chancen IN</span><b class="num" style="color:var(--gain)">${f2(r.IN)}</b></div><div class="track"><div class="fill" style="width:${r.IN/maxv*100}%;background:var(--gain)"></div></div></div>
   <div class="bar2"><div class="t"><span>Aufwand/Risiko IA</span><b class="num" style="color:var(--cost)">${f2(r.IA)}</b></div><div class="track"><div class="fill" style="width:${r.IA/maxv*100}%;background:var(--cost)"></div></div></div>
   <table><tbody>
    <tr><td>Bilanz IN − IA</td><td class="r num">${r.bil>=0?'+':''}${f2(r.bil)}</td></tr>
    <tr><td>Mittelwert Nutzen</td><td class="r num">${f2(r.mN)}</td></tr>
    <tr><td>Mittelwert Aufwand</td><td class="r num">${f2(r.mA)}</td></tr>
    <tr><td>Kategorie Nutzen / Aufwand</td><td class="r">${catName(r.cN)} / ${catName(r.cA)}</td></tr>
   </tbody></table>
   <div class="verdict chip ${vcls}" style="display:block;border-radius:var(--r);white-space:normal">Portfolio: ${esc(r.pf[0])}</div>
  </div>`;
}
const Q={
 wirt:'Wie viel Gewinn bringt die Idee im Vergleich zum heutigen Unternehmensgewinn?',
 kunde:'Wie deutlich spüren Kunden den Nutzen?',
 komp:'Baut ihr damit Fähigkeiten auf, die auch anderswo wertvoll sind?',
 trend:'Wie stark trägt ein langfristiger Trend die Idee?',
 nachh:'Wie groß ist der ökologische oder soziale Nutzen?',
 bauchN:'Dein Bauchgefühl: Wie groß ist der Nutzen insgesamt?',
 fue:'Wie hoch sind die Entwicklungskosten im Vergleich zum F&E-Budget?',
 kundeA:'Wie schwer wird es, Kunden zu überzeugen?',
 tech:'Wie hoch ist das technische Risiko?',
 markt:'Wie riskant sind Markt, Wettbewerb und Regulierung?',
 intern:'Wie viel Widerstand und Umstellung gibt es intern?',
 bauchA:'Dein Bauchgefühl: Wie groß sind Aufwand und Risiko insgesamt?'};
const OPT_L=['nicht vorhanden','sehr gering','gering','mittel','hoch','sehr hoch'];
const OPT_Q={wirt:['kein Gewinn','≤ 3 %','≤ 5 %','≤ 20 %','≤ 30 %','> 30 %'],fue:['keine Kosten','≤ 10 %','≤ 20 %','≤ 50 %','≤ 100 %','> 100 %']};
const ADVICE={'Quick win':'Wenig Aufwand bei ordentlichem Nutzen: zügig umsetzen.',
 'Fast zu schön um wahr zu sein!':'Hoher Nutzen bei geringem Aufwand. Prüft eure Annahmen noch einmal kritisch.',
 'Nutzen prüfen/steigern!':'Wenig Aufwand, aber auch wenig Nutzen. Wie lässt sich der Nutzen erhöhen?',
 'Kritisch prüfen!':'Mittlerer Aufwand bei geringem Nutzen. Genau prüfen, ob sich das lohnt.',
 '?':'Nutzen und Aufwand liegen beide im Mittelfeld. Sammelt mehr Informationen, bevor ihr entscheidet.',
 'Dranbleiben!':'Der hohe Nutzen rechtfertigt den Aufwand: weiterverfolgen.',
 'Abbrechen!!':'Hoher Aufwand bei geringem Nutzen: die Idee nicht weiterverfolgen.',
 'Aufwand prüfen/senken, Nutzen steigern!':'Zu viel Aufwand für zu wenig Nutzen. Aufwand senken und Nutzen steigern, sonst lohnt es sich nicht.',
 'Aufwand prüfen/senken!':'Großer Nutzen, aber auch großer Aufwand. Den Aufwand gezielt senken.'};
const ALLC=[...N_CRIT.map((c,i)=>({...c,g:'n',i})),...A_CRIT.map((c,i)=>({...c,g:'a',i}))];
const answered=(a,k)=>{const c=ALLC[k];const v=(c.g==='n'?a.n:a.a)[c.i];return v!==null&&v!==undefined};
function vWizard(){
  const a=cur(),st=ui.wiz;
  if(!a||st===0){
    const open=state.list.filter(x=>ALLC.some((_,k)=>!answered(x,k)));
    return `<section class="hero">
     <div><div class="eyebrow">Innovationsrendite-Check nach Prof. Hube</div>
      <h2 class="claim">Idee rein.<span>Rendite raus<em>.</em></span></h2>
      <p class="lead">Zwölf Fragen, ein Ergebnis: Lohnt sich deine Idee, oder frisst der Aufwand den Nutzen?</p>
      <div class="howto"><div><b>6</b><span>Fragen zum Nutzen</span></div><div><b>6</b><span>Fragen zum Aufwand</span></div><div><b>1</b><span>klares Ergebnis</span></div></div></div>
     <form class="panel startcard" id="wizStart">
      <h3>Welche Idee willst du prüfen?</h3>
      <label class="f">Name der Idee<input id="wiz-name" placeholder="z. B. Lieferdrohne für Apotheken" autocomplete="off"></label>
      <label class="f">Kurz beschrieben (optional)<textarea id="wiz-desc" class="in" rows="2" placeholder="Was ist neu, für wen, warum?"></textarea></label>
      <button class="btn primary" type="submit">Check starten →</button>
      ${state.list.length?`<div style="display:grid;gap:6px;margin-top:4px"><span class="eyebrow">Deine Ideen</span><div class="row">${state.list.map(x=>{const done=ALLC.every((_,k)=>answered(x,k));return `<button type="button" class="btn small" data-wizopen="${x.id}">${esc(x.project)}${done?` · IR ${f2(calc(x).IR)}`:' · weitermachen'}</button>`}).join('')}</div></div>`:''}
     </form></section>`;
  }
  if(st===13)return vWizResult(a);
  const k=st-1,c=ALLC[k],arr=c.g==='n'?a.n:a.a,val=arr[c.i],gc=c.g==='n'?'g':'c';
  const lock=c.quant&&a.link&&a.fy;
  const labels=OPT_Q[c.k]||OPT_L;
  return `<div class="wiz">
   <div class="prog" aria-label="Fortschritt">${ALLC.map((x,j)=>`<button data-wizgo="${j+1}" class="${x.g==='n'?'g':'c'} ${answered(a,j)?'done':''} ${j===k?'here':''}" aria-label="Frage ${j+1}"></button>`).join('')}</div>
   <div><div class="eyebrow" style="color:var(${c.g==='n'?'--gain':'--cost'})">${c.g==='n'?'Nutzen/Chancen':'Aufwand/Risiko'} · Frage ${st} von 12 · Gewicht ${state.w[c.g][c.i]} %</div>
    <div class="muted" style="margin-top:2px">${esc(a.project)}</div></div>
   <h2 class="q">${esc(Q[c.k])}</h2>
   <p class="qdesc">${esc(c.d)}</p>
   ${lock?`<div class="notice info">Dieser Wert kommt aus deiner 5-Jahres-Kalkulation: ${quantWhy(a,c.g==='n'?'gain':'cost')}</div>`:''}
   <div class="opts" role="group" aria-label="Bewertung">${[0,1,2,3,4,5].map(v=>`<button class="opt ${gc}" data-opt="${v}" aria-pressed="${val===v}" ${lock?'disabled':''}><span class="d">${v}</span><span class="l">${esc(labels[v])}</span></button>`).join('')}</div>
   <label class="f">Begründung (optional)<textarea class="in" rows="2" data-why="${c.k}" placeholder="Warum diese Einschätzung?">${esc(a.why[c.k]||'')}</textarea></label>
   <div class="wiznav"><button class="btn" data-wiz="prev">← Zurück</button><span class="kbd">Tasten 0–5 · Enter</span><button class="btn primary" data-wiz="next" ${answered(a,k)?'':'disabled'}>${st===12?'Ergebnis zeigen':'Weiter →'}</button></div>
  </div>`;
}
function vWizResult(a){
  const r=calc(a);const vc={g:'ok',y:'mid',r:'bad'}[r.pf[1]];
  const contrib=(g)=>(g==='n'?N_CRIT:A_CRIT).map((c,i)=>({t:c.t,v:(g==='n'?r.wn:r.wa)[i],s:(g==='n'?r.n:r.x)[i]})).sort((p,q)=>q.v-p.v).slice(0,3);
  return `<div class="wiz" style="max-width:1100px">
   <section class="panel"><div class="res-hero">
    <div><div class="eyebrow">Innovationsrendite</div><div class="giant ${r.IR>=1.5?'ok':r.IR>=1?'mid':'bad'}">${f2(r.IR)}</div></div>
    <div style="display:grid;gap:14px"><h2>${esc(a.project)}</h2>${a.desc?`<p class="muted" style="font-size:1.1rem">${esc(a.desc)}</p>`:''}
     <div><span class="chip big ${vc}">${esc(r.pf[0])}</span></div>
     <p class="verdict-line">${r.IR>=1?'Die Idee ist „profitabel“: Der Nutzen übersteigt den Aufwand.':'Die Idee ist nicht „profitabel“: Der Aufwand übersteigt den Nutzen.'} ${esc(ADVICE[r.pf[0]]||'')}</p></div></div>
    <div class="grid2" style="margin-top:20px;gap:16px">
     <div class="bar2"><div class="t"><span>Nutzen/Chancen IN</span><b class="num" style="color:var(--gain)">${f2(r.IN)}</b></div><div class="track"><div class="fill" style="width:${r.IN/5*100}%;background:var(--gain)"></div></div></div>
     <div class="bar2"><div class="t"><span>Aufwand/Risiko IA</span><b class="num" style="color:var(--cost)">${f2(r.IA)}</b></div><div class="track"><div class="fill" style="width:${r.IA/5*100}%;background:var(--cost)"></div></div></div>
    </div>
    <div class="sw" style="margin-top:20px">
     <div><span class="eyebrow">Bilanz</span><div class="num" style="font-size:1.4rem">${r.bil>=0?'+':''}${f2(r.bil)}</div></div>
     <div><span class="eyebrow">Größte Nutzentreiber</span><ul>${contrib('n').map(o=>`<li>${esc(o.t)} <span class="num muted">(${o.s} → ${f2(o.v)})</span></li>`).join('')}</ul></div>
     <div><span class="eyebrow">Größte Aufwandstreiber</span><ul>${contrib('a').map(o=>`<li>${esc(o.t)} <span class="num muted">(${o.s} → ${f2(o.v)})</span></li>`).join('')}</ul></div>
    </div></section>
   <section class="panel"><header><h2>Aufwand/Nutzen-Portfolio</h2></header>${portfolio([a])}</section>
   <section class="panel"><header><h2>Netzgrafik</h2><span class="muted">Einzelbewertungen 0–5</span></header><div class="chartbox">${radar([a])}</div></section>
   <div class="wiznav"><button class="btn" data-wizgo="12">← Antworten ändern</button>
    <span class="row"><button class="btn" data-tabgo="fy">5-Jahres-Kalkulation ergänzen</button><button class="btn" data-tabgo="ranking">Mit anderen Ideen vergleichen</button><button class="btn primary" data-wiz="restart">Neue Idee prüfen</button></span></div>
  </div>`;
}
function vAssess(){
  const a=cur();
  if(!a)return `<section class="panel">${picker()}</section>`;
  const r=calc(a);
  const conf=ui.confirm==='del'?`<span class="row"><span>Bewertung wirklich löschen?</span><button class="btn small danger" data-act="del-yes">Löschen</button><button class="btn small" data-act="del-no">Abbrechen</button></span>`:`<button class="btn small danger" data-act="del">Löschen</button>`;
  return `<section class="panel">${picker()}</section>
  <div class="layout-edit">
   <div style="display:grid;gap:24px;min-width:0">
    <section class="panel"><div class="fields">
      <label class="f">Projekt / Idee<input id="f-project" data-field="project" value="${esc(a.project)}"></label>
      <label class="f">${state.mode==='Multibeurteilende'?'Beurteiler (Name, Funktion)':'Beurteilt von (optional)'}<input id="f-assessor" data-field="assessor" value="${esc(a.assessor)}"></label>
      ${isX()?`<label class="f">Idee aus dem Ideenpool<select id="f-idea" data-field="idea"><option value="">–</option>${IDEAS.map(i=>`<option value="${i.id}" ${a.idea==i.id?'selected':''}>${i.id}. ${esc(i.name)}</option>`).join('')}</select></label>`:''}
     </div>
     <div class="row" style="margin-top:14px;justify-content:space-between">
      <label class="row"><input type="checkbox" style="width:22px;height:22px" id="f-link" data-act="link" ${a.link&&a.fy?'checked':''} ${a.fy?'':'disabled'}> Wirtschaftlichen Nutzen und F&amp;E-Aufwand aus der 5-Jahres-Kalkulation übernehmen</label>
      <span class="row">${a.fy?`<button class="btn small" data-tabgo="fy">5-Jahres-Kalkulation öffnen</button>`:`<button class="btn small" data-act="addfy">5-Jahres-Kalkulation anlegen</button>`}<button class="btn small" data-act="dup">Duplizieren</button>${conf}</span>
     </div></section>
    <section class="panel"><div class="block-title gain"><h3>Nutzen/Chancen</h3><span class="mono">Gewichte ${sum(state.w.n)} %</span></div>
     <p class="muted">Skala: 0 nicht vorhanden · 1 sehr gering … 5 sehr hoch</p>
     ${critBlock(N_CRIT,a.n,r.n,'gain',a)}</section>
    <section class="panel"><div class="block-title cost"><h3>Aufwand/Risiko</h3><span class="mono">Gewichte ${sum(state.w.a)} %</span></div>
     <p class="muted">Skala: 0 nicht vorhanden · 1 sehr gering … 5 sehr hoch</p>
     ${critBlock(A_CRIT,a.a,r.x,'cost',a)}</section>
   </div>
   <div id="resultSlot">${resultCard(a)}</div>
  </div>
`;
}
function vFY(){
  const a=cur();
  if(!a)return emptyMsg();
  const pk=`<section class="panel">${picker(false)}</section>`;
  if(!a.fy)return pk+`<section class="panel" style="display:grid;gap:16px"><h2>${esc(a.project)}</h2><p style="font-size:1.1rem;max-width:60ch">Für diese Idee gibt es noch keine 5-Jahres-Kalkulation. Sie berechnet „Wirtschaftlicher Nutzen“ und „Investitionsaufwand F&amp;E“ aus Umsatz, Gewinn und Entwicklungskosten statt aus dem Bauchgefühl.</p><div><button class="btn primary" data-act="addfy">5-Jahres-Kalkulation anlegen</button></div></section>`;
  const fy=a.fy,b=state.base,cu=esc(b.currency),yrs=[0,1,2,3,4];
  const numIn=(path,v,step='any')=>`<input class="in" type="number" step="${step}" data-fy="${path}" value="${v}" aria-label="${path}">`;
  return pk+`
  <section class="tiles">
   <div class="tile"><span class="eyebrow">Umsatz 5 Jahre</span><span class="v" data-out="Rm"></span><span class="s">${cu}</span></div>
   <div class="tile"><span class="eyebrow">Gewinn 5 Jahre</span><span class="v gain" data-out="Pm"></span><span class="s">Umsatz × <span data-out="margin"></span> Umsatzrendite</span></div>
   <div class="tile"><span class="eyebrow">F&amp;E-Kosten 5 Jahre</span><span class="v cost" data-out="Cm"></span><span class="s">Personal + Sachkosten</span></div>
  </section>
  <div class="grid2">
   <section class="panel"><header><h2>Wirtschaftlicher Nutzen</h2><span class="giant ok" style="font-size:3.4rem" data-out="pRating"></span></header>
    <p>Gewinnanteil <b class="num" data-out="pShare"></b> = Gewinn über 5 Jahre ÷ Gewinn ${esc(b.company)} im letzten Jahr (${fInt(b.profit)} Mio ${cu})</p><div class="scale" data-out="pScale"></div></section>
   <section class="panel"><header><h2>Investitionsaufwand F&amp;E</h2><span class="giant" style="font-size:3.4rem;color:var(--cost)" data-out="cRating"></span></header>
    <p>Kostenanteil <b class="num" data-out="cShare"></b> = F&amp;E-Kosten über 5 Jahre ÷ F&amp;E-Budget ${esc(b.company)} (${fInt(b.rnd)} Mio ${cu})</p><div class="scale" data-out="cScale"></div></section>
  </div>
  ${a.link?'':'<div class="notice">Die Übernahme in die Bewertung ist ausgeschaltet. Unter „Bewertung bearbeiten“ den Haken setzen.</div>'}
  <section class="panel"><header><h2>Gewinnrechnung</h2><span class="muted">Gewinn = Umsatz × Umsatzrendite</span></header>
   <div class="tablewrap"><table class="fy"><thead><tr><th>Jahr</th>${yrs.map(i=>`<th class="r">${i+1}</th>`).join('')}<th class="r">Summe</th></tr></thead><tbody>
    <tr><td><input class="in wide" data-fyt="unit" value="${esc(fy.unit)}" aria-label="Einheit Menge"></td>${yrs.map(i=>`<td>${numIn('qty.'+i,fy.qty[i],'1')}</td>`).join('')}<td class="calc" data-out="qtySum"></td></tr>
    <tr><td><input class="in wide" data-fyt="priceUnit" value="${esc(fy.priceUnit)}" aria-label="Bezeichnung Preis"></td>${yrs.map(i=>`<td>${numIn('price.'+i,fy.price[i])}</td>`).join('')}<td></td></tr>
    <tr><td>Umsatz (${cu})</td>${yrs.map(i=>`<td class="calc" data-out="rev.${i}"></td>`).join('')}<td class="calc" data-out="R"></td></tr>
    <tr class="sum"><td>Gewinn (${cu})</td>${yrs.map(i=>`<td class="calc" data-out="pro.${i}"></td>`).join('')}<td class="calc" data-out="P"></td></tr>
   </tbody></table></div>
  </section>
  <section class="panel"><header><h2>F&amp;E-Kosten</h2><span class="muted">Entwicklung und Kompetenzaufbau</span></header>
   <div class="tablewrap"><table class="fy"><thead><tr><th>Position (FTE je Jahr)</th>${yrs.map(i=>`<th class="r">${i+1}</th>`).join('')}<th class="r">${cu}/FTE</th><th></th></tr></thead><tbody>
    ${fy.staff.map((s,k)=>`<tr><td><input class="in wide" data-fyt="staff.${k}.label" value="${esc(s.label)}" aria-label="Bezeichnung Personal"></td>${yrs.map(i=>`<td>${numIn(`staff.${k}.fte.${i}`,s.fte[i])}</td>`).join('')}<td>${numIn(`staff.${k}.cost`,s.cost)}</td><td><button class="btn small danger" data-act="rmstaff" data-k="${k}" aria-label="Zeile entfernen">✕</button></td></tr>`).join('')}
    <tr><td colspan="8"><button class="btn small" data-act="addstaff">+ Personalposition</button></td></tr>
    <tr><td>Personalkosten (${cu})</td>${yrs.map(i=>`<td class="calc" data-out="stc.${i}"></td>`).join('')}<td class="calc" data-out="STC"></td><td></td></tr>
    <tr><td>Sachkosten (${cu})</td>${yrs.map(i=>`<td>${numIn('material.'+i,fy.material[i])}</td>`).join('')}<td class="calc" data-out="MAT"></td><td></td></tr>
    <tr class="sum"><td>Summe F&amp;E (${cu})</td>${yrs.map(i=>`<td class="calc" data-out="rnd.${i}"></td>`).join('')}<td class="calc" data-out="C"></td><td></td></tr>
   </tbody></table></div>
  </section>
  <section class="panel notes"><header style="margin:0"><h2>Annahmen &amp; Begründungen</h2></header>
   <label class="f">Menge: ${esc(fy.unit)}<textarea class="in" rows="2" data-fyt="qtyNote">${esc(fy.qtyNote||'')}</textarea></label>
   <label class="f">Preis: ${esc(fy.priceUnit)}<textarea class="in" rows="2" data-fyt="priceNote">${esc(fy.priceNote||'')}</textarea></label>
   ${fy.staff.map((s,k)=>`<label class="f">Personal: ${esc(s.label)}<textarea class="in" rows="1" data-fyt="staff.${k}.note">${esc(s.note||'')}</textarea></label>`).join('')}
   <label class="f">Sachkosten<textarea class="in" rows="2" data-fyt="materialNote">${esc(fy.materialNote||'')}</textarea></label>
  </section>
  <section class="panel"><header><h2>Quellen</h2><button class="btn small" data-act="addsrc">+ Quelle</button></header>
   <ol class="src">${(fy.sources||[]).map((s,k)=>`<li><span class="row" style="flex-wrap:nowrap;align-items:flex-start"><textarea class="in" rows="2" data-fyt="sources.${k}" aria-label="Quelle ${k+1}">${esc(s)}</textarea><button class="btn small danger" data-act="rmsrc" data-k="${k}" aria-label="Quelle entfernen">✕</button></span></li>`).join('')}</ol>
  </section>`;
}
function fillFY(){
  const a=cur();if(!a||!a.fy)return;const c=calcFY(a.fy,state.base);const set=(k,v)=>document.querySelectorAll(`[data-out="${k}"]`).forEach(e=>e.innerHTML=v);
  set('margin',fPct(c.margin));set('qtySum',fInt(c.qtySum));
  c.revenue.forEach((v,i)=>set('rev.'+i,fInt(v)));c.profit.forEach((v,i)=>set('pro.'+i,fInt(v)));
  c.staffCost.forEach((v,i)=>set('stc.'+i,fInt(v)));c.rnd.forEach((v,i)=>set('rnd.'+i,fInt(v)));
  a.fy.staff.forEach((s,k)=>set('fte.'+k,sum(s.fte).toLocaleString('de-DE')));
  set('R',fInt(c.R));set('Rm',fMio(c.R));set('Pm',fMio(c.P));set('Cm',fMio(c.C));set('P',fInt(c.P));set('STC',fInt(sum(c.staffCost)));set('MAT',fInt(sum(a.fy.material)));set('C',fInt(c.C));
  set('pShare',fPct(c.pShare));set('cShare',fPct(c.cShare));
  set('pRating',c.pRating);set('cRating',c.cRating);
  const pl=['0','≤3 %','≤5 %','≤20 %','≤30 %','>30 %'],cl=['0','≤10 %','≤20 %','≤50 %','≤100 %','>100 %'];
  set('pScale',pl.map((t,i)=>`<span class="${i===c.pRating?'on':''}"><b>${i}</b><br>${t}</span>`).join(''));
  set('cScale',cl.map((t,i)=>`<span class="${i===c.cRating?'on':''}"><b>${i}</b><br>${t}</span>`).join(''));
}
function vIdeas(){
  const byCat={};IDEAS.forEach(i=>(byCat[i.c[1]]??=[]).push(i));
  const cellList=k=>(byCat[k]||[]).map(i=>`<div><b style="font-family:var(--f-body);font-size:1.05rem;display:inline;margin:0">${esc(i.name)}</b> <span class="mono muted" style="font-size:.85rem">M${i.m[1]} · O${i.o[1]}</span></div>`).join('');
  return `<section class="panel"><header><h2>How-Wow-Now-Matrix</h2><span class="muted">M = Machbarkeit · O = Originalität · Grenze ≥ 4</span></header>
   <div class="hwn">
    <div class="ylab">Originalität ≥ 4</div><div class="cell how"><b>HOW?</b>${cellList('HOW')}</div><div class="cell wow"><b>WOW!</b>${cellList('WOW')}</div>
    <div class="ylab">Originalität &lt; 4</div><div class="cell drop"><b>Verwerfen</b>${cellList('VERWERFEN')}</div><div class="cell now"><b>NOW!</b>${cellList('NOW')}</div>
    <div></div><div class="xlab">Machbarkeit &lt; 4</div><div class="xlab">Machbarkeit ≥ 4</div>
   </div></section>
`;}
function vPool(){
  return `<section class="ideas">${IDEAS.map(i=>{const ex=state.list.filter(a=>+a.idea===i.id);const cc={WOW:'ok',NOW:'mid',HOW:'neutral',VERWERFEN:'bad'}[i.c[1]];
   return `<article class="idea"><div class="top"><div><div class="eyebrow">${i.id} · ${esc(i.trend)}</div><h3>${esc(i.name)}</h3></div><span class="chip ${cc}">${i.c[1]}</span></div>
    <p>${esc(i.d)}</p><div class="mo"><span>Machbarkeit ${i.m[1]} <span title="KI">(KI ${i.m[0]})</span></span><span>Originalität ${i.o[1]} (KI ${i.o[0]})</span></div>
    <div class="row">${ex.map(a=>{const r=calc(a);return `<button class="btn small" data-open="${a.id}">IR ${f2(r.IR)} · ${esc(a.assessor)}</button>`}).join('')}${ex.length?'':`<button class="btn small" data-newidea="${i.id}">+ Bewerten</button>`}</div></article>`}).join('')}</section>`;
}
function vSettings(){
  const b=state.base;
  const wRow=(list,kind)=>list.map((c,i)=>`<tr><td>${esc(c.t)}</td><td class="r"><input class="in" style="width:96px;text-align:right" type="number" min="0" max="100" data-w="${kind}.${i}" value="${state.w[kind][i]}" aria-label="Gewicht ${esc(c.t)}"></td><td class="r num muted">${HUBE_W[kind][i]} %</td></tr>`).join('');
  return `<div class="grid2">
  <section class="panel"><header><h2>Gewichtung</h2><button class="btn small" data-act="hubew">Standard nach Hube</button></header>
   <p class="muted" style="margin-bottom:12px">Die Gewichte gelten für alle Bewertungen und müssen je Block 100 % ergeben.</p>
   <div class="tablewrap"><table><thead><tr><th>Nutzen/Chancen</th><th class="r">Gewicht %</th><th class="r">Hube</th></tr></thead><tbody>${wRow(N_CRIT,'n')}
    <tr><td><b>Summe</b></td><td class="r num"><b data-out="wsum-n"></b></td><td></td></tr></tbody></table></div>
   <div class="tablewrap" style="margin-top:18px"><table><thead><tr><th>Aufwand/Risiko</th><th class="r">Gewicht %</th><th class="r">Hube</th></tr></thead><tbody>${wRow(A_CRIT,'a')}
    <tr><td><b>Summe</b></td><td class="r num"><b data-out="wsum-a"></b></td><td></td></tr></tbody></table></div>
  </section>
  <div style="display:grid;gap:24px;align-content:start;min-width:0">
  <section class="panel"><header><h2>Arbeitsmappe</h2></header><div class="fields">
   <label class="f">Name<input id="s-wb" data-set="workbook" value="${esc(state.workbook)}"></label>
   <label class="f">Verwendung als<select id="s-mode" data-set="mode"><option ${state.mode==='Multiprojekt'?'selected':''}>Multiprojekt</option><option ${state.mode==='Multibeurteilende'?'selected':''}>Multibeurteilende</option></select></label>
   <label class="f">Zeithorizont<input id="s-hz" data-set="horizon" value="${esc(state.horizon)}"></label></div>
   <p class="muted" style="margin-top:12px">Multiprojekt: mehrere Ideen vergleichen. Multibeurteilende: eine Idee aus Sicht mehrerer Personen (z. B. F&amp;E, Marketing, Geschäftsführung).</p></section>
  <section class="panel"><header><h2>Basisdaten Unternehmen</h2></header><div class="fields">
   <label class="f">Unternehmen<input id="b-co" data-base="company" value="${esc(b.company)}"></label>
   <label class="f">Währung<input id="b-cur" data-base="currency" value="${esc(b.currency)}"></label>
   <label class="f">Umsatz letztes Jahr (Mio)<input id="b-rev" type="number" data-base="revenue" value="${b.revenue}"></label>
   <label class="f">Gewinn letztes Jahr (Mio)<input id="b-pro" type="number" data-base="profit" value="${b.profit}"></label>
   <label class="f">F&amp;E-Kosten letztes Jahr (Mio)<input id="b-rnd" type="number" data-base="rnd" value="${b.rnd}"></label></div>
   <label class="f" style="margin-top:12px">Erläuterung<textarea id="b-note" class="in" rows="3" data-base="note">${esc(b.note)}</textarea></label></section>
  <section class="panel"><header><h2>Teilen und sichern</h2></header>
   <p class="muted" style="margin-bottom:12px">Alle Eingaben liegen nur in diesem Browser. Zum Teilen exportieren und bei der Gruppe importieren.</p>
   <div class="row"><button class="btn" data-act="export">JSON kopieren</button><button class="btn" data-act="download">JSON herunterladen</button><label class="btn" for="importFile">Datei importieren</label><input type="file" id="importFile" accept="application/json,.json" hidden></div>
   <textarea id="io" class="in" rows="4" style="margin-top:12px;font-family:var(--f-mono);font-size:.78rem" placeholder="JSON hier einfügen und „Einfügen übernehmen“ klicken"></textarea>
   <div class="row" style="margin-top:8px"><button class="btn small" data-act="import">Einfügen übernehmen</button>
   ${ui.confirm==='reset'?`<span class="row"><span>${isX()?'Alle Änderungen durch die Daten der Gruppe ersetzen?':'Alle eigenen Ideen löschen und neu beginnen?'}</span><button class="btn small danger" data-act="reset-yes">Ersetzen</button><button class="btn small" data-act="reset-no">Abbrechen</button></span>`:`<button class="btn small danger" data-act="reset">${isX()?'SpaceX-Daten der Gruppe wiederherstellen':'Zurücksetzen'}</button>`}
   ${!isX()?'':ui.confirm==='blank'?`<span class="row"><span>Leere Arbeitsmappe ohne Bewertungen starten?</span><button class="btn small danger" data-act="blank-yes">Leeren</button><button class="btn small" data-act="blank-no">Abbrechen</button></span>`:`<button class="btn small" data-act="blank">Leere Arbeitsmappe</button>`}</div>
  </section></div></div>`;
}
function vMethod(){
  return `<section class="panel method" style="display:grid;gap:16px">
  <h2>So rechnet der Kalkulator</h2>
  <p>Der Rechner bildet den Innovations-Rendite-Kalkulator von Prof. Dr. Gerhard Hube nach. Er ist ein Scoring-Modell: Quantitative und qualitative Kriterien werden in dimensionslose Punkte umgewandelt. Die Innovationsrendite ist ein Indikator, keine finanzielle Rendite.</p>
  <ul>
   <li><b>Bewertung:</b> Je sechs Kriterien für Nutzen/Chancen und Aufwand/Risiko auf der Skala 0 (nicht vorhanden) bis 5 (sehr hoch).</li>
   <li><b>Gewichtete Bewertung:</b> Punkte × Gewicht ÷ 100. Die Gewichte je Block ergeben 100 %.</li>
   <li><b>IN</b> = Summe der gewichteten Nutzen, <b>IA</b> = Summe der gewichteten Aufwände (jeweils 0–5).</li>
   <li><b>Rendite IR = IN ÷ IA.</b> Über 1 ist die Idee „profitabel“. Ist IA = 0, geht die Rendite gegen unendlich.</li>
   <li><b>Bilanz = IN − IA.</b></li>
   <li><b>Kategorien:</b> unter 2 niedrig, 2 bis unter 3 mittel, ab 3 hoch. Daraus ergibt sich das Feld im Aufwand/Nutzen-Portfolio.</li>
  </ul>
  <h3>5-Jahres-Kalkulation</h3>
  <ul>
   <li>Umsatz = Menge × Preis je Jahr. Gewinn = Umsatz × Umsatzrendite des Unternehmens im letzten Jahr.</li>
   <li>Gewinnanteil = Summe Gewinn über 5 Jahre ÷ Gewinn des Unternehmens im letzten Jahr. Skala: 0 kein Gewinn · 1 ≤ 3 % · 2 ≤ 5 % · 3 ≤ 20 % · 4 ≤ 30 % · 5 &gt; 30 %.</li>
   <li>F&amp;E-Kosten = FTE × Jahreskosten + Sachkosten. Kostenanteil = kumulierte F&amp;E-Kosten ÷ F&amp;E-Kosten des Unternehmens im letzten Jahr. Skala: 0 keine · 1 ≤ 10 % · 2 ≤ 20 % · 3 ≤ 50 % · 4 ≤ 100 % · 5 &gt; 100 %.</li>
  </ul>
  <h3>Hinweis für die kritische Methodenbewertung</h3>
  <p>Bei einem Konzern in der Größe von SpaceX (3,8 Mrd. USD Gewinn, 3 Mrd. USD F&amp;E im Kerngeschäft) landen fast alle neuen Geschäftsideen beim wirtschaftlichen Nutzen und beim F&amp;E-Aufwand auf Stufe 1. Die beiden quantitativen Kriterien unterscheiden die Ideen dann kaum; die Rangfolge entsteht vor allem über die qualitativen Kriterien. Das ist ein Ansatzpunkt für Teil 8 der Präsentation.</p>
  <h3>Portfolio-Felder</h3>
  <div class="tablewrap"><table><thead><tr><th>Aufwand ↓ / Nutzen →</th><th>niedrig</th><th>mittel</th><th>hoch</th></tr></thead><tbody>
   ${[1,2,3].map(ca=>`<tr><td>${catName(ca)}</td>${[1,2,3].map(cn=>`<td>${esc(PF_LABELS[ca][cn][0])}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
  </section>
  <section class="panel method" id="hube" style="display:grid;gap:16px">
   <div><div class="eyebrow">Urheber der Methode</div><h2>Prof. Dr. Gerhard Hube</h2></div>
   <p>Die Innovationsrendite-Formel, der Innovationsrendite-Kalkulator, die Innovationsformel I = N × U und der Innovationsprüfstand wurden von Prof. Dr. Gerhard Hube entwickelt, Professor für Strategisches Innovationsmanagement an der THWS Business School (Technische Hochschule Würzburg-Schweinfurt). Diese Website ist ein studentischer Nachbau seines Excel-Kalkulators für die Vorlesung Innovationsmanagement / New Business Development am Graduate Campus der Hochschule Aalen. Alle Rechte an Methode und Originalwerkzeugen liegen beim Urheber.</p>
   <p><a href="https://business.thws.de/en/business-school/contact-persons/person/prof-dr-gerhard-hube/" target="_blank" rel="noopener">Profil von Prof. Dr. Gerhard Hube an der THWS Business School</a></p>
   <h3>Veröffentlichungen</h3>
   <ol class="src">
    <li>Hube, G. (2024): Innovationsrendite-Formel und Innovationsrendite-Kalkulator. In: Wissenschaftsmanagement, 20.03.2024. <a href="https://www.wissenschaftsmanagement.de/news/innovationsrendite-formel-und-innovationsrendite-kalkulator" target="_blank" rel="noopener">wissenschaftsmanagement.de</a></li>
    <li>Hube, G. (2024): Innovation return formula and Innovation-return-calculator. Wissenschaftsmanagement, Open Access, 23.03.2024. <a href="https://www.wissenschaftsmanagement.de/open-access/innovation-return-formula-and-innovation-return-calculator" target="_blank" rel="noopener">Artikel</a> · <a href="https://www.wissenschaftsmanagement.de/dateien/downloads-open-access/wima_2023_prof_hube_englisch_open_access_0.pdf" target="_blank" rel="noopener">PDF</a></li>
    <li>Hube, G. (2024): Innovation Return Formula. In: WIBF@Doğuş 2024 Conference Proceedings. DOI <a href="https://doi.org/10.53174/UAS/WS/2024" target="_blank" rel="noopener">10.53174/UAS/WS/2024</a> · <a href="https://wibf.thws.de/fileadmin/wibf/Media/WIBF_2024/WIBF%40Dogus_2024_Conference_Proceedings_Book.pdf" target="_blank" rel="noopener">Tagungsband (PDF)</a></li>
    <li>Hube, G. (2022): Innovationsformel und Innovationsprüfstand. Entwicklung eines Instrumentes zur Bestimmung des Innovationsstatus in der Gegenwart. In: Wissenschaftsmanagement, 15.10.2022. <a href="https://www.wissenschaftsmanagement.de/news/innovationsformel-und-innovationspruefstand" target="_blank" rel="noopener">wissenschaftsmanagement.de</a></li>
    <li>Hube, G. (2022): Innovation Formula and Innovation Test Bed: Development of an instrument to determine the Innovation Status in the Present. Open Access, THWS Fakultät Wirtschaftswissenschaften, DOI 10.53174/UAS/WS/2022. <a href="https://www.wissenschaftsmanagement.de/dateien/downloads-open-access/wima_2022_hube_open_access_0.pdf" target="_blank" rel="noopener">PDF</a></li>
    <li>Hube, G. (2023): Innovation Formula and Innovation Test Bed. In: WIBF 6th International Business Conference, Proceedings.</li>
   </ol>
   <h3>Video</h3>
   <ol class="src">
    <li>Hube, G. (Kanal „Inno-Prof“, 24.02.2024): How to calculate the Innovation-Return? Erklärvideo zur Innovationsrendite-Formel. <a href="https://www.youtube.com/watch?v=vAL8CZqFMqw" target="_blank" rel="noopener">YouTube</a></li>
   </ol>
   <h3>Lehrmaterial (Kurs-Canvas, nicht öffentlich)</h3>
   <ol class="src">
    <li>Hube, G. (2026): Innovationsmanagement / New Business Development, Vorlesungsfolien Kapitel 1–5 und „Innovationsformel nach Hube / Innovationsprüfstand“, Graduate Campus Hochschule Aalen.</li>
    <li>Hube, G.: Innovations-Rendite-Kalkulator V3.1 (Excel, mit Beispielen), Vorlage für diese Website.</li>
    <li>Hube, G.: Innovations-Prüfstand V6 (Excel, mit 5 Beispielen).</li>
   </ol>
   <h3>So zitieren</h3>
   <p class="mono" style="font-size:.85rem;background:var(--surface-2);padding:12px;border-radius:var(--r)">Hube, G. (2024): Innovationsrendite-Formel und Innovationsrendite-Kalkulator. In: Wissenschaftsmanagement, 20.03.2024.</p>
  </section>`;
}
