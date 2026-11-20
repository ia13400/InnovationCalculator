/* ============================== Zustand ============================== */
const KEY='innorendite.v4';
let root=null, state;
const ui={ctx:'user',wiz:0,edit:false,sub:{user:'wizard'},sel:{user:'u1'},confirm:null};
try{root=JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){}
/* Gespeicherte Arbeitsmappen bleiben erhalten; ältere Einträge anderer Bereiche werden nur nicht mehr angezeigt. */
if(!root||!root.user||!Array.isArray(root.user.list)){root=Object.assign(root&&typeof root==='object'?root:{},{user:userSeed()})}
try{const u=JSON.parse(localStorage.getItem(KEY+'.ui')||'null');if(u){if(u.sub&&u.sub.user)ui.sub.user=u.sub.user;if(u.sel&&u.sel.user)ui.sel.user=u.sel.user}}catch(e){}
function useCtx(c){ui.ctx=c;state=root.user;if(c==='user'&&!state.list.find(a=>a.id===ui.sel.user))ui.sel.user=(state.list[0]||{}).id}
let saveT;
function save(){clearTimeout(saveT);saveT=setTimeout(()=>{try{localStorage.setItem(KEY,JSON.stringify(root));localStorage.setItem(KEY+'.ui',JSON.stringify({sub:ui.sub,sel:ui.sel}))}catch(e){}},250)}
const cur=()=>state.list.find(a=>a.id===ui.sel.user);
const colorOf=a=>`var(${SERIES[state.list.indexOf(a)%SERIES.length]})`;
