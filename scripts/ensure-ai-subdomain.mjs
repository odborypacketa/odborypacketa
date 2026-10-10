// Uses GitHub's existing Cloudflare secrets; never prints credentials or account IDs.
import {appendFile} from 'node:fs/promises';
const account=process.env.CLOUDFLARE_ACCOUNT_ID,token=process.env.CLOUDFLARE_API_TOKEN;
if(!account||!token)throw Error('Chýba Cloudflare prístup.');
const endpoint='https://api.cloudflare.com/client/v4/accounts/'+encodeURIComponent(account)+'/workers/subdomain';
const headers={Authorization:'Bearer '+token,'Content-Type':'application/json'};
async function call(method,body){const response=await fetch(endpoint,{method,headers,...(body?{body:JSON.stringify(body)}:{}),signal:AbortSignal.timeout(20000)});return {status:response.status,data:await response.json()};}
let result=await call('GET');
if(!result.data.success||!result.data.result?.subdomain){
 if(result.status===401||result.status===403)throw Error('Cloudflare token nemá prístup k Workers subdoméne.');
 const subdomain=process.env.AI_WORKERS_SUBDOMAIN||'odborypacketa';
 if(!/^[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/.test(subdomain))throw Error('Neplatná Workers subdoména.');
 result=await call('PUT',{subdomain});
}
if(!result.data.success||!result.data.result?.subdomain)throw Error('Workers subdoménu sa nepodarilo nastaviť. Kódy Cloudflare: '+(result.data.errors||[]).map(e=>e.code).join(',')+'. Nastavte ju v Cloudflare → Workers & Pages.');
const subdomain=result.data.result.subdomain;
if(!/^[a-z0-9-]+$/.test(subdomain))throw Error('Neplatná odpoveď Cloudflare.');
const url='https://odboracik-ai.'+subdomain+'.workers.dev/api/chat';
console.log('Verejný AI endpoint: '+url);
if(process.env.GITHUB_STEP_SUMMARY)await appendFile(process.env.GITHUB_STEP_SUMMARY,'\nVerejný AI endpoint: '+url+'\n');
