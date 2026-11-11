/* ============================== Rendering & Events ============================== */
/* Eine Seite: Erzählung oben, Werkzeug darunter. Wechsel im Werkzeug führen an dessen Anfang, nicht an den Seitenanfang. */
function toTool(behavior){const w=document.getElementById('werkzeug');if(!w){window.scrollTo(0,0);return}const hd=document.querySelector('header.top');window.scrollTo({top:Math.max(0,w.getBoundingClientRect().top+scrollY-(hd?hd.offsetHeight:0)),behavior:behavior||'instant'})}

const VIEWS={exp:vDinExp,menu:vDinMenu,book:vDinBook,launch:vDinLaunch,wizard:vWizard,ranking:vRanking,portfolio:vPortfolio,bars:vBars,top:vTop,detail:vDetail,assess:vAssess,fy:vFY,ideas:vIdeas,pool:vPool,settings:vSettings,rmover:vRmOver,rm4w:vRm4w,rmtp:vRmTp,rmbud:vRmBud,rmmap:vRmMap,rmsrc:vRmSrc};
const STEPS={
 user:[['wizard','1','Ideen-Check'],['ranking','2','Meine Ideen'],['portfolio','3','Portfolio & Netz'],['bars','4','Rendite & Bilanz'],['assess','Extra','Feintuning'],['fy','Extra','5-Jahres-Kalkulation'],['settings','Extra','Einstellungen']],
 dinner:[['exp','01','Das Erlebnis','Das Dinner'],['menu','02','Menü','Das Dinner'],['book','03','Reservieren','Das Dinner'],['launch','04','Countdown','Das Dinner'],['rmover','05','Überblick','Umsetzung · Teil 6'],['rm4w','06','4 W-Fragen','Umsetzung · Teil 6'],['rmtp','07','Teilprojekte','Umsetzung · Teil 6'],['rmbud','08','Budget','Umsetzung · Teil 6'],['rmmap','09','Roadmap','Umsetzung · Teil 6'],['rmsrc','10','Quellen','Umsetzung · Teil 6']],
 spacex:[['ideas','Schritt 1','Vom Trend zur Idee'],['pool','Schritt 2','Die 12 Ideen'],['top','Schritt 3','Die Finalisten'],['detail','Schritt 4','Bewertung im Detail'],['fy','Schritt 5','5-Jahres-Kalkulation'],['ranking','Schritt 6','Ranking'],['portfolio','Schritt 7','Portfolio & Netz'],['bars','Schritt 8','Rendite & Bilanz'],['settings','Extra','Einstellungen']]};
const INTRO={
 dinner:{exp:null,menu:null,book:null,launch:null,rmover:null,rm4w:null,rmtp:null,rmbud:null,rmmap:null,rmsrc:null},
 user:{wizard:null,
  ranking:['Vergleich','Meine Ideen im Ranking','Alle Ideen, die du geprüft hast, sortiert nach Innovationsrendite.'],
  portfolio:['Vergleich','Wo landen deine Ideen?','Das Aufwand/Nutzen-Portfolio zeigt auf einen Blick, welche Idee ein Quick win ist und welche du abbrechen solltest.'],
  bars:['Vergleich','Rendite und Bilanz','Rendite = Nutzen ÷ Aufwand. Über 1 ist die Idee „profitabel“.'],
  assess:['Extra','Feintuning','Alle zwölf Kriterien auf einer Seite: Punkte anpassen und Begründungen ergänzen.'],
  fy:['Extra','5-Jahres-Kalkulation','Berechne Gewinn und Entwicklungskosten über fünf Jahre. Daraus ergeben sich zwei der zwölf Bewertungen automatisch.'],
  settings:['Extra','Einstellungen','Gewichte der Kriterien und Kennzahlen deines Unternehmens.']},
 spacex:{ideas:['Schritt 1 · Trendportfolio','Vom Trend zur Idee','Aus acht Trends hat die Gruppe nach dem Stufenmodell Geschäftsideen abgeleitet und zwölf davon nach Machbarkeit und Originalität eingeordnet.'],
  pool:['Schritt 2 · Ideenpool','Die 12 Ideen','Jede Idee mit Trend, Kurzbeschreibung und der Einschätzung von Gruppe und KI.'],
  top:['Schritt 3 · Inno-Rendite-Kalkulator','Die Finalisten','Die drei WOW-Ideen im Inno-Rendite-Kalkulator, jeweils getrennt von Team und KI (Claude) bewertet. Karte anklicken für Details.'],
  detail:['Schritt 4 · Bewertung','Jede Punktzahl begründet','Zwölf Kriterien je Idee, mit Gewicht und Begründung.'],
  fy:['Schritt 5 · Zahlen','5-Jahres-Kalkulation','Gewinn und F&E-Kosten über fünf Jahre auf Basis des SpaceX-Börsenprospekts (S-1).'],
  ranking:['Schritt 6 · Ergebnis','Ranking nach Innovationsrendite','Welche Idee liefert den meisten Nutzen pro Aufwand?'],
  portfolio:['Schritt 7 · Ergebnis','Aufwand/Nutzen-Portfolio','Wo die Ideen im Portfolio nach Prof. Hube landen.'],
  bars:['Schritt 8 · Ergebnis','Rendite und Bilanz','Die Innovationsrendite aller Bewertungen im direkten Vergleich.'],
  settings:['Extra','Einstellungen','Gewichtung der Gruppe und SpaceX-Kennzahlen 2025.']}};
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
    html=subnav()+(it?`<section class="intro"><div class="eyebrow">${esc(it[0])}</div><h2 style="font-size:clamp(2.2rem,5vw,3.4rem)">${esc(it[1])}</h2><p>${esc(it[2])}</p></section>`:'')+VIEWS[sub]()+(sub==='wizard'&&ui.wiz>0&&ui.wiz<13?'':pager());}
  document.getElementById('view').innerHTML=html;
  const sub=ui.sub[ui.ctx];
  if(ui.ctx==='dinner')mountDinnerCanvases();
  if(ui.ctx!=='method'&&ui.ctx!=='dinner'&&sub==='fy')fillFY();
  if(ui.ctx!=='method'&&ui.ctx!=='dinner'&&sub==='settings')fillW();
  document.querySelectorAll('textarea.in').forEach(autoGrow);
  if(keepScroll)window.scrollTo(0,y);
  save();
}
function fillW(){['n','a'].forEach(k=>{const s=sum(state.w[k]);document.querySelectorAll(`[data-out="wsum-${k}"]`).forEach(e=>{e.textContent=s+' %';e.style.color=s===100?'var(--gain)':'var(--bad)'})})}
function autoGrow(t){t.style.height='auto';t.style.height=Math.min(t.scrollHeight+2,320)+'px'}
function go(sub){
  const part6={rmover:'vision',rm4w:'mission',rmtp:'projects',rmbud:'budget',rmmap:'timeline',rmsrc:'sources'};
  if(ui.ctx==='dinner'&&typeof part6[sub]==='string'){location.assign(`./teil6/#${part6[sub]}`);return}
  ui.sub[ui.ctx]=sub;ui.confirm=null;render();toTool()
}
function goCtx(c){useCtx(c);ui.confirm=null;try{history.replaceState(null,'','#'+({user:'idee',spacex:'spacex',dinner:'dinner',method:'methode'}[c]))}catch(e){}render();toTool()}
function newAssessment(ideaId){
  const idea=IDEAS.find(i=>i.id===ideaId);
  const a={id:'b'+Date.now().toString(36),project:idea?idea.name:'Neue Idee '+(state.list.length+1),assessor:state.mode==='Multibeurteilende'?'Beurteiler '+(state.list.length+1):(isX()?'Gruppe 2':''),idea:idea?idea.id:'',link:false,n:isX()?[0,0,0,0,0,0]:[3,3,3,3,3,3],a:isX()?[0,0,0,0,0,0]:[3,3,3,3,3,3],why:{},fy:null};
  state.list.push(a);ui.sel[ui.ctx]=a.id;return a;
}
function blankFY(){return {unit:'Stück',priceUnit:'Preis je Stück',qty:[0,0,0,0,0],price:[0,0,0,0,0],qtyNote:'',priceNote:'',staff:[{label:'F&E-Mitarbeiter',fte:[0,0,0,0,0],cost:150000,note:''}],material:[0,0,0,0,0],materialNote:'',sources:[]}}
function setPath(obj,path,val){const p=path.split('.');let o=obj;for(let i=0;i<p.length-1;i++)o=o[p[i]];o[p[p.length-1]]=val}

document.getElementById('tabs').addEventListener('click',e=>{const b=e.target.closest('button[data-ctx]');if(b)goCtx(b.dataset.ctx)});
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
  if(t.dataset.ro){const [k,v]=t.dataset.ro.split(':');if(k==='seats')RO.seats=Math.max(1,Math.min(4,RO.seats+(+v)));else if(k==='extra')RO.extras[v]=!RO.extras[v];else RO[k]=v;render(true);return}
  if(t.dataset.cd){LS.len=+t.dataset.cd;render(true);return}
  if(t.dataset.mv){RO.menuView=t.dataset.mv;render(true);return}
  if(t.dataset.pick!==undefined){const k=+t.dataset.pick;RO.pick=k<0||RO.pick===k?null:k;if(RO.pick!==null)RO.pickG=avById(RO.guests[k].av).id[0];render(true);return}
  if(t.dataset.pg){RO.pickG=t.dataset.pg;render(true);return}
  if(t.dataset.av){const [k,id]=t.dataset.av.split(':');RO.guests[+k].av=id;render(true);return}
  if(t.dataset.gmenu){const [k,m]=t.dataset.gmenu.split(':');RO.guests[+k].menu=m;render(true);return}
  if(t.dataset.opt!==undefined){const a=cur(),c=ALLC[ui.wiz-1];(c.g==='n'?a.n:a.a)[c.i]=+t.dataset.opt;render();return}
  if(t.dataset.wizgo){wizSet(+t.dataset.wizgo);return}
  if(t.dataset.wizopen){ui.sel.user=t.dataset.wizopen;const a=cur();const k=ALLC.findIndex((_,j)=>!answered(a,j));wizSet(k<0?13:k+1);return}
  if(t.dataset.wiz){const w=t.dataset.wiz;if(w==='next')wizSet(ui.wiz+1);if(w==='prev')wizSet(ui.wiz-1);if(w==='restart')wizSet(0);return}
  if(t.dataset.open){ui.sel[ui.ctx]=t.dataset.open;ui.edit=false;if(isX())go('detail');else{ui.sub.user='wizard';wizSet(13)}return}
  if(t.dataset.sel){ui.sel[ui.ctx]=t.dataset.sel;ui.confirm=null;render(true);return}
  if(t.dataset.tabgo){let g=t.dataset.tabgo;if(isX()&&g==='assess'){g='detail';ui.edit=true}if(g==='overview')g='ranking';if(g==='wizard')ui.wiz=0;go(g);return}
  if(t.dataset.sub){ui.edit=false;if(t.dataset.sub==='wizard'&&ui.ctx==='user'&&ui.wiz>0&&ui.wiz<13){}go(t.dataset.sub);return}
  if(t.dataset.newidea){newAssessment(+t.dataset.newidea);ui.edit=true;go('detail');return}
  if(t.dataset.score){const [k,i,s]=t.dataset.score.split(':');const a=cur();(k==='gain'?a.n:a.a)[+i]=+s;render(true);return}
  const act=t.dataset.act,a=cur();
  switch(act){
   case 'launchfull':openLaunch();break;
   case 'rlnew':RO.done=null;render(true);break;
   case 'rlbook':{const T=rlTotal();const code='RL-'+Math.random().toString(36).slice(2,6).toUpperCase();RO.pick=null;RO.done={code,mission:RO.mission,seats:RO.seats,guests:JSON.parse(JSON.stringify(RO.guests)),total:T.tot,at:Date.now()};(root.orders??=[]).push(RO.done);save();render();toTool();toast('Reservierung angefragt');break}
   case 'new':if(!isX()){ui.sub.user='wizard';wizSet(0);break}newAssessment();ui.edit=true;render(true);break;
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
   case 'reset-no':case 'blank-no':ui.confirm=null;render(true);break;
   case 'reset-yes':root[ui.ctx]=isX()?seed():userSeed();useCtx(ui.ctx);ui.confirm=null;render(true);toast('Zurückgesetzt');break;
   case 'blank':ui.confirm='blank';render(true);break;
   case 'blank-yes':{const s=userSeed();s.list=[];root[ui.ctx]=s;useCtx(ui.ctx);ui.confirm=null;render(true);toast('Leere Arbeitsmappe');break}
  }
});
function tryImport(txt){try{const s=JSON.parse(txt);if(!s||!Array.isArray(s.list)||!s.w||!s.base)throw 0;s.version=3;root[ui.ctx]=s;ui.sel[ui.ctx]=(s.list[0]||{}).id;useCtx(ui.ctx);render();toast(`${s.list.length} Bewertungen importiert`)}catch(e){toast('Import fehlgeschlagen: keine gültige Export-Datei')}}
document.getElementById('view').addEventListener('change',e=>{
  const t=e.target;
  if(t.id==='importFile'&&t.files[0]){const r=new FileReader();r.onload=()=>tryImport(r.result);r.readAsText(t.files[0]);return}
  if(t.dataset.act==='link'){cur().link=t.checked;render(true);return}
  if(t.dataset.field==='idea'){cur().idea=t.value?+t.value:'';save();return}
  if(t.dataset.set==='mode'){state.mode=t.value;render(true);return}
  if(t.dataset.w||t.dataset.base==='revenue'||t.dataset.base==='profit'||t.dataset.base==='rnd'){render(true)}
});
document.getElementById('view').addEventListener('input',e=>{
  const t=e.target,a=cur();
  if(t.tagName==='TEXTAREA')autoGrow(t);
  if(t.dataset.rof){RO[t.dataset.rof]=t.value;return}
  if(t.dataset.gname!==undefined){RO.guests[+t.dataset.gname].name=t.value;return}
  if(t.dataset.why){a.why[t.dataset.why]=t.value;save();return}
  if(t.dataset.field&&t.dataset.field!=='idea'){a[t.dataset.field]=t.value;save();return}
  if(t.dataset.fy){setPath(a.fy,t.dataset.fy,t.value===''?0:+t.value);fillFY();save();return}
  if(t.dataset.fyt){setPath(a.fy,t.dataset.fyt,t.value);save();return}
  if(t.dataset.w){const [k,i]=t.dataset.w.split('.');state.w[k][+i]=t.value===''?0:+t.value;fillW();save();return}
  if(t.dataset.base){const k=t.dataset.base;state.base[k]=['revenue','profit','rnd'].includes(k)?(+t.value||0):t.value;save();return}
  if(t.dataset.set){state[t.dataset.set]=t.value;save();return}
});
const h=(location.hash||'').slice(1);
if(h==='roadmap'||h==='teil6'){
  location.replace('./teil6/');
}else{
  useCtx({spacex:'spacex',dinner:'dinner',launch:'dinner',methode:'method',method:'method'}[h]||'user');
  if(h==='launch')ui.sub.dinner='launch';
  render();
  if(h&&h!=='case')requestAnimationFrame(()=>toTool());
}
/* Zurück/Vor und Sprunglinks innerhalb der einen Seite */
addEventListener('hashchange',()=>{const k=(location.hash||'').slice(1);
  if(k==='roadmap'||k==='teil6'){location.replace('./teil6/');return}
  const c={idee:'user',spacex:'spacex',dinner:'dinner',launch:'dinner',methode:'method',method:'method'}[k];
  if(c){useCtx(c);if(k==='launch')ui.sub.dinner='launch';ui.confirm=null;render();toTool()}});
