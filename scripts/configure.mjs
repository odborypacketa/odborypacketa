import { writeFile, readFile, mkdir, cp, access } from 'node:fs/promises';
import { resolve, relative } from 'node:path';
const env = process.env;
const req = name => { if (!env[name]) throw new Error(`Doplňte ${name}`); return env[name]; };
const https = value => { const url = new URL(value); if (url.protocol !== 'https:' || url.username || url.password || url.hash) throw new Error('Neplatná HTTPS URL'); return url; };
if (process.argv[2] === 'backend') {
  const days = Number(req('RETENTION_DAYS')), id = req('D1_DATABASE_ID');
  if (!Number.isInteger(days) || days < 1 || days > 3650 || !/^[a-f0-9-]{36}$/i.test(id)) throw new Error('Neplatná konfigurácia databázy');
  if (env.PRIVACY_READY !== 'true') throw new Error('Najprv dokončite informácie o spracúvaní údajov.');
  const name = env.WORKER_NAME || 'odboracik-prijimac';
  if (!/^[a-z0-9-]{1,63}$/.test(name)) throw new Error('Neplatný názov Worker');
  const fromEmail = req('CONTACT_FROM_EMAIL');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fromEmail)) throw new Error('Neplatný overený odosielateľ');
  const secrets = { TURNSTILE_SECRET_KEY: req('TURNSTILE_SECRET_KEY'), ADMIN_TOKEN: req('ADMIN_TOKEN'), RESEND_API_KEY: req('RESEND_API_KEY'), DATA_ENCRYPTION_KEY: req('DATA_ENCRYPTION_KEY') };
  if (secrets.ADMIN_TOKEN.length < 32 || Buffer.from(secrets.DATA_ENCRYPTION_KEY, 'base64').length !== 32) throw new Error('Neplatná dĺžka kľúča');
  await writeFile('backend/wrangler.json', JSON.stringify({ name, main: 'worker.mjs', compatibility_date: '2026-10-09', workers_dev: true, observability: { enabled: false }, vars: { ALLOWED_ORIGIN: 'https://www.odborypacketa.eu', RETENTION_DAYS: String(days), PRIVACY_READY: 'true', CONTACT_FROM_EMAIL: fromEmail }, d1_databases: [{ binding: 'DB', database_name: 'odboracik-dotazy', database_id: id }], triggers: { crons: ['*/5 * * * *'] } }, null, 2));
  await writeFile(req('SECRETS_FILE'), JSON.stringify(secrets), { mode: 0o600 });
} else if (process.argv[2] === 'web') {
  const source=await readFile('odborovy-asistent-web/config.js','utf8');
  const previous=JSON.parse(source.slice(source.indexOf(' = ')+3).trim().replace(/;$/,''));
  const cfg = { queryEndpoint: env.QUERY_ENDPOINT || previous.queryEndpoint || '', privacyUrl: env.PRIVACY_URL || previous.privacyUrl || '', turnstileSiteKey: env.TURNSTILE_SITE_KEY || previous.turnstileSiteKey || '', internalStorageEnabled: false, chatEndpoint:env.AI_CHAT_ENDPOINT||previous.chatEndpoint||'',aiTurnstileSiteKey:env.AI_TURNSTILE_SITE_KEY||previous.aiTurnstileSiteKey||'',aiPrivacyReady:env.AI_PRIVACY_READY?env.AI_PRIVACY_READY==='true':previous.aiPrivacyReady===true };
  if (cfg.queryEndpoint) https(cfg.queryEndpoint);
  if (cfg.privacyUrl) https(cfg.privacyUrl);
  if(cfg.chatEndpoint && https(cfg.chatEndpoint).pathname!=='/api/chat')throw new Error('AI endpoint musí končiť /api/chat');
  await writeFile('odborovy-asistent-web/config.js', `window.ODBOROVY_ASISTENT_CONFIG = ${JSON.stringify(cfg, null, 2)};\n`);
  await mkdir('site-output', { recursive: true });
  if (env.PAGES_SITE_DIRECTORY) {
    const source = resolve(env.PAGES_SITE_DIRECTORY), rel = relative(process.cwd(), source);
    if (!rel || rel.startsWith('..') || ['site-output', 'backend', 'scripts', 'tests', 'odborovy-asistent-web', '.github'].some(p => rel === p || rel.startsWith(p + '/'))) throw new Error('Vyberte samostatný priečinok existujúceho verejného webu.');
    await access(resolve(source, 'index.html'));
    await cp(source, 'site-output', { recursive: true, filter: path => !/(^|\/)(\.git|\.env[^/]*|\.dev\.vars[^/]*|node_modules)(\/|$)/.test(path) });
  }
  await cp('odborovy-asistent-web', 'site-output/odboracik', { recursive: true });
  await writeFile('site-output/.nojekyll', '');
} else throw new Error('Použite backend alebo web');
