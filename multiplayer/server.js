import {createServer} from 'node:http';
import {WebSocketServer,WebSocket} from 'ws';
import {randomInt,randomUUID} from 'node:crypto';

const PORT=Number(process.env.PORT||3000);
const rooms=new Map(), peers=new Map();
const COLORS=['#5eead4','#fb7185','#fbbf24','#a78bfa','#60a5fa','#f472b6','#4ade80','#ff9566'];
const safeColor=x=>Number.isInteger(x)&&x>=0&&x<COLORS.length?x:0;
const alphabet='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const code=()=>Array.from({length:6},()=>alphabet[randomInt(alphabet.length)]).join('');
const send=(ws,msg)=>{if(ws.readyState===WebSocket.OPEN)ws.send(JSON.stringify(msg))};
const safeName=x=>typeof x==='string'?x.trim().slice(0,24).replace(/[<>]/g,'')||'Player':'Player';
const broadcast=(room,msg)=>{for(const id of room.players.keys())send(room.players.get(id).ws,msg)};
const publicRoom=r=>({code:r.code,host:r.host,status:r.status,players:[...r.players].map(([id,p])=>({id,name:p.name,color:p.color,ready:p.ready,score:p.score,alive:p.alive})),settings:r.settings});
function leave(ws){
 const id=peers.get(ws);if(!id)return;peers.delete(ws);
 const room=[...rooms.values()].find(r=>r.players.has(id));if(!room)return;
 room.players.delete(id);if(room.players.size===0){rooms.delete(room.code);return}
 if(room.host===id)room.host=room.players.keys().next().value;
 if(room.status==='playing')room.status='lobby';
 broadcast(room,{type:'room',room:publicRoom(room)});
}
const http=createServer((req,res)=>{
 if(req.url==='/health'){res.writeHead(200,{'content-type':'application/json','cache-control':'no-store'});res.end(JSON.stringify({ok:true,rooms:rooms.size}));return}
 res.writeHead(404);res.end('Not found');
});
const wss=new WebSocketServer({server:http,maxPayload:2048,perMessageDeflate:false});
wss.on('connection',ws=>{
 const id=randomUUID(),limiter={window:Date.now(),count:0};
 peers.set(ws,id);send(ws,{type:'hello',id,protocol:1});
 ws.on('message',raw=>{
  const now=Date.now();if(now-limiter.window>1000){limiter.window=now;limiter.count=0}
  if(++limiter.count>30){ws.close(1008,'Rate limit');return}
  let msg;try{msg=JSON.parse(raw.toString())}catch{return}
  if(!msg||typeof msg!=='object'||typeof msg.type!=='string')return;
  let room=[...rooms.values()].find(r=>r.players.has(id));
  if(msg.type==='create'&&!room){
   let c;do{c=code()}while(rooms.has(c));
   room={code:c,host:id,status:'lobby',settings:{maxPlayers:8,ai:0},players:new Map([[id,{ws,name:safeName(msg.name),color:safeColor(msg.color),ready:false,score:0,alive:true}]])};
   rooms.set(c,room);send(ws,{type:'room',room:publicRoom(room)});return;
  }
  if(msg.type==='join'&&!room){
   const target=rooms.get(String(msg.code||'').toUpperCase().trim());
   if(!target||target.status!=='lobby'||target.players.size>=target.settings.maxPlayers){send(ws,{type:'error',message:'Room unavailable or full'});return}
   target.players.set(id,{ws,name:safeName(msg.name),ready:false,score:0,alive:true});
   broadcast(target,{type:'room',room:publicRoom(target)});return;
  }
  if(!room)return;
  if(msg.type==='leave'){leave(ws);return}
  if(msg.type==='profile'&&room.status==='lobby'){const p=room.players.get(id);p.name=safeName(msg.name);p.color=safeColor(msg.color);broadcast(room,{type:'room',room:publicRoom(room)});return}
  if(msg.type==='ready'&&room.status==='lobby'){room.players.get(id).ready=!!msg.ready;broadcast(room,{type:'room',room:publicRoom(room)});return}
  // No pause command exists for multiplayer; the future authoritative simulation runs continuously.
  if(msg.type==='start'&&room.host===id&&room.status==='lobby'&&room.players.size>=2&&[...room.players.values()].every(p=>p.ready)){
   room.status='playing';broadcast(room,{type:'room',room:publicRoom(room)});
   // Gameplay must not begin until authoritative simulation is implemented.
   room.status='lobby';broadcast(room,{type:'error',message:'Multiplayer gameplay is under development'});broadcast(room,{type:'room',room:publicRoom(room)});
  }
 });
 ws.on('close',()=>leave(ws));ws.on('error',()=>leave(ws));
});
setInterval(()=>{for(const [c,r] of rooms){if(r.players.size===0)rooms.delete(c)}},60000).unref();
http.listen(PORT,'0.0.0.0',()=>console.log('Coil Rush multiplayer lobby listening on '+PORT));
