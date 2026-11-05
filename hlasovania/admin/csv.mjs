// Quote every cell and neutralize spreadsheet formulas in administrator-entered text.
export function csvCell(value){
 let text=String(value??'');
 if(/^[\s\uFEFF]*[=+@-]/u.test(text)||/^[\t\r\n]/.test(text))text="'"+text;
 return '"'+text.replaceAll('"','""')+'"';
}
export function summaryCsv(summary){
 const rows=[
 ['ID ankety',summary.id],['Otázka',summary.question],
 ['Začiatok UTC',new Date(summary.starts*1000).toISOString()],
 ['Koniec UTC',new Date(summary.ends*1000).toISOString()],
 ['Počet odoslaných odpovedí',summary.total],
 ['Poznámka','Možno označiť viac možností. Percentá sú podielom respondentov; súčet môže presiahnuť 100 %.'],
 [],['Sekcia','Možnosť','Počet označení','Podiel respondentov (%)'],
 ...summary.options.map(row=>[row.section||'',row.option,row.count,(summary.total?100*row.count/summary.total:0).toFixed(2).replace('.',',')])
 ];
 if(summary.notes?.length)rows.push([],['NEVEREJNÉ POZNÁMKY — pred zdieľaním odstráňte prípadné osobné údaje'],['Poznámka'],...summary.notes.map(note=>[note]));
 return '\uFEFF'+rows.map(row=>row.map(csvCell).join(';')).join('\r\n')+'\r\n';
}
export function downloadSummary(summary){
 const url=URL.createObjectURL(new Blob([summaryCsv(summary)],{type:'text/csv;charset=utf-8'}));
 const link=document.createElement('a');link.href=url;link.download=`anketa-${summary.id}-suhrn.csv`;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
