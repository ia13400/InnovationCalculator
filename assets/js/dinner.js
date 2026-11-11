/* ============================== RocketLight Dinner ============================== */
const RL_PRICE=50000, RL_TABLE=200000;
const RL_MISSIONS=[
 {id:'RL-07',site:'Cape Canaveral, Florida',date:'Fr, 12. März 2027',time:'21:40 Uhr Ortszeit',note:'Nachtstart, Falcon 9'},
 {id:'RL-08',site:'Starbase, Texas',date:'Sa, 24. April 2027',time:'20:15 Uhr Ortszeit',note:'Starship-Testflug, Blick vom Pavillon an der Küste'},
 {id:'RL-09',site:'Cape Canaveral, Florida',date:'Fr, 21. Mai 2027',time:'22:05 Uhr Ortszeit',note:'Nachtstart, Falcon Heavy'},
 {id:'RL-10',site:'Vandenberg, Kalifornien',date:'Sa, 19. Juni 2027',time:'21:30 Uhr Ortszeit',note:'Sonnenuntergangsstart über dem Pazifik'}];
const RL_PHASES=[['T − 90 Min','Pre-Launch'],['T − 60 Min','Propellant Loading'],['T − 30 Min','Stage Separation'],['T − 0','Liftoff'],['T + 8 Min','Booster Landing'],['Orbit','Zero Gravity'],['Landung','Mission Complete']];
const RL_SETS=[
 {k:'falcon',name:'Falcon',tag:'Das Signature-Menü',d:'Kaviar, Kobe-Wagyu und Hummer. Das klassische Menü des Abends.',courses:[
  {n:'Ignition',d:'Kaviar Imperial Beluga auf Buchweizen-Blini, Crème fraîche aus der Normandie, serviert in einer Wolke aus flüssigem Stickstoff.',p:'Krug Clos d’Ambonnay 2006'},
  {n:'Liquid Oxygen',d:'Klare Consommé vom Wagyu, bei Tisch über Yuzu-Eiskristalle gegossen. Der aufsteigende Dampf erinnert an das Betanken der Rakete.',p:'Dassai Beyond Sake'},
  {n:'Zwei Stufen',d:'Hokkaido-Jakobsmuschel in zwei Stufen: roh mit Kombu und Limette, darunter gegrillt mit Beurre blanc und weißem Alba-Trüffel.',p:'Domaine Leflaive Bâtard-Montrachet Grand Cru 2017'},
  {n:'Max Q',d:'A5-Kobe-Wagyu auf heißem Basaltstein, schwarzer Périgord-Trüffel, Sauce aus 30 Jahre altem Balsamico. Serviert im Moment des Starts.',p:'Château Pétrus 2010'},
  {n:'Re-Entry',d:'Bretonischer Hummer, glasiert und bei Tisch flambiert, mit Safran-Sud und Fenchel.',p:'Dom Pérignon P2 Rosé 2004'},
  {n:'Schwerelos',d:'Schwebende Sphäre aus Valrhona-Grand-Cru-Schokolade über einem Magnetsockel, Blattgold, „Marssand“ aus Karamell.',p:'Château d’Yquem 2001'},
  {n:'Mission Patch',d:'Petits Fours in Form von Missions-Patches, Pralinen „Raptor“ mit flüssigem Kern, dazu der persönliche Missions-Patch.',p:'Hennessy Paradis Impérial'}]},
 {k:'odyssey',name:'Odyssey',tag:'Aus dem Ozean',d:'Fisch und Meeresfrüchte aus den Gewässern rund um die Startplätze. Ohne Fleisch.',courses:[
  {n:'Splashdown',d:'Belon-Auster mit Osietra-Kaviar, Champagner-Gelee und Meerwasser-Schaum, serviert auf Eis aus Atlantikwasser.',p:'Salon Blanc de Blancs 2013'},
  {n:'Deep Blue',d:'Dashi vom Blauflossen-Thunfisch, Kombu, schwarzer Sesam. Bei Tisch aus einer gläsernen Kanne aufgegossen.',p:'Juyondai Ryusen Sake'},
  {n:'Gulf Stream',d:'Rotgarnele aus Mazara del Vallo, roh mariniert in Zitrus, mit Kaviar und Kaffirlimette.',p:'Coche-Dury Meursault 2018'},
  {n:'Max Q',d:'Wilder Steinbutt am Knochen gegart, Beurre noisette mit Périgord-Trüffel, Lauch aus der Asche. Serviert im Moment des Starts.',p:'Domaine de la Romanée-Conti Montrachet 2015'},
  {n:'Re-Entry',d:'Königskrabbe aus Alaska, über Holzkohle glasiert, mit Safran-Hollandaise.',p:'Louis Roederer Cristal Rosé 2012'},
  {n:'Schwerelos',d:'Meersalz-Karamell-Sphäre, Kokosnuss und Yuzu, schwebend über einem Magnetsockel.',p:'Château d’Yquem 2001'},
  {n:'Mission Patch',d:'Petits Fours: Seetang-Schokolade, Perlen aus Passionsfrucht, Missions-Patch zum Mitnehmen.',p:'Rémy Martin Louis XIII'}]},
 {k:'starlight',name:'Starlight',tag:'Vegetarisch',d:'Sieben vegetarische Gänge aus Gemüse, Pilzen und Trüffel, ganz ohne Fleisch und Fisch.',courses:[
  {n:'Ignition',d:'„Kaviar“ aus geräucherten Auberginen und Algenperlen, Blini, Crème fraîche, Nebel aus flüssigem Stickstoff.',p:'Krug Grande Cuvée 172ème Édition'},
  {n:'Liquid Oxygen',d:'Consommé von gerösteten Steinpilzen über Yuzu-Eiskristallen.',p:'Dassai Beyond Sake'},
  {n:'Zwei Stufen',d:'Königsausternpilz in zwei Texturen: roh mariniert und gegrillt, Beurre blanc, weißer Alba-Trüffel.',p:'Domaine Leflaive Puligny-Montrachet 2018'},
  {n:'Max Q',d:'Sellerie im Salzteig, am Tisch aufgebrochen, schwarzer Périgord-Trüffel, Trüffeljus. Serviert im Moment des Starts.',p:'Château Margaux 2010'},
  {n:'Re-Entry',d:'Karotte aus dem Holzofen, Safran, Blutorange, geräuchertes Öl.',p:'Dom Pérignon P2 2004'},
  {n:'Schwerelos',d:'Schwebende Sphäre aus Valrhona-Schokolade, Blattgold, Karamell-„Marssand“.',p:'Château d’Yquem 2001'},
  {n:'Mission Patch',d:'Petits Fours aus Früchten und Nüssen, Missions-Patch zum Mitnehmen.',p:'Alkoholfreier Kräuter-Digestif'}]}];
const RL_PAIR=[{k:'grand',t:'Grand-Cru-Begleitung',s:'Weine und Champagner wie im Menü',p:0},{k:'zero',t:'Alkoholfreie Begleitung',s:'Tees, Säfte, Fermente',p:0},{k:'petrus',t:'Upgrade Pétrus 1990',s:'Raritäten-Upgrade zum Hauptgang',p:9500}];
const RL_EXTRAS=[{k:'heli',t:'Helikopter-Transfer',s:'Vom Hotel oder Privatjet-Terminal',p:6500},{k:'brief',t:'Briefing mit Ingenieur',s:'30 Minuten am privaten Tisch',p:12000},{k:'caviar',t:'Kaviar-Upgrade',s:'125 g Imperial Beluga zusätzlich',p:4800},{k:'film',t:'Persönlicher Launch-Film',s:'4K-Film mit Ihrem Tisch und dem Start',p:3500}];

/* ---------- Avatare in Abendgarderobe ---------- */
const SKIN=['#f3d2bb','#e6b58f','#cf9a6c','#a86d45','#7b4a2c','#5a3520'];
const AV_M=[
 {id:'m0',t:'Klassischer Smoking',skin:1,hair:'#3a2617',hs:'side',suit:'#111114',lap:'#26262b',bow:'#0b0b0c'},
 {id:'m1',t:'Weißes Dinner Jacket',skin:2,hair:'#151110',hs:'slick',suit:'#ece6d8',lap:'#ddd5c4',bow:'#0b0b0c'},
 {id:'m2',t:'Mitternachtsblau',skin:4,hair:'#120e0c',hs:'buzz',beard:'short',suit:'#15203a',lap:'#0d1529',bow:'#0d1529'},
 {id:'m3',t:'Samt-Smoking Bordeaux',skin:3,hair:'#1c1410',hs:'curly',suit:'#4b1020',lap:'#2b0911',bow:'#0b0b0c'},
 {id:'m4',t:'Frack, weiße Fliege',skin:0,hair:'#a6a6a6',hs:'slick',glasses:1,suit:'#0c0c0e',lap:'#1d1d21',bow:'#f4f4f4',vest:1},
 {id:'m5',t:'Smaragd-Samt',skin:5,hair:'#0e0b0a',hs:'bald',beard:'full',suit:'#0f3a2b',lap:'#0a271d',bow:'#0b0b0c'},
 {id:'m6',t:'Schalkragen-Smoking',skin:1,hair:'#c79e57',hs:'side',suit:'#121214',lap:'#2c2c31',bow:'#0b0b0c',shawl:1},
 {id:'m7',t:'Smoking mit Einstecktuch',skin:2,hair:'#7a3b1c',hs:'tied',beard:'stubble',suit:'#18181c',lap:'#2a2a30',bow:'#5a1020',pocket:1},
 {id:'m8',t:'Smoking mit Brille',skin:3,hair:'#0f0c0b',hs:'side',glasses:1,suit:'#101012',lap:'#25252a',bow:'#0b0b0c'},
 {id:'m9',t:'Navy mit Seidenschal',skin:4,hair:'#8d8d8d',hs:'curly',beard:'full',suit:'#1a2442',lap:'#121a33',bow:'#0b0b0c',scarf:1}];
const AV_W=[
 {id:'w0',t:'Schwarzes Abendkleid',skin:1,hair:'#2a1a12',hs:'waves',gown:'#0f0f12',cut:'strapless',jw:'pearl'},
 {id:'w1',t:'Smaragd-Robe',skin:3,hair:'#110d0b',hs:'bun',gown:'#0f4b39',cut:'vneck',jw:'gold'},
 {id:'w2',t:'Champagner-Satin',skin:0,hair:'#dcbc72',hs:'bob',gown:'#d8c39c',cut:'off',jw:'silver'},
 {id:'w3',t:'Rotes Abendkleid',skin:2,hair:'#7d2f16',hs:'waves',gown:'#9b1023',cut:'halter',jw:'gold'},
 {id:'w4',t:'Pailletten Mitternachtsblau',skin:5,hair:'#0e0b0a',hs:'afro',gown:'#17224a',cut:'vneck',jw:'silver',sequin:1},
 {id:'w5',t:'Goldene Robe',skin:4,hair:'#100c0a',hs:'braids',gown:'#b38c38',cut:'strapless',jw:'gold'},
 {id:'w6',t:'Abendkleid mit Hijab',skin:2,hair:'#3c2b57',hs:'hijab',gown:'#3c2b57',cut:'high',jw:'pearl'},
 {id:'w7',t:'Silberne Robe',skin:1,hair:'#3b2416',hs:'pixie',gown:'#a8adb6',cut:'off',jw:'silver'},
 {id:'w8',t:'Damen-Smoking',skin:3,hair:'#120e0c',hs:'pony',gown:'#111114',cut:'tux',jw:'gold'},
 {id:'w9',t:'Bordeaux-Samt',skin:0,hair:'#b0502a',hs:'waves',gown:'#5a1022',cut:'off',jw:'gold'}];
const AVATARS=[...AV_M,...AV_W];
const avById=id=>AVATARS.find(a=>a.id===id)||AV_M[0];
function shade(hex,k){const n=parseInt(hex.slice(1),16);let r=n>>16,g=(n>>8)&255,b=n&255;r=Math.max(0,Math.min(255,r*k|0));g=Math.max(0,Math.min(255,g*k|0));b=Math.max(0,Math.min(255,b*k|0));return `rgb(${r},${g},${b})`}
let AVN=0;
function avatarSVG(id,px=96){
  const a=avById(id),sk=SKIN[a.skin],skD=shade(sk,.82),h=a.hair,uid='av'+(AVN++);
  const W=a.id[0]==='w';let s='';
  // backdrop
  s+=`<defs><clipPath id="${uid}c"><circle cx="50" cy="50" r="50"/></clipPath><radialGradient id="${uid}g" cx="50%" cy="35%" r="70%"><stop offset="0" stop-color="#2a2f3a"/><stop offset="1" stop-color="#0c0e13"/></radialGradient></defs><g clip-path="url(#${uid}c)"><rect width="100" height="100" fill="url(#${uid}g)"/>`;
  // hair behind the head
  const back={waves:'M30 46 C27 22 73 22 70 46 L75 86 C66 92 34 92 25 86 Z',bob:'M31 46 C29 24 71 24 69 46 L71 64 C64 69 36 69 29 64 Z',braids:'M30 46 C28 24 72 24 70 46 L72 90 L64 90 L64 60 L36 60 L36 90 L28 90 Z'}[a.hs];
  if(back)s+=`<path d="${back}" fill="${h}"/>`;
  if(a.hs==='afro')s+=`<circle cx="50" cy="38" r="25" fill="${h}"/>`+[[30,30],[70,30],[28,48],[72,48],[40,18],[60,18]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="10" fill="${h}"/>`).join('');
  if(a.hs==='bun')s+=`<circle cx="50" cy="21" r="9" fill="${h}"/>`;
  if(a.hs==='tied')s+=`<circle cx="50" cy="23" r="6" fill="${h}"/>`;
  if(a.hs==='pony')s+=`<path d="M63 34 C82 40 80 66 70 80 C72 62 68 47 61 41Z" fill="${h}"/>`;
  if(a.hs==='hijab')s+=`<path d="M27 50 C25 18 75 18 73 50 C75 68 72 80 86 100 L14 100 C28 80 25 68 27 50Z" fill="${h}"/><path d="M27 50 C25 18 75 18 73 50" fill="none" stroke="${shade(h,1.35)}" stroke-width="1.2" opacity=".6"/>`;
  // body and attire
  if(!W||a.cut==='tux'){
    s+=`<path d="M6 100 C8 82 27 72 50 72 C73 72 92 82 94 100Z" fill="${W?a.gown:a.suit}"/>`;
    if(W){s+=`<path d="M41 72 L59 72 L50 96Z" fill="${sk}"/>`}
    else s+=`<path d="M41 72 L59 72 L50 98Z" fill="#f6f6f4"/>`+(a.vest?`<path d="M44 82 L56 82 L50 98Z" fill="#ffffff" stroke="#d9d9d9" stroke-width=".5"/>`:'');
    const lap=W?shade(a.gown,1.6):a.lap;
    s+=a.shawl?`<path d="M41 72 C36 84 40 94 46 100 L50 98 C44 90 43 80 44 72Z" fill="${lap}"/><path d="M59 72 C64 84 60 94 54 100 L50 98 C56 90 57 80 56 72Z" fill="${lap}"/>`
      :`<path d="M41 72 L50 98 L41 100 L31 84 L38 80Z" fill="${lap}"/><path d="M59 72 L50 98 L59 100 L69 84 L62 80Z" fill="${lap}"/>`;
    if(!W)s+=`<path d="M43 74.5 L50 77.5 L43 80.5Z M57 74.5 L50 77.5 L57 80.5Z" fill="${a.bow}"/><rect x="48.4" y="76" width="3.2" height="3" rx="1" fill="${a.bow}"/>`;
    if(a.scarf)s+=`<path d="M41 72 L45 100 L40 100 L36 76Z M59 72 L55 100 L60 100 L64 76Z" fill="#f2f0ea"/>`;
    if(a.pocket)s+=`<path d="M66 86 L72 84 L71 88Z" fill="#c9a24c"/>`;
  }else{
    s+=`<path d="M8 100 C10 84 26 76 42 75 L58 75 C74 76 90 84 92 100Z" fill="${sk}"/>`;
    const cuts={strapless:'M20 100 C22 92 28 88 32 88 C40 86 60 86 68 88 C72 88 78 92 80 100Z',vneck:'M14 100 C16 86 28 79 38 78 L50 94 L62 78 C72 79 84 86 86 100Z',off:'M10 100 C12 90 22 85 33 85 C44 88 56 88 67 85 C78 85 88 90 90 100Z',halter:'M18 100 C20 90 29 85 36 84 L44 74 L50 90 L56 74 L64 84 C71 85 80 90 82 100Z',high:'M10 100 C12 84 28 74 50 74 C72 74 88 84 90 100Z'};
    s+=`<path d="${cuts[a.cut]}" fill="${a.gown}"/>`;
    if(a.sequin)for(let i=0;i<26;i++){const x=16+((i*37)%68),y=88+((i*13)%11);s+=`<circle cx="${x}" cy="${y}" r=".9" fill="#c9d3ff" opacity=".8"/>`}
  }
  // neck
  if(a.hs!=='hijab')s+=`<path d="M43 57 L57 57 L58 75 C54 77 46 77 42 75Z" fill="${sk}"/><path d="M43 60 C47 64 53 64 57 60 L57 64 C53 67 47 67 43 64Z" fill="${skD}" opacity=".55"/>`;
  // jewelry
  if(W){const c={pearl:'#f4efe6',gold:'#d8b46a',silver:'#dfe5ee'}[a.jw];
    if(a.cut==='high'){s+=`<circle cx="50" cy="80" r="2.2" fill="${c}"/>`}
    else{for(let i=0;i<=10;i++){const t=i/10,x=40+20*t,y=76+Math.sin(t*Math.PI)*5;s+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${a.jw==='pearl'?1.3:.9}" fill="${c}"/>`}
      if(a.jw!=='pearl')s+=`<path d="M50 81 L51.8 84 L50 87 L48.2 84Z" fill="${c}"/>`}}
  // head
  if(a.hs!=='hijab')s+=`<ellipse cx="34.5" cy="47" rx="3" ry="4.2" fill="${skD}"/><ellipse cx="65.5" cy="47" rx="3" ry="4.2" fill="${skD}"/>`;
  s+=`<ellipse cx="50" cy="45" rx="${a.hs==='hijab'?14:16}" ry="${a.hs==='hijab'?17.5:19}" fill="${sk}"/>`;
  s+=`<path d="M36 48 C38 60 44 64 50 64 C56 64 62 60 64 48 C62 58 56 62 50 62 C44 62 38 58 36 48Z" fill="${skD}" opacity=".35"/>`;
  if(W&&a.jw&&a.hs!=='hijab'&&a.hs!=='afro'){const c={pearl:'#f4efe6',gold:'#d8b46a',silver:'#dfe5ee'}[a.jw];s+=`<circle cx="34.5" cy="51.5" r="1.3" fill="${c}"/><circle cx="65.5" cy="51.5" r="1.3" fill="${c}"/>`}
  // beard
  if(a.beard==='full')s+=`<path d="M35 47 C35 63 43 69 50 69 C57 69 65 63 65 47 C62 56 58 58 50 58.5 C42 58 38 56 35 47Z" fill="${h}"/><path d="M44 55.5 C47 54 53 54 56 55.5 C53 56.5 47 56.5 44 55.5Z" fill="${h}"/>`;
  if(a.beard==='short')s+=`<path d="M37 50 C38 62 44 66 50 66 C56 66 62 62 63 50 C60 58 56 60 50 60 C44 60 40 58 37 50Z" fill="${h}" opacity=".85"/>`;
  if(a.beard==='stubble')s+=`<path d="M37 50 C38 62 44 66 50 66 C56 66 62 62 63 50 C60 58 56 60 50 60 C44 60 40 58 37 50Z" fill="${h}" opacity=".35"/>`;
  // face
  s+=`<ellipse cx="44" cy="46.5" rx="1.7" ry="2" fill="#1b1411"/><ellipse cx="56" cy="46.5" rx="1.7" ry="2" fill="#1b1411"/>`;
  s+=`<path d="M40.5 42.2 Q44 40.4 47.3 42" stroke="${a.hs==='hijab'?'#2a1b14':h}" stroke-width="1.3" fill="none" stroke-linecap="round"/><path d="M52.7 42 Q56 40.4 59.5 42.2" stroke="${a.hs==='hijab'?'#2a1b14':h}" stroke-width="1.3" fill="none" stroke-linecap="round"/>`;
  s+=`<path d="M50 47 L48.6 53 Q50 54 51.6 53" stroke="${skD}" stroke-width=".9" fill="none" stroke-linecap="round"/>`;
  s+=W?`<path d="M45.5 57.2 Q50 60.6 54.5 57.2 Q50 58.2 45.5 57.2Z" fill="#a8414a"/>`:`<path d="M45.5 57.4 Q50 60 54.5 57.4" stroke="${shade(sk,.62)}" stroke-width="1.1" fill="none" stroke-linecap="round"/>`;
  if(a.glasses)s+=`<g fill="none" stroke="#1a1a1c" stroke-width="1.1"><rect x="38.6" y="43" width="10" height="7.4" rx="2.6"/><rect x="51.4" y="43" width="10" height="7.4" rx="2.6"/><path d="M48.6 46 L51.4 46"/></g>`;
  // hair in front
  const front={side:'M33 46 C31 27 46 23 56 25 C67 27 70 36 67 46 C64 37 58 33 48 34 C42 35 37 40 33 46Z',slick:'M33.5 44 C33 27 67 27 66.5 44 C63 33 37 33 33.5 44Z',buzz:'M34.5 41 C35.5 29 64.5 29 65.5 41 C60 34.5 40 34.5 34.5 41Z',
    pixie:'M33 47 C30 25 67 21 68 44 C62 39 56 30 46 35 C40 37 36 42 33 47Z',waves:'M33 52 C29 27 71 25 67 52 C64 36 57 31 50 32 C43 33 36 38 33 52Z',bob:'M32 53 C29 26 71 26 68 53 C66 39 60 32 50 32 C41 33 35 39 32 53Z',
    bun:'M33.5 44 C33 27 67 27 66.5 44 C63 33 37 33 33.5 44Z',tied:'M33.5 44 C33 27 67 27 66.5 44 C63 33 37 33 33.5 44Z',pony:'M33.5 45 C33 26 67 26 66.5 45 C63 33 37 33 33.5 45Z',braids:'M33.5 45 C33 26 67 26 66.5 45 C60 33 52 32 50 31 C48 32 40 33 33.5 45Z'}[a.hs];
  if(front)s+=`<path d="${front}" fill="${h}" ${a.hs==='buzz'?'opacity=".75"':''}/>`;
  if(a.hs==='curly')s+=[...Array(9)].map((_,i)=>`<circle cx="${34+i*4}" cy="${31+Math.abs(i-4)*1.9}" r="5.2" fill="${h}"/>`).join('');
  if(a.hs==='afro')s+=`<path d="M34 42 C35 28 65 28 66 42 C60 34 40 34 34 42Z" fill="${h}"/>`;
  if(a.hs==='hijab')s+=`<path d="M36 40 C38 28 62 28 64 40 C60 32 40 32 36 40Z" fill="${h}"/>`;
  s+='</g>';
  return `<svg viewBox="0 0 100 100" width="${px}" height="${px}" role="img" aria-label="${esc(a.t)}">${s}</svg>`;
}

/* ---------- Reservierung ---------- */
let RO={mission:'RL-07',seats:2,pair:'grand',extras:{heli:true},notes:'',guests:[{name:'',av:'m0',menu:'falcon'},{name:'',av:'w0',menu:'falcon'}],pick:null,pickG:'m',menuView:'falcon',done:null};
function syncGuests(){const defs=['m0','w0','m2','w3'];while(RO.guests.length<RO.seats)RO.guests.push({name:'',av:defs[RO.guests.length%4],menu:'falcon'});RO.guests.length=RO.seats;if(RO.pick!==null&&RO.pick>=RO.seats)RO.pick=null}
const usd=v=>Math.round(v).toLocaleString('de-DE')+' USD';
function rlTotal(){const tbl=RO.seats===4;const base=tbl?RL_TABLE:RO.seats*RL_PRICE;
  const pair=(RL_PAIR.find(p=>p.k===RO.pair)||{p:0}).p*RO.seats;
  const ex=RL_EXTRAS.filter(e=>RO.extras[e.k]&&!(tbl&&e.k==='heli')).reduce((s,e)=>s+e.p*(e.k==='brief'?1:RO.seats),0);
  return {base,pair,ex,tot:base+pair+ex,tbl};}
const setName=k=>(RL_SETS.find(x=>x.k===k)||RL_SETS[0]).name;

function vDinExp(){
  return `<section class="xhero"><canvas id="heroCanvas" aria-hidden="true"></canvas><div class="shade"></div>
   <div class="copy"><div class="x-up" style="color:var(--gold)">Dinner mit Raketenstart · 20 Plätze</div>
    <h2>RocketLight<br>Dinner</h2>
    <p>Sieben Gänge Sterneküche, ein echter Raketenstart vor der Glasfront. Das exklusivste Dinner der Welt.</p>
    <div class="row" style="gap:14px"><button class="xbtn solid" data-sub="menu">Menü ansehen</button><button class="xbtn" data-sub="book">Platz reservieren</button><button class="xbtn" data-act="launchfull">Start erleben</button></div></div></section>
  <section class="xstats">
   <div><b>20</b><span>Plätze pro Abend</span></div><div><b>3</b><span>Menüs à 7 Gängen</span></div><div><b>1</b><span>Raketenstart</span></div><div><b>50.000</b><span>USD pro Platz</span></div></section>
  <section class="xsec"><h2>Der Abend</h2><p class="lead">Die Gänge folgen dem Countdown. Wenn die Triebwerke zünden, steht der Hauptgang auf dem Tisch.</p>
   <div class="xsteps">
    <div><span class="k">18:30</span><h3>Ankunft</h3><p>Helikopter oder Limousine zum gläsernen Pavillon, Champagner auf der Terrasse.</p></div>
    <div><span class="k">19:15</span><h3>Briefing</h3><p>Ein Ingenieur erklärt Rakete, Mission und Startfenster.</p></div>
    <div><span class="k">T − 90</span><h3>Menü beginnt</h3><p>Sieben Gänge im Takt des Countdowns, Live-Kommentar aus der Startleitung.</p></div>
    <div><span class="k">T − 0</span><h3>Liftoff</h3><p>Die Rakete steigt vor der Panoramafront auf. Die Nacht wird hell.</p></div></div></section>${rmTeaser()}`;
}
function vDinMenu(){
  const S=RL_SETS.find(x=>x.k===RO.menuView)||RL_SETS[0];
  return `<section class="xsec"><div class="x-up" style="color:var(--gold)">Menü · Mission Profile</div><h2>Drei Menüs, sieben Gänge</h2>
   <p class="lead">Jeder Gang gehört zu einer Phase der Mission. Jeder Gast wählt bei der Reservierung sein eigenes Menü. Weinbegleitung inklusive.</p></section>
  <div class="settabs" role="tablist">${RL_SETS.map(x=>`<button role="tab" aria-selected="${x.k===S.k}" data-mv="${x.k}"><span class="x-up" style="color:var(--gold);font-size:.8rem">${esc(x.tag)}</span><b>${esc(x.name)}</b></button>`).join('')}</div>
  <p class="lead" style="margin-top:-8px">${esc(S.d)}</p>
  <section>${S.courses.map((c,i)=>`<article class="course"><div class="tm">${esc(RL_PHASES[i][0])}<small>${esc(RL_PHASES[i][1])}</small></div>
    <div><h3>${i+1}. ${esc(c.n)}</h3><p>${esc(c.d)}</p><p class="pair">Begleitung: <b>${esc(c.p)}</b></p></div></article>`).join('')}</section>
  <section class="pricebar"><div><div class="x-up muted">Pro Platz, alles inklusive außer Anreise</div><b>50.000 USD</b></div>
   <div><div class="x-up muted">Ganzer Tisch, 4 Plätze, inkl. Helikopter</div><b>200.000 USD</b></div>
   <button class="xbtn solid" data-sub="book">Platz reservieren</button></section>`;
}
function vGuests(){
  syncGuests();
  return RO.guests.map((g,i)=>{const a=avById(g.av);const open=RO.pick===i;const list=RO.pickG==='m'?AV_M:AV_W;
   return `<div class="guest"><div class="gtop">
     <button class="gav" data-pick="${i}" aria-label="Avatar von Gast ${i+1} ändern">${avatarSVG(g.av,96)}<span class="x-up">Ändern</span></button>
     <div class="ginfo"><div class="x-up muted">Gast ${i+1}${i===0?' · Gastgeber':''}</div>
      <label class="f">Name<input id="g-name-${i}" data-gname="${i}" value="${esc(g.name)}" placeholder="${i===0?'z. B. Daniel Meyer':'Name des Gastes'}" autocomplete="off"></label>
      <div class="muted">${esc(a.t)}</div></div></div>
     <div class="gmenu" role="group" aria-label="Menü für Gast ${i+1}">${RL_SETS.map(x=>`<button class="choice" aria-pressed="${g.menu===x.k}" data-gmenu="${i}:${x.k}"><b>${esc(x.name)}</b><span>${esc(x.tag)}</span></button>`).join('')}</div>
     ${open?`<div class="avpick"><div class="row" style="justify-content:space-between"><div class="settabs small" role="tablist"><button role="tab" aria-selected="${RO.pickG==='m'}" data-pg="m"><b>Herren</b></button><button role="tab" aria-selected="${RO.pickG==='w'}" data-pg="w"><b>Damen</b></button></div><button class="xbtn" data-pick="-1" style="padding:10px 18px">Fertig</button></div>
      <div class="avgrid">${list.map(x=>`<button class="avopt" aria-pressed="${g.av===x.id}" data-av="${i}:${x.id}">${avatarSVG(x.id,88)}<span>${esc(x.t)}</span></button>`).join('')}</div>
      <p class="fine">Dresscode: Black Tie. Smoking oder Abendkleid.</p></div>`:''}
    </div>`}).join('');
}
function vDinBook(){
  if(RO.done)return vDinPass(RO.done);
  syncGuests();
  const T=rlTotal(),m=RL_MISSIONS.find(x=>x.id===RO.mission);
  const ch=(on,attrs,b,s,p)=>`<button class="choice" aria-pressed="${on}" ${attrs}><b>${esc(b)}</b><span>${esc(s)}</span>${p?`<span class="p">${p}</span>`:''}</button>`;
  const cnt={};RO.guests.forEach(g=>cnt[g.menu]=(cnt[g.menu]||0)+1);
  return `<section class="xsec"><div class="x-up" style="color:var(--gold)">Reservierung</div><h2>Ihr Platz am Startfenster</h2></section>
  <div class="book"><div style="display:grid;gap:28px;min-width:0">
   <div class="bgroup"><h3>1 · Mission wählen</h3><div class="choices">${RL_MISSIONS.map(x=>ch(x.id===RO.mission,`data-ro="mission:${x.id}"`,x.id+' · '+x.date,x.site+' · '+x.time,x.note)).join('')}</div></div>
   <div class="bgroup"><h3>2 · Plätze</h3><div class="row" style="gap:20px"><div class="stepper"><button data-ro="seats:-1" aria-label="Weniger Plätze">−</button><output>${RO.seats}</output><button data-ro="seats:+1" aria-label="Mehr Plätze">+</button></div>
    <span class="muted">${RO.seats===4?'Ganzer Tisch: 200.000 USD inklusive Helikopter-Transfer':'Ab 4 Plätzen buchen Sie den ganzen Tisch'}</span></div></div>
   <div class="bgroup"><h3>3 · Gäste, Avatar und Menü</h3><p class="muted">Jeder Gast wählt einen Avatar im Black-Tie-Dresscode und eines der drei Menüs.</p>${vGuests()}</div>
   <div class="bgroup"><h3>4 · Begleitung</h3><div class="choices">${RL_PAIR.map(x=>ch(x.k===RO.pair,`data-ro="pair:${x.k}"`,x.t,x.s,x.p?'+ '+usd(x.p)+' p. P.':'inklusive')).join('')}</div></div>
   <div class="bgroup"><h3>5 · Extras</h3><div class="choices">${RL_EXTRAS.map(x=>{const inc=x.k==='heli'&&RO.seats===4;return ch(!!RO.extras[x.k]||inc,`data-ro="extra:${x.k}" ${inc?'disabled':''}`,x.t,x.s,inc?'beim Tisch inklusive':'+ '+usd(x.p)+(x.k==='brief'?' pro Tisch':' p. P.'))}).join('')}</div></div>
   <div class="bgroup" style="border:0"><h3>6 · Wünsche</h3>
    <label class="f">Allergien, Anlass, Wünsche<textarea id="ro-notes" class="in" rows="2" data-rof="notes" placeholder="z. B. keine Nüsse, Jahrestag">${esc(RO.notes)}</textarea></label></div>
  </div>
  <aside class="summary sticky"><div class="x-up muted">Ihre Reservierung</div>
   <div><b class="x-up" style="font-size:1.2rem">${esc(m.id)} · ${esc(m.site)}</b><div class="muted">${esc(m.date)}, ${esc(m.time)}</div></div>
   <div class="avrow">${RO.guests.map(g=>avatarSVG(g.av,52)).join('')}</div>
   <div class="line"><span>${T.tbl?'Ganzer Tisch (4 Plätze)':RO.seats+' × Platz à 50.000 USD'}</span><b>${usd(T.base)}</b></div>
   <div class="line muted"><span>Menüs</span><span>${RL_SETS.filter(x=>cnt[x.k]).map(x=>cnt[x.k]+' × '+x.name).join(' · ')}</span></div>
   ${T.pair?`<div class="line"><span>Upgrade Pétrus 1990</span><b>${usd(T.pair)}</b></div>`:''}
   ${T.ex?`<div class="line"><span>Extras</span><b>${usd(T.ex)}</b></div>`:''}
   <div class="tot"><span class="x-up">Gesamt</span><b>${usd(T.tot)}</b></div>
   <button class="xbtn solid" data-act="rlbook" style="justify-content:center">Reservierung anfragen</button>
   <p class="fine">Startverschiebung? Kostenlose Umbuchung auf den nächsten Start (Launch-Garantie). Keine Zahlung auf dieser Seite.</p>
  </aside></div>`;
}
function vDinPass(o){
  const m=RL_MISSIONS.find(x=>x.id===o.mission);
  return `<section class="xsec"><div class="x-up" style="color:var(--gold)">Reservierung angefragt</div><h2>Willkommen an Bord</h2>
   <p class="lead">Ihre Boarding Passes für das RocketLight Dinner. Unser Concierge meldet sich mit allen Details zur Anreise.</p></section>
  <section class="pass"><div class="main"><div class="x-up muted">RocketLight Dinner · Reservierung</div>
    <div class="code">${esc(o.code)}</div>
    <div class="kv"><div><span>Mission</span><b>${esc(m.id)}</b></div><div><span>Datum</span><b>${esc(m.date)}</b></div><div><span>Startplatz</span><b>${esc(m.site)}</b></div><div><span>Plätze</span><b>${o.seats}</b></div></div>
    <div class="x-up" style="font-size:1.4rem">Gesamt ${usd(o.total)}</div></div>
   <div class="stub"><div class="x-up muted">Einlass</div><b class="x-up" style="font-size:2.4rem">18:30</b><div class="x-up muted">Dresscode</div><b class="x-up" style="font-size:1.6rem">Black Tie</b></div></section>
  <section class="passes">${o.guests.map((g,i)=>`<div class="gpass">${avatarSVG(g.av,110)}<div><div class="x-up muted">Gast ${i+1} · Platz ${String.fromCharCode(65+i)}${(i%2)+1}</div><b class="x-up" style="font-size:1.3rem">${esc(g.name||'Gast '+(i+1))}</b><div>Menü ${esc(setName(g.menu))}</div><div class="muted">${esc(avById(g.av).t)}</div></div></div>`).join('')}</section>
  <div class="row" style="gap:14px"><button class="xbtn solid" data-act="launchfull">Countdown starten</button><button class="xbtn" data-act="rlnew">Weitere Reservierung</button></div>
  <p class="fine">Konzept-Demo des Studienprojekts: Es wird nichts gebucht oder bezahlt, die Reservierung bleibt nur in diesem Browser gespeichert.</p>`;
}
function vDinLaunch(){
  return `<section class="xsec"><div class="x-up" style="color:var(--gold)">Live vom Pavillon</div><h2>Countdown zum Liftoff</h2>
   <p class="lead">So erleben die Gäste den Höhepunkt des Abends. Am besten im Vollbild mit Ton.</p></section>
  <div class="lopts"><span class="x-up muted">Countdown</span>${[10,30,60].map(n=>`<button class="choice" aria-pressed="${LS.len===n}" data-cd="${n}"><b>${n} Sekunden</b></button>`).join('')}</div>
  <div class="lwin"><canvas id="previewCanvas" aria-label="Animation eines Raketenstarts"></canvas></div>
  <div class="row" style="gap:14px"><button class="xbtn solid" data-act="launchfull">Im Vollbild starten</button></div>`;
}

/* ---------- Launch scene (Canvas) ---------- */
const LS={len:10,ov:null,sound:true};
function makeSprite(size,core,edge){const c=document.createElement('canvas');c.width=c.height=size;const x=c.getContext('2d');
  // soft, lumpy cloud puff
  for(let i=0;i<14;i++){const r=size*(.18+Math.random()*.22),px=size/2+(Math.random()-.5)*size*.38,py=size/2+(Math.random()-.5)*size*.38;
    const g=x.createRadialGradient(px,py,0,px,py,r);g.addColorStop(0,core);g.addColorStop(.55,edge);g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.beginPath();x.arc(px,py,r,0,7);x.fill()}
  return c}
let SPR=null;
function sprites(){if(SPR)return SPR;
  const grain=document.createElement('canvas');grain.width=grain.height=192;const gx=grain.getContext('2d'),id=gx.createImageData(192,192);
  for(let i=0;i<id.data.length;i+=4){const v=Math.random()*255;id.data[i]=id.data[i+1]=id.data[i+2]=v;id.data[i+3]=255}gx.putImageData(id,0,0);
  SPR={smoke:[0,1,2].map(()=>makeSprite(160,'rgba(214,208,200,.55)','rgba(170,165,160,.22)')),
       steam:[0,1].map(()=>makeSprite(160,'rgba(245,247,250,.6)','rgba(220,225,232,.22)')),
       lit:[0,1].map(()=>makeSprite(160,'rgba(255,170,90,.55)','rgba(255,120,50,.18)')),grain,soot:(()=>{const c=document.createElement('canvas');c.width=96;c.height=512;const x=c.getContext('2d');
         try{x.filter='blur(1.5px)'}catch(e){}
         for(let i=0;i<70;i++){const sx=Math.random()*96,sy=Math.random()*200,len=200+Math.random()*320,w=.6+Math.random()*3;const g=x.createLinearGradient(0,sy,0,sy+len);g.addColorStop(0,'rgba(25,20,16,0)');g.addColorStop(.4,`rgba(25,20,16,${.08+Math.random()*.16})`);g.addColorStop(1,`rgba(20,16,12,${.2+Math.random()*.3})`);x.fillStyle=g;x.fillRect(sx,sy,w,len)}
         const b=x.createLinearGradient(0,0,0,512);b.addColorStop(0,'rgba(30,26,22,0)');b.addColorStop(.6,'rgba(30,26,22,.18)');b.addColorStop(1,'rgba(24,20,16,.55)');x.fillStyle=b;x.fillRect(0,0,96,512);return c})()};
  return SPR}
function makeScene(canvas,opts={}){
  const ctx=canvas.getContext('2d');let W=0,H=0,dpr=1;const SP=sprites();
  const stars=[...Array(320)].map(()=>({x:Math.random(),y:Math.random()*.85,r:Math.random()*1.3+.25,tw:Math.random()*6}));
  const lights=[...Array(70)].map(()=>({x:Math.random(),c:Math.random()<.15?'255,70,60':'255,205,150',s:Math.random()*1.5+1}));
  const parts=[];let t0=null,last=null,started=false,shake=0;
  const S={len:opts.len||10,idle:!!opts.idle,start(){started=true;t0=performance.now();parts.length=0},reset(){started=false;t0=null;parts.length=0},
    clock:()=>started?(performance.now()-t0)/1000-S.len:-S.len,running:()=>started,stop:false};
  function size(){const r=canvas.getBoundingClientRect();dpr=Math.min(2,window.devicePixelRatio||1);W=Math.max(1,r.width*dpr);H=Math.max(1,r.height*dpr);canvas.width=W;canvas.height=H}
  size();const ro=new ResizeObserver(size);ro.observe(canvas);
  function emit(kind,x,y,vx,vy,r,life){if(parts.length<800)parts.push({k:kind,x,y,vx,vy,r,g:r*(.6+Math.random()*.6),life,age:0,s:(Math.random()*3)|0})}
  function frame(now){
    if(S.stop||!canvas.isConnected){ro.disconnect();return}
    const dt=Math.min(.05,last?(now-last)/1000:0);last=now;
    const tr=S.clock(), core=started?Math.max(0,Math.min(1,(tr+6.4)/1.6)):0, srb=started&&tr>0?Math.min(1,tr/.35):0, fl=.9+Math.random()*.2;
    const u=H/900, baseY=H*.8, rh=H*.62, cw=rh*.074, cx=W*(opts.cx||.5);
    const a=H*.03, rise=tr>.3?.5*a*(tr-.3)*(tr-.3):0, cam=Math.max(0,rise-H*.14);
    const space=Math.min(1,cam/(H*3)), lightK=Math.max(core*.35,srb)*(1-space*.85);
    // cinematic shots: wide, engine close-up during core ignition, wide again for liftoff
    const close=!S.idle&&started&&tr>-7&&tr<-.4&&!opts.noCut;
    // sky
    const g=ctx.createLinearGradient(0,0,0,H);
    g.addColorStop(0,`rgb(${(3+40*lightK*(1-space))|0},${(5+26*lightK*(1-space))|0},${(14*(1-space)+10*lightK)|0})`);
    g.addColorStop(.62,`rgb(${(10+150*lightK)|0},${(16+80*lightK)|0},${(34*(1-space)+20*lightK)|0})`);
    g.addColorStop(1,`rgb(${(22+220*lightK)|0},${(22+130*lightK)|0},${(36*(1-space)+40*lightK)|0})`);
    ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
    for(const s of stars){const y=(s.y*H+cam*.04)%H;ctx.globalAlpha=(.3+.7*space)*(.6+.4*Math.sin(now/700+s.tw))*Math.max(0,1-lightK*1.4);ctx.fillStyle='#fff';ctx.fillRect(s.x*W,y,s.r*dpr,s.r*dpr)}
    ctx.globalAlpha=1;
    ctx.save();
    if(close){const z=2.5+(tr+7)*.05,fx=cx,fy=baseY-rh*.1;ctx.translate(W/2,H*.55);ctx.scale(z,z);ctx.translate(-fx,-fy)}
    if(shake>0)ctx.translate((Math.random()-.5)*shake*u*12,(Math.random()-.5)*shake*u*12);
    ctx.translate(0,cam);
    const sc=tr>6?Math.max(.05,1/(1+(tr-6)*.15)):1;
    const rb=baseY-rh*.06-rise-(1-sc)*H*.3;
    // ground, water, crawlerway lights
    if(baseY-cam<H*1.4){
      ctx.fillStyle='#040507';ctx.fillRect(-W,baseY,W*3,H*2);
      const wg=ctx.createLinearGradient(0,baseY+H*.05,0,baseY+H*.2);wg.addColorStop(0,`rgba(255,${150+60*srb|0},80,${.05+.45*lightK})`);wg.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=wg;ctx.fillRect(-W,baseY+H*.05,W*3,H*.2);
      if(lightK>0){ctx.globalCompositeOperation='lighter';for(let i=0;i<16;i++){ctx.fillStyle=`rgba(255,${170+Math.random()*60|0},90,${.06*lightK})`;const yy=baseY+H*(.06+i*.008),ww=W*(.05+Math.random()*.08);ctx.fillRect(cx-ww/2,yy,ww,1.6*u)}ctx.globalCompositeOperation='source-over'}
      ctx.fillStyle='#08090c';ctx.fillRect(-W,baseY,W*3,H*.05);
      for(const l of lights){ctx.fillStyle=`rgba(${l.c},.75)`;ctx.fillRect(l.x*W,baseY+H*.012,l.s*u,l.s*u)}
      drawML(ctx,cx,baseY,rh,cw,u,tr,now,lightK);
    }
    // emitters: water-deluge steam at core ignition, huge exhaust clouds once the boosters light
    if(!started&&Math.random()<.4)emit('steam',cx+cw*.5,rb-rh*.55,u*(14+Math.random()*20),-u*4,u*7,2.6);
    if(core>0&&tr<.3){const n=Math.floor(dt*core*90);for(let i=0;i<n;i++){const d=Math.random()<.5?-1:1;emit('steam',cx+d*cw*(.3+Math.random()),baseY-rh*.04,d*u*(60+Math.random()*160),-u*(10+Math.random()*40),u*(14+Math.random()*16),3+Math.random()*2)}}
    if(srb>0&&rise<H*1.5){const n=Math.floor(dt*srb*230);for(let i=0;i<n;i++){const d=Math.random()<.5?-1:1;
      if(tr<2.5)emit(Math.random()<.3?'steam':'smoke',cx+d*cw*(.8+Math.random()*1.4),baseY-rh*.03,d*u*(200+Math.random()*420),-u*(10+Math.random()*80),u*(26+Math.random()*30),4+Math.random()*3);
      else emit('smoke',cx+d*cw*.95+(Math.random()-.5)*cw*.5,rb+rh*sc*.02,(Math.random()-.5)*u*80,u*(70+Math.random()*100),u*(16+Math.random()*16)*sc,3.5+Math.random()*3)}}
    for(let i=parts.length-1;i>=0;i--){const p=parts[i];p.age+=dt;if(p.age>p.life){parts.splice(i,1);continue}
      p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=.982;p.vy=p.vy*.982-u*5*dt;p.r+=p.g*dt;const k=Math.min(1,p.age*4)*(1-p.age/p.life);
      const R=p.r*2.4;const spr=(p.k==='steam'?SP.steam:SP.smoke)[p.s%(p.k==='steam'?2:3)];
      ctx.globalAlpha=k*(p.k==='steam'?.6:.8);ctx.drawImage(spr,p.x-R/2,p.y-R/2,R,R);
      const lit=lightK*Math.max(0,1-Math.hypot(p.x-cx,p.y-rb)/(H*.6));
      if(lit>.02){ctx.globalAlpha=k*lit;ctx.drawImage(SP.lit[p.s%2],p.x-R/2,p.y-R/2,R,R)}}
    ctx.globalAlpha=1;
    // engines
    if(core>0)drawPlume(ctx,cx,rb,rh*sc,cw*.9*sc,tr,core*.75,fl,H,'core');
    if(srb>0){const off=cw*.97*sc;drawPlume(ctx,cx-off,rb+rh*sc*.012,rh*sc,cw*.62*sc,tr,srb,fl,H,'srb');drawPlume(ctx,cx+off,rb+rh*sc*.012,rh*sc,cw*.62*sc,tr,srb,fl,H,'srb')}
    drawSLS(ctx,cx,rb,rh*sc,cw*sc,Math.max(core*.5,srb));
    ctx.restore();
    // night turns into day for a moment when the boosters ignite
    if(srb>0&&tr<3){ctx.fillStyle=`rgba(255,226,170,${(.35*(1-tr/3))*fl})`;ctx.fillRect(0,0,W,H)}
    const vg=ctx.createRadialGradient(W/2,H*.55,H*.25,W/2,H*.55,Math.max(W,H)*.8);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.55)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
    ctx.globalAlpha=.05;ctx.globalCompositeOperation='overlay';const ox=Math.random()*192,oy=Math.random()*192;
    ctx.fillStyle=ctx.createPattern(SP.grain,'repeat');ctx.save();ctx.translate(-ox,-oy);ctx.fillRect(ox,oy,W,H);ctx.restore();
    ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
    // letterbox for the cinematic close-up
    if(close){ctx.fillStyle='#000';ctx.fillRect(0,0,W,H*.08);ctx.fillRect(0,H*.92,W,H*.08)}
    shake=tr>-6.4&&tr<12?(tr<0?core*.25:srb*(tr<4?1:1-(tr-4)/8)):0;
    if(opts.loop&&started&&tr>30)S.start();
    if(opts.onFrame)opts.onFrame(tr,started);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  return S;
}
// Mobile launcher: tall steel tower on a wide platform with swing arms to the rocket
function drawML(ctx,cx,base,rh,cw,u,tr,now,light){
  const pw=cw*12,ph=rh*.06,tx=cx-cw*3.4,tw=cw*1.9,th=rh*1.1;
  const steel=`rgb(${(26+120*light)|0},${(28+80*light)|0},${(34+40*light)|0})`;
  ctx.fillStyle='#0c0d11';ctx.fillRect(cx-pw/2,base-ph,pw,ph);
  ctx.fillStyle=steel;ctx.fillRect(cx-pw/2,base-ph,pw,2*u);
  ctx.fillStyle='#0a0b0e';ctx.fillRect(tx-tw/2,base-ph-th,tw,th);
  ctx.strokeStyle=steel;ctx.lineWidth=Math.max(1,1.4*u);ctx.beginPath();
  ctx.moveTo(tx-tw/2,base-ph);ctx.lineTo(tx-tw/2,base-ph-th);ctx.moveTo(tx+tw/2,base-ph);ctx.lineTo(tx+tw/2,base-ph-th);
  for(let y=base-ph;y>base-ph-th;y-=tw*.55){ctx.moveTo(tx-tw/2,y);ctx.lineTo(tx+tw/2,y);ctx.moveTo(tx-tw/2,y);ctx.lineTo(tx+tw/2,y-tw*.55)}
  ctx.stroke();
  ctx.beginPath();ctx.moveTo(tx,base-ph-th);ctx.lineTo(tx,base-ph-th-rh*.1);ctx.stroke();
  ctx.fillStyle=`rgba(255,40,40,${.45+.55*Math.max(0,Math.sin(now/280))})`;ctx.beginPath();ctx.arc(tx,base-ph-th-rh*.1,2.6*u,0,7);ctx.fill();
  // umbilical arms; they swing away at liftoff
  if(tr<.2){ctx.fillStyle='#15171c';const re=cx-cw*.5;[.22,.42,.6,.74,.84].forEach(f=>{ctx.fillRect(tx+tw/2,base-ph-rh*f,re-(tx+tw/2),(f>.8?7:4.5)*u)})}
  // floodlights on the tower
  for(let i=0;i<9;i++){ctx.fillStyle='rgba(255,240,210,.9)';ctx.fillRect(tx+tw/2,base-ph-th*(.1+i*.1),3*u,2*u)}
  const fl=ctx.createRadialGradient(tx,base-ph-th*.5,0,tx,base-ph-th*.5,rh*.5);fl.addColorStop(0,'rgba(255,240,210,.06)');fl.addColorStop(1,'rgba(255,240,210,0)');ctx.fillStyle=fl;ctx.fillRect(tx-rh,base-rh*1.4,rh*2,rh*1.4);
}
function drawPlume(ctx,cx,fy,h,w,tr,k,fl,H,kind){
  ctx.save();ctx.globalCompositeOperation='lighter';
  const air=tr>.3,alt=Math.max(0,tr-8),big=kind==='srb';
  const len=(big?(air?h*(.75+Math.min(1.3,tr*.08)+alt*.03):h*.45*k):h*(air?.35:.18)*k)*fl;
  const wid=w*(big?(air?1.4+Math.min(5,tr*.05+alt*.2):1.3):1.2);const thin=Math.max(.35,1-alt*.03);
  if(big){const bl=ctx.createRadialGradient(cx,fy+len*.1,0,cx,fy+len*.1,h*.9+H*.25*k);bl.addColorStop(0,`rgba(255,215,150,${.55*k})`);bl.addColorStop(.35,`rgba(255,150,60,${.18*k})`);bl.addColorStop(1,'rgba(255,100,30,0)');ctx.fillStyle=bl;ctx.fillRect(cx-H*2,fy-H*2,H*4,H*4)}
  const og=ctx.createLinearGradient(0,fy,0,fy+len);
  if(big){og.addColorStop(0,`rgba(255,250,235,${thin})`);og.addColorStop(.2,`rgba(255,215,140,${.9*thin})`);og.addColorStop(.6,`rgba(255,140,50,${.4*thin})`);og.addColorStop(1,'rgba(200,70,20,0)')}
  else{og.addColorStop(0,'rgba(255,240,220,.9)');og.addColorStop(.35,'rgba(160,190,255,.55)');og.addColorStop(1,'rgba(255,140,60,0)')}
  ctx.fillStyle=og;ctx.beginPath();ctx.moveTo(cx-w*.48,fy);ctx.bezierCurveTo(cx-wid*.75,fy+len*.25,cx-wid*.55,fy+len*.7,cx,fy+len);ctx.bezierCurveTo(cx+wid*.55,fy+len*.7,cx+wid*.75,fy+len*.25,cx+w*.48,fy);ctx.closePath();ctx.fill();
  const cl=len*.38;const cg=ctx.createLinearGradient(0,fy,0,fy+cl);cg.addColorStop(0,'rgba(255,255,255,1)');cg.addColorStop(1,'rgba(255,240,200,0)');
  ctx.fillStyle=cg;ctx.beginPath();ctx.moveTo(cx-w*.42,fy);ctx.quadraticCurveTo(cx-w*.5,fy+cl*.5,cx,fy+cl);ctx.quadraticCurveTo(cx+w*.5,fy+cl*.5,cx+w*.42,fy);ctx.closePath();ctx.fill();
  if(!big&&k>0)for(let i=1;i<=4;i++){const y=fy+len*.14*i,r=w*(.2-.03*i);ctx.fillStyle=`rgba(255,250,240,${.45-.08*i})`;ctx.beginPath();ctx.ellipse(cx,y,r,r*1.6,0,0,7);ctx.fill()}
  ctx.restore();
}
const FOAM=[...Array(46)].map(()=>[Math.random(),Math.random(),.006+Math.random()*.025]);
// Heavy-lift rocket: orange core stage, two white side boosters, upper stage, capsule and escape tower
function drawSLS(ctx,cx,bottom,h,cw,light){
  const Y=f=>bottom-h*f;ctx.save();
  // boosters behind the core edges
  const bw=cw*.62;[-1,1].forEach(d=>{const bx=cx+d*cw*.97-bw/2;
    const sg=ctx.createLinearGradient(bx,0,bx+bw,0);sg.addColorStop(0,'#6a6d73');sg.addColorStop(.35,'#f2f3f4');sg.addColorStop(.7,'#d6d8db');sg.addColorStop(1,'#5b5e64');
    ctx.fillStyle=sg;ctx.fillRect(bx,Y(.56),bw,h*.545);
    ctx.beginPath();ctx.moveTo(bx,Y(.56));ctx.quadraticCurveTo(bx+bw*.15,Y(.6),cx+d*cw*.97,Y(.625));ctx.quadraticCurveTo(bx+bw*.85,Y(.6),bx+bw,Y(.56));ctx.fill();
    ctx.fillStyle='rgba(30,30,34,.85)';[.53,.36,.2].forEach(f=>ctx.fillRect(bx,Y(f),bw,h*.004));
    ctx.fillStyle='#2a2b30';ctx.beginPath();ctx.moveTo(bx,Y(.04));ctx.lineTo(bx-bw*.12,Y(-.005));ctx.lineTo(bx+bw*1.12,Y(-.005));ctx.lineTo(bx+bw,Y(.04));ctx.fill();
    ctx.fillStyle='#1d1d21';ctx.beginPath();ctx.moveTo(bx+bw*.25,Y(-.005));ctx.lineTo(bx+bw*.15,Y(-.022));ctx.lineTo(bx+bw*.85,Y(-.022));ctx.lineTo(bx+bw*.75,Y(-.005));ctx.fill()});
  // core stage with orange foam
  const x=cx-cw/2;const og=ctx.createLinearGradient(x,0,x+cw,0);og.addColorStop(0,'#5a2a10');og.addColorStop(.3,'#d77a35');og.addColorStop(.5,'#c66b2b');og.addColorStop(.8,'#8d4719');og.addColorStop(1,'#3e1d0b');
  ctx.fillStyle=og;ctx.fillRect(x,Y(.62),cw,h*.62);
  ctx.globalAlpha=.18;FOAM.forEach(([fx,fy,fl],i)=>{ctx.fillStyle=i%2?'#4a220c':'#e49453';ctx.fillRect(x+fx*cw*.97,Y(.62)+fy*h*.6,cw*.025,h*fl)});ctx.globalAlpha=1;
  ctx.fillStyle='rgba(40,20,8,.6)';[.47,.3,.12].forEach(f=>ctx.fillRect(x,Y(f),cw,h*.003));
  ctx.fillStyle='#2a2a2e';ctx.fillRect(x,Y(.02),cw,h*.02);
  // RS-25 engine bells
  ctx.fillStyle='#38383c';for(let i=0;i<4;i++){const ex=x+cw*(.14+i*.24);ctx.beginPath();ctx.moveTo(ex-cw*.06,Y(0));ctx.lineTo(ex-cw*.1,Y(-.02));ctx.lineTo(ex+cw*.1,Y(-.02));ctx.lineTo(ex+cw*.06,Y(0));ctx.fill()}
  // upper stage and adapter
  const uw=cw*.7,ux=cx-uw/2;const ug=ctx.createLinearGradient(ux,0,ux+uw,0);ug.addColorStop(0,'#55585e');ug.addColorStop(.35,'#e9eaec');ug.addColorStop(1,'#4d5056');
  ctx.fillStyle=ug;ctx.beginPath();ctx.moveTo(x,Y(.62));ctx.lineTo(ux,Y(.66));ctx.lineTo(ux,Y(.8));ctx.lineTo(ux+uw,Y(.8));ctx.lineTo(ux+uw,Y(.66));ctx.lineTo(x+cw,Y(.62));ctx.fill();
  ctx.fillStyle='rgba(30,30,34,.7)';ctx.fillRect(ux,Y(.7),uw,h*.004);
  // capsule under its protective cover and the escape tower
  ctx.fillStyle=ug;ctx.beginPath();ctx.moveTo(ux,Y(.8));ctx.lineTo(cx-uw*.18,Y(.885));ctx.lineTo(cx+uw*.18,Y(.885));ctx.lineTo(ux+uw,Y(.8));ctx.fill();
  ctx.fillStyle='#d9dadc';ctx.fillRect(cx-cw*.035,Y(.98),cw*.07,h*.095);
  ctx.beginPath();ctx.moveTo(cx-cw*.035,Y(.98));ctx.lineTo(cx,Y(1));ctx.lineTo(cx+cw*.035,Y(.98));ctx.fill();
  ctx.fillStyle='#3a3b40';ctx.fillRect(cx-cw*.07,Y(.93),cw*.14,h*.012);
  // warm light from below
  if(light>0){const lg=ctx.createLinearGradient(0,Y(0),0,Y(.5));lg.addColorStop(0,`rgba(255,190,110,${.55*light})`);lg.addColorStop(1,'rgba(255,170,90,0)');ctx.fillStyle=lg;ctx.fillRect(cx-cw*1.4,Y(.5),cw*2.8,h*.5)}
  ctx.restore();
}
function hud(){return `<div class="hud"><div class="top"><div class="tag">RocketLight Dinner · Live<b id="hudMission">Mission RL-07 · Cape Canaveral</b></div><div class="ctrl"><button class="xbtn" data-lx="sound">${LS.sound?'Ton an':'Ton aus'}</button><button class="xbtn" data-lx="fs">Vollbild</button><button class="xbtn" data-lx="close">Schließen ✕</button></div></div>
  <div class="center"><div><div class="clock" id="hudClock">T − 00:00:${String(LS.len).padStart(2,'0')}</div><div class="msg" id="hudMsg">Startfreigabe erteilt</div>
   <div class="events" id="hudEv"><span data-e="-6.4">Haupttriebwerke</span><span data-e="0">Booster · Liftoff</span><span data-e="12">Max Q</span><span data-e="20">Überschall</span><span data-e="28">Guten Appetit</span></div></div></div>
  <div class="bottom"><div class="tele"><div><span>Geschwindigkeit</span><b id="hudV">0 km/h</b></div><div><span>Höhe</span><b id="hudH">0,0 km</b></div></div>
   <div class="ctrl"><button class="xbtn solid" data-lx="go">Countdown starten</button><button class="xbtn" data-lx="reset">Zurücksetzen</button></div></div></div>`}
function fmtT(tr){const neg=tr<0;let s=Math.abs(tr);s=neg?Math.ceil(s):Math.floor(s);const mm=String(Math.floor(s/60)).padStart(2,'0'),ss=String(s%60).padStart(2,'0');return `T ${neg?'−':'+'} 00:${mm}:${ss}`}
let AUD=null;
function audio(){if(AUD)return AUD;try{const ac=new (window.AudioContext||window.webkitAudioContext)();const n=ac.createBufferSource();const b=ac.createBuffer(1,ac.sampleRate*4,ac.sampleRate);const d=b.getChannelData(0);let l=0;for(let i=0;i<d.length;i++){const w=Math.random()*2-1;l=(l+.02*w)/1.02;d[i]=l*3.5}n.buffer=b;n.loop=true;
  const f=ac.createBiquadFilter();f.type='lowpass';f.frequency.value=180;const g=ac.createGain();g.gain.value=0;n.connect(f).connect(g).connect(ac.destination);n.start();AUD={ac,g};}catch(e){AUD={ac:null,g:null}}return AUD}
function beep(){const A=audio();if(!A.ac||!LS.sound)return;const o=A.ac.createOscillator(),g=A.ac.createGain();o.frequency.value=880;g.gain.value=.08;o.connect(g).connect(A.ac.destination);o.start();o.stop(A.ac.currentTime+.09)}
function openLaunch(){
  closeLaunch();const m=RO.done?RL_MISSIONS.find(x=>x.id===RO.done.mission):RL_MISSIONS[0];
  const el=document.createElement('div');el.id='launchOverlay';el.setAttribute('role','dialog');el.setAttribute('aria-label','Raketenstart im Vollbild');
  el.innerHTML=`<canvas></canvas>${hud()}`;document.body.appendChild(el);document.body.style.overflow='hidden';
  el.querySelector('#hudMission').textContent=`Mission ${m.id} · ${m.site}`;
  let lastS=null;
  const sc=makeScene(el.querySelector('canvas'),{len:LS.len,onFrame:(tr,st)=>{
    const c=el.querySelector('#hudClock');if(!c)return;c.textContent=fmtT(tr);
    const msg=!st?'Startfreigabe erteilt':tr<-6.4?'Countdown läuft':tr<0?'Haupttriebwerke zünden':tr<4?'Booster-Zündung · Liftoff!':tr<12?'Steigflug':tr<20?'Max Q · maximale Belastung':tr<28?'Überschall':'Guten Appetit. Ihr Dessert wird serviert.';
    el.querySelector('#hudMsg').textContent=msg;
    const t=Math.max(0,tr),v=1.9*t*t,hk=1.9*t*t*t/10800;el.querySelector('#hudV').textContent=Math.round(v).toLocaleString('de-DE')+' km/h';el.querySelector('#hudH').textContent=hk.toLocaleString('de-DE',{minimumFractionDigits:1,maximumFractionDigits:1})+' km';
    el.querySelectorAll('#hudEv span').forEach(s=>s.classList.toggle('on',st&&tr>=+s.dataset.e));
    const A=AUD;if(A&&A.g){const target=st&&LS.sound?Math.max(0,Math.min(1,tr<0?(tr+6.4)/6.4*.35:.35+tr/1.5))*(tr>15?Math.max(.15,1-(tr-15)/20):1):0;A.g.gain.value+= (target*0.9-A.g.gain.value)*.05}
    if(st&&tr<0&&tr>-11){const s=Math.ceil(-tr);if(s!==lastS){lastS=s;beep()}}}});
  LS.ov={el,sc};
}
function closeLaunch(){if(!LS.ov)return;LS.ov.sc.stop=true;LS.ov.el.remove();LS.ov=null;document.body.style.overflow='';if(AUD&&AUD.g)AUD.g.gain.value=0;try{if(document.fullscreenElement)document.exitFullscreen()}catch(e){}}
document.addEventListener('click',e=>{const b=e.target.closest('[data-lx]');if(!b||!LS.ov)return;const k=b.dataset.lx,o=LS.ov;
  if(k==='close')closeLaunch();
  if(k==='go'){const A=audio();try{A.ac&&A.ac.resume()}catch(_){}o.sc.start()}
  if(k==='reset'){o.sc.reset()}
  if(k==='sound'){LS.sound=!LS.sound;b.textContent=LS.sound?'Ton an':'Ton aus'}
  if(k==='fs'){try{document.fullscreenElement?document.exitFullscreen():o.el.requestFullscreen().catch(()=>toast('Vollbild ist hier nicht möglich'))}catch(_){toast('Vollbild ist hier nicht möglich')}}});
document.addEventListener('keydown',e=>{if(LS.ov&&e.key==='Escape'&&!document.fullscreenElement)closeLaunch()});
function mountDinnerCanvases(){
  const h=document.getElementById('heroCanvas');if(h)makeScene(h,{idle:true,len:10,cx:innerWidth>800?.78:.5});
  const p=document.getElementById('previewCanvas');if(p){const s=makeScene(p,{len:LS.len,loop:true});setTimeout(()=>{if(p.isConnected)s.start()},600);}
}
