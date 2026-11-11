/* ============================== Modell (nach Hube) ============================== */
const N_CRIT=[
 {k:'wirt',t:'Wirtschaftlicher Nutzen',d:'Umsatz/Gewinn oder Einsparpotenzial als Gewinnanteil am Unternehmensgewinn. 0 kein Gewinn · 1 ≤ 3 % · 2 ≤ 5 % · 3 ≤ 20 % · 4 ≤ 30 % · 5 > 30 %',quant:true},
 {k:'kunde',t:'Wahrnehmbarer Kundennutzen',d:'Kann auch ein interner Kunde sein.'},
 {k:'komp',t:'Nutzen durch neue Kompetenzen und Fähigkeiten',d:'Werden Fähigkeiten aufgebaut, die auch für andere Anwendungsfelder oder Märkte wertvoll sind?'},
 {k:'trend',t:'Chancen durch Zukunftsmarkt/Trend',d:'Liegt die Idee in einem langfristigen Trend mit großen Chancen und Potenzialen?'},
 {k:'nachh',t:'Nachhaltigkeits-Nutzen',d:'Ökologischer und/oder sozialer Nutzen neben dem ökonomischen.'},
 {k:'bauchN',t:'Nutzen/Chancen gesamt nach Bauchgefühl',d:'Gesamteindruck der Beurteilenden.'}];
const A_CRIT=[
 {k:'fue',t:'Investitionsaufwand für Entwicklung und Kompetenzaufbau (F&E)',d:'Kumulierte F&E-Kosten als Anteil am F&E-Budget des letzten Jahres. 0 keine Kosten · 1 ≤ 10 % · 2 ≤ 20 % · 3 ≤ 50 % · 4 ≤ 100 % · 5 > 100 %',quant:true},
 {k:'kundeA',t:'Aufwand, Kunden zu überzeugen',d:'Wie schwer ist es, Kunden zum Nutzen und Kauf zu bewegen?'},
 {k:'tech',t:'Erfolgsrisiko (technische) Umsetzbarkeit',d:'Komplexität, Verfügbarkeit, weitere Unsicherheiten.'},
 {k:'markt',t:'Erfolgsrisiko Markt und Wettbewerb',d:'Wettbewerber, Marktdynamik (VUCA), gesetzliche Rahmenbedingungen.'},
 {k:'intern',t:'Aufwand, intern zu überzeugen, und Umstellungsaufwand',d:'Widerstand in der Organisation, Änderungen an Prozessen und Strukturen.'},
 {k:'bauchA',t:'Aufwand/Risiko gesamt nach Bauchgefühl',d:'Gesamteindruck der Beurteilenden.'}];
const HUBE_W={n:[10,20,30,20,10,10],a:[20,10,30,10,10,20]};
const PF_LABELS=[ // [aufwandKat][nutzenKat]  Kat: 1 niedrig, 2 mittel, 3 hoch
 null,
 [null,['Nutzen prüfen/steigern!','y'],['Quick win','g'],['Fast zu schön um wahr zu sein!','g']],
 [null,['Kritisch prüfen!','r'],['?','y'],['Dranbleiben!','g']],
 [null,['Abbrechen!!','r'],['Aufwand prüfen/senken, Nutzen steigern!','r'],['Aufwand prüfen/senken!','y']]];
const SERIES=['--s1','--s2','--s3','--s4','--s5','--s6'];

function cat(v){return v>=3?3:v>=2?2:1}
function catName(c){return ['','niedrig','mittel','hoch'][c]}
function profitRating(profit,share){if(profit<=0)return 0;if(share<=.03)return 1;if(share<=.05)return 2;if(share<=.2)return 3;if(share<=.3)return 4;return 5}
function costRating(cost,share){if(cost<=0)return 0;if(share<=.1)return 1;if(share<=.2)return 2;if(share<=.5)return 3;if(share<=1)return 4;return 5}
const sum=a=>a.reduce((x,y)=>x+(+y||0),0);

function calcFY(fy,base){
  const margin=base.revenue>0?base.profit/base.revenue:0;
  const revenue=fy.qty.map((q,i)=>(+q||0)*(+fy.price[i]||0));
  const profit=revenue.map(r=>r*margin);
  const staffCost=[0,1,2,3,4].map(i=>sum(fy.staff.map(s=>(+s.fte[i]||0)*(+s.cost||0))));
  const rnd=staffCost.map((s,i)=>s+(+fy.material[i]||0));
  const P=sum(profit),C=sum(rnd);
  const pShare=base.profit>0?P/(base.profit*1e6):0, cShare=base.rnd>0?C/(base.rnd*1e6):0;
  return {margin,revenue,profit,staffCost,rnd,R:sum(revenue),P,C,pShare,cShare,
    pRating:profitRating(P,pShare),cRating:costRating(C,cShare),qtySum:sum(fy.qty.map(Number))};
}
function effScores(a){
  const n=a.n.slice(),x=a.a.slice();
  let fy=null;
  if(a.fy){fy=calcFY(a.fy,state.base);if(a.link){n[0]=fy.pRating;x[0]=fy.cRating}}
  return {n,x,fy};
}
function calc(a){
  const {n,x,fy}=effScores(a);
  const wn=n.map((s,i)=>(+s||0)*state.w.n[i]/100), wa=x.map((s,i)=>(+s||0)*state.w.a[i]/100);
  const IN=sum(wn), IA=sum(wa);
  return {n,x,fy,wn,wa,IN,IA,IR:IA>0?IN/IA:Infinity,bil:IN-IA,
    mN:IN/6,mA:IA/6,cN:cat(IN),cA:cat(IA),pf:PF_LABELS[cat(IA)][cat(IN)]};
}
