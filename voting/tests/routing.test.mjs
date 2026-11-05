import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../deployed-worker.mjs';
const origin='https://odbory-anketa.odborypacketa.workers.dev';
test('fallback blocks both admin surfaces before accessing storage',async()=>{
 for(const path of ['/hlasovania/admin','/hlasovania/admin/index.html','/api/voting/admin/polls'])assert.equal((await worker.fetch(new Request(origin+path),{})).status,404);
});
test('fallback serves survey and stylesheet, denies arbitrary hosts',async()=>{
 const env={ASSETS:{fetch:async()=>new Response('asset')}};
 for(const path of ['/hlasovania/','/style.css']){const response=await worker.fetch(new Request(origin+path),env);assert.equal(response.status,200);assert.match(response.headers.get('Content-Security-Policy'),/frame-ancestors 'none'/);}
 assert.equal((await worker.fetch(new Request('https://untrusted.example/hlasovania/'),env)).status,404);
});
test('fallback session requires its exact origin and secure cookie',async()=>{
 const env={ENABLED:'true',PRIVACY_READY:'true'};
 const make=from=>new Request(origin+'/api/voting/session',{method:'POST',headers:{Origin:from,'X-Vote-Request':'1'}});
 assert.equal((await worker.fetch(make('https://www.odborypacketa.eu'),env)).status,403);
 const response=await worker.fetch(make(origin),env);assert.equal(response.status,200);assert.match(response.headers.get('Set-Cookie'),/Secure; HttpOnly; SameSite=Strict/);
});
