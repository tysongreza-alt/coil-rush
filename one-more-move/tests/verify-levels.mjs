// Regression gate for One More Move's portable level catalogue.
// Run locally from one-more-move/: node tests/verify-levels.mjs
import assert from 'node:assert/strict';
import fs from 'node:fs';
const {count,levels}=JSON.parse(fs.readFileSync(new URL('../levels.json',import.meta.url),'utf8'));
assert.equal(count,80);assert.equal(levels.length,80);
const dirs={U:[0,-1],R:[1,0],D:[0,1],L:[-1,0]};
function step(l,st,dir){
 const [dx,dy]=dirs[dir],n=l.n,x=st.pos%n,y=Math.floor(st.pos/n),line=dx?y:x;
 if((dx?l.lockR:l.lockC).includes(line))return null;
 const one=dx?l.oneR[String(line)]:l.oneC[String(line)];
 if(one&&((dx||dy)!==one))return null;
 let to=((y+dy+n)%n)*n+(x+dx+n)%n;
 if(l.walls.includes(to))return null;
 if(Object.prototype.hasOwnProperty.call(l.portals,String(to)))to=Number(l.portals[to]);
 let mask=st.mask;const gem=l.shards.indexOf(to);
 if(gem>=0&&(!l.ordered||mask===(1<<gem)-1))mask|=1<<gem;
 return {pos:to,mask};
}
function optimal(l){
 const target=(1<<l.shards.length)-1,q=[{pos:l.start,mask:0,steps:0}],seen=new Set([l.start+':0']);
 for(let i=0;i<q.length;i++){
  const st=q[i];if(st.pos===l.exit&&st.mask===target)return st.steps;
  for(const dir of Object.keys(dirs)){
   const nx=step(l,st,dir);if(!nx)continue;
   const key=nx.pos+':'+nx.mask;if(seen.has(key))continue;
   seen.add(key);q.push({...nx,steps:st.steps+1});
  }
 }
 return null;
}
for(let i=0;i<levels.length;i++){
 const l=levels[i],okPos=x=>Number.isInteger(x)&&x>=0&&x<l.n*l.n;
 assert([5,6].includes(l.n),`board ${i}`);
 assert(okPos(l.start)&&okPos(l.exit),`start/end ${i}`);
 assert(Array.isArray(l.shards)&&l.shards.length>0&&l.shards.every(okPos)&&l.walls.every(okPos),`positions ${i}`);
 assert(new Set(l.shards).size===l.shards.length,`duplicate glows ${i}`);
 assert(!l.walls.includes(l.start)&&!l.walls.includes(l.exit),`wall overlap ${i}`);
 assert(l.shards.every(g=>!l.walls.includes(g)),`glow inside stone ${i}`);
 assert.equal(optimal(l),l.par,`optimal route ${i+1}`);
 assert(l.par<=l.limit,`move limit ${i+1}`);
 assert.equal(l.chapter,Math.floor(i/16),`world ${i+1}`);
}
console.log(`PASS: ${levels.length} puzzles verified; shortest routes, budgets, bounds and world ordering.`);
