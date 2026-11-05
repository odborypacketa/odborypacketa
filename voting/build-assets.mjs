import {cpSync,mkdirSync,readFileSync,writeFileSync} from 'node:fs';
const root=new URL('../',import.meta.url),output=new URL('voting-static/',root);
mkdirSync(output,{recursive:true});cpSync(new URL('hlasovania/',root),new URL('hlasovania/',output),{recursive:true});cpSync(new URL('style.css',root),new URL('style.css',output));
const schedule=JSON.parse(readFileSync(new URL('schedule.json',import.meta.url),'utf8'));
writeFileSync(new URL('hlasovania/config.js',output),'window.VOTING_CONFIG=Object.freeze('+JSON.stringify({enabled:true,fallbackOrigin:'https://odbory-anketa.odborypacketa.workers.dev',turnstileSiteKey:'0x4AAAAAAF0rhn-Wv1wBZ3jk',schedule})+');\n');
console.log('Production static assets built. Secrets must be set separately in Cloudflare.');
