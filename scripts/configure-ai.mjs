import {writeFile} from 'node:fs/promises';
const e=process.env,required=name=>{if(!e[name])throw Error('Chýba '+name);return e[name];};
if(e.AI_PRIVACY_READY!=='true')throw Error('Pred aktiváciou dokončite informácie o spracúvaní AI rozhovoru.');
const name=e.AI_WORKER_NAME||'odboracik-ai';if(!/^[a-z0-9-]{1,63}$/.test(name))throw Error('Neplatný názov služby');
const limit=Number(e.AI_DAILY_REQUEST_LIMIT||30);if(!Number.isInteger(limit)||limit<1||limit>1000)throw Error('Neplatný denný limit');
const secrets={OPENAI_API_KEY:required('OPENAI_API_KEY'),TURNSTILE_SECRET_KEY:required('AI_TURNSTILE_SECRET_KEY')};
await writeFile('ai/wrangler.json',JSON.stringify({name,main:'worker.mjs',compatibility_date:'2026-10-10',workers_dev:true,observability:{enabled:false},vars:{ALLOWED_ORIGIN:'https://www.odborypacketa.eu',AI_PRIVACY_READY:'true',OPENAI_MODEL:'gpt-5.4-mini-2026-03-17',DAILY_REQUEST_LIMIT:String(limit)},durable_objects:{bindings:[{name:'LIMITS',class_name:'ChatLimits'}]},migrations:[{tag:'v1',new_sqlite_classes:['ChatLimits']}]},null,2));
await writeFile(required('AI_SECRETS_FILE'),JSON.stringify(secrets),{mode:0o600});
