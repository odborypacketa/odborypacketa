import { cp, access } from 'node:fs/promises';
// Explicit public-file allowlist: never publish backend, tests or credentials.
const files = ['index.html','style.css','app.js','cookies.js','cookies.html','sukromie.html','CNAME','logo.png','prihlaska.docx','qr-prihlaska.svg','qr.png','robots.txt','sitemap.xml','rozcestnik.html','content'];
for (const path of files) { await access(path); await cp(path, `site-output/${path}`, {recursive:true}); }
