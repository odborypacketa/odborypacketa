import { writeFile } from 'node:fs/promises';
const endpoint = new URL(process.env.QUERY_ENDPOINT);
if (endpoint.protocol !== 'https:' || endpoint.username || endpoint.password) throw new Error('Použite skutočný HTTPS endpoint.');
const token = process.env.ADMIN_TOKEN;
if (!token || token.length < 32) throw new Error('Chýba ADMIN_TOKEN.');
async function call(path, method = 'GET') {
  const response = await fetch(new URL(path, endpoint), { method, headers: { Authorization: `Bearer ${token}` }, redirect: 'error', signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error(`Operácia zlyhala: ${response.status}`);
  return response.json();
}
if (process.argv[2] === 'export' && process.argv[3]) {
  let after = '', records = [];
  do { const page = await call(`/api/admin/queries?after=${encodeURIComponent(after)}`); records.push(...page.records); after = page.next; } while (after);
  await writeFile(process.argv[3], JSON.stringify(records, null, 2), { mode: 0o600, flag: 'wx' });
  console.log(`Exportovaných podaní: ${records.length}. Súbor chráňte ako osobné údaje.`);
} else if (process.argv[2] === 'delete' && /^[a-f0-9-]{36}$/i.test(process.argv[3] || '')) {
  await call(`/api/admin/queries/${process.argv[3]}`, 'DELETE'); console.log('Podanie vymazané.');
} else throw new Error('Použite export <nový súbor.json> alebo delete <ID>.');
