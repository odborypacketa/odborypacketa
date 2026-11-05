import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {DatabaseSync} from 'node:sqlite';
import worker,{validatePoll,exportSummary,validateNote} from '../worker.mjs';
import {summaryCsv} from '../../hlasovania/admin/csv.mjs';
const template=JSON.parse(readFileSync(new URL('../anketa-zamestnanci.json',import.meta.url),'utf8'));
test('current employee survey accepts three choices across different sections in a single API submission',async()=>{
 const sql=new DatabaseSync(':memory:');sql.exec(readFileSync(new URL('../schema.sql',import.meta.url),'utf8'));
 const id='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',now=Math.floor(Date.now()/1000);
 sql.prepare('INSERT INTO polls(id,question,options,mode,starts,ends,status,minimum,max_choices,sections) VALUES(?,?,?,?,?,?,?,?,?,?)').run(id,template.question,JSON.stringify(template.options),'public',now-10,now+864000,'open',10,24,JSON.stringify(template.sections));
 const DB={prepare(q){let args;const statement={bind(...a){args=a;return statement;},async first(){return sql.prepare(q).get(...args)||null;},async run(){return {meta:{changes:Number(sql.prepare(q).run(...args).changes)}};}};return statement;},async batch(statements){sql.exec('BEGIN');try{const result=[];for(const s of statements)result.push(await s.run());sql.exec('COMMIT');return result;}catch(e){sql.exec('ROLLBACK');throw e;}}};
 const env={DB,ENABLED:'true',PRIVACY_READY:'true',RATE_SECRET:'x'.repeat(40),TURNSTILE_SECRET:'test',ACCESS_TEAM:'example',ACCESS_AUD:'aud',ADMIN_SUBJECTS:'sub',ORIGIN:'https://www.odborypacketa.eu'};
 const previous=globalThis.fetch;globalThis.fetch=async()=>Response.json({success:true,hostname:'www.odborypacketa.eu',action:'vote'});
 try{const result=await worker.fetch(new Request(`${env.ORIGIN}/api/voting/polls/${id}/vote`,{method:'POST',headers:{'Content-Type':'application/json','Origin':env.ORIGIN,'X-Vote-Request':'1','CF-Connecting-IP':'192.0.2.1','Cookie':'__Host-voter='+'a'.repeat(64)},body:JSON.stringify({choices:[0,5,23],note:'Chcem viac informácií o benefitoch.',turnstileToken:'test'})}),env);assert.equal(result.status,200);assert.equal(sql.prepare('SELECT COUNT(*) AS n FROM ballots').get().n,1);assert.deepEqual(JSON.parse(sql.prepare('SELECT choices FROM ballots').get().choices),[0,5,23]);assert.equal(sql.prepare('SELECT note FROM ballots').get().note,'Chcem viac informácií o benefitoch.');}finally{globalThis.fetch=previous;}
});
test('all five supplied sections and 24 options validate without member identity',()=>{
 const poll=validatePoll(template);assert.equal(poll.mode,'public');assert.equal(poll.sections.length,5);assert.equal(poll.options.length,24);assert.equal(poll.maxChoices,24);
 assert.deepEqual(poll.sections.map(s=>s.indices.length),[5,4,5,5,5]);
 assert.equal(new Set(poll.sections.flatMap(s=>s.indices)).size,24);
 for(const sections of [[{title:'A',indices:[0,0]}],[{title:'A',indices:[24]}]])assert.throws(()=>validatePoll({...template,sections}));
 assert.ok(!['name','email','employeeId','credential'].some(key=>key in poll));
});
test('24 selected proposals form one response and CSV retains the section of every proposal',async()=>{
 const sql=new DatabaseSync(':memory:');sql.exec(readFileSync(new URL('../schema.sql',import.meta.url),'utf8'));const now=Math.floor(Date.now()/1000);
 sql.prepare('INSERT INTO polls(id,question,options,mode,starts,ends,status,minimum,max_choices,sections) VALUES(?,?,?,?,?,?,?,?,?,?)').run('employee',template.question,JSON.stringify(template.options),'public',now-10,now+100,'open',10,24,JSON.stringify(template.sections));
 for(let i=0;i<10;i++)sql.prepare('INSERT INTO ballots(id,poll,choices) VALUES(?,?,?)').run(String(i),'employee',JSON.stringify(template.options.map((_,i)=>i)));
 sql.prepare("UPDATE polls SET status='closed',ends=?").run(now-1);
 const db={prepare(q){let args;return {bind(...a){args=a;return this;},async first(){return sql.prepare(q).get(...args)||null;},async all(){return {results:sql.prepare(q).all(...args)};}};}};
 const result=await exportSummary(db,'employee');assert.equal(result.total,10);assert.equal(result.options.length,24);assert.ok(result.options.every(o=>o.count===10));assert.equal(result.options[23].section,'Rozvoj a férové podmienky');
 const csv=summaryCsv(result);assert.ok(csv.includes('"Sekcia";"Možnosť"'));assert.ok(csv.includes('"Mzda a odmeny"'));assert.ok(csv.includes('"Rozvoj a férové podmienky"'));
});

test('optional notes enforce type and length and remain escaped in CSV',()=>{assert.equal(validateNote(undefined),'');assert.equal(validateNote('  Návrh  '),'Návrh');for(const value of [null,[],42,'x'.repeat(1501),'a\u0000b'])assert.throws(()=>validateNote(value));assert.equal(validateNote('x'.repeat(1500)).length,1500);const csv=summaryCsv({id:'demo',question:'Test',starts:0,ends:1,total:10,options:[],notes:['=HYPERLINK("https://example.com")','Viac prestávok\nĎakujem']});assert.ok(csv.includes('NEVEREJNÉ POZNÁMKY'));assert.ok(csv.includes("\"'=HYPERLINK"));assert.ok(csv.includes('Viac prestávok\nĎakujem'));});
