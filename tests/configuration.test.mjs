import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, cpSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
function run(extra, verify) {
  const dir = mkdtempSync(join(tmpdir(), 'odboracik-config-test-'));
  try {
    cpSync(new URL('../odborovy-asistent-web', import.meta.url), join(dir, 'odborovy-asistent-web'), {recursive:true});
    mkdirSync(join(dir, 'public')); writeFileSync(join(dir, 'public/index.html'), '<h1>Existing homepage</h1>'); writeFileSync(join(dir, 'public/CNAME'), 'www.odborypacketa.eu');
    const result = spawnSync(process.execPath, [new URL('../scripts/configure.mjs', import.meta.url).pathname, 'web'], { cwd: dir, env: { ...process.env, QUERY_ENDPOINT: '', PRIVACY_URL: '', TURNSTILE_SITE_KEY: '', PAGES_SITE_DIRECTORY: '', ...extra }, encoding:'utf8' });
    verify(dir, result);
  } finally { rmSync(dir, {recursive:true,force:true}); }
}
test('web artifact preserves existing homepage and custom domain and adds chatbot', () => run({ PAGES_SITE_DIRECTORY:'public' }, (dir,result) => { assert.equal(result.status,0,result.stderr); assert.equal(readFileSync(join(dir,'site-output/index.html'),'utf8'),'<h1>Existing homepage</h1>'); assert.equal(readFileSync(join(dir,'site-output/CNAME'),'utf8'),'www.odborypacketa.eu'); assert.ok(existsSync(join(dir,'site-output/odboracik/index.html'))); }));
test('without existing website configuration only chatbot artifact is produced', () => run({}, (dir,result) => { assert.equal(result.status,0,result.stderr); assert.ok(!existsSync(join(dir,'site-output/index.html'))); assert.ok(existsSync(join(dir,'site-output/odboracik/index.html'))); }));
test('root repository publishing and insecure endpoints rejected', () => {
  run({PAGES_SITE_DIRECTORY:'.'},(dir,result)=>assert.notEqual(result.status,0));
  run({QUERY_ENDPOINT:'http://insecure.invalid'},(dir,result)=>assert.notEqual(result.status,0));
});
test('AI public configuration preserves deployment settings and validates its endpoint',()=>{
 run({},(dir,result)=>{assert.equal(result.status,0);const source=readFileSync(join(dir,'site-output/odboracik/config.js'),'utf8');const original=readFileSync(new URL('../odborovy-asistent-web/config.js',import.meta.url),'utf8');const previous=JSON.parse(original.slice(original.indexOf(' = ')+3).trim().replace(/;$/,''));assert.equal(JSON.parse(source.slice(source.indexOf(' = ')+3).trim().replace(/;$/,'')).aiPrivacyReady,previous.aiPrivacyReady===true);assert.ok(!source.includes('OPENAI_API_KEY'));});
 run({AI_CHAT_ENDPOINT:'https://ai.invalid/api/chat',AI_TURNSTILE_SITE_KEY:'public-sitekey',AI_PRIVACY_READY:'true'},(dir,result)=>{assert.equal(result.status,0,result.stderr);const source=readFileSync(join(dir,'site-output/odboracik/config.js'),'utf8');assert.match(source,/public-sitekey/);assert.match(source,/"aiPrivacyReady": true/);});
 run({AI_CHAT_ENDPOINT:'https://ai.invalid/anything'},(dir,result)=>assert.notEqual(result.status,0));
});
