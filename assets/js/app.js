/* ============================== Rendering & Events ============================== */
/* Wechsel im Werkzeug führen an dessen Anfang, nicht an den Seitenanfang. */
function toTool(behavior){const w=document.getElementById('werkzeug');if(!w){window.scrollTo(0,0);return}const hd=document.querySelector('header.top');window.scrollTo({top:Math.max(0,w.getBoundingClientRect().top+scrollY-(hd?hd.offsetHeight:0)),behavior:behavior||'instant'})}

const VIEWS={wizard:vWizard,ranking:vRanking,portfolio:vPortfolio,bars:vBars,assess:vAssess,fy:vFY};
const STEPS={
 user:[['wizard','1','Ideen-Check'],['ranking','2','Meine Ideen'],['portfolio','3','Portfolio & Netz'],['bars','4','Rendite & Bilanz'],['assess','Extra','Feintuning'],['fy','Extra','5-Jahres-Kalkulation']]};
const INTRO={
 user:{wizard:null,
  ranking:['Vergleich','Meine Ideen im Ranking','Alle Ideen, die du geprüft hast, sortiert nach Innovationsrendite. Unten kannst du die Ideen exportieren und importieren.'],
  portfolio:['Vergleich','Wo landen deine Ideen?','Das Aufwand/Nutzen-Portfolio zeigt auf einen Blick, welche Idee ein Quick win ist und welche du abbrechen solltest.'],
  bars:['Vergleich','Rendite und Bilanz','Rendite = Nutzen ÷ Aufwand. Über 1 ist die Idee „profitabel“.'],
  assess:['Extra','Feintuning','Alle zwölf Kriterien auf einer Seite: Punkte anpassen und Begründungen ergänzen. Darunter die Gewichtung der Kriterien.'],
  fy:['Extra','5-Jahres-Kalkulation','Lege die Kennzahlen deines Unternehmens fest und berechne Gewinn und Entwicklungskosten über fünf Jahre. Daraus ergeben sich zwei der zwölf Bewertungen automatisch.']}};
function subnav(){const L=STEPS[ui.ctx],btn=([k,n,t])=>`<button data-sub="${k}" ${ui.sub[ui.ctx]===k?'aria-current="step"':''}><span class="n">${n}</span><span class="t">${esc(t)}</span></button>`;
  if(!L.some(x=>x[3]))return `<nav class="subnav" aria-label="Schritte">${L.map(btn).join('')}</nav>`;
  const G=[];L.forEach(x=>{if(!G.length||G[G.length-1].g!==x[3])G.push({g:x[3],items:[]});G[G.length-1].items.push(x)});
  return `<nav class="subnav grouped" aria-label="Schritte">${G.map(o=>`<div class="sg"><span class="sgl">${esc(o.g)}</span><div class="sgb">${o.items.map(btn).join('')}</div></div>`).join('')}</nav>`}
function pager(){const L=STEPS[ui.ctx],i=L.findIndex(x=>x[0]===ui.sub[ui.ctx]);const p=L[i-1],n=L[i+1];
  return `<nav class="pager">${p?`<button data-sub="${p[0]}"><span class="n">← ${esc(p[1])}</span><span class="t">${esc(p[2])}</span></button>`:''}${n?`<button class="next" data-sub="${n[0]}"><span class="n">${esc(n[1])} →</span><span class="t">${esc(n[2])}</span></button>`:''}</nav>`}
function render(keepScroll){
  document.querySelectorAll('#tabs button').forEach(b=>b.setAttribute('aria-selected',b.dataset.ctx===ui.ctx));
  const y=window.scrollY;
  let html;
  if(ui.ctx==='method'){html=vMethod();}
  else{if(!STEPS[ui.ctx].some(x=>x[0]===ui.sub[ui.ctx]))ui.sub[ui.ctx]=STEPS[ui.ctx][0][0];
    const sub=ui.sub[ui.ctx];const it=INTRO[ui.ctx][sub];
    const intro=x=>x?`<section class="intro"><div class="eyebrow">${esc(x[0])}</div><h2 style="font-size:clamp(2.2rem,5vw,3.4rem)">${esc(x[1])}</h2><p>${esc(x[2])}</p></section>`:'';
    html=subnav()+intro(it)+VIEWS[sub]()+(sub==='wizard'&&ui.wiz>0&&ui.wiz<13?'':pager());}
  document.getElementById('view').innerHTML=html;
  const sub=ui.sub[ui.ctx];
  if(ui.ctx!=='method'&&sub==='fy')fillFY();
  if(ui.ctx!=='method'&&sub==='assess')fillW();
  document.querySelectorAll('textarea.in').forEach(autoGrow);
  if(keepScroll)window.scrollTo(0,y);
  save();
}
function fillW(){['n','a'].forEach(k=>{const s=sum(state.w[k]);document.querySelectorAll(`[data-out="wsum-${k}"]`).forEach(e=>{e.textContent=s+' %';e.style.color=s===100?'var(--gain)':'var(--bad)'})})}
function autoGrow(t){t.style.height='auto';t.style.height=Math.min(t.scrollHeight+2,320)+'px'}
function go(sub){ui.sub[ui.ctx]=sub;ui.confirm=null;render();toTool()}
function goCtx(c){useCtx(c);ui.confirm=null;try{history.replaceState(null,'','#'+({user:'idee',method:'methode'}[c]))}catch(e){}render();toTool()}
function newAssessment(){
  const a={id:'b'+Date.now().toString(36),project:'Neue Idee '+(state.list.length+1),assessor:state.mode==='Multibeurteilende'?'Beurteiler '+(state.list.length+1):'',idea:'',link:false,n:[3,3,3,3,3,3],a:[3,3,3,3,3,3],why:{},fy:null};
  state.list.push(a);ui.sel[ui.ctx]=a.id;return a;
}
function blankFY(){return {unit:'Stück',priceUnit:'Preis je Stück',qty:[0,0,0,0,0],price:[0,0,0,0,0],qtyNote:'',priceNote:'',staff:[{label:'F&E-Mitarbeiter',fte:[0,0,0,0,0],cost:150000,note:''}],material:[0,0,0,0,0],materialNote:'',sources:[]}}
function setPath(obj,path,val){const p=path.split('.');let o=obj;for(let i=0;i<p.length-1;i++)o=o[p[i]];o[p[p.length-1]]=val}

document.getElementById('tabs').addEventListener('click',e=>{const b=e.target.closest('button[data-ctx]');if(b)goCtx(b.dataset.ctx)});
async function runAI(a){if(!a||ui.aiBusy)return;ui.aiBusy=a.id;ui.aiErr=null;render(true);
  try{await requestAI(a);toast('KI-Bewertung erstellt')}catch(e){ui.aiErr={id:a.id,msg:e.message||String(e)}}
  ui.aiBusy=null;render(true)}
function wizSet(n){ui.wiz=Math.max(0,Math.min(13,n));render();toTool()}
document.getElementById('view').addEventListener('submit',e=>{if(e.target.id!=='wizStart')return;e.preventDefault();
  const name=(document.getElementById('wiz-name').value||'').trim()||'Meine Idee '+(state.list.length+1);
  const a=newAssessment();a.project=name;a.desc=document.getElementById('wiz-desc').value||'';a.n=[null,null,null,null,null,null];a.a=[null,null,null,null,null,null];
  wizSet(1)});
document.addEventListener('keydown',e=>{
  if(ui.ctx!=='user'||ui.sub.user!=='wizard'||ui.wiz<1||ui.wiz>12)return;
  if(/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName))return;
  if(/^[0-5]$/.test(e.key)){const b=document.querySelector(`[data-opt="${e.key}"]`);if(b&&!b.disabled)b.click()}
  else if(e.key==='Enter'){const b=document.querySelector('[data-wiz="next"]');if(b&&!b.disabled){e.preventDefault();b.click()}}
  else if(e.key==='Backspace'||e.key==='ArrowLeft'){wizSet(ui.wiz-1)}});
document.getElementById('view').addEventListener('click',e=>{
  const t=e.target.closest('button,[data-open]');if(!t)return;
  if(t.dataset.opt!==undefined){const a=cur(),c=ALLC[ui.wiz-1];(c.g==='n'?a.n:a.a)[c.i]=+t.dataset.opt;render();return}
  if(t.dataset.wizgo){wizSet(+t.dataset.wizgo);return}
  if(t.dataset.wizopen){ui.sel.user=t.dataset.wizopen;const a=cur();const k=ALLC.findIndex((_,j)=>!answered(a,j));wizSet(k<0?13:k+1);return}
  if(t.dataset.wiz){const w=t.dataset.wiz;if(w==='next')wizSet(ui.wiz+1);if(w==='prev')wizSet(ui.wiz-1);if(w==='restart')wizSet(0);return}
  if(t.dataset.open){ui.sel.user=t.dataset.open;ui.edit=false;ui.sub.user='wizard';wizSet(13);return}
  if(t.dataset.sel){ui.sel[ui.ctx]=t.dataset.sel;ui.confirm=null;render(true);return}
  if(t.dataset.tabgo){let g=t.dataset.tabgo;if(g==='overview')g='ranking';if(g==='wizard')ui.wiz=0;go(g);return}
  if(t.dataset.sub){ui.edit=false;if(t.dataset.sub==='wizard'&&ui.ctx==='user'&&ui.wiz>0&&ui.wiz<13){}go(t.dataset.sub);return}
  if(t.dataset.score){const [k,i,s]=t.dataset.score.split(':');const a=cur();(k==='gain'?a.n:a.a)[+i]=+s;render(true);return}
  const act=t.dataset.act,a=cur();
  switch(act){
   case 'new':ui.sub.user='wizard';wizSet(0);break;
   case 'ai':runAI(a);break;
   case 'editmode':ui.edit=true;render(true);break;
   case 'readmode':ui.edit=false;render(true);break;
   case 'dup':{const c=JSON.parse(JSON.stringify(a));c.id='b'+Date.now().toString(36);c.assessor=(c.assessor||'')+' (Kopie)';state.list.push(c);ui.sel[ui.ctx]=c.id;render(true);toast('Bewertung dupliziert');break}
   case 'del':ui.confirm='del';render(true);break;
   case 'del-no':ui.confirm=null;render(true);break;
   case 'del-yes':{state.list=state.list.filter(x=>x!==a);ui.sel[ui.ctx]=(state.list[0]||{}).id;ui.confirm=null;render(true);toast('Bewertung gelöscht');break}
   case 'addfy':a.fy=blankFY();a.link=true;ui.sub[ui.ctx]='fy';render();break;
   case 'addstaff':a.fy.staff.push({label:'Neue Position',fte:[0,0,0,0,0],cost:150000,note:''});render(true);break;
   case 'rmstaff':a.fy.staff.splice(+t.dataset.k,1);render(true);break;
   case 'addsrc':(a.fy.sources??=[]).push('');render(true);break;
   case 'rmsrc':a.fy.sources.splice(+t.dataset.k,1);render(true);break;
   case 'hubew':state.w={n:HUBE_W.n.slice(),a:HUBE_W.a.slice()};render(true);toast('Gewichte nach Hube gesetzt');break;
   case 'export':{const s=JSON.stringify(state,null,1);document.getElementById('io').value=s;
     (navigator.clipboard?navigator.clipboard.writeText(s):Promise.reject()).then(()=>toast('JSON in die Zwischenablage kopiert')).catch(()=>{const io=document.getElementById('io');io.focus();io.select();toast('JSON markiert – mit Strg+C kopieren')});break}
   case 'download':{try{const blob=new Blob([JSON.stringify(state,null,1)],{type:'application/json'});const u=URL.createObjectURL(blob);const l=document.createElement('a');l.href=u;l.download='innovationsrendite.json';document.body.appendChild(l);l.click();l.remove();setTimeout(()=>URL.revokeObjectURL(u),2000);toast('Download gestartet (falls blockiert: „JSON kopieren“)')}catch(err){toast('Download nicht möglich – „JSON kopieren“ nutzen')}break}
   case 'import':tryImport(document.getElementById('io').value);break;
   case 'reset':ui.confirm='reset';render(true);break;
   case 'reset-no':ui.confirm=null;render(true);break;
   case 'reset-yes':root.user=userSeed();useCtx(ui.ctx);ui.confirm=null;render(true);toast('Zurückgesetzt');break;
  }
});
function tryImport(txt){try{const s=JSON.parse(txt);if(!s||!Array.isArray(s.list)||!s.w||!s.base)throw 0;s.version=3;root.user=s;ui.sel[ui.ctx]=(s.list[0]||{}).id;useCtx(ui.ctx);render();toast(`${s.list.length} Bewertungen importiert`)}catch(e){toast('Import fehlgeschlagen: keine gültige Export-Datei')}}
document.getElementById('view').addEventListener('change',e=>{
  const t=e.target;
  if(t.id==='importFile'&&t.files[0]){const r=new FileReader();r.onload=()=>tryImport(r.result);r.readAsText(t.files[0]);return}
  if(t.dataset.act==='link'){cur().link=t.checked;render(true);return}
  if(t.dataset.set==='mode'){state.mode=t.value;render(true);return}
  if(t.dataset.w||t.dataset.base==='revenue'||t.dataset.base==='profit'||t.dataset.base==='rnd'){render(true)}
});
document.getElementById('view').addEventListener('input',e=>{
  const t=e.target,a=cur();
  if(t.tagName==='TEXTAREA')autoGrow(t);
  if(t.dataset.why){a.why[t.dataset.why]=t.value;save();return}
  if(t.dataset.field){a[t.dataset.field]=t.value;save();return}
  if(t.dataset.fy){setPath(a.fy,t.dataset.fy,t.value===''?0:+t.value);fillFY();save();return}
  if(t.dataset.fyt){setPath(a.fy,t.dataset.fyt,t.value);save();return}
  if(t.dataset.w){const [k,i]=t.dataset.w.split('.');state.w[k][+i]=t.value===''?0:+t.value;fillW();save();return}
  if(t.dataset.base){const k=t.dataset.base;state.base[k]=['revenue','profit','rnd'].includes(k)?(+t.value||0):t.value;save();return}
  if(t.dataset.set){state[t.dataset.set]=t.value;save();return}
});
/* Direktlinks: #idee öffnet den Rechner, #methode die Quellen. Frühere Links auf entfernte Bereiche führen zum Rechner. */
const ROUTE=k=>({methode:'method',method:'method'}[k]||'user');
const h=(location.hash||'').slice(1);
useCtx(ROUTE(h));
if(h&&!['idee','methode','method','werkzeug'].includes(h)){try{history.replaceState(null,'','#idee')}catch(e){}}
render();
addEventListener('hashchange',()=>{const k=(location.hash||'').slice(1);useCtx(ROUTE(k));ui.confirm=null;render();toTool()});
