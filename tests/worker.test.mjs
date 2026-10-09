import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import worker from '../backend/worker.mjs';
let db, env, originalFetch;
const origin = 'https://www.odborypacketa.eu';
const data = () => ({ id: crypto.randomUUID(), channel: 'formulár', name: 'Test', email: 'test@example.invalid', topic: 'Iné', message: 'Vymyslený testovací prípad.', urgent: false, consent: true, company: '', turnstileToken: 'test-token' });
const submit = (body, headers = {}) => worker.fetch(new Request('https://backend.invalid/api/queries', { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json', ...headers }, body: typeof body === 'string' ? body : JSON.stringify(body) }), env);
const admin = (path = '/api/admin/queries', method = 'GET', extra = {}) => worker.fetch(new Request(`https://backend.invalid${path}`, { method, headers: { Authorization: `Bearer ${env.ADMIN_TOKEN}`, ...extra } }), env);
beforeEach(() => {
  db = new DatabaseSync(':memory:'); db.exec(readFileSync(new URL('../backend/schema.sql', import.meta.url), 'utf8'));
  env = { ALLOWED_ORIGIN: origin, RETENTION_DAYS: '7', PRIVACY_READY: 'true', ADMIN_TOKEN: 'a'.repeat(48), TURNSTILE_SECRET_KEY: 'test-secret', DATA_ENCRYPTION_KEY: Buffer.alloc(32, 1).toString('base64'), DB: { prepare(sql) { return { bind(...args) { const stmt = db.prepare(sql); return { async run() { return stmt.run(...args); }, async first() { return stmt.get(...args) || null; }, async all() { return { results: stmt.all(...args) }; } }; } }; } } };
  originalFetch = globalThis.fetch;
  globalThis.fetch = async () => Response.json({ success: true, hostname: 'www.odborypacketa.eu', action: 'contact' });
});
afterEach(() => { globalThis.fetch = originalFetch; db.close(); });
test('encrypted storage and server-confirmed ID; authorized export decrypts it', async () => {
  const input = data(), response = await submit(input);
  assert.equal(response.status, 201); assert.deepEqual(await response.json(), { ok: true, id: input.id, mailStatus: "pending" });
  const row = db.prepare('SELECT * FROM queries').get();
  assert.ok(!JSON.stringify(row).includes(input.email)); assert.ok(!JSON.stringify(row).includes(input.message));
  assert.equal((await (await admin()).json()).records[0].message, input.message);
});
test('retry does not duplicate; changed content conflicts', async () => {
  const input = data(); await submit(input); assert.equal((await submit(input)).status, 201);
  assert.equal(db.prepare('SELECT COUNT(*) AS n FROM queries').get().n, 1);
  assert.equal((await submit({ ...input, message: 'Zmenený obsah' })).status, 409);
});
test('unknown and missing origins denied', async () => {
  assert.equal((await submit(data(), { Origin: 'https://foreign.invalid' })).status, 403);
  assert.equal((await submit(data(), { Origin: '' })).status, 403);
});
test('preflight enables only configured origin', async () => {
  const response = await worker.fetch(new Request('https://backend.invalid/api/queries', { method: 'OPTIONS', headers: { Origin: origin } }), env);
  assert.equal(response.status, 204); assert.equal(response.headers.get('Access-Control-Allow-Origin'), origin);
});
test('server validates consent, topic, channel, email, sizes and booleans', async () => {
  for (const change of [{ consent: 'on' }, { channel: 'chat' }, { email: 'bad' }, { topic: 'Unknown' }, { message: 'x'.repeat(3001) }, { name: 12 }, { urgent: 'on' }, { company: 'spam' }, { id: 'bad' }, { message: '  ' }]) assert.equal((await submit({ ...data(), ...change })).status, 400);
  assert.equal(db.prepare('SELECT COUNT(*) AS n FROM queries').get().n, 0);
});
test('malformed JSON and oversized actual body denied', async () => {
  assert.equal((await submit('{bad')).status, 400);
  assert.equal((await submit('x'.repeat(20001))).status, 413);
});
test('Turnstile validates hostname and action; outage fails closed', async () => {
  for (const result of [{ success: false }, { success: true, hostname: 'other.invalid', action: 'contact' }, { success: true, hostname: 'www.odborypacketa.eu', action: 'other' }]) { globalThis.fetch = async () => Response.json(result); assert.equal((await submit(data())).status, 403); }
  globalThis.fetch = async () => { throw new Error('outage'); }; assert.equal((await submit(data())).status, 503);
  assert.equal(db.prepare('SELECT COUNT(*) AS n FROM queries').get().n, 0);
});
test('unauthorized and cross-origin admin denied', async () => {
  assert.equal((await admin('/api/admin/queries', 'GET', { Authorization: 'Bearer wrong' })).status, 401);
  const response = await admin('/api/admin/queries', 'GET', { Origin: origin });
  assert.equal(response.status, 403); assert.equal(response.headers.get('Access-Control-Allow-Origin'), null);
});
test('expiry hides records and scheduled cleanup deletes them', async () => {
  await submit(data()); db.prepare('UPDATE queries SET expires_at = ?').run('2000-01-01T00:00:00.000Z');
  assert.equal((await (await admin()).json()).records.length, 0);
  await worker.scheduled({}, env); assert.equal(db.prepare('SELECT COUNT(*) AS n FROM queries').get().n, 0);
});
test('deletion removes only requested record', async () => {
  const first = data(), second = data(); await submit(first); await submit(second);
  assert.equal((await admin(`/api/admin/queries/${first.id}`, 'DELETE')).status, 200);
  assert.equal((await (await admin()).json()).records[0].id, second.id);
});
test('unconfigured service rejects intake', async () => {
  env.PRIVACY_READY = 'false'; assert.equal((await submit(data())).status, 503);
  env.PRIVACY_READY = 'true'; env.DATA_ENCRYPTION_KEY = ''; assert.equal((await submit(data())).status, 503);
});
test('database failure never acknowledges success', async () => {
  env.DB.prepare = () => { throw new Error('db outage'); }; assert.equal((await submit(data())).status, 503);
});
test('tampered ciphertext fails export', async () => {
  await submit(data()); db.prepare('UPDATE queries SET ciphertext = ?').run('AAAA'); assert.equal((await admin()).status, 503);
});
function mailSetup(send) {
  env.RESEND_API_KEY = 'test-resend-key'; env.CONTACT_FROM_EMAIL = 'sender@example.invalid';
  globalThis.fetch = async (url, options) => url.includes('siteverify') ? Response.json({success:true,hostname:'www.odborypacketa.eu',action:'contact'}) : send(options);
}
test('mail forwards only to fixed inbox and replies go to submitter; retries do not send again', async () => {
  let calls = []; mailSetup(options => { calls.push(options); return Response.json({id:'provider-test-id'}); });
  const input = data(); const result = await (await submit(input)).json();
  assert.equal(result.mailStatus,'sent'); const mail = JSON.parse(calls[0].body);
  assert.deepEqual(mail.to,['info@odborypacketa.eu']); assert.equal(mail.reply_to,input.email); assert.ok(mail.text.includes(input.message)); assert.equal(calls[0].headers['Idempotency-Key'],`odboracik/${input.id}`);
  await submit(input); assert.equal(calls.length,1);
});
test('email outage preserves accepted query; scheduled retry uses same key and sends once', async () => {
  let calls=[]; mailSetup(options=> { calls.push(options); return calls.length === 1 ? Response.json({error:'outage'},{status:503}) : Response.json({id:'retry-id'}); });
  const input=data(); assert.equal((await (await submit(input)).json()).mailStatus,'pending');
  assert.equal(db.prepare('SELECT COUNT(*) AS n FROM queries').get().n,1);
  db.prepare('UPDATE mail_outbox SET next_attempt_at = ?').run('2000-01-01T00:00:00.000Z');
  await worker.scheduled({},env); assert.equal(db.prepare('SELECT status FROM mail_outbox').get().status,'sent');
  assert.equal(calls[0].headers['Idempotency-Key'],calls[1].headers['Idempotency-Key']); assert.equal(calls[0].body,calls[1].body);
  await worker.scheduled({},env); assert.equal(calls.length,2);
});
test('concurrent mail requests respect durable send lease', async () => {
  let release, calls=0; const gate=new Promise(resolve=>release=resolve);
  mailSetup(async ()=>{calls++; await gate; return Response.json({id:'lease-id'});});
  const input=data(); const first=submit(input);
  while(!calls) await new Promise(resolve=>setImmediate(resolve));
  assert.equal((await (await submit(input)).json()).mailStatus,'sending');
  release(); await first; assert.equal(calls,1);
});
test('retry window expiry requires review and does not blindly resend', async () => {
  let calls=0; mailSetup(()=>{calls++;return Response.json({error:'outage'},{status:503});});
  await submit(data()); db.prepare('UPDATE mail_outbox SET retry_until = ?, next_attempt_at = ?').run('2000-01-01T00:00:00.000Z','2000-01-01T00:00:00.000Z');
  await worker.scheduled({},env); assert.equal(calls,1); assert.equal(db.prepare('SELECT status FROM mail_outbox').get().status,'failed');
  assert.equal((await (await admin()).json()).records[0].mailStatus,'failed');
});
test('unconfirmed provider response never claims email was sent', async () => {
  mailSetup(()=>Response.json({ok:true})); assert.equal((await (await submit(data())).json()).mailStatus,'pending');
});
