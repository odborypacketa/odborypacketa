(function(root){
 'use strict';
 function configured(c){try {const u=new URL(c.chatEndpoint);return u.protocol==='https:'&&!u.username&&!u.password&&!u.hash&&u.pathname==='/api/chat'&&Boolean(c.aiTurnstileSiteKey)&&c.aiPrivacyReady===true;}catch{return false;}}
 function create(config,remote=fetch){
  let history=[],busy=false;
  return {available:configured(config),reset(){history=[];},async respond(question,token){
   if(!configured(config)||busy||!token)throw Error('AI nie je pripravená.');busy=true;
   const messages=[...history.slice(-8),{role:'user',content:question}];
   try{const response=await remote(config.chatEndpoint,{method:'POST',credentials:'omit',referrerPolicy:'no-referrer',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages,turnstileToken:token,consent:true}),signal:AbortSignal.timeout(30000)});
    const result=await response.json();if(!response.ok||result.ok!==true||result.mode!=='ai'||typeof result.answer!=='string'||result.answer.length>4000||!Array.isArray(result.sources)||!Array.isArray(result.links))throw Error('AI je nedostupná.');
    const allowed=new Set(Object.values(root.ODBORACIK_LEGAL_BASE.sources).map(s=>s.url));
    const allowedLinks=new Set((root.ODBORACIK_LEGAL_BASE.conversationTopics||[]).flatMap(c=>(c.links||[]).map(l=>l.url)));
    if(result.sources.some(s=>!allowed.has(s.url)||typeof s.name!=='string'||typeof s.provision!=='string')||result.links.some(l=>!allowedLinks.has(l.url)||typeof l.label!=='string'))throw Error('Neoverené zdroje.');
    history=[...messages,{role:'assistant',content:result.answer}].slice(-8);return result;
   }finally{busy=false;}
  }};
 }
 root.ODBORACIK_AI={create,configured};
})(typeof window!=='undefined'?window:globalThis);
