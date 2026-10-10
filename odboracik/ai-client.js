(function(root){
 'use strict';
 function configured(c){try {const u=new URL(c.chatEndpoint);return u.protocol==='https:'&&!u.username&&!u.password&&!u.hash&&u.pathname==='/api/chat'&&Boolean(c.aiTurnstileSiteKey)&&c.aiPrivacyReady===true;}catch{return false;}}
 function create(config,remote=fetch){
  let history=[],busy=false;
  return {available:configured(config),reset(){history=[];},async respond(question,token){
   if(!configured(config)||busy||!token)throw Error('AI nie je pripravená.');busy=true;
   const messages=[...history.slice(-8),{role:'user',content:question}];
   try{const response=await remote(config.chatEndpoint,{method:'POST',credentials:'omit',referrerPolicy:'no-referrer',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages,turnstileToken:token,consent:true}),signal:AbortSignal.timeout(40000)});
    const result=await response.json();if(!response.ok){const hints={daily_limit:'Denný limit AI bol dosiahnutý. Dnes môžete použiť základné odpovede alebo kontaktovať odbory.',verification:'Overenie proti spamu vypršalo. Po novom overení odošlite otázku znova.',timeout:'AI odpoveď trvala príliš dlho. Skúste otázku znovu.',answer_length:'AI odpoveď bola príliš dlhá a nedokončila sa. Skúste otázku rozdeliť.',answer_incomplete:'AI nedokončila odpoveď. Skúste otázku znova.',answer_format:'AI odpoveď sa nepodarilo bezpečne spracovať. Skúste otázku znova.',answer_links:'AI odpoveď obsahovala neoverený odkaz, preto sa nezobrazila.',answer_validation:'AI odpoveď neprešla kontrolou, preto sa nezobrazila.',insufficient_quota:'AI nemá dostupný kredit v OpenAI API. Správca musí doplniť kredit alebo upraviť limit účtu.',invalid_api_key:'OpenAI API kľúč treba skontrolovať v nastaveniach nasadenia.',model_not_found:'AI model nie je dostupný pre pripojený účet.'};throw Error(hints[result.code]||'AI je dočasne nedostupná (označenie: '+(/^[a-z_0-9]{1,40}$/.test(result.code||'')?result.code:'spojenie')+').');}if(!response.ok||result.ok!==true||result.mode!=='ai'||typeof result.answer!=='string'||result.answer.length>4000||!Array.isArray(result.sources)||!Array.isArray(result.links))throw Error('AI je nedostupná.');
    const allowed=new Set(Object.values(root.ODBORACIK_LEGAL_BASE.sources).map(s=>s.url));
    const allowedLinks=new Set((root.ODBORACIK_LEGAL_BASE.conversationTopics||[]).flatMap(c=>(c.links||[]).map(l=>l.url)));
    if(result.sources.some(s=>!allowed.has(s.url)||typeof s.name!=='string'||typeof s.provision!=='string')||result.links.some(l=>!allowedLinks.has(l.url)||typeof l.label!=='string'))throw Error('Neoverené zdroje.');
    history=[...messages,{role:'assistant',content:result.answer}].slice(-8);return result;
   }finally{busy=false;}
  }};
 }
 root.ODBORACIK_AI={create,configured};
})(typeof window!=='undefined'?window:globalThis);
