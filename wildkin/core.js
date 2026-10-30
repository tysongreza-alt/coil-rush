/* Wildkin domain rules. Original code, no runtime dependencies. */
(function(root,factory){const api=factory(typeof module==='object'&&module.exports?require('./adventures.js'):root.WildkinAdventures);if(typeof module==='object'&&module.exports)module.exports=api;else root.WildkinCore=api;})(typeof globalThis!=='undefined'?globalThis:this,function(Adventures){
'use strict';
const BUILD='3.0.0-dev.3',SCHEMA=5;
const BASE_LEVELS=[5,11,17,23,29,35],GUARDIAN_LEVELS=[9,15,21,27,33,40];
const PASSIVES=[
 ['Verdant care','Guard restores 10% HP.','rest',.10],['First spark','First attack deals 25% more damage.','opener',.25],['River shelter','First incoming hit is 30% weaker.','shell',.30],['Honey reserve','Gain one energy after every third attack.','battery',3],['Patient stone','After guarding, the next attack is 25% stronger.','patient',.25],
 ['Night hunter','Deal 20% more damage to weakened foes.','afflict',.20],['Pack lantern','On switching in, shield 25% of the next hit.','entry',.25],['Canopy shade','Guard restores 8% HP and one extra energy.','rest',.08],['Spore roots','Signatures heal 6% HP.','siphon',.06],['Dream anchor','Under half HP, attacks deal 15% more.','resolve',.15],
 ['Living reef','Every incoming hit is 8% weaker.','armor',.08],['Slipstream','After switching in, next attack is 30% stronger.','entryhit',.30],['Coral chorus','Guard restores 12% HP.','rest',.12],['Rising tide','Burst deals 18% more damage.','burst',.18],['Veil dance','Weakened foes deal another 15% less damage.','mist',.15],
 ['Hot core','First attack deals 35% more damage.','opener',.35],['Spring step','Gain one energy after every second attack.','battery',2],['Glass edge','Deal 25% more damage to weakened foes.','afflict',.25],['Warm embrace','Signatures heal 9% HP.','siphon',.09],['Static veil','Under half HP, incoming damage is 18% weaker.','lowarmor',.18],
 ['Storm chase','Burst deals 22% more damage.','burst',.22],['Cloud cushion','First incoming hit is 40% weaker.','shell',.40],['Root capacitor','Guard grants one extra energy.','capacitor',1],['Weather eye','After guarding, next attack is 30% stronger.','patient',.30],['Sky current','Every third attack gains one energy.','battery',3],
 ['Starlight care','Guard restores 14% HP.','rest',.14],['Rune insight','Deal 30% more damage to weakened foes.','afflict',.30],['Orb momentum','On switching in, next attack is 35% stronger.','entryhit',.35],['Moon resolve','Under half HP, attacks deal 22% more.','resolve',.22],['Comet trail','First attack deals 40% more damage.','opener',.40]
];
const GUARDIANS=[
 {name:'Root rhythm',cycle:['strike','root','charge','heavy'],hint:'Root pulse weakens your next two attacks. Guard the charged slam.'},
 {name:'Echo mirror',cycle:['mirror','strike','charge','heavy'],hint:'The mirror halves repeated moves. Alternate attacks or Guard.'},
 {name:'Tidal rhythm',cycle:['ward','strike','charge','heavy'],hint:'The tide shield reduces attacks. Use its ward turn to build energy.'},
 {name:'Molten rhythm',cycle:['charge','heavy','recover','strike'],hint:'Guard the eruption; strike while the core cools.'},
 {name:'Storm rhythm',cycle:['strike','charge','heavy','drain'],hint:'Static drains energy. Save enough for a decisive burst.'},
 {name:'Starlight rhythm',cycle:['mirror','charge','heavy','recover','drain'],hint:'Adapt to reflection, charge, recovery and energy drain.'}
];
const INTENTS={strike:['Quick strike','An ordinary attack.'],root:['Root pulse','An attack that weakens your next two attacks.'],charge:['Gathering power','No attack this turn. A heavy hit follows.'],heavy:['Charged strike','A powerful incoming hit. Guard or shield now.'],mirror:['Mirror stance','Repeated attacks are reflected into a protective shield.'],ward:['Protective ward','Incoming damage is reduced by 55% this turn.'],recover:['Recovering','Restores 12% HP. A chance to prepare.'],drain:['Static pulse','An attack that removes one energy.']};
function seeded(seed){let a=seed>>>0;return()=>{a+=0x6D2B79F5;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};}
function validVersion(v){return /^\d+\.\d+\.\d+(?:-[a-z0-9.]+)?$/i.test(v||'');}
function newerVersion(a,b){if(!validVersion(a)||!validVersion(b))return false;const av=a.split('-')[0].split('.').map(Number),bv=b.split('-')[0].split('.').map(Number);for(let i=0;i<3;i++)if(av[i]!==bv[i])return av[i]>bv[i];const ap=a.split('-')[1],bp=b.split('-')[1];if(!ap||!bp)return !!bp&&!ap;const aa=ap.split('.'),bb=bp.split('.');for(let i=0;i<Math.max(aa.length,bb.length);i++){if(aa[i]===bb[i])continue;if(aa[i]===undefined)return false;if(bb[i]===undefined)return true;return /^\d+$/.test(aa[i])&&/^\d+$/.test(bb[i])?Number(aa[i])>Number(bb[i]):aa[i]>bb[i];}return false;}

const int=(v,min,max)=>Number.isSafeInteger(v)&&v>=min&&v<=max;
const obj=v=>v&&typeof v==='object'&&!Array.isArray(v);
const insist=(ok,msg)=>{if(!ok)throw new Error(msg);};
function normalize(input){
 insist(obj(input),'Missing save data');const a=JSON.parse(JSON.stringify(input));
 insist(a.version===1,'Unsupported save version');insist(!a.schema||int(a.schema,1,SCHEMA),'Unsupported save schema');
 insist(Array.isArray(a.kin)&&a.kin.length>0,'Collection is empty');const ids=new Set();
 for(const k of a.kin){
  insist(obj(k)&&int(k.sp,0,29)&&int(k.level,1,60),'Invalid companion');
  insist(typeof k.uid==='string'&&k.uid.length>0&&k.uid.length<=70&&!ids.has(k.uid),'Invalid or duplicate companion ID');ids.add(k.uid);
  insist(typeof k.evo==='boolean'&&typeof k.aurora==='boolean','Invalid companion form');
  insist(int(k.hp,0,40+k.level*5+(k.evo?22:0)+(k.aurora?3:0))&&int(k.xp,0,100000),'Invalid companion stats');
  k.xp=k.level===60?0:Math.min(k.xp,24+k.level*12-1);
  k.nickname=typeof k.nickname==='string'?k.nickname.slice(0,18):'';
  if(k.guardianZone!==undefined)insist(int(k.guardianZone,0,5),'Invalid Guardian');
 }
 insist(Array.isArray(a.team)&&a.team.length>=1&&a.team.length<=3&&new Set(a.team).size===a.team.length&&a.team.every(id=>ids.has(id)),'Invalid party');
 insist(Array.isArray(a.badges)&&new Set(a.badges).size===a.badges.length&&a.badges.every(z=>int(z,0,5)),'Invalid seals');
 insist(Array.isArray(a.wins)&&a.wins.length===6&&a.wins.every(n=>int(n,0,1e9)),'Invalid region wins');
 for(const key of ['coins','orbs','prisms','tonics','totalWins','totalCatches','totalSearches','totalBursts'])insist(int(a[key],0,1e12),'Invalid '+key);
 insist(int(a.zone,0,5),'Invalid region');
 for(const key of ['seen','caught'])insist(Array.isArray(a[key])&&a[key].every(v=>typeof v==='string'&&/^(?:[0-9]|[12][0-9]):[01]$/.test(v)),'Invalid KinDex');
 for(const k of a.kin){const form=k.sp+':'+Number(k.evo);if(!a.caught.includes(form))a.caught.push(form);if(!a.seen.includes(form))a.seen.push(form);}
 a.adventure=Adventures.normalize(a.adventure);
 a.schema=SCHEMA;a.screen=['explore','team','dex','camp','research','expedition','arena','habitat'].includes(a.screen)?a.screen:'explore';
 a.battled=Array.isArray(a.battled)?a.battled.filter(v=>int(v,0,29)):[];
 a.teamPresets=Array.isArray(a.teamPresets)?a.teamPresets.filter(p=>Array.isArray(p)).map(p=>[...new Set(p.filter(id=>ids.has(id)))].slice(0,3)).filter(p=>p.length).slice(-4):[];
 for(const key of ['research','trailSpot','trailVisits','story','achievements','hunt','equipment'])if(!obj(a[key]))a[key]={};
 for(const [key,r] of Object.entries(a.research))insist(/^\d+$/.test(key)&&Number(key)<30&&obj(r)&&Object.values(r).every(v=>int(v,0,1e9)),'Invalid research');
 for(const [key,n] of Object.entries(a.trailVisits))insist(/^[0-5]:[0-2]$/.test(key)&&int(n,0,1e9),'Invalid trail record');
 for(const [key,n] of Object.entries(a.trailSpot))insist(/^[0-5]$/.test(key)&&int(n,0,2),'Invalid trail selection');
 a.story.completed=Array.isArray(a.story.completed)?[...new Set(a.story.completed.filter(v=>typeof v==='string'&&/^[0-5]:[0-2]:[0-3]$/.test(v)))]:[];
 a.story.choices=obj(a.story.choices)?Object.fromEntries(Object.entries(a.story.choices).filter(([k,v])=>/^[0-5]:[0-2]:[0-3]$/.test(k)&&int(v,0,3))):{};
 a.story.ending=!!a.story.ending;a.story.tutorial=!!a.story.tutorial;
 a.story.journal=Array.isArray(a.story.journal)?a.story.journal.filter(x=>typeof x==='string').slice(-200):[];
 for(const key of Object.keys(a.achievements))if(a.achievements[key]!==true)delete a.achievements[key];
 for(const key of Object.keys(a.hunt))insist(/^[0-5]$/.test(key)&&int(a.hunt[key],0,10000),'Invalid hunt');
 for(const key of Object.keys(a.equipment))insist(ids.has(key)&&['none','vital','power','ward'].includes(a.equipment[key]),'Invalid equipment');
 a.arenaWins=int(a.arenaWins,0,1e9)?a.arenaWins:0;
 a.arenaTier=int(a.arenaTier,0,3)?a.arenaTier:0;
 a.arenaMedals=Array.isArray(a.arenaMedals)?a.arenaMedals.filter(n=>int(n,0,3)):[];
 a.expeditionRecords=obj(a.expeditionRecords)?a.expeditionRecords:{};for(const [key,r] of Object.entries(a.expeditionRecords))insist(/^[0-5]:[0-2]$/.test(key)&&obj(r)&&int(r.wins,1,1e9)&&int(r.best,0,100000),'Invalid expedition record');
 a.habitat=int(a.habitat,0,3)?a.habitat:0;
 a.decor=Array.isArray(a.decor)?a.decor.filter(n=>int(n,0,5)).slice(0,6):[];
 a.affection=obj(a.affection)?a.affection:{};for(const [id,n] of Object.entries(a.affection))insist(ids.has(id)&&int(n,0,1e9),'Invalid companion memories');
 if(!obj(a.daily)||typeof a.daily.day!=='string'||!obj(a.daily.progress)||!Array.isArray(a.daily.claimed)||!Object.values(a.daily.progress).every(n=>int(n,0,1e9)))delete a.daily;
 else a.daily.claimed=a.daily.claimed.filter(id=>['search','win','catch'].includes(id));
 a.settings={speed:[1,1.5,2].includes(a.settings?.speed)?a.settings.speed:1,reduced:!!a.settings?.reduced,hints:a.settings?.hints!==false,music:!!a.settings?.music};
 a.sound=a.sound!==false;
 // No unfinished combat is serialized. An interrupted run keeps only secured loot.
 if(a.expedition){const e=a.expedition;insist(obj(e)&&int(e.step,0,6)&&int(e.loot,0,100000)&&int(e.supplies??5,0,8),'Invalid expedition');e.supplies=e.supplies??5;e.seed=int(e.seed,0,0xffffffff)?e.seed:1;e.last=typeof e.last==='string'?e.last:'Expedition resumed.';if(e.pending){e.loot=0;e.step=Math.max(0,e.step-1);e.last='The encounter was interrupted. Your companions recovered, but the unsecured haul was lost.';}e.pending=false;e.zone=int(e.zone,0,5)?e.zone:a.zone;e.difficulty=int(e.difficulty,0,2)?e.difficulty:0;e.level=int(e.level,1,60)?e.level:Math.max(...a.team.map(id=>a.kin.find(k=>k.uid===id).level));e.boons={shield:int(e.boons?.shield,0,3)?e.boons.shield:0,energy:int(e.boons?.energy,0,3)?e.boons.energy:0};e.last=String(e.last).slice(0,500);}
 a.revision=int(a.revision,0,1e12)?a.revision:0;a.writerId=typeof a.writerId==='string'?a.writerId.slice(0,100):'';a.updatedAt=Number.isFinite(a.updatedAt)?a.updatedAt:0;return a;
}
function backup(data){const clean=normalize(data);return JSON.stringify({game:'WILDKIN',format:2,saved:new Date().toISOString(),data:clean},null,2);}
function restore(text){const raw=JSON.parse(text);insist(raw.game==='WILDKIN'&&(!raw.format||raw.format<=2),'Not a supported Wildkin backup');return normalize(raw.data);}
function researchRank(r={}){return Number((r.seen||0)>=1)+Number((r.won||0)>=3)+Number((r.caught||0)>=1)+Number((r.evolved||0)>=1);}
function intent(b,foe){if(foe.aiCycle)return foe.aiCycle[(b.turn||0)%foe.aiCycle.length];if(b.boss)return GUARDIANS[b.region??0].cycle[(b.turn||0)%GUARDIANS[b.region??0].cycle.length];const style=foe.sp%5;return [ ['strike','charge','heavy'],['ward','strike','strike'],['root','strike','recover'],['strike','drain','strike'],['mirror','charge','heavy'] ][style][(b.turn||0)%3];}
function damage({attacker,defender,kind='strike',mult=1,roll=1,guard=1,weak=1,bonus=1}){const p=11+attacker.level*2+(attacker.evo?8:0),d=6+Math.floor(defender.level*1.2)+(defender.evo?5:0);const base={strike:12,signature:17,heavy:24,burst:28}[kind]||12;const scale=kind==='burst'?1.25:kind==='strike'?.83:1.05;return Math.max(3,Math.floor((base+p*scale-d*.45)*mult*roll*guard*weak*bonus));}
return {BUILD,SCHEMA,BASE_LEVELS,GUARDIAN_LEVELS,PASSIVES,GUARDIANS,INTENTS,seeded,normalize,backup,restore,researchRank,intent,damage,validVersion,newerVersion};
});
