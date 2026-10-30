(()=>{'use strict';
const KEY='wildkin-save-v1',VERSION=1,APP_VERSION=WildkinCore.BUILD,ROOT=document.getElementById('app');
const Core=WildkinCore,World=WildkinWorld;
let resetInProgress=false,updateRegistration=null,updateRequested=false,storageConflict=false;let saveGeneration='legacy';const unreadableSaves=[];
let updateStatus='ready',updateMessage='';
const ELEMENTS={leaf:{name:'Grove',color:'#9fe1a1',icon:'🌿',beats:'tide'},flame:{name:'Ember',color:'#ffb17c',icon:'🔥',beats:'leaf'},tide:{name:'Tide',color:'#80d5f8',icon:'💧',beats:'flame'},spark:{name:'Storm',color:'#f8df82',icon:'⚡',beats:'tide'},stone:{name:'Stone',color:'#dcc6a6',icon:'⛰️',beats:'spark'},lunar:{name:'Lunar',color:'#cfb3ff',icon:'🌙',beats:'stone'}};
const ZONES=[
 {name:'Sunleaf Meadow',short:'Meadow',hint:'The adventure begins',icon:'🌱',sky1:'#9bcfd3',sky2:'#70b79a',hill:'#529e74',ground:'#32634f',guardian:'The Rootkeeper',lore:'A sunny home for young wanderers.'},
 {name:'Whisperwood',short:'Wood',hint:'One meadow seal',icon:'🍄',sky1:'#596e98',sky2:'#3f7480',hill:'#3e7571',ground:'#294c5e',guardian:'The Hollow Watcher',lore:'Strange lights dance under ancient trees.'},
 {name:'Coral Crossing',short:'Coast',hint:'Two meadow seals',icon:'🐚',sky1:'#86ccdc',sky2:'#539eaa',hill:'#318d98',ground:'#2b6573',guardian:'The Tidal Crown',lore:'Shell-strewn shores hide wandering kin.'},
 {name:'Emberfall Ridge',short:'Ridge',hint:'Three meadow seals',icon:'🌋',sky1:'#d9928f',sky2:'#a05c72',hill:'#8c5265',ground:'#563e52',guardian:'The Molten Heart',lore:'Cinders glow beneath the crimson cliffs.'},
 {name:'Stormglass Peaks',short:'Peaks',hint:'Four meadow seals',icon:'⛈️',sky1:'#7faabf',sky2:'#657fa8',hill:'#647d8d',ground:'#3e516d',guardian:'The Storm Herald',lore:'A world above the clouds crackles with life.'},
 {name:'Starlit Sanctuary',short:'Stars',hint:'Five meadow seals',icon:'✨',sky1:'#313b78',sky2:'#55467c',hill:'#504273',ground:'#302c56',guardian:'The Starbound One',lore:'Ancient trails meet in a sea of stars.'}
];
// Each creature has a unique base identity and evolved identity. Six regions, five families each.
const TRAILS=[[["Sunlit Path","🌻","Friendly creatures wander the flowering grass."],["Crystal Brook","💦","Follow sparkling water to find unusual visitors."],["Mossy Hollow","🌳","A shaded trail where rare Wildkin sometimes hide."]],[["Mushroom Ring","🍄","Gentle lights float above the ancient mushrooms."],["Echo Glade","🦉","Listen for cries from elusive woodland creatures."],["Whisper Ruins","🏛️","An abandoned stone circle holds rare encounters."]],[["Shell Beach","🐚","Walk the shoreline where curious Wildkin gather."],["Tidal Pools","🪸","Investigate colorful pools after the tide retreats."],["Wreck Cove","⚓","An old shipwreck shelters shy and unusual kin."]],[["Warm Springs","♨️","Steam rises from calm pools at the ridge base."],["Ember Tunnel","🔥","Follow glowing rocks deeper into the mountainside."],["Obsidian Gate","🪨","Brave the black-glass gate for rare discoveries."]],[["Cloud Steps","☁️","Take an easy trail above the swirling clouds."],["Thunder Bridge","⚡","The air crackles with unexpected encounters."],["Sky Shrine","⛩️","An ancient shrine attracts uncommon mountain kin."]],[["Moon Garden","🌙","Soft starlight illuminates the sanctuary flowers."],["Astral Library","📚","Old star charts reveal signs of magical visitors."],["Fallen Comet","☄️","Explore the crater where extraordinary kin appear."]]];
const TRAIL_RARITY_WEIGHTS=[[.72,.23,.05],[.35,.5,.15],[.23,.37,.4]];
const ROWS=[
 ['Mosslet','Thornook','leaf','fox',0,'#79d99c','#2e947a',0],['Flintail','Cindervulp','flame','fox',0,'#ffc078','#e87953',0],['Brookit','Rivulotl','tide','frog',0,'#86d6f7','#498cbd',0],['Bumbloom','Honeybriar','leaf','bug',0,'#f6ce77','#9bc36e',1],['Pebblin','Rockhart','stone','rock',0,'#d6beac','#8b8196',2],
 ['Duskit','Noctuff','lunar','fox',1,'#b4a4f5','#6551a7',0],['Glimpup','Lumihound','spark','fox',1,'#f6da8e','#b7a9dc',0],['Fernix','Canopyx','leaf','bird',1,'#b2e7b0','#3ba58c',1],['Shroomble','Sporelord','stone','frog',1,'#f0afa0','#aa7aaf',1],['Wispette','Phantomelle','lunar','jelly',1,'#c3b4f8','#8d83c3',2],
 ['Shellip','Tortidal','stone','turtle',2,'#b6d8cf','#7caaa2',0],['Finfizz','Currentail','tide','fish',2,'#8fdcf3','#4b9dba',0],['Coralyn','Reefara','leaf','jelly',2,'#ffa5a3','#dd719f',1],['Sprayfin','Tsunafang','tide','dragon',2,'#a4e7ea','#5592ca',1],['Mistmoth','Veilmoth','lunar','moth',2,'#d9caf9','#9284c2',2],
 ['Coalbit','Volcador','flame','rock',3,'#ffb16c','#c95f4f',0],['Ashhopper','Pyrohopper','flame','bunny',3,'#f9c284','#eb7855',0],['Basalisk','Obsidrake','stone','dragon',3,'#ada7ba','#6a697f',1],['Smolderoo','Blazeroo','flame','fox',3,'#f9a36e','#b75d75',1],['Cindermite','Infermite','spark','bug',3,'#edc78f','#bb7282',2],
 ['Voltkit','Thunderlynx','spark','fox',4,'#ffdd7d','#cfb36b',0],['Cloudleap','Skyrunner','lunar','bird',4,'#c5d8f2','#859ac3',0],['Zapling','Boltroot','spark','plant',4,'#bfe4a3','#88b174',1],['Stormite','Tempestra','tide','dragon',4,'#9ed4e5','#638fbc',1],['Crackluna','Voltwhale','spark','fish',4,'#d2e2e3','#86a7cb',2],
 ['Astroling','Cosmara','lunar','jelly',5,'#b4acf8','#7d8ed1',0],['Runefox','Hexavulp','lunar','fox',5,'#caa8f1','#8b70c7',0],['Orblet','Nebulorb','spark','jelly',5,'#f2d9a0','#a9a2eb',1],['Moonhare','Lunastride','lunar','bunny',5,'#d2cdf8','#a7a0ce',1],['Stardrift','Cometwing','flame','moth',5,'#f5b8b2','#ca84d2',2]
];
const SPEC=ROWS.map(([name,evolved,type,shape,zone,primary,secondary,rarity],id)=>({id,name,evolved,type,shape,zone,primary,secondary,rarity}));
const rarities=['Common','Uncommon','Rare'];
const SIGNATURES=[["Vine Spiral","heal","Healer"],["Cinder Rush","heavy","Striker"],["Bubble Waltz","shield","Defender"],["Pollen Pulse","weaken","Disruptor"],["Boulder Roll","heavy","Striker"],["Night Flutter","stagger","Trickster"],["Spark Leap","charge","Charger"],["Canopy Veil","shield","Defender"],["Spore Cloud","weaken","Disruptor"],["Dream Drift","heal","Healer"],["Shell Current","shield","Defender"],["Jet Stream","charge","Charger"],["Reef Song","heal","Healer"],["Tidal Break","heavy","Striker"],["Moon Haze","stagger","Trickster"],["Magma Crash","heavy","Striker"],["Ember Hop","charge","Charger"],["Shard Rend","weaken","Disruptor"],["Flame Ribbon","heal","Healer"],["Static Smog","stagger","Trickster"],["Thunder Pounce","heavy","Striker"],["Sky Aegis","shield","Defender"],["Root Circuit","charge","Charger"],["Typhoon Slice","weaken","Disruptor"],["Arc Flash","stagger","Trickster"],["Nova Blessing","heal","Healer"],["Hex Mark","weaken","Disruptor"],["Stardust Dash","charge","Charger"],["Eclipse Veil","shield","Defender"],["Comet Dive","heavy","Striker"]];
const SIGNATURE_DESCRIPTIONS={heal:'Elemental attack; heals 30% of the damage dealt.',heavy:'Powerful elemental attack, stronger after evolution.',shield:'Damage plus a shield blocking 42% of the next hit.',weaken:'Damage plus 18% weaker enemy attacks for two turns.',stagger:'Damage plus a 35% chance to interrupt the enemy next turn.',charge:'Damage plus 1 energy restored after the attack.'};
const signatureOf=k=>SIGNATURES[k.sp]||SIGNATURES[0];
const signatureBlurb=k=>{const [name,effect,role]=signatureOf(k);return name+' · '+role+' · '+SIGNATURE_DESCRIPTIONS[effect]};

const esc=x=>String(x??'').replace(/[&<>"']/g,s=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
const rand=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const pick=a=>a[Math.floor(Math.random()*a.length)];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const dstr=()=>{const d=new Date();return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`};
let uidCounter=0;const ownId=()=>`${Date.now().toString(36)}-${(++uidCounter).toString(36)}-${Math.random().toString(36).slice(2,9)}`;
const SESSION_ID=ownId();
const hpMax=k=>40+k.level*5+(k.evo?22:0)+(k.aurora?3:0);
const power=k=>11+k.level*2+(k.evo?8:0);
const defense=k=>6+Math.floor(k.level*1.2)+(k.evo?5:0);
const expNeed=level=>24+level*12;
const nameOf=k=>k?.nickname||SPEC[k?.sp]?.[k?.evo?'evolved':'name']||'Unknown';
const typeLabel=t=>`<span class="type" style="--typecolor:${ELEMENTS[t].color}">${ELEMENTS[t].icon} ${ELEMENTS[t].name}</span>`;
let state=null,battle=null,modal=null,capture=null,chosenStarter=0,kinFilter='all',dexZone='all',toastTimer,encounterTimer;
let vaultView='reserve',vaultPage=0,vaultQuery='',vaultSort='level';const VAULT_PAGE_SIZE=24;
function newState(starter){const k=makeKin(starter,5,false);return{version:VERSION,screen:'explore',zone:0,coins:230,orbs:9,prisms:2,tonics:3,kin:[k],team:[k.uid],seen:[`${starter}:0`],caught:[`${starter}:0`],badges:[],wins:[0,0,0,0,0,0],totalWins:0,totalCatches:1,totalSearches:0,totalBursts:0,lastHeal:0,battled:[],sound:true,daily:{day:dstr(),progress:{},claimed:[]}}}
function makeKin(sp,level,aurora=false,evo=false){const k={uid:ownId(),sp,level:clamp(level,1,60),xp:0,evo,aurora:!!aurora,hp:1,nickname:''};k.hp=hpMax(k);return k}
function load(){try{const raw=localStorage.getItem(KEY);if(!raw)return null;try{return Core.normalize(JSON.parse(raw))}catch(error){unreadableSaves.push({source:'fallback',raw});return null}}catch{return null}}

let vaultDbPromise=null,vaultWriteQueue=Promise.resolve(),storageAlerted=false;
function openVaultDb(){
 if(vaultDbPromise)return vaultDbPromise;
 vaultDbPromise=new Promise(resolve=>{
  if(!window.indexedDB){resolve(null);return}
  try{
   const req=window.indexedDB.open('wildkin-creature-vault',1);
   req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains('progress'))req.result.createObjectStore('progress')};
   req.onsuccess=()=>resolve(req.result);
   req.onerror=()=>resolve(null);
   req.onblocked=()=>resolve(null);
  }catch{resolve(null)}
 });
 return vaultDbPromise;
}
async function readVaultDb(){
 const db=await openVaultDb();if(!db)return null;
 return new Promise(resolve=>{
  try{
   const req=db.transaction('progress','readonly').objectStore('progress').get(KEY);
   req.onsuccess=()=>{try{const data=typeof req.result==='string'?JSON.parse(req.result):req.result;resolve(data?Core.normalize(data):null)}catch{unreadableSaves.push({source:'vault',raw:typeof req.result==='string'?req.result:JSON.stringify(req.result)});resolve(null)}};
   req.onerror=()=>resolve(null);
  }catch{resolve(null)}
 });
}
async function writeVaultDb(snapshot){
 const db=await openVaultDb();if(!db)return false;
 return new Promise(resolve=>{
  try{
   const tx=db.transaction('progress','readwrite');
   tx.objectStore('progress').put(snapshot,KEY);
   tx.oncomplete=()=>resolve(true);tx.onerror=()=>resolve(false);tx.onabort=()=>resolve(false);
  }catch{resolve(false)}
 });
}

function save(){
 if(!state||resetInProgress||storageConflict)return;
 try{const generation=localStorage.getItem(KEY+'-generation')||'legacy',raw=localStorage.getItem(KEY),latest=raw?JSON.parse(raw):null;if(generation!==saveGeneration||(latest?.writerId!==SESSION_ID&&((latest?.revision||0)>(state.revision||0)||(latest?.updatedAt||0)>(state.updatedAt||0)))){storageConflict=true;toast('Another window changed this adventure. Export this copy, then load the latest save.');return}}catch{}
 state.revision=(state.revision||0)+1;state.writerId=SESSION_ID;
 state.schema=Core.SCHEMA;state.updatedAt=Date.now();
 const snapshot=JSON.stringify(state);let localSaved=true;
 try{localStorage.setItem(KEY,snapshot)}catch{localSaved=false}
 vaultWriteQueue=vaultWriteQueue.catch(()=>{}).then(()=>writeVaultDb(snapshot)).then(ok=>{
  if(!ok&&!localSaved&&!storageAlerted){storageAlerted=true;toast('Device storage is full. Export a backup in Camp to protect your collection.')}
 }).catch(()=>{});
}
function dailyCheck(){if(!state)return;if(!state.daily||state.daily.day!==dstr())state.daily={day:dstr(),progress:{},claimed:[]};}
function activity(type,n=1){dailyCheck();state.daily.progress[type]=(state.daily.progress[type]||0)+n}
function dailyQuests(){const d=new Date(),seed=Math.floor(d.getTime()/86400000),search=[3,5,8][seed%3],wins=[2,3,4][(seed+1)%3],catches=[1,2,3][(seed+2)%3];return[{id:'search',title:search>=8?'Trailblazer':'Follow the footprints',desc:`Search the wilds ${search} times`,need:search,reward:60+search*9,icon:'👣'}, {id:'win',title:wins>=4?'Battle champion':'Battle practice',desc:`Win ${wins} wild battles`,need:wins,reward:65+wins*25,icon:'⚔️'}, {id:'catch',title:catches>=3?'Creature caretaker':'New friendships',desc:`Capture ${catches} Wildkin`,need:catches,reward:95+catches*38,icon:'💚'}]}
function tier(){return 1+Math.floor((state.totalWins+state.totalCatches)/7)}
function unlocked(z){return z===0||state.badges.includes(z-1)}
function teamKin(){return state.team.map(id=>state.kin.find(k=>k.uid===id)).filter(Boolean)}
function currentKin(){return teamKin().find(k=>k.hp>0)}
function zoneSpecies(z){return SPEC.filter(s=>s.zone===z)}
function toast(msg){const el=document.getElementById('toast');el.textContent=msg;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2700)}
function sound(freq=440,duration=.09,kind='sine'){if(!state?.sound)return;try{const ctx=window.__wildAudio||(window.__wildAudio=new(window.AudioContext||window.webkitAudioContext)());const osc=ctx.createOscillator(),gain=ctx.createGain();osc.type=kind;osc.frequency.setValueAtTime(freq,ctx.currentTime);osc.frequency.exponentialRampToValueAtTime(freq*.8,ctx.currentTime+duration);gain.gain.setValueAtTime(.055,ctx.currentTime);gain.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+duration);osc.connect(gain).connect(ctx.destination);osc.start();osc.stop(ctx.currentTime+duration)}catch{}}

function kinDetail(k){
 const s=SPEC[k.sp],p=k.aurora?'#c4a8ff':s.primary,q=k.aurora?'#83e9e8':s.secondary,e=!!k.evo;
 const motif={
 leaf:`<path d="M100 89q-25-12-13-32 18 0 13 32Zm0 0q25-12 13-32-18 0-13 32Z" fill="#ecffb5" stroke="#376956" stroke-width="2"/><path d="M100 59v33" stroke="#376956" stroke-width="2"/>`,
 flame:`<path d="M99 52q-19 21-8 34-3-11 10-16-2 13 11 14 9-20-9-32-1 11-4 0Z" fill="#ffe5a8" stroke="#ad5d4b" stroke-width="2"/>`,
 tide:`<path d="M99 55Q78 79 91 88q12 9 21-1 8-13-13-32Z" fill="#b7f8ff" stroke="#447f9e" stroke-width="2"/><path d="m91 80 5-9" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`,
 spark:`<path d="m107 53-19 22 12-1-5 18 22-27-13 2Z" fill="#fff4ae" stroke="#96774c" stroke-width="2"/>`,
 stone:`<path d="m98 56-14 20 15 14 16-14-17-20Z" fill="#eff1e5" opacity=".9" stroke="#66717a" stroke-width="2"/><path d="m99 57 0 32m-15-13 30 0" stroke="#879baa" stroke-width="2" opacity=".8"/>`,
 lunar:`<path d="M106 57A18 18 0 1 0 113 87 17 17 0 1 1 106 57Z" fill="#f8e6ff"/><path d="m126 54 3 7 7 3-7 3-3 7-3-7-7-3 7-3Z" fill="#f7f2ad"/>`
 }[s.type];
 const unique=s.id%4;
 const marks=unique===0?`<path d="m57 135 14 6m58 0 14-6" stroke="${q}" stroke-width="5" opacity=".7" stroke-linecap="round"/>`:unique===1?`<circle cx="56" cy="139" r="4" fill="#fff" opacity=".7"/><circle cx="143" cy="139" r="4" fill="#fff" opacity=".7"/>`:unique===2?`<path d="m47 133 11-9 9 9m65 0 10-9 9 9" stroke="${q}" stroke-width="4" opacity=".8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`:`<path d="M54 123q16 9 24 24m68-24q-16 9-24 24" stroke="#fff8df" opacity=".5" stroke-width="3" fill="none"/>`;
 const extras={
 fox:`<path d="M48 106q-19-13-15-26 21 4 29 16M151 106q19-13 15-26-21 4-29 16" fill="${q}" stroke="#29414b" stroke-width="3"/><path d="M56 113q-19-2-22 9 12 10 26 5m86-14q19-2 22 9-12 10-26 5" fill="${p}" opacity=".85"/>`,
 bunny:`<path d="M63 167q-25 15-7 19h21l11-20m24 0 11 20h21q18-4-7-19" fill="${q}" stroke="#26424a" stroke-width="3"/>`,
 frog:`<circle cx="59" cy="101" r="6" fill="${q}"/><circle cx="142" cy="101" r="6" fill="${q}"/><path d="M68 157q-18 22-27 8m93-8q18 22 27 8" stroke="${q}" stroke-width="8" fill="none" stroke-linecap="round"/>`,
 bird:`<path d="M88 123q12 10 24 0l-12 16Z" fill="#f8e49e" stroke="#a17562" stroke-width="2"/><path d="m46 120 30 28m78-28-30 28" stroke="${q}" stroke-width="7" stroke-linecap="round"/>`,
 dragon:`<path d="m54 148 18 0 4 13m51-13h18l-4 13" stroke="${q}" stroke-width="7" fill="none"/><path d="m48 125 12-12 12 12m54 0 12-12 12 12" fill="none" stroke="#ffffff77" stroke-width="3"/>`,
 turtle:`<path d="M51 143q49-25 97 0M66 97l68 63" stroke="#ffffff52" stroke-width="4" fill="none"/><circle cx="100" cy="155" r="8" fill="${q}"/>`,
 rock:`<path d="m73 94 17-13 14 10-8 13m29 11 19-8-8 20" fill="none" stroke="#f6f1e9" opacity=".35" stroke-width="4"/>`,
 fish:`<path d="M60 132q36 21 76 0M69 148q30 18 59 1" fill="none" stroke="#fff7d7" stroke-width="4" opacity=".38"/><path d="m145 75 19-15 2 33" fill="${p}"/>`,
 moth:`<circle cx="33" cy="115" r="12" fill="#fff4c2" opacity=".45"/><circle cx="169" cy="115" r="12" fill="#fff4c2" opacity=".45"/>`,
 bug:`<path d="m55 144-23 19m37-13-18 26m93-32 23 19m-37-13 18 26" stroke="${q}" stroke-width="6" stroke-linecap="round"/>`,
 plant:`<path d="M67 52q-16-19-22-23m91 23q16-19 22-23" stroke="#fff9c1" stroke-width="3" opacity=".7" fill="none"/>`,
 jelly:`<path d="M55 151q-9 23-16 30m32-24q-3 26-12 30m78-30q3 26 12 30m-12-36q9 23 16 30" stroke="${q}" stroke-width="6" stroke-linecap="round" fill="none"/>`
 }[s.shape]||'';
 return `<ellipse cx="80" cy="89" rx="26" ry="13" fill="#fff" opacity=".12" transform="rotate(-27 80 89)"/>${extras}<path d="M66 155q32 16 66 0" stroke="#fff" stroke-width="3" opacity=".20" stroke-linecap="round" fill="none"/>${marks}${motif}${e?`<path d="m38 87-12-8 5 17m133-9 12-8-5 17" fill="${q}" stroke="#ffffff65" stroke-width="2"/>`:''}`;
}

function evolvedArt(k){
 if(!k.evo)return '';
 const s=SPEC[k.sp],q=k.aurora?'#a8f8ee':s.secondary,p=k.aurora?'#e9c7ff':s.primary,kind=signatureOf(k)[1],v=k.sp%5;
 const extras=[
  `<path d="M28 123Q4 98 22 74Q39 79 53 116 M170 123q27-24 6-49-18 9-29 42" fill="${q}" stroke="#ffffff64" stroke-width="3"/>`,
  `<path d="m36 138-24 12 18-31m137 19 24 12-18-31" fill="${p}" stroke="#ffffff74" stroke-width="3"/>`,
  `<circle cx="32" cy="99" r="8" fill="${q}" stroke="#ffffff99" stroke-width="2"/><circle cx="167" cy="99" r="8" fill="${q}" stroke="#ffffff99" stroke-width="2"/>`,
  `<path d="M50 78Q29 48 46 30Q67 38 74 70m76 8q21-30 4-48-21 8-28 40" fill="${q}" stroke="#ffffff6c" stroke-width="3"/>`,
  `<path d="m39 145-19 8 6-20 10 6m125 6 19 8-6-20-10 6" fill="${p}" stroke="#ffffff6c" stroke-width="3"/>`
 ][v];
 const role={
  heal:`<path d="M55 162q45 25 90 0" fill="none" stroke="#b7ffca" stroke-width="7" stroke-linecap="round"/><path d="M54 163q-9-18-22-15 1 18 22 15m91 0q9-18 22-15-1 18-22 15" fill="#b7ffca"/>`,
  heavy:`<path d="m65 77-24-26 34 8m50 18 34-26-34 8" fill="${q}" stroke="#ffffff77" stroke-width="3"/>`,
  shield:`<path d="M50 147l-18 0 6 17 20 7m92-24 18 0-6 17-20 7" fill="${p}" stroke="#fff9cf" stroke-width="3"/>`,
  weaken:`<circle cx="26" cy="95" r="7" fill="none" stroke="#ffd5ff" stroke-width="3"/><path d="m26 79 0-10m-16 26-10 0m176 0 10 0m-10-16 0-10" stroke="#e6cbfc" stroke-width="3"/>`,
  stagger:`<path d="m26 69 4-13 4 13 13 4-13 4-4 13-4-13-13-4Zm143 0 4-13 4 13 13 4-13 4-4 13-4-13-13-4Z" fill="#f4ddff"/>`,
  charge:`<path d="m47 151-20 22 15-3-4 16 24-28-15 2Zm107 0 20 22-15-3 4 16-24-28 15 2Z" fill="#f9ef9c" stroke="#b69254" stroke-width="2"/>`
 }[kind];
 return extras+role;
}
/* Individually drawn evolution silhouettes, in the retained ink-and-gouache style. */
const EVOLUTION_MODELS=[
 ['M38 116Q45 91 85 103L99 65 115 47 139 65 142 104Q165 116 160 142L147 163H131L134 135 85 140 72 169H56L57 130 34 145Z','M105 58 88 26 108 40 114 14 127 40 152 23 139 61M48 120Q4 91 16 62 42 70 60 110',121,78,11],
 ['M35 124Q45 96 87 106L106 66 124 58 144 74 137 102 166 118 163 132 139 131 116 153 101 176H79L98 142 67 141 35 168H16L39 137Z','M104 69 98 37 119 57 143 35 139 79M56 111Q6 96 21 48 33 84 64 85Q89 86 76 110',124,79,10],
 ['M47 136Q37 111 62 99L75 73Q99 56 129 72L141 106Q165 124 148 149L133 162 73 165Z','M63 102 32 72 31 94 13 84 26 108 6 115 48 128M139 102 169 72 169 94 188 84 174 110 196 117 150 129M61 150 31 169 53 181 80 159M136 152 166 171 147 181 123 160M145 145q51-15 35-45-6 28-34 27',100,105,22],
 ['M53 154Q38 133 55 103L64 86Q48 69 66 53L83 59Q101 49 121 59L138 51Q156 69 139 88L147 118Q158 150 137 166L118 160 107 171 88 159 69 167Z','M55 111Q4 70 26 52 56 54 73 96M140 108q51-39 32-56-31 2-47 44M63 139Q99 124 140 140M65 153Q98 139 136 154',102,82,18],
 ['M30 107 53 80 97 84 119 56 144 60 164 84 151 103 144 117 151 168H133L118 121 86 125 73 174H56L57 120Z','M122 60 114 31 96 21 113 19 121 32 129 13 135 38 153 18 155 37 143 60M53 92 31 54 24 76 12 67 20 100M143 96 179 89 173 107 149 116',139,78,10],
 ['M62 159Q39 130 58 101L72 75 98 69 125 77 143 114 136 149 113 171 90 164 72 177Z','M67 88 46 21 79 60 102 40 123 61 155 18 135 91M59 116Q18 80 8 131l39-4-18 31 43-17M135 112q44-34 56 19l-41-5 21 35-45-20',103,100,20],
 ['M25 130Q31 105 71 102L91 78 111 67 138 75 152 98 138 112 121 105 101 123 98 165H81L76 128 54 132 42 170H26L34 133Z','M90 84 82 45 105 66 137 40 134 77M146 95q27-19 27-47 27 34-8 66l-30-4M49 109Q18 90 14 71 0 95 24 126M96 72 109 49 123 67',120,89,13],
 ['M77 155Q63 133 77 106L89 79 104 70 126 80 130 101 112 110 121 144 105 162 104 178H92L93 160Z','M87 106Q42 26 5 53l36 26L12 84l63 46M118 110q45-84 78-61l-29 26 25 10-68 48M92 76 100 40 114 66 132 44 124 87M82 149 49 167 73 173 93 162',110,88,12],
 ['M46 129Q50 98 73 94L129 91Q151 113 149 142L136 173H117L113 144 89 146 83 175H63Z','M18 96Q19 29 99 23Q181 29 185 98L139 109 98 101 56 109ZM61 141 27 159 18 140 47 115M142 135l31 22 14-19-40-29',100,120,21],
 ['M51 104Q40 69 74 52L103 41Q152 46 155 91L151 128Q131 114 126 150Q108 138 99 170Q85 139 67 153L56 124Z','M50 111Q4 132 30 158 24 133 67 135M148 108q46 15 22 46 5-27-31-23M82 45Q61 15 86 9 77 26 109 41M122 54q19-29 41-15-22 0-26 30',105,82,20],
 ['M36 130Q24 96 55 68Q99 38 151 65Q180 93 165 132L149 153 60 155Z','M59 142 29 171 60 175 84 153M141 143l30 24-28 10-24-28M92 53V24l18-11 18 26 27 9-17 20M43 119 16 112 8 128 32 140M160 111l26-7 9 15-31 21',102,121,22],
 ['M26 117Q49 77 97 80Q133 82 151 104L176 79 181 129 157 122Q123 158 65 143Z','M66 90 65 37 88 64 113 43 115 89M71 139 55 174 95 157 117 168 122 142M43 107 13 88 7 122 30 132M143 104q34-48 47-43-13 37-39 57',78,111,16],
 ['M72 150Q55 124 74 102L93 91 100 64 115 55 130 72 124 99Q148 116 133 142L114 155 104 176 90 175 89 152Z','M76 114Q39 96 25 56l22 13-3-28 20 18 1-29 20 38M126 111q31-25 43-56l-21 15 1-34-19 25-3-36-14 44M75 143 39 169 81 159M129 143l34 20-39-10',112,80,12],
 ['M31 154Q22 122 58 105L104 93Q138 80 118 60L113 44 140 51 158 74 151 106Q142 133 101 135L66 141Q51 152 67 166L91 171Q45 192 31 154Z','M114 68 88 12 125 39 140 17 151 57M115 98q-9-63-57-67l17 30-31-3 54 63M142 105q29-58 49-39l-18 12 17 22-43 30',135,73,12],
 ['M86 150Q78 131 88 98L99 60 110 98Q121 133 113 153L100 177Z','M86 111Q59 17 13 36 6 75 67 119Q10 99 20 156 47 182 87 137M113 110q28-96 75-74 5 45-60 85 64-22 53 35-30 29-69-19M94 64 77 29M106 64l18-35',100,101,7],
 ['M53 170 43 136 57 122 62 91 79 76 120 77 140 97 140 123 158 140 144 174 120 169 114 145 86 145 79 173Z','M65 93 53 47 75 53 87 24 102 47 124 29 142 65 134 93M52 107 18 95 10 123 42 151M142 108l39-10 10 29-33 22M81 109l18-16 21 17-13 25-20-2Z',101,89,18],
 ['M68 170Q43 159 58 135L80 115 79 88 99 72 122 83 133 105 120 130 145 158 129 178 107 173 96 147 85 174Z','M82 88 56 29 68 8 91 57 99 19 116 7 116 77M65 145 21 160l12 18 47-11M123 139q44-20 54 4 4 20-39 30',104,98,16],
 ['M19 135 41 106 87 109 110 78 132 65 153 79 168 107 153 125 128 112 112 134 113 172 93 173 91 138 62 141 49 175 30 170 39 137Z','M115 82 101 41 122 56 137 29 146 65 171 53 159 91M47 111 35 80 57 89 69 66 83 105M40 131Q5 127 7 88-17 40 0 151l40 14',140,94,13],
 ['M71 172 67 148Q45 133 61 113L90 101 92 76 108 62 130 76 138 97 124 108 116 131 135 157 124 179 103 176 96 151 86 175Z','M94 78 75 43 97 57 127 37 128 75M65 125Q19 135 27 87-30 151 43 171l40-8M96 131q18-12 27 1l-6 20-17-1Z',114,88,15],
 ['M26 129Q35 92 65 100L86 92 103 100 123 92 143 101 163 98 176 122 160 144 139 139 120 145 100 139 79 144 60 137 42 146Z','M42 107 25 76 14 88M65 105 57 64 42 69M92 101 91 55 76 60M121 102 132 60 148 69M148 108l24-29 12 16M46 138 26 172M75 139 68 177M105 140 110 178M138 139 154 172M167 131l25 20',44,121,10],
 ['M30 141Q29 101 79 102L94 75 114 57 136 68 150 94 135 112 118 109 112 141 139 160 125 176 102 157 87 143 66 148 50 174 30 168 42 143Z','M96 81 87 30 107 47 114 20 121 51 145 27 137 77M66 110 46 82 34 103M129 75l32-15-10 39M43 130Q0 118 17 79-12 146 42 155',119,88,15],
 ['M75 163Q62 144 76 119L105 94 104 67 113 49 130 53 139 70 126 82 123 110 110 142 102 165 109 182H94L87 170 79 185H65Z','M80 122Q37 86 24 24 57 34 86 81l-3-55 25 57M117 117q53-16 74-54-1 51-68 77M110 64 99 34l20 10 16-19 5 34',123,66,10],
 ['M73 174 66 148 77 131 81 101 65 75 85 69 94 47 113 51 127 79 119 106 130 137 121 171 106 178 95 155 87 178Z','M80 105 34 113 16 93 44 75 29 47 66 47 83 17 100 37 124 16 132 47 169 45 157 80 184 99 157 119 118 105M77 150 47 174l32-3M116 150l40 22-33 3',102,88,14],
 ['M45 158Q17 127 50 100L90 83Q121 71 111 48L124 29 143 36 152 60 138 88 105 106 66 120Q47 135 74 142L115 136 130 156 113 174 73 177Z','M120 40 109 15 128 22 149 7 148 37M80 95 62 54 94 72 107 39 115 81M58 132Q3 128 18 89l13 28 18-12M113 140l40-25 29 5-27 17 26 24-39-1',134,53,10],
 ['M14 105Q35 68 93 73Q138 75 155 104L182 87 195 96 179 120 190 137 181 148 152 132Q114 169 59 149L29 132Z','M57 82 66 50 89 43 106 78M66 143 84 178 110 152M20 114l-14 6M119 78q-17-30-3-46M122 43l13-16 13 13-14 12Z',63,108,14],
 ['M50 104Q44 55 85 43L115 40Q155 48 157 98L143 126 120 113 102 139 81 115 58 130Z','M61 113Q3 151 39 178 15 147 81 139M143 111q58 36 22 69 23-34-48-42M85 129q-19 35 15 61-12-35 14-59M85 41 70 15l25 10 10-22 14 23 24-12-15 30',104,82,22],
 ['M48 143Q38 111 73 101L95 80 102 63 125 58 145 75 143 104 127 116 111 140 104 172H86L83 146 71 168H53Z','M101 77 91 26 114 50 146 25 137 77M56 121Q-1 90 8 51 42 61 65 109M59 126Q-11 129 13 171 36 165 69 137M60 120Q12 64 40 22 66 57 73 105M133 128q66-48 58-81-33 8-63 65M135 133q66 8 46 43-37-7-55-32M130 124q39-65 15-99-27 35-26 84',121,82,15],
 ['M62 117Q47 91 67 65Q95 40 124 60Q154 79 139 113Q119 144 86 137Z','M20 138Q-8 92 76 72Q171 47 191 88Q208 121 115 139Q46 153 20 138ZM45 51l15-22 13 22M138 148l19 16 12-22',102,91,19],
 ['M44 155Q42 133 77 118L97 101 95 75 109 55 133 61 149 83 141 103 120 117 137 143 169 162 156 179 117 155 95 142 76 156 62 177H37Z','M99 75 66 28 72 7 102 43 111 12 129 3 128 62M56 136Q0 143 12 103 4 169 57 168M126 115l41-1 16 20-48 2',122,81,15],
 ['M86 150 79 105 89 78 101 55 115 76 123 110 113 150 101 175Z','M87 112Q46 7 7 23l25 36L5 66 67 124Q1 119 16 171 52 182 88 137M114 111q40-106 78-88l-25 38 30 9-66 54q65-6 53 47-43 15-73-34M93 65 81 26 99 37 116 18 111 69M90 146 73 190 101 167 131 193 112 145',101,101,8]
];
function evolvedPortrait(k){
 const s=SPEC[k.sp],m=EVOLUTION_MODELS[k.sp],p=k.aurora?'#cdb4f4':s.primary,q=k.aurora?'#86eee0':s.secondary,id='evo'+k.sp+Number(k.aurora),[body,append,x,y,eye]=m;
 const feet=`<path d="${append}" fill="${q}" stroke="#253f4a" stroke-width="3.3" stroke-linejoin="round" stroke-linecap="round"/>`;
 return `<svg viewBox="-6 -4 212 204" role="img" aria-label="${esc(nameOf(k))}"><defs><linearGradient id="${id}" x1="0" y1="0" x2=".8" y2="1"><stop stop-color="${p}"/><stop offset="1" stop-color="${q}"/></linearGradient></defs><ellipse cx="102" cy="183" rx="64" ry="9" fill="#0d2b35" opacity=".3"/>${feet}<path d="${body}" fill="url(#${id})" stroke="#253f4a" stroke-width="3.5" stroke-linejoin="round"/><path d="M${x-24} ${y+21}Q${x} ${y+43} ${x+24} ${y+21}" stroke="#fff3cd" stroke-width="9" fill="none" opacity=".3"/><path d="M${x-21} ${y-11}q11-13 25-9" stroke="#ffffff70" stroke-width="4" fill="none" stroke-linecap="round"/><ellipse cx="${x-eye}" cy="${y}" rx="5" ry="7" fill="#183943"/><ellipse cx="${x+eye}" cy="${y}" rx="5" ry="7" fill="#183943"/><circle cx="${x-eye+1}" cy="${y-3}" r="2" fill="#fff"/><circle cx="${x+eye+1}" cy="${y-3}" r="2" fill="#fff"/><path d="m${x-5} ${y+13} 5 3 6-4" stroke="#2b4550" stroke-width="2.5" stroke-linecap="round" fill="none"/>${k.aurora?'<path d="m17 40 3-9 3 9 9 3-9 3-3 9-3-9-9-3Zm151 2 3-9 3 9 9 3-9 3-3 9-3-9-9-3Z" fill="#fff0b7"/>':''}${Number.isInteger(k.guardianZone)?`<path d="m${x-22} ${y-29}-5-22 17 8 10-16 10 16 17-8-5 22Z" fill="#ffe7a0" stroke="#9d774f" stroke-width="2"/>`:''}</svg>`;
}

function svgKin(k,size='normal'){
 if(k.evo)return evolvedPortrait(k);
 const s=SPEC[k.sp],e=!!k.evo,aur=!!k.aurora,p=aur?'#c4a8ff':s.primary,q=aur?'#83e9e8':s.secondary,id=`g${s.id}${e?1:0}${aur?1:0}`;
 const ears={fox:`<path d="M59 74 48 ${e?10:30}l51 28L151 ${e?10:30}l-11 44" fill="${q}" stroke="#213b45" stroke-width="4"/><path d="M62 61 55 39 81 60M138 61l7-22-26 21" fill="#ffe5d1" opacity=".7"/>`,bunny:`<ellipse cx="73" cy="38" rx="17" ry="41" fill="${q}" transform="rotate(-14 73 38)"/><ellipse cx="129" cy="38" rx="17" ry="41" fill="${q}" transform="rotate(14 129 38)"/><ellipse cx="73" cy="36" rx="8" ry="30" fill="#ffe3dc" opacity=".7"/><ellipse cx="129" cy="36" rx="8" ry="30" fill="#ffe3dc" opacity=".7"/>`,frog:`<circle cx="62" cy="72" r="26" fill="${q}"/><circle cx="137" cy="72" r="26" fill="${q}"/>`,bird:`<path d="M49 83Q6 37 30 21l57 56M151 83q42-46 19-62l-57 56" fill="${q}"/>`,moth:`<ellipse cx="42" cy="107" rx="36" ry="51" fill="${q}" transform="rotate(-25 42 107)"/><ellipse cx="157" cy="107" rx="36" ry="51" fill="${q}" transform="rotate(25 157 107)"/><path d="M82 63Q54 11 67 12M117 63q27-52 14-51" fill="none" stroke="${p}" stroke-width="8" stroke-linecap="round"/>`,bug:`<path d="M74 65 49 31M123 65l25-34" stroke="#243e45" stroke-width="7" stroke-linecap="round"/><circle cx="49" cy="31" r="9" fill="${p}"/><circle cx="148" cy="31" r="9" fill="${p}"/>`,rock:`<path d="m58 88-22-34 30-13 12 37m45 0 12-37 30 13-22 34" fill="${q}" stroke="#243e46" stroke-width="4"/>`,dragon:`<path d="m63 80-23-51 42 31m55 20 23-51-42 31" fill="${q}"/><path d="m87 55 11-35 13 35" fill="${p}"/>`,turtle:`<ellipse cx="100" cy="125" rx="74" ry="69" fill="${q}" stroke="#264750" stroke-width="6"/><path d="M43 120h114M64 78l36 88 36-88" stroke="#d9f9de" opacity=".35" stroke-width="6" fill="none"/>`,plant:`<path d="M84 77Q19 57 40 19q44 11 44 58M116 77q65-20 44-58-44 11-44 58" fill="${q}"/><path d="M97 81V24" stroke="${p}" stroke-width="8"/>`,fish:`<path d="m135 114 60-42-4 76-56-15" fill="${q}"/><path d="m89 76 12-43 29 48" fill="${p}"/>`,jelly:`<path d="M45 124Q26 80 62 59Q108 21 149 66Q180 102 153 129" fill="${q}"/>`};
 let body='';if(s.shape==='rock')body=`<path d="M40 109 64 61 125 53 163 96 152 154 102 172 45 153Z" fill="url(#${id})" stroke="#243a49" stroke-width="5"/><path d="m59 108 40-38 43 29-22 48-58 4Z" fill="#fff" opacity=".12"/>`;
 else if(s.shape==='jelly')body=`<path d="M37 111Q38 48 99 45Q161 48 165 111L157 149Q145 163 135 148Q122 169 108 151Q97 171 84 151Q66 167 55 148Q35 166 37 111Z" fill="url(#${id})" stroke="#203d47" stroke-width="4"/>`;
 else if(s.shape==='fish')body=`<ellipse cx="99" cy="116" rx="65" ry="57" fill="url(#${id})" stroke="#21424c" stroke-width="4"/><path d="m64 154 30-16 15 23" fill="${q}"/>`;
 else body=`<ellipse cx="99" cy="124" rx="${e?70:62}" ry="${e?67:59}" fill="url(#${id})" stroke="#26424a" stroke-width="4"/><ellipse cx="98" cy="139" rx="39" ry="31" fill="#fff8e3" opacity=".38"/>`;
 const append=(s.shape==='fox'||s.shape==='bunny')?`<path d="M143 138Q${e?205:180} 88 172 49Q206 114 162 166" fill="${q}" stroke="#254047" stroke-width="4"/>`:'';
 const eyes=s.shape==='jelly'?`<ellipse cx="75" cy="110" rx="10" ry="13" fill="#1b3a45"/><ellipse cx="121" cy="110" rx="10" ry="13" fill="#1b3a45"/>`:`<ellipse cx="75" cy="107" rx="${e?11:9}" ry="12" fill="#17343e"/><ellipse cx="122" cy="107" rx="${e?11:9}" ry="12" fill="#17343e"/>`;
 const wings=['moth','bird','bug'].includes(s.shape)?`<path d="M58 124Q12 90 20 142Q48 175 68 142M140 124q48-34 40 18-29 33-48 0" fill="${q}" opacity=".8"/>`:'';
 const evolve=e?`<path d="m65 48-9-25 27 14 17-30 15 30 29-14-9 25" fill="${aur?'#fbf0a7':q}" stroke="#ffffff77" stroke-width="2"/><circle cx="100" cy="28" r="6" fill="#fff6b0"/>`:'';
 const spots=e?`<circle cx="53" cy="132" r="8" fill="${q}" opacity=".8"/><circle cx="145" cy="132" r="8" fill="${q}" opacity=".8"/>`:`<circle cx="53" cy="131" r="5" fill="${q}" opacity=".7"/><circle cx="146" cy="131" r="5" fill="${q}" opacity=".7"/>`;
 return `<svg viewBox="0 0 200 200" role="img" aria-label="${esc(nameOf(k))}"><defs><radialGradient id="${id}" cx="35%" cy="18%" r="85%"><stop stop-color="${p}"/><stop offset="1" stop-color="${q}"/></radialGradient></defs><ellipse cx="102" cy="181" rx="51" ry="11" fill="#16313b" opacity=".35"/>${append}${ears[s.shape]||''}${wings}${body}${evolve}${spots}${kinDetail(k)}${evolvedArt(k)}${Number.isInteger(k.guardianZone)?'<path d="M64 43 58 22 82 29 99 12 116 29 140 22 134 43Z" fill="#ffe38f" stroke="#9b6339" stroke-width="3"/><circle cx="99" cy="28" r="5" fill="#fff5c1"/>':''}${eyes}<circle cx="78" cy="102" r="3.5" fill="#fff"/><circle cx="125" cy="102" r="3.5" fill="#fff"/><path d="m93 127 7 5 7-5" stroke="#564c58" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><ellipse cx="62" cy="124" rx="8" ry="5" fill="#fc9f9e" opacity=".48"/><ellipse cx="137" cy="124" rx="8" ry="5" fill="#fc9f9e" opacity=".48"/>${aur?'<path d="m19 49 4-14 4 14 14 4-14 4-4 14-4-14-14-4Zm151 1 3-10 3 10 10 3-10 3-3 10-3-10-10-3Z" fill="#ffeeb6"/>':''}</svg>`;
}
function sceneStyle(zone){const z=ZONES[zone];return `--sky1:${z.sky1};--sky2:${z.sky2};--hill:${z.hill};--ground:${z.ground}`}

async function resetJourneySafely(){
 if(resetInProgress)return;
 if(!document.getElementById('freshConfirm')?.checked){toast('Export your backup and check the confirmation box first.');return}
 resetInProgress=true;const previous=state,snapshot=JSON.stringify(state),previousGeneration=saveGeneration;
 try{
  await vaultWriteQueue.catch(()=>{});
  // Prove fallback storage is writable before mutating the primary store.
  localStorage.setItem(KEY+'-reset',snapshot);
  const db=await openVaultDb();
  if(db)await new Promise((resolve,reject)=>{const tx=db.transaction('progress','readwrite');tx.objectStore('progress').delete(KEY);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error||Error('Vault reset failed'));tx.onabort=()=>reject(Error('Vault reset aborted'))});
  localStorage.removeItem(KEY);
  const nextGeneration=ownId();localStorage.setItem(KEY+'-generation',nextGeneration);saveGeneration=nextGeneration;localStorage.removeItem(KEY+'-reset');
  battle=null;capture=null;modal=null;stopMusic();state=null;chosenStarter=0;
  document.getElementById('modal')?.remove();document.getElementById('capture')?.remove();
  render();toast('New journey ready. Choose your starter.');
 }catch(error){
  state=previous;saveGeneration=previousGeneration;let restored=false;
  try{localStorage.setItem(KEY,snapshot);localStorage.setItem(KEY+'-generation',previousGeneration);restored=true;localStorage.removeItem(KEY+'-reset')}catch{}
  const vaultRestored=await writeVaultDb(snapshot);
  console.error('Wildkin fresh start failed',error);
  toast(restored||vaultRestored?'Reset stopped. Your previous adventure was restored.':'Reset failed. Export a backup now before closing the game.');
 }finally{resetInProgress=false}
}
function nav(){return `<nav class="tabbar" aria-label="Game tabs">${[['explore','🧭','Explore'],['team','🐾','Team'],['dex','📖','KinDex'],['camp','🏕️','Camp'],['research','📚','Research'],['expedition','🗺️','Quest'],['arena','🏆','Arena'],['habitat','🌼','Habitat']].map(([id,icon,text])=>`<button class="navitem ${state.screen===id?'active':''}" data-a="nav" data-v="${id}"><span class="nav-icon">${icon}</span>${text}</button>`).join('')}</nav>`}
function render(){document.documentElement.classList.toggle('reduced-motion',!!state?.settings?.reduced);if(!state){ROOT.innerHTML=unreadableSaves.length?recoveryScreen():intro();return}dailyCheck();const current=state.screen;ROOT.innerHTML=`<header class="topbar"><div class="logo">✦</div><div class="brand"><div class="eyebrow">The Living Wilds</div><h1>WILDKIN</h1><span class="app-version">v${APP_VERSION}</span></div><div class="currency">🪙 <b>${state.coins.toLocaleString()}</b></div><button class="iconbtn" data-a="sound" aria-label="Toggle sound">${state.sound?'🔊':'🔇'}</button></header><main class="content">${storageConflict?'<section class="panel"><h3>Another window saved progress</h3><p class="subtext">This copy is paused to protect your latest adventure. Export it if needed before loading the latest save.</p><button class="btn secondary block mt12" data-a="backup">Export this copy</button><button class="btn primary block mt12" data-a="loadlatest">Load latest save</button></section>':''}${current==='team'?teamScreen():current==='dex'?dexScreen():current==='camp'?campScreen()+settingsPanel():current==='research'?researchScreen():current==='expedition'?expeditionScreen():current==='arena'?arenaScreen():current==='habitat'?habitatScreen():exploreScreen()}</main>${nav()}`;if(modal)showModal();if(battle)renderBattle()}
function intro(){return `<div class="intro-cover"><div class="intro-title"><div class="eyebrow">An adventure that grows with you</div><h1>WILD<span style="color:var(--mint)">KIN</span></h1><p>Explore forgotten places. Befriend extraordinary creatures. Build a team that's yours alone.</p></div><div class="scene" style="${sceneStyle(0)};height:205px"><div class="scene-stars"></div><div class="scene-hill"></div><div class="scene-hill right"></div><div class="scene-kin" style="top:10px">${svgKin(makePreview(chosenStarter))}</div></div><div class="section-line"><h2>Choose your first companion</h2></div><div class="starter-grid">${[0,1,2].map(i=>`<button class="starter ${chosenStarter===i?'selected':''}" data-a="starter" data-v="${i}">${svgKin(makePreview(i))}<h3>${SPEC[i].name}</h3><small>${ELEMENTS[SPEC[i].type].icon} ${ELEMENTS[SPEC[i].type].name}</small></button>`).join('')}</div><div class="intro-feature"><span>✦</span><div>60 forms to discover, 6 regions, team battles, daily challenges and giftable creatures.</div></div><button class="btn primary block" data-a="begin">Begin my journey →</button><p class="footer-note center">Autosaves on this device. No account or purchases needed.</p></div>`}
function makePreview(sp){return{sp,level:5,evo:false,aurora:false}}
function svgSmall(k){return `<span style="display:inline-flex;width:39px;height:39px;flex:0 0 39px;align-items:center;justify-content:center;background:#ffffff12;border-radius:12px;overflow:hidden">${svgKin(k)}</span>`}
function teamScreen(){
 const active=new Set(state.team),reserve=state.kin.filter(k=>!active.has(k.uid));
 let list=state.kin.filter(k=>(vaultView==='team'?active.has(k.uid):vaultView==='reserve'?!active.has(k.uid):true));
 if(kinFilter!=='all')list=list.filter(k=>kinFilter==='aurora'?k.aurora:SPEC[k.sp].type===kinFilter);
 if(vaultQuery)list=list.filter(k=>nameOf(k).toLowerCase().includes(vaultQuery.toLowerCase())||SPEC[k.sp].name.toLowerCase().includes(vaultQuery.toLowerCase()));
 if(vaultSort==='level')list.sort((a,b)=>b.level-a.level||a.sp-b.sp);
 if(vaultSort==='name')list.sort((a,b)=>nameOf(a).localeCompare(nameOf(b)));
 if(vaultSort==='new')list.reverse();
 if(vaultSort==='favorite')list.sort((a,b)=>Number(!!b.favorite)-Number(!!a.favorite)||b.level-a.level);
 const pages=Math.max(1,Math.ceil(list.length/VAULT_PAGE_SIZE));vaultPage=Math.min(vaultPage,pages-1);
 const visible=list.slice(vaultPage*VAULT_PAGE_SIZE,(vaultPage+1)*VAULT_PAGE_SIZE);
 return `<div class="row between"><div><div class="kicker">Train, swap and collect</div><h2>Your companions</h2></div><span class="pill">${state.kin.length} owned</span></div>
 <div class="panel mt12"><div class="row between"><div><strong>Battle party · ${state.team.length}/3</strong><div class="subtext">Everyone in this party earns the same XP after a completed battle, even if fainted.</div></div><span class="pill">⚔️ Active</span></div>
 <div class="row gap6 mt12">${teamKin().map((k,i)=>`<button class="kin-card grow" style="padding:6px;min-width:0;text-align:center" data-a="detail" data-v="${k.uid}"><div style="height:67px">${svgKin(k)}</div><small>${i+1}. ${esc(nameOf(k))}</small><small>Lv ${k.level}</small></button>`).join('')}${Array.from({length:3-state.team.length},()=>'<div style="flex:1;border:1px dashed #ffffff3d;border-radius:12px;min-height:86px;display:grid;place-items:center;color:#ffffff67">＋</div>').join('')}</div></div>
 <section class="panel mt16 vault-panel"><div class="row between gap6"><div><div class="kicker">YOUR SANCTUARY</div><h3>Companion storage</h3></div><span class="pill">📦 ${reserve.length} stored</span></div>
 <div class="subtext mt8">All extra creatures live here safely. Tap one to add it to your team or swap it for an active companion. No in-game storage cap; device space still applies.</div>
 <div class="vault-tabs mt12">${[['reserve','📦 Stored'],['team','⚔️ Party'],['all','🐾 All']].map(([id,label])=>`<button class="btn ${vaultView===id?'primary':'secondary'} tiny" data-a="vaultview" data-v="${id}">${label}</button>`).join('')}</div>
 <div class="vault-search mt12"><input class="formbox grow" id="vaultquery" type="search" value="${esc(vaultQuery)}" maxlength="36" placeholder="Search creature name" aria-label="Search creatures"><button class="btn secondary tiny" data-a="vaultsearch">Search</button>${vaultQuery?'<button class="btn ghost tiny" data-a="vaultclear">Clear</button>':''}</div>
 <div class="vault-controls mt12"><select class="formbox" data-a="filter" aria-label="Filter creature type"><option value="all" ${kinFilter==='all'?'selected':''}>All elements</option><option value="aurora" ${kinFilter==='aurora'?'selected':''}>✨ Aurora</option>${Object.entries(ELEMENTS).map(([id,e])=>`<option value="${id}" ${kinFilter===id?'selected':''}>${e.icon} ${e.name}</option>`).join('')}</select><select class="formbox" data-a="vaultsort" aria-label="Sort creatures"><option value="level" ${vaultSort==='level'?'selected':''}>Highest level</option><option value="name" ${vaultSort==='name'?'selected':''}>Name A–Z</option><option value="favorite" ${vaultSort==='favorite'?'selected':''}>Favorites first</option><option value="new" ${vaultSort==='new'?'selected':''}>Newest first</option></select></div>
 <div class="vault-count mt12">${list.length} companion${list.length===1?'':'s'} ${vaultView==='reserve'?'in storage':vaultView==='team'?'in your party':'total'} · page ${vaultPage+1} of ${pages}</div>
 ${visible.length?`<div class="kin-grid mt12">${visible.map(k=>kinCard(k)).join('')}</div>`:'<div class="vault-empty">No creatures match. Try a different filter or explore to capture more!</div>'}
 ${pages>1?`<div class="vault-pagination"><button class="btn secondary tiny" data-a="vaultpage" data-v="-1" ${vaultPage===0?'disabled':''}>← Previous</button><span>${vaultPage+1} / ${pages}</span><button class="btn secondary tiny" data-a="vaultpage" data-v="1" ${vaultPage===pages-1?'disabled':''}>Next →</button></div>`:''}
 </section>`;
}
function kinCard(k){const s=SPEC[k.sp],on=state.team.includes(k.uid);return `<button class="kin-card" data-a="detail" data-v="${k.uid}"><div class="kin-picture" style="--tint:${s.secondary}">${svgKin(k)}</div>${on?`<span class="badge-slot">⭐ TEAM</span>`:k.favorite?`<span class="badge-slot">★ FAVORITE</span>`:''}<div class="kin-label"><h3>${esc(nameOf(k))}</h3>${k.aurora?'✨':''}${k.favorite?' ⭐':''}</div><div class="kin-role">${esc(signatureOf(k)[2])}</div><div class="row between gap6 mt8">${typeLabel(s.type)}<small>Lv ${k.level}</small></div><div class="hp ${k.hp<hpMax(k)*.3?'low':''}"><div style="width:${k.hp/hpMax(k)*100}%"></div></div></button>`}
function dexScreen(){const caught=new Set(state.caught);const seen=new Set(state.seen);const n=SPEC.reduce((sum,s)=>sum+Number(caught.has(`${s.id}:0`))+Number(caught.has(`${s.id}:1`)),0);const sp=SPEC.filter(s=>dexZone==='all'||s.zone===Number(dexZone));return `<div class="kicker">The living record</div><h2>KinDex</h2><div class="panel mt12"><div class="row between"><div><strong>${n} / 60 forms recorded</strong><div class="subtext">Each Wildkin can evolve into a new form.</div></div><span class="pill">${Math.round(n/60*100)}%</span></div><div class="progress mt12"><span style="width:${n/60*100}%"></span></div></div><div class="section-line"><h2>Field guide</h2><select class="formbox" data-a="dexfilter" style="width:150px" aria-label="Filter region"><option value="all">All regions</option>${ZONES.map((z,i)=>`<option value="${i}" ${dexZone===String(i)?'selected':''}>${z.icon} ${z.short}</option>`).join('')}</select></div><div class="dex-grid">${sp.map(s=>[0,1].map(e=>{const id=`${s.id}:${e}`,known=caught.has(id),glimpsed=seen.has(id),k={sp:s.id,level:e?16:5,evo:!!e,aurora:false};return `<button class="dex-entry ${known?'':'unknown'}" data-a="dexdetail" data-v="${s.id}" data-e="${e}"><div class="dex-image">${known?svgKin(k):'<span style="font-size:46px;filter:grayscale(1)">❔</span>'}</div><span class="dex-name">${known?esc(e?s.evolved:s.name):glimpsed?'Seen, not caught':'???'}</span><small>#${String(s.id*2+e+1).padStart(3,'0')}</small></button>`}).join('')).join('')}</div>`}
function campScreen(){const q=dailyQuests(),restored=state.kin.every(k=>k.hp===hpMax(k));return `<div class="kicker">Rest, prepare, and share</div><h2>Home camp</h2><div class="panel mt12"><div class="row between"><div><div class="kicker">Trail rank</div><h3>Wanderer ${tier()}</h3><div class="subtext">${state.totalWins} victories · ${state.totalCatches} bonded</div></div><div class="badge-bubble">🏕️</div></div><div class="divider"></div><div class="row between gap6"><div class="grow"><strong>Campfire recovery</strong><div class="subtext">Restore your entire team at no cost.</div></div><button class="btn primary tiny" data-a="healall" ${restored?'disabled':''}>💚 Rest</button></div></div><div class="section-line"><h2>Today's trail quests</h2><span class="pill">Resets daily</span></div><div class="panel">${q.map(x=>{const p=state.daily.progress[x.id]||0,claimed=state.daily.claimed.includes(x.id),done=p>=x.need;return `<div class="quest"><span class="quest-icon">${x.icon}</span><div class="grow"><div class="quest-name">${x.title}</div><div class="subtext">${x.desc} · ${Math.min(x.need,p)}/${x.need}</div><div class="progress mt8"><span style="width:${Math.min(100,p/x.need*100)}%"></span></div></div><button class="btn tiny ${done&&!claimed?'amber':'secondary'}" data-a="claim" data-v="${x.id}" ${!done||claimed?'disabled':''}>${claimed?'✓':`🪙 ${x.reward}`}</button></div>`}).join('')}</div><div class="section-line"><h2>Trail supplies</h2><span class="pill">🪙 ${state.coins}</span></div><div class="panel">${[['orb','🟢','Bond orb',45,`You have ${state.orbs}`],['prism','🔮','Prism orb',155,`You have ${state.prisms}`],['tonic','🧪','Recovery tonic',75,`You have ${state.tonics}`]].map(([id,ic,n,p,sub])=>`<div class="camp-item"><div class="item-icon">${ic}</div><div class="grow"><strong>${n}</strong><div class="subtext">${sub}</div></div><button class="btn secondary tiny" data-a="buy" data-v="${id}" ${state.coins<p?'disabled':''}>🪙 ${p}</button></div>`).join('')}</div><div class="section-line"><h2>Family gifting</h2></div><div class="note-card"><div class="badge-bubble">🎁</div><div class="grow"><strong>Share a Wildkin</strong><div class="subtext">Send a creature as a QR/link gift. Your original stays with you.</div></div><button class="btn secondary tiny" data-a="trade">Open</button></div><div class="section-line"><h2>Game updates</h2></div><div class="panel update-panel"><div class="row between gap6"><div class="grow"><strong>Wildkin v${APP_VERSION}</strong><div class="subtext">${updateMessage||'Installed game version. Check for the newest update anytime.'}</div></div><button class="btn primary tiny" data-a="checkupdate">${updateStatus==='checking'?'Checking…':'↻ Check updates'}</button></div><div class="footer-note">Your creatures and progress are kept separately from game files. Connect to the internet before checking.</div></div><div class="section-line"><h2>Your progress</h2></div><div class="panel"><div class="row gap6 wrap"><button class="btn secondary medium grow" data-a="backup">⬇️ Export backup</button><button class="btn secondary medium grow" data-a="restore">⬆️ Restore backup</button></div><div class="row gap6 wrap mt12"><button class="btn ghost medium grow" data-a="help">❔ How to play</button><button class="btn ghost medium grow" data-a="credits">✦ About game</button></div><div class="footer-note">Progress is saved to this phone’s browser storage, including a larger on-device creature vault when available. Storage is not unlimited or synchronized across devices. Export a backup occasionally and before clearing browser data or switching phones.</div><button class="btn ghost block mt12" data-a="freshStart">Start a fresh adventure</button></div>`}
function startEncounter(isBoss=false,arena=false,context='wild'){if(!currentKin()){toast('Your team is exhausted. Rest at camp first.');return}const z=state.zone,available=zoneSpecies(z);let s;
if(isBoss){if(!guardianReady(z)){toast('Win a few more battles before facing the guardian.');return}s=available[4]}
else{const spot=clamp(state.trailSpot?.[z]||0,0,2),p=Math.random(),weights=TRAIL_RARITY_WEIGHTS[spot],rar=p<weights[0]?0:p<weights[0]+weights[1]?1:2;s=pick(available.filter(v=>v.rarity===rar))}
const highest=Math.max(...teamKin().map(k=>k.level)),level=isBoss?(state.badges.includes(z)?Math.min(60,Math.max(Core.GUARDIAN_LEVELS[z],highest+1)):Core.GUARDIAN_LEVELS[z]):clamp(Core.BASE_LEVELS[z]+rand(-1,3),1,60);
const foe=makeKin(s.id,arena?Math.min(60,level+2):level,!isBoss&&((state.hunt[z]||0)>=24||Math.random()<.025),isBoss);if(!arena&&context==='wild')recordResearch(foe.sp,'seen');if(isBoss){foe.hp=Math.ceil(hpMax(foe)*(z===5?1.8:2.8));foe.guardHp=foe.hp;foe.guardianZone=z;foe.nickname=ZONES[z].guardian}
if(!isBoss&&!arena&&context==='wild'){state.hunt[z]=foe.aurora?0:Math.min(24,(state.hunt[z]||0)+1)}
if(!arena&&context==='wild')state.seen=[...new Set([...state.seen,`${s.id}:${isBoss?1:0}`])];if(!Array.isArray(state.battled))state.battled=[];battle={foe,active:currentKin().uid,energy:2,guard:false,boss:isBoss,arena,log:isBoss?`${ZONES[z].guardian} challenges your team!`:`A wild ${nameOf(foe)} appeared!`,turn:0,doing:false,phase:'ready',events:[],notice:null,fx:'',showMoves:false};initializeBattle(battle);if(isBoss&&z===5&&!state.story.ending){const echo1=makeKin(17,36,false,true),echo2=makeKin(23,38,false,true);echo1.nickname='Echo of the ridge';echo2.nickname='Echo of the storm';battle.foeQueue=[echo2,foe];battle.foe=echo1;battle.intent=Core.intent(battle,echo1);battle.log='The Still Heart · three linked trials';}modal=null;capture=null;save();render();sound(isBoss?180:600,.15,'triangle')}
function searchWilds(){
 if(!currentKin()){toast('Rest your team at camp first.');return}
 const z=state.zone,spot=clamp(state.trailSpot?.[z]||0,0,2),key=z+':'+spot;
 if(!state.trailVisits)state.trailVisits={};
 if(!state.trailSpot)state.trailSpot={};
 const first=!state.trailVisits[key];
 state.trailVisits[key]=(state.trailVisits[key]||0)+1;
 state.totalSearches++;activity('search');
 if(first){state.coins+=35+z*10;toast('New trail discovered! Bonus coins awarded.')}
 sound(530,.08);
 if(Math.random()<.12){
  const coins=rand(22,69)+(spot===2?15:0);state.coins+=coins;
  if(Math.random()<.22){state.orbs++;toast(`Found ${coins} coins and a Bond orb!`)}
  else toast(`Discovered a hidden cache: +${coins} coins!`);
  save();render();
 }else{save();startEncounter(false)}
}
function gainXp(k,amount){let leveled=0,evolved=false;k.xp+=amount;while(k.level<60&&k.xp>=expNeed(k.level)){k.xp-=expNeed(k.level);const old=hpMax(k),wasFainted=k.hp<=0;k.level++;k.hp=wasFainted?0:clamp(k.hp+hpMax(k)-old+8,1,hpMax(k));leveled++}if(k.level>=60)k.xp=0;if(!k.evo&&k.level>=12){k.evo=true;k.hp=clamp(k.hp+22,1,hpMax(k));state.caught=[...new Set([...state.caught,`${k.sp}:1`])];state.seen=[...new Set([...state.seen,`${k.sp}:1`])];evolved=true;recordResearch(k.sp,'evolved')}return{leveled,evolved}}
function typemult(at,dt){return ELEMENTS[at].beats===dt?1.4:ELEMENTS[dt].beats===at?.74:1}

// Battle presentation v1.2: turn phases are sequential, never simultaneous.
const pause=ms=>new Promise(resolve=>setTimeout(resolve,(state?.settings?.reduced||window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)?Math.min(130,ms):ms/(state?.settings?.speed||1)));
function knownFoe(){return !!(battle&&Array.isArray(state.battled)&&state.battled.includes(battle.foe.sp))}
function learnFoe(){if(!battle||!state)return;if(!Array.isArray(state.battled))state.battled=[];if(!state.battled.includes(battle.foe.sp)){state.battled.push(battle.foe.sp);save()}}
function affinityLabel(mult){return mult>1?'SUPER EFFECTIVE':mult<1?'NOT VERY EFFECTIVE':'NEUTRAL DAMAGE'}
function affinityHint(attacker,defender){const n=typemult(attacker,defender);return n>1?`Strong · ×1.4`:n<1?`Resisted · ×0.74`:'Normal · ×1.0'}
function announce(title,detail='',effect='neutral',amount=0,actor='player',fx=''){
 if(!battle)return;
 battle.notice={title,detail,effect,amount,actor};battle.fx=fx;
 if(!battle.events)battle.events=[];
 battle.events.unshift({title,detail,effect});battle.events=battle.events.slice(0,8);
 battle.log=title+(detail?' '+detail:'');render();
}
function effectLine(at,dt,dmg,critical=false){const mult=typemult(at,dt);const first=mult>1?'Super effective!':mult<1?'Not very effective.':'Normal effectiveness.';return `${first} ${ELEMENTS[at].name} vs ${ELEMENTS[dt].name} (${mult===1? '×1.0':mult===1.4?'×1.4':'×0.74'}). ${dmg} damage.${critical?' Critical hit!':''}`}
function battleAlive(b){return !!battle&&battle===b}
function beginTurn(){if(!battle||battle.doing)return false;battle.doing=true;battle.phase='player';return true}
function endTurn(b){if(!battleAlive(b))return;b.turn++;b.intent=Core.intent(b,b.foe);b.doing=false;b.phase='ready';b.fx='';render()}
function battleMoveHelp(mine,foe){const a=SPEC[mine.sp].type,d=SPEC[foe.sp].type,known=knownFoe();return `<div class="move-guide"><div class="move-guide-title">Your battle moves <span>${typeLabel(a)}</span></div><div class="move-guide-row"><b>⚡ How energy works</b><span>Each fight starts at 2/4 energy. It does not recover automatically or between turns. Switching companions resets it to 2/4.</span></div><div class="move-guide-row"><b>⚔️ Strike (+1 energy)</b><span>Regular elemental damage. Charges 1 energy, up to 4. 13% critical chance.</span></div><div class="move-guide-row"><b>✨ Element burst (−2 energy)</b><span>Much stronger elemental attack. Requires and spends 2 energy. 17% critical chance.</span></div><div class="move-guide-row"><b>🌟 ${esc(signatureOf(mine)[0])} (−1 energy)</b><span>${esc(SIGNATURE_DESCRIPTIONS[signatureOf(mine)[1]])} Stronger when evolved.</span></div><div class="move-guide-row"><b>🛡️ Guard (+2 energy)</b><span>Heals 4 HP, charges 2 energy (up to 4), and blocks 64% of the next incoming hit.</span></div><div class="move-guide-row"><b>🟢 Bond</b><span>Try a timing-based capture. Lower enemy HP gives you better odds.</span></div><div class="move-guide-row matchup"><b>${known?'Matchup discovered':'Matchup not yet recorded'}</b><span>${known?`${typeLabel(a)} attacking ${typeLabel(d)}: ${affinityHint(a,d)}. Enemy attacking you: ${affinityHint(d,a)}.`:'Land an attack on this creature to reveal its strengths and weaknesses for future fights.'}</span></div></div>`}

async function foeAttack(){
 const b=battle;if(!b)return;const mine=state.kin.find(k=>k.uid===b.active),foe=b.foe;if(!mine||mine.hp<=0)return;
 b.doing=true;b.phase='foe';const intent=b.intent||'strike',at=SPEC[foe.sp].type,dt=SPEC[mine.sp].type;
 if(['charge','recover','mirror','ward'].includes(intent)){
  if(intent==='recover'){foe.hp=Math.min(foe.guardHp||hpMax(foe),foe.hp+Math.ceil(hpMax(foe)*.12));}
  if(intent==='charge')b.charged=true;
  announce(nameOf(foe)+' · '+Core.INTENTS[intent][0],Core.INTENTS[intent][1],'incoming',0,'foe','foe-windup');
  await pause(900);if(battleAlive(b)){save();endTurn(b)}return;
 }
 announce(nameOf(foe)+' uses '+Core.INTENTS[intent][0]+'!',Core.INTENTS[intent][1],'incoming',0,'foe','foe-windup');
 await pause(650);if(!battleAlive(b))return;
 const passive=Core.PASSIVES[mine.sp],passiveType=passive[2];let protection=1;
 if(passiveType==='shell'&&!b.hits[mine.uid])protection-=passive[3];
 if(passiveType==='armor')protection-=passive[3];if(passiveType==='lowarmor'&&mine.hp<hpMax(mine)/2)protection-=passive[3];
 if(state.equipment[mine.uid]==='ward')protection-=.10;
 if(passiveType==='mist'&&b.weakenTurns>0)protection-=passive[3];
 const weak=b.weakenTurns>0,guard=b.guard?(typeof b.guard==='number'?b.guard:.36):1;
 const damage=Core.damage({attacker:foe,defender:mine,kind:intent==='heavy'?'burst':'strike',mult:typemult(at,dt),roll:rand(90,110)/100,guard:guard*protection,weak:weak?.78:1,bonus:(intent==='heavy'?1.5:1)*(b.boss?1.25:1)});
 b.hits[mine.uid]=(b.hits[mine.uid]||0)+1;if(weak)b.weakenTurns--;b.guard=false;b.charged=false;
 mine.hp=Math.max(0,mine.hp-damage);if(intent==='root')b.playerWeakTurns=2;if(intent==='drain')b.energy=Math.max(0,b.energy-1);
 announce(nameOf(foe)+' attacks!',effectLine(at,dt,damage)+(guard<1?' Guard reduced the hit.':'')+(intent==='root'?' Your next two attacks are weakened.':'')+(intent==='drain'?' Lost one energy.':''),typemult(at,dt)>1?'strong':typemult(at,dt)<1?'weak':'neutral',damage,'foe','ally-hit');save();sound(180,.12,'triangle');
 await pause(1000);if(!battleAlive(b))return;
 if(mine.hp<=0){const next=teamKin().find(k=>k.hp>0);if(next){b.active=next.uid;b.energy=2;b.entry=next.uid;announce(nameOf(mine)+' rests.',nameOf(next)+' steps forward.','neutral',0,'player','enter');await pause(600);if(!battleAlive(b))return;}
 else{const experience=grantPartyXp(teamKin(),Math.max(8,Math.round((33+foe.level*6)*.3)));if(b.expedition){state.expedition=null}tournament=null;healCollectionAfterBattle();battle=null;modal={type:'result',win:false,title:'A lesson for next time',message:'Your entire collection is restored. Review the enemy intention and try another team. '+(b.expedition?'The unsecured expedition haul was lost.':''),bonus:'All companions fully healed.',experience};save();render();return;}}
 endTurn(b);
}
async function actionAttack(kind){
 if(!battle||battle.doing)return;
 const mine=state.kin.find(k=>k.uid===battle.active),foe=battle.foe;
 if(!mine||mine.hp<=0)return;
 if(kind==='burst'&&battle.energy<2){toast('Not enough energy. Strike or Guard to charge.');return;}
 if(kind==='signature'&&battle.energy<1){toast('Signature attacks need 1 energy. Strike or Guard to charge.');return;}
 if(kind==='signature'&&(battle.cooldowns[mine.uid]||0)>0){toast('Use other actions while your signature recovers.');return}
 if(!beginTurn())return;
 const b=battle,at=SPEC[mine.sp].type,dt=SPEC[foe.sp].type;
 for(const id of Object.keys(b.cooldowns))b.cooldowns[id]=Math.max(0,b.cooldowns[id]-1);
 if(kind==='signature')b.cooldowns[mine.uid]=2;
 let dmg=0,crit=false;const sig=signatureOf(mine),isSig=kind==='signature';
 if(kind==='guard'){
  b.guard=true;b.energy=Math.min(4,b.energy+2+(Core.PASSIVES[mine.sp][2]==='capacitor'||mine.sp===7?1:0));b.prepared=mine.uid;
 }else{
  if(kind==='burst'){b.energy-=2;state.totalBursts++}else if(isSig){b.energy--}else b.energy=Math.min(4,b.energy+1);
  const repeated=b.lastKind===kind&&b.lastUid===mine.uid;
  const shield=b.intent==='ward'?.45:b.intent==='mirror'&&repeated?.5:1;
  dmg=Core.damage({attacker:mine,defender:foe,kind:isSig?(sig[1]==='heavy'?'heavy':'signature'):kind,mult:typemult(at,dt),roll:rand(90,110)/100,guard:shield,weak:b.playerWeakTurns>0?.78:1,bonus:combatBonus(mine,kind,b)});
  if(b.playerWeakTurns>0)b.playerWeakTurns--;
  b.prepared=null;b.entry=null;b.acts[mine.uid]=(b.acts[mine.uid]||0)+1;
  if(Core.PASSIVES[mine.sp][2]==='battery'&&b.acts[mine.uid]%Core.PASSIVES[mine.sp][3]===0)b.energy=Math.min(4,b.energy+1);
 }
 b.lastKind=kind;b.lastUid=mine.uid;
 const move=isSig?sig[0]:kind==='burst'?`${ELEMENTS[at].name} Burst`:kind==='guard'?'Guard':'Strike';
 announce(`${nameOf(mine)} uses ${move}!`,kind==='guard'?'Preparing a shield and gathering energy…':kind==='burst'?'Charging a powerful elemental attack…':isSig?`A ${sig[2].toLowerCase()} signature move is coming…`:'A quick elemental attack is on its way…','player',0,'player',kind==='guard'?'guard':'ally-windup');
 sound(kind==='burst'?390:kind==='guard'?710:270,.16,kind==='burst'?'sawtooth':'triangle');
 await pause(570);if(!battleAlive(b))return;
 if(kind==='guard'){
  const before=mine.hp;mine.hp=Math.min(hpMax(mine),mine.hp+Math.max(4,Math.ceil(hpMax(mine)*((Core.PASSIVES[mine.sp][2]==='rest'?Core.PASSIVES[mine.sp][3]:0)+(state.equipment[mine.uid]==='vital'?.05:0)))));
  announce(`${nameOf(mine)} is guarding!`,`+${mine.hp-before} HP · +2 energy · next incoming damage reduced by 64%.`,'guard',mine.hp-before,'player','guard');
 }else{
  foe.hp=Math.max(0,foe.hp-dmg);
  if(isSig&&Core.PASSIVES[mine.sp][2]==='siphon')mine.hp=Math.min(hpMax(mine),mine.hp+Math.ceil(hpMax(mine)*Core.PASSIVES[mine.sp][3]));
  const mult=typemult(at,dt);learnFoe();let bonus='';
  if(isSig){
   if(sig[1]==='heal'){const old=mine.hp;mine.hp=Math.min(hpMax(mine),mine.hp+Math.max(1,Math.ceil(dmg*.3)));bonus=` Restored ${mine.hp-old} HP!`;}
   if(sig[1]==='shield'){b.guard=.58;bonus=' Your shield blocks 42% of the next hit!';}
   if(sig[1]==='weaken'){b.weakenTurns=2;bonus=' Enemy attacks weakened for two turns!';}
   if(sig[1]==='stagger'){b.skipFoe=Math.random()<.35;bonus=b.skipFoe?' Enemy staggered!':' Stagger did not trigger.';}
   if(sig[1]==='charge'){b.energy=Math.min(4,b.energy+1);bonus=' Recovered 1 energy!';}
   if(sig[1]==='heavy')bonus=' Powerful signature attack!';
  }
  announce(`${nameOf(mine)} used ${move}!`,effectLine(at,dt,dmg,crit)+bonus,mult>1?'strong':mult<1?'weak':'neutral',dmg,'player','foe-hit');
 }
 save();sound(kind==='burst'?440:620,.18,'triangle');
 await pause(1150);if(!battleAlive(b))return;
 if(foe.hp===0){finishBattle(false);return;}
 if(b.skipFoe){b.skipFoe=false;announce(`${nameOf(foe)} is staggered!`,'The opponent loses its turn. Choose another move.','strong',0,'player','guard');await pause(600);if(battleAlive(b))endTurn(b);return;}
 await foeAttack();
}
function grantPartyXp(members,points){
 return members.map(k=>{const before=k.level,wasMax=before>=60,r=gainXp(k,points);return{name:nameOf(k),sp:k.sp,levelBefore:before,levelAfter:k.level,points,levelled:r.leveled,evolved:r.evolved,wasMax};});
}
function renderXpRows(rows){
 if(!rows?.length)return '';
 return `<section class="xp-report"><div class="row between gap6"><strong>⭐ Party experience</strong><span class="pill">All ${rows.length} companions</span></div><div class="subtext mt8">Every party member gets the full amount, even if fainted. Stored companions do not gain battle XP.</div>${rows.map(k=>`<div class="xp-entry"><span class="xp-avatar">${svgSmall({sp:k.sp,level:k.levelAfter,evo:k.levelAfter>=12,aurora:false})}</span><div class="grow"><strong>${esc(k.name)}</strong><div class="subtext">Lv ${k.levelBefore}${k.levelAfter!==k.levelBefore?' → '+k.levelAfter:''}${k.evolved?' · Evolved!':''}</div></div><strong class="xp-gain">${k.wasMax?'MAX':'+ '+k.points+' XP'}</strong></div>`).join('')}</section>`;
}
function healCollectionAfterBattle(){if(!state)return;for(const k of state.kin){if(k&&SPEC[k.sp])k.hp=hpMax(k)}}
function finishBattle(caught){
 const b=battle;if(!b)return;
 if(b.foeQueue?.length){recordResearch(b.foe.sp,'won');b.foe=b.foeQueue.shift();observeFoe(b.foe);b.turn=0;b.intent=Core.intent(b,b.foe);b.weakenTurns=0;b.playerWeakTurns=0;b.energy=Math.min(4,b.energy+1);b.doing=false;b.phase='ready';announce('The next opponent steps forward!',nameOf(b.foe)+' enters. Your team gains one energy.','neutral',0,'foe','enter');save();render();return;}
 if(b.storyNode)completeStory(b.storyNode);
 if(b.expedition&&state.expedition){state.expedition.pending=false;finishExpeditionStep()}
 const z=b.region??state.zone,foe=b.foe,isGuardian=!!b.boss,firstSeal=isGuardian&&!state.badges.includes(z);
 learnFoe();recordResearch(foe.sp,caught?'caught':'won');if(b.arena&&!caught)state.arenaWins=(state.arenaWins||0)+1;let payout=isGuardian?260+z*85:b.arena?95+z*20:rand(20,38)+z*8,exp=isGuardian?130+z*40:b.arena?85+foe.level*7:65+foe.level*9;
 let levelText='';
 const rewardTeam=teamKin().slice();
 if(caught){
  
  payout=10+z*7;exp=20+foe.level*3;
  const k=makeKin(foe.sp,foe.level,foe.aurora,foe.evo);
  if(isGuardian){k.guardianZone=z;k.nickname=ZONES[z].guardian}
  state.kin.push(k);state.totalCatches++;activity('catch');
  state.caught=[...new Set([...state.caught,`${foe.sp}:${foe.evo?1:0}`])];
  if(state.team.length<3)state.team.push(k.uid);
 }else{state.totalWins++;if(!b.arena&&!b.expedition)state.wins[z]++;activity('win')}
 if(firstSeal){state.badges.push(z);state.prisms+=2}
 state.coins+=payout;
 const experience=grantPartyXp(rewardTeam,exp);
 if(b.tournament){if(b.tournament.index===2){if(!state.arenaMedals.includes(b.tournament.tier)){state.arenaMedals.push(b.tournament.tier);state.coins+=300*(b.tournament.tier+1);state.prisms+=3;}tournament=null;}else tournament={tier:b.tournament.tier,index:b.tournament.index+1};}
 if(firstSeal&&z===5)state.story.ending=true;
 
 const offerGuardian=isGuardian&&!caught&&!state.kin.some(k=>k.guardianZone===z);
 const title=caught?(isGuardian?'Guardian befriended!':'New companion!'):isGuardian?'Guardian defeated!':'Battle won!';
 let message=caught?`${nameOf(foe)} has joined your collection.`:`You outplayed ${nameOf(foe)}.`;
 if(firstSeal){message+=' You earned a region seal and opened the next trail!';if(z<5)state.zone=z+1}
 if(offerGuardian)message+=` ${ZONES[z].guardian} is ready to join you. No orb is needed!`;
 message+=levelText;
 healCollectionAfterBattle();message+=' Your entire collection is fully healed.';
 battle=null;capture=null;
 modal={type:'result',win:true,title,message,bonus:`🪙 +${payout} coins${firstSeal?' · 🔮 +2 prism orbs':''}`,experience,foe,firstSeal:firstSeal?z+1:0,ending:firstSeal&&z===5,nextTournament:b.tournament&&b.tournament.index<2?tournament:null,guardianOffer:offerGuardian?z:null};
 save();render();sound(850,.25,'sine');
}
function claimGuardian(){
 if(!modal||modal.type!=='result'||!Number.isInteger(modal.guardianOffer)||!state)return;
 const z=modal.guardianOffer;
 if(state.kin.some(k=>k.guardianZone===z)){toast('You have already befriended this Guardian.');return}
 
 const rewardRows=modal.experience;const foe=modal.foe;if(!foe||!SPEC[foe.sp])return;
 const k=makeKin(foe.sp,foe.level,foe.aurora,true);
 k.guardianZone=z;k.nickname=ZONES[z].guardian;recordResearch(foe.sp,'caught');
 state.kin.push(k);state.totalCatches++;activity('catch');
 state.caught=[...new Set([...state.caught,`${foe.sp}:1`])];
 state.seen=[...new Set([...state.seen,`${foe.sp}:1`])];
 if(state.team.length<3)state.team.push(k.uid);
 modal={type:'result',win:true,title:'A legendary friendship!',foe:k,message:`${ZONES[z].guardian} is now yours! It has a unique golden crown and can join your battle team.`,bonus:`👑 ${ZONES[z].short} Guardian · Lv ${k.level}`,guardianOffer:null,experience:rewardRows};
 save();render();sound(980,.3,'triangle');
}
async function tryFlee(){
 if(!battle||battle.doing)return;
 const b=battle;b.doing=true;
 announce('Retreating safely…',b.boss?'You leave the Guardian trial. You can challenge this boss again.':'Your team leaves the encounter. No penalty, no enemy attack.','player',0,'player','enter');
 await pause(550);if(!battleAlive(b))return;
 if(b.expedition)state.expedition=null;tournament=null;healCollectionAfterBattle();battle=null;capture=null;save();render();toast('Escaped safely! Everyone is fully healed.');
}
async function useTonic(){
 if(!battle||battle.doing||state.tonics<=0){if(!battle?.doing)toast('No Recovery tonics left.');return}
 const b=battle,mine=state.kin.find(k=>k.uid===b.active);if(mine.hp>=hpMax(mine)){toast('Your companion is already at full health.');return}
 b.doing=true;state.tonics--;const before=mine.hp;
 announce(`${nameOf(mine)} drinks a tonic!`,'A warm healing light gathers around your companion.','player',0,'player','guard');
 await pause(540);if(!battleAlive(b))return;
 mine.hp=Math.min(hpMax(mine),mine.hp+Math.max(50,Math.ceil(hpMax(mine)*.7)));
 announce(`${nameOf(mine)} recovers!`,`+${mine.hp-before} HP restored (70% max HP, minimum 50). Your opponent acts next.`,'guard',mine.hp-before,'player','guard');save();sound(900,.16);
 await pause(900);if(!battleAlive(b))return;await foeAttack();
}
function renderBattle(){
 if(!battle)return;
 const b=battle,foe=b.foe,mine=state.kin.find(k=>k.uid===b.active),fmax=foe.guardHp||hpMax(foe),fper=foe.hp/fmax*100,mper=mine.hp/hpMax(mine)*100,at=SPEC[mine.sp].type,dt=SPEC[foe.sp].type,mult=typemult(at,dt),known=knownFoe(),n=b.notice;
 const advice=known?(mult>1?'ADVANTAGE':mult<1?'DISADVANTAGE':'EVEN MATCHUP'):'NEW OPPONENT';
 const matchColor=!known?'new':mult>1?'strong':mult<1?'weak':'neutral';
 const nEffect=n?.effect||'neutral';
 const effectiveness=n&&n.amount>0&&(n.actor==='foe'||n.actor==='player')&&nEffect!=='guard'?`<span class="damage-label ${nEffect}">${nEffect==='strong'?'↗ Super effective!':nEffect==='weak'?'↘ Not very effective':'• Normal effectiveness'}</span>`:'';
 const hist=(b.events||[]).slice(1,4);
 const h=`<div class="battle-cover"><div class="battle" aria-label="Creature battle"><div class="battle-top"><span class="pill">${b.boss?'👑 GUARDIAN BOSS':'⚔️ WILD ENCOUNTER'}</span><button class="btn secondary tiny flee-header" data-a="flee" ${b.doing?'disabled':''}>🏃 Flee</button></div>
 <div class="battle-scene" style="${sceneStyle(state.zone)}"><div class="battle-scenery glimmer glimmer-one"></div><div class="battle-scenery glimmer glimmer-two"></div><div class="battle-horizon"></div><div class="battle-platform"></div>
 <div class="enemy-data"><div class="row between gap6"><strong>${foe.aurora?'✨ ':''}${esc(nameOf(foe))}</strong><div class="row gap6">${typeLabel(dt)}<span class="pill">Lv ${foe.level}</span></div></div><div class="hp ${fper<30?'low':''}"><div style="width:${fper}%"></div></div><small>${foe.hp} / ${fmax} HP</small></div>
 <div class="battle-art detailed-art ${b.fx==='foe-hit'?'kin-impact':b.fx==='foe-windup'?'kin-attack':''}">${svgKin(foe)}</div>${b.fx==='foe-hit'?`<div class="hit-number ${nEffect}">−${n?.amount||0}</div>`:''}</div>
 <div class="my-kin"><div class="my-avatar detailed-art ${b.fx==='ally-hit'?'kin-impact':b.fx==='ally-windup'?'kin-attack':b.fx==='guard'?'kin-guard':''}">${svgKin(mine)}</div><div class="grow"><div class="row between gap6"><strong>${esc(nameOf(mine))}</strong><small>Lv ${mine.level} · ${ELEMENTS[at].icon}</small></div><div class="hp ${mper<30?'low':''}"><div style="width:${mper}%"></div></div><div class="row between mt8"><small>${mine.hp}/${hpMax(mine)} HP</small><small class="energy-score">⚡ Energy ${b.energy}/4</small></div></div>${b.fx==='ally-hit'?`<div class="player-hit">−${n?.amount||0}</div>`:''}</div>
 <div class="intent-panel"><strong>Next: ${esc(Core.INTENTS[b.intent||'strike'][0])}</strong><small>${esc(Core.INTENTS[b.intent||'strike'][1])}${b.foeQueue?.length?' · '+(b.foeQueue.length+1)+' opponents left':''}</small>${state.settings.hints?`<small>${b.boss?esc(Core.GUARDIANS[b.region].hint):esc(Core.PASSIVES[mine.sp][0]+': '+Core.PASSIVES[mine.sp][1])}</small>`:''}${b.playerWeakTurns?'<small>Your attacks weakened: '+b.playerWeakTurns+' attacks</small>':''}${b.weakenTurns?'<small>Enemy weakened: '+b.weakenTurns+' attacks</small>':''}</div><div class="energy-panel" role="status" aria-label="Battle energy: ${b.energy} out of 4. Strike adds 1, Guard adds 2, Burst costs 2."><div class="row between gap6"><strong>⚡ Energy ${b.energy} / 4</strong><small>Starts at 2 each battle</small></div><div class="energy-pips">${Array.from({length:4},(_,i)=>`<span class="energy-pip ${i<b.energy?'filled':''}"></span>`).join('')}</div><div class="energy-rules">Strike <b>+1</b> · Guard <b>+2</b> · Burst <b>−2</b><span>No automatic recharge</span></div></div>
 <div class="matchup-strip ${matchColor}"><span class="matchup-icon">${known?(mult>1?'↗':mult<1?'↘':'◆'):'?'}</span><span>${advice}</span><span class="matchup-value">${known?`${ELEMENTS[at].name} → ${ELEMENTS[dt].name}: ${affinityHint(at,dt)}`:'Attack once to discover this matchup'}</span></div>
 <div class="battle-announcer ${nEffect}" role="status" aria-live="polite"><div class="battle-act"><span class="phase-dot ${b.doing?'busy':''}"></span><strong>${esc(n?.title||b.log)}</strong></div><div class="battle-detail">${esc(n?.detail||(b.doing?'Action in progress…':'Choose your next move below.'))}</div>${effectiveness}</div>
 ${b.showMoves?battleMoveHelp(mine,foe):''}
 <div class="battle-actions"><button class="btn primary move-btn" data-a="attack" data-v="strike" ${b.doing?'disabled':''}><span>⚔️ Strike</span><small>+1 ⚡ → ${Math.min(4,b.energy+1)}/4</small></button><button class="btn amber move-btn" data-a="attack" data-v="burst" ${b.doing||b.energy<2?'disabled':''}><span>✨ Element burst</span><small>−2 ⚡ → ${Math.max(0,b.energy-2)}/4</small></button><button class="btn secondary move-btn signature-btn" data-a="attack" data-v="signature" ${b.doing||b.energy<1||(b.cooldowns[mine.uid]||0)>0?'disabled':''}><span>🌟 ${esc(signatureOf(mine)[0])}</span><small>−1 ⚡ · ${(b.cooldowns[mine.uid]||0)>0?'Ready in '+b.cooldowns[mine.uid]+' actions':esc(signatureOf(mine)[2])}</small></button><button class="btn secondary move-btn" data-a="attack" data-v="guard" ${b.doing?'disabled':''}><span>🛡️ Guard</span><small>+2 ⚡ → ${Math.min(4,b.energy+2)}/4 · shield</small></button><button class="btn secondary move-btn" data-a="catchmenu" ${b.boss||b.arena||b.expedition||b.doing?'disabled':''}><span>🟢 Bond</span><small>${b.boss?'Win to befriend boss for free':`${state.orbs+state.prisms} orbs · capture`}</small></button></div>
 <button class="btn secondary block battle-flee" data-a="flee" ${b.doing?'disabled':''}>🏃 Flee encounter <small>Always succeeds · no penalty</small></button><div class="battle-footer"><button class="btn ghost tiny" data-a="tonic" ${state.tonics<1||b.doing?'disabled':''}>🧪 Tonic +${Math.max(50,Math.ceil(hpMax(mine)*.7))} HP (${state.tonics})</button><button class="btn ghost tiny info-toggle" data-a="moves" aria-expanded="${!!b.showMoves}">${b.showMoves?'✕ Hide moves':'ⓘ Move details'}</button><div class="battle-switch">${teamKin().map((k,i)=>`<button class="${k.uid===mine.uid?'active':''}" data-a="switch" data-v="${k.uid}" ${k.hp<=0||b.doing?'disabled':''} aria-label="Switch to ${esc(nameOf(k))}">${i+1} ${ELEMENTS[SPEC[k.sp].type].icon}</button>`).join('')}</div></div>
 ${hist.length?`<details class="battle-history"><summary>Previous actions (${b.events.length})</summary>${(b.events||[]).map(e=>`<div class="battle-history-line"><b>${esc(e.title)}</b><small>${esc(e.detail)}</small></div>`).join('')}</details>`:''}
 </div></div>`;
 ROOT.insertAdjacentHTML('beforeend',h);if(capture)renderCapture();
}
async function switchKin(uid){
 if(!battle||battle.doing||battle.active===uid||!state.team.includes(uid))return;
 const k=state.kin.find(x=>x.uid===uid);if(!k||k.hp<=0)return;
 const b=battle;b.doing=true;b.active=uid;b.energy=2;b.entry=uid;if(Core.PASSIVES[k.sp][2]==='entry')b.guard=1-Core.PASSIVES[k.sp][3];
 announce(`Go, ${nameOf(k)}!`,'A fresh companion joins your side. The opponent gets a turn next.','player',0,'player','enter');
 await pause(900);if(!battleAlive(b))return;await foeAttack();
}
function renderCapture(){if(!capture||!battle)return;const c=capture;document.getElementById('capture')?.remove();document.body.insertAdjacentHTML('beforeend',`<div class="capture-center" id="capture"><div class="capture-card"><div class="kicker">Bonding ritual</div><h2>Find the perfect moment</h2><div class="subtext">Tap when the golden pointer crosses the glowing green arc.</div><div class="capture-circle"><div class="sweep"></div><div class="inner">${c.kind==='prism'?'🔮':'🟢'}</div></div><button class="btn primary block" data-a="seal">✦ SEAL THE BOND</button><button class="btn ghost tiny mt16" data-a="cancelcapture">Cancel</button><div class="subtext mt12">Weaken wild kin for a stronger bond. Prism orbs give an extra boost.</div></div></div>`)}
function openCapture(kind){if(!battle||battle.boss||battle.arena||battle.expedition||battle.doing)return;if(kind==='orb'&&state.orbs<1||kind==='prism'&&state.prisms<1){toast('You are out of those orbs.');return}closeModal();capture={kind,start:performance.now()};render();renderCapture();sound(740,.12)}
async function sealCapture(){
 if(!capture||!battle||battle.doing)return;
 const b=battle,c=capture,foe=b.foe,period=.97*1000;
 const phase=((performance.now()-c.start)%period)/period,aim=(phase-.18+1)%1,good=aim>.61&&aim<.9,perfect=aim>.71&&aim<.8;
 state[c.kind==='prism'?'prisms':'orbs']--;
 const fmax=foe.guardHp||hpMax(foe),hpRatio=foe.hp/fmax,rar=SPEC[foe.sp].rarity;
 const odds=clamp(.17+(1-hpRatio)*.53+(c.kind==='prism'?.22:0)+(good?.18:0)+(perfect?.12:0)-rar*.065,.08,.97);
 capture=null;document.getElementById('capture')?.remove();b.doing=true;
 announce(`${c.kind==='prism'?'Prism':'Bond'} orb released!`,perfect?'Perfect timing! The bond is strengthening…':good?'Great timing! The bond is forming…':'The orb is struggling to connect…','player',0,'player','ally-windup');
 await pause(850);if(!battleAlive(b))return;
 if(Math.random()<odds){learnFoe();finishBattle(true);toast(perfect?'Perfect timing! Bond formed!':'Bond formed!')}
 else{announce('The bond slipped away!',good?'Almost! The creature broke free. Your opponent acts next.':'The timing was off. The creature broke free and will attack.','incoming',0,'foe','foe-windup');sound(165,.25,'sawtooth');save();await pause(950);if(!battleAlive(b))return;await foeAttack()}
}
function renderModal(content=''){if(!modal)return;document.getElementById('modal')?.remove();document.body.insertAdjacentHTML('beforeend',`<div class="modal-backdrop" id="modal"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">${content}</div></div>`);document.querySelector('#modal button')?.focus({preventScroll:true})}
function showModal(){if(!modal)return;const m=modal;let title='',html='';
if(m.type==='story'){renderModal(`<div class="modal-head"><h2 id="modalTitle">${esc(m.title)}</h2><button class="iconbtn" data-a="close" aria-label="Close dialogue">×</button></div><p class="story-copy">${esc(m.text)}</p>${m.extra||''}<button class="btn ghost block mt12" data-a="close">Return to the map</button>`);return;}
if(m.type==='newJourney'){title='Start fresh';html='<p>This starts a new game and replaces the current save on this device. Export your backup first to keep your creatures and progress.</p><button class="btn secondary block mt12" data-a="backup">Export current save</button><label class="row gap6 mt12"><input id="freshConfirm" type="checkbox"> I saved my backup and understand this replaces my progress.</label><button class="btn primary block mt12" data-a="freshExecute">Start new adventure</button>'}

if(m.type==='detail'){const k=state.kin.find(x=>x.uid===m.uid);if(!k){modal=null;return}const s=SPEC[k.sp],on=state.team.includes(k.uid);title=nameOf(k);html=`<div class="portrait">${svgKin(k)}</div><div class="row between gap6"><div class="row gap6">${typeLabel(s.type)}<span class="pill ${k.aurora?'aurora':''}">${k.aurora?'✨ Aurora':rarities[s.rarity]}</span></div><span class="pill">Lv ${k.level}</span></div><div class="row between mt12"><div class="grow"><strong>${esc(s.name)} ${k.evo?'→ '+esc(s.evolved):''}</strong><div class="subtext">${ZONES[s.zone].name}</div></div><small>XP ${k.xp}/${expNeed(k.level)}</small></div><div class="xpbar"><span style="width:${k.xp/expNeed(k.level)*100}%"></span></div>${[['HP',k.hp,hpMax(k)],['Power',power(k),150],['Defense',defense(k),100]].map(([name,val,max])=>`<div class="statline"><b>${name}</b><div class="progress"><span style="width:${Math.min(100,val/max*100)}%"></span></div><small>${val}</small></div>`).join('')}<div class="row gap6 mt16 wrap"><button class="btn ${on?'secondary':'primary'} grow medium" data-a="teamtoggle" data-v="${k.uid}">${on?'★ Remove from team':'＋ Add to team'}</button><button class="btn secondary medium grow" data-a="giftone" data-v="${k.uid}">🎁 Gift</button></div><div class="row gap6 mt12 wrap"><button class="btn ghost medium grow" data-a="rename" data-v="${k.uid}">✎ Nickname</button><button class="btn danger medium grow" data-a="releaseask" data-v="${k.uid}" ${state.kin.length<=1?'disabled':''}>Release</button></div><button class="btn ghost medium block mt12" data-a="favorite" data-v="${k.uid}">${k.favorite?'⭐ Remove favorite':'☆ Mark as favorite'}</button><div class="panel mt12"><strong>${esc(Core.PASSIVES[k.sp][0])}</strong><p class="subtext mt8">${esc(Core.PASSIVES[k.sp][1])}</p><div class="subtext mt8">Charm: ${esc(state.equipment[k.uid]||'none')} · choose one, 120 coins each</div><div class="row wrap gap6 mt8">${[['power','Power +10% damage'],['ward','Ward −10% damage'],['vital','Vital · 5% Guard heal'],['none','Remove · free']].map(([id,label])=>`<button class="btn secondary tiny" data-a="equip" data-v="${id}" ${state.equipment[k.uid]===id?'disabled':''}>${label}</button>`).join('')}</div></div><div class="panel mt12"><strong>🌟 Signature move</strong><div class="subtext mt8">${esc(signatureBlurb(k))}</div></div>${!k.evo?'<div class="footer-note">Evolves naturally at level 12.</div>':''}`}
else if(m.type==='swap'){title='Swap your battle party';const incoming=state.kin.find(k=>k.uid===m.uid);if(!incoming){modal=null;return}html=`<p class="subtext mb8">Your party has three companions. Choose one to send to the Sanctuary so ${esc(nameOf(incoming))} can join.</p>${teamKin().map(k=>`<button class="swap-choice" data-a="confirmswap" data-v="${k.uid}">${svgSmall(k)}<span><strong>${esc(nameOf(k))}</strong><small> Lv ${k.level} · To Sanctuary</small></span><span>Swap →</span></button>`).join('')}`;}
else if(m.type==='result'){title=m.title;html=`<div class="confetti">${m.win?'🏆 ✨ 🎉':'🏕️ 💚'}</div>${m.foe?`<div class="portrait">${svgKin(m.foe)}</div>`:''}<p class="subtext center" style="font-size:15px;margin-bottom:13px">${esc(m.message)}</p>${m.firstSeal?`<p class="story-copy">${esc(World.REGIONS[m.firstSeal-1].climax)}</p>`:''}${m.ending?`<p class="story-copy">${esc(World.ENDING)}</p>`:''}${renderXpRows(m.experience)}${m.nextTournament?'<button class="btn amber block mt12" data-a="nextmatch">Continue tournament</button>':''}${Number.isInteger(m.guardianOffer)?`<button class="btn amber block mt12 guardian-claim" data-a="claimguardian">👑 Befriend ${esc(ZONES[m.guardianOffer].guardian)} · FREE</button><div class="subtext center mt8">Guaranteed capture after winning · no Bond orb required</div>`:'' }<div class="panel center"><strong style="color:var(--gold)">${esc(m.bonus||'Your companions are waiting at camp.')}</strong></div><button class="btn primary block mt16" data-a="close">Continue journey</button>`}
else if(m.type==='catchmenu'){title='Choose a bonding orb';const f=battle?.foe;html=`<p class="subtext mb8">A weakened creature is easier to befriend. Match the moving marker for a bonus!</p><div class="panel">${[['orb','🟢','Bond orb',state.orbs,'Standard bonding chance'],['prism','🔮','Prism orb',state.prisms,'Higher chance of a successful bond']].map(([kind,ic,n,count,sub])=>`<div class="camp-item"><span class="item-icon">${ic}</span><div class="grow"><strong>${n}</strong><div class="subtext">${sub} · ${count} left</div></div><button class="btn primary tiny" data-a="chooseorb" data-v="${kind}" ${count===0?'disabled':''}>Choose</button></div>`).join('')}</div><div class="subtext mt12">Target HP: ${f?.hp||0}/${f?.guardHp||hpMax(f)}</div>`}
else if(m.type==='trade'){title='Gift a companion';html=`<div class="subtext mb8">Choose a Wildkin, then share a QR code or link. Your friend opens it on their phone and accepts the gift.</div><div class="panel"><label class="kicker" for="tradechoose">Creature to gift</label><select class="formbox mt8" id="tradechoose">${state.kin.map(k=>`<option value="${k.uid}" ${m.uid===k.uid?'selected':''}>${esc(nameOf(k))} · Lv ${k.level}${k.aurora?' ✨':''}</option>`).join('')}</select><button class="btn primary block mt12" data-a="giftselected">Create gift link / QR</button></div><div class="divider"></div><label class="kicker" for="giftinput">Have a gift code?</label><textarea id="giftinput" class="formbox mt8" rows="3" placeholder="Paste a Wildkin gift link or W1... code"></textarea><button class="btn secondary block mt12" data-a="importgift">Accept a gift</button><div class="footer-note">Gifts copy one creature. They are not secure two-way trades: the sender keeps their original, and links can be reused. Do not share with strangers.</div>`}
else if(m.type==='gift'){title='Your Wildkin gift';html=`<div class="center"><div class="kicker">Scan with a phone camera</div><div id="giftqr" class="trade-qr"><small style="color:#123">Generating QR...</small></div><div class="subtext">Or send this link directly:</div></div><div class="trade-code mt12">${esc(m.url)}</div><div class="row gap6 mt12"><button class="btn primary grow medium" data-a="copygift">📋 Copy link</button><button class="btn secondary grow medium" data-a="sharegift">↗ Share</button></div><div class="footer-note">The creature is a copy. Your original stays with you. The receiver must open this link in the game.</div>`}
else if(m.type==='incoming'){title='A gift found!';const k=m.kin;html=`<div class="portrait">${svgKin(k)}</div><div class="center"><h2>${esc(nameOf(k))}</h2><div class="subtext mt8">Level ${k.level} · ${ELEMENTS[SPEC[k.sp].type].name} ${k.aurora?'· Aurora ✨':''}</div></div><button class="btn primary block mt16" data-a="acceptgift">💚 Welcome to my collection</button><button class="btn secondary block mt12" data-a="closegift">Not now</button>`}
else if(m.type==='confirmrelease'){const k=state.kin.find(x=>x.uid===m.uid);title='Release companion?';html=`<p class="subtext">Let ${esc(nameOf(k))} return to the wild? This cannot be undone, but its KinDex record will remain.</p><button class="btn danger block mt16" data-a="release" data-v="${k.uid}">Yes, release ${esc(nameOf(k))}</button>`}
else if(m.type==='rename'){title='Give a nickname';html=`<label for="nickname" class="kicker">Companion name</label><input class="formbox mt8" id="nickname" maxlength="18" placeholder="Nickname (up to 18 characters)" value="${esc(state.kin.find(k=>k.uid===m.uid)?.nickname||'')}"><button class="btn primary block mt12" data-a="saverename" data-v="${m.uid}">Save nickname</button>`}
else if(m.type==='help'){title='How to play';html=`<div class="panel"><h3>1. Explore and capture</h3><p class="subtext mt8">Choose a trail within each region, then tap Explore to encounter creatures. Rare trails offer better odds of rare creatures; the first search at each trail earns discovery coins. Tap Explore to discover creatures. Battle to reduce their HP, then use a Bond orb and tap at the right time to seal the bond.</p><div class="divider"></div><h3>2. Build your team</h3><p class="subtext mt8">Choose up to 3 companions. Energy starts at 2/4 at the beginning of each battle and does not recharge by itself. Strike gives +1, Guard gives +2 (up to 4), and Element burst spends 2. Switching resets energy to 2. Flee always works, even against a Guardian, with no penalty. Strike builds energy, Element burst spends it for bigger damage, and Guard heals a little and greatly reduces the next hit. Each species has an elemental advantage or weakness. Attack once to discover its matchup, then use Move details in battle to plan ahead. Swap teammates at any time, but your opponent gets a turn.</p><div class="divider"></div><h3>3. Grow and explore</h3><p class="subtext mt8">All companions on your three-creature battle party gain full XP after winning, capturing, or losing a battle, including fainted companions. Sanctuary creatures do not receive battle XP. Fleeing gives no XP. Companions evolve at level 12. After enough wins in each region, face its Guardian to unlock the next trail. Defeat a Guardian boss to recruit it for free as a special crowned creature. You can also retreat and retry later.</p><div class="divider"></div><h3>4. Play long-term</h3><p class="subtext mt8">Complete daily quests, seek rare Aurora creatures, discover all 60 forms, collect seals and challenge stronger guardians again.</p></div>`}
else if(m.type==='credits'){title='About Wildkin';html=`<div class="panel"><h3>The Living Wilds · v${APP_VERSION}</h3><p class="subtext mt12">An original, single-player, family-friendly creature collecting game. It features 30 species families, 60 forms, six regions, battles, guardians, daily quests, gifting and offline-capable local saves.</p><div class="divider"></div><p class="subtext">No account, ads, in-app purchases, multiplayer server, or tracking. Creatures and gameplay are original. Creature gifting is not a secure transfer system.</p></div>`}
else if(m.type==='dexdetail'){const s=SPEC[m.sp],k=makePreview(s.id);k.evo=!!m.evo;title=state.caught.includes(`${m.sp}:${m.evo}`)?(m.evo?s.evolved:s.name):'Undiscovered form';html=`<div class="portrait">${state.caught.includes(`${m.sp}:${m.evo}`)?svgKin(k):'<div style="font-size:95px">❔</div>'}</div><div class="center">${typeLabel(s.type)}<p class="subtext mt12">Habitat: ${ZONES[s.zone].name}. ${rarities[s.rarity]} species.</p>${m.evo?'<p class="subtext mt8">An evolved form of this creature family.</p>':''}</div>`}
renderModal(`<div class="modal-head"><h2 id="modalTitle">${esc(title)}</h2><button class="iconbtn close" data-a="close" aria-label="Close dialog">×</button></div>${html}`);if(m.type==='gift')drawQr(m.url)}
let qrLoading=false;
function drawQr(url){const el=document.getElementById('giftqr');if(!el)return;if(window.QRCode){try{el.textContent='';new QRCode(el,{text:url,width:170,height:170,colorDark:'#132b36',colorLight:'#ffffff',correctLevel:QRCode.CorrectLevel.L})}catch{el.textContent='QR unavailable. Copy the link below.'}}else{
 el.textContent='Copy the link below. QR display is optional and requires internet.';
 if(navigator.onLine&&!qrLoading){qrLoading=true;const script=document.createElement('script');script.src='https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';script.onload=()=>drawQr(url);script.onerror=()=>{qrLoading=false};document.head.appendChild(script)}
}}
function closeModal(){modal=null;document.getElementById('modal')?.remove()}
function teamToggle(uid){
 const k=state.kin.find(x=>x.uid===uid);if(!k)return;
 if(state.team.includes(uid)){
  if(state.team.length===1){toast('Keep at least one companion in your battle party.');return}
  state.team=state.team.filter(x=>x!==uid);
 }else if(state.team.length>=3){modal={type:'swap',uid};showModal();return}
 else state.team.push(uid);
 save();modal={type:'detail',uid};render();
}
function swapKin(outUid){
 const incoming=modal?.uid;if(!incoming||!state.team.includes(outUid)||state.team.includes(incoming)||!state.kin.some(k=>k.uid===incoming))return;
 state.team[state.team.indexOf(outUid)]=incoming;
 save();modal={type:'detail',uid:incoming};render();toast('Party updated. The other companion is safe in your Sanctuary.');
}
function buy(id){const prices={orb:45,prism:155,tonic:75};if(!(id in prices)||state.coins<prices[id])return;state.coins-=prices[id];state[id==='orb'?'orbs':id==='prism'?'prisms':'tonics']++;save();sound(650,.1);render();toast('Supply purchased!')}
function healAll(){state.kin.forEach(k=>k.hp=hpMax(k));state.lastHeal=Date.now();save();render();toast('Everyone feels refreshed!')}
function claim(id){const q=dailyQuests().find(x=>x.id===id);if(!q||state.daily.claimed.includes(id)||(state.daily.progress[id]||0)<q.need)return;state.coins+=q.reward;state.daily.claimed.push(id);state.orbs++;save();render();sound(920,.18);toast(`Quest complete! +${q.reward} coins and 1 Bond orb`)}
function giftCode(k){const data={v:1,s:k.sp,l:k.level,e:k.evo?1:0,a:k.aurora?1:0,x:k.xp};const raw=btoa(JSON.stringify(data)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');let hash=2166136261;for(let i=0;i<raw.length;i++){hash^=raw.charCodeAt(i);hash=Math.imul(hash,16777619)}return `W1.${raw}.${(hash>>>0).toString(36)}`}
function decodeGift(str){try{const text=String(str||'').trim();let code=text;if(text.includes('gift=')){const url=new URL(text,location.href);code=url.searchParams.get('gift')||''}const pieces=code.split('.');if(pieces.length!==3||pieces[0]!=='W1'||code.length>1000)throw Error('Invalid gift');let hash=2166136261;for(const char of pieces[1]){hash^=char.charCodeAt(0);hash=Math.imul(hash,16777619)}if((hash>>>0).toString(36)!==pieces[2])throw Error('Damaged gift');const a=JSON.parse(atob(pieces[1].replace(/-/g,'+').replace(/_/g,'/')));if(a.v!==1||!Number.isInteger(a.s)||a.s<0||a.s>=SPEC.length||!Number.isInteger(a.l)||a.l<1||a.l>60||![0,1].includes(a.e)||![0,1].includes(a.a)||!Number.isInteger(a.x)||a.x<0||a.x>10000)throw Error('Invalid companion');const k=makeKin(a.s,a.l,!!a.a,!!a.e);k.xp=Math.min(a.x,expNeed(k.level)-1);return k}catch{return null}}
function giftsFromURL(){const code=new URLSearchParams(location.search).get('gift');if(!code)return;history.replaceState(null,'',location.pathname+location.hash);const k=decodeGift(code);if(!k){toast('This gift link could not be read.');return}modal={type:'incoming',kin:k};showModal()}
function generateGift(uid){const k=state.kin.find(x=>x.uid===uid);if(!k)return;const code=giftCode(k),url=`${location.origin}${location.pathname}?gift=${encodeURIComponent(code)}`;modal={type:'gift',url,code};render()}
function acceptGift(){const k=modal?.kin;if(!k)return;state.kin.push(k);state.caught=[...new Set([...state.caught,`${k.sp}:${k.evo?1:0}`])];state.seen=[...new Set([...state.seen,`${k.sp}:${k.evo?1:0}`])];state.totalCatches++;if(state.team.length<3)state.team.push(k.uid);save();closeModal();render();toast(`${nameOf(k)} has joined your family!`)}
function exportBackup(){
 try{const text=Core.backup(state);Core.restore(text);const blob=new Blob([text],{type:'application/json'}),u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=`wildkin-backup-${new Date().toISOString().slice(0,10)}.json`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),4000);toast('Verified backup created. Save the downloaded file.');}catch(error){console.error(error);toast('Backup validation failed. Your current save was kept.');}
}
function restoreBackup(){
 const f=document.createElement('input');f.type='file';f.accept='application/json,.json';f.onchange=async()=>{
 const file=f.files?.[0];if(!file)return;
 try{
  if(battle||resetInProgress)throw Error('Finish the encounter first.');
  if(file.size>25000000)throw Error('Backup exceeds 25 MB.');
  const restored=Core.restore(await file.text());
  if(!confirm('Replace this device’s Wildkin progress with this verified backup?'))return;
  await vaultWriteQueue.catch(()=>{});
  restored.revision=(state?.revision||0)+1;restored.updatedAt=Date.now();restored.writerId=SESSION_ID;const snapshot=JSON.stringify(restored);let stored=await writeVaultDb(snapshot);
  try{localStorage.setItem(KEY,snapshot);stored=true}catch{}
  if(!stored)throw Error('Device storage could not save this backup.');
  stopMusic();state=restored;unreadableSaves.length=0;battle=null;modal=null;capture=null;expansionInit();healCollectionAfterBattle();save();render();toast('Verified backup restored.');
 }catch(error){toast(error.message||'That is not a valid Wildkin backup.');}
 };f.click();
}
// Living Wilds campaign and replay systems. State stays in the existing save.
function expansionInit(){
 if(!state)return;
 state.schema=Core.SCHEMA;state.research=state.research||{};state.arenaWins=state.arenaWins||0;state.arenaTier=state.arenaTier||0;state.arenaMedals=state.arenaMedals||[];state.expedition=state.expedition||null;state.habitat=state.habitat||0;state.teamPresets=state.teamPresets||[];
 state.story=state.story||{};state.story.completed=state.story.completed||[];state.story.choices=state.story.choices||{};state.story.journal=state.story.journal||[];
 state.hunt=state.hunt||{};state.achievements=state.achievements||{};state.equipment=state.equipment||{};state.decor=state.decor||[];state.affection=state.affection||{};state.settings=state.settings||{speed:1,reduced:false,hints:true,music:false};
 if(!state._researchMigrated){for(const k of state.kin){const r=state.research[k.sp]||(state.research[k.sp]={seen:0,won:0,caught:0,claimed:0,evolved:0});r.seen=Math.max(1,r.seen||0);r.caught=Math.max(1,r.caught||0);if(k.evo)r.evolved=Math.max(1,r.evolved||0)}state._researchMigrated=true;}
}
function nodeId(z,r,n){return z+':'+r+':'+n}
function nodeDone(z,r,n){return state.story.completed.includes(nodeId(z,r,n))}
function routeDone(z,r){return World.REGIONS[z].routes[r].every((_,n)=>nodeDone(z,r,n))}
function guardianReady(z){return state.badges.includes(z)||([0,1,2].filter(r=>routeDone(z,r)).length>=2&&(state.wins[z]||0)>=3+z)}
function storyDialog(title,text,extra=''){modal={type:'story',title,text,extra};showModal()}
function showStoryIntro(){const z=state.zone,r=World.REGIONS[z];storyDialog(r.title,r.npc+': '+r.intro,'<button class="btn primary block mt12" data-a="tutorialdone">Begin exploring</button>')}
function enterNode(id){
 const [z,r,n]=id.split(':').map(Number),event=World.REGIONS[z]?.routes[r]?.[n];
 if(!event||z!==state.zone||!unlocked(z)||n>0&&!nodeDone(z,r,n-1))return;
 if(nodeDone(z,r,n)){storyDialog(event.title,event.text);return}
 if(event.kind==='battle'){startEncounter(false);if(battle){battle.storyNode=id;battle.log=event.text;render()}return}
 const buttons=event.options.length?event.options.map((label,i)=>`<button class="btn secondary block mt12" data-a="storychoice" data-v="${id}" data-choice="${i}">${esc(label)}</button>`).join(''):`<button class="btn primary block mt12" data-a="storychoice" data-v="${id}" data-choice="0">${event.kind==='secret'?'Record discovery':'Continue'}</button>`;
 storyDialog(event.title,event.text,buttons);
}
function completeStory(id,choice=0){
 const [z,r,n]=id.split(':').map(Number),event=World.REGIONS[z]?.routes[r]?.[n];
 if(!event||z!==state.zone||nodeDone(z,r,n)||n>0&&!nodeDone(z,r,n-1))return false;
 if(event.kind==='puzzle'&&choice!==event.answer){toast('That does not fit the clues. Read them once more.');return false}
 state.story.completed.push(id);state.story.choices[id]=choice;state.story.journal.push(event.title+': '+event.text);
 const label=event.options[choice]||'';let reward='';
 if(label.includes('supplies')){state.orbs+=2;state.tonics++;reward='2 Bond orbs and a tonic'}
 else if(label.includes('tonics')){state.tonics+=3;reward='3 recovery tonics'}
 else if(label.includes('research')){const sp=zoneSpecies(z)[r%5].id;recordResearch(sp,'seen');state.prisms++;reward='a field observation and a Prism orb'}
 else{const coins=(event.kind==='secret'?100:45)+z*15;state.coins+=coins;reward=coins+' coins'}
 if(event.kind==='secret'){state.hunt[z]=Math.min(24,(state.hunt[z]||0)+4)}
 state.totalSearches++;activity('search');state.trailVisits=state.trailVisits||{};state.trailVisits[z+':'+r]=(state.trailVisits[z+':'+r]||0)+1;
 save();if(event.kind!=='battle'){render();storyDialog('Discovery recorded',event.title+' earned '+reward+'. Your next trail node is open.')}return true;
}
function mapScenery(z){
 const tree=(x,y,color='#b2cda3')=>`<g transform="translate(${x} ${y})"><path d="M0 2v18" stroke="#4c4c3b" stroke-width="5"/><path d="M-14 5Q-27-11-8-18Q0-35 12-18Q31-10 15 6Z" fill="${color}" stroke="#183e3c" stroke-width="2"/></g>`;
 const tower=(x,y)=>`<g transform="translate(${x} ${y})"><path d="M-11 25-8-12H8l11 37Z" fill="#f5dfac" stroke="#294c4a" stroke-width="2"/><path d="M-14-13 0-25 14-13Z" fill="#b86e65"/><rect x="-5" y="-12" width="10" height="10" fill="#ffeaa7"/><path d="M-5 13H6v12H-5Z" fill="#547f79"/></g>`;
 return [
 `<circle cx="269" cy="24" r="13" fill="#ffe8ad"/>${tree(26,131)}${tree(271,151)}${tree(168,43)}${tower(210,59)}<path d="M91 137q17-24 33 0" stroke="#b59065" stroke-width="8" fill="none"/>${[[20,82],[155,108],[243,163],[290,50]].map(([x,y])=>`<path d="M${x} ${y}v11" stroke="#8cbc82" stroke-width="2"/><circle cx="${x}" cy="${y}" r="4" fill="#ffe6ac"/>`).join('')}`,
 `${tree(34,128,'#8fa3bd')}${tree(102,33,'#8fa3bd')}${tree(269,155,'#8fa3bd')}<g transform="translate(210 53)"><path d="M-22 35Q-12-1 9-7L16-39l11 11-5 32Q39 24 31 35Z" fill="#5c6e86" stroke="#abc5c6" stroke-width="2"/><path d="M-7 35V9Q4-5 13 9v26" fill="#273a58"/><circle cx="5" cy="7" r="4" fill="#c6e5c5"/></g>${[55,146,235].map((x,i)=>`<path d="M${x} 166v-11" stroke="#e6d7ce" stroke-width="4"/><path d="M${x-10} 155q10-19 20 0Z" fill="${['#d8b5e5','#a9dfd6','#ddb9a6'][i]}"/>`).join('')}`,
 `<path d="M0 20q50 20 80 0t80 0t80 0t80 0" stroke="#b0e2df" stroke-width="3" fill="none" opacity=".5"/>${tower(206,47)}<path d="m234 151 48-5-10 16h-31Z" fill="#af877a" stroke="#273e4e" stroke-width="2"/><path d="M255 149v-25l17 19Z" fill="#e9d6ac"/><path d="M24 157v-19m0 11-8-7m8 1 10-8" stroke="#f4b7b0" stroke-width="5" stroke-linecap="round"/><path d="M98 35v-14m0 9 10-9" stroke="#c9dcb2" stroke-width="5"/>`,
 `<path d="m168 84 45-75 48 75Z" fill="#77576a" stroke="#e5b499" stroke-width="2"/><path d="m198 34 15-25 15 25-13-4-7 7Z" fill="#f9c080"/><path d="M212 35q-10 26 9 39" stroke="#ef9573" stroke-width="6" fill="none"/><path d="M194 9q-14-22 6-23m15 23q13-28 27-14" stroke="#dbb0a2" stroke-width="8" fill="none" opacity=".4"/><path d="m25 149 13-29 16 32m210-14 13-24 17 31" fill="#403e59" stroke="#aa8b9d" stroke-width="2"/>`,
 `<path d="m15 104 39-78 37 78m100-28 41-68 40 68" fill="#7389a5" stroke="#b9d5db" stroke-width="2"/><path d="m43 48 11-22 11 22-11-5Z" fill="#e8f1e4"/><path d="m213 39 19-31 19 31-18-8Z" fill="#e8f1e4"/><path d="M50 155q50 15 100-7" stroke="#d5c6a1" stroke-width="3" stroke-dasharray="3 3" fill="none"/><path d="m212 135 26-18 26 18-26-5Z" fill="#f1d8a4" stroke="#3d536c" stroke-width="2"/><path d="m238 131 0 17" stroke="#eed8a4" stroke-width="2"/>`,
 `${[[23,23],[114,20],[286,35],[278,163],[38,170]].map(([x,y])=>`<path d="m${x} ${y-5} 2 4 4 1-4 2-2 4-1-4-4-2 4-1Z" fill="#f6e3bb"/>`).join('')}<g transform="translate(205 62)"><path d="M-27 18V-8L0-29 27-8v26Z" fill="#7e739a" stroke="#e6d1c4" stroke-width="2"/><path d="M-8 18V-4Q0-19 8-4v22" fill="#d5c0db"/><circle cx="0" cy="-15" r="5" fill="#fff0b8"/></g><path d="M264 136q-14-2-19-15l36-13-13 34Z" fill="#9c98c3" stroke="#d8c9e1" stroke-width="2"/><path d="m247 122-21-26 24 13-6-22 20 21" fill="#e8c8bb" opacity=".7"/>`
 ][z];
}

function mapSvg(z){const points=[[34,57],[87,86],[140,55],[67,137],[138,156],[206,125],[191,38],[251,64],[280,114]],r=World.REGIONS[z];return `<svg class="route-map" viewBox="0 0 320 192" role="img" aria-label="${ZONES[z].name} branching trail map"><rect width="320" height="192" rx="20" fill="${ZONES[z].ground}"/><path d="M0 145Q70 80 125 140T320 95V192H0Z" fill="${ZONES[z].hill}"/><path d="M0 167Q90 114 175 167T320 148" stroke="${ZONES[z].sky1}" stroke-width="11" opacity=".4" fill="none"/>${mapScenery(z)}${[0,1,2].map(route=>{const p=points.slice(route*3,route*3+3);return `<path d="M160 184L${p.map(x=>x.join(' ')).join('L')}" stroke="#f5e8b7" stroke-width="3" stroke-dasharray="5 5" fill="none"/>${p.map(([x,y],n)=>`<circle cx="${x}" cy="${y}" r="${nodeDone(z,route,n)?10:7}" fill="${nodeDone(z,route,n)?'#bdf2ab':'#fff0ca'}" stroke="#233f48" stroke-width="3"/><text x="${x}" y="${y+4}" text-anchor="middle" fill="#173642" font-size="11">${route+1}</text>`).join('')}`}).join('')}<text x="160" y="183" text-anchor="middle" fill="#fff0c4" font-size="18">✦</text></svg>`}
function exploreScreen(){
 const z=state.zone,r=World.REGIONS[z],count=r.routes.flat().length,done=state.story.completed.filter(id=>id.startsWith(z+':')).length,ready=guardianReady(z);
 return `<div class="row between"><div><div class="kicker">Chapter ${z+1} · ${esc(r.npc)}</div><h2>${ZONES[z].name}</h2></div><span class="pill">${state.badges.length}/6 seals</span></div><div class="area-tabs">${ZONES.map((a,i)=>`<button class="area-tab ${i===z?'selected':''}" data-a="zone" data-v="${i}" ${unlocked(i)?'':'disabled'}>${unlocked(i)?a.icon:'🔒'} ${a.short}</button>`).join('')}</div><section class="world-card">${mapSvg(z)}<div class="panel"><div class="kicker">${esc(r.title)}</div><p class="subtext mt8">${esc(r.intro)}</p><button class="btn ghost tiny mt8" data-a="journal">Read journal · ${done}/${count} discoveries</button></div></section>${state.story.ending?'<div class="note-card mt12">✦ Story complete. Rematches, mastery and the living wilds await.</div>':''}<div class="section-line"><h2>Branching trails</h2><span class="pill">Choose your route</span></div>${r.routes.map((events,route)=>`<section class="panel mt12 route-panel"><div class="row between"><h3>${TRAILS[z][route][1]} ${TRAILS[z][route][0]}</h3><small>${routeDone(z,route)?'✓ Complete':'Optional discoveries'}</small></div><div class="route-nodes mt12">${events.map((event,n)=>`<button class="route-node ${nodeDone(z,route,n)?'complete':''}" data-a="storynode" data-v="${nodeId(z,route,n)}" ${n>0&&!nodeDone(z,route,n-1)?'disabled':''}><span>${nodeDone(z,route,n)?'✓':{puzzle:'◇',battle:'⚔',secret:'✦',choice:'↔',dialogue:'☏'}[event.kind]}</span><span><strong>${esc(event.title)}</strong><small>${event.kind==='battle'?'Tactical encounter':event.kind==='puzzle'?'Solve the clue':event.kind==='secret'?'Secret discovery':event.kind==='choice'?'Choose an outcome':'Meet and listen'}</small></span><span>›</span></button>`).join('')}</div><div class="row between gap6 mt12"><small>Wild encounters · ${['common','unusual','rare'][route]} trail</small><button class="btn secondary tiny" data-a="wildtrail" data-v="${route}">Roam here</button></div></section>`).join('')}<section class="panel mt16"><h3>👑 ${ZONES[z].guardian}</h3><p class="subtext mt8">${esc(Core.GUARDIANS[z].hint)}</p><p class="subtext mt8">${state.badges.includes(z)?'Seal earned. Rematches scale with your team.':`Complete any two routes and win ${3+z} encounters here. Progress: ${[0,1,2].filter(i=>routeDone(z,i)).length}/2 routes · ${Math.min(3+z,state.wins[z])}/${3+z} wins.`}</p><button class="btn amber block mt12" data-a="boss" ${ready?'':'disabled'}>${state.badges.includes(z)?'Guardian rematch':z===5?'Enter the Still Heart':'Challenge the Guardian'}</button></section><div class="note-card mt12"><span>✨</span><div>Aurora trail signs: <b>${state.hunt[z]||0}/24</b><div class="subtext">Every non-Aurora wild encounter adds a sign. The 25th is guaranteed Aurora. Secrets add four signs.</div></div></div>`;
}
function recordResearch(id,kind){if(!state)return;expansionInit();const r=state.research[id]||{seen:0,won:0,caught:0,evolved:0,claimed:0};r[kind]=(r[kind]||0)+1;state.research[id]=r}
function researchRank(id){return Core.researchRank(state.research[id])}
const ACHIEVEMENTS=[['first','First friendship',s=>s.totalCatches>=2,80],['explorer','Six paths',s=>s.story.completed.length>=18,180],['keeper','Living beacon',s=>s.badges.length>=3,250],['ending','Room to grow',s=>s.story.ending,500],['collector','Thirty families',s=>new Set(s.caught.map(x=>x.split(':')[0])).size>=30,600],['forms','Living library',s=>new Set(s.caught).size>=60,1000],['aurora','Another light',s=>s.kin.some(k=>k.aurora),250],['arena','A crown earned',s=>s.arenaMedals.length>=4,750]];
function researchScreen(){return `<div class="kicker">Field research</div><h2>The living record</h2><p class="subtext mt8">Observe, win three encounters, bond once, and evolve each family. Four milestones, each rewarding 45 coins.</p><div class="section-line"><h3>Achievements</h3></div>${ACHIEVEMENTS.map(([id,title,check,reward])=>`<div class="panel mt8 row between gap6"><div><strong>${title}</strong><small>${state.achievements[id]?'✓ Reward claimed':check(state)?'Ready to claim': 'Keep exploring'}</small></div><button class="btn secondary tiny" data-a="achievement" data-v="${id}" ${!check(state)||state.achievements[id]?'disabled':''}>${reward} coins</button></div>`).join('')}${SPEC.map(x=>{const r=state.research[x.id]||{},rank=researchRank(x.id);return `<div class="panel mt12"><div class="row between"><strong>${r.seen?esc(x.name):'Unknown family'}</strong><span class="pill">${rank}/4</span></div><div class="subtext mt8">Observe ${Math.min(1,r.seen||0)}/1 · Win ${Math.min(3,r.won||0)}/3 · Bond ${Math.min(1,r.caught||0)}/1 · Evolve ${Math.min(1,r.evolved||0)}/1</div>${rank>(r.claimed||0)?`<button class="btn primary tiny mt8" data-a="researchclaim" data-v="${x.id}">Claim ${(rank-(r.claimed||0))*45} coins</button>`:''}</div>`}).join('')}`}
function expeditionScreen(){const e=state.expedition;return `<div class="kicker">No timers · every route stays available</div><h2>Beyond the beacons</h2><div class="panel mt12"><p class="subtext">Travel six stages with five supplies. Take a safe route, risk a contested cache, or forage. Sentinels challenge you at stages 2, 4 and 6. Contested caches add an extra battle. Battles protect your haul. A defeat or escape loses the unsecured haul. Extract at any time to keep half; finish to keep everything and earn two Prism orbs.</p>${e?`<h3 class="mt12">Stage ${e.step+1}/6 · ${e.supplies} supplies</h3><strong>${e.loot} coins in your pack</strong><p class="subtext mt8">${esc(e.last)}</p><div class="stack mt12"><button class="btn primary" data-a="expchoice" data-v="safe">Ridge path · 1 supply · modest cache</button><button class="btn amber" data-a="expchoice" data-v="risk">Contested cache · 1 supply · battle for more</button><button class="btn secondary" data-a="expchoice" data-v="forage">Forage · regain supplies · uncertain discovery</button><button class="btn ghost" data-a="extract">Extract · bank ${Math.floor(e.loot/2)} coins</button></div>`:'<button class="btn primary block mt12" data-a="expbegin">Begin expedition</button>'}</div>`}
function expeditionChoice(choice){const e=state.expedition;if(!e||battle)return;const rng=Core.seeded(e.seed+e.step*103),roll=rng();e.step++;
 if(choice==='forage'){e.supplies=Math.min(8,e.supplies+2);e.loot+=15;e.last=roll<.35?'A field researcher trades a map for a spare orb.': 'You gather food and chart a sheltered path.';if(roll<.35)state.orbs++;if(e.step%2===0)startExpeditionEncounter();else finishExpeditionStep();return}
 if(e.supplies<1){e.step--;toast('No supplies. Forage or extract your haul.');return}
 e.supplies--;const gain=choice==='risk'?95+Math.floor(roll*70):30+Math.floor(roll*35);e.loot+=gain;
 e.last=choice==='risk'?'A rival guards the cache. Win to keep your expedition moving.':roll<.5?'A sheltered bridge leads to an untouched cache.':'You guide a lost traveler to safety and share the supplies.';
 if(choice==='risk'||e.step%2===0){startExpeditionEncounter();return}
 finishExpeditionStep();
}
function startExpeditionEncounter(){const e=state.expedition;if(!e)return;startEncounter(false,false,'expedition');if(battle){const level=clamp(Math.round(teamKin().reduce((sum,k)=>sum+k.level,0)/state.team.length),1,60),families=SPEC.filter(s=>unlocked(s.zone)),rng=Core.seeded(e.seed+e.step);battle.foe=makeKin(families[Math.floor(rng()*families.length)].id,level,false,level>=12);observeFoe(battle.foe);battle.intent=Core.intent(battle,battle.foe);battle.expedition=true;e.pending=true;battle.log='An expedition sentinel challenges your route. Win to secure your pack.';save();render()}}
function finishExpeditionStep(){const e=state.expedition;if(!e)return;if(e.step>=6){state.coins+=e.loot;state.prisms+=2;state.expedition=null;toast('Expedition complete! Haul secured and two Prism orbs earned.')}save();render()}
function arenaScreen(){return `<div class="kicker">Curated three-companion teams</div><h2>The living crown</h2><p class="subtext mt8">Win three consecutive matches to earn a tier medal. Your party heals after each match. Escaping or losing ends the bracket; retry freely. Opponents use recovery, charging and counter strategies.</p>${World.ARENA.map((a,i)=>`<div class="panel mt12"><div class="row between"><h3>${esc(a.name)}</h3><span>${state.arenaMedals.includes(i)?'🏅':''}</span></div><p class="subtext mt8">${esc(a.theme)} · Lv ${[10,20,32,44][i]}</p><div class="row gap6 mt8">${a.team.map(sp=>svgSmall({sp,level:20,evo:i>0,aurora:false})).join('')}</div><button class="btn primary block mt12" data-a="tournament" data-v="${i}" ${state.badges.length<i+1?'disabled':''}>${state.badges.length<i+1?'Earn '+(i+1)+' seals to enter':'Enter three-match tournament'}</button></div>`).join('')}<section class="panel mt16"><h3>Party presets</h3><button class="btn secondary block mt12" data-a="presetsave">Save current party · four slots</button>${state.teamPresets.map((p,i)=>`<button class="btn secondary block mt8" data-a="presetload" data-v="${i}">Party ${i+1}: ${p.map(id=>esc(nameOf(state.kin.find(k=>k.uid===id)))).join(', ')}</button>`).join('')}</section>`}
let tournament=null;
function startTournament(tier,index=0){if(state.badges.length<tier+1)return;tournament={tier,index};startEncounter(false,true);if(!battle)return;const a=World.ARENA[tier],level=[10,20,32,44][tier]+index;const roster=a.team.map((_,i)=>makeKin(a.team[(i+index)%3],Math.min(60,level),false,level>=12));battle.foe=roster.shift();observeFoe(battle.foe);battle.foeQueue=roster;battle.region=state.zone;battle.intent=Core.intent(battle,battle.foe);battle.log=a.name+' · Match '+(index+1)+'/3';battle.tournament={...tournament};render()}
function habitatScreen(){const names=['Sunlit Garden','Coral Cove','Ember Terrace','Moonlit Grove'],limits=[0,8,20,35],lead=state.kin.find(k=>k.uid===state.team[0]),decor=['🌷','🪨','🏮','🍄','🐚','🌠'];return `<div class="kicker">A home with room to grow</div><h2>Your habitat</h2><div class="panel mt12 center habitat-theme-${state.habitat}"><div class="habitat-garden"><div class="habitat-friend">${svgKin(lead)}</div><div class="decorations">${state.decor.map(i=>`<span>${decor[i]}</span>`).join('')}</div></div><h3>${names[state.habitat]}</h3><p class="subtext mt8">${esc(nameOf(lead))} · ${state.affection[lead.uid]||0} shared moments</p><button class="btn primary block mt12" data-a="companion">Spend a moment together</button></div><div class="habitat-options mt12">${names.map((n,i)=>`<button class="btn ${state.habitat===i?'primary':'secondary'}" data-a="habitat" data-v="${i}" ${state.totalCatches<limits[i]?'disabled':''}>${n}${state.totalCatches<limits[i]?' · '+limits[i]+' bonds':''}</button>`).join('')}</div><div class="panel mt12"><h3>Earned decorations</h3><p class="subtext mt8">Each regional seal unlocks a decoration. Tap to place or remove.</p><div class="row wrap gap6 mt12">${decor.map((d,i)=>`<button class="btn secondary" data-a="decoration" data-v="${i}" ${!state.badges.includes(i)?'disabled':''}>${d} ${state.decor.includes(i)?'✓':''}</button>`).join('')}</div></div>`}
let musicTimer=null,musicStep=0;
function stopMusic(){clearInterval(musicTimer);musicTimer=null}
function startMusic(){if(musicTimer||!state?.settings?.music||!state.sound)return;const notes=[261.63,329.63,392,493.88,440,392,329.63,293.66];musicTimer=setInterval(()=>{if(!document.hidden&&state?.sound)sound(notes[(musicStep++ +state.zone*2)%notes.length],.65,'sine')},850)}
function settingsPanel(){return `<div class="panel mt16"><h3>Comfort and accessibility</h3><div class="stack mt12"><button class="btn secondary" data-a="speed">Battle speed · ${state.settings.speed}×</button><button class="btn secondary" data-a="motion">Reduced motion · ${state.settings.reduced?'on':'off'}</button><button class="btn secondary" data-a="music">Ambient melody · ${state.settings.music?'on':'off'}</button><button class="btn secondary" data-a="hinttoggle">Battle hints · ${state.settings.hints?'on':'off'}</button></div>${updateStatus==='available'?'<button class="btn primary block mt12" data-a="applyupdate">Install downloaded update</button>':''}</div>`}
function recoveryScreen(){return '<div class="intro-cover"><h2>Protect your adventure</h2><p class="story-copy">Your stored save could not be read safely. It has been kept intact. Download the original data for recovery, or restore a verified backup.</p><button class="btn secondary block mt12" data-a="rawbackup">Download recovery data</button><button class="btn primary block mt12" data-a="restore">Restore a backup</button></div>'}
function downloadRecovery(){const blob=new Blob([JSON.stringify({game:'WILDKIN-RECOVERY',copies:unreadableSaves})],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='wildkin-recovery.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),4000)}
function featureAction(a,v,btn){
 if(!state)return false;
 if(a==='loadlatest'){battle=null;capture=null;modal=null;startGame();return true}
 if(storageConflict&&a!=='backup')return true;
 if(a==='storynode'){enterNode(v);return true}
 if(a==='storychoice'){completeStory(v,Number(btn.dataset.choice));return true}
 if(a==='tutorialdone'){state.story.tutorial=true;save();closeModal();return true}
 if(a==='journal'){storyDialog('The journey so far',state.story.ending?World.ENDING:World.REGIONS[state.zone].intro,state.story.journal.map(t=>'<p class="journal-entry">'+esc(t)+'</p>').join(''));return true}
 if(a==='wildtrail'){state.trailSpot=state.trailSpot||{};state.trailSpot[state.zone]=Number(v);searchWilds();return true}
 if(a==='researchclaim'){const id=Number(v),r=state.research[id],pending=researchRank(id)-(r?.claimed||0);if(r&&pending>0){r.claimed=researchRank(id);state.coins+=pending*45;save();render()}return true}
 if(a==='achievement'){const achievement=ACHIEVEMENTS.find(x=>x[0]===v);if(achievement&&!state.achievements[v]&&achievement[2](state)){state.achievements[v]=true;state.coins+=achievement[3];save();render()}return true}
 if(a==='expbegin'){if(!state.expedition)state.expedition={step:0,loot:0,supplies:5,seed:rand(1,0x7fffffff),last:'The trail opens. Choose what to carry home.'};save();render();return true}
 if(a==='expchoice'){expeditionChoice(v);return true}
 if(a==='extract'){if(state.expedition){state.coins+=Math.floor(state.expedition.loot/2);state.expedition=null;save();render();toast('Extracted safely. Half the haul secured.')}return true}
 if(a==='tournament'){startTournament(Number(v));return true}
 if(a==='nextmatch'){if(modal?.nextTournament){const t=modal.nextTournament;closeModal();startTournament(t.tier,t.index)}return true}
 if(a==='companion'){const k=teamKin()[0];state.affection[k.uid]=(state.affection[k.uid]||0)+1;const lines=['leans against your hand and listens to the distant beacons.','chases a drifting light, then proudly returns to your side.','settles beside you. The wilds can wait a moment.'];storyDialog(nameOf(k),nameOf(k)+' '+pick(lines));save();return true}
 if(a==='decoration'){const i=Number(v);if(state.badges.includes(i)){state.decor=state.decor.includes(i)?state.decor.filter(n=>n!==i):[...state.decor,i];save();render()}return true}
 if(a==='equip'){const id=modal?.uid,k=state.kin.find(x=>x.uid===id);if(k&&['none','power','ward','vital'].includes(v)){if(v!=='none'&&state.coins<120){toast('A charm costs 120 coins.');return true}if(v!=='none')state.coins-=120;state.equipment[id]=v;save();showModal()}return true}
 if(a==='speed'){state.settings.speed=state.settings.speed===1?1.5:state.settings.speed===1.5?2:1;save();render();return true}
 if(a==='motion'){state.settings.reduced=!state.settings.reduced;save();render();return true}
 if(a==='hinttoggle'){state.settings.hints=!state.settings.hints;save();render();return true}
 if(a==='music'){state.settings.music=!state.settings.music;stopMusic();if(state.settings.music)startMusic();save();render();return true}
 if(a==='applyupdate'){applyUpdate();return true}
 return false;
}
function combatBonus(mine,kind,b){const passive=Core.PASSIVES[mine.sp],type=passive[2],value=passive[3];let bonus=1;const actions=b.acts[mine.uid]||0;if(type==='opener'&&actions===0)bonus+=value;if(type==='burst'&&kind==='burst')bonus+=value;if(type==='resolve'&&mine.hp<hpMax(mine)/2)bonus+=value;if(type==='afflict'&&b.weakenTurns>0)bonus+=value;if(type==='patient'&&b.prepared===mine.uid)bonus+=value;if(type==='entryhit'&&b.entry===mine.uid)bonus+=value;if(state.equipment[mine.uid]==='power')bonus+=.1;return bonus;}
function observeFoe(foe){recordResearch(foe.sp,'seen');state.seen=[...new Set([...state.seen,foe.sp+':'+Number(foe.evo)])]}
function initializeBattle(b){b.region=state.zone;b.acts={};b.hits={};b.cooldowns={};b.intent=Core.intent(b,b.foe);b.entry=b.active;return b}

function handleClick(e){const btn=e.target.closest('[data-a]');if(!btn)return;const a=btn.dataset.a,v=btn.dataset.v;try{
if(resetInProgress)return;
if(a==='rawbackup'){downloadRecovery();return}
if(a==='begin'&&unreadableSaves.length){toast('Restore your save before beginning. Your unreadable data is protected.');return}
if(featureAction(a,v,btn))return;
if(a==='starter'){chosenStarter=Number(v);render();return}
if(a==='begin'){state=newState(chosenStarter);expansionInit();save();sound(650,.18);render();showStoryIntro();giftsFromURL();return}
if(a==='nav'){state.screen=v;save();closeModal();render();window.scrollTo({top:0,behavior:'instant'});return}
if(a==='sound'){state.sound=!state.sound;stopMusic();if(state.sound&&state.settings.music)startMusic();save();render();return}
if(a==='zone'){if(!unlocked(Number(v))){toast('Defeat the previous region’s guardian to unlock this trail.');return}state.zone=Number(v);save();render();return}
if(a==='search'){searchWilds();return}
 if(a==='trailspot'){const n=Number(v);if(n>=0&&n<3){if(!state.trailSpot)state.trailSpot={};state.trailSpot[state.zone]=n;save();render()}return}
if(a==='boss'){startEncounter(true);return}
if(a==='detail'){modal={type:'detail',uid:v};showModal();return}
if(a==='dexdetail'){modal={type:'dexdetail',sp:Number(v),evo:Number(btn.dataset.e)};showModal();return}
if(a==='teamtoggle'){teamToggle(v);return}
 if(a==='confirmswap'){swapKin(v);return}
 if(a==='favorite'){const k=state.kin.find(x=>x.uid===v);if(k){k.favorite=!k.favorite;save();modal={type:'detail',uid:v};render()}return}
 if(a==='vaultview'){vaultView=v;vaultPage=0;render();return}
 if(a==='vaultpage'){vaultPage=Math.max(0,vaultPage+Number(v));render();return}
 if(a==='vaultsearch'){vaultQuery=(document.getElementById('vaultquery')?.value||'').trim().slice(0,36);vaultPage=0;render();return}
 if(a==='vaultclear'){vaultQuery='';vaultPage=0;render();return}
if(a==='rename'){modal={type:'rename',uid:v};showModal();return}
if(a==='saverename'){const k=state.kin.find(k=>k.uid===v);if(k){k.nickname=(document.getElementById('nickname')?.value||'').trim().slice(0,18);save();modal={type:'detail',uid:v};render()}return}
if(a==='releaseask'){modal={type:'confirmrelease',uid:v};showModal();return}
if(a==='release'){if(state.kin.length<=1||!state.kin.some(k=>k.uid===v))return;delete state.equipment[v];state.teamPresets=state.teamPresets.map(p=>p.filter(id=>id!==v)).filter(p=>p.length);state.kin=state.kin.filter(k=>k.uid!==v);state.team=state.team.filter(id=>id!==v);if(state.team.length===0&&state.kin.length)state.team=[state.kin[0].uid];save();closeModal();render();toast('Companion released into the wild.');return}
if(a==='buy'){buy(v);return}
if(a==='freshStart'){modal={type:'newJourney'};showModal();return}
if(a==='freshExecute'){resetJourneySafely();return}
if(a==='presetsave'){expansionInit();state.teamPresets.push(state.team.slice());state.teamPresets=state.teamPresets.slice(-4);save();render();return}
if(a==='presetload'){const p=state.teamPresets?.[Number(v)]?.filter(id=>state.kin.some(k=>k.uid===id));if(p?.length){state.team=p;save();render()}return}
if(a==='habitat'){const i=Number(v);if(i>=0&&i<4&&state.totalCatches>=[0,8,20,35][i]){state.habitat=i;save();render()}return}
if(a==='healall'){healAll();return}
if(a==='claim'){claim(v);return}
if(a==='trade'){modal={type:'trade'};showModal();return}
if(a==='giftone'){generateGift(v);return}
if(a==='giftselected'){generateGift(document.getElementById('tradechoose')?.value);return}
if(a==='importgift'){const input=document.getElementById('giftinput')?.value||'';const k=decodeGift(input);if(!k){toast('That gift code is invalid or incomplete.');return}modal={type:'incoming',kin:k};showModal();return}
if(a==='acceptgift'){acceptGift();return}
if(a==='closegift'){closeModal();return}
if(a==='copygift'){const txt=modal?.url||'';if(navigator.clipboard?.writeText){navigator.clipboard.writeText(txt).then(()=>toast('Gift link copied!')).catch(()=>manualCopy(txt))}else manualCopy(txt);return}
if(a==='sharegift'){if(navigator.share)navigator.share({title:'A Wildkin gift for you!',url:modal?.url||''}).catch(()=>{});else manualCopy(modal?.url||'');return}
if(a==='backup'){exportBackup();return}
if(a==='restore'){restoreBackup();return}
if(a==='checkupdate'){checkForUpdates(true);return}
if(a==='help'||a==='credits'){modal={type:a};showModal();return}
if(a==='close'){closeModal();return}
if(a==='moves'){if(battle){battle.showMoves=!battle.showMoves;render()}return}
if(a==='attack'){actionAttack(v);return}
if(a==='flee'){tryFlee();return}
 if(a==='claimguardian'){claimGuardian();return}
if(a==='tonic'){useTonic();return}
if(a==='switch'){switchKin(v);return}
if(a==='catchmenu'){if(!battle||battle.doing||battle.boss||battle.arena||battle.expedition)return;if(state.orbs+state.prisms===0){toast('Buy more Bond or Prism orbs at camp!');return}modal={type:'catchmenu'};showModal();return}
if(a==='chooseorb'){if(!battle?.doing)openCapture(v);return}
if(a==='cancelcapture'){capture=null;document.getElementById('capture')?.remove();return}
if(a==='seal'){sealCapture();return}
}catch(ex){console.error('Wildkin action error',ex);toast('Something went wrong. Your progress is safe.')}}
function manualCopy(txt){const area=document.createElement('textarea');area.value=txt;area.style.position='fixed';area.style.opacity='0';document.body.appendChild(area);area.select();try{document.execCommand('copy');toast('Gift link copied!')}catch{toast('Select the gift link above to copy it.')}area.remove()}
function handleChange(e){const a=e.target?.dataset?.a;if(a==='filter'){kinFilter=e.target.value;vaultPage=0;render()}if(a==='vaultsort'){vaultSort=e.target.value;vaultPage=0;render()}if(a==='dexfilter'){dexZone=e.target.value;render()}}

async function checkForUpdates(manual=false){
 if(updateStatus==='checking')return;
 if(!navigator.onLine){updateMessage='Offline. Your installed adventure remains available.';if(manual)render();return}
 updateStatus='checking';updateMessage='Checking for updates…';if(manual)render();
 try{
  const response=await fetch('./version.json?check='+Date.now(),{cache:'no-store'});
  if(!response.ok)throw Error('Update server unavailable');
  const info=await response.json();if(!Core.validVersion(info.version))throw Error('Invalid update version');
  updateRegistration=await navigator.serviceWorker?.getRegistration('./');
  if(Core.newerVersion(info.version,APP_VERSION)||updateRegistration?.waiting){
   updateRegistration=await navigator.serviceWorker?.getRegistration('./');
   if(updateRegistration)await updateRegistration.update();
   updateMessage='Version '+info.version+' is available. Finish your encounter, then install it below.';updateStatus='available';
  }else{updateMessage='Up to date · '+APP_VERSION;updateStatus='ready'}
 }catch(error){updateStatus='ready';updateMessage='Could not check updates. Your saved game is unaffected.';console.warn(error)}
 if(manual)render();
}
async function applyUpdate(){
 if(battle||capture){toast('Finish your encounter before installing.');return}
 save();await vaultWriteQueue;
 const reg=updateRegistration||await navigator.serviceWorker?.getRegistration('./');
 if(reg?.waiting){updateRequested=true;reg.waiting.postMessage({type:'SKIP_WAITING'});updateMessage='Installing verified offline files…';render();}
 else if(reg?.installing){toast('Update is still downloading. Try again shortly.');}
 else location.reload();
}
async function startGame(){
 storageConflict=false;unreadableSaves.length=0;try{saveGeneration=localStorage.getItem(KEY+'-generation')||'legacy'}catch{}
 // A reset interrupted by a closed tab recovers its backup before loading.
 let interrupted=null;try{interrupted=localStorage.getItem(KEY+'-reset');if(interrupted){const recovery=Core.normalize(JSON.parse(interrupted));localStorage.setItem(KEY,JSON.stringify(recovery));await writeVaultDb(JSON.stringify(recovery));localStorage.removeItem(KEY+'-reset')}}catch{toast('A reset was interrupted. Keep a backup before retrying.')}
 const local=load(),vault=await readVaultDb();
 state=vault&&(!local||(vault.revision||0)>(local.revision||0)||(vault.revision||0)===(local.revision||0)&&(vault.updatedAt||0)>(local.updatedAt||0))?vault:local;
 if(state){
  state.kin=state.kin.filter(k=>k&&SPEC[k.sp]);
  state.team=state.team.filter(uid=>state.kin.some(k=>k.uid===uid)).slice(0,3);
  if(!state.team.length&&state.kin.length)state.team=[state.kin[0].uid];
  dailyCheck();if(!Array.isArray(state.battled))state.battled=[];
  if(!state.trailSpot)state.trailSpot={};if(!state.trailVisits)state.trailVisits={};
  if(!vault||state===local&&((local.updatedAt||0)>(vault.updatedAt||0)))save();
 }
 expansionInit();if(state){healCollectionAfterBattle();save()}render();if(state)giftsFromURL();setTimeout(()=>checkForUpdates(false),3500);
}
document.addEventListener('click',handleClick);
document.addEventListener('change',handleChange);
document.addEventListener('keydown',event=>{const dialog=document.querySelector('#modal .modal');if(!dialog)return;if(event.key==='Escape'){closeModal();return}if(event.key==='Tab'){const buttons=Array.from(dialog.querySelectorAll('button:not(:disabled),input,select,textarea,a[href]'));if(!buttons.length)return;const first=buttons[0],last=buttons[buttons.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}}});
ROOT.innerHTML='<div class="intro-cover" style="text-align:center;padding-top:30vh"><h2>✦ WILDKIN</h2><p>Opening your creature vault…</p></div>';
const boot=startGame().catch(error=>{console.error('Wildkin startup',error);state=load();render()});if('serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost'))window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').then(reg=>{updateRegistration=reg}).catch(()=>{}));
let reloadForUpdate=false;navigator.serviceWorker?.addEventListener('controllerchange',()=>{if(!updateRequested||reloadForUpdate)return;reloadForUpdate=true;location.reload()});
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'){if(state)save();stopMusic()}else{if(storageConflict)render();checkForUpdates(false);if(state?.settings?.music)startMusic()}});
if(window.__WILDKIN_TEST__)window.WILDKIN_TEST_API={ready:boot,getState:()=>state,getBattle:()=>battle,getModal:()=>modal,handleClick,svgKin,setState:value=>{state=value;expansionInit()},newState,makeKin,save,flush:()=>vaultWriteQueue,startGame,readVaultDb,writeVaultDb,resetJourneySafely,restoreBackup,exportBackup,startEncounter,searchWilds,actionAttack,foeAttack,finishBattle,claimGuardian,tryFlee,useTonic,switchKin,openCapture,sealCapture,gainXp,teamToggle,swapKin,completeStory,enterNode,guardianReady,featureAction,startTournament,expeditionChoice,finishExpeditionStep,render,showModal,healCollectionAfterBattle,checkForUpdates,applyUpdate,decodeGift,giftCode,recordResearch,researchRank,Core,World};
})();