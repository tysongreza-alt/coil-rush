const assert=require('node:assert/strict');const {win}=require('./harness.cjs');
async function walkAdventure(h,z,r,{optional=false,approach='lower',metrics=null}={}){
 const api=h.api;api.beginAdventure(`${z}:${r}`);const run=api.getState().adventure.runs[`${z}:${r}`];
 async function resolve(){const kind=api.Adv.KINDS[run.position];if(run.cleared.includes(run.position))return;
 if(['battle','captain','nest'].includes(kind)){let result,tries=0;do{assert.equal(api.startAdventureBattle(),true);result=await win(api);if(metrics){metrics.battles++;metrics.actions+=result.turns;if(!result.won)metrics.losses++;}if(!result.won&&++tries>=20)throw Error(`Field encounter blocked: ${z}:${r}:${run.position}`);}while(!result.won);}
 else if(kind==='puzzle'){let moves=0;while(!api.Adv.puzzleSolved(run.puzzle)&&moves++<100){const hint=api.Adv.puzzleHint(run.puzzle);assert.ok(hint);api.adventurePuzzleAction(hint);if(metrics)metrics.puzzleMoves=(metrics.puzzleMoves||0)+1;}assert.equal(api.clearAdventureRoom(),true);}
 else assert.equal(api.clearAdventureRoom(kind==='choice'?'craft':undefined),true);
 }
 await resolve();
 const path=optional?[1,2,3,4,3,2,1,5,6,10,6,7,8,9,11]:approach==='upper'?[1,2,3,7,9,11]:[1,5,6,7,9,11];
 for(const destination of path){assert.equal(api.moveAdventure(destination),true,`Move ${run.position}→${destination} in ${z}:${r}`);if(metrics)metrics.travelMoves=(metrics.travelMoves||0)+1;await resolve();}
 assert.ok(run.completed);api.featureAction('fieldleave','',{});return run;
}
function prepareGuardianFixture(s,z,Adv){s.story.completed.push(...[0,1,2].map(n=>`${z}:0:${n}`));for(let r=0;r<3;r++){const run=Adv.runState(z,r);run.visited=[0,1,2,3,7,9,11];run.cleared=run.visited.slice();run.position=11;run.branch='upper';run.completed=true;s.adventure.runs[`${z}:${r}`]=run;}}
module.exports={walkAdventure,prepareGuardianFixture};
