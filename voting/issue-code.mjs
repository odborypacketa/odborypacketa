// Run offline. One record per verified eligible member, in a separate encrypted registry.
// Never commit output. Deliver the code privately; import only the digest to voting.
import { randomBytes, createHash } from 'node:crypto';
const poll=process.argv[2];
if(!/^[0-9a-f-]{36}$/.test(poll||''))throw Error('Provide the poll UUID.');
const credential=randomBytes(32).toString('hex');
console.log(JSON.stringify({credential,digest:createHash('sha256').update(`${poll}:${credential}`).digest('hex')}));
