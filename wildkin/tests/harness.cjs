const vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const Core=require('../core.js'),World=require('../world.js');
async function boot(options={}){
 const local=new Map(),vault=new Map(),elements=new Map(),errors=[],created=[];
 const faults={local:false,vault:false,delete:false,...options.faults};
 function element(id){if(!elements.has(id))elements.set(id,{innerHTML:'',textContent:'',checked:false,value:'',classList:{add(){},remove(){},toggle(){}},remove(){},appendChild(){},insertAdjacentHTML(pos,html){this.innerHTML+=html},click(){},focus(){},select(){}});return elements.get(id)}
 const document={getElementById:element,querySelector(){return null},documentElement:element('html'),body:element('body'),hidden:false,visibilityState:'visible',addEventListener(){},createElement(){const el=element('created'+Math.random());created.push(el);return el}};
 const localStorage={getItem:k=>local.get(k)||null,setItem(k,v){if(faults.local)throw Error('Quota');local.set(k,v)},removeItem(k){if(faults.local)throw Error('Blocked');local.delete(k)}};
 const db={objectStoreNames:{contains:()=>true},transaction(){const tx={objectStore(){return {put(v,k){queueMicrotask(()=>{if(faults.vault)tx.onerror?.();else{vault.set(k,v);tx.oncomplete?.()}})},delete(k){queueMicrotask(()=>{if(faults.delete)tx.onerror?.();else{vault.delete(k);tx.oncomplete?.()}})},get(k){const request={};queueMicrotask(()=>{request.result=vault.get(k);request.onsuccess?.()});return request}}}};return tx}};
 const indexedDB={open(){const request={result:db};queueMicrotask(()=>request.onsuccess?.());return request}};
 let random=Core.seeded(options.seed||123),clock=0;
 const math=Object.create(Math);math.random=()=>random();
 const navigator={onLine:!!options.online,...(options.serviceWorker?{serviceWorker:options.serviceWorker}:{})};
 const location={protocol:'http:',hostname:'localhost',origin:'http://localhost',href:'http://localhost/wildkin/',search:'',pathname:'/wildkin/',hash:'',reload(){location.reloaded=true},replace(){location.reloaded=true}};
 const context={document,localStorage,navigator,location,history:{replaceState(){}},console:{log(){},warn(){},error(...args){errors.push(args)}},WildkinCore:Core,WildkinWorld:World,WildkinAdventures:require('../adventures.js'),URL,URLSearchParams,Blob,Math:math,Date,JSON,Set,Map,Promise,Error,Number,String,Object,Array,performance:{now:()=>clock},btoa:s=>Buffer.from(s).toString('base64'),atob:s=>Buffer.from(s,'base64').toString(),confirm:()=>true,fetch:async()=>({ok:true,json:async()=>({version:'3.0.0-dev.4'})}),setTimeout(fn,ms){if(ms<2500)queueMicrotask(fn);return 1},clearTimeout(){},setInterval(){return 1},clearInterval(){}};
 context.window={__WILDKIN_TEST__:true,indexedDB,matchMedia:()=>({matches:true}),addEventListener(){},scrollTo(){}};
 vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(__dirname,'../game.js'),'utf8'),context,{filename:'game.js'});
 const api=context.window.WILDKIN_TEST_API;await api.ready;
 return {api,local,vault,created,faults,element,errors,context,random(fn){random=fn},clock(n){clock=n},fresh(starter=0){api.setState(api.newState(starter));return api.getState()}};
}
async function win(api,policy='tactical',limit=150){let turns=0;while(api.getBattle()&&turns++<limit){const b=api.getBattle();const move=policy==='strike'?'strike':b.intent==='heavy'?'guard':b.energy>=2?'burst':'strike';await api.actionAttack(move);}if(api.getBattle())throw Error('Battle did not resolve in '+limit+' turns');return {turns,won:api.getModal()?.win};}
module.exports={boot,win};
