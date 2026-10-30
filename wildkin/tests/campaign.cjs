const {boot,win}=require('./harness.cjs');const {walkAdventure}=require('./adventure-agent.cjs');const fs=require('node:fs');
async function campaign(starter,options={}){const h=await boot({seed:500+starter}),s=h.fresh(starter);const stats={starter,regions:[],battles:0,actions:0,losses:0};
 async function fight(){const r=await win(h.api);stats.battles++;stats.actions+=r.turns;if(!r.won)stats.losses++;return r.won;}
 // Exercise actual bonding to fill the party, starting from the original newState.
 for(const spawn of [.35,.65]){h.random(()=>spawn);h.api.startEncounter();h.random(()=>0);h.api.openCapture('prism');await h.api.sealCapture();}
 h.random(h.api.Core.seeded(900+starter));
 for(let z=0;z<6;z++){s.zone=z;const start=stats.battles;
 if(options.stories!==false)for(let route=0;route<3;route++)for(let n=0;n<3;n++){const event=h.api.World.REGIONS[z].routes[route][n],id=`${z}:${route}:${n}`;
 if(event.kind!=='battle'){if(!h.api.completeStory(id,event.answer))throw Error('Blocked story '+id);continue;}
 let tries=0;while(!s.story.completed.includes(id)&&tries++<60){h.api.enterNode(id);await fight();}if(!s.story.completed.includes(id))throw Error('Blocked battle '+id);
 }
 for(let r=0;r<(options.optional?3:2);r++)await walkAdventure(h,z,r,{optional:!!options.optional,approach:options.approach||'lower',metrics:stats});
 while(!h.api.guardianReady(z)){h.api.startEncounter();await fight();}
 let won=false;for(let attempt=0;attempt<60&&!won;attempt++){h.api.startEncounter(true);won=await fight();if(!won)for(let t=0;t<5;t++){h.api.startEncounter();await fight();}}
 if(!won)throw Error('Blocked Guardian '+z);h.api.claimGuardian();stats.regions.push({region:z,battles:stats.battles-start,levels:s.kin.filter(k=>s.team.includes(k.uid)).map(k=>k.level),coins:s.coins,orbs:s.orbs,tonics:s.tonics});
 }
 if(s.badges.length!==6||!s.story.ending||(options.stories!==false&&s.story.completed.length!==54))throw Error('Incomplete campaign');stats.storyNodes=s.story.completed.length;stats.relays=h.api.adventureCount(0)+h.api.adventureCount(1)+h.api.adventureCount(2)+h.api.adventureCount(3)+h.api.adventureCount(4)+h.api.adventureCount(5);stats.fieldRooms=Object.values(s.adventure.runs).reduce((n,run)=>n+run.cleared.length,0);if(options.optional){for(let z=0;z<6;z++)h.api.resolveFieldRequest(z,z%2);stats.requests=Object.keys(s.adventure.requests).length;}return stats;
}
module.exports={campaign};
if(require.main===module)(async()=>{const routes=[];for(const approach of ['upper','lower'])for(let starter=0;starter<3;starter++)routes.push({approach,...await campaign(starter,{approach,stories:false})});const completionist=await campaign(0,{optional:true,stories:true});const report={generated:new Date().toISOString(),build:'3.0.0-dev.2',method:'Six clean main campaigns: every starter through either direct encounters or puzzle approaches, plus one completionist campaign including all 18 field routes, 54 optional stories and six requests. Actual newState and two ordinary starter bonds, no injected levels, HP, XP or coins. Battles use a simple tactical policy; puzzle agent uses deterministic hints. Animations accelerated.',limitation:'This establishes traversal and progression, not observed human enjoyment or 8–12-hour pacing. Action and room counts cannot establish a human completion time.',routes,completionist};fs.writeFileSync('wildkin/docs/campaign-results.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({routes:routes.map(({starter,approach,battles,actions,losses,relays,fieldRooms,puzzleMoves=0})=>({starter,approach,battles,actions,losses,relays,fieldRooms,puzzleMoves})),completionist},null,2));})();
