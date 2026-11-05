export function validateNote(value){
 if(value===undefined)return '';
 if(typeof value!=='string'||value.length>1500||/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value))throw Object.assign(new Error('Poznámka môže mať najviac 1 500 znakov.'),{status:400});
 return value.trim();
}
const enc = new TextEncoder();
const hex = b => [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('');
export const digest = async text => hex(await crypto.subtle.digest('SHA-256',enc.encode(text)));
const fail = (status,message) => { throw Object.assign(new Error(message),{status}); };
export function validatePoll(d) {
 if (!d || Object.keys(d).some(k=>!['question','options','mode','starts','ends','minimum','maxChoices','sections'].includes(k))) fail(400,'Neplatné polia.');
 if(typeof d.question!=='string'||!d.question.trim()||d.question.length>300||!Array.isArray(d.options)||d.options.length<2||d.options.length>64||d.options.some(x=>typeof x!=='string'||!x.trim()||x.length>700)||new Set(d.options.map(x=>x.trim())).size!==d.options.length||!['public','member'].includes(d.mode)||!Number.isInteger(d.starts)||!Number.isInteger(d.ends)||d.ends<=d.starts||!Number.isInteger(d.minimum)||d.minimum<10||d.minimum>100000) fail(400,'Skontrolujte otázku, možnosti a termíny.');
 if(!Number.isInteger(d.maxChoices)||d.maxChoices<1||d.maxChoices>d.options.length)fail(400,'Neplatný maximálny počet odpovedí.');
 const sections=d.sections??[];if(!Array.isArray(sections)||sections.length>20||sections.some(s=>!s||typeof s.title!=='string'||!s.title.trim()||s.title.length>150||!Array.isArray(s.indices)||!s.indices.length||s.indices.some(i=>!Number.isInteger(i)||i<0||i>=d.options.length)))fail(400,'Neplatné sekcie.');
 const indices=sections.flatMap(s=>s.indices);if(sections.length&&(indices.length!==d.options.length||new Set(indices).size!==d.options.length))fail(400,'Každá možnosť musí patriť práve do jednej sekcie.');
 return {...d,sections,question:d.question.trim(),options:d.options.map(x=>x.trim())};
}
async function body(r) {
 if(r.headers.get('content-type')?.split(';')[0]!=='application/json') fail(415,'Vyžaduje sa JSON.');
 const reader=r.body?.getReader(); if(!reader) fail(400,'Chýba formulár.');
 let n=0, chunks=[]; while(true){const {done,value}=await reader.read();if(done)break;n+=value.length;if(n>65536){await reader.cancel();fail(413,'Príliš veľký formulár.');}chunks.push(value);}
 const bytes=new Uint8Array(n);let off=0;for(const c of chunks){bytes.set(c,off);off+=c.length;}
 try{return JSON.parse(new TextDecoder().decode(bytes));}catch{fail(400,'Neplatný JSON.');}
}
async function mac(secret,value){const k=await crypto.subtle.importKey('raw',enc.encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);return hex(await crypto.subtle.sign('HMAC',k,enc.encode(value)));}
async function limit(db,key,max){const now=Math.floor(Date.now()/1000);const row=await db.prepare('INSERT INTO limits(key,count,expires) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=CASE WHEN expires<=? THEN 1 ELSE count+1 END, expires=CASE WHEN expires<=? THEN ? ELSE expires END RETURNING count').bind(key,now+60,now,now,now+60).first();if(row.count>max)fail(429,'Priveľa požiadaviek. Skúste neskôr.');}
const decode=s=>Uint8Array.from(atob(s.replace(/-/g,'+').replace(/_/g,'/')),c=>c.charCodeAt(0));
async function admin(r,e){
 const jwt=r.headers.get('Cf-Access-Jwt-Assertion');if(!jwt)fail(401,'Prihláste sa do administrácie.');
 try{
 const [h,p,s,...extra]=jwt.split('.');if(extra.length)throw Error();const head=JSON.parse(new TextDecoder().decode(decode(h))), claims=JSON.parse(new TextDecoder().decode(decode(p)));
 const issuer=`https://${e.ACCESS_TEAM}.cloudflareaccess.com`,now=Date.now()/1000;
 if(head.alg!=='RS256'||claims.iss!==issuer||!Array.isArray(claims.aud)||!claims.aud.includes(e.ACCESS_AUD)||!(claims.exp>now)||!(claims.iat<=now+30)||(claims.nbf&&claims.nbf>now)||!claims.sub||!(e.ADMIN_EMAILS?typeof claims.email==='string'&&e.ADMIN_EMAILS.split(',').includes(claims.email.toLowerCase()):e.ADMIN_SUBJECTS?.split(',').includes(claims.sub)))throw Error();
 const res=await fetch(`${issuer}/cdn-cgi/access/certs`,{signal:AbortSignal.timeout(5000)});if(!res.ok)throw Error();const jwks=await res.json();const jwk=jwks.keys.find(k=>k.kid===head.kid&&k.kty==='RSA');if(!jwk)throw Error();
 const key=await crypto.subtle.importKey('jwk',jwk,{name:'RSASSA-PKCS1-v1_5',hash:'SHA-256'},false,['verify']);if(!await crypto.subtle.verify('RSASSA-PKCS1-v1_5',key,decode(s),enc.encode(`${h}.${p}`)))throw Error();
 return digest(claims.sub);
 }catch{fail(403,'Prístup zamietnutý.');}
}
async function bot(d,e){
 if(typeof d.turnstileToken!=='string'||d.turnstileToken.length>2048||!d.turnstileToken)fail(400,'Dokončite ochranu proti robotom.');
 const r=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',body:new URLSearchParams({secret:e.TURNSTILE_SECRET,response:d.turnstileToken}),signal:AbortSignal.timeout(7000)});if(!r.ok)fail(503,'Overenie nie je dostupné.');const v=await r.json();if(!v.success||v.hostname!==new URL(e.ORIGIN).hostname||v.action!=='vote')fail(403,'Zopakujte overenie.');
}
export async function handler(r,e){
 const u=new URL(r.url),path=u.pathname,method=r.method,db=e.DB;
 if(e.ENABLED!=='true'||e.PRIVACY_READY!=='true'||!db||!e.RATE_SECRET||e.RATE_SECRET.length<32||!e.TURNSTILE_SECRET||!e.ACCESS_TEAM||!e.ACCESS_AUD||!(e.ADMIN_SUBJECTS||e.ADMIN_EMAILS))fail(503,'Hlasovanie zatiaľ nie je spustené.');
 if(u.origin!==e.ORIGIN)fail(403,'Nepovolený hostiteľ.');
 if(!['GET','POST'].includes(method))fail(405,'Nepovolená metóda.');
 if(method==='POST'&&(r.headers.get('Origin')!==e.ORIGIN||r.headers.get('X-Vote-Request')!=='1'))fail(403,'Nepovolený pôvod požiadavky.');
 const ip=r.headers.get('CF-Connecting-IP');if(!ip)fail(503,'Vyžaduje sa dôveryhodný proxy server.');
 await limit(db,await mac(e.RATE_SECRET,`${Math.floor(Date.now()/86400000)}:${ip}`),method==='GET'?120:20);
 if(path==='/api/voting/polls'&&method==='GET'){const {results}=await db.prepare("SELECT * FROM polls WHERE status!='draft' ORDER BY ends DESC LIMIT 100").all();return results.map(p=>({...p,options:JSON.parse(p.options),sections:JSON.parse(p.sections||'[]')}));}
 const match=path.match(/^\/api\/voting\/polls\/([0-9a-f-]{36})\/(vote|results)$/);
 if(match){const [,id,action]=match,p=await db.prepare('SELECT * FROM polls WHERE id=?').bind(id).first();if(!p||p.status==='draft')fail(404,'Hlasovanie sa nenašlo.');
 if(action==='results'&&method==='GET'){
 if(!p.published||p.status!=='closed'||Date.now()/1000<p.ends)fail(404,'Výsledky nie sú zverejnené.');
 const {total}=await db.prepare('SELECT COUNT(*) AS total FROM ballots WHERE poll=?').bind(id).first();const {results}=await db.prepare('SELECT j.value AS choice,COUNT(*) AS count FROM ballots b,json_each(b.choices) j WHERE b.poll=? GROUP BY j.value').bind(id).all();if(total<p.minimum)return {suppressed:true,message:'Výsledky sa nezverejnia pre malý počet hlasov.'};return {total,counts:JSON.parse(p.options).map((_,i)=>results.find(x=>x.choice===i)?.count||0)};
 }
 if(action==='vote'&&method==='POST'){
 const d=await body(r);if(Object.keys(d).some(k=>!['choices','note','credential','turnstileToken'].includes(k))||!Array.isArray(d.choices)||d.choices.length<1||d.choices.length>p.max_choices||new Set(d.choices).size!==d.choices.length||d.choices.some(c=>!Number.isInteger(c)||c<0||c>=JSON.parse(p.options).length))fail(400,'Neplatná možnosť.');
 const note=validateNote(d.note);
 if(p.status!=='open'||Date.now()/1000<p.starts||Date.now()/1000>=p.ends)fail(409,'Hlasovanie nie je otvorené.');
 await bot(d,e);let token;
 if(p.mode==='member'){
 if(e.MEMBER_READY!=='true')fail(503,'Členský režim čaká na schválenie pravidiel a ochrany tajnosti.');
 token=d.credential;if(typeof token!=='string'||!/^[a-f0-9]{64}$/.test(token))fail(403,'Neplatný hlasovací kód.');
 }else{token=r.headers.get('Cookie')?.match(/(?:^|; )__Host-voter=([a-f0-9]{64})(?:;|$)/)?.[1];if(!token)fail(403,'Najprv povoľte nevyhnutnú cookie.');}
 const hash=await digest(`${id}:${token}`);
 if(p.mode==='member'&&!await db.prepare('SELECT 1 FROM credentials WHERE poll=? AND digest=?').bind(id,hash).first())fail(403,'Neplatný hlasovací kód.');
 try{await db.batch([db.prepare('INSERT INTO spent(poll,digest) VALUES(?,?)').bind(id,hash),db.prepare('INSERT INTO ballots(id,poll,choices,note) VALUES(?,?,?,?)').bind(crypto.randomUUID(),id,JSON.stringify(d.choices),note)]);}catch(error){if(/UNIQUE constraint failed: spent/.test(String(error)))fail(409,'Tento kód alebo prehliadač už hlasoval.');throw error;}
 return {ok:true};
 }
 }
 if(path.startsWith('/api/voting/admin')){
 const actor=await admin(r,e);await limit(db,`admin:${actor}`,30);
 const exportMatch=path.match(/^\/api\/voting\/admin\/([0-9a-f-]{36})\/export$/);
 if(exportMatch&&method==='GET'){
 const summary=await exportSummary(db,exportMatch[1]);
 await db.prepare('INSERT INTO audit(id,at,actor,action,poll,version) VALUES(?,unixepoch(),?,?,?,?)').bind(crypto.randomUUID(),actor,'export_summary',summary.id,summary.version).run();
 return summary;
 }
 const notesMatch=path.match(/^\/api\/voting\/admin\/([0-9a-f-]{36})\/notes$/);
 if(notesMatch&&method==='GET'){
 const id=notesMatch[1];await exportSummary(db,id);const after=u.searchParams.get('after')||'';
 if(after&&!/^[0-9a-f-]{36}$/.test(after))fail(400,'Neplatný kurzor.');
 const {results}=await db.prepare("SELECT id,note FROM ballots WHERE poll=? AND note!='' AND id>? ORDER BY id LIMIT 100").bind(id,after).all();
 await db.prepare('INSERT INTO audit(id,at,actor,action,poll,version) SELECT ?,unixepoch(),?,?,id,version FROM polls WHERE id=?').bind(crypto.randomUUID(),actor,'export_notes',id).run();
 return {notes:results.map(row=>row.note),next:results.length===100?results.at(-1).id:null};
 }
 if(path==='/api/voting/admin/polls'&&method==='GET'){const {results}=await db.prepare('SELECT * FROM polls ORDER BY ends DESC LIMIT 100').all();return results.map(p=>({...p,options:JSON.parse(p.options),sections:JSON.parse(p.sections||'[]')}));}
 if(path==='/api/voting/admin/polls'&&method==='POST'){
 const d=validatePoll(await body(r)),id=crypto.randomUUID();await db.batch([db.prepare('INSERT INTO polls(id,question,options,mode,starts,ends,minimum,max_choices,sections) VALUES(?,?,?,?,?,?,?,?,?)').bind(id,d.question,JSON.stringify(d.options),d.mode,d.starts,d.ends,d.minimum,d.maxChoices,JSON.stringify(d.sections)),audit(db,actor,'create',id,1)]);return {id};
 }
 const m=path.match(/^\/api\/voting\/admin\/([0-9a-f-]{36})\/(edit|open|close|publish|credentials)$/);
 if(m&&method==='POST'){
 const [,id,action]=m,d=await body(r),p=await db.prepare('SELECT * FROM polls WHERE id=?').bind(id).first();if(!p)fail(404,'Hlasovanie sa nenašlo.');
 let stmt;
 if(action==='edit'){const clean=validatePoll(d);stmt=db.prepare("UPDATE polls SET question=?,options=?,mode=?,starts=?,ends=?,minimum=?,max_choices=?,sections=?,version=version+1 WHERE id=? AND status='draft' AND version=?").bind(clean.question,JSON.stringify(clean.options),clean.mode,clean.starts,clean.ends,clean.minimum,clean.maxChoices,JSON.stringify(clean.sections),id,p.version);}
 else if(action==='credentials'){
 if(p.mode!=='member'||p.status!=='draft'||!Array.isArray(d.digests)||!d.digests.length||d.digests.length>100||d.digests.some(x=>!/^[a-f0-9]{64}$/.test(x)))fail(400,'Importujte najviac 100 odtlačkov do konceptu členského hlasovania.');
 // Guard every insert in the transaction against a concurrent opening.
 await db.batch([...d.digests.map(hash=>db.prepare("INSERT INTO credentials(poll,digest) SELECT id,? FROM polls WHERE id=? AND status='draft'").bind(hash,id)),audit(db,actor,'credentials',id,p.version)]);return {ok:true};
 }
 else if(action==='open'){
 if(p.mode==='public')fail(409,'Verejná anketa sa aktivuje podľa naplánovaného termínu pri nasadení.');
 if(p.mode==='member'&&e.MEMBER_READY!=='true')fail(403,'Členský režim nie je schválený.');
 stmt=db.prepare("UPDATE polls SET status='open',version=version+1 WHERE id=? AND status='draft' AND ends>unixepoch() AND version=?").bind(id,p.version);
 }else if(action==='close'){stmt=db.prepare("UPDATE polls SET status='closed',version=version+1 WHERE id=? AND status='open' AND ends<=unixepoch() AND version=?").bind(id,p.version);}
 else {stmt=db.prepare("UPDATE polls SET published=1,version=version+1 WHERE id=? AND status='closed' AND published=0 AND ends<=unixepoch() AND version=?").bind(id,p.version);}
 const result=await db.batch([stmt,audit(db,actor,action,id,p.version+1)]);if(result[0].meta.changes!==1)fail(409,'Stav sa zmenil alebo operácia nie je povolená.');return {ok:true};
 }
 fail(404,'Nenájdené.');
 }
 fail(404,'Nenájdené.');
}
export async function exportSummary(db,id){
 const p=await db.prepare('SELECT * FROM polls WHERE id=?').bind(id).first();
 if(!p)fail(404,'Anketa sa nenašla.');
 if(p.status!=='closed'||Date.now()/1000<p.ends)fail(409,'Export je dostupný po skončení a uzavretí ankety.');
 const {total}=await db.prepare('SELECT COUNT(*) AS total FROM ballots WHERE poll=?').bind(id).first();
 if(total<p.minimum)fail(409,'Na export výsledkov zatiaľ nie je dostatok odpovedí.');
 const {results}=await db.prepare('SELECT j.value AS choice,COUNT(*) AS count FROM ballots b,json_each(b.choices) j WHERE b.poll=? GROUP BY j.value').bind(id).all();
 return {id:p.id,version:p.version,question:p.question,starts:p.starts,ends:p.ends,total,options:JSON.parse(p.options).map((option,i)=>({section:JSON.parse(p.sections||'[]').find(s=>s.indices.includes(i))?.title||'',option,count:results.find(x=>x.choice===i)?.count||0}))};
}
function audit(db,actor,action,id,version){return db.prepare('INSERT INTO audit(id,at,actor,action,poll,version) SELECT ?,unixepoch(),?,?,?,? WHERE changes()=1').bind(crypto.randomUUID(),actor,action,id,version);}
export default {async fetch(r,e){
 const headers={'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','Content-Security-Policy':"default-src 'none'; frame-ancestors 'none'",'Vary':'Origin','X-Server-Time':String(Date.now())};
 try{
 if(new URL(r.url).pathname==='/api/voting/session'&&r.method==='POST'){
 if(e.ENABLED!=='true'||e.PRIVACY_READY!=='true')fail(503,'Služba nie je spustená.');
 if(new URL(r.url).origin!==e.ORIGIN||r.headers.get('Origin')!==e.ORIGIN||r.headers.get('X-Vote-Request')!=='1')fail(403,'Nepovolený pôvod.');
 const existing=r.headers.get('Cookie')?.match(/(?:^|; )__Host-voter=([a-f0-9]{64})(?:;|$)/)?.[1];
 const token=existing||hex(crypto.getRandomValues(new Uint8Array(32)));headers['Set-Cookie']=`__Host-voter=${token}; Secure; HttpOnly; SameSite=Strict; Path=/; Max-Age=2592000`;return Response.json({ok:true},{headers});
 }
 return Response.json(await handler(r,e),{headers});
 }catch(error){return Response.json({error:error.status?error.message:'Služba nie je dostupná. Hlas nebol potvrdený.'},{status:error.status||503,headers});}
},async scheduled(_,e){await e.DB.prepare("UPDATE polls SET status='closed',version=version+1 WHERE status='open' AND ends<=unixepoch()").run();await e.DB.prepare('DELETE FROM limits WHERE expires<unixepoch()').run();for(const table of ['ballots','spent','credentials'])await e.DB.prepare(`DELETE FROM ${table} WHERE poll IN (SELECT id FROM polls WHERE ends+7776000<=unixepoch())`).run();}};
