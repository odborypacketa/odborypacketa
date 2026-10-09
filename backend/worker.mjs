const topics = ['Mzda alebo pracovný čas', 'Pracovné podmienky / BOZP', 'Komunikácia alebo konflikt', 'Skončenie pracovného pomeru', 'Členstvo alebo spolupráca', 'Iné'];
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const enc = new TextEncoder();
const b64 = bytes => btoa(String.fromCharCode(...new Uint8Array(bytes)));
const unb64 = text => Uint8Array.from(atob(text), c => c.charCodeAt(0));
async function key(env) {
  const bytes = unb64(env.DATA_ENCRYPTION_KEY || '');
  if (bytes.length !== 32) throw new Error('Invalid key');
  return crypto.subtle.importKey('raw', bytes, 'AES-GCM', false, ['encrypt', 'decrypt']);
}
async function encrypt(data, id, env) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv, additionalData: enc.encode(id) }, await key(env), enc.encode(JSON.stringify(data)));
  return { iv: b64(iv), ciphertext: b64(ciphertext) };
}
async function decrypt(row, env) {
  const value = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(row.iv), additionalData: enc.encode(row.id) }, await key(env), unb64(row.ciphertext));
  return JSON.parse(new TextDecoder().decode(value));
}
export function validate(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data) || !uuid.test(data.id || '') || data.company || data.consent !== true || data.channel !== 'formulár') return null;
  const clean = (value, max, required = false) => typeof value === 'string' && value.length <= max && (!required || value.trim()) ? value.trim() : null;
  const name = clean(data.name, 80);
  const email = clean(data.email, 120, true);
  const message = clean(data.message, 3000, true);
  if (name === null || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !message || !topics.includes(data.topic) || typeof data.urgent !== 'boolean') return null;
  return { channel: 'formulár', name, email, topic: data.topic, message, urgent: data.urgent, consent: true };
}
function configuration(env) {
  const retention = Number(env.RETENTION_DAYS);
  const origin = new URL(env.ALLOWED_ORIGIN);
  if (origin.protocol !== 'https:' || origin.origin !== env.ALLOWED_ORIGIN || !Number.isInteger(retention) || retention < 1 || retention > 3650 || !env.DB || !env.TURNSTILE_SECRET_KEY || !env.ADMIN_TOKEN || env.ADMIN_TOKEN.length < 32 || env.PRIVACY_READY !== 'true') throw new Error('Not configured');
}
async function handler(request, env) {
  const url = new URL(request.url);
  const origin = request.headers.get('Origin');
  const headers = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'Vary': 'Origin' };
  // CORS enables submissions only. Administrative responses never enable CORS.
  if (url.pathname === '/api/queries' && request.method !== 'GET' && origin === env.ALLOWED_ORIGIN) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS';
    headers['Access-Control-Allow-Headers'] = 'Content-Type';
  }
  const respond = (data, status = 200) => Response.json(data, { status, headers });
  try { configuration(env); await key(env); } catch { return respond({ error: 'Služba nie je pripravená.' }, 503); }
  if (url.pathname === '/api/queries' && request.method === 'OPTIONS') return origin === env.ALLOWED_ORIGIN ? new Response(null, { status: 204, headers }) : respond({ error: 'Nepovolený pôvod.' }, 403);
  if (url.pathname === '/api/queries' && request.method === 'POST') {
    if (origin !== env.ALLOWED_ORIGIN) return respond({ error: 'Nepovolený pôvod.' }, 403);
    if ((request.headers.get('Content-Type') || '').split(';')[0].trim() !== 'application/json') return respond({ error: 'Použite JSON.' }, 415);
    // Bound streamed bytes too; Content-Length alone is not trusted.
    let length = 0, chunks = [];
    if (!request.body) return respond({ error: 'Chýba formulár.' }, 400);
    const reader = request.body.getReader();
    while (true) {
      const { done, value } = await reader.read(); if (done) break;
      length += value.byteLength;
      if (length > 20000) { await reader.cancel(); return respond({ error: 'Príliš veľký formulár.' }, 413); }
      chunks.push(value);
    }
    const bytes = new Uint8Array(length); let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
    let data; try { data = JSON.parse(new TextDecoder().decode(bytes)); } catch { return respond({ error: 'Neplatný JSON.' }, 400); }
    const payload = validate(data);
    if (!payload || typeof data.turnstileToken !== 'string' || !data.turnstileToken || data.turnstileToken.length > 2048) return respond({ error: 'Skontrolujte formulár a ochranu proti spamu.' }, 400);
    const verification = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST', body: new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY, response: data.turnstileToken }), signal: AbortSignal.timeout(10000)
    });
    if (!verification.ok) return respond({ error: 'Overenie nie je dostupné.' }, 503);
    const result = await verification.json();
    if (!result.success || result.hostname !== new URL(env.ALLOWED_ORIGIN).hostname || result.action !== 'contact') return respond({ error: 'Zopakujte overenie proti spamu.' }, 403);
    const now = new Date();
    const encrypted = await encrypt(payload, data.id, env);
    const expiry = new Date(now.getTime() + Number(env.RETENTION_DAYS) * 86400000).toISOString();
    await env.DB.prepare('INSERT INTO queries (id, created_at, expires_at, iv, ciphertext) VALUES (?, ?, ?, ?, ?) ON CONFLICT(id) DO NOTHING').bind(data.id, now.toISOString(), expiry, encrypted.iv, encrypted.ciphertext).run();
    const row = await env.DB.prepare('SELECT * FROM queries WHERE id = ?').bind(data.id).first();
    if (!row || JSON.stringify(await decrypt(row, env)) !== JSON.stringify(payload)) return respond({ error: 'Identifikátor patrí inému podaniu.' }, 409);
    return respond({ ok: true, id: row.id }, 201);
  }
  if (url.pathname.startsWith('/api/admin/')) {
    // No admin token in frontend/config; no browser access from foreign origins.
    if (origin) return respond({ error: 'Nepovolený pôvod.' }, 403);
    const candidate = request.headers.get('Authorization') || '';
    const hash = async value => new Uint8Array(await crypto.subtle.digest('SHA-256', enc.encode(value)));
    const a = await hash(candidate), b = await hash(`Bearer ${env.ADMIN_TOKEN}`);
    let difference = 0; for (let i = 0; i < a.length; i++) difference |= a[i] ^ b[i];
    if (difference) return respond({ error: 'Neoprávnený prístup.' }, 401);
    if (url.pathname === '/api/admin/queries' && request.method === 'GET') {
      const cursor = url.searchParams.get('after') || '';
      if (cursor && !uuid.test(cursor)) return respond({ error: 'Neplatný kurzor.' }, 400);
      const { results } = await env.DB.prepare('SELECT * FROM queries WHERE expires_at > ? AND id > ? ORDER BY id LIMIT 100').bind(new Date().toISOString(), cursor).all();
      const records = await Promise.all(results.map(async row => ({ id: row.id, createdAt: row.created_at, expiresAt: row.expires_at, ...await decrypt(row, env) })));
      return respond({ records, next: results.length === 100 ? results.at(-1).id : null });
    }
    const id = url.pathname.slice('/api/admin/queries/'.length);
    if (url.pathname.startsWith('/api/admin/queries/') && request.method === 'DELETE' && uuid.test(id)) {
      await env.DB.prepare('DELETE FROM queries WHERE id = ?').bind(id).run();
      return respond({ ok: true });
    }
  }
  return respond({ error: 'Nenájdené.' }, 404);
}
export default {
  async fetch(request, env) {
    try { return await handler(request, env); }
    catch { return Response.json({ error: 'Dotaz sa nepodarilo potvrdiť. Skúste znova.' }, { status: 503, headers: { 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': new URL(request.url).pathname === '/api/queries' && request.method === 'POST' && request.headers.get('Origin') === env.ALLOWED_ORIGIN ? env.ALLOWED_ORIGIN : '', 'Vary': 'Origin' } }); }
  },
  async scheduled(controller, env) {
    await env.DB.prepare('DELETE FROM queries WHERE expires_at <= ?').bind(new Date().toISOString()).run();
  }
};
