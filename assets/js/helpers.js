/* ============================== Hilfen ============================== */
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const f2=v=>v===Infinity?'∞':(Number.isFinite(v)?v.toLocaleString('de-DE',{minimumFractionDigits:2,maximumFractionDigits:2}):'–');
const fInt=v=>Math.round(+v||0).toLocaleString('de-DE');
const fMio=v=>((+v||0)/1e6).toLocaleString('de-DE',{minimumFractionDigits:2,maximumFractionDigits:2})+' Mio';
const fPct=v=>((+v||0)*100).toLocaleString('de-DE',{minimumFractionDigits:2,maximumFractionDigits:3})+' %';
const label=a=>a.assessor?`${a.project} · ${a.assessor}`:a.project;
function toast(t){const el=document.getElementById('toast');el.textContent=t;el.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>el.hidden=true,2200)}
function irChip(r){const v=r.IR;const c=v>=1.5?'ok':v>=1?'mid':'bad';return `<span class="chip ${c}">IR ${f2(v)}</span>`}
function pfChip(r){const c={g:'ok',y:'mid',r:'bad'}[r.pf[1]];return `<span class="chip ${c}">${esc(r.pf[0])}</span>`}

/* ============================== Charts (SVG) ============================== */
function barChart(items,{key,ref=null,fmt=f2,title}){
  const rows=items.map(a=>({a,v:calc(a)[key]})).map(o=>({...o,v:o.v===Infinity?null:o.v}));
  const vals=rows.map(o=>o.v??0);
  let max=Math.max(ref??0,...vals,0.5),min=Math.min(0,...vals);
  const step=niceStep((max-min)/4);max=Math.ceil(max/step)*step;min=Math.floor(min/step)*step;
  const W=900,lw=330,rh=50,top=10,H=top+rows.length*rh+34,pw=W-lw-70;
  const x=v=>lw+(v-min)/(max-min||1)*pw;
  let g='';
  for(let t=min;t<=max+1e-9;t+=step){g+=`<line x1="${x(t)}" x2="${x(t)}" y1="${top}" y2="${H-28}" stroke="var(--line)"/><text x="${x(t)}" y="${H-8}" text-anchor="middle">${fmt(t)}</text>`}
  if(ref!==null)g+=`<line x1="${x(ref)}" x2="${x(ref)}" y1="${top-4}" y2="${H-28}" stroke="var(--ink)" stroke-width="2" stroke-dasharray="6 4"/>`;
  rows.forEach((o,i)=>{const y=top+i*rh+10;const v=o.v;const name=label(o.a);
    g+=`<text class="lab" x="${lw-14}" y="${y+19}" text-anchor="end">${esc(name.length>34?name.slice(0,33)+'…':name)}</text>`;
    if(v===null){g+=`<text x="${x(max)-4}" y="${y+19}" text-anchor="end" style="fill:var(--ink)">∞</text>`;return}
    const x0=x(Math.min(0,v)),x1=x(Math.max(0,v));
    g+=`<rect x="${x0}" y="${y}" width="${Math.max(1,x1-x0)}" height="26" rx="5" fill="${colorOf(o.a)}"/>`;
    g+=`<text x="${x1+8}" y="${y+19}" style="fill:var(--ink);font-size:17px;font-weight:600">${fmt(v)}</text>`});
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="${esc(title)}">${g}</svg>`;
}
function niceStep(r){const p=Math.pow(10,Math.floor(Math.log10(r||1)));const n=r/p;return (n<=1?1:n<=2?2:n<=2.5?2.5:n<=5?5:10)*p}
function radar(items){
  const crit=[...N_CRIT.map(c=>({t:c.t,g:'n'})),...A_CRIT.map(c=>({t:c.t,g:'a'}))];
  const short=['Wirtschaftl. Nutzen','Kundennutzen','Kompetenzen','Zukunftsmarkt','Nachhaltigkeit','Bauch Nutzen','F&E-Aufwand','Kunden überzeugen','Techn. Risiko','Markt/Wettbewerb','Intern überzeugen','Bauch Aufwand'];
  const W=860,H=640,cx=W/2,cy=H/2,R=220,n=12;
  const pt=(i,v)=>{const ang=-Math.PI/2+i*2*Math.PI/n;return [cx+Math.cos(ang)*R*v/5,cy+Math.sin(ang)*R*v/5]};
  let g='';
  for(let r=1;r<=5;r++){g+=`<polygon points="${[...Array(n)].map((_,i)=>pt(i,r).join(',')).join(' ')}" fill="none" stroke="var(--line)"/>`;g+=`<text x="${cx+3}" y="${cy-R*r/5-2}">${r}</text>`}
  for(let i=0;i<n;i++){const [x,y]=pt(i,5);const [lx,ly]=pt(i,6.0);
    g+=`<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="var(--line)"/>`;
    const anchor=Math.abs(lx-cx)<10?'middle':lx>cx?'start':'end';
    g+=`<text class="lab" x="${lx}" y="${ly+4}" text-anchor="${anchor}" style="fill:${i<6?'var(--gain)':'var(--cost)'};font-size:17px">${short[i]}</text>`}
  items.forEach(a=>{const r=calc(a);const v=[...r.n,...r.x];
    g+=`<polygon points="${v.map((s,i)=>pt(i,+s||0).join(',')).join(' ')}" fill="${colorOf(a)}" fill-opacity=".14" stroke="${colorOf(a)}" stroke-width="3"/>`;
    v.forEach((s,i)=>{const [x,y]=pt(i,+s||0);g+=`<circle cx="${x}" cy="${y}" r="5" fill="${colorOf(a)}"/>`})});
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Netzgrafik der Einzelbewertungen">${g}</svg>`;
}
function legend(items){return `<div class="legend">${items.map(a=>`<span><i class="dot" style="background:${colorOf(a)}"></i>${esc(label(a))}</span>`).join('')}</div>`}
function portfolio(items){
  const cells={};items.forEach(a=>{const r=calc(a);(cells[r.cA+'-'+r.cN]??=[]).push(a)});
  let h='';
  for(let ca=1;ca<=3;ca++){
    h+=`<div class="ylab">${['','Niedrig &lt; 2','Mittel 2 – &lt; 3','Hoch 3 – 5'][ca]}</div>`;
    for(let cn=1;cn<=3;cn++){const [t,c]=PF_LABELS[ca][cn];
      h+=`<div class="cell ${c}"><span class="lbl">${esc(t)}</span>${(cells[ca+'-'+cn]||[]).map(a=>`<button class="item" data-open="${a.id}"><i class="dot" style="background:${colorOf(a)}"></i>${esc(label(a))}</button>`).join('')}</div>`}}
  h+=`<div></div><div class="xlab">Niedrig &lt; 2</div><div class="xlab">Mittel 2 – &lt; 3</div><div class="xlab">Hoch 3 – 5</div>`;
  return `<div class="pf">${h}</div><div class="axis-note"><span>↕ Aufwand/Risiko gesamt</span><span>Nutzen/Chancen gesamt →</span></div>`;
}
