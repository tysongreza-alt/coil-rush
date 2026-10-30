const {boot,win}=require('./harness.cjs');const fs=require('node:fs');
async function campaign(starter){const h=await boot({seed:500+starter}),s=h.fresh(starter);const stats={starter,regions:[],battles:0,actions:0,losses:0};
 async function fight(){const r=await win(h.api);stats.battles++;stats.actions+=r.turns;if(!r.won)stats.losses++;return r.won;}
 // Exercise actual bonding to fill the party, starting from the original newState.
 for(const spawn of [.35,.65]){h.random(()=>spawn);h.api.startEncounter();h.random(()=>0);h.api.openCapture('prism');await h.api.sealCapture();}
 h.random(h.api.Core.seeded(900+starter));
 for(let z=0;z<6;z++){s.zone=z;const start=stats.battles;
 for(let route=0;route<3;route++)for(let n=0;n<3;n++){const event=h.api.World.REGIONS[z].routes[route][n],id=`${z}:${route}:${n}`;
 if(event.kind!=='battle'){if(!h.api.completeStory(id,event.answer))throw Error('Blocked story '+id);continue;}
 let tries=0;while(!s.story.completed.includes(id)&&tries++<60){h.api.enterNode(id);await fight();}if(!s.story.completed.includes(id))throw Error('Blocked battle '+id);
 }
 while(!h.api.guardianReady(z)){h.api.startEncounter();await fight();}
 let won=false;for(let attempt=0;attempt<60&&!won;attempt++){h.api.startEncounter(true);won=await fight();if(!won)for(let t=0;t<5;t++){h.api.startEncounter();await fight();}}
 if(!won)throw Error('Blocked Guardian '+z);h.api.claimGuardian();stats.regions.push({region:z,battles:stats.battles-start,levels:s.kin.filter(k=>s.team.includes(k.uid)).map(k=>k.level),coins:s.coins,orbs:s.orbs,tonics:s.tonics});
 }
 if(s.badges.length!==6||!s.story.ending||s.story.completed.length!==54)throw Error('Incomplete campaign');return stats;
}
module.exports={campaign};
if(require.main===module)(async()=>{const results=[];for(let starter=0;starter<3;starter++)results.push(await campaign(starter));const report={generated:new Date().toISOString(),method:'Actual newState, two ordinary Prism bonds with controlled success rolls, then three unchanged party members through all 54 authored nodes. No artificial XP, HP, levels or coins. Failed battles retried and training recorded. Accelerated animations. All optional routes included.',limitation:'Action counts and deterministic test agents are not observed human playtime. The 8–12-hour target remains unmet and unverified. High retry counts identify progression problems.',results};fs.writeFileSync('wildkin/docs/campaign-results.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));})();
