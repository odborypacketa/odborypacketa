import voting from './worker.mjs';
export default {
 async fetch(request,env,ctx){
 const url=new URL(request.url);
 if(url.hostname==='odborypacketa.eu'){url.hostname='www.odborypacketa.eu';return Response.redirect(url,308);}
 if(url.pathname.startsWith('/api/voting/'))return voting.fetch(request,env,ctx);
 if(url.pathname==='/hlasovania'){url.pathname='/hlasovania/';return Response.redirect(url,308);}
 if(!url.pathname.startsWith('/hlasovania/'))return new Response('Nenájdené',{status:404});
 const asset=await env.ASSETS.fetch(request);const response=new Response(asset.body,asset);
 response.headers.set('Cache-Control','no-store');response.headers.set('X-Content-Type-Options','nosniff');response.headers.set('Referrer-Policy','no-referrer');
 response.headers.set('Content-Security-Policy',"default-src 'self'; script-src 'self' https://challenges.cloudflare.com; frame-src https://challenges.cloudflare.com; connect-src 'self' https://challenges.cloudflare.com; style-src 'self'; img-src 'self' data:; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'");
 return response;
 },scheduled:voting.scheduled
};
