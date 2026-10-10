import {test} from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const ctx=vm.createContext({window:{},Date});
for(const name of ['knowledge-base.js','legal-engine.js']) vm.runInContext(readFileSync(new URL('../odborovy-asistent-web/'+name,import.meta.url),'utf8'),ctx);
const create=()=>ctx.window.ODBORACIK_LEGAL_ENGINE.create(ctx.window.ODBORACIK_LEGAL_BASE,()=>new Date('2026-10-10'));
for(const spelling of ['co su to odobory','Čo sú to odobry?','co su odbori','Čo vlastne robia odbory?']) test('union spelling: '+spelling,()=>{
 assert.ok(create().respond(spelling).topicIds.includes('odbory'));
});
test('requested conversation progresses from typo to application, fee, delivery and decision',()=>{
 const c=create();c.respond('co su to odobory');
 const join=c.respond('ako sa prihlasit');
 assert.deepEqual([...join.topicIds],['clenstvo_prihlaska']);
 assert.match(join.text,/vyplnenou a podpísanou/);
 assert.ok(join.cards[0].links.some(l=>l.url==='https://www.odborypacketa.eu/#prihlaska'));
 assert.match(c.respond('a kolko to stoji?').text,/zatiaľ nebola určená/);
 assert.match(c.respond('kam to mam poslat?').text,/info@odborypacketa.eu/);
 assert.match(c.respond('kedy dostanem odpoved?').text,/OD ROZHODNUTIA VÝBORU/);
});
test('membership questions work without an earlier union prompt',()=>{
 for(const q of ['Ako sa prihlásiť?','Chcem sa pridať','Ako vstúpiť do odborov?','Chcem sa stať členom']) assert.ok(create().respond(q).topicIds.includes('clenstvo_prihlaska'),q);
});
test('membership privacy never promises complete secrecy',()=>{
 const c=create();c.respond('Ako sa prihlásiť?');
 const r=c.respond('dozvie sa to moj sef?');
 assert.deepEqual([...r.topicIds],['clenstvo_sukromie']);
 assert.match(r.text,/nie je záruka/);assert.match(r.text,/zrážku/);
});
test('portal login and leave requests are not union applications',()=>{
 assert.ok(!create().respond('Ako sa prihlásiť do portálu?').topicIds.includes('clenstvo_prihlaska'));
 assert.ok(!create().respond('Ako sa prihlásiť na dovolenku?').topicIds.includes('clenstvo_prihlaska'));
});
test('employer threat remains a legal risk, not a generic membership answer',()=>{
 const c=create();c.respond('Ako sa prihlásiť?');
 assert.notEqual(c.respond('Šéf ma chce potrestať za odbory.').risk,'normal');
});
test('holiday follow-up resolves pronouns and switches subtopics',()=>{
 const c=create();c.respond('Aký nárok mám na dovolenku?');
 assert.ok(c.respond('kto mi ju schvaluje?').topicIds.includes('dovolenka_termin'));
 assert.ok(c.respond('a mozu mi ju preplatit?').topicIds.includes('dovolenka_preplatenie'));
 assert.ok(c.respond('a co stara?').topicIds.includes('dovolenka_prenos'));
});
test('notice email follow-up uses delivery rules',()=>{
 const c=create();c.respond('Ako dať výpoveď?');
 const r=c.respond('staci to poslat mailom?');
 assert.deepEqual([...r.topicIds],['dorucenie']);assert.match(r.text,/doručenie/);
});
test('detail request answers the current topic, without repeating the short summary',()=>{
 const c=create();const first=c.respond('Ako dať výpoveď?');
 const r=c.respond('ako dlho trva vypovedna doba?');
 assert.ok(r.topicIds.includes('vlastna_vypoved'));
 assert.match(r.cards[0].answer,/jeden mesiac/);assert.match(r.cards[0].answer,/dva mesiace/);
 assert.notEqual(r.cards[0].answer,first.cards[0].answer);
});
test('new explicit topic replaces old context',()=>{
 const c=create();c.respond('Ako sa prihlásiť?');c.respond('Koľko mám dovolenky?');
 const r=c.respond('kto mi ju schvaluje?');
 assert.ok(r.topicIds.includes('dovolenka_termin'));assert.ok(!r.topicIds.includes('clenstvo_prihlaska'));
});
test('ambiguous and unrelated follow-ups do not fabricate a union answer',()=>{
 const c=create();c.respond('Čo sú odbory?');
 const r=c.respond('Aké bude počasie?');
 assert.equal(r.cards.length,0);assert.match(r.text,/spresniť/);
});
test('thanks preserves context, reset clears it',()=>{
 const c=create();c.respond('Čo sú odbory?');assert.match(c.respond('ďakujem').text,/Rado/);
 assert.ok(c.respond('koľko to stojí?').topicIds.includes('clenstvo_cena'));
 c.reset();assert.equal(c.respond('koľko to stojí?').cards.length,0);
});
test('known facts stop repeat requests for the same dates and child condition',()=>{
 const c=create();c.respond('Ako dať výpoveď?');c.respond('Pracujem od 1.10.2025');
 assert.ok(!c.respond('Doručím 1.10.2026').questions.some(q=>q.includes('Odkedy')));
 const d=create();d.respond('Koľko mám dovolenky?');
 assert.ok(!d.respond('Mám 35 rokov').questions.some(q=>q.includes('Trvale')));
});
test('suggested questions route to actual different answers',()=>{
 for(const prompt of ['Čo sú odbory?','Ako sa prihlásiť?','Koľko mám dovolenky?','Ako dať výpoveď?']) {
  const first=create().respond(prompt);
  for(const suggestion of first.suggestions) {const c=create();c.respond(prompt);assert.ok(c.respond(suggestion).cards.length,suggestion);}
 }
});
test('controlled spelling correction preserves numbers and negation',()=>{
 assert.equal(ctx.window.ODBORACIK_LEGAL_ENGINE.normalize('Nie 33 ale 32 rokov'), 'nie 33 ale 32 rokov');
});
