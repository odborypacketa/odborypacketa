const POLL='f4305b6f-2917-424a-bc0c-bcecb2bdddfa';
const $=id=>document.getElementById(id),date=value=>new Date(value*1000).toLocaleString('sk-SK',{timeZone:'Europe/Bratislava',day:'numeric',month:'numeric',year:'numeric',hour:'2-digit',minute:'2-digit'});
let snapshot=null,base=0,tick=0,busy=false,renderedResults=false;
const node=(tag,text)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;return n;};
async function api(path){
 const r=await fetch('/api/voting/'+path,{cache:'no-store',credentials:'omit',signal:AbortSignal.timeout(12000)});
 if([404,405].includes(r.status)&&window.VOTING_CONFIG?.fallbackOrigin&&location.origin!==VOTING_CONFIG.fallbackOrigin){location.replace(VOTING_CONFIG.fallbackOrigin+'/hlasovania/prehlad/');throw Error('Otvárame dostupný server…');}
 const data=await r.json();if(!r.ok)throw Error(data.error||'Údaje sa nepodarilo načítať.');return data;
}
function countdown(){
 if(!snapshot)return;const now=base+(performance.now()-tick)/1000;
 const before=now<snapshot.starts,ended=now>=snapshot.ends,remaining=Math.max(0,Math.ceil((before?snapshot.starts:snapshot.ends)-now));
 $('clock-label').textContent=before?'Do začiatku zostáva':ended?'Anketa sa skončila':'Do konca zostáva';
 $('clock').textContent=ended?'Ďakujeme za účasť.':`${Math.floor(remaining/86400)} dní · ${Math.floor(remaining%86400/3600)} hod · ${Math.floor(remaining%3600/60)} min`;
 $('state').textContent=before?'Pripravuje sa':ended?'Ukončená':'Prebieha';
}
async function showResults(){
 if(!snapshot.resultsAvailable){$('results-note').textContent=snapshot.state==='ended'?'Anketa sa skončila. Výsledky sa zobrazia po zverejnení správcom, ak bude prijatých aspoň 10 odpovedí.':'Počas hlasovania sa jednotlivé výsledky nezobrazujú. Po skončení ich tu nájdete po zverejnení správcom a pri najmenej 10 odpovediach.';return;}
 if(renderedResults)return;
 const data=await api(`polls/${POLL}/results`);
 if(data.suppressed){$('results-badge').textContent='Nízky počet odpovedí';$('results-note').textContent=data.message;return;}
 const polls=await api('polls'),poll=polls.find(p=>p.id===POLL);
 if(!poll||!Array.isArray(data.counts)||poll.options.length!==data.counts.length||!Number.isInteger(data.total)||data.total<10)throw Error('Výsledky zatiaľ nie sú pripravené na zobrazenie.');
 const sections=poll.sections?.length?poll.sections:[{title:'Všetky návrhy',indices:poll.options.map((_,i)=>i)}],fragment=document.createDocumentFragment();
 for(const section of sections){const group=node('section');group.className='result-section';group.append(node('h3',section.title));for(const i of [...section.indices].sort((a,b)=>data.counts[b]-data.counts[a])){
 const count=data.counts[i],percent=Math.round(count/data.total*100),row=node('div');row.className='result-row';const label=node('div');label.className='result-label';label.append(node('span',poll.options[i]),node('strong',`${count.toLocaleString('sk-SK')} · ${percent} %`));const bar=node('progress');bar.max=data.total;bar.value=count;bar.setAttribute('aria-label',poll.options[i]);row.append(label,bar);group.append(row);
 }fragment.append(group);}
 $('results').replaceChildren(fragment);$('results-badge').textContent='Zverejnené';$('results-note').textContent=`Súhrn z ${data.total.toLocaleString('sk-SK')} odpovedí. Percentá vyjadrujú podiel odpovedí, ktoré označili daný návrh. Keďže bolo možné vybrať viac možností, súčet percent môže presiahnuť 100 %.`;renderedResults=true;
}
async function refresh(){
 if(busy)return;busy=true;$('refresh').disabled=true;
 try{const data=await api(`polls/${POLL}/participation`);if(!Number.isInteger(data.total)||data.total<0||!Number.isInteger(data.checkedAt))throw Error('Server vrátil neplatné údaje.');snapshot=data;base=data.checkedAt;tick=performance.now();$('total').textContent=data.total.toLocaleString('sk-SK');$('dates').textContent=`${date(data.starts)} – ${date(data.ends)}`;$('updated').textContent=`Overené ${date(data.checkedAt)} · Obnova každú minútu`;$('error').hidden=true;countdown();await showResults();}
 catch(e){$('error').textContent=`${e.message||'Spojenie nie je dostupné.'} ${snapshot?'Zobrazené údaje pochádzajú z poslednej úspešnej kontroly.':'Počet odpovedí zatiaľ nevieme overiť.'}`;$('error').hidden=false;}
 finally{busy=false;$('refresh').disabled=false;}
}
$('refresh').addEventListener('click',refresh);
$('share').addEventListener('click',async()=>{const url='https://odbory-anketa.odborypacketa.workers.dev/hlasovania/prehlad/';try{await navigator.clipboard.writeText(url);$('share').textContent='Odkaz skopírovaný ✓';}catch{$('share').textContent='Odkaz je v adresnom riadku';}});
refresh();setInterval(countdown,1000);setInterval(()=>{if(!document.hidden)refresh();},60000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh();});
