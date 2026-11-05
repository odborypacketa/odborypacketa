import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {DatabaseSync} from 'node:sqlite';
import '../../hlasovania/countdown.js';
test('ten days, countdown boundary and no negative countdown',()=>{
 const clock=globalThis.VotingClock;assert.equal(clock.duration,864000);
 assert.equal(clock.label(clock.duration),'10 dní · 00 hod · 00 min · 00 s');
 assert.equal(clock.remaining(100,99.1),1);assert.equal(clock.remaining(100,100),0);assert.equal(clock.remaining(100,101),0);
 assert.equal(clock.label(90061),'1 dní · 01 hod · 01 min · 01 s');
});
test('an already deployed poll cannot receive votes before the scheduled start',()=>{
 const db=new DatabaseSync(':memory:');db.exec(readFileSync(new URL('../schema.sql',import.meta.url),'utf8'));
 const now=Math.floor(Date.now()/1000);
 db.prepare('INSERT INTO polls(id,question,options,mode,starts,ends,status,minimum,deployed_at) VALUES(?,?,?,?,?,?,?,?,?)').run('future','Test','["A","B"]','public',now+3600,now+3600+864000,'open',10,now);
 assert.throws(()=>db.prepare('INSERT INTO ballots(id,poll,choices) VALUES(?,?,?)').run('early','future','[0]'),/poll_closed_or_invalid/);
 assert.equal(db.prepare('SELECT COUNT(*) AS n FROM ballots').get().n,0);
});
test('deployment stores fixed scheduled start once; reload/redeploy cannot extend it',()=>{
 const db=new DatabaseSync(':memory:');db.exec(readFileSync(new URL('../schema.sql',import.meta.url),'utf8'));
 const id='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
 db.prepare('INSERT INTO polls(id,question,options,mode,starts,ends,minimum) VALUES(?,?,?,?,?,?,?)').run(id,'Test','["A","B"]','public',1,2,10);
 const script=readFileSync(new URL('../activate-deployment.mjs',import.meta.url),'utf8');
 const {starts,ends}=JSON.parse(readFileSync(new URL('../schedule.json',import.meta.url),'utf8'));
 const sql=script.match(/writeFileSync\(file,`([\s\S]*?)`\);/)[1].replaceAll('${poll}',id).replaceAll('${starts}',String(starts)).replaceAll('${ends}',String(ends)).replaceAll('\\n','\n');
 db.exec(sql);const first=db.prepare('SELECT * FROM polls').get();assert.equal(first.status,'open');assert.equal(first.ends-first.starts,864000);assert.equal(first.starts,starts);assert.equal(first.ends,ends);assert.ok(first.deployed_at);
 db.exec(sql);assert.deepEqual(db.prepare('SELECT * FROM polls').get(),first);assert.equal(db.prepare('SELECT COUNT(*) AS n FROM audit').get().n,1);
 // An expired deadline is enforced by the DB even before the scheduled closing job runs.
 db.prepare('UPDATE polls SET starts=1,ends=2').run();assert.throws(()=>db.prepare('INSERT INTO ballots(id,poll,choices) VALUES(?,?,?)').run('x',id,'[0]'));
});
