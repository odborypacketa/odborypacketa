import { test } from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
const source = readFileSync(new URL('../odborovy-asistent-web/app.js', import.meta.url), 'utf8');
function setup(config = {}, fetcher) {
  const nodes = new Map(), calls = [], storage = new Map();
  function node(id) { if (!nodes.has(id)) nodes.set(id, { id, textContent: '', value: '', hidden: true, disabled: false, children: [], listeners: {}, addEventListener(type, fn) { this.listeners[type] = fn; }, append(el) { this.children.push(el); }, querySelector(sel) { return node(sel); }, reportValidity() { return true; }, reset() { this.resets = (this.resets || 0) + 1; }, focus() {}, showModal() {}, close() {} }); return nodes.get(id); }
  const form = node('#contact-form'); form.elements = [node('[type="submit"]'), node('field')];
  const fields = { name: 'Test', email: 'test@example.invalid', topic: 'Iné', message: 'Vymyslený podnet', consent: 'on', company: '' };
  const document = { querySelector: node, querySelectorAll: () => [], createElement: () => node('generated' + Math.random()), head: node('head') };
  const window = { ODBOROVY_ASISTENT_CONFIG: config, ODBORACIK_KNOWLEDGE_BASE: [], setTimeout(fn) { fn(); }, turnstile: { render() { return 0; }, getResponse() { return 'test-token'; }, reset() {} } };
  const context = vm.createContext({ window, document, localStorage: { getItem: k => storage.get(k), setItem: (k,v) => storage.set(k,v) }, crypto, URL, AbortController, setTimeout, clearTimeout, FormData: class { constructor() {} *[Symbol.iterator]() { yield* Object.entries(fields); } }, fetch: async (url, options) => { calls.push({ url, ...options }); return fetcher ? fetcher(options) : Response.json({ok:false}); } });
  for (const name of ['knowledge-base.js','legal-engine.js']) vm.runInContext(readFileSync(new URL('../odborovy-asistent-web/'+name,import.meta.url),'utf8'),context);
  vm.runInContext(source, context); window.odboracikTurnstileReady?.();
  return { nodes, form, fields, calls, storage, submit: () => form.listeners.submit({ preventDefault() {} }), chat: (question='test question') => { node('#chat-input').value = question; node('#chat-form').listeners.submit({ preventDefault() {} }); } };
}
const cfg = { queryEndpoint: 'https://backend.invalid/api/queries', privacyUrl: 'https://www.odborypacketa.eu/privacy-test', turnstileSiteKey: 'test-site-key' };
test('public chat never transmits or persists text', () => { const ui = setup(cfg); ui.chat(); assert.equal(ui.calls.length, 0); assert.equal(ui.storage.size, 0); });
test('unconfigured contact never transmits', async () => { const ui = setup(); await ui.submit(); assert.equal(ui.calls.length, 0); assert.match(ui.nodes.get('#form-status').textContent, /nebol odoslaný/); });
test('successful submission requires acknowledged matching ID', async () => { const ui = setup(cfg, options => Response.json({ ok: true, id: JSON.parse(options.body).id })); await ui.submit(); assert.equal(ui.form.resets, 1); assert.match(ui.nodes.get('#form-status').textContent, /prijatý/); assert.equal(ui.storage.size, 0); });
test('HTTP success with wrong receipt preserves form', async () => { const ui = setup(cfg, () => Response.json({ ok: true, id: 'wrong' })); await ui.submit(); assert.equal(ui.form.resets, undefined); assert.match(ui.nodes.get('#form-status').textContent, /nepodarilo/); });
test('network failure preserves text; retry reuses ID until contents change', async () => { const ui = setup(cfg, () => { throw new Error('offline'); }); await ui.submit(); await ui.submit(); assert.equal(JSON.parse(ui.calls[0].body).id, JSON.parse(ui.calls[1].body).id); ui.fields.message = 'Zmenená otázka'; await ui.submit(); assert.notEqual(JSON.parse(ui.calls[1].body).id, JSON.parse(ui.calls[2].body).id); assert.equal(ui.form.resets, undefined); assert.equal(ui.nodes.get('[type="submit"]').disabled, false); });
test('explicit internal test stores locally and sends nothing', async () => { const ui = setup({ internalStorageEnabled: true }); await ui.submit(); assert.equal(ui.calls.length, 0); assert.equal(ui.storage.size, 1); assert.match(ui.nodes.get('#form-status').textContent, /nebol odoslaný/); });
test('email receipt distinguishes provider acceptance from database-only receipt', async () => { const ui = setup(cfg, options => Response.json({ ok: true, id: JSON.parse(options.body).id, mailStatus: 'sent' })); await ui.submit(); assert.match(ui.nodes.get('#form-status').textContent, /e-mailová služba prijala/); assert.equal(ui.form.resets, 1); });
test('real chat renders direct explanations, clickable sources and follow-up questions',()=>{
 const flatten = node => (node.textContent||'') + ' ' + node.children.map(flatten).join(' ');
 for (const [question,expected] of [['Čo sú odbory?',/organizácia zamestnancov/],['Ako dať výpoveď?',/písomná a doručená/],['Koľko mám dovolenky?',/štyri týždne/]]) {
  const ui=setup(cfg);ui.chat(question);
  const reply=ui.nodes.get('#messages').children.at(-1);
  assert.match(flatten(reply),expected);
  assert.ok(reply.children.some(n=>n.children.some(c=>c.href?.startsWith('https://static.slov-lex.sk/'))));
  assert.equal(ui.calls.length,0);assert.equal(ui.storage.size,0);
 }
});
test('browser renders user markup as text and never as active HTML',()=>{
 const ui=setup(cfg);ui.chat('<img src=x onerror=alert(1)> Čo sú odbory?');
 assert.equal(ui.nodes.get('#messages').children[0].textContent,'<img src=x onerror=alert(1)> Čo sú odbory?');
 assert.equal(ui.nodes.get('#messages').children[0].innerHTML,undefined);
});
