(()=>{'use strict';
const KEY=window.__WILDKIN_TEST__&&window.__WILDKIN_TEST_STORAGE__||'wildkin-save-v1',VERSION=1,APP_VERSION=WildkinCore.BUILD,ROOT=document.getElementById('app');
const Core=WildkinCore,World=WildkinWorld,Adv=WildkinAdventures;
let resetInProgress=false,updateRegistration=null,updateRequested=false,storageConflict=false;let saveGeneration='legacy',observedRevision=0,observedUpdatedAt=0;const unreadableSaves=[];
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
   const req=window.indexedDB.open(window.__WILDKIN_TEST_STORAGE__?'wildkin-qa-vault':'wildkin-creature-vault',1);
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
async function writeVaultDb(snapshot,protect=false){
 if(protect&&storageConflict)return false;
 const db=await openVaultDb();if(!db)return false;
 return new Promise(resolve=>{
  try{
   const tx=db.transaction('progress','readwrite'),store=tx.objectStore('progress');
   tx.oncomplete=()=>resolve(true);tx.onerror=()=>resolve(false);tx.onabort=()=>resolve(false);
   if(!protect){store.put(snapshot,KEY);return}
   // Compare and write inside one IndexedDB transaction, including when the local mirror is unavailable.
   const request=store.get(KEY);request.onerror=()=>resolve(false);
   request.onsuccess=()=>{
    try{
     const raw=request.result,latest=typeof raw==='string'?JSON.parse(raw):raw;
     if(latest&&latest.writerId!==SESSION_ID&&((latest.revision||0)>observedRevision||((latest.revision||0)===observedRevision&&(latest.updatedAt||0)>observedUpdatedAt))){
      storageConflict=true;
      try{const mirror=localStorage.getItem(KEY);if(mirror&&JSON.parse(mirror).writerId===SESSION_ID)localStorage.setItem(KEY,typeof raw==='string'?raw:JSON.stringify(raw))}catch{}
      toast('Another window saved progress. Export this copy, then load the latest save in Camp.');resolve(false);return;
     }
     store.put(snapshot,KEY);
    }catch{storageConflict=true;toast('The stored adventure changed unexpectedly. Export this copy before reloading.');resolve(false)}
   };
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
 vaultWriteQueue=vaultWriteQueue.catch(()=>{}).then(()=>writeVaultDb(snapshot,true)).then(ok=>{
  if(!ok&&!localSaved&&!storageConflict&&!storageAlerted){storageAlerted=true;toast('Device storage is full. Export a backup in Camp to protect your collection.')}
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
function sound(freq=440,duration=.09,kind='sine'){if(!state?.sound)return;try{const ctx=audioContext();if(!ctx)return;const osc=ctx.createOscillator(),gain=ctx.createGain();osc.type=kind;osc.frequency.setValueAtTime(freq,ctx.currentTime);osc.frequency.exponentialRampToValueAtTime(freq*.8,ctx.currentTime+duration);gain.gain.setValueAtTime(.055,ctx.currentTime);gain.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+duration);osc.connect(gain).connect(ctx.destination);osc.onended=()=>{osc.disconnect();gain.disconnect()};osc.start();osc.stop(ctx.currentTime+duration)}catch{}}

const EVOLUTION_MODELS=[
 ['M38 116Q45 91 85 103L99 65 115 47 139 65 142 104Q165 116 160 142L147 163H131L134 135 85 140 72 169H56L57 130 34 145Z','M105 58 88 26 108 40 114 14 127 40 152 23 139 61M48 120Q4 91 16 62 42 70 60 110',121,78,11],
 ['M35 124Q45 96 87 106L106 66 124 58 144 74 137 102 166 118 163 132 139 131 116 153 101 176H79L98 142 67 141 35 168H16L39 137Z','M104 69 98 37 119 57 143 35 139 79M56 111Q6 96 21 48 33 84 64 85Q89 86 76 110',124,79,10],
 ['M47 136Q37 111 62 99L75 73Q99 56 129 72L141 106Q165 124 148 149L133 162 73 165Z','M63 102 32 72 31 94 13 84 26 108 6 115 48 128M139 102 169 72 169 94 188 84 174 110 196 117 150 129M61 150 31 169 53 181 80 159M136 152 166 171 147 181 123 160M145 145q51-15 35-45-6 28-34 27',100,105,22],
 ['M53 154Q38 133 55 103L64 86Q48 69 66 53L83 59Q101 49 121 59L138 51Q156 69 139 88L147 118Q158 150 137 166L118 160 107 171 88 159 69 167Z','M55 111Q4 70 26 52 56 54 73 96M140 108q51-39 32-56-31 2-47 44M63 139Q99 124 140 140M65 153Q98 139 136 154',102,82,18],
 ['M30 107 53 80 97 84 119 56 144 60 164 84 151 103 144 117 151 168H133L118 121 86 125 73 174H56L57 120Z','M122 60 114 31 96 21 113 19 121 32 129 13 135 38 153 18 155 37 143 60M53 92 31 54 24 76 12 67 20 100M143 96 179 89 173 107 149 116',139,78,10],
 ["M64 164Q49 147 57 120L76 88 78 64 102 50 126 66 128 94 149 128 145 160 126 177 110 159 90 177Z","M80 70 62 22 92 46 103 18 119 44 144 21 126 72M61 119Q24 80 8 129l31-3-11 43 46-28M130 117q42-38 61 13l-34-4 17 43-45-30",103,89,18],
 ['M25 130Q31 105 71 102L91 78 111 67 138 75 152 98 138 112 121 105 101 123 98 165H81L76 128 54 132 42 170H26L34 133Z','M90 84 82 45 105 66 137 40 134 77M146 95q27-19 27-47 27 34-8 66l-30-4M49 109Q18 90 14 71 0 95 24 126M96 72 109 49 123 67',120,89,13],
 ['M77 155Q63 133 77 106L89 79 104 70 126 80 130 101 112 110 121 144 105 162 104 178H92L93 160Z','M87 106Q42 26 5 53l36 26L12 84l63 46M118 110q45-84 78-61l-29 26 25 10-68 48M92 76 100 40 114 66 132 44 124 87M82 149 49 167 73 173 93 162',110,88,12],
 ['M46 129Q50 98 73 94L129 91Q151 113 149 142L136 173H117L113 144 89 146 83 175H63Z','M18 96Q19 29 99 23Q181 29 185 98L139 109 98 101 56 109ZM61 141 27 159 18 140 47 115M142 135l31 22 14-19-40-29',100,120,21],
 ['M51 104Q40 69 74 52L103 41Q152 46 155 91L151 128Q131 114 126 150Q108 138 99 170Q85 139 67 153L56 124Z','M50 111Q4 132 30 158 24 133 67 135M148 108q46 15 22 46 5-27-31-23M82 45Q61 15 86 9 77 26 109 41M122 54q19-29 41-15-22 0-26 30',105,82,20],
 ["M30 135Q21 101 58 80Q101 59 142 79L151 107 174 115 181 136 158 151 127 159 73 158 43 151Z","M48 145 25 171 58 176 80 152M132 145l30 23-26 12-24-26M70 85V49L83 31 99 48 110 29 129 51V83M41 112 21 107 8 127 35 139",158,125,10],
 ['M26 117Q49 77 97 80Q133 82 151 104L176 79 181 129 157 122Q123 158 65 143Z','M66 90 65 37 88 64 113 43 115 89M71 139 55 174 95 157 117 168 122 142M43 107 13 88 7 122 30 132M143 104q34-48 47-43-13 37-39 57',78,111,16],
 ['M72 150Q55 124 74 102L93 91 100 64 115 55 130 72 124 99Q148 116 133 142L114 155 104 176 90 175 89 152Z','M76 114Q39 96 25 56l22 13-3-28 20 18 1-29 20 38M126 111q31-25 43-56l-21 15 1-34-19 25-3-36-14 44M75 143 39 169 81 159M129 143l34 20-39-10',112,80,12],
 ['M31 154Q22 122 58 105L104 93Q138 80 118 60L113 44 140 51 158 74 151 106Q142 133 101 135L66 141Q51 152 67 166L91 171Q45 192 31 154Z','M114 68 88 12 125 39 140 17 151 57M115 98q-9-63-57-67l17 30-31-3 54 63M142 105q29-58 49-39l-18 12 17 22-43 30',135,73,12],
 ["M87 153Q76 132 88 100L98 69 109 68 119 99Q127 132 114 155L101 179Z","M88 108Q57 24 16 42L29 104 14 159 54 176 87 129M114 109Q146 24 187 42L172 104 189 159 149 176 114 129M95 73 77 26M109 74l18-48M88 146 65 192l30-20M116 147l22 45-31-20",103,106,8],
 ['M53 170 43 136 57 122 62 91 79 76 120 77 140 97 140 123 158 140 144 174 120 169 114 145 86 145 79 173Z','M65 93 53 47 75 53 87 24 102 47 124 29 142 65 134 93M52 107 18 95 10 123 42 151M142 108l39-10 10 29-33 22M81 109l18-16 21 17-13 25-20-2Z',101,89,18],
 ['M68 170Q43 159 58 135L80 115 79 88 99 72 122 83 133 105 120 130 145 158 129 178 107 173 96 147 85 174Z','M82 88 56 29 68 8 91 57 99 19 116 7 116 77M65 145 21 160l12 18 47-11M123 139q44-20 54 4 4 20-39 30',104,98,16],
 ['M19 135 41 106 87 109 110 78 132 65 153 79 168 107 153 125 128 112 112 134 113 172 93 173 91 138 62 141 49 175 30 170 39 137Z','M115 82 101 41 122 56 137 29 146 65 171 53 159 91M47 111 35 80 57 89 69 66 83 105M40 131Q5 127 7 88-17 40 0 151l40 14',140,94,13],
 ['M71 172 67 148Q45 133 61 113L90 101 92 76 108 62 130 76 138 97 124 108 116 131 135 157 124 179 103 176 96 151 86 175Z','M94 78 75 43 97 57 127 37 128 75M65 125Q19 135 27 87-30 151 43 171l40-8M96 131q18-12 27 1l-6 20-17-1Z',114,88,15],
 ['M26 129Q35 92 65 100L86 92 103 100 123 92 143 101 163 98 176 122 160 144 139 139 120 145 100 139 79 144 60 137 42 146Z','M42 107 25 76 14 88M65 105 57 64 42 69M92 101 91 55 76 60M121 102 132 60 148 69M148 108l24-29 12 16M46 138 26 172M75 139 68 177M105 140 110 178M138 139 154 172M167 131l25 20',44,121,10],
 ['M30 141Q29 101 79 102L94 75 114 57 136 68 150 94 135 112 118 109 112 141 139 160 125 176 102 157 87 143 66 148 50 174 30 168 42 143Z','M96 81 87 30 107 47 114 20 121 51 145 27 137 77M66 110 46 82 34 103M129 75l32-15-10 39M43 130Q0 118 17 79-12 146 42 155',119,88,15],
 ['M75 163Q62 144 76 119L105 94 104 67 113 49 130 53 139 70 126 82 123 110 110 142 102 165 109 182H94L87 170 79 185H65Z','M80 122Q37 86 24 24 57 34 86 81l-3-55 25 57M117 117q53-16 74-54-1 51-68 77M110 64 99 34l20 10 16-19 5 34',123,66,10],
 ['M73 174 66 148 77 131 81 101 65 75 85 69 94 47 113 51 127 79 119 106 130 137 121 171 106 178 95 155 87 178Z','M80 105 34 113 16 93 44 75 29 47 66 47 83 17 100 37 124 16 132 47 169 45 157 80 184 99 157 119 118 105M77 150 47 174l32-3M116 150l40 22-33 3',102,88,14],
 ['M45 158Q17 127 50 100L90 83Q121 71 111 48L124 29 143 36 152 60 138 88 105 106 66 120Q47 135 74 142L115 136 130 156 113 174 73 177Z','M120 40 109 15 128 22 149 7 148 37M80 95 62 54 94 72 107 39 115 81M58 132Q3 128 18 89l13 28 18-12M113 140l40-25 29 5-27 17 26 24-39-1',134,53,10],
 ["M20 105Q45 65 96 76Q128 83 150 108L171 83 196 88 185 112 194 141 169 145 149 129Q108 171 61 148L29 132Z","M87 82 98 47 125 83M77 139l-2 35 25-22M61 80Q48 43 66 32l8 11-3 31M56 39l-17-8-3 10 19 6M79 35l12-14 8 10-16 14",61,108,13],
 ['M50 104Q44 55 85 43L115 40Q155 48 157 98L143 126 120 113 102 139 81 115 58 130Z','M61 113Q3 151 39 178 15 147 81 139M143 111q58 36 22 69 23-34-48-42M85 129q-19 35 15 61-12-35 14-59M85 41 70 15l25 10 10-22 14 23 24-12-15 30',104,82,22],
 ['M48 143Q38 111 73 101L95 80 102 63 125 58 145 75 143 104 127 116 111 140 104 172H86L83 146 71 168H53Z','M101 77 91 26 114 50 146 25 137 77M56 121Q-1 90 8 51 42 61 65 109M59 126Q-11 129 13 171 36 165 69 137M60 120Q12 64 40 22 66 57 73 105M133 128q66-48 58-81-33 8-63 65M135 133q66 8 46 43-37-7-55-32M130 124q39-65 15-99-27 35-26 84',121,82,15],
 ["M66 117Q47 83 74 58Q102 41 127 61Q153 90 131 121L113 138 88 136Z","M19 42a12 12 0 1 0 24 0 12 12 0 1 0-24 0ZM159 145a16 16 0 1 0 32 0 16 16 0 1 0-32 0ZM25 160a8 8 0 1 0 16 0 8 8 0 1 0-16 0ZM20 122Q65 154 153 62L166 67Q89 161 20 137ZM74 49 91 18 101 47M130 139l11 26-28-12",102,91,18],
 ['M44 155Q42 133 77 118L97 101 95 75 109 55 133 61 149 83 141 103 120 117 137 143 169 162 156 179 117 155 95 142 76 156 62 177H37Z','M99 75 66 28 72 7 102 43 111 12 129 3 128 62M56 136Q0 143 12 103 4 169 57 168M126 115l41-1 16 20-48 2',122,81,15],
 ['M86 150 79 105 89 78 101 55 115 76 123 110 113 150 101 175Z','M87 112Q46 7 7 23l25 36L5 66 67 124Q1 119 16 171 52 182 88 137M114 111q40-106 78-88l-25 38 30 9-66 54q65-6 53 47-43 15-73-34M93 65 81 26 99 37 116 18 111 69M90 146 73 190 101 167 131 193 112 145',101,101,8]
];
function evolvedPortrait(k){
 const s=SPEC[k.sp],m=EVOLUTION_MODELS[k.sp],p=k.aurora?'#cdb4f4':s.primary,q=k.aurora?'#86eee0':s.secondary,id='evo'+k.sp+Number(k.aurora),[body,append,x,y,eye]=m;
 const feet=`<path d="${append}" fill="${q}" stroke="#253f4a" stroke-width="3.3" stroke-linejoin="round" stroke-linecap="round"/>`;
 return `<svg viewBox="-6 -4 212 204" role="img" aria-label="${esc(nameOf(k))}"><defs><linearGradient id="${id}" x1="0" y1="0" x2=".8" y2="1"><stop stop-color="${p}"/><stop offset="1" stop-color="${q}"/></linearGradient></defs><ellipse cx="102" cy="183" rx="64" ry="9" fill="#0d2b35" opacity=".3"/>${feet}<path d="${body}" fill="url(#${id})" stroke="#253f4a" stroke-width="3.5" stroke-linejoin="round"/><path d="M${x-24} ${y+21}Q${x} ${y+43} ${x+24} ${y+21}" stroke="#fff3cd" stroke-width="9" fill="none" opacity=".3"/><path d="M${x-21} ${y-11}q11-13 25-9" stroke="#ffffff70" stroke-width="4" fill="none" stroke-linecap="round"/><ellipse cx="${x-eye}" cy="${y}" rx="5" ry="7" fill="#183943"/><ellipse cx="${x+eye}" cy="${y}" rx="5" ry="7" fill="#183943"/><circle cx="${x-eye+1}" cy="${y-3}" r="2" fill="#fff"/><circle cx="${x+eye+1}" cy="${y-3}" r="2" fill="#fff"/><path d="m${x-5} ${y+13} 5 3 6-4" stroke="#2b4550" stroke-width="2.5" stroke-linecap="round" fill="none"/>${k.aurora?'<path d="m17 40 3-9 3 9 9 3-9 3-3 9-3-9-9-3Zm151 2 3-9 3 9 9 3-9 3-3 9-3-9-9-3Z" fill="#fff0b7"/>':''}${Number.isInteger(k.guardianZone)?`<path d="m${x-22} ${y-29}-5-22 17 8 10-16 10 16 17-8-5 22Z" fill="#ffe7a0" stroke="#9d774f" stroke-width="2"/>`:''}</svg>`;
}

const BASE_MODELS=[
 ['M53 141Q40 121 56 99L64 68 89 76Q104 67 126 78L145 63 142 105Q160 126 141 153L122 164 110 152 91 163 73 154 60 166Z','M61 132Q13 127 22 76 42 83 54 109M83 77 77 43 97 64 114 41 124 78',102,108,19,'M61 131q12-9 22-5m38 3q10-8 19-2'],
 ['M40 137Q35 115 63 104L87 94 96 73 119 69 139 85 143 110 125 132 107 139 97 164H80L76 140 59 151 47 163 31 157Z','M98 81 90 42 111 64 140 38 131 83M49 118Q13 109 24 60 30 89 57 88Q76 93 62 115',117,99,17,'M83 123q18 7 28 0M35 101l14-9'],
 ['M48 141Q32 111 53 88Q77 67 104 75Q137 66 157 95Q175 125 150 149L127 161 78 164Z','M49 100 28 83 28 101 11 96 30 119 49 122M155 101l20-18 2 20 16-8-23 28-18-1M64 148 35 169 64 177 84 157M142 151l23 20-29 6-16-20',103,109,24,'M73 141q29 11 58-1'],
 ['M66 144Q48 116 61 88Q69 70 98 67Q132 68 141 94Q153 126 131 148L109 163 86 157Z','M73 94Q23 57 15 86 12 119 61 125M129 93q52-38 59-5 3 32-48 39M83 73 72 41M116 72l15-29M70 147l-18 19m74-18 18 19',102,100,18,'M65 122q34-14 77 0M73 140q31-9 60 1'],
 ['M37 124 49 90 76 70 121 65 156 93 161 129 137 159 93 174 52 158Z','M43 133 24 137 23 152 50 152M148 137l28 3-6 17-29-2',102,113,20,'M51 103 77 85 91 102 75 120Zm64-25 28 23-21 16M85 145l17-17 28 13-20 17Z'],
 ['M63 150Q44 132 53 106L66 82 97 75 125 80 145 112 137 147 115 166 88 157 74 172Z','M67 90 51 47 80 68 106 44 123 69 149 43 135 93M57 121 26 107 29 140 49 135M137 121l34-14-4 36-20-9',102,111,20,'M84 88q-4-24 16-26-13 13 2 24'],
 ['M47 144Q34 124 50 101L72 89 80 75 105 67 129 77 144 100 134 124 116 139 107 166H90L85 143 65 147 57 170H42Z','M77 83Q52 66 49 88L58 117 74 102M127 81q31-23 32 2l-14 34-11-18M49 131Q18 126 16 100 1 137 35 155',107,100,18,'M96 135l8-17 9 16M31 132l4-13 9 12'],
 ['M76 152Q54 134 67 109L81 82 108 73 128 88 125 111 112 121 118 148 103 164 89 161Z','M71 116Q25 75 21 116 27 145 73 142M123 117q44-38 54-1-9 29-48 28M85 84 75 54 97 67 116 45 119 80M83 157l-10 20m30-15 11 14',103,103,16,'M72 122l13 17M135 121l-11 18'],
 ['M60 139Q49 115 68 100L91 93 116 96 139 113 142 144 126 165 102 157 82 168 65 157Z','M32 103Q25 58 66 43Q115 23 153 53Q178 73 166 106L124 111 92 105 59 114Z',101,122,18,'M46 85q18-12 29-5M109 62q17-7 29 7M89 139l16 8 15-9'],
 ['M48 112Q42 72 77 57Q109 43 139 66Q159 83 153 115L144 144 126 132 111 155 94 138 75 157 61 139 49 148Z','M65 136Q26 144 42 177M96 145q-16 24 2 40M130 137q33 15 24 41M82 59Q66 39 81 24 79 43 106 52',102,102,20,'M70 83q24-12 49-4'],
 ['M40 132Q33 95 66 76Q99 58 133 77Q167 92 164 128L149 152 119 166 76 161 49 147Z','M54 143 27 157 30 172 68 163M138 146l30 15-5 14-35-13M45 114 20 110 11 129 37 143M160 116l22-7 10 20-30 12',101,127,20,'M53 114q41-40 91-5M68 98l20 35 22-43 24 38M76 149l54 0'],
 ['M38 117Q48 89 88 84Q126 80 150 108L166 101 176 122 159 142 142 134Q103 164 62 145Z','M143 111 181 70 190 108 177 140 154 132M74 89 92 53 113 84M81 148l8 23 26-24',90,115,20,'M57 129q29 14 56 0'],
 ['M65 128Q48 99 69 79Q91 61 118 70Q148 78 143 110L134 139 113 129 99 151 81 136 67 151Z','M66 134Q42 154 50 180M85 140q-7 24 3 44M115 139q16 27 9 43M134 132q27 13 29 38M82 75 69 47 87 57 97 31 108 60 129 45 123 78',103,102,19,'M59 115 78 114M130 114h15'],
 ['M53 143Q30 118 58 97L82 87 85 64 105 53 130 65 144 87 130 109 108 114 102 138 119 152 106 170 77 168Z','M88 71 74 40 100 53 123 35 128 69M60 131Q9 136 26 167 26 148 70 151M118 100l38-29 15 31-39 17',111,85,17,'M90 125l10-5 9 7M91 142l13-4'],
 ['M89 149Q77 132 86 107L95 76 104 70 114 100 119 131 110 153 100 169Z','M87 109Q54 45 26 63 13 88 68 126Q24 113 22 151 45 170 85 140M116 111q29-66 58-48 17 26-39 66 42-15 43 23-24 22-64-9M96 77 80 49M106 77l18-28',102,112,8,'M37 97l25 12M143 108l21-14'],
 ['M45 135 40 107 60 82 82 73 119 78 144 103 149 132 134 157 109 165 82 159 62 167Z','M58 92 47 65 67 60 83 80M118 83l9-27 20 16-9 30M52 134 29 133 22 155 53 157M140 135l26-3 11 25-35 1',99,113,19,'M77 91l17-11 18 12-4 13-17-5M67 140l15 7M121 139l13-7'],
 ['M66 148Q48 126 64 104L80 89 103 81 129 92 141 117 131 147 107 163 88 155 76 171Z','M80 93 59 46 65 21 89 66 104 42 116 20 123 39 121 87M71 149 43 163 50 176 86 166M128 146l26 18-10 12-27-16',104,114,19,'M82 139q20 13 42-1'],
 ['M36 139Q29 117 55 103L77 99 97 78 115 66 135 78 148 103 137 124 112 126 101 147 112 165H93L82 141 62 149 51 171 34 164Z','M99 83 90 53 112 63 129 41 134 82M43 122Q10 105 17 81-10 134 32 154M70 105 59 83 79 89 90 73 94 104',118,98,15,'M97 118l10-6 14 9M63 131l11-7'],
 ['M66 158Q46 141 59 115L76 105 87 80 109 69 131 83 140 105 125 121 122 147 139 165 121 177 99 152 88 171 73 174Z','M91 82 77 48 98 62 131 48 126 86M67 140Q20 134 23 99-7 156 58 170M96 131q16-8 26 2l-7 17-16-1Z',111,100,17,'M75 115l15 8M131 121l-11 5'],
 ['M39 130Q32 108 51 95L71 88 91 99 109 89 133 97 148 115 145 137 124 148 105 142 85 149 66 142 49 149Z','M50 104 35 76 25 82M78 98 75 62 59 66M108 98l8-31 17 6M132 109l26-22 14 16M48 142 29 165M78 145 70 172M111 144l9 25M137 137l24 23',59,117,11,'M73 114v16M102 109v26M125 113v21'],
 ['M48 148Q35 125 52 102L75 93 89 74 111 66 134 79 147 103 133 125 113 133 112 159 96 171 83 145 66 153 51 170 36 163Z','M90 82 76 45 102 62 112 35 122 67 145 44 134 84M52 122Q12 119 21 89 0 134 41 158M74 99 63 78 83 84',113,103,17,'M73 121l-12 7 16 4M131 117l13 8-14 7'],
 ['M73 154Q56 135 72 110L94 94 103 74 118 67 135 80 139 98 123 112 111 135 114 156 98 168 84 163Z','M77 118Q31 75 22 114 33 145 78 141M121 117q49-27 57 6-22 28-57 20M104 80 92 52 113 63 137 45 133 81M88 161l-9 18m23-15 12 14',117,94,15,'M73 126l12 13M136 129l-13 12'],
 ['M75 160 69 136 79 112 74 91 87 79 109 77 126 91 124 118 132 139 117 167 99 158 84 171Z','M82 99 48 91 31 61 61 57 66 28 91 46 109 21 128 49 158 52 163 78 126 105M78 147 46 166 82 160M118 145l35 21-31-4',101,108,17,'M87 134l14-10 14 12M46 65l28 12M132 58l-11 20'],
 ['M44 149Q27 126 56 106L87 99 99 72 119 64 139 80 144 103 127 121 105 126 99 149 112 165 94 177 69 172Z','M104 78 93 49 114 57 135 39 136 78M65 136Q18 139 25 169 34 155 75 155M126 107l36-30 14 32-45 16',122,94,16,'M80 121l10-6M82 139l13-4M92 155l8-1'],
 ['M28 118Q40 84 88 84Q126 85 150 107L166 98 182 111 172 137 151 132Q117 162 66 150L39 137Z','M149 112 178 76 190 85 180 112 193 140 181 150 158 130M79 90 88 56 112 87M88 148l17 24 20-28',78,117,18,'M43 130q34 15 62 3M65 87l4-14 13 4'],
 ['M51 113Q45 80 67 61Q97 40 125 58Q152 70 151 107L140 138 120 126 103 150 85 132 66 146 54 131Z','M61 135Q28 152 42 177M87 138q-10 28 10 46M121 136q23 18 18 43M142 127q28 11 26 36M88 57 78 31 99 40 112 20 122 52',103,100,19,'M77 77q19-13 38-3M70 119l9 5m49-6-8 7'],
 ['M56 149Q40 125 58 103L76 88 88 76 112 65 137 81 145 110 128 134 112 141 105 166 87 168 82 145 65 167 49 162Z','M91 83 80 41 106 62 138 36 133 84M59 125Q15 106 22 69 39 84 69 104M58 137Q10 138 27 174 52 166 71 145',112,105,18,'M83 115l10-12 11 11-11 12ZM119 118l10-9 10 12-10 10Z'],
 ['M66 120Q49 100 63 75Q78 54 104 56Q134 58 143 83Q156 110 130 132L106 145 83 135Z','M31 139Q6 101 70 89Q147 66 175 94Q196 122 125 140Q63 159 31 139ZM86 60 94 31 111 57',104,100,19,'M78 78q20-10 37 0M71 119q30 15 59-4'],
 ['M65 153Q46 135 60 110L84 93 104 80 128 86 142 107 131 137 109 155 98 174 81 164 69 178Z','M86 95 55 47 62 24 90 67 105 40 120 19 127 44 122 88M68 144Q27 144 34 112 13 150 51 171M122 143l35 20-18 14-28-20',108,114,18,'M81 139q25 14 48-5'],
 ['M88 150Q78 131 85 108L94 83 105 76 116 97 120 131 110 154 100 173Z','M87 114Q53 49 26 66 11 94 69 130Q24 117 25 154 49 174 87 142M117 113q34-66 60-44 12 27-43 62 43-16 42 25-26 22-61-13M97 83 83 54M107 82l17-28',103,115,8,'M39 96l26 17M147 110l15-15M88 150l11 10 12-10']
];
function basePortrait(k){const s=SPEC[k.sp],m=BASE_MODELS[k.sp],p=k.aurora?'#c7b2f4':s.primary,q=k.aurora?'#83e2d9':s.secondary,id='base'+k.sp+Number(k.aurora),[body,append,x,y,eye,detail]=m;
 return `<svg viewBox="0 0 200 195" role="img" aria-label="${esc(nameOf(k))}"><defs><radialGradient id="${id}" cx="35%" cy="20%" r="85%"><stop stop-color="${p}"/><stop offset="1" stop-color="${q}"/></radialGradient></defs><ellipse cx="101" cy="181" rx="55" ry="9" fill="#102c37" opacity=".3"/><path d="${append}" fill="${q}" stroke="#27434c" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"/><path d="${body}" fill="url(#${id})" stroke="#27434c" stroke-width="3.5" stroke-linejoin="round"/><path d="${detail}" fill="none" stroke="#fff5d0" stroke-width="3" opacity=".55" stroke-linecap="round"/><ellipse cx="${x-14}" cy="${y-23}" rx="22" ry="10" fill="#fff" opacity=".15" transform="rotate(-20 ${x-14} ${y-23})"/><ellipse cx="${x-eye}" cy="${y}" rx="7" ry="10" fill="#183640"/><ellipse cx="${x+eye}" cy="${y}" rx="7" ry="10" fill="#183640"/><circle cx="${x-eye+2}" cy="${y-4}" r="3" fill="#fff"/><circle cx="${x+eye+2}" cy="${y-4}" r="3" fill="#fff"/><path d="m${x-5} ${y+15} 5 4 6-5" fill="none" stroke="#42515a" stroke-width="2.5" stroke-linecap="round"/><ellipse cx="${x-eye-9}" cy="${y+13}" rx="7" ry="4" fill="#f7b6b5" opacity=".55"/><ellipse cx="${x+eye+9}" cy="${y+13}" rx="7" ry="4" fill="#f7b6b5" opacity=".55"/>${k.aurora?'<path d="m18 43 3-10 3 10 10 3-10 3-3 10-3-10-10-3Zm151 6 2-8 3 8 8 2-8 3-3 8-2-8-8-3Z" fill="#fff0b7"/>':''}</svg>`;
}

function svgKin(k,size='normal'){return k.evo?evolvedPortrait(k):basePortrait(k)}
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
function render(){ROOT.inert=!!modal||!!capture;document.documentElement.classList.toggle('reduced-motion',!!state?.settings?.reduced);if(!state){ROOT.innerHTML=unreadableSaves.length?recoveryScreen():intro();return}dailyCheck();const current=state.screen;ROOT.innerHTML=`<header class="topbar"><div class="logo">✦</div><div class="brand"><div class="eyebrow">The Living Wilds</div><h1>WILDKIN</h1><span class="app-version">v${APP_VERSION}</span></div><div class="currency">🪙 <b>${state.coins.toLocaleString()}</b></div><button class="iconbtn" data-a="sound" aria-label="Toggle sound">${state.sound?'🔊':'🔇'}</button></header><main class="content">${storageConflict?'<section class="panel"><h3>Another window saved progress</h3><p class="subtext">This copy is paused to protect your latest adventure. Export it if needed before loading the latest save.</p><button class="btn secondary block mt12" data-a="backup">Export this copy</button><button class="btn primary block mt12" data-a="loadlatest">Load latest save</button></section>':''}${current==='team'?teamScreen():current==='dex'?dexScreen():current==='camp'?campScreen()+settingsPanel():current==='research'?researchScreen():current==='expedition'?expeditionScreen():current==='arena'?arenaScreen():current==='habitat'?habitatScreen():exploreScreen()}</main>${nav()}`;ROOT.inert=!!modal||!!capture;if(modal)showModal();if(battle)renderBattle()}
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
if(isBoss){if(!guardianReady(z)){toast('Complete a regional story and restore all three field relays first.');return}s=available[4]}
else{const spot=clamp(state.trailSpot?.[z]||0,0,2),p=Math.random(),weights=TRAIL_RARITY_WEIGHTS[spot],rar=p<weights[0]?0:p<weights[0]+weights[1]?1:2;s=pick(available.filter(v=>v.rarity===rar))}
if(!isBoss&&!arena&&context==='wild'&&z===0&&state.kin.length<3&&state.totalCatches<3){s=SPEC.find(candidate=>candidate.id<3&&!state.kin.some(k=>k.sp===candidate.id))||s;}
const highest=Math.max(...teamKin().map(k=>k.level)),level=isBoss?(state.badges.includes(z)?Math.min(60,Math.max(Core.GUARDIAN_LEVELS[z],highest+1)):Core.GUARDIAN_LEVELS[z]):clamp(Core.BASE_LEVELS[z]+rand(-1,3),1,60);
const foe=makeKin(s.id,arena?Math.min(60,level+2):level,!isBoss&&((state.hunt[z]||0)>=24||Math.random()<.025),isBoss);if(!arena&&context==='wild')recordResearch(foe.sp,'seen');if(isBoss){foe.hp=Math.ceil(hpMax(foe)*(z===5?1.8:2.8));foe.guardHp=foe.hp;foe.guardianZone=z;foe.nickname=ZONES[z].guardian}
if(!isBoss&&!arena&&context==='wild'){state.hunt[z]=foe.aurora?0:Math.min(24,(state.hunt[z]||0)+1)}
if(!arena&&context==='wild')state.seen=[...new Set([...state.seen,`${s.id}:${isBoss?1:0}`])];if(!Array.isArray(state.battled))state.battled=[];battle={foe,active:currentKin().uid,energy:2,guard:false,boss:isBoss,arena,log:isBoss?`${ZONES[z].guardian} challenges your team!`:`A wild ${nameOf(foe)} appeared!`,turn:0,doing:false,phase:'ready',events:[],notice:null,fx:'',showMoves:false};initializeBattle(battle);if(isBoss&&z===5&&!state.story.ending){const echo1=makeKin(17,36,false,true),echo2=makeKin(23,38,false,true);echo1.nickname='Echo of the ridge';echo2.nickname='Echo of the storm';[echo1,echo2,foe].forEach((k,i)=>k.aiCycle=World.FINAL_TRIALS[i].cycle);battle.foeQueue=[echo2,foe];battle.foe=echo1;battle.finale={phase:-1};prepareFinalePhase(battle,0);battle.intent=Core.intent(battle,echo1);}modal=null;capture=null;save();render();sound(isBoss?180:600,.15,'triangle')}
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
 recordLesson(kind);
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
  b.lastAttackElement=SPEC[mine.sp].type;b.prepared=null;b.entry=null;b.acts[mine.uid]=(b.acts[mine.uid]||0)+1;
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
function prepareFinalePhase(b,index){
 if(!b.finale||b.finale.phase===index)return;const phase=World.finalePreparation(state,index);if(!phase)return;b.finale.phase=index;b.finale.title=phase.title;
 b.log='Trial '+(index+1)+'/3 · '+phase.title+'. '+phase.text;b.finale.text=phase.text;
 const notes=[];if(phase.approach==='shelter'){b.guard=Math.min(typeof b.guard==='number'?b.guard:1,.55);notes.push('Shelter: opening shield.')}else{b.terrain='relay';notes.push('Relay: switching elements strengthens your next attack.');}
 if(phase.guard){b.guard=Math.min(typeof b.guard==='number'?b.guard:1,.45);notes.push('Your restored refuge strengthens the shield.');}
 if(phase.energy){b.energy=Math.min(4,b.energy+1);notes.push('Your regional signal adds one energy.');}
 if(phase.expedition){const k=state.kin.find(k=>k.uid===b.active);if(k&&k.hp>0)k.hp=Math.min(hpMax(k),k.hp+Math.ceil(hpMax(k)*.12));notes.push('Expedition knowledge restores 12% HP to your active companion.');}
 b.finale.preparation=notes.join(' ');
}
function finalePanel(){if(state.zone!==5||state.story.ending)return '';const approach=state.story.finalApproach||'shelter';return `<section class="panel mt12"><div class="kicker">Prepare the final crossing</div><h3>What will you carry into the Heart?</h3><p class="story-copy">Ione opens the archive. “Aster remembers every loss. Show them how you protect a world that keeps changing.” Choose a battle approach. Earlier regional requests and completed expeditions bring additional help to their matching trial.</p><div class="stack mt12"><button class="btn ${approach==='shelter'?'primary':'secondary'}" data-a="finalapproach" data-v="shelter">${approach==='shelter'?'✓ ':''}Make a shelter<small>Shield the opening hit in each trial.</small></button><button class="btn ${approach==='relay'?'primary':'secondary'}" data-a="finalapproach" data-v="relay">${approach==='relay'?'✓ ':''}Carry the signal<small>Switching to a different element strengthens the next attack by 20%.</small></button></div><details class="mt12"><summary>Read the three trials</summary>${World.FINAL_TRIALS.map((trial,i)=>{const p=World.finalePreparation(state,i);return `<p class="subtext mt8"><b>${i+1}. ${esc(trial.title)}</b><br>${esc(trial.text)}<br>${p.guard?'Refuge shield prepared. ':p.energy?'Signal energy prepared. ':''}${p.expedition?'Expedition recovery prepared.':''}</p>`}).join('')}</details></section>`}
function finishBattle(caught){
 const b=battle;if(!b)return;
 if(b.foeQueue?.length){recordResearch(b.foe.sp,'won');b.foe=b.foeQueue.shift();observeFoe(b.foe);b.turn=0;b.intent=Core.intent(b,b.foe);b.weakenTurns=0;b.playerWeakTurns=0;b.energy=Math.min(4,b.energy+1);b.doing=false;b.phase='ready';if(b.finale)prepareFinalePhase(b,b.finale.phase+1);announce(b.finale?'Trial '+(b.finale.phase+1)+'/3 · '+b.finale.title:'The next opponent steps forward!',b.finale?b.finale.text+' '+b.finale.preparation:nameOf(b.foe)+' enters. Your team gains one energy.','neutral',0,'foe','enter');save();render();return;}
 if(b.storyNode)completeStory(b.storyNode);
 if(b.field)finishAdventureBattle(b);
 if(b.expedition&&state.expedition){state.expedition.pending=false;finishExpeditionStep()}
 const z=b.region??state.zone,foe=b.foe,isGuardian=!!b.boss,firstSeal=isGuardian&&!state.badges.includes(z);
 learnFoe();recordResearch(foe.sp,caught?'caught':'won');if(b.arena&&!caught)state.arenaWins=(state.arenaWins||0)+1;let payout=isGuardian?260+z*85:b.arena?95+z*20:rand(20,38)+z*8,exp=isGuardian?130+z*40:b.arena?85+foe.level*7:32+foe.level*3;if(b.field)exp=45+foe.level*4;
 let levelText='';
 const rewardTeam=teamKin().slice();
 if(caught){
  recordLesson('bond');
  
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
 if(!battle)return;for(const el of ROOT.querySelectorAll?.(':scope > header,:scope > main,:scope > nav')||[])el.inert=true;
 const b=battle,foe=b.foe,mine=state.kin.find(k=>k.uid===b.active),fmax=foe.guardHp||hpMax(foe),fper=foe.hp/fmax*100,mper=mine.hp/hpMax(mine)*100,at=SPEC[mine.sp].type,dt=SPEC[foe.sp].type,mult=typemult(at,dt),known=knownFoe(),n=b.notice;
 const advice=known?(mult>1?'ADVANTAGE':mult<1?'DISADVANTAGE':'EVEN MATCHUP'):'NEW OPPONENT';
 const matchColor=!known?'new':mult>1?'strong':mult<1?'weak':'neutral';
 const nEffect=n?.effect||'neutral';
 const effectiveness=n&&n.amount>0&&(n.actor==='foe'||n.actor==='player')&&nEffect!=='guard'?`<span class="damage-label ${nEffect}">${nEffect==='strong'?'↗ Super effective!':nEffect==='weak'?'↘ Not very effective':'• Normal effectiveness'}</span>`:'';
 const hist=(b.events||[]).slice(1,4);
 const h=`<div class="battle-cover"><div class="battle" role="dialog" aria-modal="true" aria-label="Creature battle"><div class="battle-top"><span class="pill">${b.boss?'👑 GUARDIAN':b.tournament?'🏆 TOURNAMENT':b.expedition?'🧭 EXPEDITION':b.field?'🐾 FIELD CHALLENGE':'⚔️ WILD ENCOUNTER'}</span><button class="btn secondary tiny flee-header" data-a="flee" ${b.doing?'disabled':''}>🏃 Flee</button></div>
 <div class="battle-scene" style="${sceneStyle(b.region)}"><div class="battle-scenery glimmer glimmer-one"></div><div class="battle-scenery glimmer glimmer-two"></div><div class="battle-horizon"></div><div class="battle-platform"></div>
 <div class="enemy-data"><div class="row between gap6"><strong>${foe.aurora?'✨ ':''}${esc(nameOf(foe))}</strong><div class="row gap6">${typeLabel(dt)}<span class="pill">Lv ${foe.level}</span></div></div><div class="hp ${fper<30?'low':''}"><div style="width:${fper}%"></div></div><small>${foe.hp} / ${fmax} HP</small></div>
 <div class="battle-art detailed-art ${b.fx==='foe-hit'?'kin-impact':b.fx==='foe-windup'?'kin-attack':''}">${svgKin(foe)}</div>${b.fx==='foe-hit'?`<div class="hit-number ${nEffect}">−${n?.amount||0}</div>`:''}</div>
 <div class="my-kin"><div class="my-avatar detailed-art ${b.fx==='ally-hit'?'kin-impact':b.fx==='ally-windup'?'kin-attack':b.fx==='guard'?'kin-guard':''}">${svgKin(mine)}</div><div class="grow"><div class="row between gap6"><strong>${esc(nameOf(mine))}</strong><small>Lv ${mine.level} · ${ELEMENTS[at].icon}</small></div><div class="hp ${mper<30?'low':''}"><div style="width:${mper}%"></div></div><div class="row between mt8"><small>${mine.hp}/${hpMax(mine)} HP</small><small class="energy-score">⚡ Energy ${b.energy}/4</small></div></div>${b.fx==='ally-hit'?`<div class="player-hit">−${n?.amount||0}</div>`:''}</div>
 <div class="intent-panel"><strong>Next: ${esc(Core.INTENTS[b.intent||'strike'][0])}</strong><small>${esc(Core.INTENTS[b.intent||'strike'][1])}${b.foeQueue?.length?' · '+(b.foeQueue.length+1)+' opponents left':''}</small>${state.settings.hints?`<small>${b.boss?esc(Core.GUARDIANS[b.region].hint):esc(Core.PASSIVES[mine.sp][0]+': '+Core.PASSIVES[mine.sp][1])}</small>`:''}${b.finale?'<small>Trial '+(b.finale.phase+1)+'/3 · '+esc(b.finale.title)+'</small><small>'+esc(b.finale.preparation)+'</small>':''}${b.field?'<small>Trail: '+esc(Adv.REGIONS[b.region].effectText)+'</small>':b.expedition?'<small>'+esc(World.EXPEDITION_THEMES[b.region].rule)+'</small>':''}${b.playerWeakTurns?'<small>Your attacks weakened: '+b.playerWeakTurns+' attacks</small>':''}${b.weakenTurns?'<small>Enemy weakened: '+b.weakenTurns+' attacks</small>':''}</div><div class="energy-panel" role="status" aria-label="Battle energy: ${b.energy} out of 4. Strike adds 1, Guard adds 2, Burst costs 2."><div class="row between gap6"><strong>⚡ Energy ${b.energy} / 4</strong><small>Starts at 2 each battle</small></div><div class="energy-pips">${Array.from({length:4},(_,i)=>`<span class="energy-pip ${i<b.energy?'filled':''}"></span>`).join('')}</div><div class="energy-rules">Strike <b>+1</b> · Guard <b>+2</b> · Burst <b>−2</b><span>No automatic recharge</span></div></div>
 <div class="matchup-strip ${matchColor}"><span class="matchup-icon">${known?(mult>1?'↗':mult<1?'↘':'◆'):'?'}</span><span>${advice}</span><span class="matchup-value">${known?`${ELEMENTS[at].name} → ${ELEMENTS[dt].name}: ${affinityHint(at,dt)}`:'Attack once to discover this matchup'}</span></div>
 <div class="battle-announcer ${nEffect}" role="status" aria-live="polite"><div class="battle-act"><span class="phase-dot ${b.doing?'busy':''}"></span><strong>${esc(n?.title||b.log)}</strong></div><div class="battle-detail">${esc(n?.detail||(b.doing?'Action in progress…':'Choose your next move below.'))}</div>${effectiveness}</div>
 ${b.coach&&state.settings.hints?`<p class="field-status">${esc((LESSONS.find(([id])=>!(state.story.lessons||[]).includes(id)&&(id!=='switch'||state.team.length>1))||['','Watch the next intention. Try combining your techniques.'])[1])}</p>`:''}${b.showMoves?battleMoveHelp(mine,foe):''}
 <div class="battle-actions"><button class="btn primary move-btn" data-a="attack" data-v="strike" ${b.doing?'disabled':''}><span>⚔️ Strike</span><small>+1 ⚡ → ${Math.min(4,b.energy+1)}/4</small></button><button class="btn amber move-btn" data-a="attack" data-v="burst" ${b.doing||b.energy<2?'disabled':''}><span>✨ Element burst</span><small>−2 ⚡ → ${Math.max(0,b.energy-2)}/4</small></button><button class="btn secondary move-btn signature-btn" data-a="attack" data-v="signature" ${b.doing||b.energy<1||(b.cooldowns[mine.uid]||0)>0?'disabled':''}><span>🌟 ${esc(signatureOf(mine)[0])}</span><small>−1 ⚡ · ${(b.cooldowns[mine.uid]||0)>0?'Ready in '+b.cooldowns[mine.uid]+' actions':esc(signatureOf(mine)[2])}</small></button><button class="btn secondary move-btn" data-a="attack" data-v="guard" ${b.doing?'disabled':''}><span>🛡️ Guard</span><small>+2 ⚡ → ${Math.min(4,b.energy+2)}/4 · shield</small></button><button class="btn secondary move-btn" data-a="catchmenu" ${b.boss||b.arena||b.expedition||(b.field&&!b.field.nest)||b.doing?'disabled':''}><span>🟢 Bond</span><small>${b.boss?'Win to befriend boss for free':`${state.orbs+state.prisms} orbs · capture`}</small></button></div>
 <button class="btn secondary block battle-flee" data-a="flee" ${b.doing?'disabled':''}>🏃 Flee encounter <small>Always succeeds${b.expedition?' · unsecured pack lost':b.tournament?' · ends this bracket':' · companions fully heal'}</small></button><div class="battle-footer"><button class="btn ghost tiny" data-a="tonic" ${state.tonics<1||b.doing?'disabled':''}>🧪 Tonic +${Math.max(50,Math.ceil(hpMax(mine)*.7))} HP (${state.tonics})</button><button class="btn ghost tiny info-toggle" data-a="moves" aria-expanded="${!!b.showMoves}">${b.showMoves?'✕ Hide moves':'ⓘ Move details'}</button><div class="battle-switch">${teamKin().map((k,i)=>`<button class="${k.uid===mine.uid?'active':''}" data-a="switch" data-v="${k.uid}" ${k.hp<=0||b.doing?'disabled':''} aria-label="Switch to ${esc(nameOf(k))}">${i+1} ${ELEMENTS[SPEC[k.sp].type].icon}</button>`).join('')}</div></div>
 ${hist.length?`<details class="battle-history"><summary>Previous actions (${b.events.length})</summary>${(b.events||[]).map(e=>`<div class="battle-history-line"><b>${esc(e.title)}</b><small>${esc(e.detail)}</small></div>`).join('')}</details>`:''}
 </div></div>`;
 ROOT.insertAdjacentHTML('beforeend',h);if(capture)renderCapture();
}
async function switchKin(uid){
 if(!battle||battle.doing||battle.active===uid||!state.team.includes(uid))return;
 const k=state.kin.find(x=>x.uid===uid);if(!k||k.hp<=0)return;
 recordLesson('switch');const b=battle;b.doing=true;b.active=uid;b.energy=2;b.entry=uid;if(Core.PASSIVES[k.sp][2]==='entry')b.guard=1-Core.PASSIVES[k.sp][3];
 announce(`Go, ${nameOf(k)}!`,'A fresh companion joins your side. The opponent gets a turn next.','player',0,'player','enter');
 await pause(900);if(!battleAlive(b))return;await foeAttack();
}
function renderCapture(){if(!capture||!battle)return;ROOT.inert=true;const c=capture;document.getElementById('capture')?.remove();document.body.insertAdjacentHTML('beforeend',`<div class="capture-center" id="capture"><div class="capture-card" role="dialog" aria-modal="true" aria-label="Bonding ritual"><div class="kicker">Bonding ritual</div><h2>Find the perfect moment</h2><div class="subtext">Tap when the golden pointer crosses the glowing green arc.</div><div class="capture-circle"><div class="sweep"></div><div class="inner">${c.kind==='prism'?'🔮':'🟢'}</div></div><button class="btn primary block" data-a="seal">✦ SEAL THE BOND</button><button class="btn ghost tiny mt16" data-a="cancelcapture">Cancel</button><div class="subtext mt12">Weaken wild kin for a stronger bond. Prism orbs give an extra boost.</div></div></div>`)}
function openCapture(kind){if(!battle||battle.boss||battle.arena||battle.expedition||(battle.field&&!battle.field.nest)||battle.doing)return;if(kind==='orb'&&state.orbs<1||kind==='prism'&&state.prisms<1){toast('You are out of those orbs.');return}closeModal();capture={kind,start:performance.now()};render();renderCapture();sound(740,.12)}
async function sealCapture(){
 if(!capture||!battle||battle.doing)return;
 const b=battle,c=capture,foe=b.foe,period=.97*1000;
 const phase=((performance.now()-c.start)%period)/period,aim=(phase-.18+1)%1,good=aim>.61&&aim<.9,perfect=aim>.71&&aim<.8;
 state[c.kind==='prism'?'prisms':'orbs']--;
 const fmax=foe.guardHp||hpMax(foe),hpRatio=foe.hp/fmax,rar=SPEC[foe.sp].rarity;
 const firstBond=state.kin.length<3&&state.totalCatches<3;
 const odds=firstBond?1:clamp(.17+(1-hpRatio)*.53+(c.kind==='prism'?.22:0)+(good?.18:0)+(perfect?.12:0)-rar*.065,.08,.97);
 capture=null;ROOT.inert=!!modal;document.getElementById('capture')?.remove();b.doing=true;
 announce(`${c.kind==='prism'?'Prism':'Bond'} orb released!`,perfect?'Perfect timing! The bond is strengthening…':good?'Great timing! The bond is forming…':'The orb is struggling to connect…','player',0,'player','ally-windup');
 await pause(850);if(!battleAlive(b))return;
 if(Math.random()<odds){learnFoe();finishBattle(true);toast(perfect?'Perfect timing! Bond formed!':'Bond formed!')}
 else{announce('The bond slipped away!',good?'Almost! The creature broke free. Your opponent acts next.':'The timing was off. The creature broke free and will attack.','incoming',0,'foe','foe-windup');sound(165,.25,'sawtooth');save();await pause(950);if(!battleAlive(b))return;await foeAttack()}
}
function renderModal(content=''){if(!modal)return;ROOT.inert=true;document.getElementById('modal')?.remove();document.body.insertAdjacentHTML('beforeend',`<div class="modal-backdrop" id="modal"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">${content}</div></div>`);document.querySelector('#modal button')?.focus({preventScroll:true})}
function showModal(){if(!modal)return;const m=modal;let title='',html='';
if(m.type==='story'){renderModal(`<div class="modal-head"><h2 id="modalTitle">${esc(m.title)}</h2><button class="iconbtn" data-a="close" aria-label="Close dialogue">×</button></div><p class="story-copy">${esc(m.text)}</p>${m.extra||''}<button class="btn ghost block mt12" data-a="close">Return to the map</button>`);return;}
if(m.type==='newJourney'){title='Start fresh';html='<p>This starts a new game and replaces the current save on this device. Export your backup first to keep your creatures and progress.</p><button class="btn secondary block mt12" data-a="backup">Export current save</button><label class="row gap6 mt12"><input id="freshConfirm" type="checkbox"> I saved my backup and understand this replaces my progress.</label><button class="btn primary block mt12" data-a="freshExecute">Start new adventure</button>'}

if(m.type==='detail'){const k=state.kin.find(x=>x.uid===m.uid);if(!k){modal=null;return}const s=SPEC[k.sp],on=state.team.includes(k.uid);title=nameOf(k);html=`<div class="portrait">${svgKin(k)}</div><div class="row between gap6"><div class="row gap6">${typeLabel(s.type)}<span class="pill ${k.aurora?'aurora':''}">${k.aurora?'✨ Aurora':rarities[s.rarity]}</span></div><span class="pill">Lv ${k.level}</span></div><div class="row between mt12"><div class="grow"><strong>${esc(s.name)} ${k.evo?'→ '+esc(s.evolved):''}</strong><div class="subtext">${ZONES[s.zone].name}</div></div><small>XP ${k.xp}/${expNeed(k.level)}</small></div><div class="xpbar"><span style="width:${k.xp/expNeed(k.level)*100}%"></span></div>${[['HP',k.hp,hpMax(k)],['Power',power(k),150],['Defense',defense(k),100]].map(([name,val,max])=>`<div class="statline"><b>${name}</b><div class="progress"><span style="width:${Math.min(100,val/max*100)}%"></span></div><small>${val}</small></div>`).join('')}<div class="row gap6 mt16 wrap"><button class="btn ${on?'secondary':'primary'} grow medium" data-a="teamtoggle" data-v="${k.uid}">${on?'★ Remove from team':'＋ Add to team'}</button><button class="btn secondary medium grow" data-a="giftone" data-v="${k.uid}">🎁 Gift</button></div><div class="row gap6 mt12 wrap"><button class="btn ghost medium grow" data-a="rename" data-v="${k.uid}">✎ Nickname</button><button class="btn danger medium grow" data-a="releaseask" data-v="${k.uid}" ${state.kin.length<=1?'disabled':''}>Release</button></div><button class="btn ghost medium block mt12" data-a="favorite" data-v="${k.uid}">${k.favorite?'⭐ Remove favorite':'☆ Mark as favorite'}</button><div class="panel mt12"><strong>${esc(Core.PASSIVES[k.sp][0])}</strong><p class="subtext mt8">${esc(Core.PASSIVES[k.sp][1])}</p><div class="subtext mt8">Charm: ${esc(state.equipment[k.uid]||'none')} · choose one, 120 coins each</div><div class="row wrap gap6 mt8">${[['power','Power +10% damage'],['ward','Ward −10% damage'],['vital','Vital · 5% Guard heal'],['none','Remove · free']].map(([id,label])=>`<button class="btn secondary tiny" data-a="equip" data-v="${id}" ${state.equipment[k.uid]===id?'disabled':''}>${label}</button>`).join('')}</div></div><div class="panel mt12"><strong>🌟 Signature move</strong><div class="subtext mt8">${esc(signatureBlurb(k))}</div></div>${!k.evo?'<div class="footer-note">Evolves naturally at level 12.</div>':''}`}
else if(m.type==='swap'){title='Swap your battle party';const incoming=state.kin.find(k=>k.uid===m.uid);if(!incoming){modal=null;return}html=`<p class="subtext mb8">Your party has three companions. Choose one to send to the Sanctuary so ${esc(nameOf(incoming))} can join.</p>${teamKin().map(k=>`<button class="swap-choice" data-a="confirmswap" data-v="${k.uid}">${svgSmall(k)}<span><strong>${esc(nameOf(k))}</strong><small> Lv ${k.level} · To Sanctuary</small></span><span>Swap →</span></button>`).join('')}`;}
else if(m.type==='result'){title=m.title;html=`<div class="confetti">${m.win?'🏆 ✨ 🎉':'🏕️ 💚'}</div>${m.foe?`<div class="portrait">${svgKin(m.foe)}</div>`:''}<p class="subtext center" style="font-size:15px;margin-bottom:13px">${esc(m.message)}</p>${m.firstSeal?`<p class="story-copy">${esc(World.REGIONS[m.firstSeal-1].climax)}</p>`:''}${m.ending?`<p class="story-copy">${esc(endingText())}</p>`:''}${renderXpRows(m.experience)}${m.nextTournament?'<button class="btn amber block mt12" data-a="nextmatch">Continue tournament</button>':''}${Number.isInteger(m.guardianOffer)?`<button class="btn amber block mt12 guardian-claim" data-a="claimguardian">👑 Befriend ${esc(ZONES[m.guardianOffer].guardian)} · FREE</button><div class="subtext center mt8">Guaranteed capture after winning · no Bond orb required</div>`:'' }<div class="panel center"><strong style="color:var(--gold)">${esc(m.bonus||'Your companions are waiting at camp.')}</strong></div><button class="btn primary block mt16" data-a="close">Continue journey</button>`}
else if(m.type==='catchmenu'){title='Choose a bonding orb';const f=battle?.foe;html=`<p class="subtext mb8">${state.kin.length<3&&state.totalCatches<3?'Your first two wild bonds are guaranteed. Welcome two companions to complete your party.':'A weakened creature is easier to befriend. Match the moving marker for a bonus!'}</p><div class="panel">${[['orb','🟢','Bond orb',state.orbs,'Standard bonding chance'],['prism','🔮','Prism orb',state.prisms,'Higher chance of a successful bond']].map(([kind,ic,n,count,sub])=>`<div class="camp-item"><span class="item-icon">${ic}</span><div class="grow"><strong>${n}</strong><div class="subtext">${sub} · ${count} left</div></div><button class="btn primary tiny" data-a="chooseorb" data-v="${kind}" ${count===0?'disabled':''}>Choose</button></div>`).join('')}</div><div class="subtext mt12">Target HP: ${f?.hp||0}/${f?.guardHp||hpMax(f)}</div>`}
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
function closeModal(){modal=null;ROOT.inert=!!capture;document.getElementById('modal')?.remove()}
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
  stopMusic();state=restored;observedRevision=restored.revision;observedUpdatedAt=restored.updatedAt;storageConflict=false;unreadableSaves.length=0;battle=null;modal=null;capture=null;expansionInit();healCollectionAfterBattle();save();render();toast('Verified backup restored.');
 }catch(error){toast(error.message||'That is not a valid Wildkin backup.');}
 };f.click();
}
// Living Wilds campaign and replay systems. State stays in the existing save.
function expansionInit(){
 if(!state)return;
 state.adventure=state.adventure||Adv.blankState();
 state.schema=Core.SCHEMA;state.research=state.research||{};state.arenaWins=state.arenaWins||0;state.arenaTier=state.arenaTier||0;state.arenaMedals=state.arenaMedals||[];state.expedition=state.expedition||null;state.expeditionRecords=state.expeditionRecords||{};state.habitat=state.habitat||0;state.teamPresets=state.teamPresets||[];
 state.story=state.story||{};state.story.completed=state.story.completed||[];state.story.choices=state.story.choices||{};state.story.journal=state.story.journal||[];
 state.hunt=state.hunt||{};state.achievements=state.achievements||{};state.equipment=state.equipment||{};state.decor=state.decor||[];state.affection=state.affection||{};state.settings=state.settings||{speed:1,reduced:false,hints:true,music:false};
 if(!state._researchMigrated){for(const k of state.kin){const r=state.research[k.sp]||(state.research[k.sp]={seen:0,won:0,caught:0,claimed:0,evolved:0});r.seen=Math.max(1,r.seen||0);r.caught=Math.max(1,r.caught||0);if(k.evo)r.evolved=Math.max(1,r.evolved||0)}state._researchMigrated=true;}
}
function nodeId(z,r,n){return z+':'+r+':'+n}
function nodeDone(z,r,n){return state.story.completed.includes(nodeId(z,r,n))}
function routeDone(z,r){return World.REGIONS[z].routes[r].every((_,n)=>nodeDone(z,r,n))}
function chapterStoryReady(z){return [0,1,2].some(r=>routeDone(z,r))}
function guardianReady(z){return state.badges.includes(z)||(adventureCount(z)>=3&&chapterStoryReady(z))}
function storyDialog(title,text,extra=''){modal={type:'story',title,text,extra};showModal()}
function endingText(){
 const returns=ZONES.map((zone,z)=>{const choice=state.adventure.requests[z];return zone.name+': '+(Number.isInteger(choice)?Adv.REGIONS[z].restored[choice]:World.HOMECOMINGS[z]);});
 return World.ENDING+'\n\nThe wilds you leave behind\n\n'+returns.join('\n\n');
}
const LESSONS=[['strike','Strike builds energy for stronger moves.'],['guard','Guard a charged strike to reduce damage and gain energy.'],['burst','Element burst spends two energy. Check the matchup first.'],['signature','Your signature spends one energy and has its own special effect.'],['bond','Bond with a wild companion. Your first two bonds are guaranteed.'],['switch','Switch to another party member. The opponent gets a turn, so choose your moment.']];
function recordLesson(id){if(!LESSONS.some(([key])=>key===id))return;state.story.lessons=state.story.lessons||[];if(!state.story.lessons.includes(id))state.story.lessons.push(id)}
function lessonPanel(){const learned=state.story.lessons||[],next=LESSONS.find(([id])=>!learned.includes(id)&&(id!=='switch'||state.team.length>1));return `<section class="panel mt12"><h3>Tamsin’s battle workshop · ${learned.length}/6</h3><p class="subtext mt8">${next?esc(next[1]):'Every technique practiced. Combine your companions’ strengths and read the next intention.'}</p><p class="subtext mt8">Practice in any battle. Nothing is timed or required. Every completed battle restores your entire collection.</p><button class="btn secondary block mt12" data-a="practice">Meet a meadow practice partner</button><details class="mt8"><summary>Review all six techniques</summary>${LESSONS.map(([id,text])=>`<p class="subtext mt8">${learned.includes(id)?'✓':'○'} ${esc(text)}</p>`).join('')}</details></section>`}
function campaignGuide(){const z=ZONES.findIndex((_,i)=>!state.badges.includes(i));if(z<0)return `<section class="panel mt12"><h3>A living world, still growing</h3><p class="subtext mt8">Your six beacons are restored. Complete the regional requests, seek every form, and challenge the arena or an expedition. Your ending stays in the journal.</p><button class="btn secondary block mt12" data-a="journal">Revisit your homecoming</button></section>`;
 const relays=adventureCount(z),needsParty=state.team.length<3;return `<section class="panel mt12"><div class="kicker">Your next chapter · ${z+1}/6</div><h3>${esc(World.REGIONS[z].title)}</h3><p class="subtext mt8">${needsParty?'Welcome two wild companions to build a party. The first two bonds are guaranteed.':!chapterStoryReady(z)||relays<3?'Complete one regional story, then restore the three field relays. Each map offers two approaches and optional discoveries.':z===5?'The Still Heart is open. Prepare a mixed team for three linked trials.':'The Guardian trail is ready. Review its rhythm and bring a varied team.'}</p><button class="btn primary block mt12" data-a="chapter">${needsParty?'Find a companion':!chapterStoryReady(z)||relays<3?'Continue the chapter':z===5?'Approach the Still Heart':'Prepare the Guardian encounter'}</button><small class="block mt8">${relays}/3 relays · ${state.badges.length}/6 beacons restored</small></section>`}
function continueChapter(){if(battle)return;const z=ZONES.findIndex((_,i)=>!state.badges.includes(i));if(z<0){state.screen='expedition';save();render();return}state.zone=z;state.screen='explore';state.adventure.active=null;closeModal();if(state.team.length<3){startEncounter(false);return}if(!chapterStoryReady(z)){const r=[0,1,2].sort((a,b)=>World.REGIONS[z].routes[b].filter((_,n)=>nodeDone(z,b,n)).length-World.REGIONS[z].routes[a].filter((_,n)=>nodeDone(z,a,n)).length)[0],n=World.REGIONS[z].routes[r].findIndex((_,i)=>!nodeDone(z,r,i));enterNode(nodeId(z,r,n));return}if(adventureCount(z)<3){const route=[0,1,2].find(r=>!state.adventure.runs[z+':'+r]?.completed);beginAdventure(z+':'+route);return}save();render();document.querySelector('[data-a="boss"]')?.scrollIntoView?.({block:'center'})}
function showStoryIntro(){const z=state.zone,r=World.REGIONS[z];storyDialog(r.title,r.npc+': '+r.intro,'<button class="btn primary block mt12" data-a="practice">Try a guided practice battle</button><button class="btn secondary block mt12" data-a="tutorialdone">Skip introduction and explore</button>')}
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
 const field=currentAdventure();if(field)return adventureScreen(field);
 const z=state.zone,r=World.REGIONS[z],count=r.routes.flat().length,done=state.story.completed.filter(id=>id.startsWith(z+':')).length,ready=guardianReady(z);
 return `<div class="row between"><div><div class="kicker">Chapter ${z+1} · ${esc(r.npc)}</div><h2>${ZONES[z].name}</h2></div><span class="pill">${state.badges.length}/6 seals</span></div><div class="area-tabs">${ZONES.map((a,i)=>`<button class="area-tab ${i===z?'selected':''}" data-a="zone" data-v="${i}" ${unlocked(i)?'':'disabled'}>${unlocked(i)?a.icon:'🔒'} ${a.short}</button>`).join('')}</div><section class="world-card">${mapSvg(z)}<div class="panel"><div class="kicker">${esc(r.title)}</div><p class="subtext mt8">${esc(r.intro)}</p><button class="btn ghost tiny mt8" data-a="journal">Read journal · ${done}/${count} discoveries</button></div></section>${state.story.ending?'<div class="note-card mt12">✦ Story complete. Rematches, mastery and the living wilds await.</div>':''}${state.team.length<3?`<div class="panel mt12"><h3>A party for the journey · ${state.team.length}/3</h3><p class="subtext mt8">Your first two wild bonds are guaranteed. Welcome companions of different elements before taking on a field team.</p><button class="btn primary block mt12" data-a="search">Meet a wild companion</button></div>`:""}${campaignGuide()}${adventureLaunchPanel(z)}${finalePanel()}<details class="regional-stories mt16"><summary>Regional stories · choose one arc · ${done}/${count} discoveries</summary><div class="section-line"><h2>Regional stories</h2><span class="pill">Choose your route</span></div>${r.routes.map((events,route)=>`<section class="panel mt12 route-panel"><div class="row between"><h3>${TRAILS[z][route][1]} ${TRAILS[z][route][0]}</h3><small>${routeDone(z,route)?'✓ Complete':'Optional discoveries'}</small></div><div class="route-nodes mt12">${events.map((event,n)=>`<button class="route-node ${nodeDone(z,route,n)?'complete':''}" data-a="storynode" data-v="${nodeId(z,route,n)}" ${n>0&&!nodeDone(z,route,n-1)?'disabled':''}><span>${nodeDone(z,route,n)?'✓':{puzzle:'◇',battle:'⚔',secret:'✦',choice:'↔',dialogue:'☏'}[event.kind]}</span><span><strong>${esc(event.title)}</strong><small>${event.kind==='battle'?'Tactical encounter':event.kind==='puzzle'?'Solve the clue':event.kind==='secret'?'Secret discovery':event.kind==='choice'?'Choose an outcome':'Meet and listen'}</small></span><span>›</span></button>`).join('')}</div><div class="row between gap6 mt12"><small>Wild encounters · ${['common','unusual','rare'][route]} trail</small><button class="btn secondary tiny" data-a="wildtrail" data-v="${route}">Roam here</button></div></section>`).join('')}</details><section class="panel mt16"><h3>👑 ${ZONES[z].guardian}</h3><p class="subtext mt8">${esc(Core.GUARDIANS[z].hint)}</p><p class="subtext mt8">${state.badges.includes(z)?'Seal earned. Rematches scale with your team.':`Complete one regional story and restore three relays. Progress: ${adventureCount(z)}/3 relays · story ${chapterStoryReady(z)?"complete":"awaiting discovery"}. Additional stories and hidden reports are optional.`}</p><button class="btn amber block mt12" data-a="boss" ${ready?'':'disabled'}>${state.badges.includes(z)?'Guardian rematch':z===5?'Enter the Still Heart':'Challenge the Guardian'}</button></section><div class="note-card mt12"><span>✨</span><div>Aurora trail signs: <b>${state.hunt[z]||0}/24</b><div class="subtext">Every non-Aurora wild encounter adds a sign. The 25th is guaranteed Aurora. Secrets add four signs.</div></div></div>`;
}
function recordResearch(id,kind){if(!state)return;expansionInit();const r=state.research[id]||{seen:0,won:0,caught:0,evolved:0,claimed:0};r[kind]=(r[kind]||0)+1;state.research[id]=r}
function researchRank(id){return Core.researchRank(state.research[id])}
const ACHIEVEMENTS=[['first','First friendship',s=>s.totalCatches>=2,80],['explorer','Six paths',s=>s.story.completed.length>=18,180],['keeper','Living beacon',s=>s.badges.length>=3,250],['ending','Room to grow',s=>s.story.ending,500],['collector','Thirty families',s=>new Set(s.caught.map(x=>x.split(':')[0])).size>=30,600],['forms','Living library',s=>new Set(s.caught).size>=60,1000],['aurora','Another light',s=>s.kin.some(k=>k.aurora),250],['arena','A crown earned',s=>s.arenaMedals.length>=4,750]];
function researchScreen(){return `<div class="kicker">Field research</div><h2>The living record</h2><p class="subtext mt8">Observe, win three encounters, bond once, and evolve each family. Four milestones, each rewarding 45 coins.</p><div class="section-line"><h3>Achievements</h3></div>${ACHIEVEMENTS.map(([id,title,check,reward])=>`<div class="panel mt8 row between gap6"><div><strong>${title}</strong><small>${state.achievements[id]?'✓ Reward claimed':check(state)?'Ready to claim': 'Keep exploring'}</small></div><button class="btn secondary tiny" data-a="achievement" data-v="${id}" ${!check(state)||state.achievements[id]?'disabled':''}>${reward} coins</button></div>`).join('')}${SPEC.map(x=>{const r=state.research[x.id]||{},rank=researchRank(x.id);return `<div class="panel mt12"><div class="row between"><strong>${r.seen?esc(x.name):'Unknown family'}</strong><span class="pill">${rank}/4</span></div><div class="subtext mt8">Observe ${Math.min(1,r.seen||0)}/1 · Win ${Math.min(3,r.won||0)}/3 · Bond ${Math.min(1,r.caught||0)}/1 · Evolve ${Math.min(1,r.evolved||0)}/1</div>${rank>(r.claimed||0)?`<button class="btn primary tiny mt8" data-a="researchclaim" data-v="${x.id}">Claim ${(rank-(r.claimed||0))*45} coins</button>`:''}</div>`}).join('')}`}
function expeditionScreen(){
 const e=state.expedition,records=Object.values(state.expeditionRecords),wins=records.reduce((sum,r)=>sum+r.wins,0);
 const header=`<div class="kicker">Six stages · no timers</div><h2>Beyond the beacons</h2><p class="subtext mt8">Read the route, prepare your companions and bring the discoveries home. Your collection fully heals after each battle. A defeat or escape loses the unsecured pack. Extract any time to bank half.</p><p class="subtext mt8">${wins} completed expeditions · ${records.length}/18 regional challenge marks</p>`;
 if(!e)return header+World.EXPEDITION_THEMES.map((t,z)=>`<section class="panel mt12"><h3>${esc(t.name)}</h3><p class="subtext mt8">${esc(ZONES[z].name)} · ${esc(t.rule)}</p><div class="stack mt12">${['Wanderer · even levels','Ranger · +2 levels','Pathfinder · +4 levels'].map((label,d)=>`<button class="btn ${d===0?'primary':'secondary'}" data-a="expbegin" data-v="${z}:${d}" ${!unlocked(z)||(d>0&&!state.story.ending)?'disabled':''}>${state.expeditionRecords[z+':'+d]?'✓ ':''}${esc(label)}${!unlocked(z)?' · region locked':d>0&&!state.story.ending?' · after the ending':''}</button>`).join('')}</div></section>`).join('');
 const event=World.expeditionEvent(e);return header+`<section class="panel mt12"><div class="row between gap6"><span class="pill">Stage ${Math.min(6,e.step+1)}/6</span><strong>${e.supplies}/8 supplies</strong></div><h3 class="mt12">${esc(event.title)}</h3><p class="story-copy">${esc(event.text)}</p><p class="subtext">${esc(event.rule)}</p><p class="subtext mt8">${event.checkpoint?'Checkpoint: two opponents on Wanderer, three on higher trails.':'Sheltered choices avoid combat here. Challenging a cache always starts a fight.'} Foes stay at Lv ${Math.min(60,e.level+e.difficulty*2)} throughout this run.</p><div class="row gap6 mt12" aria-label="Regional opponent families">${event.team.map(sp=>svgSmall({sp,level:e.level,evo:e.level>=12,aurora:false})).join('')}</div><p class="subtext mt8">Next-battle preparations: ${e.boons.shield} shields · ${e.boons.energy} energy sparks. Preparations are used when a battle begins.</p><div class="stack mt12">${event.options.map(o=>`<button class="btn ${o.id==='safe'?'primary':o.id==='risk'?'amber':'secondary'}" data-a="expchoice" data-v="${o.id}" ${o.cost>e.supplies?'disabled':''}>${esc(o.label)}<small>${o.cost<0?'Regain 2 supplies':o.cost+' '+(o.cost===1?'supply':'supplies')} · ${o.coins*(e.difficulty+1)} pack coins${o.perk?' · prepare '+o.perk:''}${o.id==='risk'?' · battle':''}</small></button>`).join('')}<button class="btn ghost" data-a="extract">Extract · bank ${Math.floor(e.loot/2)} coins</button></div><strong class="block mt12">${e.loot} coins in your pack</strong><p class="subtext mt8">${esc(e.last)}</p></section>`;
}
function beginExpedition(value){
 if(battle||state.expedition)return;const [z,d]=/^[0-5]:[0-2]$/.test(value||'')?value.split(':').map(Number):[state.zone,0];
 if(!unlocked(z)||(d>0&&!state.story.ending))return;
 const level=clamp(Math.round(teamKin().reduce((sum,k)=>sum+k.level,0)/state.team.length),1,60);
 state.expedition={step:0,loot:0,supplies:5,seed:rand(1,0x7fffffff),zone:z,difficulty:d,level,boons:{shield:0,energy:0},last:'The trail opens. Your opponents stay at this level until you return.'};save();render();
}
function expeditionChoice(choice){
 const e=state.expedition;if(!e||battle||e.pending||e.step>=6)return;
 const event=World.expeditionEvent(e),option=event.options.find(o=>o.id===choice);if(!option)return;
 if(option.cost>e.supplies){toast('Gather supplies or extract your haul.');return}
 e.supplies=clamp(e.supplies-option.cost,0,8);e.loot+=option.coins*(e.difficulty+1);
 if(option.perk)e.boons[option.perk]=Math.min(3,e.boons[option.perk]+1);
 e.step++;e.last=event.title+' · '+option.label+'.';
 if(choice==='risk'||event.checkpoint){startExpeditionEncounter(event,choice);return}finishExpeditionStep();
}
function startExpeditionEncounter(event,choice){
 const e=state.expedition;if(!e)return;startEncounter(false,false,'expedition');if(!battle)return;
 const level=clamp(e.level+e.difficulty*2,1,60),count=e.step%2===0?(e.difficulty>0?3:2):1;
 const roster=Array.from({length:count},(_,i)=>{const k=makeKin(event.team[(i+e.seed+e.step)%3],level,false,level>=12);k.aiCycle=choice==='risk'?['charge','heavy','root','strike']:['ward','strike','drain','charge','heavy'];return k});
 battle.foe=roster.shift();observeFoe(battle.foe);battle.foeQueue=roster;battle.intent=Core.intent(battle,battle.foe);battle.expedition=true;battle.terrain=event.terrain;battle.region=e.zone;
 battle.energy=Math.min(4,2+e.boons.energy);if(e.boons.shield)battle.guard=Math.max(.2,.6-e.boons.shield*.1);e.boons={shield:0,energy:0};
 e.pending=true;battle.log=event.title+' · '+(choice==='risk'?'Cache challenge':'Regional checkpoint');save();render();
}
function finishExpeditionStep(){
 const e=state.expedition;if(!e)return;if(e.step>=6&&!e.pending){
  const key=e.zone+':'+e.difficulty,record=state.expeditionRecords[key],first=!record;state.expeditionRecords[key]={wins:(record?.wins||0)+1,best:Math.max(record?.best||0,e.loot)};
  state.coins+=e.loot;state.prisms+=2+(first?e.difficulty:0);state.hunt[e.zone]=Math.min(24,(state.hunt[e.zone]||0)+3+e.difficulty);state.expedition=null;
  toast('Haul secured! Two Prism orbs, Aurora signs'+(first?' and a new regional challenge mark.':'.'));
 }save();render();
}
function arenaScreen(){return `<div class="kicker">Curated three-companion teams</div><h2>The living crown</h2><p class="subtext mt8">Win three consecutive matches to earn a tier medal. Your party heals after each match. Escaping or losing ends the bracket; retry freely. Opponents use recovery, charging and counter strategies.</p>${World.ARENA.map((a,i)=>`<div class="panel mt12"><div class="row between"><h3>${esc(a.name)}</h3><span>${state.arenaMedals.includes(i)?'🏅':''}</span></div><p class="subtext mt8">${esc(a.theme)} · Lv ${[10,20,32,44][i]}</p><div class="row gap6 mt8">${World.BRACKETS[i][2].team.map(sp=>svgSmall({sp,level:20,evo:i>0,aurora:false})).join('')}</div><details class="mt12"><summary>Scout all three matches</summary>${World.BRACKETS[i].map((t,j)=>`<p class="subtext mt8">${j+1}. ${esc(t.name)}: ${t.team.map(sp=>esc(SPEC[sp][i>0?'evolved':'name'])).join(', ')}<br>${t.cycle.map(c=>esc(Core.INTENTS[c][0])).join(' → ')}</p>`).join('')}</details><button class="btn primary block mt12" data-a="tournament" data-v="${i}" ${state.badges.length<i+1?'disabled':''}>${state.badges.length<i+1?'Earn '+(i+1)+' seals to enter':'Enter three-match tournament'}</button></div>`).join('')}<section class="panel mt16"><h3>Party presets</h3><button class="btn secondary block mt12" data-a="presetsave">Save current party · four slots</button>${state.teamPresets.map((p,i)=>`<button class="btn secondary block mt8" data-a="presetload" data-v="${i}">Party ${i+1}: ${p.map(id=>esc(nameOf(state.kin.find(k=>k.uid===id)))).join(', ')}</button>`).join('')}</section>`}
let tournament=null;
function startTournament(tier,index=0){
 if(battle||!Number.isInteger(tier)||tier<0||tier>3||!Number.isInteger(index)||index<0||index>2||state.badges.length<tier+1)return;
 tournament={tier,index};startEncounter(false,true);if(!battle)return;
 const a=World.ARENA[tier],trainer=World.BRACKETS[tier][index],level=[10,20,32,44][tier]+index;
 const roster=trainer.team.map(sp=>{const k=makeKin(sp,Math.min(60,level),false,level>=12);k.aiCycle=trainer.cycle;return k});
 battle.foe=roster.shift();observeFoe(battle.foe);battle.foeQueue=roster;battle.region=state.zone;battle.intent=Core.intent(battle,battle.foe);battle.log=a.name+' · '+trainer.name+' · '+(index+1)+'/3';battle.tournament={...tournament};render();
}
function habitatScreen(){const names=['Sunlit Garden','Coral Cove','Ember Terrace','Moonlit Grove'],limits=[0,8,20,35],lead=state.kin.find(k=>k.uid===state.team[0]),decor=['🌷','🪨','🏮','🍄','🐚','🌠'];return `<div class="kicker">A home with room to grow</div><h2>Your habitat</h2><div class="panel mt12 center habitat-theme-${state.habitat}"><div class="habitat-garden"><div class="habitat-friend">${svgKin(lead)}</div><div class="decorations">${state.decor.map(i=>`<span>${decor[i]}</span>`).join('')}</div></div><h3>${names[state.habitat]}</h3><p class="subtext mt8">${esc(nameOf(lead))} · ${state.affection[lead.uid]||0} shared moments</p><button class="btn primary block mt12" data-a="companion">Spend a moment together</button></div><div class="habitat-options mt12">${names.map((n,i)=>`<button class="btn ${state.habitat===i?'primary':'secondary'}" data-a="habitat" data-v="${i}" ${state.totalCatches<limits[i]?'disabled':''}>${n}${state.totalCatches<limits[i]?' · '+limits[i]+' bonds':''}</button>`).join('')}</div><div class="panel mt12"><h3>Earned decorations</h3><p class="subtext mt8">Each regional seal unlocks a decoration. Tap to place or remove.</p><div class="row wrap gap6 mt12">${decor.map((d,i)=>`<button class="btn secondary" data-a="decoration" data-v="${i}" ${!state.badges.includes(i)?'disabled':''}>${d} ${state.decor.includes(i)?'✓':''}</button>`).join('')}</div></div>`}
// Original note scores, synthesized locally with no downloaded recordings.
const MUSIC_SCORES=[
 {root:60,beat:660,notes:[0,4,7,12,9,7,4,null,2,5,9,7,4,2,0,null,4,7,12,16,14,12,9,7,5,9,7,4,2,4,0,null]},
 {root:57,beat:790,notes:[0,3,7,10,7,null,5,3,2,5,8,7,3,2,0,null,7,10,14,12,10,7,5,null,8,7,3,5,2,3,0,null]},
 {root:62,beat:720,notes:[0,7,9,4,2,7,4,null,5,9,12,9,7,4,2,null,0,4,7,11,12,9,7,null,5,2,4,7,2,0,null,null]},
 {root:55,beat:620,notes:[0,7,3,7,10,7,5,null,0,5,8,7,3,2,0,null,7,10,12,15,12,10,7,5,8,7,5,3,2,3,0,null]},
 {root:62,beat:570,notes:[0,4,7,11,14,11,7,null,2,6,9,12,9,6,2,null,4,7,11,14,16,14,11,7,6,9,7,4,2,4,0,null]},
 {root:60,beat:850,notes:[0,7,11,14,16,null,14,11,7,9,12,16,14,11,7,null,4,7,12,19,16,14,11,9,5,9,12,7,4,2,0,null]}
];
let musicTimer=null,musicStep=0,musicBus=null;
function audioContext(){
 try{const Ctx=window.AudioContext||window.webkitAudioContext;if(!Ctx)return null;const ctx=window.__wildAudio||(window.__wildAudio=new Ctx());if(ctx.state==='suspended')ctx.resume().catch(()=>{});return ctx}catch{return null}
}
function stopMusic(){clearTimeout(musicTimer);musicTimer=null;if(musicBus){try{const ctx=window.__wildAudio;musicBus.gain.cancelScheduledValues(ctx.currentTime);musicBus.gain.setValueAtTime(0,ctx.currentTime);musicBus.disconnect()}catch{}musicBus=null}}
function musicTone(ctx,midi,time,duration,volume,type='sine'){
 const osc=ctx.createOscillator(),gain=ctx.createGain();osc.type=type;osc.frequency.setValueAtTime(440*2**((midi-69)/12),time);gain.gain.setValueAtTime(.0001,time);gain.gain.exponentialRampToValueAtTime(volume,time+.06);gain.gain.exponentialRampToValueAtTime(.0001,time+duration);osc.connect(gain).connect(musicBus);osc.onended=()=>{osc.disconnect();gain.disconnect()};osc.start(time);osc.stop(time+duration+.03);
}
function musicBeat(){
 musicTimer=null;if(!state?.sound||!state.settings.music||document.hidden){stopMusic();return}
 const ctx=audioContext();if(!ctx)return;
 if(!musicBus){musicBus=ctx.createGain();musicBus.gain.value=.55;musicBus.connect(ctx.destination)}
 const score=MUSIC_SCORES[state.zone],step=musicStep++%32,note=score.notes[step],beat=(battle?Math.max(430,score.beat*.82):score.beat),duration=beat/1000*.9;
 if(note!==null)musicTone(ctx,score.root+note,ctx.currentTime,duration,.035,battle?'triangle':'sine');
 if(step%4===0){const chord=[0,5,3,7][Math.floor(step/8)];musicTone(ctx,score.root-24+chord,ctx.currentTime,duration*3,.028);musicTone(ctx,score.root-12+chord+7,ctx.currentTime,duration*3,.012)}
 musicTimer=setTimeout(musicBeat,beat);
}
function startMusic(){if(musicTimer||!state?.settings?.music||!state.sound||document.hidden)return;musicBeat()}
function settingsPanel(){return lessonPanel()+`<div class="panel mt16"><h3>Comfort and accessibility</h3><div class="stack mt12"><button class="btn secondary" data-a="speed">Battle speed · ${state.settings.speed}×</button><button class="btn secondary" data-a="motion">Reduced motion · ${state.settings.reduced?'on':'off'}</button><button class="btn secondary" data-a="music">Regional music · ${state.settings.music?'on':'off'}</button><button class="btn secondary" data-a="hinttoggle">Battle hints · ${state.settings.hints?'on':'off'}</button></div>${updateStatus==='available'?'<button class="btn primary block mt12" data-a="applyupdate">Install downloaded update</button>':''}</div>`}
function recoveryScreen(){return '<div class="intro-cover"><h2>Protect your adventure</h2><p class="story-copy">Your stored save could not be read safely. It has been kept intact. Download the original data for recovery, or restore a verified backup.</p><button class="btn secondary block mt12" data-a="rawbackup">Download recovery data</button><button class="btn primary block mt12" data-a="restore">Restore a backup</button></div>'}
function downloadRecovery(){const blob=new Blob([JSON.stringify({game:'WILDKIN-RECOVERY',copies:unreadableSaves})],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='wildkin-recovery.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),4000)}
function featureAction(a,v,btn){
 if(!state)return false;
 if(a==='loadlatest'){battle=null;capture=null;modal=null;startGame();return true}
 if(storageConflict&&a!=='backup')return true;
 if(adventureAction(a,v,btn))return true;
 if(a==='storynode'){enterNode(v);return true}
 if(a==='storychoice'){completeStory(v,Number(btn.dataset.choice));return true}
 if(a==='finalapproach'){if(!battle&&['shelter','relay'].includes(v)){state.story.finalApproach=v;save();render()}return true}
 if(a==='chapter'){continueChapter();return true}
 if(a==='practice'){if(!battle){closeModal();state.story.tutorial=true;state.zone=0;startEncounter(false);if(battle){battle.coach=true;battle.showMoves=false;render()}}return true}
 if(a==='tutorialdone'){state.story.tutorial=true;save();closeModal();return true}
 if(a==='journal'){storyDialog('The journey so far',state.story.ending?endingText():World.REGIONS[state.zone].intro,state.story.journal.map(t=>'<p class="journal-entry">'+esc(t)+'</p>').join(''));return true}
 if(a==='wildtrail'){state.trailSpot=state.trailSpot||{};state.trailSpot[state.zone]=Number(v);searchWilds();return true}
 if(a==='researchclaim'){const id=Number(v),r=state.research[id],pending=researchRank(id)-(r?.claimed||0);if(r&&pending>0){r.claimed=researchRank(id);state.coins+=pending*45;save();render()}return true}
 if(a==='achievement'){const achievement=ACHIEVEMENTS.find(x=>x[0]===v);if(achievement&&!state.achievements[v]&&achievement[2](state)){state.achievements[v]=true;state.coins+=achievement[3];save();render()}return true}
 if(a==='expbegin'){beginExpedition(v);return true}
 if(a==='expchoice'){expeditionChoice(v);return true}
 if(a==='extract'){if(state.expedition){state.coins+=Math.floor(state.expedition.loot/2);state.expedition=null;save();render();toast('Extracted safely. Half the haul secured.')}return true}
 if(a==='tournament'){startTournament(Number(v));return true}
 if(a==='nextmatch'){if(modal?.nextTournament){const t=modal.nextTournament;closeModal();startTournament(t.tier,t.index)}return true}
 if(a==='companion'){const k=teamKin()[0];state.affection[k.uid]=(state.affection[k.uid]||0)+1;const lines=['leans against your hand and listens to the distant beacons.','chases a drifting light, then proudly returns to your side.','settles beside you. The wilds can wait a moment.'];const home=state.badges.includes(state.zone)?(Number.isInteger(state.adventure.requests[state.zone])?Adv.REGIONS[state.zone].restored[state.adventure.requests[state.zone]]:World.HOMECOMINGS[state.zone]):'';storyDialog(nameOf(k),nameOf(k)+' '+pick(lines)+(home?' '+home:''));save();return true}
 if(a==='decoration'){const i=Number(v);if(state.badges.includes(i)){state.decor=state.decor.includes(i)?state.decor.filter(n=>n!==i):[...state.decor,i];save();render()}return true}
 if(a==='equip'){const id=modal?.uid,k=state.kin.find(x=>x.uid===id);if(k&&['none','power','ward','vital'].includes(v)){if(v!=='none'&&state.coins<120){toast('A charm costs 120 coins.');return true}if(v!=='none')state.coins-=120;state.equipment[id]=v;save();showModal()}return true}
 if(a==='speed'){state.settings.speed=state.settings.speed===1?1.5:state.settings.speed===1.5?2:1;save();render();return true}
 if(a==='motion'){state.settings.reduced=!state.settings.reduced;save();render();return true}
 if(a==='hinttoggle'){state.settings.hints=!state.settings.hints;save();render();return true}
 if(a==='music'){state.settings.music=!state.settings.music;stopMusic();if(state.settings.music)startMusic();save();render();return true}
 if(a==='applyupdate'){applyUpdate();return true}
 return false;
}
// Authored field adventures share the existing collection, battle and save systems.
function adventureCount(z){return Object.entries(state.adventure.runs).filter(([key,run])=>key.startsWith(z+':')&&run.completed).length}
function fieldKey(z,r){return z+':'+r}
function currentAdventure(){const key=state.adventure.active,run=state.adventure.runs[key];if(!key||!run)return null;const [zone,route]=key.split(':').map(Number);return {key,run,zone,route,region:Adv.REGIONS[zone],mission:Adv.REGIONS[zone].missions[route]}}
function beginAdventure(key){if(!/^[0-5]:[0-2]$/.test(key)||battle)return;const [z,r]=key.split(':').map(Number);if(!unlocked(z))return;state.zone=z;state.adventure.runs[key]=state.adventure.runs[key]||Adv.runState(z,r);state.adventure.active=key;state.screen='explore';closeModal();save();render();window.scrollTo({top:0,behavior:'instant'})}
function moveAdventure(destination){const active=currentAdventure();if(!active||battle||!Number.isInteger(destination)||!Adv.reachable(active.run,destination))return false;const run=active.run;if(run.position===1&&!run.branch&&[2,5].includes(destination))run.branch=destination===2?'upper':'lower';run.position=destination;if(!run.visited.includes(destination))run.visited.push(destination);save();render();document.getElementById('fieldRoom')?.scrollIntoView?.({block:'start',behavior:state.settings.reduced?'instant':'smooth'});return true}
function clearAdventureRoom(action){const active=currentAdventure();if(!active||battle)return false;const {run,zone,mission}=active,id=run.position,room=mission.rooms[id];if(run.cleared.includes(id))return false;
 if(['battle','captain','nest'].includes(room.kind))return false;
 if(room.kind==='puzzle'&&!Adv.puzzleSolved(run.puzzle)){toast('The mechanism is not solved yet. Hints and another route are available.');return false}
 if(room.kind==='secret'&&(!run.clue||!run.cleared.includes(6)))return false;
 if(room.kind==='relay'&&!run.cleared.includes(9))return false;
 if(room.kind==='choice'){if(!['aid','craft'].includes(action))return false;if(action==='aid'){if(state.tonics<1){toast('No tonics available. The crafted solution is free.');return false}state.tonics--;state.prisms++;}run.help=action;}
 if(room.kind==='clue')run.clue=true;
 if(room.kind==='puzzle')grantPartyXp(teamKin(),45+Core.BASE_LEVELS[zone]*4);
 if(room.kind==='secret'){run.evidence=true;state.hunt[zone]=Math.min(24,(state.hunt[zone]||0)+3);state.coins+=50+zone*10;}
 run.cleared.push(id);
 if(room.kind==='relay'){run.completed=true;const coins=90+zone*25,xp=55+zone*18;state.coins+=coins;state.prisms++;const experience=grantPartyXp(teamKin(),xp);healCollectionAfterBattle();modal={type:'result',win:true,title:'A relay restored',message:room.text+' Your field notes remain in the journal, and this route is safe to revisit.',bonus:'+'+coins+' coins · +1 Prism orb',experience};}
 if(['brief','clue','secret','relay'].includes(room.kind))state.story.journal.push(mission.title+' / '+room.name+': '+room.text);
 state.totalSearches++;activity('search');save();render();return true;
}
function finishAdventureBattle(b){const field=b.field,run=state.adventure.runs[field?.key];if(!field||!run||run.position!==field.room||run.cleared.includes(field.room))return;run.cleared.push(field.room);state.totalSearches++;activity('search')}
function startAdventureBattle(){const active=currentAdventure();if(!active||battle)return false;const {run,zone,route,mission,key}=active,id=run.position;if(![2,8,9].includes(id)||run.cleared.includes(id))return false;
 startEncounter(false,false,'adventure');if(!battle)return false;
 const level=clamp(Core.BASE_LEVELS[zone]+(id===9?2:0),1,60),roster=id===8?[zoneSpecies(zone)[route===0?3:route===1?2:4].id]:id===2?mission.team.slice(0,2):mission.team;
 const foes=roster.map(sp=>makeKin(sp,level,id===8&&((state.hunt[zone]||0)>=24||Math.random()<.025),level>=12&&id!==8));
 battle.foe=foes.shift();battle.foeQueue=foes;battle.field={key,room:id,effect:Adv.REGIONS[zone].effect,nest:id===8};battle.region=zone;battle.intent=Core.intent(battle,battle.foe);battle.log=mission.rooms[id].text;observeFoe(battle.foe);
 if(run.branch==='upper')battle.energy=3;if(run.branch==='lower')battle.guard=.75;if(run.help==='aid')battle.guard=.65;if(run.help==='craft')battle.energy=Math.min(4,battle.energy+1);
 if(id===8)state.hunt[zone]=battle.foe.aurora?0:Math.min(24,(state.hunt[zone]||0)+1);
 save();render();return true;
}
function adventurePuzzleAction(action){const active=currentAdventure();if(!active||battle||active.run.position!==6||active.run.cleared.includes(6))return false;const run=active.run;if(action==='reset'){run.puzzle=Adv.createPuzzle(active.zone,active.route);run.hint=null}else if(action==='hint'){run.hint=Adv.puzzleHint(run.puzzle);toast(run.hint?'Hint highlighted. You can keep thinking or use it.':'The puzzle is solved. Open the lower gate.')}else{if(!Adv.puzzleActions(run.puzzle).includes(action))return false;run.puzzle=Adv.puzzleStep(run.puzzle,action);run.hint=null;}save();render();document.querySelector('[data-a="fieldpuzzle"][data-v="'+action+'"]')?.focus({preventScroll:true});return true}
function fieldReports(z){return Object.entries(state.adventure.runs).filter(([key,run])=>key.startsWith(z+':')&&run.completed&&run.evidence).length}
function resolveFieldRequest(z,choice){if(!Number.isInteger(z)||z<0||z>5||![0,1].includes(choice)||!unlocked(z)||fieldReports(z)<2||Object.hasOwn(state.adventure.requests,z))return false;state.adventure.requests[z]=choice;state.coins+=220+z*40;state.prisms+=2;if(choice===0)state.tonics+=2;else state.hunt[z]=Math.min(24,(state.hunt[z]||0)+8);state.story.journal.push(Adv.REGIONS[z].request+': '+Adv.REGIONS[z].restored[choice]);save();render();toast('Regional request complete. Your decision will be remembered.');return true}
function fieldRequestPanel(z){const region=Adv.REGIONS[z],choice=state.adventure.requests[z],resolved=Object.hasOwn(state.adventure.requests,z),reports=fieldReports(z);return `<section class="panel mt12"><div class="kicker">Optional regional request</div><h3>${esc(region.request)}</h3><p class="subtext mt8">${esc(resolved?region.restored[choice]:region.requestText)}</p>${resolved?'<p class="subtext mt8">✓ Resolved · your Guardian preparation is improved.</p>':`<p class="subtext mt8">Hidden field reports: ${reports}/2. Find each route’s clue and complete its puzzle to discover the hidden record, then restore its relay.</p>${region.resolutions.map((label,i)=>`<button class="btn secondary block mt8" data-a="fieldrequest" data-v="${z}" data-choice="${i}" ${reports<2?'disabled':''}>${esc(label)}<small>${i===0?'2 tonics · stronger opening guard':'8 Aurora signs · extra opening energy'}</small></button>`).join('')}`}</section>`}
function adventureLaunchPanel(z){return `<div class="section-line"><h2>Restore the living routes</h2><span class="pill">${adventureCount(z)}/3 relays</span></div><p class="subtext">Restore all three relays to reconnect this region. Each has a direct encounter approach and an untimed puzzle approach. Hidden field reports and the regional request offer extra discoveries and preparation.</p>${Adv.REGIONS[z].missions.map((mission,r)=>{const run=state.adventure.runs[fieldKey(z,r)];return `<section class="panel mt12"><div class="row between gap6"><h3>${esc(mission.title)}</h3><span>${run?.completed?'✦':''}</span></div><p class="subtext mt8">${esc(mission.goal)}</p><button class="btn primary block mt12" data-a="fieldbegin" data-v="${fieldKey(z,r)}">${run?.completed?'Revisit restored route':run?'Resume field adventure':'Explore field adventure'}${run?' · '+run.cleared.length+'/12 locations':''}</button></section>`}).join('')}${fieldRequestPanel(z)}`}
function adventureMap(active){const {run,zone}=active,adjacent=Adv.neighbors(run.position);return `<div id="fieldMap" class="adventure-map" style="--field-ground:${ZONES[zone].ground};--field-hill:${ZONES[zone].hill}"><svg viewBox="0 0 100 100" aria-hidden="true"><path d="M0 80Q30 30 60 80T100 45V100H0Z" fill="${ZONES[zone].hill}"/><g transform="translate(0 8) scale(.3 .4)" opacity=".4">${mapScenery(zone)}</g>${Adv.EDGES.map(([a,b])=>{const [ax,ay]=Adv.POINTS[a],[bx,by]=Adv.POINTS[b];return `<path d="M${ax*20+10} ${ay*20+10}L${bx*20+10} ${by*20+10}" stroke="${run.visited.includes(a)&&run.visited.includes(b)?'#d6e7ac':'#74918b'}" stroke-width="1.1" stroke-dasharray="2 1"/>`}).join('')}</svg>${Adv.POINTS.map(([x,y],i)=>{const known=run.visited.includes(i)||adjacent.includes(i),room=active.mission.rooms[i],can=Adv.reachable(run,i);return `<button class="field-location ${run.position===i?'current':''} ${run.cleared.includes(i)?'cleared':''}" style="left:${x*20}%;top:${y*20}%" data-a="fieldmove" data-v="${i}" aria-label="${run.position===i?'Current location: ':can?'Travel to: ':''}${known?esc(room.name):'Uncharted location'}" ${can?'':'disabled'}><span>${run.position===i?'🐾':run.cleared.includes(i)?'✓':known?{brief:'⌂',crossroads:'↔',battle:'⚔',switch:'⚙',clue:'▤',choice:'☏',puzzle:'◇',gate:'▣',nest:'✧',captain:'⚔',secret:'✦',relay:'◉'}[room.kind]:'?'}</span></button>`}).join('')}</div>`}
function puzzleView(run){const p=run.puzzle,solved=Adv.puzzleSolved(p),hint=run.hint,button=(action,label,disabled=false)=>`<button class="btn secondary puzzle-key ${action===hint?'hinted':''}" data-a="fieldpuzzle" data-v="${action}" ${disabled||solved?'disabled':''}>${action===hint?'<small class="hint-label">Hint</small>':''}${label}</button>`;let html='';
 if(p.kind==='pipes')html=`<p class="subtext">Inlet: left of the top-left tile. Outlet: right of the bottom-right tile. Tap a tile to rotate it clockwise.</p><div class="puzzle-grid pipes">${p.cells.map((mask,i)=>button('rotate:'+i,`<svg viewBox="0 0 60 60" aria-hidden="true"><circle cx="30" cy="30" r="5" fill="#ffe4ae"/>${[[1,30,0],[2,60,30],[4,30,60],[8,0,30]].filter(([bit])=>mask&bit).map(([,x,y])=>`<path d="M30 30L${x} ${y}" stroke="#8ee5d5" stroke-width="10"/>`).join('')}</svg><small>Channel ${i+1} · ${[[1,"N"],[2,"E"],[4,"S"],[8,"W"]].filter(([bit])=>mask&bit).map(([,name])=>name).join("–")}</small>`)).join('')}</div>`;
 if(p.kind==='echo')html=`<p class="subtext">Read the inscription: <b>${p.sequence.map(i=>Adv.ECHO_NAMES[i]).join(' → ')}</b></p><p class="subtext mt8">Your phrase: ${p.notes.length?p.notes.map(i=>Adv.ECHO_NAMES[i]).join(' → '):'Ready to listen'}</p><div class="puzzle-grid echo">${Adv.ECHO_NAMES.map((name,i)=>button('note:'+i,name)).join('')}</div>`;
 if(p.kind==='tide'){const {a,b,target}=Adv.tideInfo(p.route);html=`<p class="subtext">Measure exactly <b>${target}</b> in either vessel. A holds ${a}; B holds ${b}.</p><div class="vessel-row"><div><span style="height:${p.vessels[0]/a*100}%"></span><strong>A · ${p.vessels[0]}/${a}</strong></div><div><span style="height:${p.vessels[1]/b*100}%"></span><strong>B · ${p.vessels[1]}/${b}</strong></div></div><div class="puzzle-grid echo">${[['fill-a','Fill A'],['fill-b','Fill B'],['empty-a','Empty A'],['empty-b','Empty B'],['pour-a','Pour A into B'],['pour-b','Pour B into A']].map(([action,label])=>button(action,label)).join('')}</div>`;}
 if(p.kind==='furnace')html=`<p class="subtext">Cool all nine panels. Each press changes that panel and its neighboring panels above, below, left and right.</p><div class="puzzle-grid furnace">${Array.from({length:9},(_,i)=>button('panel:'+i,`<span>${p.mask&(1<<i)?'🔥':'❄'}</span><small>Panel ${i+1} · ${p.mask&(1<<i)?'hot':'cool'}</small>`)).join('')}</div>`;
 if(p.kind==='wind'){const info=Adv.windInfo(p.route);html=`<p class="subtext">Reach the flag. Gust arrows move you after a step. A storm returns you safely to the start.</p><div class="wind-grid">${Array.from({length:25},(_,i)=>`<span class="${info.storms.includes(i)?'storm-cell':''}">${p.position===i?'🪁':i===info.goal?'⚑':info.storms.includes(i)?'⛈':info.gusts[i]>0?'↓':info.gusts[i]<0?'↑':'·'}</span>`).join('')}</div><div class="puzzle-grid echo">${[['north','↑ North'],['east','East →'],['west','← West'],['south','↓ South']].map(([action,label])=>button(action,label)).join('')}</div>`;}
 if(p.kind==='stars'){const actions=Adv.puzzleActions(p);html=`<p class="subtext">Arrange 1, 2, 3 across the top and 4, 5, blank below. Slide a neighboring tile into the empty space.</p><div class="puzzle-grid stars">${p.cells.map((n,i)=>button('tile:'+i,n?`✦ ${n}`:'Empty',!actions.includes('tile:'+i))).join('')}</div>`;}
 return `<section class="field-puzzle mt12">${html}<p class="subtext mt8">${solved?'✓ Mechanism solved. Open the lower gate below.':p.moves+' moves · no timer or penalty'}</p>${!solved?'<div class="row gap6 mt12"><button class="btn ghost grow" data-a="fieldpuzzle" data-v="hint">Show a hint</button><button class="btn ghost grow" data-a="fieldpuzzle" data-v="reset">Reset puzzle</button></div><p class="subtext mt8">You can return to the fork and use the direct encounter route instead.</p>':''}</section>`;
}
function adventureScreen(active){const {run,zone,route,region,mission}=active,room=mission.rooms[run.position],done=run.cleared.includes(run.position);let controls='';
 if(done)controls='<p class="field-status">✓ '+(room.kind==='relay'?'Relay restored. Revisit any open trail or return to the region.':'Location resolved. Choose an adjacent location on the map.')+'</p><button class="btn secondary block mt8" data-a="fieldmap">Show nearby paths</button>';
 else if(['battle','captain','nest'].includes(room.kind))controls=`<p class="subtext mt8">${room.kind==='nest'?'A single wild companion. Bonding is available.':room.kind==='captain'?'A three-companion team guards the relay.':'A two-companion patrol watches this approach.'} All your companions recover after the completed encounter.</p><button class="btn primary block mt12" data-a="fieldbattle">${room.kind==='nest'?'Approach the wild companion':'Begin team encounter'}</button>`;
 else if(room.kind==='puzzle')controls=puzzleView(run)+(Adv.puzzleSolved(run.puzzle)?'<button class="btn primary block mt12" data-a="fieldclear">Open the lower gate</button>':'');
 else if(room.kind==='choice')controls=`<div class="stack mt12"><button class="btn secondary" data-a="fieldclear" data-v="aid" ${state.tonics<1?'disabled':''}>Share a tonic (${state.tonics} owned)<small>Receive a Prism orb · stronger opening guard</small></button><button class="btn secondary" data-a="fieldclear" data-v="craft">Build the practical solution · free<small>Gain one opening energy in this route’s encounters</small></button></div>`;
 else controls=`<button class="btn primary block mt12" data-a="fieldclear">${{brief:'Accept the field task',crossroads:'Study the two approaches',switch:'Open the ridge mechanism',clue:'Record the clue',gate:'Open the inner trail',secret:'Record the hidden field report',relay:'Restore the relay'}[room.kind]}</button>`;
 return `<div class="row between gap6"><div><div class="kicker">${ZONES[zone].name} · route ${route+1}</div><h2>${esc(mission.title)}</h2></div><button class="btn secondary tiny" data-a="fieldleave">Region</button></div><p class="subtext mt8">${esc(mission.goal)}</p>${adventureMap(active)}<div class="field-legend">🐾 You · ✓ resolved · tap an adjacent marker to travel</div><div class="field-exits">${Adv.neighbors(run.position).filter(i=>Adv.reachable(run,i)).map(i=>`<button class="btn secondary tiny" data-a="fieldmove" data-v="${i}">Go: ${esc(mission.rooms[i].name)}</button>`).join('')}</div><section id="fieldRoom" class="panel mt12"><div class="row between gap6"><div class="kicker">${esc(room.kind)}</div><span class="pill">${run.cleared.length}/12 resolved</span></div><h3 class="mt8">${esc(room.name)}</h3><p class="story-copy">${esc(room.text)}</p>${controls}</section><div class="note-card mt12"><div><strong>${esc(region.mechanic)}</strong><p class="subtext mt8">${esc(region.effectText)}</p><p class="subtext mt8">${run.branch==='upper'?'Direct approach: one extra starting energy.':run.branch==='lower'?'Careful approach: shield the opening hit.':'Choose your first approach at the fork. You may explore both later.'}</p>${run.evidence?'<p class="subtext mt8">✦ Hidden field report recorded.</p>':''}</div></div><button class="btn ghost block mt12" data-a="fieldleave">Return to region · field progress is saved</button>`;
}
function adventureAction(a,v,btn){if(!a.startsWith('field'))return false;
 if(a==='fieldbegin')beginAdventure(v);
 else if(a==='fieldmove')moveAdventure(Number(v));
 else if(a==='fieldmap')document.getElementById('fieldMap')?.scrollIntoView?.({block:'start',behavior:state.settings.reduced?'instant':'smooth'});
 else if(a==='fieldclear')clearAdventureRoom(v);
 else if(a==='fieldbattle')startAdventureBattle();
 else if(a==='fieldpuzzle')adventurePuzzleAction(v);
 else if(a==='fieldleave'){if(!battle){state.adventure.active=null;save();render();window.scrollTo({top:0,behavior:'instant'})}}
 else if(a==='fieldrequest')resolveFieldRequest(Number(v),Number(btn.dataset.choice));
 return true;
}

function combatBonus(mine,kind,b){const passive=Core.PASSIVES[mine.sp],type=passive[2],value=passive[3];let bonus=1;const actions=b.acts[mine.uid]||0;if(type==='opener'&&actions===0)bonus+=value;if(type==='burst'&&kind==='burst')bonus+=value;if(type==='resolve'&&mine.hp<hpMax(mine)/2)bonus+=value;if(type==='afflict'&&b.weakenTurns>0)bonus+=value;if(type==='patient'&&b.prepared===mine.uid)bonus+=value;if(type==='entryhit'&&b.entry===mine.uid)bonus+=value;if(state.equipment[mine.uid]==='power')bonus+=.1;if(b.field||b.terrain){const effect=b.terrain||b.field.effect;if(effect==='patient'&&b.prepared===mine.uid)bonus+=.15;if(effect==='variety'&&b.lastKind&&b.lastKind!==kind)bonus+=.15;if(effect==='tide'&&b.turn%3===2&&kind==='burst')bonus+=.2;if(effect==='relay'&&b.entry===mine.uid&&b.lastAttackElement&&b.lastAttackElement!==SPEC[mine.sp].type)bonus+=.2;}return bonus;}
function observeFoe(foe){recordResearch(foe.sp,'seen');state.seen=[...new Set([...state.seen,foe.sp+':'+Number(foe.evo)])]}
function initializeBattle(b){b.region=state.zone;b.acts={};b.hits={};b.cooldowns={};b.intent=Core.intent(b,b.foe);b.entry=b.active;if(b.boss&&Object.hasOwn(state.adventure.requests,b.region)){if(state.adventure.requests[b.region]===0)b.guard=.5;else b.energy=3;}return b}

function handleClick(e){const btn=e.target.closest('[data-a]');if(!btn)return;const a=btn.dataset.a,v=btn.dataset.v;try{
if(resetInProgress)return;
if(state?.settings?.music&&state.sound&&!musicTimer)startMusic();
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
if(a==='release'){if(state.kin.length<=1||!state.kin.some(k=>k.uid===v))return;delete state.equipment[v];delete state.affection[v];state.teamPresets=state.teamPresets.map(p=>p.filter(id=>id!==v)).filter(p=>p.length);state.kin=state.kin.filter(k=>k.uid!==v);state.team=state.team.filter(id=>id!==v);if(state.team.length===0&&state.kin.length)state.team=[state.kin[0].uid];save();closeModal();render();toast('Companion released into the wild.');return}
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
if(a==='catchmenu'){if(!battle||battle.doing||battle.boss||battle.arena||battle.expedition||(battle.field&&!battle.field.nest))return;if(state.orbs+state.prisms===0){toast('Buy more Bond or Prism orbs at camp!');return}modal={type:'catchmenu'};showModal();return}
if(a==='chooseorb'){if(!battle?.doing)openCapture(v);return}
if(a==='cancelcapture'){capture=null;ROOT.inert=!!modal;document.getElementById('capture')?.remove();return}
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
 observedRevision=state?.revision||0;observedUpdatedAt=state?.updatedAt||0;
 if(state){
  state.kin=state.kin.filter(k=>k&&SPEC[k.sp]);
  state.team=state.team.filter(uid=>state.kin.some(k=>k.uid===uid)).slice(0,3);
  if(!state.team.length&&state.kin.length)state.team=[state.kin[0].uid];
  dailyCheck();if(!Array.isArray(state.battled))state.battled=[];
  if(!state.trailSpot)state.trailSpot={};if(!state.trailVisits)state.trailVisits={};
  if(!vault||state===local&&((local.updatedAt||0)>(vault.updatedAt||0)))save();
 }
 observedRevision=state?.revision||0;observedUpdatedAt=state?.updatedAt||0;expansionInit();if(state){healCollectionAfterBattle();save()}render();if(state)giftsFromURL();setTimeout(()=>checkForUpdates(false),3500);
}
document.addEventListener('click',handleClick);
document.addEventListener('change',handleChange);
document.addEventListener('keydown',event=>{const dialog=document.querySelector('#capture .capture-card')||document.querySelector('#modal .modal')||document.querySelector('.battle');if(!dialog)return;if(event.key==='Escape'){if(capture){capture=null;ROOT.inert=!!modal;document.getElementById('capture')?.remove()}else if(modal)closeModal();return}if(event.key==='Tab'){const buttons=Array.from(dialog.querySelectorAll('button:not(:disabled),input,select,textarea,a[href]'));if(!buttons.length)return;const first=buttons[0],last=buttons[buttons.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}}});
ROOT.innerHTML='<div class="intro-cover" style="text-align:center;padding-top:30vh"><h2>✦ WILDKIN</h2><p>Opening your creature vault…</p></div>';
const boot=startGame().catch(error=>{console.error('Wildkin startup',error);state=load();render()});if(!window.__WILDKIN_TEST__&&'serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost'))window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').then(reg=>{updateRegistration=reg}).catch(()=>{}));
let reloadForUpdate=false;navigator.serviceWorker?.addEventListener('controllerchange',()=>{if(!updateRequested||reloadForUpdate)return;reloadForUpdate=true;location.reload()});
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'){if(state)save();stopMusic()}else{if(storageConflict)render();checkForUpdates(false);if(state?.settings?.music)startMusic()}});
if(window.__WILDKIN_TEST__)window.WILDKIN_TEST_API={ready:boot,getState:()=>state,getBattle:()=>battle,getModal:()=>modal,handleClick,svgKin,Adv,adventureCount,beginAdventure,moveAdventure,clearAdventureRoom,startAdventureBattle,adventurePuzzleAction,resolveFieldRequest,currentAdventure,fieldReports,setState:value=>{state=value;expansionInit()},newState,makeKin,save,flush:()=>vaultWriteQueue,startGame,readVaultDb,writeVaultDb,resetJourneySafely,restoreBackup,exportBackup,startEncounter,searchWilds,actionAttack,foeAttack,finishBattle,claimGuardian,tryFlee,useTonic,switchKin,openCapture,sealCapture,gainXp,teamToggle,swapKin,completeStory,enterNode,guardianReady,featureAction,startTournament,beginExpedition,expeditionChoice,finishExpeditionStep,render,showModal,healCollectionAfterBattle,checkForUpdates,applyUpdate,decodeGift,giftCode,recordResearch,researchRank,endingText,chapterStoryReady,prepareFinalePhase,continueChapter,recordLesson,LESSONS,startMusic,stopMusic,musicBeat,MUSIC_SCORES,Core,World};
})();