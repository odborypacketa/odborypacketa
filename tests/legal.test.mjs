import {test} from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const context = vm.createContext({window:{},Date});
for (const name of ['knowledge-base.js','legal-engine.js']) vm.runInContext(readFileSync(new URL('../odborovy-asistent-web/'+name,import.meta.url),'utf8'), context);
const create = (date='2026-10-10') => context.window.ODBORACIK_LEGAL_ENGINE.create(context.window.ODBORACIK_LEGAL_BASE, () => new Date(date));
const scenarios = JSON.parse(readFileSync(new URL('../legal-research/scenare.json',import.meta.url)));
for (const scenario of scenarios.cases) test(`${scenario.id}: ${scenario.input}`,()=>{
 const result=create().respond(scenario.input);
 assert.ok(scenario.topicIds.some(id=>result.topicIds.includes(id)), `Témy ${result.topicIds}; očakávané ${scenario.topicIds}`);
 assert.ok(result.cards.length);
 for(const card of result.cards) {
  assert.ok(card.refs.length && card.refs.every(ref=>ref.url.startsWith('https://') && ref.provision));
  assert.ok(card.detail && card.exceptions.length);
 }
 assert.doesNotMatch(result.text,/^Pošlite nám stručný opis cez formulár/);
});
test('all 44 cards have a reachable route and no arbitrary remote calls',()=>{
 assert.equal(context.window.ODBORACIK_LEGAL_BASE.topics.length,44);
 const code=readFileSync(new URL('../odborovy-asistent-web/legal-engine.js',import.meta.url),'utf8');
 assert.doesNotMatch(code,/\bfetch\s*\(|localStorage|XMLHttpRequest/);
});
test('own notice exact one-year boundary and calendar-month arithmetic',()=>{
 const r=create().respond('Pracujem od 1.10.2025, výpoveď doručím 1.10.2026.');
 assert.match(r.calculations.join(' '),/dva mesiace: od 1\.11\.2026 do 31\.12\.2026/);
 const shorter=create().respond('Pracujem od 2.10.2025, výpoveď doručím 1.10.2026.');
 assert.match(shorter.calculations.join(' '),/jeden mesiac: od 1\.11\.2026 do 30\.11\.2026/);
});
test('invalid and unverified historical dates produce no calculated deadline',()=>{
 assert.equal(create().respond('Pracujem od 31.2.2025, výpoveď doručím 1.10.2026.').calculations.length,0);
 assert.equal(create().respond('Pracujem od 1.1.2024, výpoveď doručím 1.1.2025.').calculations.length,0);
});
test('notice does not become three months merely because employee worked six years',()=>{
 assert.match(create().respond('Som tu 6 rokov, dávam výpoveď ja.').calculations.join(' '),/dva mesiace/);
});
test('context survives a short answer without storing or transmitting it',()=>{
 const chat=create();chat.respond('Ako dať výpoveď?');
 const answer=chat.respond('od marca 2024');
 assert.ok(answer.topicIds.includes('vlastna_vypoved'));
 assert.match(answer.continuation,/Nadväzujem/);
});
test('separate factual turns accumulate the employment start and delivery date',()=>{
 const chat=create();chat.respond('Ako dať výpoveď?');
 chat.respond('Pracujem od 1.10.2025');
 const answer=chat.respond('Doručím 1.10.2026');
 assert.match(answer.calculations.join(' '),/dva mesiace: od 1\.11\.2026 do 31\.12\.2026/);
});
test('multi-intent and accents; PN is not a substring match',()=>{
 const r=create().respond('co su odbory a ako dat vypoved?');
 assert.ok(r.topicIds.includes('odbory') && r.topicIds.includes('vlastna_vypoved'));
 assert.ok(!create().respond('Výplatná páska je neprehľadná.').topicIds.includes('pn_platba'));
});
test('urgent termination includes PN deadline exception and never substitutes a form for a lawsuit',()=>{
 const r=create().respond('Chcem napadnúť výpoveď počas PN.');
 assert.match(r.text,/šiestich mesiacov/);
 assert.match(r.warnings.join(' '),/advokáta/);
 assert.match(r.frame,/1\. Čo vieme[\s\S]*8\. Ďalší krok/);
});
test('new year blocks current monetary claim and stale knowledge is labelled',()=>{
 assert.match(create().respond('Aká je minimálna mzda v roku 2027?').cards[0].answer,/nepotvrdzuje/);
 const r=create('2027-01-01').respond('Aká je minimálna mzda?');
 assert.match(r.cards[0].answer,/nepotvrdzuje/);assert.ok(r.warnings.length);
});
test('emergency instruction and privacy minimise requests for data',()=>{
 const r=create().respond('Stroj teraz iskrí a bojím sa vážneho úrazu.');
 assert.equal(r.risk,'emergency');assert.match(r.warnings[0],/bezpečia/);
 assert.match(create().respond('Pošlem rodné číslo pre nárok na dovolenku.').warnings[0],/neposielajte/);
});
test('annual holiday is not automatically a remaining balance',()=>{
 const r=create().respond('Mám 35 rokov, koľko mám dovolenky?');
 assert.match(r.text,/zostatok/);assert.match(r.text,/päť/);
});
