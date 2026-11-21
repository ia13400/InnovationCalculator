/* ============================== PDF-Bericht ============================== */
/* Druckansicht im Stil der Website. Erzeugt den Bericht in #report und öffnet den Druckdialog
   („Als PDF speichern“). Farben werden per print-color-adjust erzwungen (siehe base.css, @media print). */
const LOGO=`<svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M3 29h26" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" opacity=".55"/><path d="M4 23l7.5-7.5 5 5L25 12" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M18.5 7.5H29v10.5z" fill="currentColor"/></svg>`;

function rpHead(title){
  const d=new Date().toLocaleDateString('de-DE',{day:'2-digit',month:'long',year:'numeric'});
  return `<div class="rp-head"><span class="rp-brand">${LOGO}<span><b>Innovations<i>rendite</i></b><small>nach Prof. Dr. Gerhard Hube</small></span></span>
   <span class="rp-meta">${esc(title)}<br>${esc(state.workbook||'')} · ${d}</span></div>`;
}
function rpScoreTable(a,k){
  const r=calc(a),q=k?calc(k):null;
  const rows=(list,g)=>list.map((c,i)=>{const s=(g==='n'?r.n:r.x)[i],w=state.w[g][i],wv=(g==='n'?r.wn:r.wa)[i];
    const locked=c.quant&&a.link&&a.fy;const why=[locked?quantWhy(a,g==='n'?'gain':'cost'):'',a.why[c.k]||''].filter(Boolean).join(' ');
    const ks=q?(g==='n'?q.n:q.x)[i]:null;
    return `<tr><td class="rp-crit">${esc(c.t)}</td><td class="r num">${w} %</td><td class="r num rp-sc ${g==='n'?'g':'c'}">${s??'–'}</td><td class="r num">${f2(wv)}</td>
     <td class="rp-why">${why?esc(why):'<span class="muted">–</span>'}</td>${q?`<td class="r num rp-sc k">${ks??'–'}</td><td class="rp-why">${esc(k.why[c.k]||'')}</td>`:''}</tr>`}).join('');
  const sumRow=(lab,v,kv)=>`<tr class="rp-sum"><td>${lab}</td><td></td><td></td><td class="r num">${f2(v)}</td><td></td>${q?`<td class="r num">${f2(kv)}</td><td></td>`:''}</tr>`;
  return `<table class="rp-table"><thead><tr><th>Kriterium</th><th class="r">Gewicht</th><th class="r">Punkte</th><th class="r">Gewichtet</th><th>Begründung</th>${q?'<th class="r">KI</th><th>Begründung der KI</th>':''}</tr></thead>
   <tbody><tr class="rp-grp"><td colspan="${q?7:5}">Nutzen/Chancen</td></tr>${rows(N_CRIT,'n')}${sumRow('Summe Nutzen IN',r.IN,q&&q.IN)}
   <tr class="rp-grp"><td colspan="${q?7:5}">Aufwand/Risiko</td></tr>${rows(A_CRIT,'a')}${sumRow('Summe Aufwand IA',r.IA,q&&q.IA)}</tbody></table>`;
}
function rpFY(a){
  if(!a.fy)return '';
  const fy=a.fy,b=state.base,c=calcFY(fy,b),cu=esc(b.currency),yrs=[0,1,2,3,4],m=v=>fInt(v);
  const notes=[['Menge: '+fy.unit,fy.qtyNote],['Preis: '+fy.priceUnit,fy.priceNote],...fy.staff.map(s=>['Personal: '+s.label,s.note]),['Sachkosten',fy.materialNote]].filter(x=>x[1]);
  return `<section class="rp-block rp-break"><div class="eyebrow">5-Jahres-Kalkulation</div><h2>Gewinn und Entwicklungskosten über fünf Jahre</h2>
   <div class="rp-tiles">
    <div><span class="eyebrow">Umsatz 5 Jahre</span><b>${fMio(c.R)} ${cu}</b></div>
    <div><span class="eyebrow">Gewinn 5 Jahre</span><b class="g">${fMio(c.P)} ${cu}</b><small>Gewinnanteil ${fPct(c.pShare)} → Bewertung ${c.pRating??'–'}</small></div>
    <div><span class="eyebrow">F&amp;E-Kosten 5 Jahre</span><b class="c">${fMio(c.C)} ${cu}</b><small>Kostenanteil ${fPct(c.cShare)} → Bewertung ${c.cRating??'–'}</small></div>
   </div>
   <div class="rp-keep" style="margin-bottom:5mm">${fyRechenweg(a)}</div>
   <table class="rp-table rp-fy"><thead><tr><th>Jahr</th>${yrs.map(i=>`<th class="r">${i+1}</th>`).join('')}<th class="r">Summe</th></tr></thead><tbody>
    <tr><td>${esc(fy.unit)}</td>${yrs.map(i=>`<td class="r num">${m(fy.qty[i])}</td>`).join('')}<td class="r num">${m(c.qtySum)}</td></tr>
    <tr><td>${esc(fy.priceUnit)} (${cu})</td>${yrs.map(i=>`<td class="r num">${m(fy.price[i])}</td>`).join('')}<td></td></tr>
    <tr><td>Umsatz (${cu})</td>${yrs.map(i=>`<td class="r num">${m(c.revenue[i])}</td>`).join('')}<td class="r num">${m(c.R)}</td></tr>
    <tr class="rp-sum"><td>Gewinn (${cu}) · Umsatzrendite ${fPct(c.margin)}</td>${yrs.map(i=>`<td class="r num">${m(c.profit[i])}</td>`).join('')}<td class="r num">${m(c.P)}</td></tr>
    ${fy.staff.map(s=>`<tr><td>${esc(s.label)} (FTE · ${m(s.cost)} ${cu}/FTE)</td>${yrs.map(i=>`<td class="r num">${String(s.fte[i]).replace('.',',')}</td>`).join('')}<td></td></tr>`).join('')}
    <tr><td>Personalkosten (${cu})</td>${yrs.map(i=>`<td class="r num">${m(c.staffCost[i])}</td>`).join('')}<td class="r num">${m(sum(c.staffCost))}</td></tr>
    <tr><td>Sachkosten (${cu})</td>${yrs.map(i=>`<td class="r num">${m(fy.material[i])}</td>`).join('')}<td class="r num">${m(sum(fy.material))}</td></tr>
    <tr class="rp-sum"><td>Summe F&amp;E (${cu})</td>${yrs.map(i=>`<td class="r num">${m(c.rnd[i])}</td>`).join('')}<td class="r num">${m(c.C)}</td></tr>
   </tbody></table>
   <p class="rp-note">${a.link?'Die beiden quantitativen Kriterien („Wirtschaftlicher Nutzen“ und „Investitionsaufwand F&amp;E“) werden aus dieser Kalkulation übernommen.':'Die Kalkulation ist nicht mit der Bewertung verknüpft; die Punkte der beiden quantitativen Kriterien wurden manuell vergeben.'}</p>
   ${notes.length?`<h3>Annahmen &amp; Begründungen</h3><dl class="rp-dl">${notes.map(([t,v])=>`<dt>${esc(t)}</dt><dd>${esc(v)}</dd>`).join('')}</dl>`:''}
   ${(fy.sources||[]).filter(Boolean).length?`<h3>Quellen</h3><ol class="src">${fy.sources.filter(Boolean).map(s=>`<li>${esc(s)}</li>`).join('')}</ol>`:''}
  </section>`;
}
function rpIdea(a,first){
  const k=aiOf(a),r=calc(a),q=k?calc(k):null,vc=r.IR>=1.5?'ok':r.IR>=1?'mid':'bad';
  const pfc={g:'ok',y:'mid',r:'bad'}[r.pf[1]];
  const items=k?[a,k]:[a];
  return `<article class="rp-idea${first?'':' rp-break'}">
   ${rpHead('Bewertung einer Idee')}
   <section class="rp-block rp-hero">
    <div><div class="eyebrow">Innovationsrendite</div><div class="giant ${vc}">${f2(r.IR)}</div></div>
    <div class="rp-title"><h1>${esc(a.project)}</h1>${a.assessor?`<p class="muted">Beurteilt von ${esc(a.assessor)}</p>`:''}${a.desc?`<p>${esc(a.desc)}</p>`:''}
     <div class="row"><span class="chip big ${pfc}">${esc(r.pf[0])}</span></div>
     <p class="muted">${r.IR>=1?'Die Idee ist „profitabel“: Der Nutzen übersteigt den Aufwand.':'Die Idee ist nicht „profitabel“: Der Aufwand übersteigt den Nutzen.'} ${esc(ADVICE[r.pf[0]]||'')}</p></div>
   </section>
   <div class="rp-tiles">
    <div><span class="eyebrow">Nutzen/Chancen IN</span><b class="g">${f2(r.IN)}</b><small>Kategorie ${catName(r.cN)}</small></div>
    <div><span class="eyebrow">Aufwand/Risiko IA</span><b class="c">${f2(r.IA)}</b><small>Kategorie ${catName(r.cA)}</small></div>
    <div><span class="eyebrow">Bilanz IN − IA</span><b>${r.bil>=0?'+':''}${f2(r.bil)}</b><small>Ø Nutzen ${f2(r.mN)} · Ø Aufwand ${f2(r.mA)}</small></div>
    ${q?`<div class="rp-ai"><span class="eyebrow">Rendite laut KI</span><b>${f2(q.IR)}</b><small>${esc(aiModelName(k.aiModel))} · ${esc(q.pf[0])}</small></div>`:''}
   </div>
   ${k&&k.aiSummary?`<p class="ai-summary">KI: „${esc(k.aiSummary)}“</p>`:''}
   <section class="rp-block rp-keep"><div class="eyebrow">Ergebnis</div><h2>Aufwand/Nutzen-Portfolio</h2>${portfolio(items)}</section>
   <section class="rp-block rp-keep rp-break"><div class="eyebrow">Einzelbewertungen</div><h2>Netzgrafik</h2><div class="rp-chart">${radar(items)}</div>${legend(items)}</section>
   <section class="rp-block"><div class="eyebrow">Eingaben</div><h2>Bewertung im Detail${k?' · Du vs. KI':''}</h2>${rpScoreTable(a,k)}</section>
   <section class="rp-block"><div class="eyebrow">Rechenweg</div><h2>So wurde gerechnet</h2>${rechenweg(a)}</section>
   ${rpFY(a)}
  </article>`;
}
function rpBasis(){
  const b=state.base,isHube=['n','a'].every(g=>state.w[g].every((v,i)=>+v===HUBE_W[g][i]));
  const wl=(list,g)=>list.map((c,i)=>`<tr><td>${esc(c.t)}</td><td class="r num">${state.w[g][i]} %</td></tr>`).join('');
  return `<section class="rp-block rp-break">${rpHead('Grundlagen')}<div class="eyebrow">Grundlagen</div><h2>Bezugsgrößen, Gewichtung und Methode</h2>
   <div class="rp-cols">
    <div><h3>Bezugsgrößen des Unternehmens</h3><table class="rp-table"><tbody>
     <tr><td>Unternehmen</td><td class="r">${esc(b.company)}</td></tr><tr><td>Umsatz letztes Jahr</td><td class="r num">${fInt(b.revenue)} Mio ${esc(b.currency)}</td></tr>
     <tr><td>Gewinn letztes Jahr</td><td class="r num">${fInt(b.profit)} Mio ${esc(b.currency)}</td></tr><tr><td>F&amp;E-Kosten letztes Jahr</td><td class="r num">${fInt(b.rnd)} Mio ${esc(b.currency)}</td></tr>
     <tr><td>Verwendung · Zeithorizont</td><td class="r">${esc(state.mode)} · ${esc(state.horizon)}</td></tr></tbody></table>
     ${b.note?`<p class="rp-note">${esc(b.note)}</p>`:''}
     <h3>Methode</h3><ul class="rp-list"><li>Je sechs Kriterien für Nutzen/Chancen und Aufwand/Risiko, Skala 0 bis 5.</li><li>Gewichtete Bewertung = Punkte × Gewicht ÷ 100</li><li>IN = Σ (Punkte × Gewicht) ÷ 100 der Nutzen-Kriterien, IA entsprechend</li><li><b>Innovationsrendite IR = IN ÷ IA</b> (über 1 „profitabel“)</li><li>Bilanz = IN − IA · Mittelwerte = IN ÷ 6 bzw. IA ÷ 6</li><li>Kategorien: unter 2 niedrig, 2 bis unter 3 mittel, ab 3 hoch</li><li>Gewinnanteil = Gewinn 5 Jahre ÷ Unternehmensgewinn; Kostenanteil = F&amp;E-Kosten 5 Jahre ÷ F&amp;E-Budget</li></ul></div>
    <div><h3>Gewichtung ${isHube?'(Standard nach Hube)':'(angepasst)'}</h3><table class="rp-table"><tbody><tr class="rp-grp"><td colspan="2">Nutzen/Chancen</td></tr>${wl(N_CRIT,'n')}<tr class="rp-grp"><td colspan="2">Aufwand/Risiko</td></tr>${wl(A_CRIT,'a')}</tbody></table></div>
   </div>
   <p class="rp-foot">Methode und Originalwerkzeug: Prof. Dr. Gerhard Hube, THWS Business School. Hube, G. (2024): Innovationsrendite-Formel und Innovationsrendite-Kalkulator. In: Wissenschaftsmanagement, 20.03.2024. Studentischer Nachbau für die Vorlesung Innovationsmanagement. KI-Bewertungen sind eine zweite Meinung eines Sprachmodells und ersetzen keine eigene Einschätzung.</p>
  </section>`;
}
function rpOverview(list){
  const R=list.map(a=>({a,r:calc(a)})).sort(irSort);
  const all=R.map(o=>o.a);
  return `<article class="rp-idea">${rpHead('Alle Ideen im Vergleich')}
   <section class="rp-block"><div class="eyebrow">Übersicht</div><h1>Alle Ideen im Vergleich</h1><p class="muted">${list.length} Bewertungen · ${esc(state.workbook||'')}</p></section>
   <section class="rp-block"><h2>Ranking nach Innovationsrendite</h2><table class="rp-table"><thead><tr><th>#</th><th>Idee</th><th class="r">Nutzen</th><th class="r">Aufwand</th><th class="r">Rendite</th><th>Portfolio</th></tr></thead><tbody>
    ${R.map((o,i)=>`<tr><td class="num">${i+1}</td><td><i class="dot" style="background:${colorOf(o.a)}"></i> ${esc(label(o.a))}</td><td class="r num">${f2(o.r.IN)}</td><td class="r num">${f2(o.r.IA)}</td><td class="r">${irChip(o.r)}</td><td>${pfChip(o.r)}${o.r.open?` <span class="chip neutral">unvollständig (${12-o.r.open}/12)</span>`:''}</td></tr>`).join('')}</tbody></table></section>
   <section class="rp-block rp-keep"><h2>Rendite</h2>${barChart(all,{key:'IR',ref:1,title:'Rendite je Bewertung'})}</section>
   <section class="rp-block rp-keep rp-break">${rpHead('Alle Ideen im Vergleich')}<h2>Aufwand/Nutzen-Portfolio</h2>${portfolio(all)}</section>
   <section class="rp-block rp-keep"><h2>Bilanz</h2>${barChart(all,{key:'bil',title:'Bilanz je Bewertung'})}</section>
  </article>`;
}
function printReport(ids){
  let list=ids.map(id=>state.list.find(a=>a.id===id)).filter(Boolean);
  if(list.length===1&&aiParent(list[0]))list=[aiParent(list[0])];
  if(!list.length){toast('Keine Idee für den Bericht vorhanden');return}
  const own=list.filter(a=>!a.aiOf||!aiParent(a));
  let html=list.length>1?rpOverview(list):'';
  html+=own.map((a,i)=>rpIdea(a,list.length===1&&i===0)).join('');
  html+=rpBasis();
  let el=document.getElementById('report');
  if(!el){el=document.createElement('div');el.id='report';document.body.appendChild(el)}
  el.innerHTML=html;
  const t=document.title;
  document.title='Innovationsrendite – '+(list.length>1?'Alle Ideen':list[0].project);
  const done=()=>{document.title=t;removeEventListener('afterprint',done)};
  addEventListener('afterprint',done);
  setTimeout(()=>window.print(),50);
}
