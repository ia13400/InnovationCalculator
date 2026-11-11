/* ============================== Zustand ============================== */
const KEY='innorendite.v4';
let root=null, state;
const ui={ctx:'user',wiz:0,edit:false,sub:{user:'wizard',spacex:'ideas',dinner:'exp'},sel:{user:'u1',spacex:'sli-ki'},confirm:null};
try{root=JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){}
if(!root||!root.user||!root.spacex){let old=null;try{old=JSON.parse(localStorage.getItem('innorendite.v3')||'null')}catch(e){}
  root={user:userSeed(),spacex:(old&&old.version===3&&Array.isArray(old.list))?old:seed()}}
/* Migration: gespeicherte SpaceX-Arbeitsmappen erhalten die KI-Bewertungen der beiden weiteren Finalisten einmalig dazu; vorhandene Einträge bleiben unverändert. */
if(root.spacex&&Array.isArray(root.spacex.list)&&!(root.spacex.seedRev>=2)){
  const add=seed().list.filter(a=>['sli-ki','lec-ki'].includes(a.id)&&!root.spacex.list.some(b=>b.id===a.id));
  root.spacex.list.push(...add);root.spacex.seedRev=2}
try{const u=JSON.parse(localStorage.getItem(KEY+'.ui')||'null');if(u){Object.assign(ui.sub,u.sub||{});Object.assign(ui.sel,u.sel||{})}}catch(e){}
if(['rmover','rm4w','rmtp','rmbud','rmmap','rmsrc'].includes(ui.sub.dinner))ui.sub.dinner='exp';
function useCtx(c){ui.ctx=c;document.body.classList.toggle('dinner',c==='dinner');if(!state)state=root.user;if(c!=='method'&&c!=='dinner'){state=root[c];if(!state.list.find(a=>a.id===ui.sel[c]))ui.sel[c]=(state.list[0]||{}).id}}
let saveT;
function save(){clearTimeout(saveT);saveT=setTimeout(()=>{try{localStorage.setItem(KEY,JSON.stringify(root));localStorage.setItem(KEY+'.ui',JSON.stringify({sub:ui.sub,sel:ui.sel}))}catch(e){}},250)}
const cur=()=>state.list.find(a=>a.id===ui.sel[ui.ctx]);
const isX=()=>ui.ctx==='spacex';
const colorOf=a=>`var(${SERIES[state.list.indexOf(a)%SERIES.length]})`;
