(()=>{'use strict';
const KEY='wildkin-save-v1',VERSION=1,ROOT=document.getElementById('app');
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
const esc=x=>String(x??'').replace(/[&<>"']/g,s=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
const rand=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const pick=a=>a[Math.floor(Math.random()*a.length)];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const dstr=()=>{const d=new Date();return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`};
const ownId=()=>`${Date.now().toString(36)}${Math.random().toString(36).slice(2,9)}`;
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
function load(){try{const raw=localStorage.getItem(KEY);if(!raw)return null;const a=JSON.parse(raw);if(!a||a.version!==VERSION||!Array.isArray(a.kin)||!Array.isArray(a.team)||!Array.isArray(a.badges))return null;return a}catch{return null}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch{toast('Storage is full. Export a backup in Camp.')}}
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

function svgKin(k,size='normal'){
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
 return `<svg viewBox="0 0 200 200" role="img" aria-label="${esc(nameOf(k))}"><defs><radialGradient id="${id}" cx="35%" cy="18%" r="85%"><stop stop-color="${p}"/><stop offset="1" stop-color="${q}"/></radialGradient></defs><ellipse cx="102" cy="181" rx="51" ry="11" fill="#16313b" opacity=".35"/>${append}${ears[s.shape]||''}${wings}${body}${evolve}${spots}${kinDetail(k)}${Number.isInteger(k.guardianZone)?'<path d="M64 43 58 22 82 29 99 12 116 29 140 22 134 43Z" fill="#ffe38f" stroke="#9b6339" stroke-width="3"/><circle cx="99" cy="28" r="5" fill="#fff5c1"/>':''}${eyes}<circle cx="78" cy="102" r="3.5" fill="#fff"/><circle cx="125" cy="102" r="3.5" fill="#fff"/><path d="m93 127 7 5 7-5" stroke="#564c58" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><ellipse cx="62" cy="124" rx="8" ry="5" fill="#fc9f9e" opacity=".48"/><ellipse cx="137" cy="124" rx="8" ry="5" fill="#fc9f9e" opacity=".48"/>${aur?'<path d="m19 49 4-14 4 14 14 4-14 4-4 14-4-14-14-4Zm151 1 3-10 3 10 10 3-10 3-3 10-3-10-10-3Z" fill="#ffeeb6"/>':''}</svg>`;
}
function sceneStyle(zone){const z=ZONES[zone];return `--sky1:${z.sky1};--sky2:${z.sky2};--hill:${z.hill};--ground:${z.ground}`}
function nav(){return `<nav class="tabbar" aria-label="Game tabs">${[['explore','🧭','Explore'],['team','🐾','Team'],['dex','📖','KinDex'],['camp','🏕️','Camp']].map(([id,icon,text])=>`<button class="navitem ${state.screen===id?'active':''}" data-a="nav" data-v="${id}"><span class="nav-icon">${icon}</span>${text}</button>`).join('')}</nav>`}
function render(){if(!state){ROOT.innerHTML=intro();return}dailyCheck();const current=state.screen;ROOT.innerHTML=`<header class="topbar"><div class="logo">✦</div><div class="brand"><div class="eyebrow">The Living Wilds</div><h1>WILDKIN</h1></div><div class="currency">🪙 <b>${state.coins.toLocaleString()}</b></div><button class="iconbtn" data-a="sound" aria-label="Toggle sound">${state.sound?'🔊':'🔇'}</button></header><main class="content">${current==='team'?teamScreen():current==='dex'?dexScreen():current==='camp'?campScreen():exploreScreen()}</main>${nav()}`;if(modal)showModal();if(battle)renderBattle()}
function intro(){return `<div class="intro-cover"><div class="intro-title"><div class="eyebrow">An adventure that grows with you</div><h1>WILD<span style="color:var(--mint)">KIN</span></h1><p>Explore forgotten places. Befriend extraordinary creatures. Build a team that's yours alone.</p></div><div class="scene" style="${sceneStyle(0)};height:205px"><div class="scene-stars"></div><div class="scene-hill"></div><div class="scene-hill right"></div><div class="scene-kin" style="top:10px">${svgKin(makePreview(chosenStarter))}</div></div><div class="section-line"><h2>Choose your first companion</h2></div><div class="starter-grid">${[0,1,2].map(i=>`<button class="starter ${chosenStarter===i?'selected':''}" data-a="starter" data-v="${i}">${svgKin(makePreview(i))}<h3>${SPEC[i].name}</h3><small>${ELEMENTS[SPEC[i].type].icon} ${ELEMENTS[SPEC[i].type].name}</small></button>`).join('')}</div><div class="intro-feature"><span>✦</span><div>60 forms to discover, 6 regions, team battles, daily challenges and giftable creatures.</div></div><button class="btn primary block" data-a="begin">Begin my journey →</button><p class="footer-note center">Autosaves on this device. No account or purchases needed.</p></div>`}
function makePreview(sp){return{sp,level:5,evo:false,aurora:false}}
function exploreScreen(){const z=state.zone,area=ZONES[z],progress=state.wins[z]||0,bossReady=progress>=5+z*2,won=state.badges.includes(z),s=zoneSpecies(z),peek=makePreview(s[(state.totalSearches+z)%s.length].id),team=teamKin();return `<div class="row between mb8"><div><div class="kicker">Trail ${z+1} of 6</div><h2>Adventure map</h2></div><span class="pill">🏅 ${state.badges.length}/6 seals</span></div><div class="area-tabs">${ZONES.map((a,i)=>`<button class="area-tab ${z===i?'selected':''} ${!unlocked(i)?'locked':''}" data-a="zone" data-v="${i}">${unlocked(i)?a.icon:'🔒'} ${a.short}</button>`).join('')}</div><section class="scene" style="${sceneStyle(z)}"><div class="scene-stars"></div><div class="scene-hill"></div><div class="scene-hill right"></div><div class="scene-cloud">${area.icon}</div><div class="scene-title"><div class="kicker">${area.hint}</div><h2>${area.name}</h2></div><div class="scene-kin">${svgKin(peek)}</div><div class="scene-foot"><span class="pill">🦋 ${s.length*2} possible forms</span><span class="pill">${won?'🏅 Seal earned':'🔍 Trails unexplored'}</span></div></section><div class="world-cta"><div><div class="kicker">YOUR NEXT STEP</div><div class="subtext">${area.lore}</div></div><button class="btn primary" data-a="search">🔎 Search wilds</button></div><div class="panel mt16"><div class="row between mb8"><h3>${won?'Guardian conquered':'Guardian trail'}</h3><span class="pill">${Math.min(progress,5+z*2)}/${5+z*2} wins</span></div><div class="progress"><span style="width:${Math.min(100,progress/(5+z*2)*100)}%"></span></div><div class="row between mt12 gap6"><div class="grow"><div class="kicker">${area.guardian}</div><div class="subtext">${won?'Rematch this Guardian for extra rewards. Defeat it to befriend it if you have not already.':bossReady?'Defeat the Guardian, earn its seal, and invite it to your team for free.':'Win wild battles to unlock this area boss. Defeat it to capture it for free.'}</div></div><button class="btn ${bossReady||won?'amber':'secondary'} tiny" data-a="boss" ${!bossReady&&!won?'disabled':''}>${won?'Boss rematch':bossReady?'Fight boss':'Locked'}</button></div></div><div class="section-line"><h2>Companions</h2><button class="muted-link" data-a="nav" data-v="team">Manage team →</button></div><div class="row gap6">${team.map(k=>`<div class="mini-stat" style="background:#ffffff10;padding:7px 8px;border-radius:13px;min-width:0;flex:1">${svgSmall(k)}<div class="grow" style="min-width:0"><div style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11px">${esc(nameOf(k))}</div><small>Lv ${k.level} · ${k.hp}/${hpMax(k)}</small></div></div>`).join('')}</div><div class="note-card mt16"><div class="badge-bubble">🎁</div><div class="grow"><strong>Daily trail rewards</strong><div class="subtext">Complete 3 bite-size quests for more orbs and supplies.</div></div><button class="btn secondary tiny" data-a="nav" data-v="camp">View</button></div>`}
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
function kinCard(k){const s=SPEC[k.sp],on=state.team.includes(k.uid);return `<button class="kin-card" data-a="detail" data-v="${k.uid}"><div class="kin-picture" style="--tint:${s.secondary}">${svgKin(k)}</div>${on?`<span class="badge-slot">⭐ TEAM</span>`:k.favorite?`<span class="badge-slot">★ FAVORITE</span>`:''}<div class="kin-label"><h3>${esc(nameOf(k))}</h3>${k.aurora?'✨':''}${k.favorite?' ⭐':''}</div><div class="row between gap6 mt8">${typeLabel(s.type)}<small>Lv ${k.level}</small></div><div class="hp ${k.hp<hpMax(k)*.3?'low':''}"><div style="width:${k.hp/hpMax(k)*100}%"></div></div></button>`}
function dexScreen(){const caught=new Set(state.caught);const seen=new Set(state.seen);const n=SPEC.reduce((sum,s)=>sum+Number(caught.has(`${s.id}:0`))+Number(caught.has(`${s.id}:1`)),0);const sp=SPEC.filter(s=>dexZone==='all'||s.zone===Number(dexZone));return `<div class="kicker">The living record</div><h2>KinDex</h2><div class="panel mt12"><div class="row between"><div><strong>${n} / 60 forms recorded</strong><div class="subtext">Each Wildkin can evolve into a new form.</div></div><span class="pill">${Math.round(n/60*100)}%</span></div><div class="progress mt12"><span style="width:${n/60*100}%"></span></div></div><div class="section-line"><h2>Field guide</h2><select class="formbox" data-a="dexfilter" style="width:150px" aria-label="Filter region"><option value="all">All regions</option>${ZONES.map((z,i)=>`<option value="${i}" ${dexZone===String(i)?'selected':''}>${z.icon} ${z.short}</option>`).join('')}</select></div><div class="dex-grid">${sp.map(s=>[0,1].map(e=>{const id=`${s.id}:${e}`,known=caught.has(id),glimpsed=seen.has(id),k={sp:s.id,level:e?16:5,evo:!!e,aurora:false};return `<button class="dex-entry ${known?'':'unknown'}" data-a="dexdetail" data-v="${s.id}" data-e="${e}"><div class="dex-image">${known?svgKin(k):'<span style="font-size:46px;filter:grayscale(1)">❔</span>'}</div><span class="dex-name">${known?esc(e?s.evolved:s.name):glimpsed?'Seen, not caught':'???'}</span><small>#${String(s.id*2+e+1).padStart(3,'0')}</small></button>`}).join('')).join('')}</div>`}
function campScreen(){const q=dailyQuests(),restored=state.kin.every(k=>k.hp===hpMax(k));return `<div class="kicker">Rest, prepare, and share</div><h2>Home camp</h2><div class="panel mt12"><div class="row between"><div><div class="kicker">Trail rank</div><h3>Wanderer ${tier()}</h3><div class="subtext">${state.totalWins} victories · ${state.totalCatches} bonded</div></div><div class="badge-bubble">🏕️</div></div><div class="divider"></div><div class="row between gap6"><div class="grow"><strong>Campfire recovery</strong><div class="subtext">Restore your entire team at no cost.</div></div><button class="btn primary tiny" data-a="healall" ${restored?'disabled':''}>💚 Rest</button></div></div><div class="section-line"><h2>Today's trail quests</h2><span class="pill">Resets daily</span></div><div class="panel">${q.map(x=>{const p=state.daily.progress[x.id]||0,claimed=state.daily.claimed.includes(x.id),done=p>=x.need;return `<div class="quest"><span class="quest-icon">${x.icon}</span><div class="grow"><div class="quest-name">${x.title}</div><div class="subtext">${x.desc} · ${Math.min(x.need,p)}/${x.need}</div><div class="progress mt8"><span style="width:${Math.min(100,p/x.need*100)}%"></span></div></div><button class="btn tiny ${done&&!claimed?'amber':'secondary'}" data-a="claim" data-v="${x.id}" ${!done||claimed?'disabled':''}>${claimed?'✓':`🪙 ${x.reward}`}</button></div>`}).join('')}</div><div class="section-line"><h2>Trail supplies</h2><span class="pill">🪙 ${state.coins}</span></div><div class="panel">${[['orb','🟢','Bond orb',45,`You have ${state.orbs}`],['prism','🔮','Prism orb',155,`You have ${state.prisms}`],['tonic','🧪','Recovery tonic',75,`You have ${state.tonics}`]].map(([id,ic,n,p,sub])=>`<div class="camp-item"><div class="item-icon">${ic}</div><div class="grow"><strong>${n}</strong><div class="subtext">${sub}</div></div><button class="btn secondary tiny" data-a="buy" data-v="${id}" ${state.coins<p?'disabled':''}>🪙 ${p}</button></div>`).join('')}</div><div class="section-line"><h2>Family gifting</h2></div><div class="note-card"><div class="badge-bubble">🎁</div><div class="grow"><strong>Share a Wildkin</strong><div class="subtext">Send a creature as a QR/link gift. Your original stays with you.</div></div><button class="btn secondary tiny" data-a="trade">Open</button></div><div class="section-line"><h2>Your progress</h2></div><div class="panel"><div class="row gap6 wrap"><button class="btn secondary medium grow" data-a="backup">⬇️ Export backup</button><button class="btn secondary medium grow" data-a="restore">⬆️ Restore backup</button></div><div class="row gap6 wrap mt12"><button class="btn ghost medium grow" data-a="help">❔ How to play</button><button class="btn ghost medium grow" data-a="credits">✦ About game</button></div><div class="footer-note">Progress is stored in this browser on this device, not on a server. Export a backup occasionally and before clearing browser data or switching phones.</div></div>`}
function startEncounter(isBoss=false){if(!currentKin()){toast('Your team is exhausted. Rest at camp first.');return}const z=state.zone,available=zoneSpecies(z);let s;
if(isBoss){if(state.wins[z]<5+z*2&&!state.badges.includes(z)){toast('Win a few more battles before facing the guardian.');return}s=available[4]}
else{const p=Math.random(),rar=p<.6?0:p<.89?1:2;s=pick(available.filter(v=>v.rarity===rar))}
const highest=Math.max(...teamKin().map(k=>k.level)),level=isBoss?Math.max(8+z*5,highest+2):clamp(Math.max(3+z*5,highest+rand(-2,2)),1,60);
const foe=makeKin(s.id,level,Math.random()<.025&&!isBoss,isBoss);if(isBoss){foe.hp=Math.ceil(hpMax(foe)*1.3);foe.guardHp=foe.hp;foe.guardianZone=z;foe.nickname=ZONES[z].guardian}
state.seen=[...new Set([...state.seen,`${s.id}:${isBoss?1:0}`])];if(!Array.isArray(state.battled))state.battled=[];battle={foe,active:currentKin().uid,energy:2,guard:false,boss:isBoss,log:isBoss?`${ZONES[z].guardian} challenges your team!`:`A wild ${nameOf(foe)} appeared!`,turn:0,doing:false,phase:'ready',events:[],notice:null,fx:'',showMoves:false};modal=null;capture=null;save();render();sound(isBoss?180:600,.15,'triangle')}
function searchWilds(){if(!currentKin()){toast('Rest your team at camp first.');return}state.totalSearches++;activity('search');save();sound(530,.08);if(Math.random()<.12){const coins=rand(22,69);state.coins+=coins;if(Math.random()<.22){state.orbs++;toast(`Found ${coins} coins and a Bond orb!`)}else toast(`Found a hidden pouch with ${coins} coins!`);save();render()}else startEncounter(false)}
function gainXp(k,amount){let leveled=0,evolved=false;k.xp+=amount;while(k.level<60&&k.xp>=expNeed(k.level)){k.xp-=expNeed(k.level);const old=hpMax(k);k.level++;k.hp=clamp(k.hp+hpMax(k)-old+8,1,hpMax(k));leveled++}if(k.level>=60)k.xp=0;if(!k.evo&&k.level>=12){k.evo=true;k.hp=clamp(k.hp+22,1,hpMax(k));state.caught=[...new Set([...state.caught,`${k.sp}:1`])];state.seen=[...new Set([...state.seen,`${k.sp}:1`])];evolved=true}return{leveled,evolved}}
function typemult(at,dt){return ELEMENTS[at].beats===dt?1.4:ELEMENTS[dt].beats===at?.74:1}

// Battle presentation v1.2: turn phases are sequential, never simultaneous.
const pause=ms=>new Promise(resolve=>setTimeout(resolve,window.matchMedia?.('(prefers-reduced-motion: reduce)').matches?Math.min(130,ms):ms));
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
function endTurn(b){if(!battleAlive(b))return;b.doing=false;b.phase='ready';b.fx='';render()}
function battleMoveHelp(mine,foe){const a=SPEC[mine.sp].type,d=SPEC[foe.sp].type,known=knownFoe();return `<div class="move-guide"><div class="move-guide-title">Your battle moves <span>${typeLabel(a)}</span></div><div class="move-guide-row"><b>⚡ How energy works</b><span>Each fight starts at 2/4 energy. It does not recover automatically or between turns. Switching companions resets it to 2/4.</span></div><div class="move-guide-row"><b>⚔️ Strike (+1 energy)</b><span>Regular elemental damage. Charges 1 energy, up to 4. 13% critical chance.</span></div><div class="move-guide-row"><b>✨ Element burst (−2 energy)</b><span>Much stronger elemental attack. Requires and spends 2 energy. 17% critical chance.</span></div><div class="move-guide-row"><b>🛡️ Guard (+2 energy)</b><span>Heals 4 HP, charges 2 energy (up to 4), and blocks 64% of the next incoming hit.</span></div><div class="move-guide-row"><b>🟢 Bond</b><span>Try a timing-based capture. Lower enemy HP gives you better odds.</span></div><div class="move-guide-row matchup"><b>${known?'Matchup discovered':'Matchup not yet recorded'}</b><span>${known?`${typeLabel(a)} attacking ${typeLabel(d)}: ${affinityHint(a,d)}. Enemy attacking you: ${affinityHint(d,a)}.`:'Land an attack on this creature to reveal its strengths and weaknesses for future fights.'}</span></div></div>`}

async function foeAttack(){
 const b=battle;if(!b)return;
 const mine=state.kin.find(k=>k.uid===b.active),foe=b.foe;
 if(!mine||mine.hp<=0)return;
 b.doing=true;b.phase='foe';
 const special=Math.random()<.22,at=SPEC[foe.sp].type,dt=SPEC[mine.sp].type,base=special?16:10;
 const title=`${nameOf(foe)} uses ${special?'Wild Surge':'Quick Strike'}!`;
 announce(title,special?`A powerful ${ELEMENTS[at].name} attack is gathering.`:`An incoming ${ELEMENTS[at].name} attack.`, 'incoming',0,'foe','foe-windup');
 await pause(650);if(!battleAlive(b))return;
 const mult=typemult(at,dt),dmg=Math.max(3,Math.floor((base+power(foe)*.7-defense(mine)*.45)*mult*(b.guard?.36:1)*(rand(85,115)/100)));
 const guarded=b.guard;b.guard=false;mine.hp=Math.max(0,mine.hp-dmg);
 announce(title,effectLine(at,dt,dmg)+(guarded?' Your guard reduced the hit!':''),mult>1?'strong':mult<1?'weak':'neutral',dmg,'foe','ally-hit');
 sound(mult>1?130:180,.16,'sawtooth');save();
 await pause(1150);if(!battleAlive(b))return;
 if(mine.hp===0){
  const next=teamKin().find(k=>k.hp>0);
  if(next){b.active=next.uid;b.energy=2;announce(`${nameOf(mine)} fainted!`,`${nameOf(next)} steps in to continue the battle.`,'neutral',0,'player','enter');await pause(850);if(!battleAlive(b))return;}
  else{const lossXp=Math.max(8,Math.round((33+foe.level*6)*.3));const experience=grantPartyXp(teamKin(),lossXp);battle=null;modal={type:'result',win:false,title:'Back to camp',message:'Your team fought bravely! Everyone earns practice XP, including companions that fainted.',bonus:'Rest at camp before the next fight.',experience};save();render();return;}
 }
 endTurn(b);
}
async function actionAttack(kind){
 if(!battle||battle.doing)return;
 const mine=state.kin.find(k=>k.uid===battle.active),foe=battle.foe;
 if(!mine||mine.hp<=0)return;
 if(kind==='burst'&&battle.energy<2){toast('Not enough energy. Strike or Guard to charge.');return;}
 if(!beginTurn())return;
 const b=battle,at=SPEC[mine.sp].type,dt=SPEC[foe.sp].type;
 b.turn++;
 let dmg=0,crit=false;
 if(kind==='burst'){
  b.energy-=2;crit=Math.random()<.17;dmg=Math.max(3,Math.floor((21+power(mine)*1.15-defense(foe)*.5)*typemult(at,dt)*(crit?1.35:1)*(rand(90,110)/100)));state.totalBursts++;
 }else if(kind==='guard'){
  b.guard=true;b.energy=Math.min(4,b.energy+2);
 }else{
  b.energy=Math.min(4,b.energy+1);crit=Math.random()<.13;dmg=Math.max(3,Math.floor((12+power(mine)*.83-defense(foe)*.48)*typemult(at,dt)*(crit?1.5:1)*(rand(89,111)/100)));
 }
 const move=kind==='burst'?`${ELEMENTS[at].name} Burst`:kind==='guard'?'Guard':'Strike';
 announce(`${nameOf(mine)} uses ${move}!`,kind==='guard'?'Preparing a shield and gathering energy…':kind==='burst'?'Charging a powerful elemental attack…':'A quick elemental attack is on its way…','player',0,'player',kind==='guard'?'guard':'ally-windup');
 sound(kind==='burst'?390:kind==='guard'?710:270,.16,kind==='burst'?'sawtooth':'triangle');
 await pause(570);if(!battleAlive(b))return;
 if(kind==='guard'){
  const before=mine.hp;mine.hp=Math.min(hpMax(mine),mine.hp+4);
  announce(`${nameOf(mine)} is guarding!`,`+${mine.hp-before} HP · +2 energy · next incoming damage reduced by 64%.`,'guard',mine.hp-before,'player','guard');
 }else{
  foe.hp=Math.max(0,foe.hp-dmg);
  const mult=typemult(at,dt);learnFoe();
  announce(`${nameOf(mine)} used ${move}!`,effectLine(at,dt,dmg,crit),mult>1?'strong':mult<1?'weak':'neutral',dmg,'player','foe-hit');
 }
 save();sound(kind==='burst'?440:620,.18,'triangle');
 await pause(1150);if(!battleAlive(b))return;
 if(foe.hp===0){finishBattle(false);return;}
 await foeAttack();
}
function grantPartyXp(members,points){
 return members.map(k=>{const before=k.level,wasMax=before>=60,r=gainXp(k,points);return{name:nameOf(k),sp:k.sp,levelBefore:before,levelAfter:k.level,points,levelled:r.leveled,evolved:r.evolved,wasMax};});
}
function renderXpRows(rows){
 if(!rows?.length)return '';
 return `<section class="xp-report"><div class="row between gap6"><strong>⭐ Party experience</strong><span class="pill">All ${rows.length} companions</span></div><div class="subtext mt8">Every party member gets the full amount, even if fainted. Stored companions do not gain battle XP.</div>${rows.map(k=>`<div class="xp-entry"><span class="xp-avatar">${svgSmall({sp:k.sp,level:k.levelAfter,evo:k.levelAfter>=12,aurora:false})}</span><div class="grow"><strong>${esc(k.name)}</strong><div class="subtext">Lv ${k.levelBefore}${k.levelAfter!==k.levelBefore?' → '+k.levelAfter:''}${k.evolved?' · Evolved!':''}</div></div><strong class="xp-gain">${k.wasMax?'MAX':'+ '+k.points+' XP'}</strong></div>`).join('')}</section>`;
}
function finishBattle(caught){
 const b=battle;if(!b)return;
 const z=state.zone,foe=b.foe,isGuardian=!!b.boss,firstSeal=isGuardian&&!state.badges.includes(z);
 learnFoe();let payout=isGuardian?260+z*85:rand(20,38)+z*8,exp=isGuardian?130+z*40:33+foe.level*6;
 let levelText='';
 const rewardTeam=teamKin().slice();
 if(caught){
  
  payout=10+z*7;exp=20+foe.level*3;
  const k=makeKin(foe.sp,foe.level,foe.aurora,foe.evo);
  if(isGuardian){k.guardianZone=z;k.nickname=ZONES[z].guardian}
  state.kin.push(k);state.totalCatches++;activity('catch');
  state.caught=[...new Set([...state.caught,`${foe.sp}:${foe.evo?1:0}`])];
  if(state.team.length<3)state.team.push(k.uid);
 }else{state.totalWins++;state.wins[z]++;activity('win')}
 if(firstSeal){state.badges.push(z);state.prisms+=2}
 state.coins+=payout;
 const experience=grantPartyXp(rewardTeam,exp);
 
 const offerGuardian=isGuardian&&!caught&&!state.kin.some(k=>k.guardianZone===z);
 const title=caught?(isGuardian?'Guardian befriended!':'New companion!'):isGuardian?'Guardian defeated!':'Battle won!';
 let message=caught?`${nameOf(foe)} has joined your collection.`:`You outplayed ${nameOf(foe)}.`;
 if(firstSeal){message+=' You earned a region seal and opened the next trail!';if(z<5)state.zone=z+1}
 if(offerGuardian)message+=` ${ZONES[z].guardian} is ready to join you. No orb is needed!`;
 message+=levelText;
 battle=null;capture=null;
 modal={type:'result',win:true,title,message,bonus:`🪙 +${payout} coins${firstSeal?' · 🔮 +2 prism orbs':''}`,experience,foe,guardianOffer:offerGuardian?z:null};
 save();render();sound(850,.25,'sine');
}
function claimGuardian(){
 if(!modal||modal.type!=='result'||!Number.isInteger(modal.guardianOffer)||!state)return;
 const z=modal.guardianOffer;
 if(state.kin.some(k=>k.guardianZone===z)){toast('You have already befriended this Guardian.');return}
 
 const foe=modal.foe;if(!foe||!SPEC[foe.sp])return;
 const k=makeKin(foe.sp,foe.level,foe.aurora,true);
 k.guardianZone=z;k.nickname=ZONES[z].guardian;
 state.kin.push(k);state.totalCatches++;activity('catch');
 state.caught=[...new Set([...state.caught,`${foe.sp}:1`])];
 state.seen=[...new Set([...state.seen,`${foe.sp}:1`])];
 if(state.team.length<3)state.team.push(k.uid);
 modal={type:'result',win:true,title:'A legendary friendship!',foe:k,message:`${ZONES[z].guardian} is now yours! It has a unique golden crown and can join your battle team.`,bonus:`👑 ${ZONES[z].short} Guardian · Lv ${k.level}`,guardianOffer:null};
 save();render();sound(980,.3,'triangle');
}
async function tryFlee(){
 if(!battle||battle.doing)return;
 const b=battle;b.doing=true;
 announce('Retreating safely…',b.boss?'You leave the Guardian trial. You can challenge this boss again.':'Your team leaves the encounter. No penalty, no enemy attack.','player',0,'player','enter');
 await pause(550);if(!battleAlive(b))return;
 battle=null;capture=null;save();render();toast('Escaped safely!');
}
async function useTonic(){
 if(!battle||battle.doing||state.tonics<=0){if(!battle?.doing)toast('No Recovery tonics left.');return}
 const b=battle,mine=state.kin.find(k=>k.uid===b.active);if(mine.hp>=hpMax(mine)){toast('Your companion is already at full health.');return}
 b.doing=true;state.tonics--;const before=mine.hp;
 announce(`${nameOf(mine)} drinks a tonic!`,'A warm healing light gathers around your companion.','player',0,'player','guard');
 await pause(540);if(!battleAlive(b))return;
 mine.hp=Math.min(hpMax(mine),mine.hp+Math.max(36,Math.floor(hpMax(mine)*.5)));
 announce(`${nameOf(mine)} recovers!`,`+${mine.hp-before} HP restored. Your opponent acts next.`,'guard',mine.hp-before,'player','guard');save();sound(900,.16);
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
 <div class="energy-panel" role="status" aria-label="Battle energy: ${b.energy} out of 4. Strike adds 1, Guard adds 2, Burst costs 2."><div class="row between gap6"><strong>⚡ Energy ${b.energy} / 4</strong><small>Starts at 2 each battle</small></div><div class="energy-pips">${Array.from({length:4},(_,i)=>`<span class="energy-pip ${i<b.energy?'filled':''}"></span>`).join('')}</div><div class="energy-rules">Strike <b>+1</b> · Guard <b>+2</b> · Burst <b>−2</b><span>No automatic recharge</span></div></div>
 <div class="matchup-strip ${matchColor}"><span class="matchup-icon">${known?(mult>1?'↗':mult<1?'↘':'◆'):'?'}</span><span>${advice}</span><span class="matchup-value">${known?`${ELEMENTS[at].name} → ${ELEMENTS[dt].name}: ${affinityHint(at,dt)}`:'Attack once to discover this matchup'}</span></div>
 <div class="battle-announcer ${nEffect}" role="status" aria-live="polite"><div class="battle-act"><span class="phase-dot ${b.doing?'busy':''}"></span><strong>${esc(n?.title||b.log)}</strong></div><div class="battle-detail">${esc(n?.detail||(b.doing?'Action in progress…':'Choose your next move below.'))}</div>${effectiveness}</div>
 ${b.showMoves?battleMoveHelp(mine,foe):''}
 <div class="battle-actions"><button class="btn primary move-btn" data-a="attack" data-v="strike" ${b.doing?'disabled':''}><span>⚔️ Strike</span><small>+1 ⚡ → ${Math.min(4,b.energy+1)}/4</small></button><button class="btn amber move-btn" data-a="attack" data-v="burst" ${b.doing||b.energy<2?'disabled':''}><span>✨ Element burst</span><small>−2 ⚡ → ${Math.max(0,b.energy-2)}/4</small></button><button class="btn secondary move-btn" data-a="attack" data-v="guard" ${b.doing?'disabled':''}><span>🛡️ Guard</span><small>+2 ⚡ → ${Math.min(4,b.energy+2)}/4 · shield</small></button><button class="btn secondary move-btn" data-a="catchmenu" ${b.boss||b.doing?'disabled':''}><span>🟢 Bond</span><small>${b.boss?'Win to befriend boss for free':`${state.orbs+state.prisms} orbs · capture`}</small></button></div>
 <button class="btn secondary block battle-flee" data-a="flee" ${b.doing?'disabled':''}>🏃 Flee encounter <small>Always succeeds · no penalty</small></button><div class="battle-footer"><button class="btn ghost tiny" data-a="tonic" ${state.tonics<1||b.doing?'disabled':''}>🧪 Tonic (${state.tonics})</button><button class="btn ghost tiny info-toggle" data-a="moves" aria-expanded="${!!b.showMoves}">${b.showMoves?'✕ Hide moves':'ⓘ Move details'}</button><div class="battle-switch">${teamKin().map((k,i)=>`<button class="${k.uid===mine.uid?'active':''}" data-a="switch" data-v="${k.uid}" ${k.hp<=0||b.doing?'disabled':''} aria-label="Switch to ${esc(nameOf(k))}">${i+1} ${ELEMENTS[SPEC[k.sp].type].icon}</button>`).join('')}</div></div>
 ${hist.length?`<details class="battle-history"><summary>Previous actions (${b.events.length})</summary>${(b.events||[]).map(e=>`<div class="battle-history-line"><b>${esc(e.title)}</b><small>${esc(e.detail)}</small></div>`).join('')}</details>`:''}
 </div></div>`;
 ROOT.insertAdjacentHTML('beforeend',h);if(capture)renderCapture();
}
async function switchKin(uid){
 if(!battle||battle.doing||battle.active===uid)return;
 const k=state.kin.find(x=>x.uid===uid);if(!k||k.hp<=0)return;
 const b=battle;b.doing=true;b.active=uid;b.energy=2;
 announce(`Go, ${nameOf(k)}!`,'A fresh companion joins your side. The opponent gets a turn next.','player',0,'player','enter');
 await pause(900);if(!battleAlive(b))return;await foeAttack();
}
function renderCapture(){if(!capture||!battle)return;const c=capture;document.getElementById('capture')?.remove();document.body.insertAdjacentHTML('beforeend',`<div class="capture-center" id="capture"><div class="capture-card"><div class="kicker">Bonding ritual</div><h2>Find the perfect moment</h2><div class="subtext">Tap when the golden pointer crosses the glowing green arc.</div><div class="capture-circle"><div class="sweep"></div><div class="inner">${c.kind==='prism'?'🔮':'🟢'}</div></div><button class="btn primary block" data-a="seal">✦ SEAL THE BOND</button><button class="btn ghost tiny mt16" data-a="cancelcapture">Cancel</button><div class="subtext mt12">Weaken wild kin for a stronger bond. Prism orbs give an extra boost.</div></div></div>`)}
function openCapture(kind){if(!battle||battle.boss||battle.doing)return;if(kind==='orb'&&state.orbs<1||kind==='prism'&&state.prisms<1){toast('You are out of those orbs.');return}closeModal();capture={kind,start:performance.now()};render();renderCapture();sound(740,.12)}
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
function renderModal(content=''){if(!modal)return;document.getElementById('modal')?.remove();document.body.insertAdjacentHTML('beforeend',`<div class="modal-backdrop" id="modal"><div class="modal" role="dialog" aria-modal="true" aria-label="${esc(modal.title||modal.type)}">${content}</div></div>`)}
function showModal(){if(!modal)return;const m=modal;let title='',html='';
if(m.type==='detail'){const k=state.kin.find(x=>x.uid===m.uid);if(!k){modal=null;return}const s=SPEC[k.sp],on=state.team.includes(k.uid);title=nameOf(k);html=`<div class="portrait">${svgKin(k)}</div><div class="row between gap6"><div class="row gap6">${typeLabel(s.type)}<span class="pill ${k.aurora?'aurora':''}">${k.aurora?'✨ Aurora':rarities[s.rarity]}</span></div><span class="pill">Lv ${k.level}</span></div><div class="row between mt12"><div class="grow"><strong>${esc(s.name)} ${k.evo?'→ '+esc(s.evolved):''}</strong><div class="subtext">${ZONES[s.zone].name}</div></div><small>XP ${k.xp}/${expNeed(k.level)}</small></div><div class="xpbar"><span style="width:${k.xp/expNeed(k.level)*100}%"></span></div>${[['HP',k.hp,hpMax(k)],['Power',power(k),150],['Defense',defense(k),100]].map(([name,val,max])=>`<div class="statline"><b>${name}</b><div class="progress"><span style="width:${Math.min(100,val/max*100)}%"></span></div><small>${val}</small></div>`).join('')}<div class="row gap6 mt16 wrap"><button class="btn ${on?'secondary':'primary'} grow medium" data-a="teamtoggle" data-v="${k.uid}">${on?'★ Remove from team':'＋ Add to team'}</button><button class="btn secondary medium grow" data-a="giftone" data-v="${k.uid}">🎁 Gift</button></div><div class="row gap6 mt12 wrap"><button class="btn ghost medium grow" data-a="rename" data-v="${k.uid}">✎ Nickname</button><button class="btn danger medium grow" data-a="releaseask" data-v="${k.uid}" ${state.kin.length<=1?'disabled':''}>Release</button></div><button class="btn ghost medium block mt12" data-a="favorite" data-v="${k.uid}">${k.favorite?'⭐ Remove favorite':'☆ Mark as favorite'}</button>${!k.evo?'<div class="footer-note">Evolves naturally at level 12.</div>':''}`}
else if(m.type==='swap'){title='Swap your battle party';const incoming=state.kin.find(k=>k.uid===m.uid);if(!incoming){modal=null;return}html=`<p class="subtext mb8">Your party has three companions. Choose one to send to the Sanctuary so ${esc(nameOf(incoming))} can join.</p>${teamKin().map(k=>`<button class="swap-choice" data-a="confirmswap" data-v="${k.uid}">${svgSmall(k)}<span><strong>${esc(nameOf(k))}</strong><small> Lv ${k.level} · To Sanctuary</small></span><span>Swap →</span></button>`).join('')}`;}
else if(m.type==='result'){title=m.title;html=`<div class="confetti">${m.win?'🏆 ✨ 🎉':'🏕️ 💚'}</div>${m.foe?`<div class="portrait">${svgKin(m.foe)}</div>`:''}<p class="subtext center" style="font-size:15px;margin-bottom:13px">${esc(m.message)}</p>${renderXpRows(m.experience)}${Number.isInteger(m.guardianOffer)?`<button class="btn amber block mt12 guardian-claim" data-a="claimguardian">👑 Befriend ${esc(ZONES[m.guardianOffer].guardian)} · FREE</button><div class="subtext center mt8">Guaranteed capture after winning · no Bond orb required</div>`:'' }<div class="panel center"><strong style="color:var(--gold)">${esc(m.bonus||'Your companions are waiting at camp.')}</strong></div><button class="btn primary block mt16" data-a="close">Continue journey</button>`}
else if(m.type==='catchmenu'){title='Choose a bonding orb';const f=battle?.foe;html=`<p class="subtext mb8">A weakened creature is easier to befriend. Match the moving marker for a bonus!</p><div class="panel">${[['orb','🟢','Bond orb',state.orbs,'Standard bonding chance'],['prism','🔮','Prism orb',state.prisms,'Higher chance of a successful bond']].map(([kind,ic,n,count,sub])=>`<div class="camp-item"><span class="item-icon">${ic}</span><div class="grow"><strong>${n}</strong><div class="subtext">${sub} · ${count} left</div></div><button class="btn primary tiny" data-a="chooseorb" data-v="${kind}" ${count===0?'disabled':''}>Choose</button></div>`).join('')}</div><div class="subtext mt12">Target HP: ${f?.hp||0}/${f?.guardHp||hpMax(f)}</div>`}
else if(m.type==='trade'){title='Gift a companion';html=`<div class="subtext mb8">Choose a Wildkin, then share a QR code or link. Your friend opens it on their phone and accepts the gift.</div><div class="panel"><label class="kicker" for="tradechoose">Creature to gift</label><select class="formbox mt8" id="tradechoose">${state.kin.map(k=>`<option value="${k.uid}" ${m.uid===k.uid?'selected':''}>${esc(nameOf(k))} · Lv ${k.level}${k.aurora?' ✨':''}</option>`).join('')}</select><button class="btn primary block mt12" data-a="giftselected">Create gift link / QR</button></div><div class="divider"></div><label class="kicker" for="giftinput">Have a gift code?</label><textarea id="giftinput" class="formbox mt8" rows="3" placeholder="Paste a Wildkin gift link or W1... code"></textarea><button class="btn secondary block mt12" data-a="importgift">Accept a gift</button><div class="footer-note">Gifts copy one creature. They are not secure two-way trades: the sender keeps their original, and links can be reused. Do not share with strangers.</div>`}
else if(m.type==='gift'){title='Your Wildkin gift';html=`<div class="center"><div class="kicker">Scan with a phone camera</div><div id="giftqr" class="trade-qr"><small style="color:#123">Generating QR...</small></div><div class="subtext">Or send this link directly:</div></div><div class="trade-code mt12">${esc(m.url)}</div><div class="row gap6 mt12"><button class="btn primary grow medium" data-a="copygift">📋 Copy link</button><button class="btn secondary grow medium" data-a="sharegift">↗ Share</button></div><div class="footer-note">The creature is a copy. Your original stays with you. The receiver must open this link in the game.</div>`}
else if(m.type==='incoming'){title='A gift found!';const k=m.kin;html=`<div class="portrait">${svgKin(k)}</div><div class="center"><h2>${esc(nameOf(k))}</h2><div class="subtext mt8">Level ${k.level} · ${ELEMENTS[SPEC[k.sp].type].name} ${k.aurora?'· Aurora ✨':''}</div></div><button class="btn primary block mt16" data-a="acceptgift">💚 Welcome to my collection</button><button class="btn secondary block mt12" data-a="closegift">Not now</button>`}
else if(m.type==='confirmrelease'){const k=state.kin.find(x=>x.uid===m.uid);title='Release companion?';html=`<p class="subtext">Let ${esc(nameOf(k))} return to the wild? This cannot be undone, but its KinDex record will remain.</p><button class="btn danger block mt16" data-a="release" data-v="${k.uid}">Yes, release ${esc(nameOf(k))}</button>`}
else if(m.type==='rename'){title='Give a nickname';html=`<label for="nickname" class="kicker">Companion name</label><input class="formbox mt8" id="nickname" maxlength="18" placeholder="Nickname (up to 18 characters)" value="${esc(state.kin.find(k=>k.uid===m.uid)?.nickname||'')}"><button class="btn primary block mt12" data-a="saverename" data-v="${m.uid}">Save nickname</button>`}
else if(m.type==='help'){title='How to play';html=`<div class="panel"><h3>1. Explore and capture</h3><p class="subtext mt8">Tap Search wilds to discover creatures. Battle to reduce their HP, then use a Bond orb and tap at the right time to seal the bond.</p><div class="divider"></div><h3>2. Build your team</h3><p class="subtext mt8">Choose up to 3 companions. Energy starts at 2/4 at the beginning of each battle and does not recharge by itself. Strike gives +1, Guard gives +2 (up to 4), and Element burst spends 2. Switching resets energy to 2. Flee always works, even against a Guardian, with no penalty. Strike builds energy, Element burst spends it for bigger damage, and Guard heals a little and greatly reduces the next hit. Each species has an elemental advantage or weakness. Attack once to discover its matchup, then use Move details in battle to plan ahead. Swap teammates at any time, but your opponent gets a turn.</p><div class="divider"></div><h3>3. Grow and explore</h3><p class="subtext mt8">All companions on your three-creature battle party gain full XP after winning, capturing, or losing a battle, including fainted companions. Sanctuary creatures do not receive battle XP. Fleeing gives no XP. Companions evolve at level 12. After enough wins in each region, face its Guardian to unlock the next trail. Defeat a Guardian boss to recruit it for free as a special crowned creature. You can also retreat and retry later.</p><div class="divider"></div><h3>4. Play long-term</h3><p class="subtext mt8">Complete daily quests, seek rare Aurora creatures, discover all 60 forms, collect seals and challenge stronger guardians again.</p></div>`}
else if(m.type==='credits'){title='About Wildkin';html=`<div class="panel"><h3>The Living Wilds · v1.2</h3><p class="subtext mt12">An original, single-player, family-friendly creature collecting game. It features 30 species families, 60 forms, six regions, battles, guardians, daily quests, gifting and offline-capable local saves.</p><div class="divider"></div><p class="subtext">No account, ads, in-app purchases, multiplayer server, or tracking. Creatures and gameplay are original. Creature gifting is not a secure transfer system.</p></div>`}
else if(m.type==='dexdetail'){const s=SPEC[m.sp],k=makePreview(s.id);k.evo=!!m.evo;title=state.caught.includes(`${m.sp}:${m.evo}`)?(m.evo?s.evolved:s.name):'Undiscovered form';html=`<div class="portrait">${state.caught.includes(`${m.sp}:${m.evo}`)?svgKin(k):'<div style="font-size:95px">❔</div>'}</div><div class="center">${typeLabel(s.type)}<p class="subtext mt12">Habitat: ${ZONES[s.zone].name}. ${rarities[s.rarity]} species.</p>${m.evo?'<p class="subtext mt8">An evolved form of this creature family.</p>':''}</div>`}
renderModal(`<div class="modal-head"><h2>${esc(title)}</h2><button class="iconbtn close" data-a="close" aria-label="Close dialog">×</button></div>${html}`);if(m.type==='gift')drawQr(m.url)}
function drawQr(url){const el=document.getElementById('giftqr');if(!el)return;if(window.QRCode){try{el.textContent='';new QRCode(el,{text:url,width:170,height:170,colorDark:'#132b36',colorLight:'#ffffff',correctLevel:QRCode.CorrectLevel.L})}catch{el.innerHTML='<small style="color:#123">QR unavailable. Use Copy link below.</small>'}}else{el.innerHTML='<small style="color:#123">QR requires an internet connection.<br>Copy the link instead.</small>'}}
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
function exportBackup(){const blob=new Blob([JSON.stringify({game:'WILDKIN',saved:new Date().toISOString(),data:state},null,2)],{type:'application/json'});const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=`wildkin-backup-${new Date().toISOString().slice(0,10)}.json`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),4000);toast('Save backup created. Keep it somewhere safe.');}
function restoreBackup(){const f=document.createElement('input');f.type='file';f.accept='application/json,.json';f.onchange=async()=>{const file=f.files?.[0];if(!file)return;try{if(file.size>25000000)throw Error();const raw=JSON.parse(await file.text()),a=raw.data;if(raw.game!=='WILDKIN'||a.version!==1||!Array.isArray(a.kin)||!a.kin.length||!Array.isArray(a.team)||!Array.isArray(a.badges)||!Array.isArray(a.wins))throw Error();for(const k of a.kin){if(!Number.isInteger(k.sp)||k.sp<0||k.sp>=30||!Number.isInteger(k.level)||k.level<1||k.level>60||typeof k.uid!=='string'||k.uid.length>70)throw Error()}if(!confirm('Replace this device’s current Wildkin progress with the backup?'))return;localStorage.setItem(KEY,JSON.stringify(a));state=load();if(!Array.isArray(state.battled))state.battled=[];battle=null;modal=null;capture=null;render();toast('Backup restored!')}catch{toast('That is not a valid Wildkin backup.')}};f.click()}
function handleClick(e){const btn=e.target.closest('[data-a]');if(!btn)return;const a=btn.dataset.a,v=btn.dataset.v;try{
if(a==='starter'){chosenStarter=Number(v);render();return}
if(a==='begin'){state=newState(chosenStarter);save();sound(650,.18);render();giftsFromURL();return}
if(a==='nav'){state.screen=v;save();closeModal();render();window.scrollTo({top:0,behavior:'instant'});return}
if(a==='sound'){state.sound=!state.sound;save();render();return}
if(a==='zone'){if(!unlocked(Number(v))){toast('Defeat the previous region’s guardian to unlock this trail.');return}state.zone=Number(v);save();render();return}
if(a==='search'){searchWilds();return}
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
if(a==='release'){state.kin=state.kin.filter(k=>k.uid!==v);state.team=state.team.filter(id=>id!==v);if(state.team.length===0&&state.kin.length)state.team=[state.kin[0].uid];save();closeModal();render();toast('Companion released into the wild.');return}
if(a==='buy'){buy(v);return}
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
if(a==='help'||a==='credits'){modal={type:a};showModal();return}
if(a==='close'){closeModal();return}
if(a==='moves'){if(battle){battle.showMoves=!battle.showMoves;render()}return}
if(a==='attack'){actionAttack(v);return}
if(a==='flee'){tryFlee();return}
 if(a==='claimguardian'){claimGuardian();return}
if(a==='tonic'){useTonic();return}
if(a==='switch'){switchKin(v);return}
if(a==='catchmenu'){if(!battle||battle.doing||battle.boss)return;if(state.orbs+state.prisms===0){toast('Buy more Bond or Prism orbs at camp!');return}modal={type:'catchmenu'};showModal();return}
if(a==='chooseorb'){if(!battle?.doing)openCapture(v);return}
if(a==='cancelcapture'){capture=null;document.getElementById('capture')?.remove();return}
if(a==='seal'){sealCapture();return}
}catch(ex){console.error('Wildkin action error',ex);toast('Something went wrong. Your progress is safe.')}}
function manualCopy(txt){const area=document.createElement('textarea');area.value=txt;area.style.position='fixed';area.style.opacity='0';document.body.appendChild(area);area.select();try{document.execCommand('copy');toast('Gift link copied!')}catch{toast('Select the gift link above to copy it.')}area.remove()}
function handleChange(e){const a=e.target?.dataset?.a;if(a==='filter'){kinFilter=e.target.value;vaultPage=0;render()}if(a==='vaultsort'){vaultSort=e.target.value;vaultPage=0;render()}if(a==='dexfilter'){dexZone=e.target.value;render()}}
state=load();if(state){state.kin=state.kin.filter(k=>k&&SPEC[k.sp]);state.team=state.team.filter(uid=>state.kin.some(k=>k.uid===uid)).slice(0,3);if(!state.team.length&&state.kin.length)state.team=[state.kin[0].uid];dailyCheck();if(!Array.isArray(state.battled))state.battled=[]}document.addEventListener('click',handleClick);document.addEventListener('change',handleChange);render();if(state)giftsFromURL();if('serviceWorker' in navigator&&location.protocol==='https:')window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
window.WILDKIN_DEBUG={getState:()=>state,getBattle:()=>battle,zoneSpecies,makeKin,decodeGift,giftCode};
})();