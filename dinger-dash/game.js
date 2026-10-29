(function dingerDash(){
"use strict";
const $=id=>document.getElementById(id);
const canvas=$("field"),ctx=canvas.getContext("2d"),overlay=$("overlay"),banner=$("banner");
const W=390,H=520,KEY="dinger-dash-v1";
const initial={high:0,coins:0,homers:0,perfects:0,bat:0,eye:0,games:0,sound:true,daily:null};
let saved;
try{saved={...initial,...JSON.parse(localStorage.getItem(KEY)||"{}")}}catch(e){saved={...initial}}
const dateKey=()=>{const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,"0"),String(d.getDate()).padStart(2,"0")].join("-")};
const missions=[{label:"Hit 3 home runs",type:"hr",goal:3},{label:"Hit 5 doubles or better",type:"xbh",goal:5},{label:"Make 5 perfect swings",type:"perfect",goal:5},{label:"Get 12 hits",type:"hits",goal:12}];
function todayMission(){let key=dateKey(),n=key.split("").reduce((a,c)=>a+c.charCodeAt(0),0)%missions.length;if(!saved.daily||saved.daily.date!==key)saved.daily={date:key,index:n,progress:0,claimed:false};return missions[saved.daily.index]}
todayMission();
const game={mode:"home",phase:"idle",score:0,outs:0,strikes:0,streak:0,bestStreak:0,balls:0,homers:0,perfects:0,hits:0,rank:1,pitchCount:0, target:1,pitch:null,flight:null,swingAt:-1,restUntil:0,finishAt:0,last:0,particles:[],t:0};
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
$("score").textContent=game.score.toLocaleString();$("outVal").textContent=game.outs+"/3";$("strikes").textContent=game.strikes+"/3";$("coins").textContent=saved.coins.toLocaleString();
$("streak").textContent=game.streak>=2?("x"+Math.min(3,1+Math.floor(game.streak/4))+" | "+game.streak+" HIT STREAK"):"BUILD A HIT STREAK";
$("firefill").style.width=Math.min(100,(game.streak%5)*20)+"%";
$("sound").textContent=saved.sound?"🔊":"🔇";
$("pause").style.display=game.mode==="play"||game.mode==="practice"?"":"none";
$("swing").style.display=game.mode==="play"||game.mode==="practice"?"":"none";
$("swing").disabled=game.phase!=="pitch";
const mission=todayMission();$("mission").textContent=(saved.daily.claimed?"✓ DAILY BONUS COMPLETE":mission.label+" · "+Math.min(mission.goal,saved.daily.progress)+"/"+mission.goal);
}
function notify(txt,kind="normal"){banner.textContent=txt;banner.className="banner visible "+kind;clearTimeout(notify.timer);notify.timer=setTimeout(()=>banner.classList.remove("visible"),1450)}
function missionStep(type){
if(game.mode!=="play"||saved.daily.claimed)return;
const m=todayMission();if(m.type!==type)return;saved.daily.progress=Math.min(m.goal,saved.daily.progress+1);
if(saved.daily.progress>=m.goal){saved.daily.claimed=true;saved.coins+=65;setTimeout(()=>notify("DAILY MISSION +65 COINS!","gold"),1100);melody()}store();
}
function coinPrice(type){return 65+(saved[type]||0)*55}
function shopHtml(){return '<div class="shop-heading">TRAIN YOUR SLUGGER</div><div class="shop-row"><div class="up-icon">💪</div><div class="up-copy"><strong>POWER BAT <span>'+saved.bat+'/5</span></strong><small>Hit the ball farther</small></div><button class="small-btn" data-action="bat" '+(saved.bat>=5||saved.coins<coinPrice("bat")?"disabled":"")+'>'+(saved.bat>=5?"MAX":coinPrice("bat")+" 🪙")+'</button></div><div class="shop-row"><div class="up-icon">👀</div><div class="up-copy"><strong>EAGLE EYES <span>'+saved.eye+'/5</span></strong><small>More forgiving swing timing</small></div><button class="small-btn" data-action="eye" '+(saved.eye>=5||saved.coins<coinPrice("eye")?"disabled":"")+'>'+(saved.eye>=5?"MAX":coinPrice("eye")+" 🪙")+'</button></div><div class="shop-foot">Earn coins by hitting. Upgrades stay saved on this device.</div>'}
function home(){
game.mode="home";game.phase="idle";updateHud();overlay.className="overlay on";
overlay.innerHTML='<div class="menu-card"><div class="menu-badge">⚾ THE BACKYARD BASEBALL ARCADE ⚾</div><h1>DINGER<br><span>DASH!</span></h1><div class="menu-ball">⚾</div><p class="lead">Time your swing. Crush home runs.<br>Become a backyard legend.</p><div class="record-grid"><div><b>'+saved.high.toLocaleString()+'</b><small>HIGH SCORE</small></div><div><b>'+saved.homers+'</b><small>CAREER HOMERS</small></div><div><b>'+saved.coins+'</b><small>🪙 COINS</small></div></div><button class="primary-btn" data-action="play">PLAY BALL! <span>›</span></button><button class="ghost-btn" data-action="practice">PRACTICE SWINGS</button><div class="how"><span class="how-icon">☝️</span><div><b>HOW TO PLAY</b><p>Tap SWING when the ball reaches the glowing circle. Perfect timing sends it flying! Three strikes make an out. Three outs end the game.</p></div></div>'+shopHtml()+'<div class="credits">FREE TO PLAY · NO ADS · SAVES ON THIS PHONE</div></div>';
}
function start(practice=false){
game.mode=practice?"practice":"play";game.phase="rest";game.score=0;game.outs=0;game.strikes=0;game.streak=0;game.bestStreak=0;game.balls=0;game.homers=0;game.perfects=0;game.hits=0;game.pitchCount=0;game.target=1;game.pitch=null;game.flight=null;game.particles=[];game.finishAt=0;game.restUntil=performance.now()+650;
overlay.className="overlay";overlay.innerHTML="";banner.className="banner";$("cue").textContent="WATCH THE PITCH";updateHud();sound(520,.14,"triangle");}
function end(){
if(game.mode!=="play")return;
game.mode="over";game.phase="idle";saved.games++;let record=game.score>saved.high;if(record)saved.high=game.score;store();updateHud();if(record)melody();
overlay.className="overlay on";
overlay.innerHTML='<div class="menu-card over-card"><div class="menu-badge">FINAL SCORE</div><h2>'+(record?"NEW HIGH SCORE!":"NICE HITTING!")+'</h2><div class="final-score">'+game.score.toLocaleString()+'</div><div class="stats-grid"><div><b>'+game.homers+'</b><small>HOME RUNS</small></div><div><b>'+game.hits+'</b><small>HITS</small></div><div><b>'+game.perfects+'</b><small>PERFECT SWINGS</small></div></div><p class="replay-note">'+(game.homers>=3?"You're a home run machine!":game.hits>=5?"Your swing is heating up!":"Every legend starts with one swing!")+'</p><button class="primary-btn" data-action="play">PLAY AGAIN <span>›</span></button><button class="ghost-btn" data-action="home">MAIN MENU</button><div class="bank-total">🪙 '+saved.coins+' COINS SAVED</div>'+shopHtml()+'</div>';
}
function pause(){if(game.mode!=="play"&&game.mode!=="practice")return;game.wasMode=game.mode;game.mode="paused";overlay.className="overlay on";overlay.innerHTML='<div class="menu-card pause-card"><div class="menu-badge">TAKE A BREATHER</div><h2>TIME OUT!</h2><div class="pause-ball">⚾</div><button class="primary-btn" data-action="resume">RESUME GAME <span>›</span></button><button class="ghost-btn" data-action="home">QUIT TO MENU</button></div>';$("swing").disabled=true}
function resume(){game.mode=game.wasMode||"play";game.phase="rest";game.restUntil=performance.now()+700;overlay.className="overlay";overlay.innerHTML="";updateHud()}
function pitch(now){
game.pitchCount++;game.target=[1,0,2][Math.floor((game.pitchCount-1)/3)%3];
let speed=1540-Math.min(420,Math.floor(game.pitchCount/4)*65)-(game.mode==="practice"?-150:0);
game.pitch={start:now+380,duration:speed,curve:Math.sin(game.pitchCount*5.31)*12,kind:game.pitchCount>6&&game.pitchCount%7===0?"CURVE":(game.pitchCount>4&&game.pitchCount%5===0?"FAST":"NORMAL")};
if(game.pitch.kind==="FAST")game.pitch.duration-=120;
game.phase="pitch";game.swingAt=-1;$("cue").textContent="GET READY...";updateHud();
}
function resultRest(now){game.phase="rest";game.pitch=null;game.flight=null;game.restUntil=now+1050;if(game.outs>=3&&game.mode==="play")game.finishAt=now+1100;updateHud()}
function strike(reason,now){
game.streak=0;game.strikes++;game.swingAt=now;sound(220,.15,"sawtooth",.07);
if(game.strikes>=3){game.strikes=0;game.outs++;notify(game.outs>=3?"THREE OUTS!":"STRIKE THREE!","miss");}
else notify(reason||"STRIKE!","miss");
$("cue").textContent=game.mode==="practice"?"KEEP TRYING!":"STRIKES: "+game.strikes+"/3";
if(game.mode==="practice"){game.outs=0;game.strikes=0}
resultRest(now);
}
function hit(now,delta){
const margin=240+saved.eye*19,abs=Math.abs(delta);
if(abs>margin){strike(delta<0?"TOO EARLY!":"TOO LATE!",now);return}
let perfect=abs<=64+saved.eye*6,quality=perfect?"PERFECT":abs<=145+saved.eye*5?"GREAT":abs<=215+saved.eye*6?"GOOD":"TIP";
let jitter=(Math.sin(game.pitchCount*25.13+delta)*.5+.5)*24;
let distance=perfect?365+saved.bat*13+jitter:quality==="GREAT"?268+saved.bat*17+Math.max(0,(145-abs)*.42)+jitter:quality==="GOOD"?177+saved.bat*13+(215-abs)*.54+jitter:115+saved.bat*9+jitter;
distance=Math.round(distance);
let type=distance>=330?"HOME RUN":distance>=275?"TRIPLE":distance>=210?"DOUBLE":distance>=145?"SINGLE":"POP OUT";
let sector=delta< -64?0:delta>64?2:1;
game.swingAt=now;game.flight={start:now,duration:950,distance,sector,kind:type,perfect,quality};
if(type==="POP OUT"){game.streak=0;game.outs++;notify("POP FLY · OUT!","miss");sound(180,.14,"triangle");}
else{
game.hits++;game.streak++;game.bestStreak=Math.max(game.streak,game.bestStreak);
if(type==="HOME RUN"){game.homers++;if(game.mode==="play")saved.homers++;missionStep("hr")}
if(type==="DOUBLE"||type==="TRIPLE"||type==="HOME RUN")missionStep("xbh");
missionStep("hits");
if(perfect){game.perfects++;if(game.mode==="play")saved.perfects++;missionStep("perfect")}
let matched=type==="HOME RUN"&&sector===game.target,base=type==="HOME RUN"?100:type==="TRIPLE"?60:type==="DOUBLE"?35:15,combo=Math.min(3,1+Math.floor(game.streak/4));
let gain=(base+(perfect?25:0)+(matched?75:0))*combo;
game.score+=gain;
if(game.mode==="play")saved.coins+=type==="HOME RUN"?20:type==="TRIPLE"?12:type==="DOUBLE"?8:5;
if(game.mode==="play"&&perfect)saved.coins+=4;if(game.mode==="play"&&matched)saved.coins+=12;
if(type==="HOME RUN"){notify(matched?"🎯 TARGET SMASH! +"+gain:"💥 HOME RUN! +"+gain,"gold");celebrate(sector===0?105:sector===1?195:285,170);melody();vibrate([30,35,60])}
else {notify((perfect?"PERFECT! ":"")+type+" +"+gain,perfect?"gold":"good");sound(480,.19,"triangle");vibrate(18)}
}
game.strikes=0;game.phase="flight";$("cue").textContent=quality+" CONTACT · "+distance+" FT";store();updateHud();
}
function swing(){
if(game.mode!=="play"&&game.mode!=="practice")return;
if(game.phase!=="pitch"||!game.pitch)return;
const now=performance.now(),delta=now-(game.pitch.start+game.pitch.duration);
if(now<game.pitch.start-30){$("cue").textContent="WAIT FOR THE PITCH!";return}
sound(280,.08,"square",.04);hit(now,delta);
}
function update(now){
game.t=now;
if(game.mode!=="play"&&game.mode!=="practice")return;
if(game.finishAt&&now>=game.finishAt){game.finishAt=0;end();return}
if(game.phase==="rest"&&now>=game.restUntil&&!game.finishAt)pitch(now);
if(game.phase==="pitch"&&game.pitch){
const remain=game.pitch.start+game.pitch.duration-now;
if(remain< -255){strike("SWING & MISS!",now);return}
$("cue").textContent=remain>550?(game.pitch.kind==="CURVE"?"CURVEBALL!":"EYES ON THE BALL"):remain>240?"HERE IT COMES...":remain> -85?"⚾ SWING NOW!":"SWING!";
$("cue").className="cue"+(remain<245&&remain> -160?" hot":"");
}else $("cue").className="cue";
if(game.phase==="flight"&&game.flight&&now>=game.flight.start+game.flight.duration){resultRest(now)}
for(let i=game.particles.length-1;i>=0;i--){const p=game.particles[i];p.x+=p.vx;p.y+=p.vy;p.vy+=.13;p.life--;if(p.life<=0)game.particles.splice(i,1)}
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
const p=game.pitch,remain=p?(p.start+p.duration-now):9999,active=remain<280&&remain> -160;
ctx.save();ctx.strokeStyle=active?"#ffec67":"#f9fdf4a8";ctx.lineWidth=active?5:3;ctx.shadowBlur=active?24:10;ctx.shadowColor=active?"#ffd942":"#fff";ctx.beginPath();ctx.ellipse(197,437,29+(active?Math.sin(now/65)*2:0),15,0,0,Math.PI*2);ctx.stroke();ctx.restore();
}
function drawPitch(now){
const p=game.pitch;if(!p)return;
let progress=Math.max(0,Math.min(1,(now-p.start)/p.duration));if(now<p.start)return;
let e=progress*progress*(3-2*progress),x=195+Math.sin(progress*8)*p.curve*progress,y=284+(438-284)*e;
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
if(act==="play")start(false);else if(act==="practice")start(true);else if(act==="home")home();else if(act==="resume")resume();
else if(act==="bat"||act==="eye"){let cost=coinPrice(act);if(saved[act]<5&&saved.coins>=cost){saved.coins-=cost;saved[act]++;store();sound(800,.18,"triangle");if(game.mode==="over")end();else home();}}
});
canvas.addEventListener("pointerdown",e=>{e.preventDefault();swing()},{passive:false});
$("swing").addEventListener("pointerdown",e=>{e.preventDefault();swing()},{passive:false});
$("pause").addEventListener("click",()=>{if(game.mode==="play"||game.mode==="practice")pause()});
$("sound").addEventListener("click",()=>{saved.sound=!saved.sound;store();updateHud();if(saved.sound)sound(640,.12)});
document.addEventListener("keydown",e=>{if((e.code==="Space"||e.code==="Enter")&&(game.mode==="play"||game.mode==="practice")){e.preventDefault();swing()}if(e.code==="Escape"&&(game.mode==="play"||game.mode==="practice"))pause()});
document.addEventListener("visibilitychange",()=>{if(document.hidden&&(game.mode==="play"||game.mode==="practice"))pause()});
window.addEventListener("resize",resize);
resize();home();requestAnimationFrame(frame);
})();