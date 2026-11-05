const root=document.querySelector('#polls'),message=document.querySelector('#message');
let polls=[],filter='all';
let serverBase=Date.now(),monotonicBase=performance.now();
const serverNow=()=> (serverBase+performance.now()-monotonicBase)/1000;
function updateCountdown(){
 const title=document.querySelector('#countdown-title'),time=document.querySelector('#countdown-time'),note=document.querySelector('#countdown-note');
 const candidates=polls.filter(p=>p.mode==='public'&&p.deployed_at).sort((a,b)=>b.deployed_at-a.deployed_at),p=candidates.find(p=>p.status==='open'&&p.ends>serverNow())||candidates[0]||cfg.schedule;
 if(!p)return;
 const before=serverNow()<p.starts,remaining=VotingClock.remaining(before?p.starts:p.ends,serverNow());
 const notice=document.querySelector('#schedule-notice'),noticeTitle=document.querySelector('#schedule-notice-title'),noticeText=document.querySelector('#schedule-notice-text');
 const opens=new Date(p.starts*1000).toLocaleString('sk-SK',{timeZone:'Europe/Bratislava',weekday:'long',day:'numeric',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit'});
 if(before){notice.hidden=false;noticeTitle.textContent='Hlasovanie sa ešte nezačalo';noticeText.textContent=`Hlasovanie sa otvorí ${opens} slovenského času. Dovtedy si môžete prezrieť návrhy, odpoveď však ešte nemožno odoslať.`;}
 else if(!remaining){notice.hidden=false;noticeTitle.textContent='Hlasovanie je ukončené';noticeText.textContent='Ďakujeme za váš záujem. Ďalšie odpovede už nie je možné odoslať.';}
 else{notice.hidden=true;}

 title.textContent=before?'Do začiatku ankety zostáva':remaining?'Do konca ankety zostáva':'Anketa sa skončila';time.textContent=VotingClock.label(remaining);
 const date=s=>new Date(s*1000).toLocaleString('sk-SK',{timeZone:'Europe/Bratislava'});
 note.textContent=`Začiatok: ${date(p.starts)} · Koniec: ${date(p.ends)} (Bratislava)${!cfg.enabled?' · Náhľad, odpovede sa neodosielajú.':''}`;
 document.querySelectorAll('button[data-poll-end]').forEach(button=>{
  if(serverNow()>=Number(button.dataset.pollEnd)){button.disabled=true;button.textContent='Anketa sa skončila';}
  else if(cfg.enabled&&button.dataset.pollStatus==='open'&&button.dataset.submitted!=='true'&&button.dataset.busy!=='true'){button.disabled=serverNow()<Number(button.dataset.pollStart);button.textContent=button.disabled?'Anketa sa ešte nezačala':'Odoslať odpoveď';}
 });
}
setInterval(updateCountdown,1000);
const cfg=window.VOTING_CONFIG;
const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
async function api(path,data){const r=await fetch('/api/voting/'+path,{credentials:'same-origin',cache:'no-store',method:data?'POST':'GET',headers:data?{'Content-Type':'application/json','X-Vote-Request':'1'}:{},body:data?JSON.stringify(data):undefined});if([404,405].includes(r.status)&&cfg.fallbackOrigin&&location.origin!==cfg.fallbackOrigin){location.replace(cfg.fallbackOrigin+'/hlasovania/');throw Error('Otvárame anketu na dostupnom serveri…');}const stamp=Number(r.headers.get('X-Server-Time'));if(stamp>0){serverBase=stamp;monotonicBase=performance.now();}const v=await r.json();if(!r.ok)throw Error(v.error||'Požiadavka zlyhala.');return v;}
function render(){root.replaceChildren();for(const p of polls.filter(p=>filter==='all'||p.mode===filter)){
 const card=el('article',undefined,'poll'),form=el('form');card.append(el('h2','Vyberte svoje priority'));form.setAttribute('aria-label',p.question);
 const date=s=>new Date(s*1000).toLocaleString('sk-SK',{timeZone:'Europe/Bratislava'});if(cfg.enabled&&p.deployed_at)card.append(el('p',`${date(p.starts)} – ${date(p.ends)} (Bratislava)`,'poll-dates'));
 const field=el('fieldset'),legend=el('legend','Môžete vybrať viac možností. Všetko odošlete jedným tlačidlom.');field.append(legend);
 const selection=el('p','Vybrané návrhy: 0','selection-count');selection.setAttribute('aria-live','polite');
 const addOption=(container,i)=>{const text=p.options[i],label=el('label',undefined,'option'),input=el('input');input.type='checkbox';input.name='choice';input.value=String(i);const copy=el('span');const split=text.indexOf(' – ');if(split>0){copy.append(el('strong',text.slice(0,split)),el('span',text.slice(split+3),'option-description'));}else copy.textContent=text;label.append(input,copy);container.append(label);};
 const sections=p.sections?.length?p.sections:[{title:'Možnosti',indices:p.options.map((_,i)=>i)}];
 sections.forEach((section,i)=>{const group=el('section',undefined,'poll-section');group.id=`${p.id}-section-${i}`;const heading=el('h3');heading.append(el('span',String(i+1).padStart(2,'0'),'section-number'),el('span',section.title));group.append(heading);section.indices.forEach(index=>addOption(group,index));field.append(group);});
 form.append(field);field.addEventListener('change',()=>{selection.textContent=`Vybrané návrhy: ${field.querySelectorAll('input:checked').length}`;});
 let credential;if(p.mode==='member'){const label=el('label','Jednorazový hlasovací kód');credential=el('input');credential.autocomplete='off';credential.maxLength=64;credential.required=true;label.append(credential);form.append(label);}
 const noteBlock=el('div',undefined,'survey-note'),noteLabel=el('label','Chcete ešte niečo doplniť?'),note=el('textarea');note.id=`${p.id}-note`;note.name='note';note.maxLength=1500;note.rows=4;note.placeholder='Váš ďalší návrh alebo poznámka…';noteLabel.htmlFor=note.id;
 const noteHelp=el('p','Nepovinné · Najviac 1 500 znakov. Nepíšte mená, kontakty ani iné osobné údaje.','note-help');noteHelp.id=`${p.id}-note-help`;note.setAttribute('aria-describedby',noteHelp.id);noteBlock.append(noteLabel,note,noteHelp);form.append(noteBlock);
 const widget=el('div'),status=el('p');status.setAttribute('role','status');const button=el('button',cfg.enabled?'Odoslať odpoveď':'Odoslať odpoveď · náhľad','primary');button.type='submit';button.dataset.pollEnd=p.ends;button.dataset.pollStart=p.starts;button.dataset.pollStatus=p.status;button.disabled=!cfg.enabled||p.status!=='open'||serverNow()<p.starts||serverNow()>=p.ends;const actions=el('div',undefined,'survey-submit');actions.append(selection,button);form.append(widget,actions,status);let widgetId;
 if(cfg.enabled&&window.turnstile)widgetId=window.turnstile.render(widget,{sitekey:cfg.turnstileSiteKey,action:'vote'});
 form.addEventListener('submit',async event=>{event.preventDefault();if(!cfg.enabled)return;if(serverNow()<p.starts||serverNow()>=p.ends){status.textContent=serverNow()<p.starts?'Hlasovanie sa ešte nezačalo.':'Hlasovanie sa skončilo.';return;}button.disabled=true;button.dataset.busy='true';try{const choices=new FormData(form).getAll('choice').map(Number);if(!choices.length||choices.length>p.max_choices)throw Error(`Vyberte 1 až ${p.max_choices} možností.`);const turnstileToken=window.turnstile.getResponse(widgetId);await api(`polls/${p.id}/vote`,{choices,note:note.value.trim(),turnstileToken,...(credential?{credential:credential.value.trim()}:{})});button.dataset.submitted='true';status.textContent='Váš hlas bol prijatý. Ďakujeme.';field.disabled=true;note.disabled=true;if(credential)credential.value='';}catch(e){status.textContent=e.message;button.disabled=serverNow()<p.starts||serverNow()>=p.ends;window.turnstile.reset(widgetId);}finally{button.dataset.busy='false';}});card.append(form);
 if(p.published){const result=el('button','Zobraziť schválené výsledky','secondary');result.type='button';result.addEventListener('click',async()=>{try{const r=await api(`polls/${p.id}/results`);if(r.suppressed){status.textContent=r.message;return;}const out=el('div');out.append(el('p',`${r.total} odovzdaných odpovedí. Percentá vyjadrujú podiel respondentov; ich súčet môže presiahnuť 100 %.`));r.counts.forEach((count,i)=>{out.append(el('p',`${p.options[i]}: ${count} (${r.total?Math.round(count/r.total*100):0} %)`));});card.append(out);result.disabled=true;}catch(e){status.textContent=e.message;}});card.append(result);}root.append(card);
}if(!root.children.length)root.append(el('p','Momentálne tu nie sú žiadne hlasovania.'));updateCountdown();}
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.filter;render();}));
async function init(){if(cfg.enabled)document.querySelector('#preview-note').hidden=true;if(!cfg.enabled){const t=window.EMPLOYEE_POLL;polls=[{...t,id:'demo-employee',mode:'public',max_choices:t.maxChoices,status:'draft'}];render();return;}
 try{await api('session',{});polls=(await api('polls')).filter(p=>p.mode==='public');await new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';s.onload=resolve;s.onerror=reject;document.head.append(s);});render();}catch(e){message.textContent=e.message||'Hlasovanie nie je dostupné.';}}
init();
