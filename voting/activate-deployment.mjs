// Invoke once after the real site + API deployment passes its health checks.
// Repeated runs for the same poll never reset the deadline.
import {spawnSync} from 'node:child_process';
import {mkdtempSync,writeFileSync,rmSync,readFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
const [poll,config,confirmation]=process.argv.slice(2);
if(!/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(poll||'')||!config||confirmation!=='--site-deployed')throw Error('Usage: node voting/activate-deployment.mjs POLL_UUID WRANGLER_CONFIG --site-deployed');
const {starts,ends}=JSON.parse(readFileSync(new URL('./schedule.json',import.meta.url),'utf8'));
if(!Number.isInteger(starts)||ends-starts!==864000)throw Error('Invalid schedule');
const directory=mkdtempSync(join(tmpdir(),'vote-start-'));
try{
 const file=join(directory,'activate.sql');
 writeFileSync(file,`UPDATE polls SET starts=${starts}, ends=${ends}, deployed_at=unixepoch(), status='open', version=version+1 WHERE id='${poll}' AND mode='public' AND status='draft' AND deployed_at IS NULL AND unixepoch()<${ends};\nINSERT INTO audit(id,at,actor,action,poll,version) SELECT lower(hex(randomblob(16))),unixepoch(),'deployment','schedule_9_nov_0900',id,version FROM polls WHERE id='${poll}' AND changes()=1;\nSELECT id,status,starts,ends,deployed_at FROM polls WHERE id='${poll}';`);
 const result=spawnSync('npx',['--yes','wrangler@4','d1','execute','DB','--remote','--config',config,'--file',file],{stdio:'inherit'});
 if(result.error)throw result.error;if(result.status!==0)process.exitCode=result.status||1;
}finally{rmSync(directory,{recursive:true,force:true});}
