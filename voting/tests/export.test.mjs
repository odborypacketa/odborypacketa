import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
import {exportSummary} from '../worker.mjs';
import {csvCell,summaryCsv} from '../../hlasovania/admin/csv.mjs';
test('CSV preserves diacritics, separators, quotes and multiline text and blocks formulas',()=>{
 assert.equal(csvCell('Bezpečnosť; "áno"'),'"Bezpečnosť; ""áno"""');
 assert.equal(csvCell('riadok\nriadok'),'"riadok\nriadok"');
 for(const text of ['=1+1',' +SUM(A1)','@formula','-1+2','\t=1'])assert.ok(csvCell(text).startsWith('"\''));
 const csv=summaryCsv({id:'demo',question:'Otázka?',starts:0,ends:1,total:10,options:[{option:'Áno',count:10},{option:'Nie',count:5}]});
 assert.ok(csv.startsWith('\uFEFF'));assert.ok(csv.includes('"Nie";"5";"50,00"'));assert.ok(csv.includes('"Počet odoslaných odpovedí";"10"'));
});
test('export gates closure and minimum; counts respondents once and includes zero-count options',async()=>{
 const sql=new DatabaseSync(':memory:');sql.exec(readFileSync(new URL('../schema.sql',import.meta.url),'utf8'));
 const db={prepare(q){let args;return {bind(...a){args=a;return this;},async first(){return sql.prepare(q).get(...args)||null;},async all(){return {results:sql.prepare(q).all(...args)};}};}};
 const now=Math.floor(Date.now()/1000);sql.prepare('INSERT INTO polls(id,question,options,mode,starts,ends,status,minimum,max_choices) VALUES(?,?,?,?,?,?,?,?,?)').run('demo','Otázka?',JSON.stringify(['A','B','C']),'public',now-100,now+100,'open',10,2);
 await assert.rejects(exportSummary(db,'missing'),e=>e.status===404);
 await assert.rejects(exportSummary(db,'demo'),e=>e.status===409);
 for(let i=0;i<10;i++)sql.prepare('INSERT INTO ballots(id,poll,choices) VALUES(?,?,?)').run(String(i),'demo','[0,1]');
 sql.prepare("UPDATE polls SET status='closed',ends=?").run(now-1);
 const result=await exportSummary(db,'demo');assert.equal(result.total,10);assert.deepEqual(result.options.map(x=>x.count),[10,10,0]);assert.ok(!JSON.stringify(result).includes('digest'));
 sql.prepare('DELETE FROM ballots WHERE id=?').run('0');await assert.rejects(exportSummary(db,'demo'),e=>e.status===409);
});
