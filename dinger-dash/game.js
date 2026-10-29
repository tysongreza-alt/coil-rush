(function dingerDash(){
"use strict";
const $=id=>document.getElementById(id);
const canvas=$("field"),ctx=canvas.getContext("2d"),overlay=$("overlay"),banner=$("banner");
const W=390,H=520,KEY="dinger-dash-v1";
const initial={high:0,coins:0,homers:0,perfects:0,bat:0,eye:0,games:0,sound:true,daily:null,rival:0,careerWins:0,fielding:0,pitching:0,season:null};
let saved;
try{saved={...initial,...JSON.parse(localStorage.getItem(KEY)||"{}")}}catch(e){saved={...initial}}
const dateKey=()=>{const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,"0"),String(d.getDate()).padStart(2,"0")].join("-")};
const missions=[{label:"Hit 3 home runs",type:"hr",goal:3},{label:"Hit 5 doubles or better",type:"xbh",goal:5},{label:"Make 5 perfect swings",type:"perfect",goal:5},{label:"Get 12 hits",type:"hits",goal:12}];
function todayMission(){let key=dateKey(),n=key.split("").reduce((a,c)=>a+c.charCodeAt(0),0)%missions.length;if(!saved.daily||saved.daily.date!==key)saved.daily={date:key,index:n,progress:0,claimed:false};return missions[saved.daily.index]}
todayMission();
const game={mode:"home",phase:"idle",score:0,outs:0,strikes:0,streak:0,bestStreak:0,balls:0,homers:0,perfects:0,hits:0,rank:1,pitchCount:0, target:1,pitch:null,flight:null,swingAt:-1,restUntil:0,finishAt:0,last:0,particles:[],t:0,playMode:"arcade",rivalIndex:0,limit:0,swingStyle:"contact",pitchGrade:0,lastKind:"",lastTarget:1};
const rivalNames=["ROOKIE RASCALS","SPEED DEMONS","CURVE KINGS","FIREBALL FOXES","DIAMOND DRAGONS","ALL-STAR ACES","THE LEGENDS"];
function rivalAt(index){
 const n=Math.max(0,index);
 return {name:n<rivalNames.length?rivalNames[n]:"LEGEND LEAGUE "+(n-5),
 score:[250,430,680,890,1160,1420,1760][n] || (1760+(n-6)*260),
 homers:Math.min(5,1+Math.floor(n/2)),
 limit:Math.min(15,10+Math.floor(n/1.4)),reward:100+n*30};
}
function live(){return game.mode==="play"||game.mode==="practice"||game.mode==="challenge"||game.mode==="season"}
let ac=null; const reduced=typeof matchMedia!=="undefined"&&matchMedia("(prefers-reduced-motion: reduce)").matches;
function store(){try{localStorage.setItem(KEY,JSON.stringify(saved))}catch(e){}}
function sound(freq=440,duration=.1,type="sine",volume=.09){
if(!saved.sound)return;
try{ac=ac||new (window.AudioContext||window.webkitAudioContext)();if(ac.state==="suspended")ac.resume();const o=ac.createOscillator(),g=ac.createGain();o.type=type;o.frequency.setValueAtTime(freq,ac.currentTime);o.frequency.exponentialRampToValueAtTime(Math.max(80,freq*.65),ac.currentTime+duration);g.gain.setValueAtTime(volume,ac.currentTime);g.gain.exponentialRampToValueAtTime(.001,ac.currentTime+duration);o.connect(g);g.connect(ac.destination);o.start();o.stop(ac.currentTime+duration+.01)}catch(e){}
}
function melody(){sound(530,.12,"triangle");setTimeout(()=>sound(720,.16,"triangle"),110);setTimeout(()=>sound(930,.27,"triangle"),230)}
function vibrate(ms){if(navigator.vibrate)navigator.vibrate(ms)}
function resize(){let d=Math.min(window.devicePixelRatio||1,2),r=canvas.getBoundingClientRect();canvas.width=Math.round(r.width*d);canvas.height=Math.round(r.height*d);ctx.setTransform(canvas.width/W,0,0,canvas.height/H,0,0)}
function updateHud(){
 $("score").textContent=game.score.toLocaleString();
 $("outVal").textContent=game.outs+"/3";
 $("strikes").textContent=game.strikes+"/3";
 $("balls").textContent=game.balls+"/4";
 $("coins").textContent=saved.coins.toLocaleString();
 $("streak").textContent=game.streak>=2?("x"+Math.min(3,1+Math.floor(game.streak/4))+" | "+game.streak+" HIT STREAK"):"BUILD A HIT STREAK";
 $("firefill").style.width=Math.min(100,(game.streak%5)*20)+"%";
 $("sound").textContent=saved.sound?"🔊":"🔇";
 $("pause").style.display=live()?"":"none";
 const isSeason=game.mode==="season",cpuSide=isSeason&&game.match&&game.match.offense==="cpu";
 $("pitchControls").style.display=cpuSide?"flex":"none";
 $("batStyleControls").style.display=cpuSide?"none":"flex";
 $("seasonScoreboard").style.display=isSeason?"flex":"none";
 if(isSeason){
  const m=game.match;
  $("seasonRuns").textContent="YOU "+m.scores[0]+" · "+seasonTeams[m.index][0].split(" ").slice(-1)[0].toUpperCase()+" "+m.scores[1];
  $("seasonInning").textContent=(m.offense==="cpu"?"▲":"▼")+" "+m.inning+" · "+game.outs+" OUT";
  $("seasonBases").textContent=(m.bases[1]?"◆":"◇")+(m.bases[2]?"◆":"◇")+(m.bases[0]?"◆":"◇");
  $("pitchHelp").textContent="SCOUT: "+seasonTeams[m.index][0]+" struggles with "+seasonTeams[m.index][2].toLowerCase()+"s. Aim green!";
  for(const b of document.querySelectorAll("[data-pitch]"))b.classList.toggle("selected",b.dataset.pitch===m.pitchKind);
  for(const b of document.querySelectorAll("[data-zone]"))b.classList.toggle("selected",b.dataset.zone===m.pitchZone);
 }
 $("swing").style.display=live()?"":"none";
 $("contact").parentElement.parentElement.style.display=live()?"":"none";
 $("contact").classList.toggle("active",game.swingStyle==="contact");
 $("power").classList.toggle("active",game.swingStyle==="power");
 $("contact").setAttribute("aria-pressed",String(game.swingStyle==="contact"));
 $("power").setAttribute("aria-pressed",String(game.swingStyle==="power"));
 $("swing").textContent=cpuSide?"⚾ THROW PITCH!":game.swingStyle==="power"?"💥 POWER SWING!":"⚾ SWING!";
 $("swing").disabled=!live()||(cpuSide?game.phase!=="seasonPitch":game.phase!=="pitch");
 if(isSeason){
   $("modeinfo").textContent=(cpuSide?"YOU PITCH":"YOU BAT")+" · INNING "+game.match.inning;
   $("pitchinfo").textContent=cpuSide?"PITCH "+game.match.pitchKind+" · "+game.match.pitchZone.toUpperCase():game.pitch?game.pitch.kind+" · "+game.pitch.mph+" MPH":"UP TO BAT";
 }else if(game.mode==="challenge"){
   const rv=rivalAt(game.rivalIndex);
   $("modeinfo").textContent="RIVAL "+(game.rivalIndex+1)+" · PITCH "+Math.min(game.pitchCount,rv.limit)+"/"+rv.limit;
   $("pitchinfo").textContent=game.pitch?game.pitch.kind+" "+game.pitch.mph+" MPH":"NEED "+rv.score+" PTS · "+rv.homers+" HR";
 }else{
   $("modeinfo").textContent=game.mode==="practice"?"PRACTICE · NO OUT LIMIT":game.mode==="play"?"ARCADE · PITCH "+game.pitchCount:"ONE-TAP HOME RUN DERBY";
   $("pitchinfo").textContent=game.pitch?game.pitch.kind+" · "+game.pitch.mph+" MPH":"READ THE PITCH";
 }
 const mission=todayMission();
 $("mission").textContent=saved.daily.claimed?"✓ DAILY BONUS COMPLETE":mission.label+" · "+Math.min(mission.goal,saved.daily.progress)+"/"+mission.goal;
}
function notify(txt,kind="normal"){banner.textContent=txt;banner.className="banner visible "+kind;clearTimeout(notify.timer);notify.timer=setTimeout(()=>banner.classList.remove("visible"),1450)}
function missionStep(type){
if(game.mode==="practice"||saved.daily.claimed)return;
const m=todayMission();if(m.type!==type)return;saved.daily.progress=Math.min(m.goal,saved.daily.progress+1);
if(saved.daily.progress>=m.goal){saved.daily.claimed=true;saved.coins+=65;setTimeout(()=>notify("DAILY MISSION +65 COINS!","gold"),1100);melody()}store();
}
function coinPrice(type){return 65+(saved[type]||0)*55}
function shopHtml(){return '<div class="shop-heading">TRAIN YOUR SLUGGER</div><div class="shop-row"><div class="up-icon">💪</div><div class="up-copy"><strong>POWER BAT <span>'+saved.bat+'/5</span></strong><small>Hit the ball farther</small></div><button class="small-btn" data-action="bat" '+(saved.bat>=5||saved.coins<coinPrice("bat")?"disabled":"")+'>'+(saved.bat>=5?"MAX":coinPrice("bat")+" 🪙")+'</button></div><div class="shop-row"><div class="up-icon">👀</div><div class="up-copy"><strong>EAGLE EYES <span>'+saved.eye+'/5</span></strong><small>More forgiving swing timing</small></div><button class="small-btn" data-action="eye" '+(saved.eye>=5||saved.coins<coinPrice("eye")?"disabled":"")+'>'+(saved.eye>=5?"MAX":coinPrice("eye")+" 🪙")+'</button></div><div class="shop-foot">Earn coins by hitting. Upgrades stay saved on this device.</div>'+seasonShop()}

const seasonTeams=[
 ["Harbor Sharks",1,"FASTBALL"],["Maple Bears",1,"CURVEBALL"],["Thunder Bolts",2,"CHANGEUP"],["Canyon Coyotes",2,"FASTBALL"],
 ["Rocket Runners",2,"CURVEBALL"],["Storm Chasers",3,"CHANGEUP"],["River Otters",2,"FASTBALL"],["Comet Crushers",3,"CURVEBALL"],
 ["Fireball Foxes",3,"CHANGEUP"],["Diamond Dragons",4,"FASTBALL"],["Moonlight Wolves",3,"CURVEBALL"],["Blazing Bisons",4,"CHANGEUP"],
 ["Lightning Lynx",4,"FASTBALL"],["Iron Eagles",5,"CURVEBALL"],["Meteor Monsters",5,"CHANGEUP"],["All-Star Aces",5,"FASTBALL"]
];
function seasonData(){
 if(!saved.season||!Array.isArray(saved.season.results))saved.season={results:[],wins:0,losses:0,active:null,championships:0};
 saved.season.wins=saved.season.results.filter(x=>x.won).length;
 saved.season.losses=saved.season.results.length-saved.season.wins;
 return saved.season;
}
function seasonOpponent(){return seasonTeams[Math.min(15,seasonData().results.length)]}
function fieldPrice(type){return 75+(saved[type]||0)*65}
function seasonTiles(){
 const sd=seasonData();
 return '<div class="season-results">'+seasonTeams.map((t,i)=>{
 const result=sd.results[i],kind=result?(result.won?"won":"lost"):(i===sd.results.length?"next":"");
 return '<div class="result-tile '+kind+'" title="'+t[0]+'">'+(result?(result.won?"W":"L"):(i+1))+'</div>'
 }).join("")+'</div>'
}
function seasonShop(){
 let html='<div class="shop-heading">BUILD YOUR BALLCLUB</div>';
 for(const [type,name,description,emoji] of [["pitching","PITCHING","More accurate throws, fewer hard hits","⚾"],["fielding","FIELDING","Automatic catches and better defense","🧤"]]){
  let price=fieldPrice(type),max=saved[type]>=5;
  html+='<div class="shop-row"><div class="up-icon">'+emoji+'</div><div class="up-copy"><strong>'+name+' <span>'+saved[type]+'/5</span></strong><small>'+description+'</small></div><button class="small-btn" data-action="'+type+'" '+(max||saved.coins<price?"disabled":"")+'>'+(max?"MAX":price+" 🪙")+'</button></div>';
 }
 return html;
}
function seasonMenu(){
 const sd=seasonData(),idx=sd.results.length,done=idx>=16,op=seasonOpponent();
 game.mode="seasonMenu";game.phase="idle";game.pitch=null;updateHud();
 overlay.className="overlay on";
 overlay.innerHTML='<div class="menu-card"><div class="menu-badge">⚾ DINGER DASH · SEASON MODE</div><h2>THE PENNANT RACE</h2><div class="record-grid"><div><b>'+sd.wins+'</b><small>WINS</small></div><div><b>'+sd.losses+'</b><small>LOSSES</small></div><div><b>'+idx+'/16</b><small>GAMES PLAYED</small></div></div><div class="season-panel"><div class="season-title">'+(done?"SEASON COMPLETE":'GAME '+(idx+1)+' OF 16')+'</div><strong>'+(done?(sd.wins>=10?"CHAMPIONS!":"SEASON FINISHED"):("YOU vs "+op[0]))+'</strong><small>'+(done?('Final record: '+sd.wins+'–'+sd.losses+'. '+(sd.wins>=10?"You earned the pennant!":"Build a stronger club and try again.")):('Three innings · three outs per side · '+(sd.active?"Continue your saved game":"Play both offense and defense")+'. Scout tip: hitters struggle with '+op[2].toLowerCase()+'s.'))+'</small></div>'+seasonTiles()+'<div class="inning-detail">You bat <strong>second</strong> as the home team. On the mound, choose a pitch and its location, then tap THROW when the moving marker reaches green. Your fielders make plays automatically. Wins earn coins for building your team.</div><button class="primary-btn season-btn" data-action="'+(done?"newseason":"seasonStart")+'">'+(done?"START A NEW SEASON":sd.active?"RESUME GAME "+(idx+1):"PLAY GAME "+(idx+1))+' <span>›</span></button>'+seasonShop()+'<button class="ghost-btn" data-action="home">MAIN MENU</button></div>';
}
function seasonStart(){
 const sd=seasonData();
 if(sd.results.length>=16){seasonMenu();return}
 game.mode="season";game.phase="rest";game.playMode="season";game.swingStyle="contact";
 game.pitch=null;game.flight=null;game.particles=[];game.finishAt=0;game.lastKind="";game.lastTarget=1;
 if(sd.active&&sd.active.match){
  game.match=sd.active.match;
  const st=sd.active.stats||{};
  for(const k of ["outs","strikes","balls","score","hits","homers","perfects","pitchCount","streak"]){game[k]=st[k]||0}
 } else {
  game.match={index:sd.results.length,inning:1,offense:"cpu",scores:[0,0],bases:[false,false,false],pitchKind:"FASTBALL",pitchZone:"corner",pitchSeed:0,lastPitch:"",repeats:0,batters:0};
  game.outs=0;game.strikes=0;game.balls=0;game.score=0;game.hits=0;game.homers=0;game.perfects=0;game.pitchCount=0;game.streak=0;
 }
 game.restUntil=performance.now()+850;
 game.match.pitchSeed=game.restUntil;
 overlay.className="overlay";overlay.innerHTML="";banner.className="banner";
 $("cue").textContent=game.match.offense==="cpu"?"YOU ARE PITCHING":"YOU ARE BATTING";
 seasonSave();updateHud();
}
function seasonSave(){
 if(game.mode!=="season"||!game.match)return;
 const st={};
 for(const k of ["outs","strikes","balls","score","hits","homers","perfects","pitchCount","streak"])st[k]=game[k]||0;
 seasonData().active={match:JSON.parse(JSON.stringify(game.match)),stats:st};
 store();
}
function seasonSettleAtBat(){
 game.strikes=0;game.balls=0;
 game.match.batters++;
}
function seasonWalk(side){
 const b=game.match.bases;
 if(b[0]){if(b[1]){if(b[2])game.match.scores[side]++;b[2]=true}b[1]=true}
 b[0]=true;
}
function seasonAdvance(side,steps){
 const m=game.match,old=m.bases.slice(),next=[false,false,false];
 let runs=steps===4?1:0;
 for(let i=2;i>=0;i--){
  if(!old[i])continue;
  if(steps===4||i+steps>=3)runs++;
  else if(steps===1&&i===1&&Math.random()<.48)runs++;
  else next[i+steps]=true;
 }
 if(steps!==4)next[steps-1]=true;
 m.bases=next;m.scores[side]+=runs;
 return runs;
}
function seasonBatterOut(reason,now,play=true){
 game.outs++;seasonSettleAtBat();
 notify(reason,"miss");sound(205,.14,"triangle");
 game.phase="seasonResult";game.match.resultUntil=now+(play?980:620);
}
function seasonAfterPitch(now){
 if(game.mode!=="season")return;
 const m=game.match;
 if(m.offense==="you"&&m.inning>=3&&m.scores[0]>m.scores[1]){seasonFinish();return}
 if(game.outs>=3){
  game.outs=0;game.strikes=0;game.balls=0;m.bases=[false,false,false];m.lastPitch="";m.repeats=0;
  if(m.offense==="cpu"){
   m.offense="you";notify("BOTTOM "+m.inning+" · YOU BAT!","good");
  }else{
   if(m.inning>=3&&m.scores[0]!==m.scores[1]){seasonFinish();return}
   m.inning++;m.offense="cpu";notify("TOP "+m.inning+" · YOU PITCH!","good");
  }
 }
 game.phase="rest";game.pitch=null;game.flight=null;game.match.resultUntil=0;
 game.restUntil=now+600;
 seasonSave();updateHud();
}
function seasonFinish(){
 const m=game.match,sd=seasonData(),won=m.scores[0]>m.scores[1];
 const endScores=m.scores.slice(),reward=won?110:40;
 const opponent=seasonTeams[m.index][0];
 sd.results.push({won,score:endScores,opponent,innings:m.inning});
 sd.active=null;sd.wins+=won?1:0;sd.losses+=won?0:1;
 saved.coins+=reward+(won?Math.min(30,game.homers||0)*5:0);
 if(sd.results.length===16&&sd.wins>=10){sd.championships=(sd.championships||0)+1;saved.coins+=300}
 game.mode="seasonOver";game.phase="idle";game.pitch=null;game.flight=null;game.match=null;store();updateHud();
 if(won)melody();else sound(220,.24,"triangle");
 const done=sd.results.length===16;
 overlay.className="overlay on";
 overlay.innerHTML='<div class="menu-card over-card"><div class="menu-badge">'+(done?"16-GAME SEASON COMPLETE":"GAME "+sd.results.length+" OF 16")+'</div><h2>'+(won?"YOU WIN!":"TOUGH LOSS!")+'</h2><div class="final-score">'+endScores[0]+' – '+endScores[1]+'</div><div class="record-grid"><div><b>'+sd.wins+'</b><small>WINS</small></div><div><b>'+sd.losses+'</b><small>LOSSES</small></div><div><b>+'+reward+'</b><small>🪙 COINS</small></div></div><p class="replay-note">'+(done?(sd.wins>=10?"PENNANT CHAMPIONS! BONUS 300 COINS!":"Season complete. Build your club for next season."):("Next up: "+seasonOpponent()[0]))+'</p><button class="primary-btn season-btn" data-action="seasonMenu">'+(done?"VIEW SEASON RESULTS":"CONTINUE SEASON")+' <span>›</span></button><button class="ghost-btn" data-action="home">MAIN MENU</button></div>';
}
function seasonPlayerContact(type,now,sector,perfect,distance){
 const m=game.match,cpuStrength=seasonTeams[m.index][1];
 const steps={"SINGLE":1,"DOUBLE":2,"TRIPLE":3,"HOME RUN":4}[type]||0;
 const caught=steps>0&&steps<4&&Math.random()<(type==="SINGLE"?.07:type==="DOUBLE"?.11:.09)+cpuStrength*.012;
 game.swingAt=now;
 game.flight={start:now,duration:900,distance,sector,kind:caught?"POP OUT":type,perfect,quality:perfect?"PERFECT":"HIT"};
 if(steps===0||caught){
  game.outs++;game.streak=0;notify(caught?"CAUGHT BY THE DEFENSE!":"POP FLY · OUT","miss");
 }else{
  const runs=seasonAdvance(0,steps);
  game.hits++;game.streak++;
  if(type==="HOME RUN"){game.homers++;saved.homers++;celebrate(195,185)}
  if(perfect)game.perfects++;
  game.score+=steps*30;
  saved.coins+=steps===4?15:4;
  notify((runs?runs+" RUN"+(runs>1?"S":"")+"! · ":"")+type,"good");
  if(runs)sound(730,.2,"triangle");
 }
 seasonSettleAtBat();game.phase="flight";store();updateHud();
}
function seasonBatStrike(reason,now,foul=false){
 if(!foul||game.strikes<2)game.strikes++;
 if(game.strikes>=3){seasonBatterOut("STRIKE THREE! · OUT",now);return}
 notify(reason||(foul?"FOUL BALL":"STRIKE"),"miss");
 game.phase="seasonResult";game.match.resultUntil=now+700;updateHud();
}
function seasonBatTake(now){
 if(game.pitch.isBall){
  game.balls++;
  if(game.balls>=4){
   seasonWalk(0);seasonSettleAtBat();notify("BALL FOUR! TAKE YOUR BASE","good")
  }else notify("BALL "+game.balls+" · GOOD EYE!","good");
 }else seasonBatStrike("CALLED STRIKE!",now);
 if(game.phase!=="seasonResult"){game.phase="seasonResult";game.match.resultUntil=now+690}
 updateHud();
}
function seasonThrow(now){
 if(game.mode!=="season"||game.phase!=="seasonPitch"||game.match.offense!=="cpu")return;
 const m=game.match,team=seasonTeams[m.index],kind=m.pitchKind,zone=m.pitchZone;
 const pos=.5+.5*Math.sin((now-m.pitchSeed)/350);
 const accuracy=1-Math.abs(pos-.5)*2;
 const control=Math.min(1,accuracy*.82+saved.pitching*.045);
 const repeated=kind===m.lastPitch?m.repeats+1:1;m.repeats=repeated;m.lastPitch=kind;
 const weakness=kind===team[2]?-.15:0;
 const locationStrike=zone==="waste"?Math.random()<.11:Math.random()<(zone==="corner"?.74:.91)+control*.07;
 const cpuSkill=team[1],chase=zone==="waste"?(.13+(cpuSkill-1)*.018):(.22+(cpuSkill-1)*.018);
 const swingCpu=locationStrike?Math.random()<(.70+cpuSkill*.018):Math.random()<chase;
 game.pitchCount++;
 let result="",showHit=false;
 if(!swingCpu){
  if(locationStrike){game.strikes++;result="CALLED STRIKE!"}
  else{game.balls++;result="BALL "+game.balls+" · GOOD EYE"}
 }else{
  const hitChance=Math.max(.12,Math.min(.76,.30+cpuSkill*.043+weakness+(1-control)*.22+(repeated>=3?.15:0)+(zone==="waste"?-.16:0)-(saved.pitching*.022)));
  const v=Math.random();
  if(v>hitChance+.12){game.strikes++;result="SWING & MISS!"}
  else if(v>hitChance){if(game.strikes<2)game.strikes++;result="FOUL BALL!"}
  else{
   const power=Math.random(),big=power<(Math.max(.02,.10+(cpuSkill-3)*.02-saved.pitching*.008));
   const hitType=big?"HOME RUN":power<.30?"DOUBLE":power<.34?"TRIPLE":"SINGLE";
   const fieldChance=Math.min(.70,(hitType==="SINGLE"?.34:hitType==="DOUBLE"?.17:hitType==="TRIPLE"?.12:0)+saved.fielding*.09+control*.06);
   if(Math.random()<fieldChance){
    game.outs++;result="GREAT DEFENSIVE PLAY! · OUT";
   }else{
    const runs=seasonAdvance(1,{"SINGLE":1,"DOUBLE":2,"TRIPLE":3,"HOME RUN":4}[hitType]);
    result=(runs?runs+" CPU RUN"+(runs>1?"S":"")+"! · ":"")+hitType;
    showHit=true;
    game.flight={start:now,duration:920,distance:hitType==="HOME RUN"?380:hitType==="TRIPLE"?290:hitType==="DOUBLE"?240:170,sector:Math.floor(Math.random()*3),kind:hitType,perfect:false};
   }
   seasonSettleAtBat();
  }
 }
 if(!swingCpu||!showHit&&result!=="GREAT DEFENSIVE PLAY! · OUT"){
  if(game.strikes>=3){game.outs++;result="STRIKE THREE! · OUT";seasonSettleAtBat()}
  else if(game.balls>=4){seasonWalk(1);result="WALK · RUNNER ON BASE";seasonSettleAtBat()}
 }
 if(result==="GREAT DEFENSIVE PLAY! · OUT")seasonSettleAtBat();
 if(result.includes("OUT")||result.includes("RUN"))game.streak=0;
 notify(result,showHit?"gold":result.includes("OUT")?"good":"normal");
 sound(showHit?610:result.includes("STRIKE")?390:260,.10,"triangle",.06);
 game.phase="seasonResult";m.resultUntil=now+(showHit?1100:760);
 seasonSave();updateHud();
}
function seasonUpdate(now){
 const m=game.match;
 if(!m)return;
 if(game.phase==="rest"&&now>=game.restUntil){
  if(m.offense==="you"){pitch(now)}
  else{game.phase="seasonPitch";m.pitchSeed=now;game.pitch=null;updateHud()}
 }
 if(game.phase==="seasonPitch"){
  const position=(.5+.5*Math.sin((now-m.pitchSeed)/350))*100;
  $("meterDot").style.left=position+"%";
  $("cue").textContent="PICK YOUR PITCH · TAP THROW";
 }else if(game.phase==="seasonResult"){
  if(now>=m.resultUntil)seasonAfterPitch(now)
 }else if(game.phase==="pitch"&&game.pitch){
  const remain=game.pitch.start+game.pitch.duration-now;
  if(remain< -185){seasonBatTake(now)}
  else $("cue").textContent=game.pitch.kind+" · "+game.pitch.mph+" MPH";
 }else if(game.phase==="flight"&&game.flight&&now>=game.flight.start+game.flight.duration){
  seasonAfterPitch(now)
 }
 for(let i=game.particles.length-1;i>=0;i--){
  const q=game.particles[i];q.x+=q.vx;q.y+=q.vy;q.vy+=.13;q.life--;if(q.life<=0)game.particles.splice(i,1);
 }
}
function home(){
 game.mode="home";game.phase="idle";game.pitch=null;game.finishAt=0;updateHud();overlay.className="overlay on";
 const rv=rivalAt(saved.rival);
 overlay.innerHTML='<div class="menu-card"><div class="menu-badge">⚾ THE BACKYARD BASEBALL ARCADE ⚾</div><h1>DINGER<br><span>DASH!</span></h1><div class="menu-ball">⚾</div><p class="lead">Read the pitch. Pick your swing.<br>Become a backyard legend.</p><div class="record-grid"><div><b>'+saved.high.toLocaleString()+'</b><small>HIGH SCORE</small></div><div><b>'+saved.homers+'</b><small>CAREER HOMERS</small></div><div><b>'+saved.coins+'</b><small>🪙 COINS</small></div></div><button class="primary-btn" data-action="play">ARCADE DERBY <span>›</span></button><div class="season-panel"><div class="season-title">🏆 16-GAME SEASON · THREE INNINGS</div><strong>PLAY REAL BASEBALL!</strong><small>Bat, pitch, score runs, and build a winning team. Your season saves between games.</small></div><button class="primary-btn season-btn" data-action="seasonMenu">ENTER SEASON MODE <span>›</span></button><div class="rival-panel"><span class="rival-kicker">🏆 RIVAL ROAD · LEVEL '+(saved.rival+1)+'</span><strong>'+rv.name+'</strong><small>Beat '+rv.score+' points and hit '+rv.homers+' home run'+(rv.homers===1?"":"s")+' in '+rv.limit+' pitches.</small></div><button class="primary-btn secondary-play" data-action="challenge">CHALLENGE RIVAL <span>›</span></button><button class="ghost-btn" data-action="practice">PRACTICE SWINGS</button><div class="how"><span class="how-icon">☝️</span><div><b>MASTER THE PLATE</b><p>Some pitches are balls, so let them pass! Swing at strikes. Three strikes make an out; four balls earn a walk. Choose CONTACT for safer hits or POWER for big home runs. Watch the ball, not the words!</p></div></div>'+shopHtml()+'<div class="credits">NO ADS · NO ACCOUNT · PROGRESS SAVES ON THIS DEVICE</div></div>';
}
function start(mode="play"){
 game.mode=mode===true?"practice":mode===false?"play":mode;
 game.playMode=game.mode;game.phase="rest";game.score=0;game.outs=0;game.strikes=0;game.balls=0;game.streak=0;game.bestStreak=0;game.homers=0;game.perfects=0;game.hits=0;game.pitchCount=0;game.target=1;game.lastTarget=1;game.lastKind="";game.pitch=null;game.flight=null;game.particles=[];game.finishAt=0;
 game.rivalIndex=saved.rival;game.limit=game.mode==="challenge"?rivalAt(game.rivalIndex).limit:0;
 game.swingStyle="contact";game.restUntil=performance.now()+850;
 overlay.className="overlay";overlay.innerHTML="";banner.className="banner";
 $("cue").textContent="WATCH THE PITCH";updateHud();sound(520,.14,"triangle");
}
function end(){
 if(game.mode!=="play"&&game.mode!=="challenge")return;
 const career=game.mode==="challenge",rv=rivalAt(game.rivalIndex);
 game.mode="over";game.phase="idle";saved.games++;
 const record=!career&&game.score>saved.high;
 if(record)saved.high=game.score;
 const won=career&&game.score>=rv.score&&game.homers>=rv.homers;
 if(won){saved.rival=Math.max(saved.rival,game.rivalIndex+1);saved.careerWins++;saved.coins+=rv.reward}
 store();updateHud();if(record||won)melody();
 const headline=career?(won?"RIVAL DEFEATED!":"RIVAL SURVIVES!"):(record?"NEW HIGH SCORE!":"NICE HITTING!");
 const assessment=career?(won?"+"+rv.reward+" BONUS COINS · NEXT RIVAL UNLOCKED":"NEED "+rv.score+" POINTS + "+rv.homers+" HOME RUN"+(rv.homers===1?"":"S")):(game.homers>=3?"You're a home run machine!":game.hits>=5?"Your swing is heating up!":"Every legend starts with one swing!");
 overlay.className="overlay on";
 overlay.innerHTML='<div class="menu-card over-card"><div class="menu-badge">'+(career?"RIVAL ROAD · LEVEL "+(game.rivalIndex+1):"ARCADE FINAL SCORE")+'</div><h2>'+headline+'</h2><div class="final-score">'+game.score.toLocaleString()+'</div><div class="stats-grid"><div><b>'+game.homers+'</b><small>HOME RUNS</small></div><div><b>'+game.hits+'</b><small>HITS</small></div><div><b>'+game.perfects+'</b><small>PERFECT SWINGS</small></div></div><p class="replay-note">'+assessment+'</p><button class="primary-btn" data-action="'+(career?"challenge":"play")+'">'+(career?(won?"NEXT CHALLENGER":"RETRY RIVAL"):"PLAY AGAIN")+' <span>›</span></button><button class="ghost-btn" data-action="home">MAIN MENU</button><div class="bank-total">🪙 '+saved.coins+' COINS SAVED</div>'+shopHtml()+'</div>';
}
function pause(){
 if(!live())return;
 game.wasMode=game.mode;game.wasPhase=game.phase;game.mode="paused";
 overlay.className="overlay on";
 overlay.innerHTML='<div class="menu-card pause-card"><div class="menu-badge">TAKE A BREATHER</div><h2>TIME OUT!</h2><div class="pause-ball">⚾</div><button class="primary-btn" data-action="resume">RESUME GAME <span>›</span></button><button class="ghost-btn" data-action="home">QUIT TO MENU</button></div>';
 $("swing").disabled=true;
}
function resume(){
 game.mode=game.wasMode||"play";
 if(game.wasPhase==="pitch")game.pitchCount=Math.max(0,game.pitchCount-1);
 game.phase="rest";game.pitch=null;game.flight=null;
 const finished=(game.outs>=3&&game.mode!=="practice")||(game.mode==="challenge"&&game.pitchCount>=game.limit);
 game.finishAt=finished?performance.now()+750:0;
 game.restUntil=performance.now()+750;
 overlay.className="overlay";overlay.innerHTML="";$("cue").textContent="WATCH THE PITCH";updateHud();
}
function pitch(now){
 if(game.mode==="challenge"&&game.pitchCount>=game.limit){game.finishAt=now+350;return}
 game.pitchCount++;
 const grade=game.mode==="practice"?0:game.mode==="challenge"?Math.min(7,game.rivalIndex+1):Math.min(7,Math.floor((game.pitchCount-1)/6));
 game.pitchGrade=grade;
 const pool=["FOUR-SEAM","FOUR-SEAM","CHANGEUP","CURVEBALL","SLIDER"];
 if(grade>=2)pool.push("CUTTER","SLIDER");
 if(grade>=4)pool.push("SINKER","CUTTER");
 let kind=pool[Math.floor(Math.random()*pool.length)];
 if(game.pitchCount<=2&&game.mode!=="challenge")kind=game.pitchCount===1?"FOUR-SEAM":"CHANGEUP";
 if(kind===game.lastKind&&pool.length>3){const others=pool.filter(x=>x!==kind);kind=others[Math.floor(Math.random()*others.length)]}
 game.lastKind=kind;
 const tuning={
 "FOUR-SEAM":[990,210,84,5,-41],"CHANGEUP":[1410,270,68,4,-17],
 "CURVEBALL":[1150,290,76,5,-24],"SLIDER":[1080,210,81,6,-27],
 "CUTTER":[900,210,87,5,-39],"SINKER":[1030,230,80,5,-32]
 }[kind];
 const duration=Math.max(560,tuning[0]+Math.random()*tuning[1]+tuning[4]*grade);
 const mph=Math.round(tuning[2]+Math.random()*tuning[3]+grade*.9);
 const isBall=game.pitchCount>2&&Math.random()<(game.mode==="practice"?.26:.20+Math.min(.11,grade*.014));
 const lane=isBall?(Math.random()<.5?-1:1)*(57+Math.random()*33):(Math.random()-.5)*34;
 const curve=(kind==="CURVEBALL"?1:kind==="SLIDER"?1.2:kind==="SINKER"?-.9:kind==="CUTTER"?.55:.25)*(Math.random()<.5?-1:1)*(13+Math.random()*21);
 let target=Math.floor(Math.random()*3);
 if(Math.random()<.65&&target===game.lastTarget)target=(target+1+Math.floor(Math.random()*2))%3;
 game.target=target;game.lastTarget=target;
 game.pitch={start:now+300+Math.random()*250,duration,curve,kind,mph,isBall,lane};
 game.phase="pitch";game.swingAt=-1;$("cue").textContent=kind+"!";updateHud();
}
function resultRest(now){
 game.phase="rest";game.pitch=null;game.flight=null;game.restUntil=now+950;
 if((game.outs>=3&&game.mode!=="practice")||(game.mode==="challenge"&&game.pitchCount>=game.limit))game.finishAt=now+960;
 updateHud();
}
function strike(reason,now,foul=false){
 game.streak=0;game.swingAt=now;
 if(!foul||game.strikes<2)game.strikes++;
 sound(220,.15,"sawtooth",.07);
 if(game.strikes>=3){game.strikes=0;game.balls=0;game.outs++;notify(game.outs>=3?"THREE OUTS!":"STRIKE THREE!","miss")}
 else notify(reason||(foul?"FOUL BALL!":"STRIKE!"),"miss");
 $("cue").textContent=game.mode==="practice"?"KEEP TRYING!":"STRIKES: "+game.strikes+"/3";
 if(game.mode==="practice"){game.outs=0;game.strikes=0;game.balls=0}
 resultRest(now);
}
function takePitch(now){
 const p=game.pitch;if(!p)return;
 if(p.isBall){
   game.balls++;
   if(game.balls>=4){
     game.balls=0;game.strikes=0;game.score+=35;
     if(game.mode!=="practice")saved.coins+=8;
     notify("BALL FOUR! WALK +35","good");sound(520,.16,"triangle");
   }else{notify("BALL "+game.balls+" · GOOD EYE!","good");sound(480,.07,"triangle",.04)}
   $("cue").textContent="GOOD EYE!";
   store();resultRest(now);
 }else strike("CALLED STRIKE!",now);
}
function hit(now,delta){
 const p=game.pitch,grade=game.pitchGrade,eye=saved.eye,bat=saved.bat,power=game.swingStyle==="power";
 const abs=Math.abs(delta),margin=(power?118:173)+eye*(power?10:13)-Math.min(23,grade*3);
 if(p.isBall){strike("CHASED OUTSIDE!",now);return}
 if(abs>margin){
   strike(abs>margin+36?(delta<0?"TOO EARLY!":"TOO LATE!"):"FOUL TIP!",now,abs<=margin+36);return;
 }
 const perfectMax=(power?31:41)+eye*5;
 const greatMax=(power?74:99)+eye*7;
 const goodMax=(power?104:146)+eye*9;
 const perfect=abs<=perfectMax,quality=perfect?"PERFECT":abs<=greatMax?"GREAT":abs<=goodMax?"GOOD":"TIP";
 let distance;
 if(power)distance=perfect?377+bat*19+Math.random()*53:quality==="GREAT"?309+bat*17+Math.random()*46:quality==="GOOD"?208+bat*14+Math.random()*56:125+bat*10+Math.random()*45;
 else distance=perfect?333+bat*13+Math.random()*45:quality==="GREAT"?235+bat*15+Math.random()*56:quality==="GOOD"?163+bat*12+Math.random()*49:104+bat*9+Math.random()*41;
 if(p.kind==="FOUR-SEAM"||p.kind==="CUTTER")distance+=8;
 if(p.kind==="SINKER")distance-=10;
 distance=Math.round(distance);
 const type=distance>=330?"HOME RUN":distance>=275?"TRIPLE":distance>=210?"DOUBLE":distance>=145?"SINGLE":"POP OUT";
 const sector=delta< -53?0:delta>53?2:1;
 game.swingAt=now;game.flight={start:now,duration:940,distance,sector,kind:type,perfect,quality};
 if(type==="POP OUT"){game.streak=0;game.outs++;notify("POP FLY · OUT!","miss");sound(180,.14,"triangle")}
 else{
   game.hits++;game.streak++;game.bestStreak=Math.max(game.streak,game.bestStreak);
   if(type==="HOME RUN"){game.homers++;if(game.mode!=="practice")saved.homers++;missionStep("hr")}
   if(type==="DOUBLE"||type==="TRIPLE"||type==="HOME RUN")missionStep("xbh");
   missionStep("hits");
   if(perfect){game.perfects++;if(game.mode!=="practice")saved.perfects++;missionStep("perfect")}
   const matched=type==="HOME RUN"&&sector===game.target,base=type==="HOME RUN"?100:type==="TRIPLE"?60:type==="DOUBLE"?35:15,combo=Math.min(3,1+Math.floor(game.streak/4));
   const gain=(base+(perfect?25:0)+(matched?75:0))*combo+(power&&type==="HOME RUN"?20:0);
   game.score+=gain;
   if(game.mode!=="practice")saved.coins+=type==="HOME RUN"?20:type==="TRIPLE"?12:type==="DOUBLE"?8:5;
   if(game.mode!=="practice"&&perfect)saved.coins+=4;
   if(game.mode!=="practice"&&matched)saved.coins+=12;
   if(type==="HOME RUN"){notify(matched?"🎯 TARGET SMASH! +"+gain:"💥 HOME RUN! +"+gain,"gold");celebrate(sector===0?105:sector===1?195:285,170);melody();vibrate([30,35,60])}
   else{notify((perfect?"PERFECT! ":"")+type+" +"+gain,perfect?"gold":"good");sound(480,.19,"triangle");vibrate(18)}
 }
 game.balls=0;game.strikes=0;game.phase="flight";
 $("cue").textContent=quality+" · "+distance+" FT";store();updateHud();
}
function swing(){
 if(!live()||game.phase!=="pitch"||!game.pitch)return;
 const now=performance.now(),p=game.pitch,delta=now-(p.start+p.duration);
 if(now<p.start-30){$("cue").textContent="WATCH THE BALL!";return}
 sound(280,.08,"square",.04);hit(now,delta);
}
function update(now){
 game.t=now;if(!live())return;
 if(game.finishAt&&now>=game.finishAt){game.finishAt=0;end();return}
 if(game.phase==="rest"&&now>=game.restUntil&&!game.finishAt)pitch(now);
 if(game.phase==="pitch"&&game.pitch){
   const p=game.pitch,remain=p.start+p.duration-now;
   if(remain< -185){takePitch(now);return}
   $("cue").textContent=p.kind+" · "+p.mph+" MPH";
   $("cue").className="cue";
 }else $("cue").className="cue";
 if(game.phase==="flight"&&game.flight&&now>=game.flight.start+game.flight.duration)resultRest(now);
 for(let i=game.particles.length-1;i>=0;i--){
  const part=game.particles[i];part.x+=part.vx;part.y+=part.vy;part.vy+=.13;part.life--;if(part.life<=0)game.particles.splice(i,1)
 }
}
function celebrate(x,y){
if(reduced)return;
const colors=["#ffcf33","#fb6544","#5ce4ec","#fff","#a6f65c"];
for(let i=0;i<65;i++){let a=Math.PI*2*i/65,s=1.1+Math.random()*4.4;game.particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-1.6,life:35+Math.random()*25,color:colors[i%colors.length],r:2+Math.random()*3})}
}
function roundRect(x,y,w,h,r,fill,stroke){ctx.beginPath();ctx.roundRect(x,y,w,h,r);if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.stroke()}}
function ellipse(x,y,rx,ry,color){ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fillStyle=color;ctx.fill()}
function line(x1,y1,x2,y2,color,width=2){ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke()}
function textAt(text,x,y,size=15,color="#fff",weight=800){ctx.fillStyle=color;ctx.font=weight+" "+size+"px system-ui, sans-serif";ctx.textAlign="center";ctx.fillText(text,x,y)}
function baseball(x,y,r,rot=0){ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.shadowBlur=7;ctx.shadowColor="#122c3077";ellipse(0,0,r,r,"#fffdf0");ctx.shadowBlur=0;ctx.strokeStyle="#ed4352";ctx.lineWidth=Math.max(1,r*.13);ctx.beginPath();ctx.arc(-r*.6,0,r*.8,-Math.PI/2,Math.PI/2);ctx.arc(r*.6,0,r*.8,Math.PI/2,Math.PI*1.5);ctx.stroke();ctx.restore()}
function stadium(){
let sky=ctx.createLinearGradient(0,0,0,330);sky.addColorStop(0,"#4fc3f7");sky.addColorStop(.6,"#91e5fc");sky.addColorStop(1,"#c8f6c1");ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
ellipse(324,67,36,36,"#fff0a5");ellipse(65,72,58,17,"#ffffff98");ellipse(91,76,42,12,"#ffffffa0");ellipse(248,109,57,13,"#ffffffaa");
ctx.fillStyle="#173959";ctx.beginPath();ctx.moveTo(0,154);ctx.quadraticCurveTo(195,90,390,154);ctx.lineTo(390,234);ctx.lineTo(0,234);ctx.fill();
ctx.fillStyle="#234f70";ctx.beginPath();ctx.moveTo(0,164);ctx.quadraticCurveTo(195,110,390,164);ctx.lineTo(390,206);ctx.lineTo(0,206);ctx.fill();
for(let i=0;i<180;i++){const x=(i*79)%390,y=143+((i*29)%66);ctx.fillStyle=["#f97349","#fae88b","#fff","#50c7e4","#a6e36d"][i%5];ctx.fillRect(x,y,3,2)}
line(0,216,390,216,"#fce78a",8);
const grass=ctx.createLinearGradient(0,198,0,520);grass.addColorStop(0,"#5bc96f");grass.addColorStop(.65,"#278b54");grass.addColorStop(1,"#106541");ctx.fillStyle=grass;ctx.fillRect(0,214,390,306);
ctx.save();ctx.beginPath();ctx.moveTo(195,471);ctx.lineTo(-20,216);ctx.quadraticCurveTo(195,166,410,216);ctx.closePath();ctx.clip();
for(let i=0;i<7;i++){ctx.fillStyle=i%2?"#ffffff0a":"#093d1815";ctx.beginPath();ctx.moveTo(195,471);ctx.lineTo(-240+i*119,190);ctx.lineTo(-180+i*119,190);ctx.closePath();ctx.fill()}ctx.restore();
ctx.strokeStyle="#fbf1c5";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(195,471);ctx.lineTo(3,212);ctx.quadraticCurveTo(195,169,387,212);ctx.lineTo(195,471);ctx.stroke();
ctx.strokeStyle="#ffe4a5";ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(4,213);ctx.quadraticCurveTo(195,172,386,213);ctx.stroke();
ellipse(195,385,70,33,"#b88352");ellipse(195,385,57,27,"#d99e63");
ctx.save();ctx.translate(195,390);ctx.rotate(Math.PI/4);ctx.fillStyle="#c68a50";ctx.fillRect(-39,-39,78,78);ctx.restore();
ctx.save();ctx.translate(195,390);ctx.rotate(Math.PI/4);ctx.strokeStyle="#fff0ce";ctx.lineWidth=3;ctx.strokeRect(-36,-36,72,72);ctx.restore();
ellipse(195,295,44,10,"#b88555");
roundRect(136,25,118,46,9,"#10314bdc","#f2d76c");textAt("DINGER DASH",195,44,12,"#ffdc55");textAt("HOME RUN DERBY",195,59,9,"#fff");
for(let i=0;i<3;i++)targetCircle(i);
}
function targetCircle(i){
const x=[104,195,286][i],y=218;
ellipse(x,y+10,27,9,"#053b3c50");
ctx.lineWidth=i===game.target?5:2;ctx.strokeStyle=i===game.target?"#ffe66b":"#ffffff88";ctx.fillStyle=i===game.target?"#f14648":"#2a8892";ctx.beginPath();ctx.arc(x,y,24,0,Math.PI*2);ctx.fill();ctx.stroke();
ctx.beginPath();ctx.arc(x,y,14,0,Math.PI*2);ctx.strokeStyle="#fff";ctx.lineWidth=3;ctx.stroke();
ellipse(x,y,5,5,"#ffe86e");if(i===game.target){textAt("BONUS",x,y-34,10,"#fff06a",900);textAt("+75",x,y+43,12,"#fff",900)}
}
function pitcher(now){
const mov=Math.sin(now/180)*2;
ellipse(195,294,21,6,"#174b3699");
line(185,281,179,292,"#263859",5);line(204,282,211,292,"#263859",5);
roundRect(182,256+mov,27,29,8,"#f9f2e2","#264565");roundRect(182,256+mov,27,8,6,"#ffc43b");
ellipse(195,247+mov,11,12,"#db996f");roundRect(183,234+mov,26,9,5,"#153a5a");
line(184,262+mov,174,273+mov,"#e7a57c",5);line(206,262+mov,217,267+mov,"#e7a57c",5);
ellipse(173,273+mov,5,6,"#82533e");textAt("7",195,278+mov,10,"#183c55");
}
function batter(now){
const sw=game.swingAt>0?Math.max(0,1-(now-game.swingAt)/260):0;
ellipse(133,460,32,8,"#12482d80");
line(123,434,113,458,"#e2eaff",9);line(141,436,152,458,"#e2eaff",9);
line(108,457,120,457,"#153d5c",6);line(146,457,159,457,"#153d5c",6);
roundRect(118,395,34,43,12,"#ef5a43","#fbc66e");ellipse(136,382,17,18,"#e8a87a");
roundRect(117,364,39,13,6,"#123a5c");roundRect(146,371,16,5,3,"#123a5c");
line(144,406,158,418,"#e9aa80",8);line(126,406,146,416,"#e9aa80",8);
ctx.save();ctx.translate(151,417);ctx.rotate(-.5-sw*2.1);line(0,0,12,-66,"#c08b53",9);line(12,-66,12,-74,"#ffe1a0",4);ctx.restore();
textAt("9",135,425,15,"#fff",900);
ctx.fillStyle="#ffffffdc";ctx.beginPath();ctx.moveTo(190,460);ctx.lineTo(200,460);ctx.lineTo(205,469);ctx.lineTo(195,480);ctx.lineTo(185,469);ctx.closePath();ctx.fill();ctx.strokeStyle="#7c9db0";ctx.lineWidth=1;ctx.stroke();
}
function ring(now){
 ctx.save();
 ctx.strokeStyle="#ffffffb8";ctx.lineWidth=3;ctx.shadowBlur=7;ctx.shadowColor="#ffffff83";
 ctx.beginPath();ctx.ellipse(195,437,30,17,0,0,Math.PI*2);ctx.stroke();
 ctx.shadowBlur=0;ctx.strokeStyle="#ffffff6a";ctx.lineWidth=1.5;ctx.setLineDash([5,5]);
 ctx.strokeRect(156,413,78,51);ctx.restore();
}
function drawPitch(now){
 const p=game.pitch;if(!p||now<p.start)return;
 const progress=Math.max(0,Math.min(1,(now-p.start)/p.duration));
 let shift=p.curve*Math.sin(Math.PI*Math.pow(progress,p.kind==="SLIDER"||p.kind==="CUTTER"?2:1))*Math.pow(progress,.75);
 const x=195+p.lane*Math.pow(progress,1.5)+shift;
 const y=282+156*Math.pow(progress,1.35);
 ellipse(x,y+Math.max(6,20*(1-progress)),7+progress*8,3+progress*3,"#174c3755");
 baseball(x,y,4+progress*8,progress*7);
}
function drawFlight(now){
const f=game.flight;if(!f)return;
let p=Math.min(1,(now-f.start)/f.duration),destX=[102,195,288][f.sector],destY=f.distance>=330?218:f.distance>=275?251:f.distance>=210?294:f.distance>=145?329:352;
const x=195+(destX-195)*p,y=435+(destY-435)*p-Math.sin(Math.PI*p)*(f.distance>=330?119:65);
ctx.save();ctx.strokeStyle="#ffffffaa";ctx.lineWidth=2;ctx.setLineDash([5,7]);ctx.beginPath();ctx.moveTo(195,435);ctx.quadraticCurveTo((195+destX)/2,140,x,y);ctx.stroke();ctx.setLineDash([]);ctx.restore();
baseball(x,y,11-p*5,p*12);
if(p>.80){ellipse(destX,destY+9,12,4,"#ffffff55")}
}
function particles(){for(const p of game.particles){ctx.globalAlpha=Math.min(1,p.life/25);roundRect(p.x,p.y,p.r,p.r,1,p.color)}ctx.globalAlpha=1}
function draw(now){
ctx.clearRect(0,0,W,H);stadium();pitcher(now);ring(now);batter(now);
if(game.phase==="pitch")drawPitch(now);if(game.phase==="flight")drawFlight(now);particles();
if(game.mode==="home"||game.mode==="over"||game.mode==="paused"){ctx.fillStyle="#06233745";ctx.fillRect(0,0,W,H)}
}
function frame(now){if(document.hidden){requestAnimationFrame(frame);return}update(now);draw(now);requestAnimationFrame(frame)}
overlay.addEventListener("click",e=>{
const b=e.target.closest("button[data-action]");if(!b||b.disabled)return;
const act=b.dataset.action;
if(act==="play")start("play");else if(act==="practice")start("practice");else if(act==="challenge")start("challenge");else if(act==="home")home();else if(act==="resume")resume();
else if(act==="bat"||act==="eye"){let cost=coinPrice(act);if(saved[act]<5&&saved.coins>=cost){saved.coins-=cost;saved[act]++;store();sound(800,.18,"triangle");home();}}
});
canvas.addEventListener("pointerdown",e=>{e.preventDefault();swing()},{passive:false});
$("swing").addEventListener("pointerdown",e=>{e.preventDefault();swing()},{passive:false});
$("pause").addEventListener("click",()=>{if(live())pause()});
for(const style of ["contact","power"]){$(style).addEventListener("click",()=>{if(live()){game.swingStyle=style;updateHud();sound(style==="power"?390:580,.09,"triangle",.05)}})}
$("sound").addEventListener("click",()=>{saved.sound=!saved.sound;store();updateHud();if(saved.sound)sound(640,.12)});
document.addEventListener("keydown",e=>{if((e.code==="Space"||e.code==="Enter")&&live()){e.preventDefault();swing()}if(e.code==="Escape"&&live())pause()});
document.addEventListener("visibilitychange",()=>{if(document.hidden&&live())pause()});
window.addEventListener("resize",resize);
resize();home();requestAnimationFrame(frame);
})();