globalThis.VotingClock=Object.freeze({
 duration:10*24*60*60,
 remaining(end,now){return Math.max(0,Math.ceil(end-now));},
 label(seconds){const n=Math.max(0,Math.floor(seconds));return `${Math.floor(n/86400)} dní · ${String(Math.floor(n%86400/3600)).padStart(2,'0')} hod · ${String(Math.floor(n%3600/60)).padStart(2,'0')} min · ${String(n%60).padStart(2,'0')} s`;}
});
