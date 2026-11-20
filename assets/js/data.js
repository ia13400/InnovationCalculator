/* ============================== Startdaten ============================== */
function userSeed(){
 return {version:3,workbook:'Eigene Idee',mode:'Multiprojekt',horizon:'5 Jahre',
  w:{n:HUBE_W.n.slice(),a:HUBE_W.a.slice()},
  base:{company:'Mein Unternehmen',currency:'EUR',revenue:10,profit:1,rnd:10,
   note:'Beispielwerte aus der Vorlesung (Gewinn 1 Mio €, F&E-Budget 10 Mio €). Bitte durch die Zahlen deines Unternehmens ersetzen.'},
  list:[]};
}
